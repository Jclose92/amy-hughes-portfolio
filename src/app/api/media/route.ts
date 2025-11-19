import { NextResponse } from 'next/server'
import { google } from 'googleapis'

// Cache media listings for 10 minutes (600 seconds)
export const revalidate = 600

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
    
    // Format description: just trim
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

async function fetchFromFolder(folderId: string, drive: any) {
  const response = await drive.files.list({
    q: `'${folderId}' in parents and trashed=false`,
    fields: 'files(id, name, mimeType, createdTime, modifiedTime, webContentLink, description)',
    orderBy: 'modifiedTime desc', // Newest modified first
  })

  const files = response.data.files || []

  // Filter for image, video, and audio files
  const mediaFiles = files.filter((file: any) => {
    const mimeType = file.mimeType || ''
    return (
      mimeType.startsWith('image/') ||
      mimeType.startsWith('video/') ||
      mimeType.startsWith('audio/')
    )
  })

  // Format the response with file data
  return mediaFiles.map((file: any) => {
    const { title, description } = parseFilename(file.name || 'Untitled')
    const mimeType = file.mimeType || ''
    const isAudio = mimeType.startsWith('audio/')
    
    // Use Google Drive description if available, otherwise use parsed filename description
    const finalDescription = file.description || description
    
    return {
      id: file.id,
      title,
      description: finalDescription,
      // Use proxy endpoint for audio files, direct link for others
      url: isAudio 
        ? `/api/audio/${file.id}` 
        : `https://drive.google.com/uc?export=download&id=${file.id}`,
      mimeType,
      modifiedTime: file.modifiedTime,
      isVideo: mimeType.startsWith('video/'),
      isAudio,
      isImage: mimeType.startsWith('image/'),
    }
  })
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    // Initialize Google Drive API with service account
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    })

    const drive = google.drive({ version: 'v3', auth })

    // Map category to folder ID
    const folderMap: { [key: string]: string | undefined } = {
      screen: process.env.GOOGLE_DRIVE_SCREEN_FOLDER_ID,
      voicework: process.env.GOOGLE_DRIVE_VOICEWORK_FOLDER_ID,
      comedy: process.env.GOOGLE_DRIVE_COMEDY_FOLDER_ID,
      stage: process.env.GOOGLE_DRIVE_STAGE_FOLDER_ID,
      showreels: process.env.GOOGLE_DRIVE_SHOWREELS_FOLDER_ID,
      voicedemos: process.env.GOOGLE_DRIVE_VOICE_DEMOS_FOLDER_ID,
    }

    if (!category || !folderMap[category]) {
      return NextResponse.json(
        { error: 'Invalid category', items: [] },
        { status: 400 }
      )
    }

    const folderId = folderMap[category]
    if (!folderId) {
      throw new Error(`Folder ID not configured for category: ${category}`)
    }

    const items = await fetchFromFolder(folderId, drive)

    return NextResponse.json({ items })
  } catch (error) {
    console.error('Error fetching from Google Drive:', error)
    return NextResponse.json(
      { error: 'Failed to fetch media', items: [] },
      { status: 500 }
    )
  }
}
