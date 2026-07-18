import fetch from "node-fetch";
import fs from "fs/promises";
import path from "path";

const SPREADSHEET_ID = "1PTAqCn8ghZQibVEi8hbXiVtk2GPw8b_bF2BQn1U7FZo";
const MBBS_SHEET_NAME = "MBBS";
const API_KEY = process.env.VITE_GOOGLE_API_KEY || "YOUR_API_KEY"; // We'll need to get this

async function fetchMBBSTable() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${MBBS_SHEET_NAME}!A:Z?key=${API_KEY}`;
  
  console.log(`Fetching data from sheet: ${MBBS_SHEET_NAME}`);
  console.log("URL (without key):", url.replace(API_KEY, "HIDDEN"));
  
  const response = await fetch(url);
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`HTTP ${response.status}: ${error}`);
  }
  
  const data = await response.json();
  const rows = data.values;
  
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
      uni._rowIndex = index + 2;
      return uni;
    });
  
  console.log(`Found ${universities.length} universities in MBBS sheet`);
  return universities;
}

async function main() {
  try {
    // Try without API key first (public sheet)
    const universities = await fetchMBBSTable();
    
    // Save to JSON file for review
    const outputPath = path.join(process.cwd(), "tmp", "mbbs-universities.json");
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, JSON.stringify(universities, null, 2));
    
    console.log(`\nSaved ${universities.length} MBBS universities to: ${outputPath}`);
    
    if (universities.length > 0) {
      console.log("\nFirst university sample:");
      console.log(JSON.stringify(universities[0], null, 2));
    }
    
  } catch (error) {
    console.error("Error fetching MBBS sheet:", error.message);
    console.log("\nThe sheet might be private. We need to either:");
    console.log("1. Make the sheet public (or at least readable by anyone with the link)");
    console.log("2. Use a service account with proper authentication");
    console.log("3. Export the sheet as CSV and process it locally");
    process.exit(1);
  }
}

main();
