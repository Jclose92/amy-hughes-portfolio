import { NextResponse } from 'next/server'
import { google } from 'googleapis'

const BIO_FILE_ID = process.env.GOOGLE_DRIVE_BIO_FILE_ID
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY

// Cache bio for better performance
export const revalidate = 300 // Cache for 5 minutes

export async function GET() {
  try {
    if (!BIO_FILE_ID || !GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
      console.error('Missing required environment variables for bio')
      return NextResponse.json({ bio: '' })
    }

    // Set up Google Drive API with service account
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    })

    const drive = google.drive({ version: 'v3', auth })

    // Fetch the text file from Google Drive
    const fileResponse = await drive.files.get({
      fileId: BIO_FILE_ID,
      alt: 'media',
    }, {
      responseType: 'text'
    })
    
    if (!fileResponse.data) {
      console.error('Failed to fetch bio file from Google Drive')
      return NextResponse.json({ bio: '' })
    }

    const bioText = fileResponse.data as string

    return NextResponse.json({ bio: bioText }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('Error in bio API:', error)
    return NextResponse.json({ bio: '' })
  }
}
