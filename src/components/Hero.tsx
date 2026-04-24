'use client'

import { motion } from 'framer-motion'

const revealLine = {
  hidden: { y: '110%', rotate: 3 },
  visible: (i: number) => ({
    y: '0%',
    rotate: 0,
    transition: {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1] as const,
      delay: 0.15 + i * 0.1,
    },
  }),
}

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1] as const,
      delay: 0.7 + i * 0.12,
    },
  }),
}

export default function Hero() {
  const headlineLines = [
    { text: 'I turn ambiguity', weight: 700 },
    { text: 'into usable products.', weight: 700 },
  ]

  return (
    <section className="responsive-padding" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      padding: '0 48px 64px 48px',
      position: 'relative',
    }}>
      {/* Headline */}
      <div style={{ marginBottom: '48px' }}>
        {headlineLines.map((line, i) => (
          <div key={i} style={{ overflow: 'hidden', lineHeight: 1 }}>
            <motion.div
              custom={i}
              initial="hidden"
              animate="visible"
              variants={revealLine}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3.5rem, 9vw, 8rem)',
                fontWeight: line.weight,
                letterSpacing: '-0.045em',
                color: 'var(--text-primary)',
                lineHeight: 1.05,
                paddingBottom: '8px',
              }}
            >
              {line.text}
            </motion.div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
        style={{
          height: '1px',
          backgroundColor: 'var(--border-hover)',
          transformOrigin: 'left',
          marginBottom: '32px',
        }}
      />

      {/* Info row */}
      <div className="responsive-flex" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        gap: '48px',
      }}>
        {/* Left: description */}
        <motion.p
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.0625rem',
            fontWeight: 300,
            lineHeight: 1.65,
            color: 'var(--text-secondary)',
            maxWidth: '520px',
          }}
        >
          Senior product designer for AI-native SaaS. I use AI tooling
          to take the products I design all the way to production —
          so what launches is what was designed.
        </motion.p>

        {/* Right: metadata */}
        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="responsive-flex"
          style={{ display: 'flex', gap: '48px' }}
        >
          {[
            { label: 'Status', value: 'Available' },
            { label: 'Location', value: 'United States' },
          ].map((item) => (
            <div key={item.label} className="hero-meta-item" style={{ textAlign: 'right' }}>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.625rem',
                fontWeight: 500,
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                marginBottom: '6px',
              }}>
                {item.label}
              </p>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: item.label === 'Citizenship'
                  ? 'var(--accent)' : 'var(--text-primary)',
              }}>
                {item.value}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll line */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
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
          animate={{ height: ['16px', '32px', '16px'] }}
          transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
          style={{
            width: '1px',
            backgroundColor: 'var(--text-muted)',
          }}
        />
      </motion.div>
    </section>
  )
}
