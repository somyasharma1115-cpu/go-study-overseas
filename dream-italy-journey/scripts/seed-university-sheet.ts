import { createRequire } from "node:module";

import { universityPages } from "@/data/countries";

const require = createRequire(import.meta.url);
const { google } = require("../../clustal_whatsapp/node_modules/googleapis");
const credentials = require("../../clustal_whatsapp/clustal-whatsapp-45d38d0d2f2d.json");

const SPREADSHEET_ID = "1PTAqCn8ghZQibVEi8hbXiVtk2GPw8b_bF2BQn1U7FZo";
const SHEET_NAME = "University Pages";
const HEADER_ROW = [
  "active",
  "countrySlug",
  "slug",
  "name",
  "countryName",
  "countryHeroImage",
  "menuNote",
  "heroTag",
  "program",
  "tag",
  "logo",
  "timelineJson",
  "requirementsJson",
  "scholarshipsJson",
  "costsJson",
  "highlightsJson",
  "faqsJson",
  "visualsJson",
  "isMbbs",
];

const rows = universityPages.map((page) => [
  "TRUE",
  page.countrySlug,
  page.slug,
  page.name,
  page.countryName,
  page.countryHeroImage,
  page.menuNote,
  page.heroTag,
  page.program,
  page.tag,
  page.logo,
  JSON.stringify(page.timeline),
  JSON.stringify(page.requirements),
  JSON.stringify(page.scholarships ?? []),
  JSON.stringify(page.costs),
  JSON.stringify(page.highlights),
  JSON.stringify(page.faqs),
  JSON.stringify(page.visuals),
  page.isMbbs ? "TRUE" : "FALSE",
]);

const ensureSheet = async (sheets: any) => {
  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId: SPREADSHEET_ID,
  });
  const existingSheet = spreadsheet.data.sheets?.find((sheet: any) => sheet.properties?.title === SHEET_NAME);

  if (existingSheet) {
    return;
  }

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [
        {
          addSheet: {
            properties: {
              title: SHEET_NAME,
            },
          },
        },
      ],
    },
  });
};

const main = async () => {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.sheets({ version: "v4", auth });

  await ensureSheet(sheets);

  await sheets.spreadsheets.values.clear({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A:Z`,
  });

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A1`,
    valueInputOption: "RAW",
    requestBody: {
      values: [HEADER_ROW, ...rows],
    },
  });

  console.log(`Seeded ${rows.length} university rows into "${SHEET_NAME}".`);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
