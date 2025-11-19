import { NextResponse } from 'next/server'
import { google } from 'googleapis'

// Helper function to format filename as title and description
function parseFilename(filename: string): { title: string; description: string } {
  // Remove file extension
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, '')
  
  // Check if filename contains "---" separator for description
  if (nameWithoutExt.includes('---')) {
    const [titlePart, descPart] = nameWithoutExt.split('---')
    
    // Format title: replace hyphens/underscores with spaces, capitalize words
    const title = titlePart
      .trim()
      .replace(/[-_]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    
    // Format description: just trim and capitalize first letter
    const description = descPart.trim()
    
    return { title, description }
  } else {
    // No description, just format title
    const title = nameWithoutExt
      .replace(/[-_]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    
    return { title, description: '' }
  }
}

export async function GET() {
  try {
    // Initialize Google Drive API with service account
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    })

    const drive = google.drive({ version: 'v3', auth })
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID

    if (!folderId) {
      throw new Error('GOOGLE_DRIVE_FOLDER_ID not configured')
    }

    // List all files in the folder
    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: 'files(id, name, mimeType, webContentLink)',
      orderBy: 'name',
    })

    const files = response.data.files || []

    // Filter for image and video files
    const mediaFiles = files.filter(file => {
      const mimeType = file.mimeType || ''
      return (
        mimeType.startsWith('image/') ||
        mimeType.startsWith('video/')
      )
    })

    // Format the response with file data
    const images = mediaFiles.map(file => {
      const { title, description } = parseFilename(file.name || 'Untitled')
      
      return {
        id: file.id,
        title,
        description,
        // Use direct download link format
        url: `https://drive.google.com/uc?export=download&id=${file.id}`,
      }
    })

    return NextResponse.json({ images })
  } catch (error) {
    console.error('Error fetching from Google Drive:', error)
    return NextResponse.json(
      { error: 'Failed to fetch gallery images', images: [] },
      { status: 500 }
    )
  }
}
