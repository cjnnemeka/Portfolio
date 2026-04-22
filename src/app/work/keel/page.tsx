'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScreenCarousel from '@/components/ScreenCarousel'
import ImageLightbox from '@/components/ImageLightbox'

const ACCENT = '#1D4ED8'
const DEMO_URL = 'https://keel-demo-psi.vercel.app'

const SECTION_IDS = [
  'section-problem',
  'section-question',
  'section-decisions',
  'section-cut-scope',
  'section-artifact',
  'section-pov',
  'section-reflection',
] as const

const SECTION_LABELS = ['Problem', 'Question', 'Decisions', 'Cut Scope', 'Artifact', 'POV', 'Reflection']

/* ── Animation variants ───────────────────────────── */

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

/* ── Hooks ────────────────────────────────────────── */

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return reduced
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    setIsDesktop(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isDesktop
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
          transition: { staggerChildren: 0.1 },
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
            src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${src}`}
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
    if (isNaN(target)) { setDisplay(value); return }
    const duration = 1500
    const startTime = Date.now()
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(eased * target)
      setDisplay(`${prefix}${current}${suffixPart}`)
      if (progress < 1) requestAnimationFrame(animate)
      else setDisplay(value)
    }
    requestAnimationFrame(animate)
  }, [isInView, value])

  return <span ref={ref}>{display}</span>
}

function Divider() {
  return (
    <div
      className="keel-divider"
      style={{
        height: '1px',
        backgroundColor: 'var(--border)',
        margin: '120px 0',
      }}
    />
  )
}

/* ── NEW: Sticky Thesis Bar ──────────────────────── */

function StickyThesisBar({
  designQuestionRef,
}: {
  designQuestionRef: React.RefObject<HTMLElement | null>
}) {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (!designQuestionRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show when the Design Question section is above the viewport (scrolled past)
        setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0)
      },
      { threshold: 0 }
    )
    observer.observe(designQuestionRef.current)
    return () => observer.disconnect()
  }, [designQuestionRef])

  const shown = visible && !dismissed

  return (
    <div
      role="complementary"
      aria-label="Thesis summary"
      className="thesis-bar-outer"
      style={{
        position: 'fixed',
        top: '64px',
        left: 0,
        right: 0,
        zIndex: 90,
        opacity: shown ? 1 : 0,
        transform: reducedMotion ? 'none' : `translateY(${shown ? '0' : '-10px'})`,
        pointerEvents: shown ? 'auto' : 'none',
        transition: reducedMotion ? 'opacity 300ms ease-out' : 'opacity 300ms ease-out, transform 300ms ease-out',
        backgroundColor: 'rgba(29, 78, 216, 0.10)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(29, 78, 216, 0.22)',
      }}
    >
      <div
        className="thesis-bar-inner"
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '0 48px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <div
          style={{
            width: '3px',
            alignSelf: 'stretch',
            backgroundColor: ACCENT,
            flexShrink: 0,
          }}
        />
        <p
          style={{
            flex: 1,
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            fontWeight: 500,
            color: 'var(--text-primary)',
            lineHeight: 1.45,
            padding: '12px 0',
          }}
        >
          Keel catches AI-generated design-system violations before they ship — invented tokens, off-scale spacing, invented shadows. Humans always approve.
        </p>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss thesis bar"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '16px',
            lineHeight: 1,
            cursor: 'pointer',
            padding: '4px 8px',
            marginRight: '8px',
            transition: 'color 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          ×
        </button>
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          .thesis-bar-outer {
            top: 48px !important;
          }
          .thesis-bar-inner {
            padding: 0 20px !important;
          }
          .thesis-bar-inner p {
            font-size: 12px !important;
          }
        }
      `}</style>
    </div>
  )
}

/* ── NEW: Fixed Section Index ────────────────────── */

function FixedSectionIndex({ heroInView }: { heroInView: boolean }) {
  const [ratios, setRatios] = useState<number[]>(() => SECTION_IDS.map(() => 0))
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const isDesktop = useIsDesktop()
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (!isDesktop) return
    const observer = new IntersectionObserver(
      (entries) => {
        setRatios((prev) => {
          const next = [...prev]
          entries.forEach((entry) => {
            const idx = SECTION_IDS.indexOf(entry.target.id as typeof SECTION_IDS[number])
            if (idx !== -1) next[idx] = entry.intersectionRatio
          })
          return next
        })
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    )
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [isDesktop])

  const activeIdx = ratios.reduce(
    (max, ratio, idx) => (ratio > max.ratio ? { idx, ratio } : max),
    { idx: 0, ratio: 0 }
  ).idx

  const handleClick = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' })
  }, [reducedMotion])

  if (!isDesktop) return null
  if (heroInView) return null

  return (
    <nav
      aria-label="Section navigation"
      style={{
        position: 'fixed',
        left: '32px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 80,
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      {SECTION_IDS.map((id, i) => {
        const isActive = i === activeIdx
        const isHovered = hoveredIdx === i
        return (
          <button
            key={id}
            onClick={() => handleClick(id)}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            aria-label={`Jump to ${SECTION_LABELS[i]}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                flexShrink: 0,
                backgroundColor: isActive
                  ? ACCENT
                  : isHovered
                    ? 'rgba(29, 78, 216, 0.5)'
                    : 'transparent',
                border: isActive ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                transition: reducedMotion ? 'none' : 'all 200ms ease',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 500,
                color: 'var(--text-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                opacity: isHovered ? 1 : 0,
                transform: reducedMotion ? 'none' : `translateX(${isHovered ? '0' : '-4px'})`,
                transition: reducedMotion ? 'opacity 150ms ease' : 'opacity 150ms ease, transform 200ms ease',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
              }}
            >
              {SECTION_LABELS[i]}
            </span>
          </button>
        )
      })}

      {/* Persistent link to design system reference */}
      <Link
        href="/work/keel/system"
        aria-label="Jump to the full design system reference page"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          marginTop: '14px',
          paddingTop: '18px',
          paddingLeft: '2px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: ACCENT,
          transition: 'opacity 0.2s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
      >
        <span style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: ACCENT,
          flexShrink: 0,
        }} />
        Design system →
      </Link>
    </nav>
  )
}

/* ── NEW: Progressive Disclosure Decision Card ───── */

function ProgressiveDecisionCard({
  challenge,
  decision,
  result,
  imageSrc,
  imageAlt,
}: {
  challenge: string
  decision: string
  result: string
  imageSrc: string
  imageAlt: string
}) {
  const [expanded, setExpanded] = useState(false)
  const reducedMotion = usePrefersReducedMotion()

  const lineRef = useRef<HTMLDivElement>(null)
  const lineInView = useInView(lineRef, { once: true, margin: '-100px' })

  return (
    <div
      className="decision-card responsive-flex"
      style={{
        display: 'flex',
        gap: '48px',
        padding: '48px 0',
        borderBottom: '1px solid var(--border)',
        alignItems: 'flex-start',
      }}
    >
      {/* Content column */}
      <div
        className="decision-card-content"
        style={{
          flex: '0 0 45%',
          position: 'relative',
          paddingLeft: '24px',
        }}
        ref={lineRef}
      >
        {/* Vertical accent line */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: lineInView ? '100%' : 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '2px',
            backgroundColor: ACCENT,
          }}
        />

        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: 500,
            color: ACCENT,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            display: 'block',
            marginBottom: '16px',
          }}
        >
          Challenge
        </span>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '15px',
            fontWeight: 400,
            lineHeight: 1.6,
            color: 'var(--text-primary)',
          }}
        >
          {challenge}
        </p>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="expanded"
              initial={reducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
              animate={reducedMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
              exit={reducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ marginTop: '24px' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    fontWeight: 500,
                    color: ACCENT,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    display: 'block',
                    marginBottom: '12px',
                  }}
                >
                  Decision
                </span>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '15px',
                    fontWeight: 400,
                    lineHeight: 1.6,
                    color: 'var(--text-primary)',
                  }}
                >
                  {decision}
                </p>
              </div>
              <div style={{ marginTop: '24px' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    fontWeight: 500,
                    color: ACCENT,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    display: 'block',
                    marginBottom: '12px',
                  }}
                >
                  Result
                </span>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '15px',
                    fontWeight: 400,
                    lineHeight: 1.6,
                    color: 'var(--text-primary)',
                  }}
                >
                  {result}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setExpanded((v) => !v)}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            marginTop: '32px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: 500,
            color: ACCENT,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            transition: 'color 0.2s ease',
            position: 'relative',
            display: 'inline-block',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-primary)'
            e.currentTarget.style.textDecoration = 'underline'
            e.currentTarget.style.textDecorationColor = ACCENT
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = ACCENT
            e.currentTarget.style.textDecoration = 'none'
          }}
        >
          {expanded ? 'Collapse −' : 'Expand reasoning +'}
        </button>
      </div>

      {/* Image column */}
      <div
        className="decision-card-image"
        style={{
          flex: '0 0 calc(55% - 48px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
      >
        <ImageLightbox
          src={imageSrc}
          alt={imageAlt}
          style={{
            maxWidth: '100%',
            maxHeight: '450px',
            height: 'auto',
            width: 'auto',
            objectFit: 'contain',
            borderRadius: '12px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
          }}
        />
      </div>

      <style jsx>{`
        @media (max-width: 1023px) {
          .decision-card {
            flex-direction: column !important;
            gap: 32px !important;
          }
          .decision-card-content {
            flex: 1 1 100% !important;
          }
          .decision-card-image {
            flex: 1 1 100% !important;
            order: 2;
          }
        }
      `}</style>
    </div>
  )
}

/* ── NEW: Scroll-Scrubbed Demo Loop ───────────────── */

type DemoStep = {
  number: string
  title: string
  image: string
  alt: string
  body: string
}

const DEMO_STEPS: DemoStep[] = [
  {
    number: '01',
    title: 'Monday morning',
    image: '/images/Keel/drift-dashboard-light.png',
    alt: 'Keel drift dashboard — Meridian at 62/100 with nine drift issues',
    body: 'Maya opens Keel. Nine drift issues since Monday. Health 62/100. Three red high-severity rows at the top.',
  },
  {
    number: '02',
    title: 'See the drift',
    image: '/images/Keel/drift-detail-dark.png',
    alt: 'Drift detail — documentation, tokens, and component source diffed in three columns',
    body: 'Click the first row. Textarea.tsx references input-border — a token that sounds right and isn’t defined anywhere. Three columns side-by-side show docs, tokens, and component source. Orange ≠ markers mark the disagreement.',
  },
  {
    number: '03',
    title: 'Parity check runs',
    image: '/images/Keel/parity-pass-light.png',
    alt: 'Parity check passing — 23 rules across 6 categories, no violations',
    body: 'Improver pulls retrieval context from similar components via Voyage embeddings. The parity checker runs the fix against the foundation: 23 rules across 6 categories. No violations.',
  },
  {
    number: '04',
    title: 'Policy routes it',
    image: '/images/Keel/policy-light.png',
    alt: 'Trust-level policy engine — per-action routing',
    body: 'The policy engine decides what happens next. A one-class token swap on an undefined reference routes to Draft PR, not auto-merge. Conservative by default. Ownership stays human.',
  },
  {
    number: '05',
    title: 'The proposal renders',
    image: '/images/Keel/improver-proposal-dark.png',
    alt: 'Improver proposal — rationale, parity pass, policy decision, and live preview',
    body: 'Rationale: replace undefined input-border with documented border token. Parity: pass. Policy: Draft PR. Live preview of the compiled component renders inline. Accept, Reject, or ignore.',
  },
  {
    number: '06',
    title: 'Accept',
    image: '/images/Keel/timeline-dark.png',
    alt: 'Supervision timeline — new pending row added',
    body: 'Toast. Panel collapses. A new pending row lands at the top of the supervision timeline, timestamped seconds ago. Detection to resolution in six clicks.',
  },
]

function DemoLoopDesktop() {
  const [activeStep, setActiveStep] = useState(0)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio > 0.5) {
            const index = stepRefs.current.findIndex((ref) => ref === entry.target)
            if (index !== -1) setActiveStep(index)
          }
        })
      },
      { threshold: [0, 0.5, 1], rootMargin: '-20% 0px -20% 0px' }
    )
    stepRefs.current.forEach((ref) => ref && observer.observe(ref))
    return () => observer.disconnect()
  }, [])

  return (
    <div
      style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '48px',
      }}
    >
      {/* Sticky image column */}
      <div style={{ position: 'relative' }}>
        <div
          style={{
            position: 'sticky',
            top: '15vh',
            height: '70vh',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--bg-card)',
          }}
        >
          {DEMO_STEPS.map((step, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: activeStep === i ? 1 : 0,
                transition: 'opacity 300ms ease-out',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
              }}
            >
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <Image
                  src={step.image}
                  alt={step.alt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  priority={i < 2}
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Flowing text column */}
      <div>
        {DEMO_STEPS.map((step, i) => (
          <div
            key={i}
            ref={(el) => {
              stepRefs.current[i] = el
            }}
            style={{
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '48px 0',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: ACCENT,
                letterSpacing: '0.12em',
                marginBottom: '24px',
              }}
            >
              {step.number}
            </p>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                color: 'var(--text-primary)',
                marginBottom: '24px',
              }}
            >
              {step.title}
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.0625rem',
                fontWeight: 300,
                lineHeight: 1.65,
                color: 'var(--text-secondary)',
                maxWidth: '540px',
              }}
            >
              {step.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function DemoLoopMobile() {
  return (
    <div className="keel-demo-mobile-stack" style={{ display: 'flex', flexDirection: 'column', gap: '64px' }}>
      {DEMO_STEPS.map((step, i) => (
        <div key={i}>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: ACCENT,
              letterSpacing: '0.12em',
              marginBottom: '16px',
            }}
          >
            {step.number}
          </p>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 5vw, 2rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              color: 'var(--text-primary)',
              marginBottom: '20px',
            }}
          >
            {step.title}
          </h3>
          <div
            style={{
              width: '100%',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '1px solid var(--border)',
              marginBottom: '20px',
              position: 'relative',
              aspectRatio: '16 / 10',
            }}
          >
            <Image
              src={step.image}
              alt={step.alt}
              fill
              sizes="(max-width: 1023px) 100vw, 50vw"
              priority={i < 2}
              style={{ objectFit: 'cover' }}
            />
          </div>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              fontWeight: 300,
              lineHeight: 1.65,
              color: 'var(--text-secondary)',
            }}
          >
            {step.body}
          </p>
        </div>
      ))}
    </div>
  )
}

function DemoLoop() {
  const isDesktop = useIsDesktop()
  const reducedMotion = usePrefersReducedMotion()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  // SSR / pre-mount: render mobile pattern as the safe default.
  if (!mounted) return <DemoLoopMobile />

  if (!isDesktop || reducedMotion) return <DemoLoopMobile />
  return <DemoLoopDesktop />
}

/* ── Main page ────────────────────────────────────── */

export default function KeelCaseStudy() {
  const designQuestionRef = useRef<HTMLElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const [heroInView, setHeroInView] = useState(true)

  useEffect(() => {
    if (!heroRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setHeroInView(entry.isIntersecting)
      },
      { threshold: 0 }
    )
    observer.observe(heroRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Header />
      <ScrollProgress />
      <StickyThesisBar designQuestionRef={designQuestionRef} />
      <FixedSectionIndex heroInView={heroInView} />
      <main style={{ paddingTop: '160px' }}>

        {/* ━━━ HERO ━━━ */}
        <section ref={heroRef} className="responsive-padding keel-hero-section" style={{ padding: '0 48px 80px 48px' }}>
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

          <div style={{ marginBottom: '48px' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                fontWeight: 500,
                color: ACCENT,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
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
                Keel
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
              Generation is getting faster. Review isn&rsquo;t. Keel is the governance layer that catches what AI ships before it lands in your design system.
            </motion.p>

            {/* TL;DR — the whole product in one line */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
              className="keel-hero-tldr"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8125rem',
                fontWeight: 500,
                color: 'var(--text-primary)',
                marginTop: '24px',
                lineHeight: 1.5,
              }}
            >
              Connect a design system <span style={{ color: ACCENT, margin: '0 6px' }}>→</span> Keel watches every AI-authored PR <span style={{ color: ACCENT, margin: '0 6px' }}>→</span> bad code never ships.
            </motion.p>

            {/* FOR — target audience */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.65 }}
              className="keel-hero-for"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginTop: '12px',
              }}
            >
              For design systems leads at 50–200 person product companies.
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
              { label: 'Role', value: 'Product Designer & Builder' },
              { label: 'Timeline', value: '2026' },
              { label: 'Tools', value: 'Next.js, TypeScript, Tailwind, Postgres, Anthropic API' },
              { label: 'Type', value: 'AI-Native — Live Demo' },
            ].map((item) => (
              <div key={item.label}>
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
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

          {/* Dual CTA: live demo + design system */}
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
            <Link
              href="/work/keel/system"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#FFFFFF',
                background: ACCENT,
                padding: '13px 20px',
                borderRadius: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'transform 0.25s ease, background-color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#1E40AF'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = ACCENT
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              Explore the design system
              <span style={{ fontSize: '14px' }}>→</span>
            </Link>
            <a
              href={DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: ACCENT,
                background: 'transparent',
                border: `1px solid ${ACCENT}`,
                padding: '12px 20px',
                borderRadius: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'background-color 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(29, 78, 216, 0.12)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              View live demo
              <span style={{ fontSize: '14px' }}>↗</span>
            </a>
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
          className="responsive-padding keel-hero-image-section"
          style={{ padding: '0 48px 120px 48px' }}
        >
          <ParallaxImage
            label="Keel dashboard showing drift detection for the Meridian design system"
            aspect="16 / 8"
            src="/images/Keel/drift-dashboard-light.png"
          />
        </motion.section>

        {/* ━━━ IN PLAIN ENGLISH ━━━ */}
        <section className="responsive-padding keel-plain-english" style={{ padding: '0 48px 120px 48px' }}>
          <StaggerContainer>
            <div style={{ maxWidth: '760px' }}>
              <motion.p variants={staggerChild} style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 500,
                color: ACCENT,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '24px',
              }}>
                In plain English
              </motion.p>
              <motion.p variants={staggerChild} style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(1.125rem, 1.6vw, 1.3125rem)',
                fontWeight: 400,
                lineHeight: 1.6,
                color: 'var(--text-primary)',
              }}>
                Keel watches AI-generated pull requests against your design system. Before the code can ship, it checks that every referenced token actually exists, every spacing value lands on your scale (4/8/12, not <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.92em', color: ACCENT, background: 'rgba(29, 78, 216, 0.10)', padding: '1px 6px', borderRadius: '4px' }}>p-7</code>), and no shadows, colors, or radii were invented. When Keel finds a violation, it proposes a fix using the correct token and asks you — auto-merge, draft PR, or reject. Every decision lands in an auditable timeline. Nothing merges without a human.
              </motion.p>
            </div>
          </StaggerContainer>
        </section>

        {/* ━━━ 01 — THE PROBLEM ━━━ */}
        <section id="section-problem" className="responsive-padding" style={{ padding: '0 48px' }}>
          <StaggerContainer>
            <div style={{ maxWidth: '720px' }}>
              <motion.p variants={staggerChild} style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: 'var(--text-muted)',
                letterSpacing: '0.1em',
                marginBottom: '20px',
              }}>
                01
              </motion.p>
              <motion.h2 variants={staggerChild} style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)',
                fontWeight: 700,
                letterSpacing: '-0.035em',
                lineHeight: 1.1,
                color: 'var(--text-primary)',
                marginBottom: '40px',
              }}>
                The Problem
              </motion.h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <motion.p variants={staggerChild} style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.0625rem',
                  fontWeight: 300,
                  lineHeight: 1.7,
                  color: 'var(--text-secondary)',
                  maxWidth: '680px',
                }}>
                  AI-generated design system code looks right at a glance and is wrong in ways that take twenty minutes to find. An invented shadow value that reads plausibly but isn&rsquo;t in the foundation. Off-scale spacing — <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95em', color: 'var(--text-primary)', background: 'rgba(255,255,255,0.04)', padding: '1px 6px', borderRadius: '4px' }}>p-7</code> when the scale is 4/8/12/16/20/24. A primitive used where a semantic token should be. A token name that sounds correct and doesn&rsquo;t exist.
                </motion.p>

                <motion.p variants={staggerChild} style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.0625rem',
                  fontWeight: 300,
                  lineHeight: 1.7,
                  color: 'var(--text-secondary)',
                  maxWidth: '680px',
                }}>
                  A design systems lead reviewing fifteen AI-authored pull requests a day cannot catch these at review speed. So they don&rsquo;t. The drift compounds. Every company running an AI-assisted authoring loop in 2026 is hitting this problem. Spotify and GitHub solved it internally, with dedicated teams. Nobody is solving it for the mid-size product company.
                </motion.p>

                <motion.p variants={staggerChild} style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.0625rem',
                  fontWeight: 400,
                  lineHeight: 1.7,
                  color: 'var(--text-primary)',
                  maxWidth: '680px',
                }}>
                  The tooling industry&rsquo;s answer has been to ship generation faster. Keel is the other answer.
                </motion.p>
              </div>
            </div>
          </StaggerContainer>
        </section>

        <Divider />

        {/* ━━━ 02 — THE DESIGN QUESTION (focal moment) ━━━ */}
        <section
          id="section-question"
          ref={designQuestionRef}
          className="responsive-padding design-question-section"
          style={{ padding: '128px 48px' }}
        >
          <StaggerContainer>
            <motion.p variants={staggerChild} style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              fontWeight: 500,
              color: 'var(--text-muted)',
              letterSpacing: '0.1em',
              marginBottom: '20px',
            }}>
              02
            </motion.p>
            <motion.p variants={staggerChild} style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 500,
              color: ACCENT,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '32px',
            }}>
              The Design Question
            </motion.p>
            <motion.h2
              variants={staggerChild}
              className="design-question-title"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2.75rem',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                color: 'var(--text-primary)',
                maxWidth: '860px',
              }}
            >
              How do design systems stay trustworthy when AI agents are consuming them?
            </motion.h2>
            <motion.p variants={staggerChild} style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.0625rem',
              fontWeight: 300,
              lineHeight: 1.7,
              color: 'var(--text-secondary)',
              maxWidth: '640px',
              marginTop: '24px',
            }}>
              Every design decision in Keel traces back to this. When I couldn&rsquo;t answer it, I cut the feature.
            </motion.p>
          </StaggerContainer>
        </section>

        <Divider />

        {/* ━━━ 03 — KEY DECISIONS ━━━ */}
        <section id="section-decisions" className="responsive-padding" style={{ padding: '0 48px' }}>
          <StaggerContainer>
            <div style={{ maxWidth: '720px', marginBottom: '48px' }}>
              <motion.p variants={staggerChild} style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: 'var(--text-muted)',
                letterSpacing: '0.1em',
                marginBottom: '20px',
              }}>
                03
              </motion.p>
              <motion.h2 variants={staggerChild} style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)',
                fontWeight: 700,
                letterSpacing: '-0.035em',
                lineHeight: 1.1,
                color: 'var(--text-primary)',
                marginBottom: '32px',
              }}>
                Key Decisions
              </motion.h2>
              <motion.p variants={staggerChild} style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.0625rem',
                fontWeight: 300,
                lineHeight: 1.7,
                color: 'var(--text-secondary)',
              }}>
                Keel could have shipped three AI modes, written back to Figma, rendered pixel diffs, supported multi-user teams, and integrated with Storybook. It shipped one AI-facing mode and five subsystems. Every cut is documented. Scope discipline is the design.
              </motion.p>
            </div>

            <ProgressiveDecisionCard
              challenge="Keel could have shipped three AI-facing modes. Improver (AI fixes existing drift). Assisted (AI helps author new work with real-time parity feedback). 80/20 (AI drafts 80% of a component, human polishes 20%). Shipping all three was feasible. The question wasn't capacity — it was which mode would land the thesis."
              decision="Ship Improver first. Cut 80/20. Leave Assisted as a UI stub marked “coming soon.”"
              result="Improver is the only mode that contradicts the industry narrative. Every other AI tool optimizes generation. Improver optimizes review. It also has the tightest demo: input is existing drift, output is a one-class token swap. Either it works or it doesn't. Assisted and 80/20 would have required imagining AI's output quality at scale — Improver shows one deterministic swap you can verify in the live product. Scope discipline as product design, not as engineering trade-off."
              imageSrc="/images/Keel/improver-proposal-dark.png"
              imageAlt="Improver proposal — rationale, parity pass, policy decision, and live preview"
            />

            <ProgressiveDecisionCard
              challenge="When Keel flags drift, the obvious next move is to render both component versions side-by-side and visually diff them. Designers would love it. It would demo well."
              decision="Don't build it. Link to the two versions instead."
              result="Pixel diffing is a visualization product in itself — rendering both states, computing visual differences, resolving layout ambiguity when the diff spans layout changes. Building a visualization product inside a governance product is scope creep disguised as polish. Link-to-version delivers ninety percent of the insight (here's the change, here's what it replaces, here's why it happened) for ten percent of the engineering. The lesson: scope discipline means noticing when a feature would become its own product."
              imageSrc="/images/Keel/drift-detail-dark.png"
              imageAlt="Drift detail — documentation, tokens, and component source diffed in three columns"
            />

            <ProgressiveDecisionCard
              challenge="Parity checking — the audit that decides whether AI output conforms to the foundation — could have been probabilistic. Ask a model: “does this output look right?” Model-based checking would catch nuance that a whitelist misses."
              decision="Use a deterministic whitelist. Either the token exists in the foundation, or it doesn't. Either the spacing value is on the scale, or it isn't. No probabilistic judgment anywhere in the parity check."
              result="Probabilistic review fails at exactly the wrong moment. When AI-generated code looks plausible and isn't, a model asked “does this look right?” will often answer yes. That's the whole class of bug Keel exists to catch. Whitelists don't have bad days. When the output is a gate on whether AI-authored code ships, reliability beats sophistication — I picked the boring tool because the boring tool doesn't have bad days."
              imageSrc="/images/Keel/parity-failing-2-light.png"
              imageAlt="Parity check failing — whitelist linting catches invented tokens and off-scale spacing"
            />

            <ProgressiveDecisionCard
              challenge="The design-systems tool genre is Apple-minimal. Sparse dashboards, generous whitespace, one hero metric per screen. The portfolio instinct — and the quality bar I set against NoelX — was to match that aesthetic. Minimalism reads as refined. Density reads as administrative."
              decision="Design Keel dense. Ten drift rows visible on the dashboard before the user scrolls, not three. Three columns simultaneously open on the detail view, not sequenced. Twenty-three parity rules on one audit screen, not paginated or accordioned."
              result="Keel's user is a design systems lead reviewing fifteen AI-authored pull requests a day. They don't want two clicks to know whether something urgent is in the queue. For them, density is an affordance, not clutter. An early sparse prototype read as “Keel has nothing to tell you right now” — the opposite of what the tool is for. The dense version reads as “Keel has been watching.” The harder craft call was arguing against the default aesthetic when the default aesthetic was wrong for this user. Minimalism in a review tool is hostility disguised as taste."
              imageSrc="/images/Keel/drift-dashboard-dark.png"
              imageAlt="Keel drift dashboard — dense by design, ten rows visible before scroll"
            />

            <ProgressiveDecisionCard
              challenge="Policy configuration is a permissions-shaped interface. The genre default — AWS IAM, role hierarchies, nested rule trees, permission matrices — is administrative, not decisive. My reference bar for this surface was explicit: must feel like Linear or Stripe, not AWS IAM."
              decision="Flat list of actions. Three trust levels as a segmented control per row. No role hierarchies, no permission grids, no grouped accordions. One screen answers one question — what auto-merges today, what goes to draft PR, what stays suggest-only."
              result="Permissions matrices fail because the user doesn't know where to look. A flat list forces the UI to answer a specific question, and that forced me into a specific information architecture — actions are rows, trust is the axis, the tool's job is to make “raise the trust on this row” a two-click interaction. The visual simplicity wasn't a stylistic choice. It was a consequence of triaging the user's decision down to a single question. When the IA is right, the visual language is almost free. Simplicity isn't a style — it's the output of clarity."
              imageSrc="/images/Keel/policy-light.png"
              imageAlt="Trust-level policy engine — flat list, segmented control per row"
            />
          </StaggerContainer>
        </section>

        <Divider />

        {/* ━━━ VISUAL LANGUAGE (interstitial, unnumbered) ━━━ */}
        <section className="responsive-padding keel-visual-language" style={{ padding: '0 48px' }}>
          <StaggerContainer>
            <div style={{ maxWidth: '760px', marginBottom: '48px' }}>
              <motion.p variants={staggerChild} style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 500,
                color: ACCENT,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '24px',
              }}>
                Visual Language
              </motion.p>
              <motion.h3 variants={staggerChild} style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.75rem, 3.25vw, 2.5rem)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                color: 'var(--text-primary)',
                marginBottom: '24px',
              }}>
                The system-level decisions that don&rsquo;t fit in a card.
              </motion.h3>
              <motion.p variants={staggerChild} style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.0625rem',
                fontWeight: 300,
                lineHeight: 1.7,
                color: 'var(--text-secondary)',
              }}>
                Keel is a review tool. Every surface-level choice — type, color, spacing, motion — is answering the same question: does this help or hinder the reviewer? Four principles shaped the visual language end-to-end.
              </motion.p>
            </div>

            <motion.div
              variants={staggerChild}
              className="keel-visual-principles"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '24px',
              }}
            >
              {/* See full system link will render under the grid */}
              {[
                {
                  label: 'Typography',
                  heading: 'Mono for facts. Body for claims.',
                  body: 'Numbers, tokens, status labels, severities, IDs — anything machine-truth — gets a monospaced face. Narrative copy gets a humanist sans. The typographic split is a trust signal: the mono items are what Keel found, the body items are how I chose to frame it.',
                },
                {
                  label: 'Color',
                  heading: 'Monochrome page. One accent. One severity scale.',
                  body: 'The page is grayscale because it is a log. Dark blue marks moments of decision — the accent appears on accepted, pending, ship, and approve. Red/orange/yellow belong to drift severity alone. No color gets spent on decoration because color is a finite resource here, not a palette.',
                },
                {
                  label: 'Density',
                  heading: 'Review is dense. Decision is sparse.',
                  body: 'The dashboard and parity audit show as much as fits — the user is scanning for outliers. The Improver proposal and policy config are spacious — the user is making a call. Density maps to cognitive load, not to aesthetic preference. A sparse review surface would be an anti-feature.',
                },
                {
                  label: 'Motion',
                  heading: 'Motion only where it maps to information.',
                  body: 'The scroll-scrubbed demo on this page compresses a minute of product interaction into twenty seconds — motion as time compression. The decision cards expand under user control — motion as agency. Nothing else on either page moves. Motion borrowed from decoration is motion that has to be forgiven later.',
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="keel-principle-card"
                  style={{
                    padding: '32px',
                    backgroundColor: 'var(--bg-card)',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                  }}
                >
                  <p style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    fontWeight: 500,
                    color: ACCENT,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '16px',
                  }}>
                    {item.label}
                  </p>
                  <h4 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.3,
                    color: 'var(--text-primary)',
                    marginBottom: '12px',
                  }}>
                    {item.heading}
                  </h4>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '14.5px',
                    fontWeight: 400,
                    lineHeight: 1.65,
                    color: 'var(--text-secondary)',
                  }}>
                    {item.body}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* CTA — full design system page */}
            <motion.div variants={staggerChild} style={{ marginTop: '40px' }}>
              <Link
                href="/work/keel/system"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: ACCENT,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '12px 18px',
                  border: `1px solid ${ACCENT}`,
                  borderRadius: '8px',
                  transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(29, 78, 216, 0.10)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                See the complete component system
                <span style={{ fontSize: '14px' }}>→</span>
              </Link>
            </motion.div>
          </StaggerContainer>
        </section>

        <Divider />

        {/* ━━━ 04 — WHAT DIDN'T SHIP ━━━ */}
        <section id="section-cut-scope" className="responsive-padding" style={{ padding: '0 48px' }}>
          <StaggerContainer>
            <div style={{ maxWidth: '720px', marginBottom: '56px' }}>
              <motion.p variants={staggerChild} style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: 'var(--text-muted)',
                letterSpacing: '0.1em',
                marginBottom: '20px',
              }}>
                04
              </motion.p>
              <motion.h2 variants={staggerChild} style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)',
                fontWeight: 700,
                letterSpacing: '-0.035em',
                lineHeight: 1.1,
                color: 'var(--text-primary)',
                marginBottom: '32px',
              }}>
                What Didn&rsquo;t Ship
              </motion.h2>
              <motion.p variants={staggerChild} style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.0625rem',
                fontWeight: 300,
                lineHeight: 1.7,
                color: 'var(--text-secondary)',
              }}>
                Every case study lists what the designer built. The cuts are usually more revealing. Each of these was proposed in-scope, prototyped or fully specced, and cut for a reason worth stating out loud.
              </motion.p>
            </div>

            <motion.div variants={staggerChild}>
              <CutScopeTable />
            </motion.div>

            <motion.p variants={staggerChild} style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.0625rem',
              fontWeight: 300,
              lineHeight: 1.7,
              color: 'var(--text-secondary)',
              maxWidth: '680px',
              marginTop: '48px',
            }}>
              Keel shipped small because shipping small is what let the thesis land. Every deferred feature has a documented reason. Scope discipline is what the product is.
            </motion.p>
          </StaggerContainer>
        </section>

        <Divider />

        {/* ━━━ 05 — THE ARTIFACT ━━━ */}
        <section id="section-artifact" className="responsive-padding" style={{ padding: '0 48px' }}>
          <StaggerContainer>
            <div style={{ maxWidth: '720px', marginBottom: '56px' }}>
              <motion.p variants={staggerChild} style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: 'var(--text-muted)',
                letterSpacing: '0.1em',
                marginBottom: '20px',
              }}>
                05
              </motion.p>
              <motion.h2 variants={staggerChild} style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.25rem, 4.5vw, 3.5rem)',
                fontWeight: 700,
                letterSpacing: '-0.035em',
                lineHeight: 1.1,
                color: 'var(--text-primary)',
                marginBottom: '32px',
              }}>
                The Artifact
              </motion.h2>
              <motion.p variants={staggerChild} style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.0625rem',
                fontWeight: 300,
                lineHeight: 1.7,
                color: 'var(--text-secondary)',
              }}>
                Five subsystems, one AI-facing mode, one continuous loop from detection to resolution. Live at{' '}
                <a
                  href={DEMO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: ACCENT, textDecoration: 'underline', textUnderlineOffset: '3px' }}
                >
                  keel-demo-psi.vercel.app
                </a>.
              </motion.p>
            </div>
          </StaggerContainer>

          {/* Scroll-scrubbed demo loop */}
          <div className="keel-demo-loop-wrap" style={{ marginTop: '64px' }}>
            <DemoLoop />
          </div>

          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.0625rem',
            fontWeight: 300,
            lineHeight: 1.7,
            color: 'var(--text-secondary)',
            maxWidth: '680px',
            marginTop: '64px',
          }}>
            Detection, proposal, parity, policy, timeline. The entire thesis argued in six clicks. Every screenshot on this page supports this loop.
          </p>

          {/* Full artifact carousel */}
          <div className="keel-carousel-wrap" style={{ marginTop: '80px' }}>
            <ScreenCarousel
              accentColor={ACCENT}
              screens={[
                {
                  label: 'Parity — Passing',
                  description: '23 rules across 6 categories, no violations',
                  src: '/images/Keel/parity-pass-light.png',
                },
                {
                  label: 'Parity — Failing',
                  description: 'Five violations on an AI-authored PR',
                  src: '/images/Keel/parity-failing-5-light.png',
                },
                {
                  label: 'Trust-Level Policy',
                  description: 'Seven Suggest Only, three Draft PR, zero Auto-merge — conservative by design',
                  src: '/images/Keel/policy-light.png',
                },
                {
                  label: 'Supervision Timeline',
                  description: 'Every AI action logged, grouped by day, filterable',
                  src: '/images/Keel/timeline-light.png',
                },
              ]}
            />
          </div>

          {/* CTA — design system reference */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="keel-artifact-system-cta"
            style={{
              marginTop: '72px',
              padding: '32px 36px',
              background: 'linear-gradient(180deg, rgba(29, 78, 216, 0.08) 0%, rgba(29, 78, 216, 0.02) 100%)',
              border: `1px solid rgba(29, 78, 216, 0.35)`,
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
                color: ACCENT,
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
                Every surface above is built from a documented design system — tokens, components, light/dark parity. See it in full.
              </p>
            </div>
            <Link
              href="/work/keel/system"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#FFFFFF',
                background: ACCENT,
                padding: '14px 22px',
                borderRadius: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                flexShrink: 0,
                transition: 'transform 0.25s ease, background-color 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#1E40AF'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = ACCENT
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              Open design system
              <span style={{ fontSize: '14px' }}>→</span>
            </Link>
          </motion.div>

          {/* Demo disclosure block */}
          <div
            className="responsive-padding keel-demo-disclosure"
            style={{
              maxWidth: '680px',
              margin: '64px auto 0 auto',
              padding: '24px',
              border: `1px solid rgba(29, 78, 216, 0.4)`,
              borderRadius: '12px',
            }}
          >
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              fontWeight: 400,
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
            }}>
              Improver proposals in the public deployment serve from pre-recorded fixtures. The full pipeline — parity check, policy engine, supervision timeline, database writes — runs live. The AI generation step is captured rather than live-called to preserve API budget and ensure reliability for visitors.
            </p>
          </div>
        </section>

        <Divider />

        {/* ━━━ 06 — POINT OF VIEW (largest visual moment) ━━━ */}
        <section
          id="section-pov"
          className="responsive-padding pov-section"
          style={{ padding: '160px 48px' }}
        >
          <StaggerContainer>
            <motion.p variants={staggerChild} style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              fontWeight: 500,
              color: 'var(--text-muted)',
              letterSpacing: '0.1em',
              marginBottom: '20px',
            }}>
              06
            </motion.p>
            <motion.p variants={staggerChild} style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 500,
              color: ACCENT,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '48px',
            }}>
              Point of View
            </motion.p>
            <motion.p
              variants={staggerChild}
              className="pov-quote"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2.5rem',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                lineHeight: 1.2,
                color: 'var(--text-primary)',
                maxWidth: '860px',
              }}
            >
              AI-generated design system output is unreliable in ways that are invisible at review speed. The tooling industry is shipping generation faster instead of solving review. Review is the frontier. That&rsquo;s the gap Keel sits in.
            </motion.p>

            <motion.div variants={staggerChild} style={{
              marginTop: '64px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              maxWidth: '680px',
            }}>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.0625rem',
                fontWeight: 300,
                lineHeight: 1.7,
                color: 'var(--text-secondary)',
              }}>
                Spotify and GitHub solved this internally with dedicated teams. Keel doesn&rsquo;t claim to invent the category — it claims to make the solution legible for teams without Spotify&rsquo;s headcount. Contribution beats invention.
              </p>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.0625rem',
                fontWeight: 300,
                lineHeight: 1.7,
                color: 'var(--text-secondary)',
              }}>
                Every design decision I made on Keel was a bet on review being more important than generation. The boring tool beats the clever one when the output is a gate on what ships. The whitelist doesn&rsquo;t have bad days.
              </p>
            </motion.div>
          </StaggerContainer>
        </section>

        <Divider />

        {/* ━━━ BY THE NUMBERS (interstitial, unnumbered) ━━━ */}
        <section className="responsive-padding keel-metrics-section" style={{ padding: '0 48px' }}>
          <StaggerContainer>
            <motion.p variants={staggerChild} style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 500,
              color: ACCENT,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '32px',
            }}>
              By the Numbers
            </motion.p>

            <motion.div
              variants={staggerChild}
              className="keel-metrics-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '16px',
              }}
            >
              {[
                { metric: '5', label: 'Subsystems shipped' },
                { metric: '6', label: 'Clicks, detection to resolution' },
                { metric: '83ms', label: 'Warm compile, post-Sandpack' },
                { metric: '23', label: 'Parity rules across 6 categories' },
                { metric: '100', label: 'shadcn/ui validation score' },
              ].map((item, idx) => (
                <div key={idx} style={{
                  padding: '32px 24px',
                  backgroundColor: 'var(--bg-card)',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  textAlign: 'center',
                }}>
                  <p style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2rem, 3vw, 2.5rem)',
                    fontWeight: 700,
                    letterSpacing: '-0.03em',
                    color: ACCENT,
                    marginBottom: '8px',
                    lineHeight: 1.1,
                  }}>
                    <AnimatedMetric value={item.metric} />
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6875rem',
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    lineHeight: 1.4,
                  }}>
                    {item.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </StaggerContainer>
        </section>

        <Divider />

        {/* ━━━ 07 — REFLECTION ━━━ */}
        <section id="section-reflection" className="responsive-padding" style={{ padding: '0 48px' }}>
          <StaggerContainer>
            <div style={{ maxWidth: '720px', marginBottom: '48px' }}>
              <motion.p variants={staggerChild} style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: 'var(--text-muted)',
                letterSpacing: '0.1em',
                marginBottom: '20px',
              }}>
                07
              </motion.p>
              <motion.h2 variants={staggerChild} style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                fontWeight: 700,
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                color: 'var(--text-primary)',
              }}>
                Reflection
              </motion.h2>
            </div>

            <motion.div variants={staggerChild} style={{ maxWidth: '720px' }}>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 500,
                color: ACCENT,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '20px',
              }}>
                The Sandpack Pivot
              </p>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.0625rem',
                fontWeight: 300,
                lineHeight: 1.7,
                color: 'var(--text-secondary)',
              }}>
                The original plan for Improver&rsquo;s live component preview was Sandpack — CodeSandbox&rsquo;s in-browser bundler. Worked locally. In production, Sandpack&rsquo;s bundler endpoint was unreachable from my ISP — confirmed via incognito, confirmed via phone on a different network. ISP-level block, no client-side workaround. I rebuilt the preview pipeline from scratch: server-side Tailwind + PostCSS + Babel compiling TSX to static HTML + CSS, rendered in a plain iframe. 64–83ms warm compile. Zero external runtime dependencies. The lesson: external dependency risk is a design decision, not an engineering decision. Sandpack&rsquo;s one failure mode had no local workaround. The slower-to-build path eliminated an entire class of production fragility.
              </p>
            </motion.div>

            <motion.div variants={staggerChild} style={{ maxWidth: '720px', marginTop: '64px' }}>
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 500,
                color: ACCENT,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '20px',
              }}>
                What I&rsquo;d Do Differently
              </p>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.0625rem',
                fontWeight: 300,
                lineHeight: 1.7,
                color: 'var(--text-secondary)',
              }}>
                Meridian — the synthetic design system Keel audits in the demo — has nine planted drift issues. Anchoring the demo to a system I could fully control was the right call for a solo build. But the stronger version would have run against three real public design systems from day one, with Meridian reserved for planted edge cases. Keel already ingests shadcn/ui at 100/100 as a second real-world validation. I&rsquo;d start with that pattern, not retrofit it.
              </p>
            </motion.div>
          </StaggerContainer>
        </section>

        {/* ━━━ NEXT PROJECT ━━━ */}
        <section className="responsive-padding keel-next-project" style={{
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
                  fontSize: '0.6875rem',
                  fontWeight: 500,
                  color: ACCENT,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
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

      <style jsx global>{`
        @media (max-width: 768px) {
          .keel-hero-section {
            padding: 0 20px 48px 20px !important;
          }
          .keel-hero-image-section {
            padding: 0 20px 64px 20px !important;
          }
          .keel-plain-english {
            padding: 0 20px 64px 20px !important;
          }
          .keel-divider {
            margin: 64px 0 !important;
          }
          .keel-next-project {
            padding: 72px 20px 0 20px !important;
            margin-top: 64px !important;
          }
          .design-question-section {
            padding: 72px 20px !important;
          }
          .design-question-title {
            font-size: 1.75rem !important;
            line-height: 1.18 !important;
          }
          .pov-section {
            padding: 96px 20px !important;
          }
          .pov-quote {
            font-size: 1.625rem !important;
            line-height: 1.22 !important;
          }
          .keel-artifact-intro {
            margin-bottom: 40px !important;
          }
          .keel-demo-loop-wrap {
            margin-top: 40px !important;
          }
          .keel-carousel-wrap {
            margin-top: 56px !important;
          }
          .keel-demo-disclosure {
            margin-top: 48px !important;
          }
          .keel-demo-mobile-stack {
            gap: 48px !important;
          }
          .keel-metrics-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
          .keel-visual-principles {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .keel-principle-card {
            padding: 24px !important;
          }
          .keel-hero-tldr {
            font-size: 0.6875rem !important;
          }
          .keel-hero-for {
            font-size: 0.6875rem !important;
          }
        }
        @media (min-width: 769px) and (max-width: 1023px) {
          .keel-metrics-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
      `}</style>
    </>
  )
}

/* ── Tech marquee ─────────────────────────────────── */

function TechMarquee() {
  const tools = [
    'Next.js',
    'TypeScript',
    'Tailwind',
    'Postgres',
    'pgvector',
    'Anthropic API',
    'Opus 4.7',
    'Sonnet 4.6',
    'Voyage Embeddings',
    'Railway',
    'Vercel',
  ]
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
            color: 'var(--text-secondary)',
            letterSpacing: '0.06em',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '48px',
          }}>
            {tool}
            <span style={{ color: ACCENT, opacity: 0.5, fontSize: '0.5rem' }}>◆</span>
          </span>
        ))}
      </motion.div>
    </div>
  )
}

/* ── Cut scope table ─────────────────────────────── */

const CUT_SCOPE_ROWS: { feature: string; reason: string }[] = [
  {
    feature: 'Fine-tuning the Improver model on the design system',
    reason:
      'Fine-tuned taste is implicit and unauditable. You can’t inspect what the model learned. Keel uses retrieval instead — Voyage embeddings, pgvector similarity — so the design system stays the single source of truth. A token change updates immediately. Fine-tuning creates a second source that can drift from the first, which is the exact problem Keel exists to solve.',
  },
  {
    feature: 'Figma write-back',
    reason:
      'Figma’s own MCP handles the write-back direction. Duplicating it would require translating clean JSX to Figma nodes, and that translation is lossy. Keel’s principle is clean code as output — writing lossy versions back to Figma undermines it. Deferred, not dropped.',
  },
  {
    feature: 'Pixel-diff rendering',
    reason:
      'Would become its own product. Rendering both states, computing visual diffs, resolving layout ambiguity — that’s a visualization product inside a governance product. Link-to-version delivers 90% of the insight for 10% of the engineering.',
  },
  {
    feature: 'Multi-user, teams, RBAC, SSO, billing',
    reason:
      'Not in the thesis. The thesis is review gap, not team coordination. v2 territory, and calling it v2 is not an apology.',
  },
  {
    feature: 'Storybook MCP integration',
    reason:
      'Sharpens nothing the current scope doesn’t already prove. The demo loop works without it. Deferred to v2.',
  },
  {
    feature: 'Assisted mode (AI authors new components with real-time parity)',
    reason:
      'Ships as a stub marked “coming soon.” Keeping it out of scope sharpens Improver’s argument. Two modes would dilute the “review is the frontier” thesis to “AI does lots of things.”',
  },
  {
    feature: '80/20 mode (AI drafts, human polishes)',
    reason:
      'Cut entirely, not even stubbed. Same reason as above — plus the mode itself is closest to what every other AI tool already ships. Including it would look like convergence, not a thesis.',
  },
]

function CutScopeTable() {
  return (
    <div className="cut-scope-table">
      {/* Header row */}
      <div
        className="cut-scope-header"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.6fr',
          gap: '48px',
          paddingBottom: '16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        }}
      >
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          fontWeight: 500,
          color: ACCENT,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}>
          Feature
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          fontWeight: 500,
          color: ACCENT,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}>
          Why it&rsquo;s not here
        </span>
      </div>

      {CUT_SCOPE_ROWS.map((row, i) => (
        <div
          key={i}
          className="cut-scope-row"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.6fr',
            gap: '48px',
            padding: '32px 0',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '15px',
            fontWeight: 500,
            lineHeight: 1.5,
            color: 'var(--text-primary)',
          }}>
            {row.feature}
          </p>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '15px',
            fontWeight: 300,
            lineHeight: 1.65,
            color: 'var(--text-secondary)',
          }}>
            {row.reason}
          </p>
        </div>
      ))}

      <style jsx>{`
        @media (max-width: 768px) {
          .cut-scope-header {
            display: none !important;
          }
          .cut-scope-row {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
            padding: 24px 0 !important;
          }
        }
      `}</style>
    </div>
  )
}
