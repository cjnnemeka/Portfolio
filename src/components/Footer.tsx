'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const links = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/michaelihenacho/' },
]

export default function Footer() {
  const [emailHovered, setEmailHovered] = useState(false)

  return (
    <footer id="contact" style={{
      padding: '160px 48px 40px 48px',
    }}>
      {/* CTA section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginBottom: '160px' }}
      >
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.625rem',
          fontWeight: 500,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          marginBottom: '28px',
        }}>
          Let's talk
        </p>
        <a
          href="mailto:michaelihenacho3@gmail.com"
          onMouseEnter={() => setEmailHovered(true)}
          onMouseLeave={() => setEmailHovered(false)}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.75rem, 4.5vw, 4rem)',
            fontWeight: 600,
            letterSpacing: '-0.035em',
            lineHeight: 1.15,
            color: emailHovered ? 'var(--accent)' : 'var(--text-primary)',
            transition: 'color 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            display: 'inline-block',
          }}
        >
          michaelihenacho3@gmail.com
        </a>
      </motion.div>

      {/* Bottom bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '20px',
        borderTop: '1px solid var(--border)',
      }}>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.75rem',
          fontWeight: 400,
          color: 'var(--text-muted)',
        }}>
          © {new Date().getFullYear()} Michael Ihenacho
        </p>

        <div style={{ display: 'flex', gap: '28px' }}>
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.8125rem',
                fontWeight: 400,
                color: 'var(--text-secondary)',
                transition: 'color 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
