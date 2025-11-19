import { NextResponse } from 'next/server'
import { google } from 'googleapis'

export async function GET(
  request: Request,
  { params }: { params: { fileId: string } }
) {
  try {
    const fileId = params.fileId

    // Initialize Google Drive API with service account
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    })

    const drive = google.drive({ version: 'v3', auth })

    // Get file metadata to determine mime type
    const fileMetadata = await drive.files.get({
      fileId: fileId,
      fields: 'mimeType, name',
    })

    const mimeType = fileMetadata.data.mimeType || 'audio/mpeg'

    // Get file content
    const response = await drive.files.get(
      {
        fileId: fileId,
        alt: 'media',
      },
      { responseType: 'stream' }
    )

    // Convert stream to buffer
    const chunks: Uint8Array[] = []
    for await (const chunk of response.data) {
      chunks.push(chunk)
    }
    const buffer = Buffer.concat(chunks)

    // Return audio file with proper headers
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': mimeType,
        'Content-Length': buffer.length.toString(),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=86400', // Cache for 1 day
      },
    })
  } catch (error) {
    console.error('Error fetching audio from Google Drive:', error)
    return NextResponse.json(
      { error: 'Failed to fetch audio' },
      { status: 500 }
    )
  }
}
