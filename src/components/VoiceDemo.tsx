'use client'

import { useState, useRef, useEffect } from 'react'
import { useMediaPlayer } from '@/contexts/MediaPlayerContext'

interface VoiceDemoProps {
  demo: {
    id: string
    title: string
    url: string
    description?: string
  }
}

export default function VoiceDemo({ demo }: VoiceDemoProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const idRef = useRef(`voice-demo-${demo.id}`)
  const mediaPlayer = useMediaPlayer()
  const [isMobile, setIsMobile] = useState(false)

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
    if (audioRef.current) {
      mediaPlayer.registerPlayer(idRef.current, audioRef.current)
      
      const handlePlay = () => {
        mediaPlayer.pauseAll(idRef.current)
      }
      
      audioRef.current.addEventListener('play', handlePlay)
      
      return () => {
        mediaPlayer.unregisterPlayer(idRef.current)
        if (audioRef.current) {
          audioRef.current.removeEventListener('play', handlePlay)
        }
      }
    }
  }, [mediaPlayer, demo.id])

  return (
    <div key={demo.id} style={{ 
      maxWidth: isMobile ? 'calc(100vw - 4rem)' : '500px', 
      width: isMobile ? 'calc(100vw - 4rem)' : '100%', 
      overflow: 'hidden', 
      boxSizing: 'border-box' 
    }}>
      <h3 style={{
        color: '#FFFFFF',
        marginBottom: '0.5rem',
        fontFamily: 'UpperEastSide, Arial, Helvetica, sans-serif',
        fontSize: '2rem',
        boxSizing: 'border-box'
      }}>{demo.title}</h3>
      <div style={{
        padding: '0.5rem',
        background: '#1a1a1a',
        border: '2px solid #C28950',
        borderRadius: '8px',
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}>
        <audio ref={audioRef} controls style={{ width: '100%', boxSizing: 'border-box', display: 'block' }}>
          <source src={demo.url} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
      {demo.description && (
        <p style={{ color: '#FFFFFF', marginTop: '0.5rem', fontSize: '1.64rem', fontFamily: 'Josefin Sans, Arial, Helvetica, sans-serif' }}>
          {demo.description}
        </p>
      )}
    </div>
  )
}
