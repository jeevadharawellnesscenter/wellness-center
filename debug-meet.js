import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { createGoogleMeet } from './utils/googleMeet.js';

dotenv.config();

const testBooking = async () => {
  console.log('--- Testing Google Meet API Connection ---');
  
  const credPath = path.resolve('google-credentials.json');
  if (fs.existsSync(credPath)) {
    const creds = JSON.parse(fs.readFileSync(credPath, 'utf8'));
    console.log('Key Sample (First 60):', creds.private_key.substring(0, 60).replace(/\n/g, '[NL]'));
    console.log('Char Codes (First 30):', creds.private_key.substring(0, 30).split('').map(c => c.charCodeAt(0)));
  }

  const dummyData = {
    serviceName: 'Test Massage',
    date: '2026-04-10',
    time: '10:00:00',
    userName: 'Test User',
    userEmail: 'cguru@example.com'
  };

  const link = await createGoogleMeet(dummyData);

  if (link) {
    console.log('✅ SUCCESS! Generated Link:', link);
  } else {
    console.error('❌ FAILED: Could not generate a real Google Meet link.');
  }
};

testBooking();
