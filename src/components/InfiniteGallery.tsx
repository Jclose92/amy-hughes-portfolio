'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

interface MediaItem {
  id: string
  title: string
  description: string
  url: string
  mimeType?: string
  isVideo?: boolean
  isAudio?: boolean
  isImage?: boolean
}

interface InfiniteGalleryProps {
  items: MediaItem[]
  onItemClick: (item: MediaItem, stopVideo?: () => void) => void
  currentIndex?: number
  onNavigate?: (direction: 'prev' | 'next') => void
}

export default function InfiniteGallery({ items, onItemClick }: InfiniteGalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [playingVideos, setPlayingVideos] = useState<Set<string>>(new Set())
  
  // Triple the items for infinite scroll effect
  const infiniteItems = items.length > 0 ? [...items, ...items, ...items] : []

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    
    const scrollAmount = 220 * 3 // (200px item + 20px gap) * 3 items
    const newScrollLeft = scrollRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount)
    
    scrollRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 2 // Scroll speed multiplier
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  const handleScroll = () => {
    if (!scrollRef.current || items.length === 0) return
    
    const container = scrollRef.current
    const avgItemWidth = 278 // Average between video (356) and image (200) + gap
    const sectionWidth = avgItemWidth * items.length
    
    // If scrolled past the second set, jump back to first set
    if (container.scrollLeft >= sectionWidth * 2) {
      container.scrollLeft = sectionWidth
    }
    // If scrolled before the first set, jump to second set
    else if (container.scrollLeft <= 10) {
      container.scrollLeft = sectionWidth
    }
  }

  // Initialize scroll position to middle section for seamless wrap-around
  useEffect(() => {
    if (scrollRef.current && items.length > 0) {
      const avgItemWidth = 278
      const sectionWidth = avgItemWidth * items.length
      scrollRef.current.scrollLeft = sectionWidth
    }
  }, [items])

  if (items.length === 0) {
    return <p style={{ color: '#FFFFFF' }}>No items available.</p>
  }

  return (
    <div style={{ position: 'relative', paddingLeft: '50px', paddingRight: '50px' }}>
      {/* Left Arrow */}
      <button
        onClick={() => scroll('left')}
        style={{
          position: 'absolute',
          left: '0',
          top: '100px', // Center of 200px image
          transform: 'translateY(-50%)',
          zIndex: 10,
          background: 'transparent',
          border: 'none',
          color: '#C28950',
          fontSize: '3rem',
          cursor: 'pointer',
          padding: '0.5rem',
          lineHeight: 1
        }}
        aria-label="Scroll left"
      >
        ‹
      </button>

      {/* Gallery Container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{
          display: 'flex',
          gap: '1rem',
          overflowX: 'scroll',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          paddingBottom: '1rem',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none'
        }}
        className="hide-scrollbar"
      >
        {infiniteItems.map((item, index) => {
          // Videos use 16:9 aspect ratio, images stay square
          const itemWidth = item.isVideo ? 356 : 200  // 16:9 at 200px height = 356px width
          const itemHeight = 200
          
          return (
          <div
            key={`${item.id}-${index}`}
            className="gallery-item-container"
            style={{ minWidth: `${itemWidth}px`, flex: '0 0 auto', display: 'flex', flexDirection: 'column' }}
          >
            <div
              className="gallery-item"
              style={{
                width: `${itemWidth}px`,
                height: `${itemHeight}px`,
                position: 'relative',
                cursor: item.isVideo ? 'pointer' : 'pointer',
                marginBottom: '0.5rem'
              }}
            >
              {item.isVideo ? (
                // Show thumbnail first, load iframe on click
                <div style={{
                  width: `${itemWidth}px`,
                  height: `${itemHeight}px`,
                  position: 'relative',
                  border: '2px solid #C28950',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  background: '#000000'
                }}>
                  {playingVideos.has(`${item.id}-${index}`) ? (
                    // Show iframe when playing
                    <>
                      <iframe
                        id={`video-iframe-${item.id}-${index}`}
                        src={`https://drive.google.com/file/d/${item.id}/preview`}
                        allow="autoplay"
                        title={item.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          border: 'none',
                          borderRadius: '8px'
                        }}
                      />
                      {/* Pop-out button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          // Create a callback to stop this video
                          const stopVideo = () => {
                            setPlayingVideos(prev => {
                              const newSet = new Set(prev)
                              newSet.delete(`${item.id}-${index}`)
                              return newSet
                            })
                          }
                          // Open lightbox and pass the stop callback
                          onItemClick(item, stopVideo)
                        }}
                        style={{
                          position: 'absolute',
                          top: '1.25rem',
                          right: '1.25rem',
                          width: '28px',
                          height: '28px',
                          minWidth: '28px',
                          minHeight: '28px',
                          background: 'rgba(28, 28, 28, 0.9)',
                          border: 'none',
                          borderRadius: '4px',
                          color: '#FFFFFF',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.9rem',
                          lineHeight: 1,
                          padding: 0,
                          zIndex: 100,
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(28, 28, 28, 1)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(28, 28, 28, 0.9)'}
                        title="Open in lightbox"
                      >
                        ↗
                      </button>
                    </>
                  ) : (
                    // Show thumbnail with play button
                    <div 
                      onClick={() => {
                        setPlayingVideos(prev => new Set(prev).add(`${item.id}-${index}`))
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                        position: 'relative',
                        cursor: 'pointer'
                      }}
                    >
                      <Image
                        src={`https://drive.google.com/thumbnail?id=${item.id}&sz=w400`}
                        alt={item.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes={`${itemWidth}px`}
                        unoptimized
                        loading="lazy"
                      />
                      {/* Play button overlay */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <div style={{
                          fontSize: '3rem',
                          color: '#FFFFFF',
                          textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                        }}>▶</div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div onClick={() => onItemClick(item)} style={{ width: '100%', height: '100%' }}>
                  <Image
                    src={item.url}
                    alt={item.title}
                    fill
                    style={{ objectFit: 'cover', borderRadius: '8px' }}
                    sizes="200px"
                    loading="lazy"
                  />
                </div>
              )}
            </div>
            <div className="gallery-caption" style={{ width: `${itemWidth}px`, maxWidth: `${itemWidth}px` }}>
              <p className="gallery-title">
                {item.title}
              </p>
              {item.description && (
                <p className="gallery-description">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        )
        })}
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => scroll('right')}
        style={{
          position: 'absolute',
          right: '0',
          top: '100px', // Center of 200px image
          transform: 'translateY(-50%)',
          zIndex: 10,
          background: 'transparent',
          border: 'none',
          color: '#C28950',
          fontSize: '3rem',
          cursor: 'pointer',
          padding: '0.5rem',
          lineHeight: 1
        }}
        aria-label="Scroll right"
      >
        ›
      </button>
    </div>
  )
}
