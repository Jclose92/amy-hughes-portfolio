'use client'

import { useState, useRef, useEffect } from 'react'
import { useMediaPlayer } from '@/contexts/MediaPlayerContext'

interface AudioTileProps {
  url: string
  title: string
  description?: string
  onPlay?: () => void
  onLightboxClick?: () => void
}

export default function AudioTile({ url, title, description, onPlay, onLightboxClick }: AudioTileProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const idRef = useRef(`audio-${Math.random().toString(36).substr(2, 9)}`)
  const mediaPlayer = useMediaPlayer()

  useEffect(() => {
    if (audioRef.current) {
      mediaPlayer.registerPlayer(idRef.current, audioRef.current)
    }
    return () => {
      mediaPlayer.unregisterPlayer(idRef.current)
    }
  }, [mediaPlayer])

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      mediaPlayer.pauseAll(idRef.current)
      audioRef.current.play()
      setIsPlaying(true)
      if (onPlay) onPlay()
    }
  }

  return (
    <div
      style={{ minWidth: '200px', flex: '0 0 auto', cursor: 'pointer' }}
      onClick={togglePlay}
    >
      <div
        style={{
          width: '200px',
          height: '200px',
          background: '#FFFFFF',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          border: '2px solid #C28950'
        }}
      >
        {/* AH Background */}
        <div
          style={{
            position: 'absolute',
            fontSize: '6rem',
            fontFamily: 'UpperEastSide, Arial, Helvetica, sans-serif',
            color: '#C28950',
            opacity: 0.3,
            fontWeight: 'bold',
            userSelect: 'none'
          }}
        >
          AH
        </div>

        {/* Play Button */}
        <div
          style={{
            fontSize: '4rem',
            color: '#C28950',
            zIndex: 1
          }}
        >
          {isPlaying ? '⏸' : '▶'}
        </div>

        {/* Pop-out button */}
        {onLightboxClick && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onLightboxClick()
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
        )}
      </div>

      {/* Title and Description */}
      <div className="gallery-caption" style={{ width: '200px', maxWidth: '200px' }}>
        <p className="gallery-title">
          {title}
        </p>
        {description && (
          <p className="gallery-description">
            {description}
          </p>
        )}
      </div>

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={url}
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />
    </div>
  )
}
