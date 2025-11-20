'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import InfiniteGallery from '@/components/InfiniteGallery'
import AudioGallery from '@/components/AudioGallery'
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
  isImage?: boolean
}

interface GalleryState {
  items: MediaItem[]
  loading: boolean
}

export default function Acting() {
  const [showreels, setShowreels] = useState<MediaItem[]>([])
  const [voiceDemos, setVoiceDemos] = useState<MediaItem[]>([])
  const [screenGallery, setScreenGallery] = useState<GalleryState>({ items: [], loading: true })
  const [voiceworkGallery, setVoiceworkGallery] = useState<GalleryState>({ items: [], loading: true })
  const [comedyGallery, setComedyGallery] = useState<GalleryState>({ items: [], loading: true })
  const [stageGallery, setStageGallery] = useState<GalleryState>({ items: [], loading: true })
  const [lightboxImage, setLightboxImage] = useState<MediaItem | null>(null)
  const [lightboxGallery, setLightboxGallery] = useState<MediaItem[]>([])
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [showreelsLoading, setShowreelsLoading] = useState(true)
  const [voiceDemosLoading, setVoiceDemosLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [visibleSections, setVisibleSections] = useState({
    screen: false,
    voicework: false,
    comedy: false,
    stage: false
  })
  
  // Refs for Intersection Observer
  const voiceworkRef = useRef<HTMLDivElement>(null)
  const comedyRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  const openLightbox = (item: MediaItem, gallery: MediaItem[], stopInlineVideo?: () => void) => {
    const index = gallery.findIndex(g => g.id === item.id)
    setLightboxGallery(gallery)
    setLightboxIndex(index)
    setLightboxImage(item)
    
    // Stop inline video if a stop function is provided
    if (stopInlineVideo) {
      stopInlineVideo()
    }
  }

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (lightboxGallery.length === 0) return
    
    let newIndex = lightboxIndex
    if (direction === 'next') {
      newIndex = (lightboxIndex + 1) % lightboxGallery.length
    } else {
      newIndex = (lightboxIndex - 1 + lightboxGallery.length) % lightboxGallery.length
    }
    
    setLightboxIndex(newIndex)
    setLightboxImage(lightboxGallery[newIndex])
  }

  useEffect(() => {
    // Fetch showreels
    fetch('/api/media?category=showreels')
      .then(res => res.json())
      .then(data => {
        setShowreels(data.items || [])
        setShowreelsLoading(false)
      })
      .catch(err => {
        console.error('Error loading showreels:', err)
        setShowreelsLoading(false)
      })

    // Fetch voice demos
    fetch('/api/media?category=voicedemos')
      .then(res => res.json())
      .then(data => {
        setVoiceDemos(data.items || [])
        setVoiceDemosLoading(false)
      })
      .catch(err => {
        console.error('Error loading voice demos:', err)
        setVoiceDemosLoading(false)
      })

    // Load screen gallery immediately (it's first on page)
    setVisibleSections(prev => ({ ...prev, screen: true }))
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

  // Progressive loading: Load galleries when they become visible
  useEffect(() => {
    if (visibleSections.screen && screenGallery.loading) {
      fetch('/api/media?category=screen')
        .then(res => res.json())
        .then(data => {
          setScreenGallery({ items: data.items || [], loading: false })
        })
        .catch(err => {
          console.error('Error loading screen gallery:', err)
          setScreenGallery({ items: [], loading: false })
        })
    }
  }, [visibleSections.screen, screenGallery.loading])

  useEffect(() => {
    if (visibleSections.voicework && voiceworkGallery.loading) {
      fetch('/api/media?category=voicework')
        .then(res => res.json())
        .then(data => {
          setVoiceworkGallery({ items: data.items || [], loading: false })
        })
        .catch(err => {
          console.error('Error loading voicework gallery:', err)
          setVoiceworkGallery({ items: [], loading: false })
        })
    }
  }, [visibleSections.voicework, voiceworkGallery.loading])

  useEffect(() => {
    if (visibleSections.comedy && comedyGallery.loading) {
      fetch('/api/media?category=comedy')
        .then(res => res.json())
        .then(data => {
          setComedyGallery({ items: data.items || [], loading: false })
        })
        .catch(err => {
          console.error('Error loading comedy gallery:', err)
          setComedyGallery({ items: [], loading: false })
        })
    }
  }, [visibleSections.comedy, comedyGallery.loading])

  useEffect(() => {
    if (visibleSections.stage && stageGallery.loading) {
      fetch('/api/media?category=stage')
        .then(res => res.json())
        .then(data => {
          setStageGallery({ items: data.items || [], loading: false })
        })
        .catch(err => {
          console.error('Error loading stage gallery:', err)
          setStageGallery({ items: [], loading: false })
        })
    }
  }, [visibleSections.stage, stageGallery.loading])

  // Hide loading screen once showreels and voice demos are loaded
  useEffect(() => {
    if (!showreelsLoading && !voiceDemosLoading) {
      setTimeout(() => setIsLoading(false), 50)
    }
  }, [showreelsLoading, voiceDemosLoading])

  // Intersection Observer for progressive loading
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '200px', // Start loading 200px before section is visible
      threshold: 0
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement
          const section = target.dataset.section
          if (section) {
            setVisibleSections(prev => ({ ...prev, [section]: true }))
          }
        }
      })
    }, options)

    if (voiceworkRef.current) observer.observe(voiceworkRef.current)
    if (comedyRef.current) observer.observe(comedyRef.current)
    if (stageRef.current) observer.observe(stageRef.current)

    return () => observer.disconnect()
  }, [])


  return (
    <MediaPlayerProvider>
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

      <Navigation />
    <div style={{ 
      minHeight: '100vh',
      padding: isMobile ? '6rem 0.75rem 2rem' : '8rem 3rem 3rem',
      position: 'relative',
      maxWidth: '1400px',
      margin: '0 auto'
    }}>
      {/* SEO-optimized header - visually hidden but accessible to search engines */}
      <h1 style={{ 
        position: 'absolute',
        left: '-10000px',
        top: 'auto',
        width: '1px',
        height: '1px',
        overflow: 'hidden'
      }}>
        Amy Hughes - Irish Actress, Comedian & Voiceover Artist Portfolio
      </h1>
      <div style={{ 
        position: 'absolute',
        left: '-10000px',
        top: 'auto',
        width: '1px',
        height: '1px',
        overflow: 'hidden'
      }}>
        <p>
          Amy Hughes is a professional Dublin-based actress, comedian, improviser, and voiceover artist of Welsh-Kiwi descent. 
          Specializing in dark comedy drama and character acting, Amy delivers compelling performances across Irish screen, stage, and voiceover work. 
          Her portfolio includes award-winning film roles, Irish television credits, Dublin theatre performances, and commercial voiceover projects. 
          As an experienced improviser with Cool Baby and Bum Notes, she brings versatility to comedy performances throughout Ireland.
        </p>
      </div>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr' : '1fr 2px 1fr', 
        gap: isMobile ? '2rem' : '3rem',
        alignItems: 'start'
      }}>
        {/* Showreels Section */}
        <div style={{ maxWidth: isMobile ? '100%' : 'none', overflow: 'hidden' }}>
          <h2 style={{ 
            fontSize: '4rem', 
            marginBottom: '2rem',
            fontFamily: 'UpperEastSide, Arial, Helvetica, sans-serif',
            color: '#C28950'
          }}>Acting Showreels</h2>
          
          {showreelsLoading ? (
            <p style={{ color: '#FFFFFF' }}>Loading showreels...</p>
          ) : showreels.length === 0 ? (
            <p style={{ color: '#FFFFFF' }}>No showreels available.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {showreels.map((reel, index) => (
                <div key={reel.id}>
                  {reel.title && (
                    <h3 style={{
                      color: '#FFFFFF',
                      marginBottom: '0.5rem',
                      fontFamily: 'UpperEastSide, Arial, Helvetica, sans-serif',
                      fontSize: '2rem'
                    }}>{reel.title}</h3>
                  )}
                  <div style={{ 
                    position: 'relative',
                    width: '100%',
                    maxWidth: isMobile ? '100%' : '500px',
                    aspectRatio: '16 / 9',
                    height: 'auto'
                  }}>
                    <iframe
                      src={`https://drive.google.com/file/d/${reel.id}/preview`}
                      allow="autoplay"
                      title={reel.title || `Showreel ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        border: '2px solid #C28950',
                        borderRadius: '8px'
                      }}
                    ></iframe>
                  </div>
                  {reel.description && (
                    <p style={{ color: '#FFFFFF', marginTop: '0.5rem', fontFamily: 'Josefin Sans, Arial, Helvetica, sans-serif' }}>
                      {reel.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
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

        {/* Voice Demos Section */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', maxWidth: isMobile ? '100%' : 'none', overflow: 'hidden' }}>
          <h2 style={{ 
            fontSize: '4rem', 
            marginBottom: '2rem',
            fontFamily: 'UpperEastSide, Arial, Helvetica, sans-serif',
            color: '#C28950'
          }}>Voiceover Demos</h2>
          
          {voiceDemosLoading ? (
            <p style={{ color: '#FFFFFF' }}>Loading voice demos...</p>
          ) : voiceDemos.length === 0 ? (
            <p style={{ color: '#FFFFFF' }}>No voice demos available.</p>
          ) : (
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}>
              {voiceDemos.map((demo) => (
                <VoiceDemo key={demo.id} demo={demo} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Latest Work Section - 4 Galleries */}
      <div style={{ marginTop: '5rem' }}>
        <h2 style={{ 
          fontFamily: 'UpperEastSide, Arial, Helvetica, sans-serif', 
          color: '#C28950',
          fontSize: '5.6rem',
          marginBottom: '1.5rem'
        }}>Latest Work</h2>

        {/* Screen Gallery */}
        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{ 
            fontFamily: 'UpperEastSide, Arial, Helvetica, sans-serif', 
            color: '#FFFFFF',
            fontSize: '3.75rem',
            marginBottom: '1rem'
          }}>Screen Work</h3>
          {screenGallery.loading ? (
            <p style={{ color: '#FFFFFF' }}>Loading...</p>
          ) : (
            <InfiniteGallery items={screenGallery.items} onItemClick={(item, stopVideo) => openLightbox(item, screenGallery.items, stopVideo)} />
          )}
        </div>

        {/* Voicework Gallery */}
        <div ref={voiceworkRef} data-section="voicework" style={{ marginBottom: '3rem' }}>
          <h3 style={{ 
            fontFamily: 'UpperEastSide, Arial, Helvetica, sans-serif', 
            color: '#FFFFFF',
            fontSize: '3.75rem',
            marginBottom: '1rem'
          }}>Voice Acting</h3>
          {voiceworkGallery.loading ? (
            <p style={{ color: '#FFFFFF' }}>Loading...</p>
          ) : (
            <AudioGallery items={voiceworkGallery.items} onItemClick={(item) => openLightbox(item, voiceworkGallery.items)} />
          )}
        </div>

        {/* Comedy Gallery */}
        <div ref={comedyRef} data-section="comedy" style={{ marginBottom: '3rem' }}>
          <h3 style={{ 
            fontFamily: 'UpperEastSide, Arial, Helvetica, sans-serif', 
            color: '#FFFFFF',
            fontSize: '3.75rem',
            marginBottom: '1rem'
          }}>Comedy & Improv</h3>
          {comedyGallery.loading ? (
            <p style={{ color: '#FFFFFF' }}>Loading...</p>
          ) : (
            <InfiniteGallery items={comedyGallery.items} onItemClick={(item, stopVideo) => openLightbox(item, comedyGallery.items, stopVideo)} />
          )}
        </div>

        {/* Stage Gallery */}
        <div ref={stageRef} data-section="stage" style={{ marginBottom: '3rem' }}>
          <h3 style={{ 
            fontFamily: 'UpperEastSide, Arial, Helvetica, sans-serif', 
            color: '#FFFFFF',
            fontSize: '3.75rem',
            marginBottom: '1rem'
          }}>Theatre & Stage</h3>
          {stageGallery.loading ? (
            <p style={{ color: '#FFFFFF' }}>Loading...</p>
          ) : (
            <InfiniteGallery items={stageGallery.items} onItemClick={(item, stopVideo) => openLightbox(item, stageGallery.items, stopVideo)} />
          )}
        </div>

        {lightboxImage && (
          <div className="lightbox" onClick={() => setLightboxImage(null)}>
            <button className="lightbox-close" onClick={() => setLightboxImage(null)}>
              ×
            </button>
            
            {/* Previous Arrow */}
            {lightboxGallery.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  navigateLightbox('prev')
                }}
                style={{
                  position: 'absolute',
                  left: '2rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: '#C28950',
                  fontSize: '4rem',
                  cursor: 'pointer',
                  padding: '0',
                  width: '4rem',
                  height: '4rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1001,
                  lineHeight: 1
                }}
                aria-label="Previous"
              >
                ‹
              </button>
            )}
            
            {/* Next Arrow */}
            {lightboxGallery.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  navigateLightbox('next')
                }}
                style={{
                  position: 'absolute',
                  right: '2rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: '#C28950',
                  fontSize: '4rem',
                  cursor: 'pointer',
                  padding: '0',
                  width: '4rem',
                  height: '4rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1001,
                  lineHeight: 1
                }}
                aria-label="Next"
              >
                ›
              </button>
            )}
            
            <div style={{ textAlign: 'center', width: '100%', padding: '0 8rem' }}>
              {lightboxImage.isVideo ? (
                <div 
                  style={{ 
                    position: 'relative',
                    width: '70%',
                    aspectRatio: '16 / 9',
                    margin: '0 auto'
                  }}
                >
                  <iframe
                    src={`https://drive.google.com/file/d/${lightboxImage.id}/preview?autoplay=1`}
                    allow="autoplay"
                    title={lightboxImage.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      border: '2px solid #C28950',
                      borderRadius: '8px'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  ></iframe>
                </div>
              ) : lightboxImage.isAudio ? (
                <div style={{ 
                  width: '70%',
                  margin: '0 auto',
                  padding: '3rem',
                  background: '#FFFFFF',
                  borderRadius: '12px',
                  border: '3px solid #C28950'
                }}>
                  <div
                    style={{
                      fontSize: '12rem',
                      fontFamily: 'UpperEastSide, Arial, Helvetica, sans-serif',
                      color: '#C28950',
                      opacity: 0.3,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      marginBottom: '2rem'
                    }}
                  >
                    AH
                  </div>
                  <audio
                    controls
                    src={lightboxImage.url}
                    style={{
                      width: '100%',
                      outline: 'none'
                    }}
                    autoPlay
                  />
                </div>
              ) : (
                <Image
                  src={lightboxImage.url}
                  alt={lightboxImage.title}
                  width={1200}
                  height={800}
                  style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }}
                />
              )}
              <div style={{ marginTop: '1rem' }}>
                <p style={{ 
                  color: '#C28950', 
                  fontSize: '2.5rem', 
                  fontFamily: 'UpperEastSide, Arial, Helvetica, sans-serif',
                  marginBottom: '0.5rem'
                }}>
                  {lightboxImage.title}
                </p>
                {lightboxImage.description && (
                  <p style={{ 
                    color: '#FFFFFF', 
                    fontSize: '1.5rem', 
                    fontFamily: 'Josefin Sans, Arial, Helvetica, sans-serif',
                    opacity: 0.9
                  }}>
                    {lightboxImage.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    <Footer />
    </MediaPlayerProvider>
  )
}
