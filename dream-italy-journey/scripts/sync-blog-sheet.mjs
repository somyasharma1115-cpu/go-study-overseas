import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const ENV_PATH = path.join(ROOT_DIR, ".env.local");
const OUT_PATH = path.resolve(ROOT_DIR, process.env.BLOG_SYNC_OUTPUT_PATH || path.join("public", "data", "blogs.json"));

const TOKEN_AUDIENCE = "https://oauth2.googleapis.com/token";
const SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets.readonly";
const DEFAULT_SHEET_NAME = "Blogs";

const loadDotEnv = async (filePath) => {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
        continue;
      }

      const index = trimmed.indexOf("=");
      const key = trimmed.slice(0, index);
      let value = trimmed.slice(index + 1);

      if (value.length >= 2 && ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'")))) {
        value = value.slice(1, -1);
      }

      if (!(key in process.env)) {
        process.env[key] = value;
      }
    }
  } catch {
    // Ignore missing env files so the script can still run in CI or via explicit env vars.
  }
};

const base64UrlEncode = (input) => {
  const bytes = typeof input === "string" ? Buffer.from(input, "utf8") : Buffer.from(input);
  return bytes.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
};

const slugify = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeHeader = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");

const parseBlogNumber = (value) => {
  const number = Number.parseInt(String(value ?? "").trim(), 10);
  return Number.isFinite(number) ? number : undefined;
};

const normalizePrivateKey = (privateKey) => privateKey.replace(/\\n/g, "\n");

const pemToArrayBuffer = (pem) => {
  const base64 = pem.replace(/-----BEGIN PRIVATE KEY-----/, "").replace(/-----END PRIVATE KEY-----/, "").replace(/\s+/g, "");
  return Buffer.from(base64, "base64");
};

const importPrivateKey = async (privateKey) =>
  crypto.webcrypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(normalizePrivateKey(privateKey)),
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    },
    false,
    ["sign"],
  );

const buildJwt = async (clientEmail, privateKey) => {
  const header = base64UrlEncode(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const nowInSeconds = Math.floor(Date.now() / 1000);
  const payload = base64UrlEncode(
    JSON.stringify({
      iss: clientEmail,
      scope: SHEETS_SCOPE,
      aud: TOKEN_AUDIENCE,
      exp: nowInSeconds + 3600,
      iat: nowInSeconds,
    }),
  );
  const unsignedToken = `${header}.${payload}`;
  const signingKey = await importPrivateKey(privateKey);
  const signature = await crypto.webcrypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    signingKey,
    new TextEncoder().encode(unsignedToken),
  );

  return `${unsignedToken}.${base64UrlEncode(new Uint8Array(signature))}`;
};

const fetchAccessToken = async () => {
  const clientEmail = process.env.VITE_GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL;
  const privateKey = process.env.VITE_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    throw new Error("Missing VITE_GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL or VITE_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY");
  }

  const assertion = await buildJwt(clientEmail, privateKey);
  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion,
  });

  const response = await fetch(TOKEN_AUDIENCE, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    throw new Error(`Google token request failed with ${response.status}`);
  }

  const payload = await response.json();
  if (!payload?.access_token) {
    throw new Error("Google token response did not include an access token");
  }

  return payload.access_token;
};

const fetchSheetValues = async ({ spreadsheetId, range }) => {
  const accessToken = await fetchAccessToken();
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Google Sheets request failed with ${response.status}`);
  }

  const payload = await response.json();
  return payload.values ?? [];
};

const main = async () => {
  await loadDotEnv(ENV_PATH);

  const spreadsheetId = process.env.VITE_UNIVERSITY_SHEET_SPREADSHEET_ID;
  if (!spreadsheetId) {
    throw new Error("Missing VITE_UNIVERSITY_SHEET_SPREADSHEET_ID");
  }

  const sheetName = process.env.VITE_BLOG_SHEET_NAME || DEFAULT_SHEET_NAME;
  const rows = await fetchSheetValues({
    spreadsheetId,
    range: `${sheetName}!A:C`,
  });

  if (rows.length <= 1) {
    await fs.mkdir(path.dirname(OUT_PATH), { recursive: true });
    await fs.writeFile(OUT_PATH, "[]\n", "utf8");
    console.log(`Wrote empty blog cache to ${path.relative(ROOT_DIR, OUT_PATH)}`);
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

      const headline = String(record.headline ?? "").trim();
      const content = String(record.content ?? "").trim();

      if (!headline || !content) {
        return null;
      }

      const blogNumber = parseBlogNumber(record.blog);
      const fallbackSlug = slugify(headline) || `entry-${index + 1}`;
      const slug = blogNumber ? `blog-${blogNumber}-${fallbackSlug}` : fallbackSlug;

      return {
        id: slug,
        slug,
        href: `/blog/${slug}`,
        blogNumber,
        headline,
        content,
      };
    })
    .filter(Boolean)
    .sort((left, right) => (right.blogNumber ?? Number.NEGATIVE_INFINITY) - (left.blogNumber ?? Number.NEGATIVE_INFINITY));

  await fs.mkdir(path.dirname(OUT_PATH), { recursive: true });
  await fs.writeFile(OUT_PATH, `${JSON.stringify(entries, null, 2)}\n`, "utf8");
  console.log(`Wrote ${entries.length} blog entries to ${path.relative(ROOT_DIR, OUT_PATH)}`);
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
