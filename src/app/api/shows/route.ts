import { NextResponse } from 'next/server'
import { google } from 'googleapis'

const SHOWS_FILE_ID = process.env.GOOGLE_DRIVE_SHOWS_FILE_ID
const LINKPREVIEW_API_KEY = process.env.LINKPREVIEW_API_KEY
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY

interface LinkPreview {
  title: string
  description: string
  image: string
  url: string
  date?: string
  location?: string
}

// Cache for 5 minutes to improve load times
export const revalidate = 300

export async function GET() {
  try {
    console.log('Shows API called')
    console.log('SHOWS_FILE_ID:', SHOWS_FILE_ID)
    console.log('LINKPREVIEW_API_KEY:', LINKPREVIEW_API_KEY ? 'Present' : 'Missing')
    console.log('GOOGLE_SERVICE_ACCOUNT_EMAIL:', GOOGLE_SERVICE_ACCOUNT_EMAIL ? 'Present' : 'Missing')
    console.log('GOOGLE_PRIVATE_KEY:', GOOGLE_PRIVATE_KEY ? 'Present' : 'Missing')
    
    if (!SHOWS_FILE_ID || !LINKPREVIEW_API_KEY || !GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
      console.error('Missing required environment variables')
      return NextResponse.json({ shows: [] })
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
    console.log('Fetching file from Google Drive...')
    const fileResponse = await drive.files.get({
      fileId: SHOWS_FILE_ID,
      alt: 'media',
    }, {
      responseType: 'text'
    })
    
    console.log('File response received:', fileResponse.data ? 'Has data' : 'No data')
    
    if (!fileResponse.data) {
      console.error('Failed to fetch shows file from Google Drive')
      return NextResponse.json({ shows: [] })
    }

    const fileContent = fileResponse.data as string
    console.log('File content:', fileContent)
    
    const urls = fileContent
      .split('\n')
      .map(line => line.trim())
      .filter(line => {
        if (!line || !line.startsWith('http')) return false
        try {
          // Validate URL format
          new URL(line)
          return true
        } catch {
          console.log('Invalid URL format:', line)
          return false
        }
      })
      .slice(0, 4) // Only take first 4 URLs

    console.log('Parsed URLs:', urls)

    if (urls.length === 0) {
      console.log('No valid URLs found')
      return NextResponse.json({ shows: [] })
    }

    // Fetch link previews for each URL
    const previews = await Promise.all(
      urls.map(async (url) => {
        try {
          // First, try to scrape the page directly for better date extraction
          let eventDate = ''
          let eventLocation = ''
          
          try {
            const pageResponse = await fetch(url, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; LinkPreview/1.0)'
              }
            })
            
            if (pageResponse.ok) {
              const html = await pageResponse.text()
              
              // Extract date from Eventbrite structured data
              const eventbriteMatch = html.match(/"startDate":"([^"]+)"/i)
              if (eventbriteMatch) {
                const parsedDate = new Date(eventbriteMatch[1])
                eventDate = parsedDate.toLocaleDateString('en-IE', { 
                  weekday: 'short', 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })
              }
              
              // Extract location from Eventbrite structured data
              const locationMatch = html.match(/"location":\s*{\s*"@type":\s*"Place",\s*"name":\s*"([^"]+)"/i)
              if (locationMatch) {
                eventLocation = locationMatch[1]
              } else {
                // Try alternative location patterns
                const altLocationMatch = html.match(/"addressLocality":"([^"]+)"/i)
                if (altLocationMatch) {
                  eventLocation = altLocationMatch[1]
                }
              }
              
              // Try other date patterns if Eventbrite didn't work
              if (!eventDate) {
                const datePatterns = [
                  /"datePublished":"([^"]+)"/i,
                  /"startDate":"([^"]+)"/i,
                  /datetime="([^"]+)"/i,
                  /content="([^"]+)" property="event:start_date"/i
                ]
                
                for (const pattern of datePatterns) {
                  const match = html.match(pattern)
                  if (match) {
                    try {
                      const parsedDate = new Date(match[1])
                      if (!isNaN(parsedDate.getTime())) {
                        eventDate = parsedDate.toLocaleDateString('en-IE', { 
                          weekday: 'short', 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                        break
                      }
                    } catch (e) {
                      continue
                    }
                  }
                }
              }
            }
          } catch (scrapeError) {
            console.log('Direct scraping failed, falling back to link preview')
          }
          
          // Now get the preview data for title, description, and image
          const previewUrl = `https://api.linkpreview.net/?key=${LINKPREVIEW_API_KEY}&q=${encodeURIComponent(url)}`
          const response = await fetch(previewUrl)
          
          if (!response.ok) {
            console.error(`Failed to fetch preview for ${url}`)
            return null
          }

          const data = await response.json()
          
          // Use a bronze-colored data URL as fallback if no image (font: saonara)
          const fallbackImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI0MyODk1MCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ic2FvbmFyYSIgZm9udC1zaXplPSIyNCIgZmlsbD0iI0ZGRkZGRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPlVwY29taW5nIFNob3c8L3RleHQ+PC9zdmc+'
          
          return {
            title: data.title || 'Upcoming Show',
            description: data.description || '',
            image: data.image || fallbackImage,
            url: url,
            date: eventDate,
            location: eventLocation
          } as LinkPreview
        } catch (error) {
          console.error(`Error fetching preview for ${url}:`, error)
          return null
        }
      })
    )

    // Filter out failed previews
    const validPreviews = previews.filter((p): p is LinkPreview => p !== null)

    return NextResponse.json({ shows: validPreviews })
  } catch (error) {
    console.error('Error in shows API:', error)
    return NextResponse.json({ shows: [] })
  }
}
