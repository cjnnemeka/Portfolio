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
    'I turn ambiguity',
    'into usable products.',
  ]

  return (
    <section className="responsive-padding" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '120px 48px 80px 48px',
      textAlign: 'center',
      position: 'relative',
    }}>
      {/* Label */}
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.5625rem',
          color: 'var(--text-muted)',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          marginBottom: '48px',
        }}
      >
        Cj Nnemeka — Product Designer
      </motion.p>

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
                fontSize: 'clamp(3.25rem, 8.5vw, 8rem)',
                fontWeight: 700,
                letterSpacing: '-0.045em',
                color: 'var(--text-primary)',
                lineHeight: 1.05,
                paddingBottom: '8px',
              }}
            >
              {line}
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
          width: '100%',
          maxWidth: '560px',
          backgroundColor: 'var(--border-hover)',
          marginBottom: '32px',
        }}
      />

      {/* Description */}
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
          maxWidth: '480px',
          marginBottom: '40px',
        }}
      >
        Senior product designer for AI-native SaaS — I use AI tooling to take designs all the way to production.
      </motion.p>

      {/* Status pills */}
      <motion.div
        custom={1}
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}
      >
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
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        style={{
          position: 'absolute',
          bottom: '32px',
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
          style={{ width: '1px', backgroundColor: 'var(--text-muted)' }}
        />
      </motion.div>
    </section>
  )
}
