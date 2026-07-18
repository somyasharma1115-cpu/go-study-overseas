import { google } from "googleapis";
import fs from "fs/promises";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

const SPREADSHEET_ID = "1PTAqCn8ghZQibVEi8hbXiVtk2GPw8b_bF2BQn1U7FZo";
const MBBS_SHEET = "MBBS";
const UNIVERSITY_SHEET = "University Pages";

async function getAuthClient() {
  const credentials = {
    client_email: process.env.VITE_GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
    private_key: process.env.VITE_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  };

  console.log("🔐 Authenticating with Google Sheets API...");
  console.log("   Client email:", credentials.client_email);

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return auth.getClient();
}

async function fetchMBBSData(authClient) {
  const sheets = google.sheets({ version: "v4", auth: authClient });

  console.log("\n📥 Fetching MBBS sheet data...");
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${MBBS_SHEET}!A:Z`,
  });

  const rows = response.data.values;
  if (!rows || rows.length === 0) {
    throw new Error("No data found in MBBS sheet");
  }

  const headers = rows[0].map((h) => h.toString().trim());
  console.log("📋 Headers found:", headers);
  console.log(`📊 Total rows (including header): ${rows.length}`);

  const universities = rows
    .slice(1)
    .filter((row) => row.some((cell) => cell && cell.toString().trim()))
    .map((row) => {
      const uni = {};
      headers.forEach((header, i) => {
        if (header && row[i] !== undefined) {
          uni[header] = row[i].toString().trim();
        }
      });
      return uni;
    });

  console.log(`✅ Found ${universities.length} universities in MBBS sheet\n`);
  return { universities, headers };
}

function transformToUniversityFormat(mbbsUnis, mbbsHeaders) {
  // Dynamically map based on headers
  return mbbsUnis.map((uni) => {
    // Create slug from name if not present
    const name = uni.name || uni.Name || uni.NAME || "";
    const slug = (uni.slug || uni.Slug || "").toLowerCase().replace(/\s+/g, "-") || 
                 name.toLowerCase().replace(/\s+/g, "-");

    return [
      uni.active || uni.Active || "TRUE",
      uni.countrySlug || uni.CountrySlug || "italy",
      slug,
      name,
      uni.countryName || uni.CountryName || "Italy",
      uni.countryHeroImage || uni.CountryHeroImage || "",
      uni.menuNote || uni.MenuNote || "",
      uni.heroTag || uni.HeroTag || "",
      uni.program || uni.Program || "MBBS",
      uni.tag || uni.Tag || "",
      uni.logo || uni.Logo || "",
      uni.timelineJson || uni.TimelineJson || "[]",
      uni.requirementsJson || uni.RequirementsJson || "[]",
      uni.scholarshipsJson || uni.ScholarshipsJson || "[]",
      uni.costsJson || uni.CostsJson || "[]",
      uni.highlightsJson || uni.HighlightsJson || "[]",
      uni.faqsJson || uni.FaqsJson || "[]",
      uni.visualsJson || uni.VisualsJson || "{}",
      "TRUE", // isMbbs
    ];
  });
}

async function appendToUniversitySheet(authClient, rows) {
  const sheets = google.sheets({ version: "v4", auth: authClient });

  console.log("📤 Appending data to University Pages sheet...");

  // Get existing headers
  const headerResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${UNIVERSITY_SHEET}!A1:S1`,
  });

  const existingHeaders = headerResponse.data.values?.[0] || [];
  console.log("📋 University sheet headers:", existingHeaders);

  // Append rows
  const response = await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${UNIVERSITY_SHEET}!A:S`,
    valueInputOption: "RAW",
    requestBody: {
      values: rows,
    },
  });

  console.log(`✅ Appended ${rows.length} rows to University Pages sheet`);
  return response.data;
}

async function main() {
  try {
    console.log("=".repeat(60));
    console.log("🚀 MBBS Universities Sync Script");
    console.log("=".repeat(60));

    const authClient = await getAuthClient();

    // Step 1: Fetch MBBS data
    const { universities, headers } = await fetchMBBSData(authClient);

    // Save raw data
    await fs.mkdir("tmp", { recursive: true });
    await fs.writeFile("tmp/mbbs-raw.json", JSON.stringify(universities, null, 2));
    console.log("💾 Saved raw data to tmp/mbbs-raw.json");

    // Step 2: Transform data
    console.log("\n🔄 Transforming data to University Pages format...");
    const transformedRows = transformToUniversityFormat(universities, headers);

    // Save transformed data
    await fs.writeFile("tmp/mbbs-transformed.json", JSON.stringify(transformedRows, null, 2));
    console.log("💾 Saved transformed data to tmp/mbbs-transformed.json");

    // Step 3: Show preview
    console.log("\n👀 Preview of first 3 universities to be added:");
    transformedRows.slice(0, 3).forEach((row, i) => {
      console.log(`\n  [${i + 1}] ${row[3]} (slug: ${row[2]})`);
    });

    // Step 4: Confirm and append
    console.log("\n" + "=".repeat(60));
    console.log(`⚠️  About to add ${transformedRows.length} universities to University Pages sheet`);
    console.log("=".repeat(60));

    if (!process.argv.includes("--confirm")) {
      console.log("\nReview the data in:");
      console.log("  - tmp/mbbs-raw.json");
      console.log("  - tmp/mbbs-transformed.json");
      console.log("\nThen run with --confirm flag to proceed:");
      console.log("  node scripts/sync-mbbs-simple.mjs --confirm\n");
      return;
    }

    console.log("\n✅ Confirmed! Proceeding with update...");
    await appendToUniversitySheet(authClient, transformedRows);

    console.log("\n" + "=".repeat(60));
    console.log("✅ Sync complete!");
    console.log(`   Added ${transformedRows.length} universities from MBBS sheet`);
    console.log("=".repeat(60));
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    if (error.response) {
      console.error("   Details:", error.response.data);
    }
    process.exit(1);
  }
}

main();
