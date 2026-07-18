const { google } = require("googleapis");
const fs = require("fs");

// Read .env.local
const envContent = fs.readFileSync(".env.local", "utf8");
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

async function main() {
  try {
    console.log("=".repeat(60));
    console.log("🚀 MBBS Universities Sync - Complete Script");
    console.log("=".repeat(60));

    // Step 1: Authenticate
    console.log("\n🔐 Authenticating...");
    const privateKey = env.VITE_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n");
    
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: env.VITE_GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
        private_key: privateKey,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    console.log("✅ Authenticated successfully\n");

    // Step 2: Fetch MBBS sheet
    console.log("📥 Fetching MBBS sheet...");
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${MBBS_SHEET}!A:Z`,
    });

    const rows = response.data.values;
    if (!rows || rows.length < 3) {
      throw new Error("No data found in MBBS sheet");
    }

    console.log(`✅ Fetched ${rows.length} rows from MBBS sheet`);

    // Step 3: Parse MBBS data (headers are in row 2, data starts from row 3)
    const headers = rows[1]; // Row 2 (index 1) has headers
    console.log("📋 MBBS Headers:", headers);

    const mbbsUniversities = rows.slice(2) // Start from row 3 (index 2)
      .filter((row) => row[2] && row[2].toString().trim()) // Filter rows with university name
      .map((row) => {
        return {
          country: row[1]?.toString().trim() || "",
          name: row[2]?.toString().trim().replace(/^\d+\)\s*/, ""), // Remove "1)" prefix
          course: row[3]?.toString().trim() || "MBBS",
        };
      });

    console.log(`✅ Parsed ${mbbsUniversities.length} universities from MBBS sheet\n`);

    // Step 4: Transform to University Pages format
    console.log("🔄 Transforming data to University Pages format...");
    
    const countrySlugMap = {
      "Russia": "russia",
      "Italy": "italy",
      "Georgia": "georgia",
      "Kyrgyzstan": "kyrgyzstan",
      "Kazakhstan": "kazakhstan",
      "Philippines": "philippines",
      "Europe": "europe",
    };

    const transformedRows = mbbsUniversities.map((uni) => {
      const countrySlug = countrySlugMap[uni.country] || uni.country.toLowerCase().replace(/\s+/g, "-");
      const slug = uni.name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "") // Remove special chars
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-"); // Remove multiple hyphens

      return [
        "TRUE", // active
        countrySlug, // countrySlug
        slug, // slug
        uni.name, // name
        uni.country, // countryName
        "", // countryHeroImage
        "", // menuNote
        "Top Medical University", // heroTag
        uni.course, // program
        "MBBS Abroad", // tag
        "", // logo
        "[]", // timelineJson
        "[]", // requirementsJson
        "[]", // scholarshipsJson
        "[]", // costsJson
        "[]", // highlightsJson
        "[]", // faqsJson
        "{}", // visualsJson
        "TRUE", // isMbbs
      ];
    });

    console.log(`✅ Transformed ${transformedRows.length} universities\n`);

    // Save transformed data
    if (!fs.existsSync("tmp")) {
      fs.mkdirSync("tmp");
    }
    fs.writeFileSync("tmp/mbbs-transformed.json", JSON.stringify(transformedRows, null, 2));
    console.log("💾 Saved transformed data to tmp/mbbs-transformed.json");

    // Step 5: Show preview
    console.log("\n👀 Preview of first 5 universities to be added:");
    transformedRows.slice(0, 5).forEach((row, i) => {
      console.log(`  ${i + 1}. ${row[3]} (${row[4]}) - slug: ${row[2]}`);
    });

    // Step 6: Confirm and append
    console.log("\n" + "=".repeat(60));
    console.log(`⚠️  About to add ${transformedRows.length} universities to "${UNIVERSITY_SHEET}" sheet`);
    console.log("=".repeat(60));

    if (!process.argv.includes("--confirm")) {
      console.log("\nReview the data in tmp/mbbs-transformed.json");
      console.log("\nThen run with --confirm flag to proceed:");
      console.log("  node scripts/sync-mbbs-complete.cjs --confirm\n");
      return;
    }

    console.log("\n✅ Confirmed! Appending data to University Pages sheet...");

    const appendResponse = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${UNIVERSITY_SHEET}!A:S`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: transformedRows,
      },
    });

    console.log("\n" + "=".repeat(60));
    console.log("✅ Sync complete!");
    console.log(`   Added ${transformedRows.length} universities from MBBS sheet`);
    console.log(`   Updated rows: ${appendResponse.data.updates?.updatedRows || transformedRows.length}`);
    console.log("=".repeat(60));

  } catch (error) {
    console.error("\n❌ Error:", error.message);
    if (error.response?.data) {
      console.error("   Details:", JSON.stringify(error.response.data, null, 2));
    }
    process.exit(1);
  }
}

main();
