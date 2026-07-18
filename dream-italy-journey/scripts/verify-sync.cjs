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

async function verify() {
  try {
    console.log("=".repeat(60));
    console.log("✅ Verifying MBBS Universities Sync");
    console.log("=".repeat(60));

    const privateKey = env.VITE_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n");
    
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: env.VITE_GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
        private_key: privateKey,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // Get University Pages sheet
    console.log("\n📥 Fetching University Pages sheet...");
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "University Pages!A:S",
    });

    const rows = response.data.values || [];
    console.log(`✅ Total rows in University Pages: ${rows.length - 1} (excluding header)`);

    // Count MBBS universities (isMbbs column is column S = index 18)
    const mbbsCount = rows.slice(1).filter(row => 
      row[18] && row[18].toString().toUpperCase() === "TRUE"
    ).length;

    console.log(`✅ MBBS universities in sheet: ${mbbsCount}`);

    // Show recent additions (last 5 rows)
    console.log("\n📋 Recently added universities (last 5):");
    const recentRows = rows.slice(-5);
    recentRows.forEach((row, i) => {
      const idx = rows.length - 5 + i + 1; // +1 for 1-based index
      console.log(`  ${idx}. ${row[3] || "N/A"} (${row[4] || "N/A"}) - MBBS: ${row[18] || "FALSE"}`);
    });

    // Check for duplicates
    const slugs = rows.slice(1).map(row => row[2]).filter(Boolean);
    const uniqueSlugs = new Set(slugs);
    const duplicates = slugs.length - uniqueSlugs.size;

    console.log(`\n🔍 Duplicate check:`);
    console.log(`   Total entries: ${slugs.length}`);
    console.log(`   Unique slugs: ${uniqueSlugs.size}`);
    if (duplicates > 0) {
      console.log(`   ⚠️  Found ${duplicates} duplicate slugs!`);
    } else {
      console.log(`   ✅ No duplicates found`);
    }

    console.log("\n" + "=".repeat(60));
    console.log("✅ Verification complete!");
    console.log("=".repeat(60));

  } catch (error) {
    console.error("\n❌ Error:", error.message);
    process.exit(1);
  }
}

verify();
