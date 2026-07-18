import fs from "fs/promises";
import crypto from "crypto";

export const TOKEN_AUDIENCE = "https://oauth2.googleapis.com/token";
export const READONLY_SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets.readonly";
export const WRITE_SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";

export const loadDotEnv = async (filePath) => {
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
    // Ignore missing env files so scripts can run in CI or via explicit env vars.
  }
};

export const base64UrlEncode = (input) => {
  const bytes = typeof input === "string" ? Buffer.from(input, "utf8") : Buffer.from(input);
  return bytes.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
};

export const slugify = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const normalizeHeader = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");

export const normalizePrivateKey = (privateKey) => privateKey.replace(/\\n/g, "\n");

export const importPrivateKey = async (privateKey) =>
  crypto.webcrypto.subtle.importKey(
    "pkcs8",
    Buffer.from(
      normalizePrivateKey(privateKey)
        .replace(/-----BEGIN PRIVATE KEY-----/, "")
        .replace(/-----END PRIVATE KEY-----/, "")
        .replace(/\s+/g, ""),
      "base64",
    ),
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    },
    false,
    ["sign"],
  );

export const buildJwt = async ({ clientEmail, privateKey, scope }) => {
  const header = base64UrlEncode(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const nowInSeconds = Math.floor(Date.now() / 1000);
  const payload = base64UrlEncode(
    JSON.stringify({
      iss: clientEmail,
      scope,
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

export const fetchAccessToken = async (scope) => {
  const clientEmail = process.env.VITE_GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL;
  const privateKey = process.env.VITE_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

  if (!clientEmail || !privateKey) {
    throw new Error("Missing VITE_GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL or VITE_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY");
  }

  const assertion = await buildJwt({ clientEmail, privateKey, scope });
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

export const fetchSheetValues = async ({ spreadsheetId, range, accessToken }) => {
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
