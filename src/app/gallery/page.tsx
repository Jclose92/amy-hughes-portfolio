'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

const IMAGES_PER_PAGE = 10

interface GalleryItem {
  id: string
  title: string
  description: string
  url: string
}

export default function Gallery() {
  const [currentPage, setCurrentPage] = useState(0)
  const [lightboxImage, setLightboxImage] = useState<GalleryItem | null>(null)
  const [galleryData, setGalleryData] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch gallery images from API
    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => {
        setGalleryData(data.images || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading gallery:', err)
        setLoading(false)
      })
  }, [])

  const totalPages = Math.ceil(galleryData.length / IMAGES_PER_PAGE)
  const startIndex = currentPage * IMAGES_PER_PAGE
  const currentImages = galleryData.slice(startIndex, startIndex + IMAGES_PER_PAGE)

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  return (
    <>
    <Navigation />
    <main style={{ flex: 1, padding: '3rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
      <h1 style={{ fontFamily: 'UpperEastSide, Arial, Helvetica, sans-serif', color: '#FFFFFF' }}>Gallery</h1>
      <p style={{ color: '#FFFFFF' }}>A collection of photos from various productions and events.</p>
      
      {loading ? (
        <p style={{ color: '#FFFFFF', textAlign: 'center', padding: '3rem' }}>Loading gallery...</p>
      ) : galleryData.length === 0 ? (
        <p style={{ color: '#FFFFFF', textAlign: 'center', padding: '3rem' }}>No images found in gallery.</p>
      ) : (
      <div className="gallery-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
        {currentImages.map((item, index) => (
          <div 
            key={startIndex + index} 
            className="gallery-item-container"
          >
            <div 
              className="gallery-item"
              onClick={() => setLightboxImage(item)}
            >
              <Image
                src={item.url}
                alt={item.title}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            <div className="gallery-caption">
              <p className="gallery-title">{item.title}</p>
              {item.description && (
                <p className="gallery-description">{item.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      )}

      {!loading && galleryData.length > 0 && (
      <div className="gallery-nav">
        <button onClick={handlePrevious} disabled={currentPage === 0}>
          Prev
        </button>
        <button onClick={handleNext} disabled={currentPage === totalPages - 1}>
          Next
        </button>
      </div>
      )}

      {lightboxImage && (
        <div className="lightbox" onClick={() => setLightboxImage(null)}>
          <button className="lightbox-close" onClick={() => setLightboxImage(null)}>
            ×
          </button>
          <div style={{ textAlign: 'center', maxWidth: '90%' }}>
            <Image
              src={lightboxImage.url}
              alt={lightboxImage.title}
              width={1200}
              height={800}
              style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }}
            />
            <div style={{ marginTop: '1rem' }}>
              <p style={{ 
                color: '#FFFFFF', 
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
    </main>
    <Footer />
    </>
  )
}
