import { google } from 'googleapis';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

/**
 * Service to generate real Google Meet links using Google Calendar API
 */
export const createGoogleMeet = async (appointmentData) => {
  try {
    // 1. Load credentials
    let credentials;
    if (process.env.GOOGLE_CREDENTIALS) {
      credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    } else {
      // For local development fallback
      const credPath = path.resolve('google-credentials.json');
      if (fs.existsSync(credPath)) {
        credentials = JSON.parse(fs.readFileSync(credPath, 'utf8'));
      } else {
        return null; 
      }
    }

    // Fix private key formatting (essential for JSON parsing from certain environments)
    if (credentials.private_key && typeof credentials.private_key === 'string') {
      credentials.private_key = credentials.private_key
        .replace(/\\n/g, '\n') // Replace literal \n with newlines
        .trim();               // Remove any trailing spaces or newlines
    }

    const auth = google.auth.fromJSON(credentials);
    auth.scopes = ['https://www.googleapis.com/auth/calendar'];

    const authClient = await auth.getClient();
    const calendar = google.calendar({ version: 'v3', auth: authClient });

    // Clinic's Calendar ID (Usually the main Gmail address)
    // Fallback to 'primary' (which is the service account's calendar) if not provided
    const calendarId = process.env.CALENDAR_ID || 'jeevadharawellnesscenter@gmail.com';

    const { serviceName, date, time, userName, userEmail } = appointmentData;

    // Combine date and time for Google Calendar format (Basic parsing)
    // Format expected: 2026-04-10T09:00:00Z
    const startDateTime = new Date(`${date}T${time}`);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // Default 1 hour duration

    const event = {
      summary: `Jeevadhara Wellness: ${serviceName} - ${userName}`,
      description: `Appointment for ${userName} (${userEmail}) at Jeevadhara Wellness Center.`,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'Asia/Kolkata',
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'Asia/Kolkata',
      },
      conferenceData: {
        createRequest: {
          requestId: uuidv4(),
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
      attendees: [
        { email: userEmail },
        { email: 'jeevadharawellnesscenter@gmail.com' }
      ],
    };

    const response = await calendar.events.insert({
      calendarId: calendarId,
      resource: event,
      conferenceDataVersion: 1,
    });

    return response.data.hangoutLink;
  } catch (error) {
    console.error('Error generating Google Meet link:', error.message);
    return null;
  }
};
