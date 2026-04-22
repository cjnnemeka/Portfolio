'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScreenCarousel from '@/components/ScreenCarousel'
import ImageLightbox from '@/components/ImageLightbox'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1] as const,
      delay: i * 0.1,
    },
  }),
}

const sectionReveal = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
}

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

/* ── Reusable pieces ─────────────────────────────── */

function StaggerContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
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
      className={className}
    >
      {children}
    </motion.div>
  )
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '2px',
        backgroundColor: '#D4A843',
        transformOrigin: 'left',
        scaleX: scrollYProgress,
        zIndex: 200,
      }}
    />
  )
}

function SectionLabel({ text }: { text: string }) {
  return (
    <p style={{
      fontFamily: 'var(--font-mono)',
      fontSize: '0.625rem',
      fontWeight: 500,
      color: 'var(--text-muted)',
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
      marginBottom: '24px',
    }}>
      {text}
    </p>
  )
}

function SectionTitle({ text }: { text: string }) {
  return (
    <h2 style={{
      fontFamily: 'var(--font-display)',
      fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
      fontWeight: 700,
      letterSpacing: '-0.03em',
      lineHeight: 1.15,
      color: 'var(--text-primary)',
      marginBottom: '24px',
    }}>
      {text}
    </h2>
  )
}

function BodyText({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: 'var(--font-body)',
      fontSize: '1.0625rem',
      fontWeight: 300,
      lineHeight: 1.7,
      color: 'var(--text-secondary)',
      maxWidth: '680px',
    }}>
      {children}
    </p>
  )
}

function ParallaxImage({ label, aspect = '16 / 10', src }: { label: string; aspect?: string; src?: string }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['-5%', '5%'])

  if (src) {
    return (
      <div
        ref={ref}
        style={{
          width: '100%',
          overflow: 'hidden',
          borderRadius: '12px',
          border: '1px solid var(--border)',
        }}
      >
        <motion.div style={{ y }}>
          <img
            src={src}
            alt={label}
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '12px' }}
          />
        </motion.div>
      </div>
    )
  }

  return (
    <div
      ref={ref}
      style={{
        aspectRatio: aspect,
        borderRadius: '12px',
        border: '1px solid var(--border)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <motion.div
        style={{
          y,
          position: 'absolute',
          inset: '-10%',
          backgroundColor: 'var(--bg-card)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color 0.4s ease',
        }}
        whileHover={{ backgroundColor: 'var(--bg-card-hover)' }}
      >
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6875rem',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}>
          [{label}]
        </span>
      </motion.div>
    </div>
  )
}

function Divider() {
  return (
    <div style={{
      height: '1px',
      backgroundColor: 'var(--border)',
      margin: '120px 0',
    }} />
  )
}

function TechMarquee() {
  const tools = ['Figma', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Anthropic API', 'Twilio', 'Stripe', 'Vercel', 'Tailwind CSS']
  const duplicated = [...tools, ...tools, ...tools]

  return (
    <div style={{
      overflow: 'hidden',
      padding: '28px 0',
      borderBottom: '1px solid var(--border)',
      marginTop: '48px',
    }}>
      <motion.div
        animate={{ x: ['0%', '-33.33%'] }}
        transition={{
          duration: 25,
          ease: 'linear',
          repeat: Infinity,
        }}
        style={{
          display: 'flex',
          gap: '48px',
          whiteSpace: 'nowrap',
        }}
      >
        {duplicated.map((tool, i) => (
          <span key={`${tool}-${i}`} style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            fontWeight: 400,
            color: 'var(--text-muted)',
            letterSpacing: '0.06em',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '48px',
          }}>
            {tool}
            <span style={{ color: 'var(--accent)', opacity: 0.4, fontSize: '0.5rem' }}>◆</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}

function AnimatedMetric({ value, suffix = '' }: { value: string; suffix?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    if (!isInView) return

    // Handle non-numeric values like "~97%"
    const numericPart = value.replace(/[^0-9.]/g, '')
    const prefix = value.match(/^[^0-9]*/)?.[0] || ''
    const suffixPart = value.match(/[^0-9.]*$/)?.[0] || ''
    const target = parseFloat(numericPart)

    if (isNaN(target)) {
      setDisplay(value)
      return
    }

    const duration = 1500
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(eased * target)

      setDisplay(`${prefix}${current}${suffixPart}`)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setDisplay(value)
      }
    }

    requestAnimationFrame(animate)
  }, [isInView, value])

  return <span ref={ref}>{display}</span>
}

/* ── Decision card used in Key Decisions section ── */

function DecisionCard({
  number,
  title,
  challenge,
  decision,
  result,
  imageLabel,
  imageSrc,
  accentColor,
}: {
  number: string
  title: string
  challenge: string
  decision: string
  result: string
  imageLabel: string
  imageSrc?: string
  accentColor: string
}) {
  return (
    <motion.div
      whileHover={{
        y: -4,
        borderColor: 'var(--border-hover)',
        transition: { duration: 0.3 }
      }}
      style={{
        padding: '48px',
        backgroundColor: 'var(--bg-card)',
        borderRadius: '16px',
        border: '1px solid var(--border)',
        cursor: 'default',
        transition: 'border-color 0.3s ease',
        marginBottom: '32px',
      }}
    >
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.625rem',
        fontWeight: 500,
        color: accentColor,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        display: 'block',
        marginBottom: '12px',
      }}>
        Decision {number}
      </span>
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
        fontWeight: 700,
        letterSpacing: '-0.02em',
        color: 'var(--text-primary)',
        marginBottom: '32px',
        lineHeight: 1.2,
      }}>
        {title}
      </h3>

      {/* Two-column grid */}
      <div className="responsive-grid-2" style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0px',
      }}>
        {/* Left column — Challenge */}
        <div style={{ paddingRight: '40px' }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.5625rem',
            fontWeight: 500,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            display: 'block',
            marginBottom: '12px',
          }}>
            The Challenge
          </span>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.9375rem',
            fontWeight: 400,
            lineHeight: 1.65,
            color: 'var(--text-secondary)',
          }}>
            {challenge}
          </p>
        </div>

        {/* Right column — Decision + Result */}
        <div style={{
          borderLeft: `2px solid ${accentColor}`,
          paddingLeft: '40px',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.5625rem',
            fontWeight: 500,
            color: accentColor,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            display: 'block',
            marginBottom: '12px',
          }}>
            The Decision
          </span>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.9375rem',
            fontWeight: 400,
            lineHeight: 1.65,
            color: 'var(--text-primary)',
          }}>
            {decision}
          </p>

          {/* Separator */}
          <div style={{
            height: '1px',
            backgroundColor: 'var(--border)',
            margin: '20px 0',
          }} />

          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.5625rem',
            fontWeight: 500,
            color: accentColor,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            display: 'block',
            marginBottom: '12px',
          }}>
            The Result
          </span>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.9375rem',
            fontWeight: 500,
            lineHeight: 1.65,
            color: 'var(--text-primary)',
          }}>
            {result}
          </p>
        </div>
      </div>

      {/* Image or placeholder */}
      {imageSrc ? (
        <div style={{
          marginTop: '32px',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          padding: '32px 0',
          backgroundColor: 'transparent',
        }}>
          <ImageLightbox
            src={imageSrc}
            alt={imageLabel}
            style={{ maxWidth: '100%', maxHeight: '450px', height: 'auto', width: 'auto', objectFit: 'contain', borderRadius: '12px', boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}
          />
        </div>
      ) : (
        <div style={{
          marginTop: '32px',
          aspectRatio: '16 / 9',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '8px',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'border-color 0.4s ease, background-color 0.4s ease',
        }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-hover)'
            e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'
          }}
        >
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.625rem',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            [{imageLabel}]
          </span>
        </div>
      )}
    </motion.div>
  )
}

/* ── Main page ────────────────────────────────────── */

export default function NoelXCaseStudy() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Header />
      <ScrollProgress />
      <main style={{ paddingTop: '160px' }}>

        {/* ━━━ HERO ━━━ */}
        <section className="responsive-padding" style={{ padding: '0 48px 80px 48px' }}>
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link href="/#work" style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.08em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '64px',
              transition: 'color 0.3s ease',
            }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              ← Back to work
            </Link>
          </motion.div>

          {/* Title block */}
          <div style={{ marginBottom: '48px' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.625rem',
                fontWeight: 500,
                color: '#D4A843',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
              }}>
                Case Study
              </span>
            </motion.div>

            <div style={{ overflow: 'hidden', marginTop: '16px' }}>
              <motion.h1
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(3rem, 7vw, 6rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.04em',
                  lineHeight: 1.05,
                  color: 'var(--text-primary)',
                }}
              >
                NoelX
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.25rem',
                fontWeight: 300,
                color: 'var(--text-secondary)',
                marginTop: '16px',
                maxWidth: '600px',
                lineHeight: 1.5,
              }}
            >
              An AI-powered patient recovery and retention system for medical spas.
              Three layers of automation that turn dormant patient databases into recurring revenue.
            </motion.p>
          </div>

          {/* Meta row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            className="responsive-grid-4"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '32px',
              paddingTop: '32px',
              borderTop: '1px solid var(--border)',
            }}
          >
            {[
              { label: 'Role', value: 'Solo — Design, Architecture, Dev' },
              { label: 'Timeline', value: '2 months' },
              { label: 'Stack', value: 'Next.js · Node · PostgreSQL · Anthropic API' },
              { label: 'Status', value: 'Live — noelx.co' },
            ].map((item) => (
              <div key={item.label}>
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.5625rem',
                  fontWeight: 500,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  marginBottom: '8px',
                }}>
                  {item.label}
                </p>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  fontWeight: 400,
                  color: 'var(--text-primary)',
                  lineHeight: 1.4,
                }}>
                  {item.value}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Dual CTA: live site + design system */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
            style={{
              marginTop: '32px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '14px',
              alignItems: 'center',
            }}
          >
            <a
              href="https://noelx.co"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#FFFFFF',
                background: '#D4A843',
                padding: '13px 20px',
                borderRadius: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'transform 0.25s ease, background-color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#BD9036'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#D4A843'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              View live site
              <span style={{ fontSize: '14px' }}>↗</span>
            </a>
            <Link
              href="/work/noelx/system"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#D4A843',
                background: 'transparent',
                border: '1px solid #D4A843',
                padding: '12px 20px',
                borderRadius: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'background-color 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(212, 168, 67, 0.12)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              Explore the design system
              <span style={{ fontSize: '14px' }}>→</span>
            </Link>
          </motion.div>

          {/* Tech stack marquee */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <TechMarquee />
          </motion.div>
        </section>

        {/* ━━━ HERO IMAGE ━━━ */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
          className="responsive-padding"
          style={{ padding: '0 48px 120px 48px' }}
        >
          <ParallaxImage label="NoelX — Hero / Marketing Site Screenshot" aspect="16 / 8" src="/images/noelx/dashboard-overview.png" />
        </motion.section>

        {/* ━━━ THE PROBLEM ━━━ */}
        <section className="responsive-padding" style={{ padding: '0 48px' }}>
          <StaggerContainer>
            <div style={{ maxWidth: '720px' }}>
              <motion.div variants={staggerChild}>
                <SectionLabel text="01 — The Problem" />
              </motion.div>
              <motion.div variants={staggerChild}>
                <SectionTitle text="Med spas are hemorrhaging revenue from patients who already walked in the door." />
              </motion.div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <motion.div variants={staggerChild}>
                  <BodyText>
                    Medical spas generating $1M–$3M/year have 500+ patients in their database. At any given time, 150+ of those patients have lapsed — 90+ days since their last visit. These aren't lost leads. They already paid, already liked the service, and already gave their contact info. They just drifted away.
                  </BodyText>
                </motion.div>
                <motion.div variants={staggerChild}>
                  <BodyText>
                    Marketing agencies charge $3K–$5K/month and deliver "leads" hidden behind vanity metrics. Generic CRM platforms require the owner to do the marketing themselves. Manual front desk outreach happens for two weeks after a slow month, then stops.
                  </BodyText>
                </motion.div>
                <motion.div variants={staggerChild}>
                  <BodyText>
                    The core insight: the patients are already in the database. The spa already paid to acquire them. What's missing isn't leads or ads — it's infrastructure that automatically catches, recovers, and retains patients without anyone lifting a finger.
                  </BodyText>
                </motion.div>
              </div>
            </div>
          </StaggerContainer>
        </section>

        <Divider />

        {/* ━━━ THE POSITIONING DECISION ━━━ */}
        <section className="responsive-padding" style={{ padding: '0 48px' }}>
          <StaggerContainer>
            <div style={{ maxWidth: '720px', marginBottom: '64px' }}>
              <motion.div variants={staggerChild}>
                <SectionLabel text="02 — Strategic Positioning" />
              </motion.div>
              <motion.div variants={staggerChild}>
                <SectionTitle text="Infrastructure, not agency." />
              </motion.div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <motion.div variants={staggerChild}>
                  <BodyText>
                    The initial concept was a reactivation service — "we'll get your lapsed patients back." One function, evaluated monthly on a number. This is the agency model. It creates a fragile relationship: every month is a performance review.
                  </BodyText>
                </motion.div>
                <motion.div variants={staggerChild}>
                  <BodyText>
                    The reframe: NoelX is infrastructure the practice runs on — like their PMS or payment processor. Nobody cancels Stripe because it "only processed 30 payments this month." This decision cascaded through every other product decision — pricing ($2,997/month justified as always-on infrastructure), guarantees (operational, not performance-based), and churn prevention (infrastructure doesn't get monthly performance reviews).
                  </BodyText>
                </motion.div>
              </div>
            </div>

            {/* Three-layer system visual */}
            <motion.div variants={staggerChild} className="responsive-grid-3" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px',
              marginTop: '48px',
            }}>
              {[
                {
                  layer: '01',
                  title: 'Backlog Recovery',
                  desc: 'Reactivates patients who have already lapsed (90+ days). Works through the entire dormant database in months 1–4. Immediate, visible ROI that justifies the price from day one.',
                },
                {
                  layer: '02',
                  title: 'Lapse Interception',
                  desc: 'Every month, patients cross the 90-day threshold. The system catches them automatically within days of lapsing — before they find another provider. Prevents the lapsed pool from rebuilding.',
                },
                {
                  layer: '03',
                  title: 'Post-Visit Retention',
                  desc: 'After a patient visits, the system sends follow-ups: satisfaction check, rebooking nudge, next-treatment reminder based on specific treatment cadence. Reduces churn at the source.',
                },
              ].map((item) => (
                <motion.div
                  key={item.layer}
                  whileHover={{
                    y: -4,
                    borderColor: 'var(--border-hover)',
                    transition: { duration: 0.3 }
                  }}
                  style={{
                    padding: '36px',
                    backgroundColor: 'var(--bg-card)',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    cursor: 'default',
                    transition: 'border-color 0.3s ease',
                  }}
                >
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.625rem',
                    fontWeight: 500,
                    color: '#D4A843',
                    letterSpacing: '0.1em',
                    display: 'block',
                    marginBottom: '16px',
                  }}>
                    Layer {item.layer}
                  </span>
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    color: 'var(--text-primary)',
                    marginBottom: '12px',
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9375rem',
                    fontWeight: 300,
                    lineHeight: 1.6,
                    color: 'var(--text-secondary)',
                  }}>
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </StaggerContainer>
        </section>

        <Divider />

        {/* ━━━ KEY DESIGN DECISIONS ━━━ */}
        <section className="responsive-padding" style={{ padding: '0 48px' }}>
          <StaggerContainer>
            <div style={{ maxWidth: '720px', marginBottom: '48px' }}>
              <motion.div variants={staggerChild}>
                <SectionLabel text="03 — Key Design Decisions" />
              </motion.div>
              <motion.div variants={staggerChild}>
                <SectionTitle text="Key Design Decisions" />
              </motion.div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
              <motion.div variants={staggerChild}>
                <DecisionCard
                  number="01"
                  title="Dashboard: Bento Grid with Revenue Hero"
                  accentColor="#D4A843"
                  challenge="Med spa owners are non-technical and time-pressed. They log in asking one question: 'Is NoelX making me money?' The answer must be obvious within 2 seconds."
                  decision="Asymmetric bento grid layout. Revenue hero card dominates row 1 at 3x the size of supporting elements. Monthly AI-generated narrative summary explains performance in plain language. Progressive disclosure — aggregate metrics on homepage, campaign detail on click, full conversation on drill-down."
                  result="The owner sees revenue impact first, trend context second, real-time activity third. No information overload. The dashboard builds confidence, not anxiety."
                  imageLabel="NoelX — Dashboard Bento Grid Layout"
                  imageSrc="/images/noelx/dashboard-overview.png"
                />
              </motion.div>
              <motion.div variants={staggerChild}>
                <DecisionCard
                  number="02"
                  title="Light Mode over Dark Theme"
                  accentColor="#D4A843"
                  challenge="Initial build used a dark theme (Carbon Amber — charcoal with gold accents). After evaluating against reference products, the aesthetic felt like a developer tool, not a wellness business dashboard."
                  decision="Shifted to light mode with warm neutrals (off-white #F9F8F6, warm gray borders, charcoal text). Retained the amber accent sparingly for active states and key CTAs. The ICP is a 35–55 year old med spa owner, not a SaaS engineer."
                  result="The dashboard conveys premium-but-approachable. Amber works as a highlight, not a wash. Matches the $3K/month price point expectation."
                  imageLabel="NoelX — Light vs Dark Theme Comparison"
                  imageSrc="/images/noelx/MacBook_Mockup.png"
                />
              </motion.div>
              <motion.div variants={staggerChild}>
                <DecisionCard
                  number="03"
                  title="Campaign Approval Workflow"
                  accentColor="#D4A843"
                  challenge="TCPA compliance requires the spa to have legal defensibility over every message sent. The AI generates message templates, but the spa needs to approve them."
                  decision="Built a campaign approval view showing sample messages with real merge fields populated (patient first name + last initial, treatment type, spa name). The owner sees exactly what the final message looks like before anything sends."
                  result="Three purposes in one screen: legal defensibility, client confidence (no black box), and quality control for tone matching. Compliance becomes a trust-building feature, not a friction point."
                  imageLabel="NoelX — Campaign Approval Screen"
                  imageSrc="/images/noelx/campaign-detail.png"
                />
              </motion.div>
            </div>

            {/* Subtle bridge link to design system */}
            <motion.div variants={staggerChild} style={{ marginTop: '48px' }}>
              <Link
                href="/work/noelx/system"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#D4A843',
                  padding: '12px 18px',
                  border: '1px solid #D4A843',
                  borderRadius: '8px',
                  transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(212, 168, 67, 0.12)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                See how these decisions shipped — explore the design system
                <span style={{ fontSize: '14px' }}>→</span>
              </Link>
            </motion.div>
          </StaggerContainer>
        </section>

        <Divider />

        {/* ━━━ THE SOLUTION — SCREENS ━━━ */}
        <section className="responsive-padding" style={{ padding: '0 48px' }}>
          <StaggerContainer>
            <div style={{ maxWidth: '720px', marginBottom: '64px' }}>
              <motion.div variants={staggerChild}>
                <SectionLabel text="04 — The Solution" />
              </motion.div>
              <motion.div variants={staggerChild}>
                <SectionTitle text="A 10-module system designed, architected, and built from zero." />
              </motion.div>
              <motion.div variants={staggerChild}>
                <BodyText>
                  NoelX isn't a Figma prototype. It's a production system with real business logic, real compliance infrastructure, real AI pipelines, and real payment processing. 25 routes compiled, zero TypeScript errors. 10 modules covering everything from CSV upload and audit to Stripe subscriptions and dunning.
                </BodyText>
              </motion.div>
            </div>

            {/* Screen carousel */}
            <motion.div variants={staggerChild}>
              <ScreenCarousel
                accentColor="#D4A843"
                screens={[
                  { label: 'Dashboard Overview', description: 'Revenue hero card, bento grid layout, AI-generated monthly narrative', src: '/images/noelx/dashboard-overview.png' },
                  { label: 'Campaign Detail', description: 'Message template review with populated merge fields', src: '/images/noelx/campaign-detail.png' },
                  { label: 'Patient Conversation', description: 'Real-time patient interactions with classification badges', src: '/images/noelx/patient-conversation.png' },
                  { label: 'Activity Feed', description: 'Guided setup flow with CSV upload and data quality report', src: '/images/noelx/activity-feed.png' },
                  { label: 'Reports', description: 'Two-tier classification pipeline with confidence scores', src: '/images/noelx/reports.png' },
                  { label: 'Marketing Site', description: 'Conversion-focused landing page with RetentionScore lead magnet', src: '/images/noelx/marketing-site.png' },
                ]}
              />
            </motion.div>

            {/* CTA — design system reference */}
            <motion.div
              variants={staggerChild}
              style={{
                marginTop: '56px',
                padding: '32px 36px',
                background: 'linear-gradient(180deg, rgba(212, 168, 67, 0.10) 0%, rgba(212, 168, 67, 0.02) 100%)',
                border: '1px solid rgba(212, 168, 67, 0.40)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '32px',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ maxWidth: '560px' }}>
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  fontWeight: 500,
                  color: '#D4A843',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                }}>
                  The atoms behind these screens
                </p>
                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.25rem, 2.2vw, 1.625rem)',
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.3,
                  color: 'var(--text-primary)',
                }}>
                  Every screen above is built from a documented system — warm neutrals, an amber brand, six classification roles, a dark sidebar anchoring a light canvas. See it in full.
                </p>
              </div>
              <Link
                href="/work/noelx/system"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  color: '#FFFFFF',
                  background: '#D4A843',
                  padding: '14px 22px',
                  borderRadius: '8px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  flexShrink: 0,
                  transition: 'transform 0.25s ease, background-color 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#BD9036'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#D4A843'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                Open design system
                <span style={{ fontSize: '14px' }}>→</span>
              </Link>
            </motion.div>
          </StaggerContainer>
        </section>

        <Divider />

        {/* ━━━ AI INTEGRATION ━━━ */}
        <section className="responsive-padding" style={{ padding: '0 48px' }}>
          <StaggerContainer>
            <div style={{ maxWidth: '720px', marginBottom: '48px' }}>
              <motion.div variants={staggerChild}>
                <SectionLabel text="05 — AI Integration" />
              </motion.div>
              <motion.div variants={staggerChild}>
                <SectionTitle text="Two-tier classification with a de-identification pipeline." />
              </motion.div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <motion.div variants={staggerChild}>
                  <BodyText>
                    When a patient replies to an outreach message, the system classifies intent and routes the response. This is the core AI capability: understanding whether a patient is interested, has booked, has a question, wants to opt out, isn't interested, or needs human review.
                  </BodyText>
                </motion.div>
                <motion.div variants={staggerChild}>
                  <BodyText>
                    Before any text reaches the AI, patient names are stripped and replaced with [PATIENT]. No phone numbers or identifiers in API calls. No PHI reaches the model — only anonymous text strings. De-identification has zero impact on classification quality, validated during development.
                  </BodyText>
                </motion.div>
              </div>
            </div>

            {/* AI pipeline breakdown */}
            <motion.div variants={staggerChild} style={{
              padding: '48px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '12px',
              border: '1px solid var(--border)',
              marginBottom: '32px',
            }}>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.125rem',
                fontWeight: 700,
                letterSpacing: '-0.01em',
                color: 'var(--text-primary)',
                marginBottom: '32px',
              }}>
                Classification Pipeline
              </h3>
              <div className="responsive-grid-3" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '24px',
              }}>
                {[
                  {
                    step: '01',
                    title: 'De-identify',
                    desc: 'Patient reply arrives via Twilio webhook. Names stripped, replaced with [PATIENT]. No PHI leaves the system.',
                  },
                  {
                    step: '02',
                    title: 'Primary Classification',
                    desc: 'Sonnet classifies into 6 categories using structured prompt with campaign context. Fast, cost-effective for high volume.',
                  },
                  {
                    step: '03',
                    title: 'Escalation',
                    desc: 'If confidence < 0.85, Opus runs a second opinion. If both models disagree, the reply enters the human review queue.',
                  },
                ].map((item) => (
                  <div key={item.step}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.625rem',
                      fontWeight: 500,
                      color: '#D4A843',
                      letterSpacing: '0.1em',
                      display: 'block',
                      marginBottom: '12px',
                    }}>
                      Step {item.step}
                    </span>
                    <h4 style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      marginBottom: '8px',
                    }}>
                      {item.title}
                    </h4>
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.875rem',
                      fontWeight: 300,
                      lineHeight: 1.6,
                      color: 'var(--text-secondary)',
                    }}>
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Classification badges */}
            <motion.div variants={staggerChild} style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
            }}>
              {[
                { label: 'Interested', color: '#D4A843' },
                { label: 'Booked', color: '#4CAF50' },
                { label: 'Question', color: '#5B9BD5' },
                { label: 'Opt Out', color: '#E05252' },
                { label: 'Not Interested', color: '#6B6B6B' },
                { label: 'Needs Review', color: '#E8914D' },
              ].map((badge) => (
                <motion.span
                  key={badge.label}
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    fontWeight: 500,
                    color: badge.color,
                    padding: '8px 16px',
                    border: `1px solid ${badge.color}33`,
                    borderRadius: '100px',
                    backgroundColor: `${badge.color}11`,
                    letterSpacing: '0.04em',
                    cursor: 'default',
                  }}
                >
                  {badge.label}
                </motion.span>
              ))}
            </motion.div>
          </StaggerContainer>
        </section>

        <Divider />

        {/* ━━━ COMPLIANCE ━━━ */}
        <section className="responsive-padding" style={{ padding: '0 48px' }}>
          <StaggerContainer>
            <div style={{ maxWidth: '720px', marginBottom: '48px' }}>
              <motion.div variants={staggerChild}>
                <SectionLabel text="06 — Design Under Constraint" />
              </motion.div>
              <motion.div variants={staggerChild}>
                <SectionTitle text="Three compliance frameworks shaped every interaction." />
              </motion.div>
              <motion.div variants={staggerChild}>
                <BodyText>
                  Healthcare communication operates in a regulated environment. Every design decision passed through three filters simultaneously: TCPA (telecommunications law), HIPAA (healthcare data privacy), and Twilio A2P 10DLC (carrier registration). Compliance wasn't a checkbox — it was a design material.
                </BodyText>
              </motion.div>
            </div>

            <motion.div variants={staggerChild} className="responsive-grid-3" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px',
            }}>
              {[
                {
                  framework: 'TCPA',
                  title: 'Liability Architecture',
                  details: 'The med spa is the sender, NoelX is the tool. Dedicated local numbers per spa. Double opt-in required. Quiet hours enforced (8am–9pm). Opt-out language in first message of every sequence.',
                },
                {
                  framework: 'HIPAA',
                  title: 'Data Minimization',
                  details: 'Store only: first name, last name, phone, email, last visit date, treatment category. No diagnosis codes, SSNs, insurance, or clinical notes. Patient names displayed as First Name + Last Initial throughout the dashboard.',
                },
                {
                  framework: 'A2P 10DLC',
                  title: 'Carrier Registration',
                  details: 'Full business profile and campaign registration with Twilio. Public consent page at noelx.co/consent. Three rounds of submission and revision before carrier approval.',
                },
              ].map((item) => (
                <motion.div
                  key={item.framework}
                  whileHover={{
                    y: -4,
                    borderColor: 'var(--border-hover)',
                    transition: { duration: 0.3 }
                  }}
                  style={{
                    padding: '36px',
                    backgroundColor: 'var(--bg-card)',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    cursor: 'default',
                    transition: 'border-color 0.3s ease',
                  }}
                >
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.625rem',
                    fontWeight: 500,
                    color: '#D4A843',
                    letterSpacing: '0.1em',
                    display: 'block',
                    marginBottom: '16px',
                  }}>
                    {item.framework}
                  </span>
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    letterSpacing: '-0.01em',
                    color: 'var(--text-primary)',
                    marginBottom: '12px',
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.875rem',
                    fontWeight: 300,
                    lineHeight: 1.6,
                    color: 'var(--text-secondary)',
                  }}>
                    {item.details}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </StaggerContainer>
        </section>

        <Divider />

        {/* ━━━ OUTCOME ━━━ */}
        <section className="responsive-padding" style={{ padding: '0 48px' }}>
          <StaggerContainer>
            <div style={{ maxWidth: '720px', marginBottom: '48px' }}>
              <motion.div variants={staggerChild}>
                <SectionLabel text="07 — Outcome & Reflection" />
              </motion.div>
              <motion.div variants={staggerChild}>
                <SectionTitle text="Shipped. Live. Learning." />
              </motion.div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <motion.div variants={staggerChild}>
                  <BodyText>
                    NoelX is live at noelx.co. The complete system — 10 modules, 25 API routes, AI classification pipeline, Stripe billing, Twilio SMS, HIPAA-compliant infrastructure — was designed, architected, and built solo. Currently in early customer acquisition.
                  </BodyText>
                </motion.div>
                <motion.div variants={staggerChild}>
                  <BodyText>
                    The distance between "I designed this" and "I designed, architected, and built this from zero to production" is the differentiator. Most designers show screens. This is a complete product lifecycle: problem identification → strategic positioning → system design → full-stack implementation → live deployment.
                  </BodyText>
                </motion.div>
              </div>
            </div>

            {/* Key metrics */}
            <motion.div variants={staggerChild} className="responsive-grid-4" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '20px',
              marginBottom: '48px',
            }}>
              {[
                { metric: '10', label: 'System modules' },
                { metric: '25', label: 'API routes' },
                { metric: '0', label: 'TypeScript errors' },
                { metric: '~97%', label: 'Gross margin at scale' },
              ].map((item) => (
                <div key={item.label} style={{
                  padding: '32px',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  textAlign: 'center',
                }}>
                  <p style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2.5rem',
                    fontWeight: 700,
                    letterSpacing: '-0.03em',
                    color: '#D4A843',
                    marginBottom: '8px',
                  }}>
                    <AnimatedMetric value={item.metric} />
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.625rem',
                    fontWeight: 500,
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}>
                    {item.label}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* What I'd do differently */}
            <motion.div variants={staggerChild} style={{
              padding: '40px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '12px',
              border: '1px solid var(--border)',
            }}>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.125rem',
                fontWeight: 700,
                letterSpacing: '-0.01em',
                color: 'var(--text-primary)',
                marginBottom: '16px',
              }}>
                What I'd do differently
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  'Integrate directly with PMS APIs (Zenoti, Boulevard) instead of CSV uploads — the manual refresh creates unnecessary friction.',
                  'Build the design system as a shared component library from day one rather than extracting patterns after the fact.',
                  'Conduct more structured user testing with actual med spa owners during the dashboard design phase rather than relying on competitive analysis.',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.625rem',
                      color: 'var(--text-muted)',
                      marginTop: '6px',
                      flexShrink: 0,
                    }}>
                      →
                    </span>
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.9375rem',
                      fontWeight: 300,
                      lineHeight: 1.6,
                      color: 'var(--text-secondary)',
                    }}>
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </StaggerContainer>
        </section>

        {/* ━━━ NEXT PROJECT ━━━ */}
        <section style={{
          padding: '120px 48px 0 48px',
          borderTop: '1px solid var(--border)',
          marginTop: '120px',
        }}>
          <Link href="/work/clovr" style={{ textDecoration: 'none', display: 'block' }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: '48px',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                const title = e.currentTarget.querySelector('[data-next-title]') as HTMLElement
                if (title) title.style.color = '#2B7CB3'
              }}
              onMouseLeave={(e) => {
                const title = e.currentTarget.querySelector('[data-next-title]') as HTMLElement
                if (title) title.style.color = 'var(--text-primary)'
              }}
            >
              <div>
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  fontWeight: 500,
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  marginBottom: '12px',
                }}>
                  Next Project
                </p>
                <h2
                  data-next-title
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                    fontWeight: 700,
                    letterSpacing: '-0.03em',
                    color: 'var(--text-primary)',
                    transition: 'color 0.5s ease',
                  }}
                >
                  Clovr
                </h2>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  fontWeight: 400,
                  color: 'var(--text-secondary)',
                  marginTop: '8px',
                }}>
                  Trade Promotion & Deduction Recovery Platform
                </p>
              </div>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2rem',
                color: 'var(--text-muted)',
              }}>
                →
              </span>
            </motion.div>
          </Link>
        </section>

      </main>
      <Footer />
    </>
  )
}
