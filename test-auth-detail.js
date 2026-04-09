import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

const testAuth = async () => {
  console.log('--- Diagnostic Auth Test ---');
  
  const credentials = JSON.parse(fs.readFileSync(path.resolve('google-credentials.json'), 'utf8'));
  
  // Method 1: Use Object-based configuration (Most reliable)
  const jwtClient = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/calendar']
  });

  try {
    console.log('Attempting to authorize...');
    const tokens = await jwtClient.authorize();
    console.log('✅ AUTH SUCCESS! Tokens:', tokens.access_token.substring(0, 10) + '...');
    
    // Now try to list calendars to confirm API access
    const calendar = google.calendar({ version: 'v3', auth: jwtClient });
    const list = await calendar.calendarList.list();
    console.log('✅ CALENDAR ACCESS SUCCESS! Found calendars:', list.data.items.length);

  } catch (error) {
    console.error('❌ AUTH FAILED:', error.message);
    if (error.response) {
      console.error('Response Data:', JSON.stringify(error.response.data, null, 2));
    }
  }
};

testAuth();
