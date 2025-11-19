'use client'

import { createContext, useContext, useRef, ReactNode } from 'react'

interface MediaPlayerContextType {
  registerPlayer: (id: string, element: HTMLAudioElement | HTMLVideoElement | HTMLIFrameElement) => void
  unregisterPlayer: (id: string) => void
  pauseAll: (exceptId?: string) => void
}

const MediaPlayerContext = createContext<MediaPlayerContextType | null>(null)

export function MediaPlayerProvider({ children }: { children: ReactNode }) {
  const playersRef = useRef<Map<string, HTMLAudioElement | HTMLVideoElement | HTMLIFrameElement>>(new Map())

  const registerPlayer = (id: string, element: HTMLAudioElement | HTMLVideoElement | HTMLIFrameElement) => {
    playersRef.current.set(id, element)
  }

  const unregisterPlayer = (id: string) => {
    playersRef.current.delete(id)
  }

  const pauseAll = (exceptId?: string) => {
    playersRef.current.forEach((element, id) => {
      if (id !== exceptId) {
        if (element instanceof HTMLAudioElement || element instanceof HTMLVideoElement) {
          element.pause()
        }
      }
    })
  }

  return (
    <MediaPlayerContext.Provider value={{ registerPlayer, unregisterPlayer, pauseAll }}>
      {children}
    </MediaPlayerContext.Provider>
  )
}

export function useMediaPlayer() {
  const context = useContext(MediaPlayerContext)
  if (!context) {
    throw new Error('useMediaPlayer must be used within a MediaPlayerProvider')
  }
  return context
}
