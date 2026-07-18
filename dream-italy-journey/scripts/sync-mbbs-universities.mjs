import { google } from "googleapis";
import fs from "fs/promises";
import { execSync } from "child_process";

// Read .env.local manually
const envContent = await fs.readFile(".env.local", "utf8");
const env = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
  }
});

const SPREADSHEET_ID = "1PTAqCn8ghZQibVEi8hbXiVtk2GPw8b_bF2BQn1U7FZo";
const MBBS_SHEET = "MBBS";
const UNIVERSITY_SHEET = "University Pages";

async function getAuthClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: env.VITE_GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
      private_key: env.VITE_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  
  return auth.getClient();
}

async function fetchMBBSData(authClient) {
  const sheets = google.sheets({ version: "v4", auth: authClient });
  
  console.log("📥 Fetching MBBS sheet data...");
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${MBBS_SHEET}!A:Z`,
  });
  
  const rows = response.data.values;
  if (!rows || rows.length === 0) {
    throw new Error("No data found in MBBS sheet");
  }
  
  const headers = rows[0].map((h) => h.toString().trim());
  console.log("📋 Headers:", headers);
  
  const universities = rows.slice(1)
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
  
  console.log(`✅ Found ${universities.length} universities in MBBS sheet`);
  return universities;
}

function transformToUniversityFormat(mbbsUnis) {
  return mbbsUnis.map((uni) => {
    // Map MBBS sheet columns to University Pages format
    // Adjust these mappings based on the actual column names in MBBS sheet
    return [
      uni.active || "TRUE",
      uni.countrySlug || "italy", // Default to italy, adjust as needed
      uni.slug || uni.name?.toLowerCase().replace(/\s+/g, "-") || "",
      uni.name || "",
      uni.countryName || "Italy",
      uni.countryHeroImage || "",
      uni.menuNote || "",
      uni.heroTag || "",
      uni.program || "MBBS",
      uni.tag || "",
      uni.logo || "",
      uni.timelineJson || "[]",
      uni.requirementsJson || "[]",
      uni.scholarshipsJson || "[]",
      uni.costsJson || "[]",
      uni.highlightsJson || "[]",
      uni.faqsJson || "[]",
      uni.visualsJson || "{}",
      "TRUE", // isMbbs = TRUE for MBBS sheet entries
    ];
  });
}

async function appendToUniversitySheet(authClient, rows) {
  const sheets = google.sheets({ version: "v4", auth: authClient });
  
  console.log("📤 Appending data to University Pages sheet...");
  
  // First, get the headers from University Pages sheet
  const headerResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${UNIVERSITY_SHEET}!A1:S1`,
  });
  
  const existingHeaders = headerResponse.data.values?.[0] || [];
  console.log("📋 University sheet headers:", existingHeaders);
  
  // Append the rows
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
    console.log("🚀 Starting MBBS universities sync...\n");
    
    const authClient = await getAuthClient();
    
    // Step 1: Fetch MBBS data
    const mbbsUniversities = await fetchMBBSData(authClient);
    
    // Save raw data for inspection
    await fs.mkdir("tmp", { recursive: true });
    await fs.writeFile("tmp/mbbs-raw.json", JSON.stringify(mbbsUniversities, null, 2));
    console.log("💾 Saved raw data to tmp/mbbs-raw.json\n");
    
    // Step 2: Transform data
    console.log("🔄 Transforming data to University Pages format...");
    const transformedRows = transformToUniversityFormat(mbbsUniversities);
    
    // Save transformed data for inspection
    await fs.writeFile("tmp/mbbs-transformed.json", JSON.stringify(transformedRows, null, 2));
    console.log("💾 Saved transformed data to tmp/mbbs-transformed.json\n");
    
    // Step 3: Show preview
    console.log("👀 Preview of first university to be added:");
    console.log(JSON.stringify(transformedRows[0], null, 2));
    console.log("");
    
    // Step 4: Append to University Pages sheet
    const confirm = process.env.AUTO_CONFIRM || false;
    if (!confirm) {
      console.log("⚠️  Review the data in tmp/mbbs-transformed.json");
      console.log("   Set AUTO_CONFIRM=true to automatically append, or run:");
      console.log("   node scripts/sync-mbbs-universities.mjs --confirm\n");
      
      // Wait for user confirmation
      console.log("Press Ctrl+C to cancel, or wait 10 seconds to continue automatically...");
      await new Promise((resolve) => setTimeout(resolve, 10000));
    }
    
    await appendToUniversitySheet(authClient, transformedRows);
    
    console.log("\n✅ Sync complete!");
    console.log(`   Added ${transformedRows.length} universities from MBBS sheet`);
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

// Check for --confirm flag
if (process.argv.includes("--confirm")) {
  process.env.AUTO_CONFIRM = "true";
}

main();
