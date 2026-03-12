'use client'

import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ImageLightbox from '@/components/ImageLightbox'

interface ScreenItem {
  label: string
  description?: string
  src?: string
}

interface ScreenCarouselProps {
  screens: ScreenItem[]
  accentColor: string
}

export default function ScreenCarousel({ screens, accentColor }: ScreenCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [cardWidth, setCardWidth] = useState(640)
  const cardGap = 24  // gap between cards

  // Responsive card width
  useEffect(() => {
    const updateWidth = () => {
      setCardWidth(window.innerWidth < 768 ? Math.min(window.innerWidth - 56, 400) : 640)
    }
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  // Update current index on scroll
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const handleScroll = () => {
      const index = Math.round(el.scrollLeft / (cardWidth + cardGap))
      setCurrentIndex(Math.min(index, screens.length - 1))
    }
    el.addEventListener('scroll', handleScroll)
    return () => el.removeEventListener('scroll', handleScroll)
  }, [screens.length])

  const scrollTo = (direction: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const scrollAmount = cardWidth + cardGap
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0))
    setScrollLeft(scrollRef.current?.scrollLeft || 0)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0)
    const walk = (x - startX) * 1.5
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft - walk
    }
  }

  const handleMouseUp = () => setIsDragging(false)
  const handleMouseLeave = () => setIsDragging(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Header row: arrows + counter */}
      <div className="responsive-padding" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        padding: '0 48px',
      }}>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6875rem',
          fontWeight: 500,
          color: 'var(--text-muted)',
          letterSpacing: '0.08em',
        }}>
          {String(currentIndex + 1).padStart(2, '0')} / {String(screens.length).padStart(2, '0')}
        </p>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => scrollTo('left')}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: `1px solid var(--border)`,
              backgroundColor: 'transparent',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = accentColor
              e.currentTarget.style.color = accentColor
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.color = 'var(--text-secondary)'
            }}
          >
            ←
          </button>
          <button
            onClick={() => scrollTo('right')}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: `1px solid var(--border)`,
              backgroundColor: 'transparent',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = accentColor
              e.currentTarget.style.color = accentColor
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.color = 'var(--text-secondary)'
            }}
          >
            →
          </button>
        </div>
      </div>

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="screen-carousel"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{
          display: 'flex',
          gap: `${cardGap}px`,
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          paddingLeft: '48px',
          paddingRight: '48px',
          paddingBottom: '16px',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          /* Hide scrollbar */
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        {screens.map((screen, index) => (
          <div
            key={index}
            style={{
              flexShrink: 0,
              width: `${cardWidth}px`,
              scrollSnapAlign: 'start',
            }}
          >
            {/* Screen placeholder or image */}
            {screen.src ? (
              <div style={{
                width: '100%',
                aspectRatio: '16 / 10',
                backgroundColor: 'var(--bg-card)',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                overflow: 'hidden',
                marginBottom: '12px',
                transition: 'border-color 0.4s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-hover)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)'
              }}
              >
                <ImageLightbox
                  src={screen.src}
                  alt={screen.label}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
            ) : (
              <div style={{
                width: '100%',
                aspectRatio: '16 / 10',
                backgroundColor: 'var(--bg-card)',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'border-color 0.4s ease, background-color 0.4s ease',
                marginBottom: '12px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-hover)'
                e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.backgroundColor = 'var(--bg-card)'
              }}
              >
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}>
                  [{screen.label}]
                </span>
              </div>
            )}

            {/* Label */}
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: 'var(--text-secondary)',
              marginBottom: '4px',
            }}>
              {screen.label}
            </p>
            {screen.description && (
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.75rem',
                fontWeight: 400,
                color: 'var(--text-muted)',
                lineHeight: 1.4,
              }}>
                {screen.description}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Progress dots */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '6px',
        marginTop: '20px',
      }}>
        {screens.map((_, index) => (
          <div
            key={index}
            style={{
              width: index === currentIndex ? '24px' : '6px',
              height: '6px',
              borderRadius: '3px',
              backgroundColor: index === currentIndex ? accentColor : 'var(--border)',
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}
