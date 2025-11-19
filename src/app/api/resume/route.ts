import { NextResponse } from 'next/server'

const RESUME_FILE_ID = process.env.GOOGLE_DRIVE_RESUME_FILE_ID

export async function GET() {
  try {
    if (!RESUME_FILE_ID) {
      console.error('Missing GOOGLE_DRIVE_RESUME_FILE_ID environment variable')
      return NextResponse.json({ url: '' })
    }

    // Return the Google Docs viewer URL for the resume
    const resumeUrl = `https://docs.google.com/document/d/${RESUME_FILE_ID}/preview`

    return NextResponse.json({ url: resumeUrl })
  } catch (error) {
    console.error('Error in resume API:', error)
    return NextResponse.json({ url: '' })
  }
}
