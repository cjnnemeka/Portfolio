'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScreenCarousel from '@/components/ScreenCarousel'
import ImageLightbox from '@/components/ImageLightbox'

const ACCENT = '#2B7CB3'

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
        backgroundColor: ACCENT,
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
        <motion.div style={{ y, display: 'flex', justifyContent: 'center' }}>
          <img
            src={src}
            alt={label}
            style={{ maxHeight: '500px', width: 'auto', display: 'block', margin: '0 auto', objectFit: 'contain', borderRadius: '12px' }}
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
  const tools = ['Figma', 'FigJam', 'Maze', 'Miro', 'React', 'TypeScript', 'Node.js', 'PostgreSQL', 'D3.js']
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
            <span style={{ color: ACCENT, opacity: 0.4, fontSize: '0.5rem' }}>◆</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}

function AnimatedMetric({ value }: { value: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    if (!isInView) return

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

/* ── Decision card — two-column split layout ── */

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

export default function ClovrCaseStudy() {
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
                color: ACCENT,
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
                Clovr
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
                maxWidth: '640px',
                lineHeight: 1.5,
              }}
            >
              Designing a trade promotion management platform that turns financial chaos into recoverable revenue — helping CPG brands stop losing millions to invalid retailer deductions.
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
              { label: 'Role', value: 'Product Designer' },
              { label: 'Timeline', value: '2024' },
              { label: 'Tools', value: 'Figma, FigJam, Maze, Miro' },
              { label: 'Type', value: 'B2B SaaS — Concept' },
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
          <ParallaxImage label="Clovr — Dashboard Overview" aspect="16 / 8" src="/images/Clovr/Free_MacBook_Pro_1.png" />
        </motion.section>

        {/* ━━━ 01 — THE PROBLEM ━━━ */}
        <section className="responsive-padding" style={{ padding: '0 48px' }}>
          <StaggerContainer>
            <div style={{ maxWidth: '720px' }}>
              <motion.div variants={staggerChild}>
                <SectionLabel text="01 — The Problem" />
              </motion.div>
              <motion.div variants={staggerChild}>
                <SectionTitle text="The Problem" />
              </motion.div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <motion.div variants={staggerChild}>
                  <BodyText>
                    Consumer packaged goods brands spend 15–25% of gross revenue on trade promotions — slotting fees, discounts, marketing allowances, and retailer incentives. When those promotions run, retailers deduct the agreed amounts directly from invoices. The problem: 5–10% of those deductions are invalid. Wrong amounts, duplicate charges, promotions that never ran, expired deals still being claimed. For a mid-size CPG brand doing $50M in revenue, that's $375K–$750K in lost profit sitting in unresolved deductions every year.
                  </BodyText>
                </motion.div>
                <motion.div variants={staggerChild}>
                  <BodyText>
                    The existing workflow is brutal. Finance teams manually cross-reference deduction line items against promotion agreements, check libraries, and retailer portals — across spreadsheets, email threads, and disconnected systems. A single deduction can take 45 minutes to validate. By the time the team processes the backlog, the dispute window has closed and the money is gone.
                  </BodyText>
                </motion.div>
              </div>
            </div>

            {/* Pull quote */}
            <motion.div variants={staggerChild} style={{
              borderLeft: `4px solid ${ACCENT}`,
              padding: '40px 48px',
              marginTop: '64px',
            }}>
              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                lineHeight: 1.3,
                color: 'var(--text-primary)',
              }}>
                &ldquo;Invalid deductions cost CPG companies 5–10% of trade claims in lost profit — and most brands don&rsquo;t have the infrastructure to fight back.&rdquo;
              </p>
            </motion.div>
          </StaggerContainer>
        </section>

        <Divider />

        {/* ━━━ 02 — RESEARCH & DISCOVERY ━━━ */}
        <section className="responsive-padding" style={{ padding: '0 48px' }}>
          <StaggerContainer>
            <div style={{ maxWidth: '720px', marginBottom: '48px' }}>
              <motion.div variants={staggerChild}>
                <SectionLabel text="02 — Research & Discovery" />
              </motion.div>
              <motion.div variants={staggerChild}>
                <SectionTitle text="Research & Discovery" />
              </motion.div>
              <motion.div variants={staggerChild}>
                <BodyText>
                  I conducted competitive analysis across 5 trade promotion management platforms (Vividly, CPGvision, Promomash, HighRadius, Cresicor) and synthesized published research on deduction management workflows in CPG. The goal was to understand where existing tools create friction for finance teams and where the reconciliation process breaks down.
                </BodyText>
              </motion.div>
            </div>

            {/* Finding cards */}
            <motion.div variants={staggerChild} className="responsive-grid-3" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px',
            }}>
              {[
                {
                  finding: '01',
                  title: 'Fragmented Data',
                  body: 'Finance teams toggle between 4–6 systems to validate a single deduction: the ERP for invoice data, the promotion planning tool for deal terms, the retailer portal for backup documents, email for approvals, and spreadsheets for tracking. No single system holds the complete picture.',
                },
                {
                  finding: '02',
                  title: 'Invisible Patterns',
                  body: 'Teams resolve deductions one at a time without visibility into recurring patterns. The same retailer may be over-deducting on the same promotion type every quarter — but without aggregated analytics, nobody connects the dots. Root causes stay hidden.',
                },
                {
                  finding: '03',
                  title: 'Dispute Window Pressure',
                  body: 'Most retailer agreements allow 60–90 days to dispute a deduction. With manual validation taking 30–45 minutes per claim and backlogs of hundreds of open deductions, teams triage by dollar amount and let smaller claims expire — accepting preventable losses.',
                },
              ].map((item) => (
                <motion.div
                  key={item.finding}
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
                    color: ACCENT,
                    letterSpacing: '0.1em',
                    display: 'block',
                    marginBottom: '16px',
                  }}>
                    FINDING {item.finding}
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
                    {item.body}
                  </p>
                </motion.div>
              ))}
            </motion.div>

          </StaggerContainer>
        </section>

        <Divider />

        {/* ━━━ 03 — KEY DESIGN DECISIONS ━━━ */}
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <motion.div variants={staggerChild}>
                <DecisionCard
                  number="01"
                  title="Unified Deduction Workspace"
                  challenge="Finance teams waste 60% of validation time just finding the right documents. The deduction record is in one system, the promotion agreement in another, the backup PDF in a retailer portal, and the approval chain in email."
                  decision="Designed a single deduction detail view with a three-panel layout: data table on the left showing all deduction line items, a details panel on the right showing file metadata (filename, size, date, retailer, status), and a dispute modal that surfaces pre-populated reason categories. The user validates and disputes without leaving the screen."
                  result="Estimated validation time drops from 45 minutes to under 10. The dispute modal pre-populates reason options (Delivery completed, Promotion not planned, Charge not authorized, Spoilage didn't happen, Incorrect backup) — turning a research task into a selection task."
                  imageLabel="Clovr — Deduction Detail with Dispute Modal"
                  imageSrc="/images/Clovr/Checks Details.png"
                  accentColor={ACCENT}
                />
              </motion.div>
              <motion.div variants={staggerChild}>
                <DecisionCard
                  number="02"
                  title="Promotion Calendar as Gantt Timeline"
                  challenge="CPG brands run dozens of overlapping promotions across multiple retailers and product lines simultaneously. Existing tools show promotions in flat list views — making it impossible to see scheduling conflicts, coverage gaps, or which products are over-promoted."
                  decision="Designed a Gantt-style promotion calendar with a hierarchical left panel (Retailer → Product Category → SKU) and color-coded timeline bars showing promotion duration and type. A toggle switches between the Gantt view and a bar chart summary. The 'today' marker (red vertical line) anchors temporal context."
                  result="For the first time, brand managers can see their entire promotion portfolio in one view — identifying overlap, gaps, and concentration risk across retailers and product categories at a glance."
                  imageLabel="Clovr — Promotion Calendar Gantt View"
                  imageSrc="/images/Clovr/Promotion Calendar.png"
                  accentColor={ACCENT}
                />
              </motion.div>
              <motion.div variants={staggerChild}>
                <DecisionCard
                  number="03"
                  title="Dashboard as Financial Command Center"
                  challenge="Finance teams need to answer different questions at different times: 'How much are we spending on promotions this month?' vs. 'Which retailer is costing us the most in deductions?' vs. 'Where are our checks stuck?' Existing dashboards force all this into a single undifferentiated view."
                  decision="Designed a tabbed dashboard architecture with 7 category tabs (Promotions, Spoils, Slotting, Fines, MCBs, Marketing, Misc) — each showing category-specific metrics. The Promotions tab leads with a calendar bar chart, top line items, spend by retailer, and a deduction-type breakdown donut chart. Alert banners surface unresolved items requiring immediate attention."
                  result="The tabbed structure lets each team member navigate to their concern without wading through irrelevant data. The alert banners ensure critical items (unprocessed forms, incomplete setup) never get buried below the fold."
                  imageLabel="Clovr — Promotions Dashboard"
                  imageSrc="/images/Clovr/Sales Performance Forecast - Card.png"
                  accentColor={ACCENT}
                />
              </motion.div>
            </div>
          </StaggerContainer>
        </section>

        <Divider />

        {/* ━━━ 04 — THE SOLUTION ━━━ */}
        <section className="responsive-padding" style={{ padding: '0 48px' }}>
          <StaggerContainer>
            <div style={{ maxWidth: '720px', marginBottom: '64px' }}>
              <motion.div variants={staggerChild}>
                <SectionLabel text="04 — The Solution" />
              </motion.div>
              <motion.div variants={staggerChild}>
                <SectionTitle text="The Solution" />
              </motion.div>
              <motion.div variants={staggerChild}>
                <BodyText>
                  Clovr is a trade promotion management and deduction recovery platform designed for mid-market CPG brands — companies doing $10M–$200M in revenue that can&rsquo;t afford enterprise tools like SAP TPM but can&rsquo;t survive on spreadsheets. The platform unifies promotion planning, deduction validation, dispute management, sales forecasting, and retailer analytics into a single workspace — with the goal of recovering the 5–10% of trade spend that brands currently lose to invalid deductions.
                </BodyText>
              </motion.div>
            </div>

            {/* Screen carousel */}
            <motion.div variants={staggerChild}>
              <ScreenCarousel
                accentColor={ACCENT}
                screens={[
                  { label: 'Checks Database', description: 'Reconciliation status tracking with PAID/UNPAID/RECONCILED badges', src: '/images/Clovr/Checks Database.png' },
                  { label: 'Deduction Detail & Disputes', description: 'Three-panel layout with dispute modal and reason categories', src: '/images/Clovr/Checks Details.png' },
                  { label: 'Promotion Calendar', description: 'Gantt timeline with retailer/product hierarchy and color-coded bars', src: '/images/Clovr/Promotion Calendar.png' },
                  { label: 'Promotion Gantt View', description: 'Expanded Gantt timeline with detailed promotion periods', src: '/images/Clovr/Promotion Calendar 1.png' },
                  { label: 'Retailer Details', description: 'Contact info, broker details, store locations', src: '/images/Clovr/Retailer Info.png' },
                  { label: 'Sales Performance Forecast', description: 'Revenue metrics, month-over-month product performance table', src: '/images/Clovr/Sales Performance Forecast.png' },
                  { label: 'Forecast Summary Cards', description: 'High-level forecast KPIs and summary metrics', src: '/images/Clovr/Sales Performance Forecast - Card.png' },
                ]}
              />
            </motion.div>
          </StaggerContainer>
        </section>

        <Divider />

        {/* ━━━ 05 — INFORMATION ARCHITECTURE ━━━ */}
        <section className="responsive-padding" style={{ padding: '0 48px' }}>
          <StaggerContainer>
            <div style={{ maxWidth: '720px', marginBottom: '48px' }}>
              <motion.div variants={staggerChild}>
                <SectionLabel text="05 — Information Architecture" />
              </motion.div>
              <motion.div variants={staggerChild}>
                <SectionTitle text="Information Architecture" />
              </motion.div>
              <motion.div variants={staggerChild}>
                <BodyText>
                  The navigation organizes the platform by functional domain rather than data type. The sidebar groups: Dashboard (aggregate view), Check Library (reconciliation), Deductions (validation and disputes), Promotion (Calendar and Measurement), Forecast (revenue projections), Products (catalog management), and Retailer (relationship management). This structure mirrors how CPG finance teams actually divide responsibilities — the person managing deductions isn&rsquo;t the same person planning promotions.
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
                  title: 'Financial Operations',
                  subtitle: 'Dashboard · Check Library · Deductions',
                  body: 'Revenue-facing views. The dashboard provides aggregate spend visibility. Check Library tracks reconciliation status. Deductions is where validation and dispute work happens — the highest-traffic section for finance teams.',
                },
                {
                  title: 'Promotion Management',
                  subtitle: 'Calendar · Measurement',
                  body: 'Planning-facing views. The Gantt calendar handles promotion scheduling and conflict detection. Measurement provides post-promotion analytics — comparing planned vs. actual lift to evaluate ROI.',
                },
                {
                  title: 'Data & Relationships',
                  subtitle: 'Forecast · Products · Retailer',
                  body: 'Reference views. Sales forecasting for revenue planning. Product catalog for SKU management. Retailer profiles for contact info, store locations, and relationship context.',
                },
              ].map((item) => (
                <motion.div
                  key={item.title}
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
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    color: 'var(--text-primary)',
                    marginBottom: '4px',
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.625rem',
                    fontWeight: 500,
                    color: ACCENT,
                    letterSpacing: '0.06em',
                    marginBottom: '16px',
                  }}>
                    {item.subtitle}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9375rem',
                    fontWeight: 300,
                    lineHeight: 1.6,
                    color: 'var(--text-secondary)',
                  }}>
                    {item.body}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </StaggerContainer>
        </section>

        <Divider />

        {/* ━━━ 06 — COMPONENT PATTERNS ━━━ */}
        <section className="responsive-padding" style={{ padding: '0 48px' }}>
          <StaggerContainer>
            <div style={{ maxWidth: '720px', marginBottom: '48px' }}>
              <motion.div variants={staggerChild}>
                <SectionLabel text="06 — Component Patterns" />
              </motion.div>
              <motion.div variants={staggerChild}>
                <SectionTitle text="Component Patterns" />
              </motion.div>
              <motion.div variants={staggerChild}>
                <BodyText>
                  The platform handles extreme data density — product catalogs with hundreds of SKUs, deduction tables with thousands of line items, and promotion timelines spanning 12+ months. Three core component patterns maintain consistency while handling this complexity: metric cards for at-a-glance KPIs, data tables with advanced filtering for bulk operations, and the Gantt timeline for temporal visualization.
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
                  title: 'Metric Cards',
                  body: 'Three-card summary rows appear at the top of every major view: Dashboard (promotion spend metrics), Checks Database (missing deductions, missing backup, total revenue), Sales Forecast (earned revenue, expected revenue, product count). Icon + large number + label format ensures instant readability.',
                },
                {
                  title: 'Data Tables',
                  body: 'Sortable columns, search/filter bars, status badges (Paid, Reconciled, Missing Backup, In Review), pagination, and bulk actions (Download, Export). Consistent across Checks, Deductions, Invoices, and Promotions. Detail panels slide in from the right rather than navigating away.',
                },
                {
                  title: 'Gantt Timeline',
                  body: 'Hierarchical left panel (Retailer → Category → SKU) paired with horizontal color-coded timeline bars. The \'today\' marker provides temporal anchoring. Toggle between Gantt view and bar chart summary. Supports month-level zoom with horizontal scroll.',
                },
              ].map((item) => (
                <motion.div
                  key={item.title}
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
                    color: ACCENT,
                    letterSpacing: '0.1em',
                    display: 'block',
                    marginBottom: '16px',
                  }}>
                    PATTERN
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
                    {item.body}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </StaggerContainer>
        </section>

        <Divider />

        {/* ━━━ 07 — OUTCOME & REFLECTION ━━━ */}
        <section className="responsive-padding" style={{ padding: '0 48px' }}>
          <StaggerContainer>
            <div style={{ maxWidth: '720px', marginBottom: '48px' }}>
              <motion.div variants={staggerChild}>
                <SectionLabel text="07 — Outcome & Reflection" />
              </motion.div>
              <motion.div variants={staggerChild}>
                <SectionTitle text="Outcome & Reflection" />
              </motion.div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <motion.div variants={staggerChild}>
                  <BodyText>
                    Clovr represents a comprehensive design exploration into one of the most overlooked pain points in CPG finance — trade promotion deduction management. The platform demonstrates how thoughtful information architecture and data-dense UI patterns can transform a manual, error-prone workflow into a streamlined recovery operation.
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
                { metric: '7', label: 'Screens designed' },
                { metric: '3', label: 'Dashboard categories' },
                { metric: '2', label: 'Timeline views' },
                { metric: '5', label: 'Modal workflows' },
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
                    color: ACCENT,
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
                What I&rsquo;d do differently
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  'Conduct usability testing with 3–5 CPG finance teams to validate whether the three-panel deduction layout actually reduces validation time. The 45-to-10 minute estimate is based on workflow analysis, not measured task completion.',
                  'Design an automated deduction matching flow using AI suggestions — the current dispute modal requires manual reason selection, but pattern detection could pre-fill the most likely dispute reason based on historical data for that retailer and promotion type.',
                  'Build a deduction aging dashboard showing how long each open claim has been sitting relative to the dispute window deadline. Time-pressure visualization would help teams prioritize claims about to expire over recently received ones.',
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
        <section className="responsive-padding" style={{
          padding: '120px 48px 0 48px',
          borderTop: '1px solid var(--border)',
          marginTop: '120px',
        }}>
          <Link href="/work/nexora" style={{ textDecoration: 'none', display: 'block' }}>
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
                if (title) title.style.color = '#E8614D'
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
                  Nexora
                </h2>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  fontWeight: 400,
                  color: 'var(--text-secondary)',
                  marginTop: '8px',
                }}>
                  CRM & Sales Management Platform
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
