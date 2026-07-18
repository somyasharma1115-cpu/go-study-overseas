#!/bin/bash

# Script to fetch MBBS sheet data and update University Pages sheet
# Uses curl with Google Sheets API

SPREADSHEET_ID="1PTAqCn8ghZQibVEi8hbXiVtk2GPw8b_bF2BQn1U7FZo"
MBBS_SHEET="MBBS"
UNIVERSITY_SHEET="University Pages"

# Get access token using service account
# We'll use a simple Node.js snippet to get the token
get_access_token() {
  node -e "
    const fs = require('fs');
    const path = require('path');
    
    // Read .env.local
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const envLines = envContent.split('\n');
    const env = {};
    envLines.forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        env[match[1]] = match[2].replace(/^['\"]|['\"]$/g, '');
      }
    });
    
    const clientEmail = env.VITE_GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL;
    const privateKey = env.VITE_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
    
    if (!clientEmail || !privateKey) {
      console.error('Missing credentials in .env.local');
      process.exit(1);
    }
    
    // Use the googleapis library if available
    try {
      const { google } = require('googleapis');
      const auth = new google.auth.GoogleAuth({
        credentials: { client_email: clientEmail, private_key: privateKey },
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
      });
      
      auth.getClient().then(authClient => {
        authClient.getAccessToken().then(token => {
          console.log(token.token);
        });
      });
    } catch (e) {
      console.error('Error:', e.message);
      process.exit(1);
    }
  "
}

echo "=== Fetching MBBS Sheet Data ==="

# For now, let's just try to make the request manually
# We need to install googleapis first

echo "Checking if googleapis is available..."
if [ ! -d "node_modules/googleapis" ]; then
  echo "Installing googleapis..."
  npm install googleapis
fi

# Create a Node.js script to do the work
cat > /tmp/fetch-mbbs.js << 'NODESCRIPT'
const { google } = require('googleapis');
const fs = require('fs');

// Read credentials from .env.local
const envContent = fs.readFileSync('/Users/vabhav/ideas/dream-italy-journey/.env.local', 'utf8');
const envLines = envContent.split('\n');
const env = {};
envLines.forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    env[match[1]] = match[2].replace(/^['\"]|['\"]$/g, '');
  }
});

const SPREADSHEET_ID = "1PTAqCn8ghZQibVEi8hbXiVtk2GPw8b_bF2BQn1U7FZo";

async function main() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: env.VITE_GOOGLE_SERVICE_ACCOUNT_CLIENT_EMAIL,
      private_key: env.VITE_GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });

  const sheets = google.sheets({ version: 'v4', auth });

  // Fetch MBBS sheet
  console.log('Fetching MBBS sheet...');
  const mbbsResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'MBBS!A:Z'
  });

  const mbbsRows = mbbsResponse.data.values;
  if (!mbbsRows || mbbsRows.length === 0) {
    console.log('No data found in MBBS sheet');
    return;
  }

  console.log(`Found ${mbbsRows.length - 1} rows in MBBS sheet`);
  console.log('Headers:', mbbsRows[0]);

  // Save MBBS data
  fs.writeFileSync('/Users/vabhav/ideas/dream-italy-journey/tmp/mbbs-raw.json', JSON.stringify(mbbsRows, null, 2));
  console.log('Saved raw MBBS data to tmp/mbbs-raw.json');

  // TODO: Transform and append to University Pages sheet
}

main().catch(console.error);
NODESCRIPT

node /tmp/fetch-mbbs.js
