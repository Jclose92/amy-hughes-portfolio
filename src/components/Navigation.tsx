'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Navigation() {
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

  return (
    <nav style={{ display: 'flex', gap: isMobile ? '0.5rem' : '3rem', alignItems: 'center', padding: isMobile ? '0 0.35rem' : '0', flexWrap: 'wrap' }}>
      <Link href="/" style={{
        color: '#C28950',
        fontSize: isMobile ? '1.85rem' : '3.12rem',
        textShadow: '1px 1px 3px rgba(0, 0, 0, 0.5)',
        marginRight: 'auto',
        fontFamily: 'UpperEastSide, Arial, Helvetica, sans-serif',
        textDecoration: 'none'
      }}>{isMobile ? 'AH' : 'Amy Hughes'}</Link>
      <div style={{ display: 'flex', gap: isMobile ? '0.5rem' : '3rem', marginRight: 'auto', marginLeft: 'auto', flexWrap: 'wrap' }}>
        <Link href="/" style={{
          color: '#C28950',
          textDecoration: 'none',
          fontSize: isMobile ? '1.7rem' : '3.12rem',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap'
        }}>Amy</Link>
        <Link href="/acting" style={{
          color: '#C28950',
          textDecoration: 'none',
          fontSize: isMobile ? '1.7rem' : '3.12rem',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap'
        }}>Work</Link>
        <Link href="/contact" style={{
          color: '#C28950',
          textDecoration: 'none',
          fontSize: isMobile ? '1.7rem' : '3.12rem',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap'
        }}>Contact</Link>
      </div>
    </nav>
  )
}
