'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export default function Contact() {
  const [formData, setFormData] = useState({
    note: '',
    email: '',
    name: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ note: '', email: '', name: '' })
      } else {
        const errorData = await response.json()
        console.error('Server error:', errorData)
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <>
      <Navigation />
      <main style={{ flex: 1, padding: isMobile ? '1.5rem 1rem' : '3rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 2px 1fr', gap: isMobile ? '2rem' : '4rem' }}>
          {/* Contact Form Section - Left on desktop, second on mobile */}
          {!isMobile && (
          <div style={{ marginTop: 'calc(3rem - 8px)' }}>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                  required
                  style={{ fontFamily: 'Josefin Sans, Arial, Helvetica, sans-serif', height: 'calc(3rem - 8px)' }}
                />
              </div>

              <div className="form-group">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  style={{ fontFamily: 'Josefin Sans, Arial, Helvetica, sans-serif', height: 'calc(3rem - 8px)' }}
                />
              </div>

              <div className="form-group">
                <textarea
                  id="note"
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  placeholder="Message to Amy"
                  rows={8}
                  required
                  style={{ fontFamily: 'Josefin Sans, Arial, Helvetica, sans-serif' }}
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                style={{ 
                  padding: '0.6rem 2.4rem', 
                  fontFamily: 'UpperEastSide, Arial, Helvetica, sans-serif', 
                  marginTop: '-95px', 
                  fontSize: '60%',
                  opacity: isSubmitting ? 0.6 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer'
                }}
              >
                {isSubmitting ? 'Sending...' : 'Send'}
              </button>

              {/* Success Message */}
              {submitStatus === 'success' && (
                <p style={{ 
                  color: '#4CAF50', 
                  marginTop: '1rem', 
                  fontFamily: 'Josefin Sans, Arial, Helvetica, sans-serif',
                  fontSize: '1.2rem'
                }}>
                  ✓ Message sent successfully!
                </p>
              )}

              {/* Error Message */}
              {submitStatus === 'error' && (
                <p style={{ 
                  color: '#f44336', 
                  marginTop: '1rem', 
                  fontFamily: 'Josefin Sans, Arial, Helvetica, sans-serif',
                  fontSize: '1.2rem'
                }}>
                  Failed to send message. Please try again.
                </p>
              )}
            </form>
          </div>
          )}

          {/* Divider (hidden on mobile) */}
          {!isMobile && (
            <div style={{ 
              width: '2px', 
              height: '100%', 
              backgroundColor: '#C28950',
              minHeight: '500px'
            }}></div>
          )}

          {/* Representation Section - Right on desktop, first on mobile */}
          <div>
          <h2 style={{ 
            fontSize: isMobile ? '3rem' : '4rem', 
            marginBottom: '2rem',
            fontFamily: 'UpperEastSide, Arial, Helvetica, sans-serif',
            color: '#C28950',
            marginTop: 'calc(3rem - 28px)'
          }}>Representation</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Acting Section with Logo */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
              <div>
                <h3 style={{ 
                  fontSize: isMobile ? '1.9rem' : '2.55rem', 
                  marginBottom: '0.3rem',
                  fontFamily: 'UpperEastSide, Arial, Helvetica, sans-serif',
                  textTransform: 'uppercase',
                  color: '#FFFFFF',
                  marginTop: 'calc(3rem - 38px)'
                }}>Acting</h3>
                <p style={{ margin: '0.13rem 0', fontSize: isMobile ? '1.4rem' : '1.87rem', lineHeight: '1.3', color: '#FFFFFF' }}>Zach Copeland</p>
                <p style={{ margin: '0.13rem 0', fontSize: isMobile ? '1.4rem' : '1.87rem', lineHeight: '1.3', color: '#FFFFFF' }}>British American Talent</p>
                <p style={{ margin: '0.13rem 0', fontSize: isMobile ? '1.4rem' : '1.87rem', lineHeight: '1.3', color: '#FFFFFF' }}>
                  <a href="mailto:zach@britishamericantalent.com" className="contact-agent-link">
                    zach@britishamericantalent.com
                  </a>
                </p>
                <p style={{ margin: '0.13rem 0', fontSize: isMobile ? '1.4rem' : '1.87rem', lineHeight: '1.3', color: '#FFFFFF' }}>
                  <a href="https://www.britishamericantalent.com" target="_blank" rel="noopener noreferrer" className="contact-agent-link">
                    britishamericantalent.com
                  </a>
                </p>
                <p style={{ margin: '0.13rem 0', fontSize: isMobile ? '1.4rem' : '1.87rem', lineHeight: '1.3', color: '#FFFFFF' }}>+1 323 394 9503</p>
              </div>
              {!isMobile && (
                <Image 
                  src="/images/british-american-talent-logo-light-theme.png" 
                  alt="British American Talent" 
                  width={180}
                  height={90}
                  style={{ 
                    objectFit: 'contain',
                    filter: 'brightness(0) saturate(100%) invert(54%) sepia(18%) saturate(1247%) hue-rotate(353deg) brightness(91%) contrast(87%)',
                    marginTop: '-10px'
                  }}
                />
              )}
            </div>

            {/* Voice Acting Section with Logo */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', marginTop: '0.7rem' }}>
              <div>
                <h3 style={{ 
                  fontSize: isMobile ? '1.9rem' : '2.55rem', 
                  marginBottom: '0.3rem',
                  fontFamily: 'UpperEastSide, Arial, Helvetica, sans-serif',
                  textTransform: 'uppercase',
                  color: '#FFFFFF',
                  whiteSpace: 'nowrap'
                }}>Voice Acting</h3>
                <p style={{ margin: '0.13rem 0', fontSize: isMobile ? '1.4rem' : '1.87rem', lineHeight: '1.3', color: '#FFFFFF' }}>Paul Lynch</p>
                <p style={{ margin: '0.13rem 0', fontSize: isMobile ? '1.4rem' : '1.87rem', lineHeight: '1.3', color: '#FFFFFF' }}>Volcanic Talent</p>
                <p style={{ margin: '0.13rem 0', fontSize: isMobile ? '1.4rem' : '1.87rem', lineHeight: '1.3', color: '#FFFFFF' }}>
                  <a href="mailto:info@volcanic.ie" className="contact-agent-link">
                    info@volcanic.ie
                  </a>
                </p>
                <p style={{ margin: '0.13rem 0', fontSize: isMobile ? '1.4rem' : '1.87rem', lineHeight: '1.3', color: '#FFFFFF' }}>
                  <a href="https://volcanictalent.com/artists/amy-hughes" target="_blank" rel="noopener noreferrer" className="contact-agent-link">
                    volcanictalent.com
                  </a>
                </p>
                <p style={{ margin: '0.13rem 0', fontSize: isMobile ? '1.4rem' : '1.87rem', lineHeight: '1.3', color: '#FFFFFF', whiteSpace: 'nowrap' }}>+353 85 220 7575</p>
              </div>
              {!isMobile && (
                <Image 
                  src="/images/Volcanic-logo-light-theme.png" 
                  alt="Volcanic Talent" 
                  width={240}
                  height={120}
                  style={{ 
                    objectFit: 'contain',
                    filter: 'brightness(0) saturate(100%) invert(54%) sepia(18%) saturate(1247%) hue-rotate(353deg) brightness(91%) contrast(87%)',
                    marginLeft: '110px',
                    marginTop: '80px'
                  }}
                />
              )}
            </div>
          </div>
          </div>

          {/* Contact Form Section - Mobile only (appears after representation) */}
          {isMobile && (
          <div style={{ marginTop: 'calc(3rem - 8px)' }}>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                  required
                  style={{ fontFamily: 'Josefin Sans, Arial, Helvetica, sans-serif', height: 'calc(3rem - 8px)' }}
                />
              </div>

              <div className="form-group">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  style={{ fontFamily: 'Josefin Sans, Arial, Helvetica, sans-serif', height: 'calc(3rem - 8px)' }}
                />
              </div>

              <div className="form-group">
                <textarea
                  id="note"
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  placeholder="Message to Amy"
                  rows={8}
                  required
                  style={{ fontFamily: 'Josefin Sans, Arial, Helvetica, sans-serif' }}
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                style={{ 
                  padding: '0.6rem 2.4rem', 
                  fontFamily: 'UpperEastSide, Arial, Helvetica, sans-serif', 
                  marginTop: '-95px', 
                  fontSize: '60%',
                  opacity: isSubmitting ? 0.6 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer'
                }}
              >
                {isSubmitting ? 'Sending...' : 'Send'}
              </button>

              {/* Success Message */}
              {submitStatus === 'success' && (
                <p style={{ 
                  color: '#4CAF50', 
                  marginTop: '1rem', 
                  fontFamily: 'Josefin Sans, Arial, Helvetica, sans-serif',
                  fontSize: '1.2rem'
                }}>
                  ✓ Message sent successfully!
                </p>
              )}

              {/* Error Message */}
              {submitStatus === 'error' && (
                <p style={{ 
                  color: '#f44336', 
                  marginTop: '1rem', 
                  fontFamily: 'Josefin Sans, Arial, Helvetica, sans-serif',
                  fontSize: '1.2rem'
                }}>
                  Failed to send message. Please try again.
                </p>
              )}
            </form>
          </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
