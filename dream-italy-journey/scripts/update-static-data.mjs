import { google } from "googleapis";
import fs from "fs/promises";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const SPREADSHEET_ID = "1PTAqCn8ghZQibVEi8hbXiVtk2GPw8b_bF2BQn1U7FZo";
const UNIVERSITY_SHEET = "University Pages";

async function fetchSheetData() {
  const privateKey = process.env.VITE_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n");
  
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.VITE_GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
      private_key: privateKey,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  console.log("📥 Fetching University Pages sheet...");
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${UNIVERSITY_SHEET}!A:S`,
  });

  const rows = response.data.values;
  if (!rows || rows.length === 0) {
    throw new Error("No data found in University Pages sheet");
  }

  const headers = rows[0].map((h) => h.toString().trim().toLowerCase().replace(/\s+/g, ""));
  console.log("📋 Headers:", headers);

  const universities = rows.slice(1)
    .filter((row) => row[3] && row[3].toString().trim()) // Filter rows with name
    .map((row) => {
      const uni = {};
      headers.forEach((header, i) => {
        if (header && row[i] !== undefined) {
          uni[header] = row[i].toString().trim();
        }
      });
      return uni;
    });

  console.log(`✅ Fetched ${universities.length} universities from sheet`);
  return universities;
}

function transformToCountryFormat(universities) {
  // Group by country
  const byCountry = {};
  universities.forEach((uni) => {
    const countrySlug = uni.countryslug || "unknown";
    if (!byCountry[countrySlug]) {
      byCountry[countrySlug] = [];
    }
    byCountry[countrySlug].push({
      name: uni.name,
      slug: uni.slug,
      program: uni.program || "MBBS",
      tag: uni.tag || "",
      logo: uni.logo || "",
    });
  });

  return byCountry;
}

async function updateStaticFiles(universities) {
  console.log("\n🔄 Updating static data files...");

  // Read existing countries.ts to preserve structure
  const countriesTs = await fs.readFile("src/data/countries.ts", "utf8");
  
  // This is a simplified version - in reality, you'd need to properly parse and update
  console.log("⚠️  Static file update requires manual intervention or a more complex script");
  console.log("   The countries.ts file has a specific structure that needs careful updating");
  
  // Save universities as JSON for now
  const universitiesData = universities.map((uni) => ({
    countrySlug: uni.countryslug,
    slug: uni.slug,
    name: uni.name,
    countryName: uni.countryname,
    program: uni.program,
    tag: uni.tag,
    logo: uni.logo,
    isMbbs: uni.ismbbs === "TRUE",
    active: uni.active === "TRUE",
  }));

  await fs.writeFile("tmp/universities-from-sheet.json", JSON.stringify(universitiesData, null, 2));
  console.log("💾 Saved universities data to tmp/universities-from-sheet.json");
  console.log("   You can use this to manually update src/data/countries.ts");
}

async function main() {
  try {
    console.log("=".repeat(60));
    console.log("🚀 Update Static Data from Google Sheets");
    console.log("=".repeat(60));

    const universities = await fetchSheetData();
    await updateStaticFiles(universities);

    console.log("\n" + "=".repeat(60));
    console.log("✅ Data fetched successfully!");
    console.log("=".repeat(60));
    console.log("\n⚠️  Next steps:");
    console.log("1. Review tmp/universities-from-sheet.json");
    console.log("2. Update src/data/countries.ts manually OR");
    console.log("3. I can help you modify UniversityDataContext to fetch at runtime");
    console.log("4. Redeploy the app\n");

  } catch (error) {
    console.error("\n❌ Error:", error.message);
    process.exit(1);
  }
}

main();
