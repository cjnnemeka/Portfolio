'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { projects } from '@/data/projects'
import { asset } from '@/lib/utils'

export default function ImmersiveHero() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  // Scene 1: Headline (fades in, holds, fades out)
  const s1Opacity = useTransform(scrollYProgress, [0, 0.06, 0.30, 0.42], [0, 1, 1, 0])
  const s1Y = useTransform(scrollYProgress, [0, 0.08, 0.42], [40, 0, -24])

  // Scene 2: Work preview (fades in after headline, holds, fades out)
  const s2Opacity = useTransform(scrollYProgress, [0.38, 0.52, 0.80, 0.90], [0, 1, 1, 0])
  const s2Y = useTransform(scrollYProgress, [0.38, 0.56], [56, 0])

  // Scroll indicator (visible at start only)
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.04, 0.12], [1, 1, 0])

  return (
    <div ref={containerRef} style={{ height: '350vh' }}>
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>

        {/* ── Scene 1: Headline ── */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '80px 48px 0',
            opacity: s1Opacity,
            y: s1Y,
            pointerEvents: 'none',
          }}
        >
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.5625rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            marginBottom: '40px',
          }}>
            Cj Nnemeka — Product Designer
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.75rem, 7.5vw, 7rem)',
            fontWeight: 700,
            letterSpacing: '-0.045em',
            lineHeight: 1.0,
            color: 'var(--text-primary)',
            maxWidth: '880px',
          }}>
            I turn ambiguity<br />into usable products.
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1rem',
            color: 'var(--text-secondary)',
            marginTop: '32px',
            fontWeight: 300,
            lineHeight: 1.65,
            maxWidth: '460px',
          }}>
            Senior product designer for AI-native SaaS — I take designs all the way to production.
          </p>

          {/* Status pills */}
          <div style={{
            display: 'flex',
            gap: '10px',
            marginTop: '40px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            {['Available', 'United States', 'AI-Native SaaS'].map((label) => (
              <span key={label} style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.5625rem',
                color: 'var(--text-muted)',
                padding: '5px 14px',
                border: '1px solid var(--border)',
                borderRadius: '100px',
                letterSpacing: '0.08em',
              }}>
                {label}
              </span>
            ))}
          </div>
        </motion.div>

        {/* ── Scene 2: Work preview grid ── */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '100px 48px 48px',
            opacity: s2Opacity,
            y: s2Y,
            pointerEvents: 'none',
          }}
        >
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.5625rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            marginBottom: '28px',
          }}>
            Selected Work — {String(projects.length).padStart(2, '0')} Projects
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '14px',
            width: 'min(840px, 82vw)',
          }}>
            {projects.map((project) => (
              <div
                key={project.slug}
                style={{
                  position: 'relative',
                  aspectRatio: '16 / 10',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid var(--border)',
                  backgroundColor: 'var(--bg-card)',
                }}
              >
                {project.thumbnail && (
                  <img
                    src={asset(project.thumbnail)}
                    alt={project.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    draggable={false}
                  />
                )}
                {/* Title overlay */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '20px 16px 14px',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    color: '#fff',
                    letterSpacing: '-0.02em',
                  }}>
                    {project.title}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.5625rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginTop: '28px',
          }}>
            Keep scrolling to explore ↓
          </p>
        </motion.div>

        {/* ── Scroll indicator ── */}
        <motion.div
          style={{
            position: 'absolute',
            bottom: '40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            opacity: scrollOpacity,
          }}
        >
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.5625rem',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
          }}>
            Scroll
          </span>
          <motion.div
            animate={{ height: ['12px', '28px', '12px'] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            style={{ width: '1px', backgroundColor: 'var(--text-muted)' }}
          />
        </motion.div>

      </div>
    </div>
  )
}
