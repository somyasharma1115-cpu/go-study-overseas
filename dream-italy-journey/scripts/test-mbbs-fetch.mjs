import { google } from "googleapis";
import * as dotenv from "dotenv";
import { readFileSync } from "fs";

// Load .env.local
const envContent = readFileSync(".env.local", "utf8");
const env = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
  }
});

console.log("Testing MBBS sheet fetch...\n");
console.log("Client email:", env.VITE_GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL);

const privateKey = env.VITE_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n");
console.log("Private key starts with:", privateKey?.substring(0, 50) + "...");

const SPREADSHEET_ID = "1PTAqCn8ghZQibVEi8hbXiVtk2GPw8b_bF2BQn1U7FZo";

async function test() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: env.VITE_GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
        private_key: privateKey,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    console.log("\n📥 Fetching MBBS sheet...");
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: "MBBS!A:Z",
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      console.log("❌ No data found in MBBS sheet");
      return;
    }

    console.log("✅ Successfully fetched MBBS sheet!");
    console.log("📊 Total rows (including header):", rows.length);
    console.log("\n📋 Headers (first row):");
    console.log(rows[0]);

    console.log("\n📋 Sample data (first 3 data rows):");
    for (let i = 1; i <= Math.min(3, rows.length - 1); i++) {
      console.log(`\nRow ${i + 1}:`, rows[i]);
    }

    // Save to file for inspection
    const { writeFileSync } = await import("fs");
    writeFileSync("tmp/mbbs-test.json", JSON.stringify(rows, null, 2));
    console.log("\n💾 Full data saved to tmp/mbbs-test.json");
  } catch (error) {
    console.error("❌ Error:", error.message);
    if (error.response) {
      console.error("Response:", error.response.data);
    }
  }
}

test();
