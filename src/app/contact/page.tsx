'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const staggerChild = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
}

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('sending')

    const formData = new FormData(e.currentTarget)
    formData.append('access_key', '82d5cac9-a675-435b-8bbd-ac6efdfe0a53')

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      if (data.success) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    backgroundColor: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.9375rem',
    outline: 'none',
    transition: 'border-color 0.3s ease',
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-body)',
    fontSize: '0.8125rem',
    fontWeight: 500,
    color: 'var(--text-primary)',
    marginBottom: '8px',
    display: 'block',
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = 'var(--accent)'
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = 'var(--border)'
  }

  return (
    <>
      <Header />
      <main style={{ minHeight: '100vh' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 3fr',
          gap: '80px',
          padding: '160px 48px 120px 48px',
          alignItems: 'start',
        }}>

          {/* ━━━ LEFT COLUMN ━━━ */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            <motion.p variants={staggerChild} style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.625rem',
              fontWeight: 500,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              marginBottom: '28px',
            }}>
              Get in Touch
            </motion.p>

            {/* Headline — line-by-line reveal */}
            {['Let\u2019s build', 'something', 'together.'].map((line, i) => (
              <div key={line} style={{ overflow: 'hidden' }}>
                <motion.h1
                  initial={{ y: '100%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 + i * 0.12 }}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                    fontWeight: 700,
                    letterSpacing: '-0.035em',
                    lineHeight: 1.1,
                    color: 'var(--text-primary)',
                  }}
                >
                  {line}
                </motion.h1>
              </div>
            ))}

            <motion.p variants={staggerChild} style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              fontWeight: 400,
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
              maxWidth: '360px',
              marginTop: '28px',
            }}>
              Whether you&rsquo;re looking for a product designer who can also build, or you just want to talk shop — I&rsquo;d love to hear from you.
            </motion.p>

            {/* Divider */}
            <motion.div variants={staggerChild} style={{
              height: '1px',
              backgroundColor: 'var(--border)',
              margin: '40px 0',
            }} />

            {/* Info items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <motion.div variants={staggerChild}>
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.5625rem',
                  fontWeight: 500,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  marginBottom: '6px',
                }}>
                  Email
                </p>
                <a
                  href="mailto:michaelihenacho3@gmail.com"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                    fontWeight: 400,
                    color: 'var(--text-primary)',
                    transition: 'color 0.3s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                >
                  michaelihenacho3@gmail.com
                </a>
              </motion.div>

              <motion.div variants={staggerChild}>
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.5625rem',
                  fontWeight: 500,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  marginBottom: '6px',
                }}>
                  Location
                </p>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  fontWeight: 400,
                  color: 'var(--text-primary)',
                }}>
                  Houston, TX → Open to Relocation
                </p>
              </motion.div>

              <motion.div variants={staggerChild}>
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.5625rem',
                  fontWeight: 500,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  marginBottom: '6px',
                }}>
                  Socials
                </p>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  fontWeight: 400,
                }}>
                  <a
                    href="https://www.linkedin.com/in/michaelihenacho/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: 'var(--text-secondary)',
                      transition: 'color 0.3s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                  >
                    LinkedIn
                  </a>
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* ━━━ RIGHT COLUMN — FORM ━━━ */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          >
            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  padding: '80px 48px',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '16px',
                  border: '1px solid var(--border)',
                  textAlign: 'center',
                }}
              >
                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: '12px',
                }}>
                  Message sent.
                </h2>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9375rem',
                  color: 'var(--text-secondary)',
                }}>
                  I&rsquo;ll get back to you within 24 hours.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
              }}>
                <input type="checkbox" name="botcheck" style={{ display: 'none' }} />

                {/* Name */}
                <div>
                  <label style={labelStyle}>Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Your name"
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>

                {/* Email */}
                <div>
                  <label style={labelStyle}>Email</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="your@email.com"
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>

                {/* Company */}
                <div>
                  <label style={labelStyle}>
                    Company <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
                  </label>
                  <input
                    type="text"
                    name="company"
                    placeholder="Where do you work?"
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>

                {/* Message */}
                <div>
                  <label style={labelStyle}>Message</label>
                  <textarea
                    name="message"
                    required
                    placeholder="Tell me about your project or role..."
                    style={{
                      ...inputStyle,
                      minHeight: '160px',
                      resize: 'vertical',
                    }}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  style={{
                    width: '100%',
                    padding: '16px 32px',
                    backgroundColor: 'var(--accent)',
                    color: 'var(--bg-primary)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    border: 'none',
                    borderRadius: '8px',
                    cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    marginTop: '24px',
                    opacity: status === 'sending' ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (status !== 'sending') {
                      e.currentTarget.style.opacity = '0.9'
                      e.currentTarget.style.transform = 'translateY(-1px)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = status === 'sending' ? '0.7' : '1'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  {status === 'sending' ? 'Sending...' : 'Send Message →'}
                </button>

                {/* Error message */}
                {status === 'error' && (
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                    color: '#E8614D',
                    marginTop: '8px',
                  }}>
                    Something went wrong. Try emailing me directly at{' '}
                    <a
                      href="mailto:michaelihenacho3@gmail.com"
                      style={{ color: '#E8614D', textDecoration: 'underline' }}
                    >
                      michaelihenacho3@gmail.com
                    </a>
                    .
                  </p>
                )}
              </form>
            )}
          </motion.div>

        </div>
      </main>
      <Footer />
    </>
  )
}
