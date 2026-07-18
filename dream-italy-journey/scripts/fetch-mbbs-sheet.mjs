import { google } from "googleapis";
import fs from "fs/promises";
import path from "path";

// Load credentials from environment or file
const credentials = JSON.parse(
  process.env.GOOGLE_CREDENTIALS ||
    '{"client_email":"clustal-whatsapp-sheets-db@clustal-whatsapp.iam.gserviceaccount.com","private_key":"' +
      process.env.VITE_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\n/g, "\\n") +
      '"}'
);

const SPREADSHEET_ID = "1PTAqCn8ghZQibVEi8hbXiVtk2GPw8b_bF2BQn1U7FZo";
const MBBS_SHEET_NAME = "MBBS";

async function fetchMBBSTable() {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });
  
  const sheets = google.sheets({ version: "v4", auth });
  
  console.log(`Fetching data from sheet: ${MBBS_SHEET_NAME}`);
  
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${MBBS_SHEET_NAME}!A:Z`,
  });
  
  const rows = response.data.values;
  
  if (!rows || rows.length === 0) {
    console.log("No data found in MBBS sheet");
    return [];
  }
  
  const headers = rows[0].map((h) => h.toString().trim().toLowerCase().replace(/\s+/g, ""));
  console.log("Headers:", headers);
  
  const universities = rows.slice(1)
    .filter(row => row.some(cell => cell && cell.toString().trim()))
    .map((row, index) => {
      const uni = {};
      headers.forEach((header, i) => {
        if (header && row[i] !== undefined) {
          uni[header] = row[i].toString().trim();
        }
      });
      uni._rowIndex = index + 2; // +2 because we start from row 2 (after header)
      return uni;
    });
  
  console.log(`Found ${universities.length} universities in MBBS sheet`);
  return universities;
}

async function main() {
  try {
    const universities = await fetchMBBSTable();
    
    // Save to JSON file for review
    const outputPath = path.join(process.cwd(), "tmp", "mbbs-universities.json");
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, JSON.stringify(universities, null, 2));
    
    console.log(`\nSaved ${universities.length} MBBS universities to: ${outputPath}`);
    console.log("\nFirst university sample:");
    if (universities.length > 0) {
      console.log(JSON.stringify(universities[0], null, 2));
    }
    
  } catch (error) {
    console.error("Error fetching MBBS sheet:", error);
    process.exit(1);
  }
}

main();
