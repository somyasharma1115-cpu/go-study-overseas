#!/bin/bash

# Script to sync MBBS universities using curl commands
# Uses Google Sheets API with service account authentication

set -e

SPREADSHEET_ID="1PTAqCn8ghZQibVEi8hbXiVtk2GPw8b_bF2BQn1U7FZo"
MBBS_SHEET="MBBS"
UNIVERSITY_SHEET="University Pages"

echo "============================================================"
echo "🚀 MBBS Universities Sync (using curl)"
echo "============================================================"

# Step 1: Get access token using Node.js
echo ""
echo "🔐 Getting access token..."

NODE_SCRIPT="
const { google } = require('googleapis');
const fs = require('fs');

// Read .env.local
const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1]] = match[2].replace(/^['\"]|['\"]$/g, '');
  }
});

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: env.VITE_GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
    private_key: env.VITE_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

auth.getClient().then(authClient => {
  authClient.getAccessToken().then(token => {
    console.log(token.token || token);
  }).catch(err => {
    console.error('Token error:', err.message);
    process.exit(1);
  });
}).catch(err => {
  console.error('Auth error:', err.message);
  process.exit(1);
});
"

ACCESS_TOKEN=$(node -e "$NODE_SCRIPT" 2>&1)

if [ -z "$ACCESS_TOKEN" ]; then
  echo "❌ Failed to get access token"
  exit 1
fi

echo "✅ Access token obtained"

# Step 2: Fetch MBBS sheet data using curl
echo ""
echo "📥 Fetching MBBS sheet data..."

MBBS_DATA=$(curl -s -X GET \
  "https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${MBBS_SHEET}!A:Z" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json")

if echo "$MBBS_DATA" | grep -q "error"; then
  echo "❌ Error fetching MBBS sheet:"
  echo "$MBBS_DATA" | jq '.error'
  exit 1
fi

# Save raw data
mkdir -p tmp
echo "$MBBS_DATA" > tmp/mbbs-response.json

# Extract values using jq
jq -r '.values[]' tmp/mbbs-response.json > /dev/null 2>&1 || {
  echo "❌ Failed to parse MBBS data"
  exit 1
}

echo "✅ MBBS data fetched successfully"

# Step 3: Process and transform data
echo ""
echo "🔄 Processing data..."

NODE_PROCESS="
const fs = require('fs');
const response = JSON.parse(fs.readFileSync('tmp/mbbs-response.json', 'utf8'));
const rows = response.values || [];

if (rows.length === 0) {
  console.log('No data found');
  process.exit(1);
}

const headers = rows[0];
const dataRows = rows.slice(1).filter(row => row.some(cell => cell && cell.toString().trim()));

console.log('Found ' + dataRows.length + ' universities in MBBS sheet');

// Transform to University Pages format
const transformed = dataRows.map(row => {
  const uni = {};
  headers.forEach((h, i) => {
    if (h && row[i] !== undefined) {
      uni[h.toString().trim()] = row[i].toString().trim();
    }
  });
  
  // Map to University Pages columns
  return [
    uni.active || 'TRUE',
    uni.countrySlug || 'italy',
    uni.slug || uni.name?.toLowerCase().replace(/\s+/g, '-') || '',
    uni.name || '',
    uni.countryName || 'Italy',
    uni.countryHeroImage || '',
    uni.menuNote || '',
    uni.heroTag || '',
    uni.program || 'MBBS',
    uni.tag || '',
    uni.logo || '',
    uni.timelineJson || '[]',
    uni.requirementsJson || '[]',
    uni.scholarshipsJson || '[]',
    uni.costsJson || '[]',
    uni.highlightsJson || '[]',
    uni.faqsJson || '[]',
    uni.visualsJson || '{}',
    'TRUE'
  ];
});

fs.writeFileSync('tmp/mbbs-transformed.json', JSON.stringify(transformed, null, 2));
console.log('Transformed ' + transformed.length + ' universities');
"

node -e "$NODE_PROCESS"

if [ ! -f tmp/mbbs-transformed.json ]; then
  echo "❌ Failed to transform data"
  exit 1
fi

echo "✅ Data transformed successfully"

# Step 4: Show preview
echo ""
echo "👀 Preview of first 3 universities to be added:"
node -e "
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('tmp/mbbs-transformed.json', 'utf8'));
data.slice(0, 3).forEach((row, i) => {
  console.log('\n  [' + (i+1) + '] ' + row[3] + ' (slug: ' + row[2] + ')');
});
"

# Step 5: Confirm and append
echo ""
echo "============================================================"
echo "⚠️  About to add $(jq 'length' tmp/mbbs-transformed.json) universities"
echo "============================================================"

if [ "$1" != "--confirm" ]; then
  echo ""
  echo "Review the data in tmp/mbbs-transformed.json"
  echo ""
  echo "Then run with --confirm flag to proceed:"
  echo "  bash scripts/sync-mbbs-with-curl.sh --confirm"
  echo ""
  exit 0
fi

echo ""
echo "✅ Confirmed! Proceeding with update..."

# Step 6: Append to University Pages sheet using curl
echo ""
echo "📤 Appending data to University Pages sheet..."

# Prepare the request body
NODE_PREPARE="
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('tmp/mbbs-transformed.json', 'utf8'));

const body = {
  values: data
};

fs.writeFileSync('tmp/append-request.json', JSON.stringify(body, null, 2));
console.log('Prepared ' + data.length + ' rows for append');
"

node -e "$NODE_PREPARE"

# Make the API call to append data
APPEND_RESULT=$(curl -s -X POST \
  "https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${UNIVERSITY_SHEET}!A:S:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS" \
  -H "Authorization: Bearer ${ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d @tmp/append-request.json)

if echo "$APPEND_RESULT" | grep -q "error"; then
  echo "❌ Error appending data:"
  echo "$APPEND_RESULT" | jq '.error'
  exit 1
fi

echo "$APPEND_RESULT" > tmp/append-response.json

echo ""
echo "============================================================"
echo "✅ Sync complete!"
echo "   Added $(jq '.updates.updatedRows' tmp/append-response.json) universities"
echo "============================================================"

# Cleanup
rm -f tmp/mbbs-response.json tmp/append-request.json

exit 0
