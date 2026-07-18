import path from "path";
import { fileURLToPath } from "url";

import { fetchAccessToken, loadDotEnv, WRITE_SHEETS_SCOPE } from "./sheet-utils.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const ENV_PATH = path.join(ROOT_DIR, ".env.local");
const DEFAULT_SHEET_NAME = "Events";
const HEADER_ROW = ["Event #", "Active", "Category", "Title", "Date", "Time", "Location", "Description", "Image", "CTA"];
const SAMPLE_ROW = [
  "1",
  "TRUE",
  "Live",
  "Italy Application Sprint",
  "18 May 2026",
  "2:00 PM - 3:30 PM",
  "Live on Zoom",
  "A fast-paced live session covering documents, deadlines, and how to shortlist the best Italian universities.",
  "",
  "Join live",
];

const googleSheetsRequest = async ({ spreadsheetId, accessToken, path: requestPath, method = "GET", body }) => {
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}${requestPath}`, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google Sheets request failed with ${response.status}: ${errorText}`);
  }

  return response.json();
};

const main = async () => {
  await loadDotEnv(ENV_PATH);

  const spreadsheetId = process.env.VITE_UNIVERSITY_SHEET_SPREADSHEET_ID;
  if (!spreadsheetId) {
    throw new Error("Missing VITE_UNIVERSITY_SHEET_SPREADSHEET_ID");
  }

  const sheetName = process.env.VITE_EVENT_SHEET_NAME || DEFAULT_SHEET_NAME;
  const accessToken = await fetchAccessToken(WRITE_SHEETS_SCOPE);
  const spreadsheet = await googleSheetsRequest({
    spreadsheetId,
    accessToken,
    path: "?fields=sheets.properties.title",
  });

  const existingSheet = spreadsheet.sheets?.find((sheet) => sheet.properties?.title === sheetName);
  if (!existingSheet) {
    await googleSheetsRequest({
      spreadsheetId,
      accessToken,
      method: "POST",
      path: ":batchUpdate",
      body: {
        requests: [
          {
            addSheet: {
              properties: {
                title: sheetName,
              },
            },
          },
        ],
      },
    });
  }

  await googleSheetsRequest({
    spreadsheetId,
    accessToken,
    method: "PUT",
    path: `/values/${encodeURIComponent(`${sheetName}!A1:J2`)}?valueInputOption=RAW`,
    body: {
      values: [HEADER_ROW, SAMPLE_ROW],
    },
  });

  console.log(`${existingSheet ? "Updated" : "Created"} "${sheetName}" sheet with event headers and one sample row.`);
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
