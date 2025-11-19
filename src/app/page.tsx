'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Footer from '@/components/Footer'
import { MediaPlayerProvider } from '@/contexts/MediaPlayerContext'
import VoiceDemo from '@/components/VoiceDemo'

interface MediaItem {
  id: string
  title: string
  description: string
  url: string
  mimeType?: string
  modifiedTime?: string
  isVideo?: boolean
  isAudio?: boolean
}

interface ShowPreview {
  title: string
  description: string
  image: string
  url: string
  date?: string
  location?: string
}

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [latestShowreel, setLatestShowreel] = useState<MediaItem | null>(null)
  const [latestVoiceDemos, setLatestVoiceDemos] = useState<MediaItem[]>([])
  const [upcomingShows, setUpcomingShows] = useState<ShowPreview[]>([])
  const [bioText, setBioText] = useState<string>('')
  const [bioHtml, setBioHtml] = useState<string>('')
  const [resumeUrl, setResumeUrl] = useState<string>('')
  const [showResumeLightbox, setShowResumeLightbox] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const bioContainerRef = useRef<HTMLDivElement>(null)
  const bioContentRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Check if scrolled past the hero image (100vh)
      setIsScrolled(window.scrollY > window.innerHeight)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Track viewport width for mobile-specific layout
  useEffect(() => {
    const updateIsMobile = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth <= 768)
      }
    }

    updateIsMobile()
    window.addEventListener('resize', updateIsMobile)
    return () => window.removeEventListener('resize', updateIsMobile)
  }, [])

  useEffect(() => {
    // Fetch latest showreel
    fetch('/api/media?category=showreels')
      .then(res => res.json())
      .then(data => {
        if (data.items && data.items.length > 0) {
          setLatestShowreel(data.items[0]) // Most recent
        }
      })
      .catch(err => console.error('Error loading showreel:', err))

    // Fetch latest 2 voice demos
    fetch('/api/media?category=voicedemos')
      .then(res => res.json())
      .then(data => {
        if (data.items && data.items.length > 0) {
          setLatestVoiceDemos(data.items.slice(0, 2)) // Two most recent
        }
      })
      .catch(err => console.error('Error loading voice demos:', err))

    // Fetch upcoming shows
    fetch('/api/shows')
      .then(res => res.json())
      .then(data => {
        if (data.shows) {
          setUpcomingShows(data.shows)
        }
      })
      .catch(err => console.error('Error loading shows:', err))

    // Fetch bio text
    fetch('/api/bio')
      .then(res => res.json())
      .then(data => {
        if (data.bio) {
          setBioText(data.bio)
        }
      })
      .catch(err => {
        console.error('Error loading bio:', err)
      })

    // Fetch resume URL
    fetch('/api/resume')
      .then(res => res.json())
      .then(data => {
        if (data.url) {
          setResumeUrl(data.url)
        }
      })
      .catch(err => console.error('Error loading resume:', err))
  }, [])

  // Auto-scale bio text to fit container (desktop only)
  useEffect(() => {
    if (isMobile) return // Skip this effect on mobile
    if (!bioText || !bioContainerRef.current || !bioContentRef.current) return

    const container = bioContainerRef.current
    const content = bioContentRef.current
    
    if (!container || !content) return
      
      // Binary search for optimal font size
      let minSize = 4
      let maxSize = 30
      let optimalSize = minSize
      
      const availableHeight = container.clientHeight - 20
      
      // Binary search to find the largest font size that fits
      while (maxSize - minSize > 0.5) {
        const testSize = (minSize + maxSize) / 2
        
        // Split by single line breaks and track them
        const lines = bioText.trim().split(/\r?\n/)
        const htmlParts = []
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim()
          if (line) {
            // Non-empty line - create paragraph
            htmlParts.push(`<p style="margin: 0; line-height: 1.2; font-size: ${testSize}px;">${line}</p>`)
          } else {
            // Empty line - create blank line
            htmlParts.push(`<p style="margin: 0; line-height: 1.2; font-size: ${testSize}px;">&nbsp;</p>`)
          }
        }
        
        content.innerHTML = htmlParts.join('')
        
        // Force reflow to get accurate measurement
        void content.offsetHeight
        
        if (content.scrollHeight <= availableHeight) {
          // This size fits, try larger
          optimalSize = testSize
          minSize = testSize
        } else {
          // Too large, try smaller
          maxSize = testSize
        }
      }
      
      // Apply the optimal size one final time and save to state
      const lines = bioText.trim().split(/\r?\n/)
      const htmlParts = []
      let textLineCount = 0
      let blankLineCount = 0
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()
        if (line) {
          // Non-empty line - create paragraph
          htmlParts.push(`<p style="margin: 0; line-height: 1.2; font-size: ${optimalSize}px;">${line}</p>`)
          textLineCount++
        } else {
          // Empty line - create blank line
          htmlParts.push(`<p style="margin: 0; line-height: 1.2; font-size: ${optimalSize}px;">&nbsp;</p>`)
          blankLineCount++
        }
      }
      
    const finalHtml = htmlParts.join('')
    
    content.innerHTML = finalHtml
    setBioHtml(finalHtml)
  }, [bioText, isMobile])

  // Hide loading screen once bio is rendered (or immediately on mobile once bioText loads)
  useEffect(() => {
    if (bioHtml || (isMobile && bioText)) {
      setTimeout(() => setIsLoading(false), 50)
    }
  }, [bioHtml, isMobile, bioText])

  return (
    <MediaPlayerProvider>
    <div>
      {/* Loading Screen */}
      {isLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#000000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}>
          <div style={{
            fontSize: '8rem',
            color: '#C28950',
            fontFamily: 'UpperEastSide, Arial, Helvetica, sans-serif',
            fontWeight: 'bold',
            animation: 'fadeInOut 1.5s ease-in-out infinite',
          }}>
            AH
          </div>
          <style dangerouslySetInnerHTML={{
            __html: `
              @keyframes fadeInOut {
                0%, 100% { opacity: 0.4; }
                50% { opacity: 1; }
              }
            `
          }} />
        </div>
      )}

      {/* Fixed Navigation Bar */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: '1rem 2rem',
        display: 'flex',
        gap: '3rem',
        alignItems: 'center',
        background: 'url(/images/Website Wallpaper.jpeg) fixed center/cover',
        backgroundColor: '#000000',
        fontFamily: 'UpperEastSide, Arial, Helvetica, sans-serif'
      }}>
        <a href="/" style={{
          color: '#C28950',
          fontSize: '3.12rem',
          textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
          marginRight: 'auto',
          textDecoration: 'none',
          cursor: 'pointer'
        }}>Amy Hughes</a>
        <div style={{ display: 'flex', gap: '3rem', marginRight: 'auto', marginLeft: 'auto' }}>
          <a href="/" style={{
            color: '#C28950',
            textDecoration: 'none',
            fontSize: '3.12rem',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)'
          }}>Amy</a>
          <a href="/acting" style={{
            color: '#C28950',
            textDecoration: 'none',
            fontSize: '3.12rem',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)'
          }}>Work</a>
          <a href="/contact" style={{
            color: '#C28950',
            textDecoration: 'none',
            fontSize: '3.12rem',
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)'
          }}>Contact</a>
        </div>
      </nav>

      {/* Hero Section with Headshot */}
      {isMobile ? (
        <section style={{ marginTop: '5rem', padding: '1.5rem 1.5rem 0' }}>
          <div style={{
            position: 'relative',
            width: '100%',
            height: '60vh',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <Image
              src="https://drive.google.com/uc?export=download&id=1CGxVQFEhbMPp4vGV_VAG-qMgGtyg0upI"
              alt="Amy Hughes - Professional Headshot"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>

          {/* Name and Tagline */}
          <div style={{
            marginTop: '1.5rem',
            color: '#FFFFFF',
            fontFamily: 'Saonara, serif',
            textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '0.75rem' }}>Amy Hughes</div>
            <div style={{ fontSize: '2.4rem', lineHeight: 1.1 }}>
              Actor, Comedian, and
              <br />
              Voiceover Artist
            </div>
          </div>

          {/* Bio Text - stacked block */}
          <div
            style={{
              marginTop: '1.75rem',
              color: '#FFFFFF',
              fontFamily: 'Josefin Sans, Arial, Helvetica, sans-serif',
              lineHeight: 1.4,
              textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8)'
            }}
          >
            {bioText ? (
              bioText.trim().split(/\r?\n/).map((line, idx) => (
                <p key={idx} style={{ margin: 0, marginBottom: line ? '0.6rem' : '0.3rem' }}>
                  {line || '\u00A0'}
                </p>
              ))
            ) : (
              <p style={{ margin: 0 }}>Loading bio...</p>
            )}
          </div>

          {/* Reach Out Button */}
          <div style={{ marginTop: '2rem', marginBottom: '1rem' }}>
            <a
              href="/contact"
              style={{
                padding: '0.72rem 1.8rem',
                backgroundColor: '#C28950',
                color: '#FFFFFF',
                fontFamily: 'UpperEastSide, Arial, Helvetica, sans-serif',
                fontSize: '1.8rem',
                textDecoration: 'none',
                borderRadius: '8px',
                border: '2px solid #C28950',
                cursor: 'pointer',
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'
              }}
            >
              Reach Out
            </a>
          </div>
        </section>
      ) : (
        <section style={{ 
          position: 'relative', 
          width: '100vw', 
          height: '100vh',
          overflow: 'hidden',
          marginTop: '5rem'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 83.33%, rgba(0,0,0,0) 100%)',
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 83.33%, rgba(0,0,0,0) 100%)'
          }}>
            <Image
              src="https://drive.google.com/uc?export=download&id=1CGxVQFEhbMPp4vGV_VAG-qMgGtyg0upI"
              alt="Amy Hughes - Professional Headshot"
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
          
          {/* Text Overlays */}
          <div style={{
            position: 'absolute',
            top: 'calc(2rem - 15px)',
            left: '2rem',
            color: '#FFFFFF',
            fontFamily: 'Saonara, serif',
            fontSize: '8.95rem',
            zIndex: 10,
            textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)'
          }}>
            Amy Hughes
          </div>
          
          <div style={{
            position: 'absolute',
            bottom: 'calc(2rem + 90px)',
            left: 'calc(2rem + 300px)',
            color: '#FFFFFF',
            fontFamily: 'Saonara, serif',
            fontSize: '3.48rem',
            lineHeight: '0.84',
            zIndex: 10,
            textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)',
            textAlign: 'right'
          }}>
            Actor, Comedian, and<br />
            Voiceover Artist
          </div>

          {/* Bio Text - Right Side */}
          {bioText && (
            <div
              ref={bioContainerRef}
              style={{
                position: 'absolute',
                top: 'calc(2rem + 8.95rem / 2 - 60px + 20px + 15px)',
                bottom: 'calc(2rem + 90px + 3.48rem + 1rem + 30px - 20px)',
                right: 'calc(2rem + 90px)',
                width: '720px',
                color: '#FFFFFF',
                fontFamily: 'Josefin Sans, Arial, Helvetica, sans-serif',
                lineHeight: '1.3',
                zIndex: 10,
                textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8)',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                flexDirection: 'column',
                overflow: 'hidden'
              }}>
              <div
                ref={bioContentRef}
                style={{
                  width: '100%'
                }} 
                dangerouslySetInnerHTML={{
                  __html: bioHtml || (bioText ? (() => {
                    const lines = bioText.trim().split(/\r?\n/)
                    const htmlParts = []
                    
                    for (let i = 0; i < lines.length; i++) {
                      const line = lines[i].trim()
                      if (line) {
                        htmlParts.push(`<p style="margin: 0; line-height: 1.2;">${line}</p>`)
                      } else {
                        htmlParts.push(`<p style="margin: 0; line-height: 1.2;">&nbsp;</p>`)
                      }
                    }
                    
                    return htmlParts.join('')
                  })() : '<p style="color: #FFFFFF;">Loading bio...</p>')
                }} 
              />
            </div>
          )}

          {/* Reach Out Button */}
          <a
            href="/contact"
            style={{
              position: 'absolute',
              bottom: 'calc(2rem + 90px)',
              right: 'calc(2rem + 90px)',
              padding: '0.72rem 1.8rem',
              backgroundColor: '#C28950',
              color: '#FFFFFF',
              fontFamily: 'UpperEastSide, Arial, Helvetica, sans-serif',
              fontSize: '1.685rem',
              textDecoration: 'none',
              borderRadius: '8px',
              zIndex: 10,
              transition: 'all 0.3s ease',
              border: '2px solid #C28950',
              cursor: 'pointer',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#C28950'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#C28950'
              e.currentTarget.style.color = '#FFFFFF'
            }}
          >
            Reach Out
          </a>
        </section>
      )}

      {/* Content Section */}
      <div style={{ 
        padding: '4rem 2rem'
      }}>
        {/* Showreel and Voice Demos Section - Split Layout (stacks on mobile) */}
        <section style={{ marginBottom: '6rem', maxWidth: '1400px', margin: '0 auto 6rem' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? '1fr' : '1fr 2px 1fr', 
            gap: isMobile ? '2rem' : '3rem',
            alignItems: 'start'
          }}>
            {/* Showreel Section - Left */}
            <div>
              <h2 style={{ 
                fontSize: '4rem', 
                marginBottom: '2rem',
                fontFamily: 'UpperEastSide, Arial, Helvetica, sans-serif',
                color: '#C28950'
              }}>Showreel</h2>
              
              {latestShowreel ? (
                <>
                  {latestShowreel.title && (
                    <h3 style={{
                      color: '#FFFFFF',
                      marginBottom: '0.5rem',
                      fontFamily: 'UpperEastSide, Arial, Helvetica, sans-serif',
                      fontSize: '2rem'
                    }}>{latestShowreel.title}</h3>
                  )}
                  <div style={{ 
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '16 / 9',
                    height: 'auto'
                  }}>
                    <iframe
                      src={`https://drive.google.com/file/d/${latestShowreel.id}/preview`}
                      allow="autoplay"
                      title={latestShowreel.title || 'Showreel'}
                      style={{
                        width: '100%',
                        height: '100%',
                        border: '2px solid #C28950',
                        borderRadius: '8px'
                      }}
                    ></iframe>
                  </div>
                  {latestShowreel.description && (
                    <p style={{ color: '#FFFFFF', marginTop: '0.5rem', fontSize: '1.82rem', fontFamily: 'Josefin Sans, Arial, Helvetica, sans-serif' }}>
                      {latestShowreel.description}
                    </p>
                  )}
                </>
              ) : (
                <p style={{ color: '#FFFFFF' }}>Loading showreel...</p>
              )}
            </div>

            {/* Divider (hidden on mobile) */}
            {!isMobile && (
              <div style={{ 
                width: '2px', 
                height: '100%', 
                backgroundColor: '#C28950',
                minHeight: '500px'
              }}></div>
            )}

            {/* Voice Demos Section - Right */}
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <h2 style={{ 
                fontSize: '4rem', 
                marginBottom: '2rem',
                fontFamily: 'UpperEastSide, Arial, Helvetica, sans-serif',
                color: '#C28950'
              }}>Voice Demos</h2>
              
              {latestVoiceDemos.length > 0 ? (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem'
                }}>
                  {latestVoiceDemos.map((demo) => (
                    <VoiceDemo key={demo.id} demo={demo} />
                  ))}
                </div>
              ) : (
                <p style={{ color: '#FFFFFF' }}>Loading voice demos...</p>
              )}
            </div>
          </div>
        </section>

        {/* Resumé and Latest Shows Section (stacks on mobile) */}
        <section style={{ 
          marginBottom: '4rem', 
          maxWidth: '1400px', 
          margin: '0 auto 4rem',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 2px 1fr',
          gap: isMobile ? '2rem' : '3rem',
          alignItems: 'start'
        }}>
          {/* Resumé Section - Left */}
          <div style={{ 
            maxWidth: '100%',
            overflow: 'hidden'
          }}>
            <h2 style={{ 
              fontSize: '4rem', 
              marginBottom: '2rem',
              fontFamily: 'UpperEastSide, Arial, Helvetica, sans-serif',
              color: '#C28950'
            }}>Resumé</h2>
            
            {resumeUrl ? (
              <div
                onClick={() => setShowResumeLightbox(true)}
                style={{
                  cursor: 'pointer',
                  backgroundColor: '#FFFFFF',
                  padding: '2rem',
                  borderRadius: '8px',
                  border: '2px solid #C28950',
                  minHeight: '800px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.2s',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <iframe
                  src={resumeUrl}
                  style={{
                    width: '100%',
                    height: '800px',
                    border: 'none',
                    pointerEvents: 'none'
                  }}
                  title="Resume Preview"
                />
              </div>
            ) : (
              <p style={{ color: '#FFFFFF' }}>Loading resumé...</p>
            )}
          </div>

          {/* Divider (hidden on mobile) */}
          {!isMobile && (
            <div style={{ 
              width: '2px', 
              height: '100%', 
              backgroundColor: '#C28950',
              minHeight: '500px'
            }}></div>
          )}

          {/* Latest Shows Section - Right */}
          <div style={{ 
            maxWidth: '100%',
            overflow: 'hidden'
          }}>
            <h2 style={{ 
              fontSize: '4rem', 
              marginBottom: '2rem',
              fontFamily: 'UpperEastSide, Arial, Helvetica, sans-serif',
              color: '#C28950'
            }}>Latest Shows</h2>
            
            {upcomingShows.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {upcomingShows.map((show, index) => (
                  <a
                    key={index}
                    href={show.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      gap: '1.5rem',
                      textDecoration: 'none',
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      alignItems: 'flex-start'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    {/* Show Image */}
                    <div style={{
                      width: '200px',
                      height: '200px',
                      flexShrink: 0,
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: '8px',
                      border: '2px solid #C28950'
                    }}>
                      <Image
                        src={show.image}
                        alt={show.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="200px"
                        unoptimized
                        loading="lazy"
                      />
                    </div>

                    {/* Show Details */}
                    <div style={{ 
                      flex: 1,
                      height: '200px',
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'hidden'
                    }}>
                      {/* Title - single line with ellipsis */}
                      <h3 style={{
                        fontSize: '2.125rem',
                        marginBottom: '0.3rem',
                        fontFamily: 'UpperEastSide, Arial, Helvetica, sans-serif',
                        color: '#C28950',
                        lineHeight: '1.1',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>{show.title}</h3>
                      
                      {/* Date and Location */}
                      {(show.date || show.location) && (
                        <div style={{ marginBottom: '0.5rem' }}>
                          {show.date && (
                            <p style={{
                              fontSize: '1.3rem',
                              color: '#FFFFFF',
                              fontFamily: 'Josefin Sans, Arial, Helvetica, sans-serif',
                              marginBottom: '0.2rem',
                              lineHeight: '1.2',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {show.date}
                            </p>
                          )}
                          {show.location && (
                            <p style={{
                              fontSize: '1.3rem',
                              color: '#FFFFFF',
                              fontFamily: 'Josefin Sans, Arial, Helvetica, sans-serif',
                              marginBottom: '0.2rem',
                              lineHeight: '1.2',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {show.location}
                            </p>
                          )}
                        </div>
                      )}
                      
                      {/* Description - limited lines with ellipsis */}
                      {show.description && (
                        <p style={{
                          fontSize: '1.3rem',
                          color: '#FFFFFF',
                          fontFamily: 'Josefin Sans, Arial, Helvetica, sans-serif',
                          lineHeight: '1.3',
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: (show.date && show.location) ? 2 : (show.date || show.location) ? 3 : 4,
                          WebkitBoxOrient: 'vertical',
                          textOverflow: 'ellipsis'
                        }}>
                          {show.description}
                        </p>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <p style={{ color: '#FFFFFF' }}>No upcoming shows at the moment.</p>
            )}
          </div>
        </section>
      </div>
      
      <Footer />

      {/* Resume Lightbox */}
      {showResumeLightbox && resumeUrl && (
        <div
          onClick={() => setShowResumeLightbox(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              maxWidth: '1200px',
              width: '100%',
              height: '90vh',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <button
              onClick={() => setShowResumeLightbox(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                backgroundColor: '#C28950',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                fontSize: '1.5rem',
                cursor: 'pointer',
                zIndex: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              ×
            </button>
            <iframe
              src={resumeUrl}
              style={{
                width: '100%',
                height: '100%',
                border: 'none'
              }}
              title="Resume"
            />
          </div>
        </div>
      )}
    </div>
    </MediaPlayerProvider>
  )
}
