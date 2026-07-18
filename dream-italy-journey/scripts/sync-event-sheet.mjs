import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import {
  fetchAccessToken,
  fetchSheetValues,
  loadDotEnv,
  normalizeHeader,
  READONLY_SHEETS_SCOPE,
  slugify,
} from "./sheet-utils.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const ENV_PATH = path.join(ROOT_DIR, ".env.local");
const OUT_PATH = path.resolve(ROOT_DIR, process.env.EVENT_SYNC_OUTPUT_PATH || path.join("public", "data", "events.json"));
const DEFAULT_SHEET_NAME = "Events";
const EVENT_CATEGORIES = ["Live", "Admission Day", "University Fair", "Webinar"];

const parseEventNumber = (value) => {
  const number = Number.parseInt(String(value ?? "").trim(), 10);
  return Number.isFinite(number) ? number : undefined;
};

const parseCategory = (value) => {
  const normalizedValue = String(value ?? "").trim().toLowerCase();
  return EVENT_CATEGORIES.find((category) => category.toLowerCase() === normalizedValue) ?? "Live";
};

const isInactive = (value) => {
  const normalizedValue = String(value ?? "").trim().toLowerCase();
  return ["false", "no", "0", "inactive", "hidden"].includes(normalizedValue);
};

const main = async () => {
  await loadDotEnv(ENV_PATH);

  const spreadsheetId = process.env.VITE_UNIVERSITY_SHEET_SPREADSHEET_ID;
  if (!spreadsheetId) {
    throw new Error("Missing VITE_UNIVERSITY_SHEET_SPREADSHEET_ID");
  }

  const accessToken = await fetchAccessToken(READONLY_SHEETS_SCOPE);
  const sheetName = process.env.VITE_EVENT_SHEET_NAME || DEFAULT_SHEET_NAME;
  const rows = await fetchSheetValues({
    spreadsheetId,
    accessToken,
    range: `${sheetName}!A:J`,
  });

  if (rows.length <= 1) {
    await fs.mkdir(path.dirname(OUT_PATH), { recursive: true });
    await fs.writeFile(OUT_PATH, "[]\n", "utf8");
    console.log(`Wrote empty event cache to ${path.relative(ROOT_DIR, OUT_PATH)}`);
    return;
  }

  const headers = rows[0].map((value) => normalizeHeader(value));
  const entries = rows
    .slice(1)
    .map((row, index) => {
      const record = {};
      headers.forEach((header, headerIndex) => {
        if (!header) return;
        record[header] = String(row[headerIndex] ?? "");
      });

      if (isInactive(record.active)) {
        return null;
      }

      const title = String(record.title ?? "").trim();
      const date = String(record.date ?? "").trim();
      const time = String(record.time ?? "").trim();
      const location = String(record.location ?? "").trim();
      const description = String(record.description ?? "").trim();

      if (!title || !date || !time || !location || !description) {
        return null;
      }

      const eventNumber = parseEventNumber(record.event);
      const fallbackSlug = slugify(title) || `event-${index + 1}`;
      const id = eventNumber ? `event-${eventNumber}-${fallbackSlug}` : fallbackSlug;

      return {
        id,
        eventNumber,
        category: parseCategory(record.category),
        title,
        date,
        time,
        location,
        description,
        image: String(record.image ?? record.imageurl ?? "").trim() || undefined,
        cta: String(record.cta ?? "").trim() || "Register now",
      };
    })
    .filter(Boolean)
    .sort((left, right) => (left.eventNumber ?? Number.POSITIVE_INFINITY) - (right.eventNumber ?? Number.POSITIVE_INFINITY));

  await fs.mkdir(path.dirname(OUT_PATH), { recursive: true });
  await fs.writeFile(OUT_PATH, `${JSON.stringify(entries, null, 2)}\n`, "utf8");
  console.log(`Wrote ${entries.length} event entries to ${path.relative(ROOT_DIR, OUT_PATH)}`);
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
