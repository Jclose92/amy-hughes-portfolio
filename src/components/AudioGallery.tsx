'use client'

import { useState, useRef } from 'react'
import AudioTile from './AudioTile'

interface MediaItem {
  id: string
  title: string
  description: string
  url: string
  mimeType?: string
  isAudio?: boolean
}

interface AudioGalleryProps {
  items: MediaItem[]
  onItemClick?: (item: MediaItem) => void
}

export default function AudioGallery({ items, onItemClick }: AudioGalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null)

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
    const walk = (x - startX) * 2
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
    const itemWidth = 220
    const sectionWidth = itemWidth * items.length
    
    if (container.scrollLeft >= sectionWidth * 2) {
      container.scrollLeft = sectionWidth
    } else if (container.scrollLeft <= 0) {
      container.scrollLeft = sectionWidth
    }
  }

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
          top: '100px',
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
        {infiniteItems.map((item, index) => (
          <AudioTile
            key={`${item.id}-${index}`}
            url={item.url}
            title={item.title}
            description={item.description}
            onPlay={() => setCurrentlyPlaying(item.id)}
            onLightboxClick={onItemClick ? () => onItemClick(item) : undefined}
          />
        ))}
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => scroll('right')}
        style={{
          position: 'absolute',
          right: '0',
          top: '100px',
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
