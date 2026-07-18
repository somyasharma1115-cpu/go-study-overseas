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

console.log("Testing MBBS sheet fetch...\n");
console.log("Client email:", env.VITE_GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL);

const privateKey = env.VITE_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n");
console.log("Private key format valid:", privateKey?.includes("BEGIN PRIVATE KEY"));

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
    
    console.log("\n📋 Headers (row 1):");
    console.log(rows[0]);

    console.log("\n📋 Sample data (rows 2-4):");
    for (let i = 1; i <= Math.min(3, rows.length - 1); i++) {
      console.log(`\nRow ${i + 1}:`, JSON.stringify(rows[i], null, 2));
    }

    // Save to file
    if (!fs.existsSync("tmp")) {
      fs.mkdirSync("tmp");
    }
    fs.writeFileSync("tmp/mbbs-raw-data.json", JSON.stringify(rows, null, 2));
    console.log("\n💾 Full data saved to tmp/mbbs-raw-data.json");
    
    // Also save parsed data
    const headers = rows[0];
    const universities = rows.slice(1)
      .filter((row) => row.some((cell) => cell && cell.toString().trim()))
      .map((row) => {
        const uni = {};
        headers.forEach((header, i) => {
          if (header && row[i] !== undefined) {
            uni[header.toString().trim()] = row[i].toString().trim();
          }
        });
        return uni;
      });
    
    fs.writeFileSync("tmp/mbbs-universities.json", JSON.stringify(universities, null, 2));
    console.log("💾 Parsed universities saved to tmp/mbbs-universities.json");
    console.log(`\n✅ Found ${universities.length} universities in MBBS sheet`);
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    if (error.response) {
      console.error("Response:", error.response.data);
    }
  }
}

test();
