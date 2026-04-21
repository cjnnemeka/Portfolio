'use client'

import { useState, useEffect, useCallback } from 'react'

interface ImageLightboxProps {
  src: string
  alt: string
  style?: React.CSSProperties
  className?: string
}

export default function ImageLightbox({ src, alt, style, className }: ImageLightboxProps) {
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false)

  const openLightbox = () => {
    setOpen(true)
    requestAnimationFrame(() => setVisible(true))
    document.body.style.overflow = 'hidden'
    // Pause Lenis smooth scroll — otherwise wheel events oscillate against the locked body and blink the page.
    window.__lenis?.stop()
  }

  const closeLightbox = useCallback(() => {
    setVisible(false)
    setTimeout(() => {
      setOpen(false)
      document.body.style.overflow = ''
      window.__lenis?.start()
    }, 200)
  }, [])

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, closeLightbox])

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={className}
        style={{
          ...style,
          cursor: 'zoom-in',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.03)'
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.5)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = style?.boxShadow as string || ''
        }}
        onClick={openLightbox}
      />

      {open && (
        <div
          onClick={closeLightbox}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: visible ? 1 : 0,
            transition: 'opacity 200ms ease',
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation()
              closeLightbox()
            }}
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '32px',
              cursor: 'pointer',
              opacity: 0.7,
              transition: 'opacity 0.2s ease',
              lineHeight: 1,
              padding: '8px',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '1' }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.7' }}
          >
            ✕
          </button>
          <img
            src={src}
            alt={alt}
            onClick={(e) => e.stopPropagation()}
            className="lightbox-expanded"
            style={{
              maxWidth: '80vw',
              maxHeight: '80vh',
              objectFit: 'contain',
            }}
          />
        </div>
      )}
    </>
  )
}
