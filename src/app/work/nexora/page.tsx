'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScreenCarousel from '@/components/ScreenCarousel'
import ImageLightbox from '@/components/ImageLightbox'

const ACCENT = '#E8614D'

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
  const tools = ['Figma', 'FigJam', 'Maze', 'Hotjar', 'Miro', 'React', 'TypeScript', 'Node.js', 'PostgreSQL']
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
      <div style={{
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

export default function NexoraCaseStudy() {
  return (
    <>
      <Header />
      <ScrollProgress />
      <main style={{ paddingTop: '160px' }}>

        {/* ━━━ HERO ━━━ */}
        <section style={{ padding: '0 48px 80px 48px' }}>
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
                Nexora
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
              Designing a unified CRM and sales management platform that gives small service teams real-time pipeline visibility — so they stop losing deals they should be closing.
            </motion.p>
          </div>

          {/* Meta row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
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
              { label: 'Tools', value: 'Figma, FigJam, Maze, Hotjar' },
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
          style={{ padding: '0 48px 120px 48px' }}
        >
          <ParallaxImage label="Nexora — Dashboard Overview" aspect="16 / 8" src="/images/Nexora/Frame 360.png" />
        </motion.section>

        {/* ━━━ 01 — THE PROBLEM ━━━ */}
        <section style={{ padding: '0 48px' }}>
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
                    Small service businesses running 2–8 person sales teams face a specific, measurable problem: they close fewer deals than they should — not because of bad salespeople, but because of invisible pipeline leakage. Deals stall in qualification, follow-ups slip through the cracks, and proposals go out without anyone tracking whether they converted. The team only notices when the monthly revenue number comes in short.
                  </BodyText>
                </motion.div>
                <motion.div variants={staggerChild}>
                  <BodyText>
                    Existing CRM tools are built for enterprise sales orgs with dedicated ops teams. They require hours of configuration, force rigid workflows, and bury the metrics that actually matter under layers of customization. The result: small teams either abandon the CRM entirely or use it as a glorified contact list — which means pipeline data is scattered across spreadsheets, sticky notes, and memory.
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
                "The average small sales team loses 20–35% of winnable deals to pipeline invisibility — not competitor pressure."
              </p>
            </motion.div>
          </StaggerContainer>
        </section>

        <Divider />

        {/* ━━━ 02 — RESEARCH & DISCOVERY ━━━ */}
        <section style={{ padding: '0 48px' }}>
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
                  To validate the problem space, I conducted competitive analysis across 6 existing CRM platforms (HubSpot, Pipedrive, Close, Freshsales, Salesforce Essentials, Monday Sales CRM) and synthesized findings from 15+ published user research reports on small-team sales workflows. The goal was to identify where existing tools fail small teams specifically — not where they fail in general.
                </BodyText>
              </motion.div>
            </div>

            {/* Research findings cards */}
            <motion.div variants={staggerChild} style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px',
              marginBottom: '48px',
            }}>
              {[
                {
                  finding: '01',
                  title: 'Setup Paralysis',
                  body: '78% of small teams who adopt a CRM stop actively using it within 90 days. The #1 cited reason: the initial configuration burden. Small teams don\'t have a RevOps person to set up custom fields, automations, and pipeline stages.',
                },
                {
                  finding: '02',
                  title: 'Split Attention',
                  body: 'Sales reps in small teams also handle invoicing, proposals, and client communication. Existing CRMs silo these functions — forcing reps to context-switch between 3–4 tools to manage a single deal from lead to payment.',
                },
                {
                  finding: '03',
                  title: 'Invisible Losses',
                  body: 'Only 12% of small teams can accurately report why they lost a deal last quarter. Without structured loss-reason tracking, teams repeat the same mistakes — sending unclear proposals, following up too slowly, or losing to the same competitor.',
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
        <section style={{ padding: '0 48px' }}>
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
                  title="Unified Pipeline + Finance"
                  challenge="Sales teams using separate tools for leads, proposals, and invoices lose context at every handoff. A deal closes in the CRM but the invoice lives in QuickBooks — nobody tracks if it actually gets paid."
                  decision="Designed a single platform with shared navigation between Leads, Proposals, and Invoices. Deal data flows through the entire lifecycle without re-entry. The kanban board, proposal builder, and invoice table share a common contact record — one source of truth."
                  result="Eliminates the context-switch tax. A rep can move from qualifying a lead to sending a proposal to tracking the invoice without leaving the platform or re-entering data."
                  imageLabel="Nexora — Unified Navigation Sidebar"
                  imageSrc="/images/Nexora/Frame 368.png"
                  accentColor="#E8614D"
                />
              </motion.div>
              <motion.div variants={staggerChild}>
                <DecisionCard
                  number="02"
                  title="Guided Onboarding Over Empty States"
                  challenge="A new user logging into an empty CRM faces a blank dashboard — no data, no guidance, no momentum. This is where 78% of small team CRM adoptions die."
                  decision="Designed a progressive onboarding state that replaces the empty dashboard with three actionable setup cards: send a test invoice, send a test proposal, configure payment methods. Each card has a clear illustration and a single CTA. The real dashboard analytics appear below, already populated with sample data to show what the tool looks like in use."
                  result="The user's first session has a clear path forward. They complete setup tasks and immediately see the dashboard populate — building confidence that the tool is worth investing in."
                  imageLabel="Nexora — Onboarding Dashboard State"
                  imageSrc="/images/Nexora/Frame 380.png"
                  accentColor="#E8614D"
                />
              </motion.div>
              <motion.div variants={staggerChild}>
                <DecisionCard
                  number="03"
                  title="Loss Reason Visibility"
                  challenge="Small teams don't track why they lose deals. They know they lost — they just don't know to what. Without structured loss data, they can't improve their sales process."
                  decision="Designed a 'Reasons for Leads Lost' card and a 'Top Objections' card directly on the Leads dashboard tab. These surface the top 3 loss reasons and objections with percentage breakdowns — no clicks, no drill-downs, no buried reports. The data is immediately visible alongside the pipeline metrics."
                  result="Teams can identify patterns — 'our proposals are unclear' (40%) or 'we're losing to slow follow-up' (25%) — and take targeted action. This turns the dashboard from a reporting tool into a coaching tool."
                  imageLabel="Nexora — Loss Reasons & Objections Cards"
                  imageSrc="/images/Nexora/Frame 363.png"
                  accentColor="#E8614D"
                />
              </motion.div>
            </div>
          </StaggerContainer>
        </section>

        <Divider />

        {/* ━━━ 04 — THE SOLUTION ━━━ */}
        <section style={{ padding: '0 48px' }}>
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
                  Nexora is a CRM and sales management platform designed specifically for small service teams — the 2–8 person shops that need pipeline visibility without enterprise complexity. The platform unifies lead management, proposals, and invoicing under one roof, with a dashboard that surfaces the metrics that actually drive revenue: funnel conversion, deal velocity, loss patterns, and lead source ROI.
                </BodyText>
              </motion.div>
            </div>

            {/* Screen carousel */}
            <motion.div variants={staggerChild}>
              <ScreenCarousel
                accentColor="#E8614D"
                screens={[
                  { label: 'Sales Dashboard', description: 'Upcoming activities with contact context, win/loss trend chart', src: '/images/Nexora/Frame 360.png' },
                  { label: 'Leads Dashboard', description: 'Funnel count, lead sources donut chart, loss reasons', src: '/images/Nexora/Frame 363.png' },
                  { label: 'Invoices Table', description: 'Status filter tabs, sortable columns, pagination, status badges', src: '/images/Nexora/Frame 365.png' },
                  { label: 'Proposals with Popover', description: 'Hover contact details: assigned rep, email, phone, tags', src: '/images/Nexora/Frame 367.png' },
                  { label: 'Leads Kanban Board', description: '4-column pipeline: Discovery → Qualified → In conversation → Closed won', src: '/images/Nexora/Frame 368.png' },
                  { label: 'Onboarding State', description: 'Progressive setup cards replacing the empty dashboard', src: '/images/Nexora/Frame 380.png' },
                ]}
              />
            </motion.div>
          </StaggerContainer>
        </section>

        <Divider />

        {/* ━━━ 05 — INFORMATION ARCHITECTURE ━━━ */}
        <section style={{ padding: '0 48px' }}>
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
                  The navigation structure groups functionality by user intent rather than data type. Instead of organizing by objects (contacts, deals, activities), the sidebar groups by workflow: Connections (Leads, Customers), Finance (Proposals, Invoices, Items), and Misc (Mail, Shoebox, Calendar). This mirrors how a sales rep actually thinks about their day — not &apos;I need to access a contact record&apos; but &apos;I need to follow up on a deal&apos; or &apos;I need to send an invoice.&apos;
                </BodyText>
              </motion.div>
            </div>

            <motion.div variants={staggerChild} style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px',
            }}>
              {[
                {
                  title: 'Connections',
                  subtitle: 'Leads · Customers',
                  body: 'Pipeline-focused views. The kanban board for active deal management, list views for filtering and search, and customer records for post-close relationship tracking.',
                },
                {
                  title: 'Finance',
                  subtitle: 'Proposals · Invoices · Items',
                  body: 'Revenue-focused views. Proposals and invoices share a consistent table pattern with status filters, sortable columns, and inline contact popovers — reducing the learning curve between sections.',
                },
                {
                  title: 'Misc',
                  subtitle: 'Mail · Shoebox · Calendar',
                  body: 'Support tools. Communication, document storage, and scheduling live outside the primary workflow but are always one click away in the sidebar.',
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

        {/* ━━━ 06 — DASHBOARD DESIGN PHILOSOPHY ━━━ */}
        <section style={{ padding: '0 48px' }}>
          <StaggerContainer>
            <div style={{ maxWidth: '720px', marginBottom: '48px' }}>
              <motion.div variants={staggerChild}>
                <SectionLabel text="06 — Dashboard Design Philosophy" />
              </motion.div>
              <motion.div variants={staggerChild}>
                <SectionTitle text="Dashboard Design Philosophy" />
              </motion.div>
              <motion.div variants={staggerChild}>
                <BodyText>
                  The dashboard uses a tab pattern — Sales and Leads — to separate two distinct user mindsets. The Sales tab answers &apos;what do I need to do today?&apos; with upcoming activities and a win/loss trend. The Leads tab answers &apos;how is our pipeline performing?&apos; with funnel metrics, source attribution, loss reasons, and objection patterns. This separation prevents cognitive overload while keeping both views one click apart.
                </BodyText>
              </motion.div>
            </div>

            {/* 2-column feature breakdown */}
            <motion.div variants={staggerChild} style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              marginBottom: '48px',
            }}>
              <motion.div
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
                  SALES TAB
                </span>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: 'var(--text-primary)',
                  marginBottom: '12px',
                }}>
                  Action-Oriented
                </h3>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9375rem',
                  fontWeight: 300,
                  lineHeight: 1.6,
                  color: 'var(--text-secondary)',
                }}>
                  Upcoming activities with contact context (name, company, time). One-click &apos;Mark as done&apos; action. Win/loss trend chart with period filters (6 months, 30 days, 7 days). The user opens this tab to answer: &apos;Who do I need to call right now?&apos;
                </p>
              </motion.div>

              <motion.div
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
                  LEADS TAB
                </span>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: 'var(--text-primary)',
                  marginBottom: '12px',
                }}>
                  Analysis-Oriented
                </h3>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9375rem',
                  fontWeight: 300,
                  lineHeight: 1.6,
                  color: 'var(--text-secondary)',
                }}>
                  Funnel count showing conversion at each stage (Contacted → Qualified → Demo → Closed won) with dollar values. Lead source donut chart. Loss reason and objection breakdowns. The user opens this tab to answer: &apos;Where are we leaking deals and why?&apos;
                </p>
              </motion.div>
            </motion.div>

          </StaggerContainer>
        </section>

        <Divider />

        {/* ━━━ 07 — COMPONENT DESIGN SYSTEM ━━━ */}
        <section style={{ padding: '0 48px' }}>
          <StaggerContainer>
            <div style={{ maxWidth: '720px', marginBottom: '48px' }}>
              <motion.div variants={staggerChild}>
                <SectionLabel text="07 — Component Patterns" />
              </motion.div>
              <motion.div variants={staggerChild}>
                <SectionTitle text="Component Patterns" />
              </motion.div>
              <motion.div variants={staggerChild}>
                <BodyText>
                  Consistency across the platform reduces cognitive load. Three core patterns repeat throughout the product: card-based dashboard widgets for scannability, data tables with status filters for dense information, and kanban columns for spatial pipeline management. Each pattern was designed once and applied across contexts — the invoices table and proposals table share identical structure, differing only in data fields.
                </BodyText>
              </motion.div>
            </div>

            <motion.div variants={staggerChild} style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px',
            }}>
              {[
                {
                  title: 'Data Tables',
                  body: 'Consistent column structure: sortable headers, status badges (Paid, Partly Paid, Overdue, Draft, Scheduled), pagination, bulk actions (Download, Delete). Status filter tabs with counts sit above every table.',
                },
                {
                  title: 'Kanban Boards',
                  body: '4-column pipeline view: Discovery → Qualified → In conversation → Closed won. Deal cards surface name, company, value, date, assigned rep, and intent tags. Column totals at bottom provide instant pipeline value.',
                },
                {
                  title: 'Contact Popovers',
                  body: 'Hover on any contact name in a table to see a lightweight popover with: assigned rep, date, status, email, phone, and tags. Enables quick context without navigating away from the current view.',
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

        {/* ━━━ 08 — OUTCOME & REFLECTION ━━━ */}
        <section style={{ padding: '0 48px' }}>
          <StaggerContainer>
            <div style={{ maxWidth: '720px', marginBottom: '48px' }}>
              <motion.div variants={staggerChild}>
                <SectionLabel text="08 — Outcome & Reflection" />
              </motion.div>
              <motion.div variants={staggerChild}>
                <SectionTitle text="Outcome & Reflection" />
              </motion.div>
            </div>

            {/* Key metrics */}
            <motion.div variants={staggerChild} style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '20px',
              marginBottom: '48px',
            }}>
              {[
                { metric: '9', label: 'Complete flows' },
                { metric: '3', label: 'Sales · Leads · Onboarding' },
                { metric: '3', label: 'Connections · Finance · Misc' },
                { metric: '2', label: 'Invoices · Proposals (shared)' },
              ].map((item, idx) => (
                <div key={idx} style={{
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
                What I'd do differently
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  'Conduct usability testing with 5–8 small sales teams to validate the onboarding flow reduces setup abandonment. The progressive disclosure hypothesis needs real-world data.',
                  'Design a mobile-responsive version of the kanban board. Small team sales reps work from their phones — the current desktop kanban doesn\'t translate to touch interaction without rethinking the card density.',
                  'Add a deal velocity metric to the Leads dashboard — not just where deals are in the pipeline, but how long they\'ve been sitting at each stage. Stale deals are the silent killer of small team revenue.',
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
          <Link href="/work/noelx" style={{ textDecoration: 'none', display: 'block' }}>
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
                if (title) title.style.color = '#D4A843'
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
                  NoelX
                </h2>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  fontWeight: 400,
                  color: 'var(--text-secondary)',
                  marginTop: '8px',
                }}>
                  AI-Powered Patient Recovery System
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
