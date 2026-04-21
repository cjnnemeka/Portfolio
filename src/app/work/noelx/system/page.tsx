'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const ACCENT = '#D4A843'              // NoelX portfolio gold
const PRODUCT_BG = '#F9F8F6'           // real dashboard canvas
const PRODUCT_SURFACE = '#FFFFFF'
const PRODUCT_BORDER = '#E8E5E0'
const PRODUCT_BORDER_LIGHT = '#F0EEED'
const PRODUCT_TEXT_PRIMARY = '#1A1A1A'
const PRODUCT_TEXT_SECONDARY = '#6B7280'
const PRODUCT_TEXT_TERTIARY = '#9CA3AF'
const SIDEBAR_BG = '#1C1A17'
const AMBER_50 = '#FFFBEB'
const AMBER_200 = '#FDE68A'
const AMBER_500 = '#F59E0B'
const AMBER_600 = '#D97706'
const AMBER_700 = '#B45309'

/* ── Animation ────────────────────────────────────── */

const staggerChild = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
}

function StaggerContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ── Section scaffolding (portfolio chrome, dark) ─── */

function SectionEyebrow({ label, number }: { label: string; number: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '20px' }}>
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.75rem',
        fontWeight: 500,
        color: 'var(--text-muted)',
        letterSpacing: '0.1em',
      }}>
        {number}
      </span>
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.6875rem',
        fontWeight: 500,
        color: ACCENT,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
      }}>
        {label}
      </span>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{
      fontFamily: 'var(--font-display)',
      fontSize: 'clamp(2rem, 4vw, 3rem)',
      fontWeight: 700,
      letterSpacing: '-0.035em',
      lineHeight: 1.1,
      color: 'var(--text-primary)',
      marginBottom: '24px',
    }}>
      {children}
    </h2>
  )
}

function SectionIntro({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: 'var(--font-body)',
      fontSize: '1.0625rem',
      fontWeight: 300,
      lineHeight: 1.65,
      color: 'var(--text-secondary)',
      maxWidth: '720px',
    }}>
      {children}
    </p>
  )
}

function SubsectionHeading({ label, name }: { label: string; name: string }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.6875rem',
        fontWeight: 500,
        color: ACCENT,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        marginBottom: '12px',
      }}>
        {label}
      </p>
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.5rem',
        fontWeight: 700,
        letterSpacing: '-0.02em',
        color: 'var(--text-primary)',
      }}>
        {name}
      </h3>
    </div>
  )
}

function ComponentCaption({ name, note }: { name: string; note: string }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.625rem',
        fontWeight: 500,
        color: 'var(--text-secondary)',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        marginBottom: '8px',
      }}>
        {name}
      </p>
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '13.5px',
        fontWeight: 400,
        lineHeight: 1.55,
        color: 'var(--text-secondary)',
      }}>
        {note}
      </p>
    </div>
  )
}

function ComponentCard({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      padding: '28px',
      backgroundColor: 'var(--bg-card)',
      borderRadius: '12px',
      border: '1px solid var(--border)',
    }}>
      {children}
    </div>
  )
}

function ComponentPreview({
  children,
  height = 'auto',
  variant = 'product',
}: {
  children: React.ReactNode
  height?: string
  variant?: 'product' | 'sidebar' | 'white'
}) {
  const bg =
    variant === 'product' ? PRODUCT_BG :
    variant === 'sidebar' ? SIDEBAR_BG :
    PRODUCT_SURFACE
  return (
    <div style={{
      backgroundColor: bg,
      borderRadius: '8px',
      border: '1px solid var(--border)',
      padding: '28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: height === 'auto' ? '100px' : height,
      flexWrap: 'wrap',
      gap: '12px',
    }}>
      {children}
    </div>
  )
}

/* ── Swatches ─────────────────────────────────────── */

type Swatch = { name: string; hex: string; role: string }

const SURFACE_SWATCHES: Swatch[] = [
  { name: 'bg-primary', hex: '#F9F8F6', role: 'Dashboard canvas' },
  { name: 'bg-surface', hex: '#FFFFFF', role: 'Cards, panels' },
  { name: 'bg-surface-subtle', hex: '#F5F4F2', role: 'Table headers, inputs' },
  { name: 'sidebar-bg', hex: '#1C1A17', role: 'Dark nav surface' },
]

const TEXT_SWATCHES: Swatch[] = [
  { name: 'text-primary', hex: '#1A1A1A', role: 'Headlines, values' },
  { name: 'text-secondary', hex: '#6B7280', role: 'Body, labels' },
  { name: 'text-tertiary', hex: '#9CA3AF', role: 'Timestamps, helper' },
]

const AMBER_SWATCHES: Swatch[] = [
  { name: 'amber-50', hex: '#FFFBEB', role: 'Selected-nav bg, icon chip' },
  { name: 'amber-200', hex: '#FDE68A', role: 'Toggle borders, sparkline fill' },
  { name: 'amber-500', hex: '#F59E0B', role: 'Primary brand, chart lines' },
  { name: 'amber-600', hex: '#D97706', role: 'Links, active states' },
  { name: 'amber-700', hex: '#B45309', role: 'Nav text, emphasis' },
]

const SEMANTIC_SWATCHES: Swatch[] = [
  { name: 'booked', hex: '#15803D', role: 'Booked, revenue up' },
  { name: 'interested', hex: '#B45309', role: 'Interested outcome' },
  { name: 'question', hex: '#1D4ED8', role: 'Informational, questions' },
  { name: 'needs-review', hex: '#C2410C', role: 'Attention required' },
  { name: 'opt-out', hex: '#B91C1C', role: 'Opt-out, errors' },
  { name: 'not-interested', hex: '#6B7280', role: 'Dormant, inactive' },
]

function SwatchCard({ swatch }: { swatch: Swatch }) {
  return (
    <div style={{
      borderRadius: '10px',
      border: '1px solid var(--border)',
      overflow: 'hidden',
      backgroundColor: 'var(--bg-card)',
    }}>
      <div style={{
        height: '80px',
        backgroundColor: swatch.hex,
        borderBottom: '1px solid var(--border)',
      }} />
      <div style={{ padding: '14px 16px' }}>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          fontWeight: 500,
          color: 'var(--text-primary)',
          marginBottom: '4px',
        }}>
          {swatch.name}
        </p>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          fontWeight: 400,
          color: 'var(--text-secondary)',
          marginBottom: '6px',
        }}>
          {swatch.hex.toUpperCase()}
        </p>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '12px',
          fontWeight: 300,
          color: 'var(--text-secondary)',
          lineHeight: 1.4,
        }}>
          {swatch.role}
        </p>
      </div>
    </div>
  )
}

/* ── Inline SVG icons (mirroring the lucide icons used in product) ── */

const IconCheck = ({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 12l3 3 5-6" />
  </svg>
)
const IconUserPlus = ({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" y1="8" x2="19" y2="14" />
    <line x1="22" y1="11" x2="16" y2="11" />
  </svg>
)
const IconHelp = ({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)
const IconX = ({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
)
const IconAlert = ({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)
const IconMinus = ({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
)
const IconTrendUp = ({ size = 12, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
)
const IconBell = ({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)
const IconSearch = ({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)
const IconHome = ({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)
const IconSend = ({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
)
const IconUsers = ({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)
const IconFile = ({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
)

/* ── Classification badge (6 variants) ────────────── */

type BadgeType = 'BOOKED' | 'INTERESTED' | 'QUESTION' | 'NEEDS_REVIEW' | 'OPT_OUT' | 'NOT_INTERESTED'

const badgeConfig: Record<BadgeType, { bg: string; text: string; label: string; Icon: React.FC<{ size?: number; color?: string }> }> = {
  BOOKED:         { bg: '#DCFCE7', text: '#15803D', label: 'Booked',         Icon: IconCheck },
  INTERESTED:     { bg: '#FEF3C7', text: '#B45309', label: 'Interested',     Icon: IconUserPlus },
  QUESTION:       { bg: '#DBEAFE', text: '#1D4ED8', label: 'Question',       Icon: IconHelp },
  NEEDS_REVIEW:   { bg: '#FFEDD5', text: '#C2410C', label: 'Needs Review',   Icon: IconAlert },
  OPT_OUT:        { bg: '#FEE2E2', text: '#B91C1C', label: 'Opt Out',        Icon: IconX },
  NOT_INTERESTED: { bg: '#F3F4F6', text: '#6B7280', label: 'Not Interested', Icon: IconMinus },
}

function ClassificationBadge({ type }: { type: BadgeType }) {
  const cfg = badgeConfig[type]
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      padding: '3px 9px 3px 7px',
      borderRadius: '100px',
      backgroundColor: cfg.bg,
      color: cfg.text,
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '11px',
      fontWeight: 500,
      letterSpacing: '0.01em',
      lineHeight: 1.3,
    }}>
      <cfg.Icon size={11} color={cfg.text} />
      {cfg.label}
    </span>
  )
}

/* ── Sparkline (reproduction of product component) ── */

function Sparkline({ data, color, width = 80, height = 32 }: { data: number[]; color: string; width?: number; height?: number }) {
  if (data.length < 2) return null
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const padding = 2
  const points = data.map((val, i) => ({
    x: padding + (i / (data.length - 1)) * (width - padding * 2),
    y: padding + (1 - (val - min) / range) * (height - padding * 2),
  }))
  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const area = `${line} L${points[points.length - 1].x},${height} L${points[0].x},${height} Z`
  const id = `spark-${color.replace('#', '')}-${data.join('-')}`
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.22} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ── Stat card (composed) ─────────────────────────── */

function StatCard() {
  return (
    <div style={{
      width: '100%',
      maxWidth: '260px',
      backgroundColor: PRODUCT_SURFACE,
      border: `1px solid ${PRODUCT_BORDER}`,
      borderRadius: '12px',
      padding: '20px 24px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: AMBER_50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: AMBER_600,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <span style={{ fontSize: '14px', color: PRODUCT_TEXT_SECONDARY }}>Revenue Recovered</span>
        </div>
        <Sparkline data={[4, 6, 5, 8, 10, 12, 15]} color={AMBER_500} width={72} height={28} />
      </div>
      <div style={{ marginTop: '14px', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span style={{
          fontSize: '28px',
          fontWeight: 600,
          color: PRODUCT_TEXT_PRIMARY,
          letterSpacing: '-0.02em',
          fontVariantNumeric: 'tabular-nums',
        }}>$15,300</span>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '2px',
          fontSize: '12px',
          fontWeight: 500,
          color: '#15803D',
        }}>
          <IconTrendUp size={12} color="#15803D" />
          +24%
        </span>
      </div>
    </div>
  )
}

/* ── Primary / secondary buttons ──────────────────── */

function PrimaryButton({ label = 'Run campaign' }: { label?: string }) {
  return (
    <button style={{
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '14px',
      fontWeight: 500,
      color: '#FFFFFF',
      background: AMBER_500,
      border: 'none',
      borderRadius: '8px',
      padding: '9px 16px',
      cursor: 'pointer',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    }}>
      {label}
    </button>
  )
}

function SecondaryButton({ label = 'View report' }: { label?: string }) {
  return (
    <button style={{
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '14px',
      fontWeight: 500,
      color: PRODUCT_TEXT_PRIMARY,
      background: PRODUCT_SURFACE,
      border: `1px solid ${PRODUCT_BORDER}`,
      borderRadius: '8px',
      padding: '9px 16px',
      cursor: 'pointer',
    }}>
      {label}
    </button>
  )
}

function GhostLink({ label = 'View all' }: { label?: string }) {
  return (
    <span style={{
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '13px',
      fontWeight: 500,
      color: AMBER_600,
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      cursor: 'pointer',
    }}>
      {label}
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </span>
  )
}

/* ── Time-range toggle ────────────────────────────── */

function TimeRangeToggle({ active = '6M' }: { active?: '6M' | '3M' | '30D' | '7D' }) {
  const options = ['6M', '3M', '30D', '7D'] as const
  return (
    <div style={{
      display: 'inline-flex',
      padding: '3px',
      borderRadius: '8px',
      border: `1px solid ${PRODUCT_BORDER}`,
      backgroundColor: PRODUCT_SURFACE,
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      {options.map((opt) => {
        const isActive = opt === active
        return (
          <span
            key={opt}
            style={{
              padding: '5px 12px',
              fontSize: '12px',
              fontWeight: 500,
              color: isActive ? AMBER_700 : PRODUCT_TEXT_TERTIARY,
              backgroundColor: isActive ? AMBER_50 : 'transparent',
              border: isActive ? `1px solid ${AMBER_200}` : '1px solid transparent',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            {opt}
          </span>
        )
      })}
    </div>
  )
}

/* ── Alert banner ─────────────────────────────────── */

function AlertBanner() {
  return (
    <div style={{
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      padding: '12px 18px',
      backgroundColor: AMBER_50,
      borderLeft: `4px solid ${AMBER_500}`,
      borderBottom: `1px solid ${AMBER_200}`,
      borderRadius: '4px',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: AMBER_500,
        }} />
        <span style={{ fontSize: '13px', fontWeight: 500, color: '#92400E' }}>
          1 campaign is waiting for your review
        </span>
      </div>
      <span style={{ fontSize: '13px', fontWeight: 500, color: AMBER_700, cursor: 'pointer' }}>
        Review →
      </span>
    </div>
  )
}

/* ── Activity feed item ───────────────────────────── */

function ActivityFeedItem() {
  return (
    <div style={{
      width: '100%',
      maxWidth: '520px',
      backgroundColor: PRODUCT_SURFACE,
      border: `1px solid ${PRODUCT_BORDER}`,
      borderRadius: '12px',
      padding: '16px 20px',
      fontFamily: 'Inter, system-ui, sans-serif',
      boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: '#FEF3C7',
          color: '#B45309',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: 600,
        }}>
          MG
        </div>
        <span style={{ fontSize: '14px', fontWeight: 600, color: PRODUCT_TEXT_PRIMARY }}>Maria G.</span>
        <ClassificationBadge type="INTERESTED" />
        <span style={{
          marginLeft: 'auto',
          fontSize: '11px',
          fontWeight: 500,
          color: PRODUCT_TEXT_TERTIARY,
          letterSpacing: '0.04em',
        }}>2 MIN AGO</span>
      </div>
      <div style={{
        fontSize: '13px',
        color: PRODUCT_TEXT_SECONDARY,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        paddingLeft: '44px',
      }}>
        <span style={{ fontSize: '11px', fontWeight: 500, color: PRODUCT_TEXT_TERTIARY, letterSpacing: '0.04em' }}>BOTOX</span>
        <span style={{ color: PRODUCT_TEXT_TERTIARY }}>·</span>
        <span style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          flex: 1,
          minWidth: 0,
        }}>&ldquo;Would love to come back in! What times do you have next week?&rdquo;</span>
      </div>
    </div>
  )
}

/* ── Campaign table row ───────────────────────────── */

function CampaignTableRow() {
  return (
    <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
    <div style={{
      width: '100%',
      minWidth: '560px',
      maxWidth: '640px',
      backgroundColor: PRODUCT_SURFACE,
      border: `1px solid ${PRODUCT_BORDER}`,
      borderRadius: '12px',
      overflow: 'hidden',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 70px 70px 70px 70px',
        gap: '16px',
        padding: '10px 20px',
        backgroundColor: '#F5F4F2',
        borderBottom: `1px solid ${PRODUCT_BORDER_LIGHT}`,
        fontSize: '11px',
        fontWeight: 600,
        color: PRODUCT_TEXT_TERTIARY,
        letterSpacing: '0.05em',
        textTransform: 'uppercase' as const,
      }}>
        <span>Campaign</span>
        <span style={{ textAlign: 'right' }}>Sent</span>
        <span style={{ textAlign: 'right' }}>Replied</span>
        <span style={{ textAlign: 'right' }}>Booked</span>
        <span style={{ textAlign: 'right' }}>Rate</span>
      </div>
      {[
        { name: 'Recovery — Warm (90–180d)', type: 'Recovery Backlog', sent: 187, replied: 22, booked: 14, rate: '11.8%', active: true },
        { name: 'Recovery — Cool (181–365d)', type: 'Recovery Backlog', sent: 124, replied: 9, booked: 5, rate: '7.3%', active: true },
        { name: 'Retention — Post-Visit Nurture', type: 'Retention Nurture', sent: 43, replied: 8, booked: 3, rate: '18.6%', active: true },
      ].map((row, i, arr) => (
        <div key={row.name} style={{
          display: 'grid',
          gridTemplateColumns: '2fr 70px 70px 70px 70px',
          gap: '16px',
          padding: '14px 20px',
          alignItems: 'center',
          borderBottom: i === arr.length - 1 ? 'none' : `1px solid ${PRODUCT_BORDER_LIGHT}`,
          fontSize: '13px',
          fontVariantNumeric: 'tabular-nums',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 500, color: PRODUCT_TEXT_PRIMARY }}>{row.name}</span>
              {row.active && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '1px 8px 1px 6px',
                  borderRadius: '100px',
                  backgroundColor: '#DCFCE7',
                  color: '#15803D',
                  fontSize: '10.5px',
                  fontWeight: 500,
                }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#22C55E' }} />
                  Active
                </span>
              )}
            </div>
            <p style={{ fontSize: '11px', fontWeight: 500, color: PRODUCT_TEXT_TERTIARY, letterSpacing: '0.04em', marginTop: '4px' }}>{row.type.toUpperCase()}</p>
          </div>
          <span style={{ textAlign: 'right', color: PRODUCT_TEXT_PRIMARY, fontWeight: 500 }}>{row.sent}</span>
          <span style={{ textAlign: 'right', color: PRODUCT_TEXT_PRIMARY, fontWeight: 500 }}>{row.replied}</span>
          <span style={{ textAlign: 'right', color: '#15803D', fontWeight: 600 }}>{row.booked}</span>
          <span style={{ textAlign: 'right', color: AMBER_700, fontWeight: 600 }}>{row.rate}</span>
        </div>
      ))}
    </div>
    </div>
  )
}

/* ── Sidebar nav (dark surface) ───────────────────── */

function SidebarNav() {
  const items = [
    { label: 'Home', Icon: IconHome, active: true },
    { label: 'Campaigns', Icon: IconSend, active: false },
    { label: 'Patients', Icon: IconUsers, active: false },
    { label: 'Reports', Icon: IconFile, active: false },
  ]
  return (
    <div style={{
      width: '220px',
      padding: '14px 10px',
      backgroundColor: SIDEBAR_BG,
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '10px',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 8px 14px 8px', marginBottom: '6px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '8px',
          backgroundColor: '#2A2722',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '11px',
          fontWeight: 600,
          color: '#FFFFFF',
          letterSpacing: '0.02em',
        }}>nX</div>
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF', letterSpacing: '-0.01em' }}>NoelX</span>
      </div>
      {items.map((it) => (
        <div key={it.label} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '7px 10px',
          borderRadius: '6px',
          marginBottom: '2px',
          backgroundColor: it.active ? '#FFF8EB' : 'transparent',
          color: it.active ? AMBER_500 : '#8E8E93',
          fontSize: '13px',
          fontWeight: it.active ? 500 : 400,
          borderLeft: it.active ? `3px solid ${AMBER_500}` : '3px solid transparent',
        }}>
          <it.Icon size={16} color={it.active ? AMBER_500 : '#8E8E93'} />
          {it.label}
        </div>
      ))}
    </div>
  )
}

/* ── Top bar ──────────────────────────────────────── */

function TopBar() {
  return (
    <div style={{
      width: '100%',
      maxWidth: '640px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 24px',
      backgroundColor: PRODUCT_SURFACE,
      borderBottom: `1px solid ${PRODUCT_BORDER}`,
      borderRadius: '10px 10px 0 0',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <div>
        <p style={{ fontSize: '18px', fontWeight: 600, color: PRODUCT_TEXT_PRIMARY, letterSpacing: '-0.015em', lineHeight: 1.2 }}>Dashboard</p>
        <p style={{ fontSize: '12px', color: PRODUCT_TEXT_TERTIARY, marginTop: '2px' }}>Glow Aesthetics · February 2026</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div className="noelx-ds-topbar-search" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '7px 12px',
          backgroundColor: '#F5F4F2',
          borderRadius: '8px',
          minWidth: '200px',
        }}>
          <IconSearch size={14} color={PRODUCT_TEXT_TERTIARY} />
          <span style={{ fontSize: '12.5px', color: PRODUCT_TEXT_TERTIARY }}>Search patients, campaigns…</span>
        </div>
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconBell size={18} color={PRODUCT_TEXT_SECONDARY} />
          <span style={{
            position: 'absolute',
            top: '-1px',
            right: '-1px',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: AMBER_500,
          }} />
        </div>
        <div style={{
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          backgroundColor: AMBER_500,
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '11px',
          fontWeight: 600,
        }}>GA</div>
      </div>
    </div>
  )
}

/* ── Specimen helpers ─────────────────────────────── */

function TypeSpecimen({ label, size, weight, sample }: { label: string; size: string; weight: number; sample: string }) {
  return (
    <div style={{
      padding: '24px 0',
      borderBottom: '1px solid var(--border)',
      display: 'grid',
      gridTemplateColumns: '180px 1fr',
      gap: '24px',
      alignItems: 'baseline',
    }}>
      <div>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          fontWeight: 500,
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          marginBottom: '4px',
        }}>
          {label}
        </p>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--text-muted)',
        }}>
          {size} · {weight}
        </p>
      </div>
      <p style={{
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: size,
        fontWeight: weight,
        color: 'var(--text-primary)',
        lineHeight: 1.25,
        letterSpacing: parseFloat(size) >= 24 ? '-0.02em' : '0',
      }}>
        {sample}
      </p>
    </div>
  )
}

function SpacingRow({ value }: { value: number }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '80px 1fr',
      gap: '20px',
      alignItems: 'center',
      padding: '10px 0',
    }}>
      <span style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '12px',
        fontWeight: 500,
        color: 'var(--text-primary)',
      }}>
        {value}px
      </span>
      <div style={{
        height: '10px',
        width: `${value * 3}px`,
        background: ACCENT,
        borderRadius: '2px',
      }} />
    </div>
  )
}

function RadiusTile({ name, value }: { name: string; value: number | string }) {
  const displayValue = typeof value === 'string' ? value : `${value}px`
  const r = typeof value === 'string' ? 36 : value
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: '72px',
        height: '72px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-hover)',
        borderRadius: `${r}px`,
        margin: '0 auto 12px auto',
      }} />
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        fontWeight: 500,
        color: 'var(--text-primary)',
      }}>
        {name}
      </p>
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '10.5px',
        color: 'var(--text-secondary)',
      }}>
        {displayValue}
      </p>
    </div>
  )
}

function ShadowTile({ name, shadow, spec }: { name: string; shadow: string; spec: string }) {
  return (
    <div style={{ textAlign: 'left' }}>
      <div style={{
        height: '92px',
        background: PRODUCT_SURFACE,
        border: `1px solid ${PRODUCT_BORDER}`,
        borderRadius: '12px',
        boxShadow: shadow,
        marginBottom: '14px',
      }} />
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        fontWeight: 500,
        color: 'var(--text-primary)',
        marginBottom: '4px',
      }}>
        {name}
      </p>
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '10.5px',
        color: 'var(--text-secondary)',
        lineHeight: 1.4,
      }}>
        {spec}
      </p>
    </div>
  )
}

/* ── Page ─────────────────────────────────────────── */

export default function NoelXDesignSystem() {
  return (
    <>
      <Header />

      <main className="noelx-ds-main" style={{ paddingTop: '160px' }}>

        {/* ━━━ HERO ━━━ */}
        <section className="responsive-padding noelx-ds-hero" style={{ padding: '0 48px 96px 48px' }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Link href="/work/noelx" style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              color: 'var(--text-secondary)',
              letterSpacing: '0.08em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '56px',
              transition: 'color 0.3s ease',
            }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              ← Back to NoelX case study
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          >
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              fontWeight: 500,
              color: ACCENT,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '16px',
              display: 'block',
            }}>
              Design System
            </span>
          </motion.div>

          <div style={{ overflow: 'hidden' }}>
            <motion.h1
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="noelx-ds-title"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.75rem, 6vw, 5rem)',
                fontWeight: 700,
                letterSpacing: '-0.04em',
                lineHeight: 1.05,
                color: 'var(--text-primary)',
              }}
            >
              The NoelX design system
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.1875rem',
              fontWeight: 300,
              color: 'var(--text-secondary)',
              marginTop: '24px',
              maxWidth: '720px',
              lineHeight: 1.55,
            }}
          >
            NoelX sells serious infrastructure at a premium price. The dashboard is the client&rsquo;s window into their system — it has to look like Stripe Dashboard meets Linear, tuned for a wellness audience. Warm neutrals, an amber brand, Inter everywhere. This page is the source of truth for every surface that ships.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
            className="responsive-grid-4 noelx-ds-meta"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '28px',
              paddingTop: '36px',
              marginTop: '48px',
              borderTop: '1px solid var(--border)',
            }}
          >
            {[
              { label: 'Foundations', value: 'Color · Type · Space · Radii · Shadow' },
              { label: 'Components', value: '14 documented · 30+ shipped across dashboard & ops' },
              { label: 'Surfaces', value: 'Light dashboard + dark sidebar' },
              { label: 'Typography', value: 'Inter · tabular nums · no mono' },
            ].map((m) => (
              <div key={m.label}>
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  marginBottom: '8px',
                }}>
                  {m.label}
                </p>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  fontWeight: 400,
                  color: 'var(--text-primary)',
                  lineHeight: 1.45,
                }}>
                  {m.value}
                </p>
              </div>
            ))}
          </motion.div>
        </section>

        <div className="noelx-ds-divider" style={{ height: '1px', background: 'var(--border)', margin: '0 48px' }} />

        {/* ━━━ 01 FOUNDATIONS ━━━ */}
        <section className="responsive-padding noelx-ds-section" style={{ padding: '96px 48px' }}>
          <StaggerContainer>
            <motion.div variants={staggerChild}><SectionEyebrow number="01" label="Foundations" /></motion.div>
            <motion.div variants={staggerChild}>
              <SectionTitle>Warm neutrals, one amber, six semantic roles.</SectionTitle>
            </motion.div>
            <motion.div variants={staggerChild}>
              <SectionIntro>
                The palette is deliberately narrow. A warm off-white canvas signals wellness (not fintech). Amber is the single brand color — it only shows on active, selected, and decision states. Six semantic colors map to six classification outcomes — nothing else in the product earns them.
              </SectionIntro>
            </motion.div>

            {/* COLOR */}
            <div style={{ marginTop: '72px' }}>
              <motion.div variants={staggerChild}>
                <SubsectionHeading label="Color" name="Surfaces, text, brand, semantic" />
              </motion.div>

              <motion.div variants={staggerChild}>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14.5px',
                  fontWeight: 300,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  marginBottom: '32px',
                  maxWidth: '680px',
                }}>
                  Four surfaces — a light canvas for data, a dark sidebar for navigation. Three text weights. Five amber stops. Six semantic colors mapped to the six classification outcomes of every patient message (Booked, Interested, Question, Needs Review, Opt Out, Not Interested).
                </p>
              </motion.div>

              {/* Surfaces */}
              <motion.div variants={staggerChild} style={{ marginBottom: '32px' }}>
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10.5px',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  marginBottom: '16px',
                }}>Surfaces</p>
                <div className="noelx-ds-swatch-grid" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '16px',
                }}>
                  {SURFACE_SWATCHES.map((s) => <SwatchCard key={s.name} swatch={s} />)}
                </div>
              </motion.div>

              {/* Text */}
              <motion.div variants={staggerChild} style={{ marginBottom: '32px' }}>
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10.5px',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  marginBottom: '16px',
                }}>Text hierarchy</p>
                <div className="noelx-ds-swatch-grid-3" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '16px',
                }}>
                  {TEXT_SWATCHES.map((s) => <SwatchCard key={s.name} swatch={s} />)}
                </div>
              </motion.div>

              {/* Amber + semantic */}
              <motion.div variants={staggerChild} style={{ marginBottom: '32px' }}>
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10.5px',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  marginBottom: '16px',
                }}>Amber brand scale</p>
                <div className="noelx-ds-swatch-grid-5" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: '16px',
                }}>
                  {AMBER_SWATCHES.map((s) => <SwatchCard key={s.name} swatch={s} />)}
                </div>
              </motion.div>

              <motion.div variants={staggerChild}>
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10.5px',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  marginBottom: '16px',
                }}>Semantic (classification)</p>
                <div className="noelx-ds-swatch-grid-6" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(6, 1fr)',
                  gap: '16px',
                }}>
                  {SEMANTIC_SWATCHES.map((s) => <SwatchCard key={s.name} swatch={s} />)}
                </div>
              </motion.div>
            </div>

            {/* TYPOGRAPHY */}
            <div style={{ marginTop: '88px' }}>
              <motion.div variants={staggerChild}>
                <SubsectionHeading label="Typography" name="Inter only. Tabular nums for data. No mono anywhere." />
              </motion.div>
              <motion.div variants={staggerChild}>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14.5px',
                  fontWeight: 300,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  marginBottom: '16px',
                  maxWidth: '680px',
                }}>
                  One family across every surface. Numbers switch to tabular figures so dollars and counts line up cleanly in stat cards and tables. The decision to drop mono — normally default in dashboards — keeps the interface feeling like serious consumer-facing software rather than developer tooling.
                </p>
              </motion.div>

              <motion.div variants={staggerChild}>
                <TypeSpecimen label="display-lg" size="32px" weight={700} sample="$63,847" />
                <TypeSpecimen label="display-md" size="28px" weight={600} sample="34 patients reactivated" />
                <TypeSpecimen label="heading-lg" size="20px" weight={600} sample="Dashboard" />
                <TypeSpecimen label="heading-md" size="16px" weight={600} sample="Recent activity" />
                <TypeSpecimen label="body" size="14px" weight={400} sample="Maria G. — Botox — Would love to come back in!" />
                <TypeSpecimen label="micro" size="11px" weight={600} sample="THIS WEEK · BOOKED · NEEDS REVIEW" />
              </motion.div>
            </div>

            {/* SPACING */}
            <div style={{ marginTop: '88px' }}>
              <motion.div variants={staggerChild}>
                <SubsectionHeading label="Spacing" name="4-based scale. Ten stops." />
              </motion.div>
              <motion.div variants={staggerChild}>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14.5px',
                  fontWeight: 300,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  marginBottom: '16px',
                  maxWidth: '680px',
                }}>
                  Card content padding is 20px/24px. Rows in tables and feeds sit at 14px vertical. Between major sections: 40px. Everything else snaps to one of the values below.
                </p>
              </motion.div>
              <motion.div variants={staggerChild} style={{ maxWidth: '520px' }}>
                {[4, 8, 12, 16, 20, 24, 28, 32, 40, 48].map((v) => <SpacingRow key={v} value={v} />)}
              </motion.div>
            </div>

            {/* RADII */}
            <div style={{ marginTop: '88px' }}>
              <motion.div variants={staggerChild}>
                <SubsectionHeading label="Radii" name="Five sizes for five roles" />
              </motion.div>
              <motion.div variants={staggerChild}>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14.5px',
                  fontWeight: 300,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  marginBottom: '28px',
                  maxWidth: '680px',
                }}>
                  <strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>sm</strong> for toggle options and icon chips. <strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>md</strong> for buttons and inputs. <strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>lg</strong> for stat cards and panels. <strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>xl</strong> for hero-scale surfaces. <strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>full</strong> for badges and avatars.
                </p>
              </motion.div>
              <motion.div variants={staggerChild} className="noelx-ds-radii" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', maxWidth: '600px' }}>
                <RadiusTile name="sm" value={6} />
                <RadiusTile name="md" value={8} />
                <RadiusTile name="lg" value={12} />
                <RadiusTile name="xl" value={16} />
                <RadiusTile name="full" value="full" />
              </motion.div>
            </div>

            {/* SHADOWS */}
            <div style={{ marginTop: '88px' }}>
              <motion.div variants={staggerChild}>
                <SubsectionHeading label="Shadow" name="Soft elevation, always paired with a border" />
              </motion.div>
              <motion.div variants={staggerChild}>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14.5px',
                  fontWeight: 300,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  marginBottom: '32px',
                  maxWidth: '680px',
                }}>
                  Shadows alone never carry a card — the border provides structure, the shadow provides the subtle lift. Three levels map to three elevation tiers: default cards, dropdowns, modals.
                </p>
              </motion.div>
              <motion.div variants={staggerChild} className="noelx-ds-shadows" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                <ShadowTile name="shadow-sm" shadow="0 1px 2px rgba(0,0,0,0.04)" spec="Default cards" />
                <ShadowTile name="shadow-md" shadow="0 2px 8px rgba(0,0,0,0.06)" spec="Elevated cards, dropdowns" />
                <ShadowTile name="shadow-lg" shadow="0 4px 16px rgba(0,0,0,0.08)" spec="Modals, popovers" />
              </motion.div>
            </div>
          </StaggerContainer>
        </section>

        <div className="noelx-ds-divider" style={{ height: '1px', background: 'var(--border)', margin: '0 48px' }} />

        {/* ━━━ 02 COMPONENTS ━━━ */}
        <section className="responsive-padding noelx-ds-section" style={{ padding: '96px 48px' }}>
          <StaggerContainer>
            <motion.div variants={staggerChild}><SectionEyebrow number="02" label="Components" /></motion.div>
            <motion.div variants={staggerChild}>
              <SectionTitle>14 components across four jobs: navigate, decide, scan, act.</SectionTitle>
            </motion.div>
            <motion.div variants={staggerChild}>
              <SectionIntro>
                Every component was designed for a specific moment in the med-spa owner&rsquo;s workflow. Classification badges map one-to-one to outcomes. Stat cards answer &ldquo;how much&rdquo; at a glance. Activity feed items show &ldquo;what just happened&rdquo;. The table shows &ldquo;which campaigns are working&rdquo;.
              </SectionIntro>
            </motion.div>

            {/* ACTIONS */}
            <div style={{ marginTop: '72px' }}>
              <motion.div variants={staggerChild}>
                <SubsectionHeading label="Actions" name="Buttons, toggles, action links" />
              </motion.div>

              <motion.div variants={staggerChild} className="noelx-ds-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                <ComponentCard>
                  <ComponentCaption name="Primary button" note="Amber-500 fill, white text, 8px radius. Used for the one primary CTA per view. Never more than one per section." />
                  <ComponentPreview>
                    <PrimaryButton />
                  </ComponentPreview>
                </ComponentCard>

                <ComponentCard>
                  <ComponentCaption name="Secondary button" note="White fill with 1px border. Paired with primary for two-action decisions, or used standalone when the action isn't destructive." />
                  <ComponentPreview>
                    <SecondaryButton />
                  </ComponentPreview>
                </ComponentCard>

                <ComponentCard>
                  <ComponentCaption name="Time-range toggle" note="Four fixed options: 6M / 3M / 30D / 7D. Always in descending range order. Active state uses amber-50 bg with amber-200 border — the soft, warm amber-tint pattern used throughout." />
                  <ComponentPreview>
                    <TimeRangeToggle active="6M" />
                  </ComponentPreview>
                </ComponentCard>

                <ComponentCard>
                  <ComponentCaption name="Action link" note="Amber-600 text, small chevron, no underline. Used inside card headers (&ldquo;View all →&rdquo;) and inline actions. Never for primary actions." />
                  <ComponentPreview>
                    <GhostLink />
                  </ComponentPreview>
                </ComponentCard>
              </motion.div>
            </div>

            {/* STATUS & DATA */}
            <div style={{ marginTop: '56px' }}>
              <motion.div variants={staggerChild}>
                <SubsectionHeading label="Status & data display" name="Classification badges, stat cards, sparklines" />
              </motion.div>

              <motion.div variants={staggerChild}>
                <ComponentCard>
                  <ComponentCaption
                    name="Classification badge — six variants"
                    note="Every inbound patient message resolves into one of six classifications. Each owns its own hue + icon + label. The pair is immutable across the product — nothing else in the system earns these colors."
                  />
                  <ComponentPreview>
                    <ClassificationBadge type="BOOKED" />
                    <ClassificationBadge type="INTERESTED" />
                    <ClassificationBadge type="QUESTION" />
                    <ClassificationBadge type="NEEDS_REVIEW" />
                    <ClassificationBadge type="OPT_OUT" />
                    <ClassificationBadge type="NOT_INTERESTED" />
                  </ComponentPreview>
                </ComponentCard>
              </motion.div>

              <motion.div variants={staggerChild} className="noelx-ds-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginTop: '20px' }}>
                <ComponentCard>
                  <ComponentCaption name="Stat card" note="Icon chip in amber-50 + label top-left, sparkline top-right. Display-md value + change indicator below. The dashboard's workhorse — four above the revenue chart." />
                  <ComponentPreview height="160px">
                    <StatCard />
                  </ComponentPreview>
                </ComponentCard>

                <ComponentCard>
                  <ComponentCaption name="Sparkline" note="Inline SVG, 1.5px stroke, gradient-filled area (22% → 0% opacity). Three common hues: amber for revenue, green for trends up, blue for response rate." />
                  <ComponentPreview height="160px">
                    <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
                      <div>
                        <Sparkline data={[4, 6, 5, 8, 10, 12, 15]} color={AMBER_500} width={100} height={36} />
                        <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '11px', color: PRODUCT_TEXT_TERTIARY, marginTop: '6px', letterSpacing: '0.04em' }}>REVENUE</p>
                      </div>
                      <div>
                        <Sparkline data={[6, 5, 7, 9, 8, 11, 13]} color="#22C55E" width={100} height={36} />
                        <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '11px', color: PRODUCT_TEXT_TERTIARY, marginTop: '6px', letterSpacing: '0.04em' }}>TREND</p>
                      </div>
                      <div>
                        <Sparkline data={[3, 4, 3, 5, 6, 5, 8]} color="#3B82F6" width={100} height={36} />
                        <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '11px', color: PRODUCT_TEXT_TERTIARY, marginTop: '6px', letterSpacing: '0.04em' }}>RESPONSE</p>
                      </div>
                    </div>
                  </ComponentPreview>
                </ComponentCard>
              </motion.div>
            </div>

            {/* TABLES & FEEDS */}
            <div style={{ marginTop: '56px' }}>
              <motion.div variants={staggerChild}>
                <SubsectionHeading label="Tables & feeds" name="How data scans — row by row" />
              </motion.div>

              <motion.div variants={staggerChild}>
                <ComponentCard>
                  <ComponentCaption name="Activity feed item" note="Initials-chip avatar colored by classification outcome. Name + badge + timestamp in one row. Treatment eyebrow + truncated reply preview below. Hover-only bg — never a selected state." />
                  <ComponentPreview height="140px">
                    <ActivityFeedItem />
                  </ComponentPreview>
                </ComponentCard>
              </motion.div>

              <motion.div variants={staggerChild} style={{ marginTop: '20px' }}>
                <ComponentCard>
                  <ComponentCaption name="Campaign table row" note="Subtle-bg header. Campaign name + type + active pill on the left, four numeric columns right-aligned with tabular nums. Booked count in green; rate in amber — the two numbers that matter." />
                  <ComponentPreview height="260px">
                    <CampaignTableRow />
                  </ComponentPreview>
                </ComponentCard>
              </motion.div>
            </div>

            {/* NAVIGATION */}
            <div style={{ marginTop: '56px' }}>
              <motion.div variants={staggerChild}>
                <SubsectionHeading label="Navigation" name="Dark sidebar, light top bar" />
              </motion.div>

              <motion.div variants={staggerChild} className="noelx-ds-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '20px' }}>
                <ComponentCard>
                  <ComponentCaption name="Sidebar — dark" note="220px fixed width. Active state: amber-50 bg, amber-500 text + icon + 3px left border. Inactive: gray-400 text on transparent. The only dark surface in the product — a deliberate anchor." />
                  <ComponentPreview variant="sidebar" height="280px">
                    <SidebarNav />
                  </ComponentPreview>
                </ComponentCard>

                <ComponentCard>
                  <ComponentCaption name="Top bar" note="Page title + context subtitle on the left. Search, notification bell (amber dot for unread), avatar on the right. 64px height, 1px bottom border — no shadow." />
                  <ComponentPreview height="180px">
                    <TopBar />
                  </ComponentPreview>
                </ComponentCard>
              </motion.div>
            </div>

            {/* CONTAINERS */}
            <div style={{ marginTop: '56px' }}>
              <motion.div variants={staggerChild}>
                <SubsectionHeading label="Containers" name="Inline banners, not modals" />
              </motion.div>

              <motion.div variants={staggerChild}>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14.5px',
                  fontWeight: 300,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  marginBottom: '24px',
                  maxWidth: '680px',
                }}>
                  Attention states live inline. A dashboard that interrupts its owner with modals loses trust quickly — every alert instead lands as a soft-amber banner at the top of the content area, with a single action to resolve it.
                </p>
              </motion.div>

              <motion.div variants={staggerChild}>
                <ComponentCard>
                  <ComponentCaption name="Alert banner" note="Amber-50 background, amber-500 left rail, amber-700 text. One sentence of context, one action. Dismissible, but the default is to show until the underlying condition resolves." />
                  <ComponentPreview height="100px">
                    <AlertBanner />
                  </ComponentPreview>
                </ComponentCard>
              </motion.div>
            </div>
          </StaggerContainer>
        </section>

        <div className="noelx-ds-divider" style={{ height: '1px', background: 'var(--border)', margin: '0 48px' }} />

        {/* ━━━ 03 DUAL SURFACE ━━━ */}
        <section className="responsive-padding noelx-ds-section" style={{ padding: '96px 48px' }}>
          <StaggerContainer>
            <motion.div variants={staggerChild}><SectionEyebrow number="03" label="Dual surface" /></motion.div>
            <motion.div variants={staggerChild}>
              <SectionTitle>Two surfaces, one system.</SectionTitle>
            </motion.div>
            <motion.div variants={staggerChild}>
              <SectionIntro>
                Light is the canvas — where data lives, where the eye rests, where the user spends hours each day. Dark is the anchor — the sidebar, always in the same place, always signalling &ldquo;you are inside NoelX&rdquo;. The same tokens drive both: amber still means brand, text-tertiary still means quiet, 6px radii still means chip. One system, two surfaces.
              </SectionIntro>
            </motion.div>

            <motion.div variants={staggerChild} className="noelx-ds-grid-2" style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.6fr',
              gap: '20px',
              marginTop: '56px',
            }}>
              <ComponentCard>
                <ComponentCaption name="Dark sidebar in context" note="Always fixed, always 220px. Amber-on-dark is the highest-contrast pairing in the system — reserved for the active route." />
                <ComponentPreview variant="sidebar" height="300px">
                  <SidebarNav />
                </ComponentPreview>
              </ComponentCard>

              <ComponentCard>
                <ComponentCaption name="Light dashboard in context" note="Warm off-white canvas, white cards, soft shadows, amber for decision moments only. The same token palette as the sidebar — lookup-swapped, not re-skinned." />
                <ComponentPreview height="300px">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', maxWidth: '560px' }}>
                    <AlertBanner />
                    <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
                      <StatCard />
                    </div>
                  </div>
                </ComponentPreview>
              </ComponentCard>
            </motion.div>
          </StaggerContainer>
        </section>

        {/* ━━━ BACK TO CASE STUDY ━━━ */}
        <section className="responsive-padding noelx-ds-back-section" style={{
          padding: '120px 48px 0 48px',
          borderTop: '1px solid var(--border)',
          marginTop: '96px',
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
                const title = e.currentTarget.querySelector('[data-back-title]') as HTMLElement
                if (title) title.style.color = ACCENT
              }}
              onMouseLeave={(e) => {
                const title = e.currentTarget.querySelector('[data-back-title]') as HTMLElement
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
                  Back to case study
                </p>
                <h2
                  data-back-title
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
                ←
              </span>
            </motion.div>
          </Link>
        </section>

      </main>
      <Footer />

      <style jsx global>{`
        @media (max-width: 1023px) {
          .noelx-ds-swatch-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .noelx-ds-swatch-grid-3 { grid-template-columns: repeat(3, 1fr) !important; }
          .noelx-ds-swatch-grid-5 { grid-template-columns: repeat(3, 1fr) !important; }
          .noelx-ds-swatch-grid-6 { grid-template-columns: repeat(3, 1fr) !important; }
          .noelx-ds-grid-2 { grid-template-columns: 1fr !important; }
          .noelx-ds-shadows { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          .noelx-ds-topbar-search { display: none !important; }
          .noelx-ds-hero { padding: 0 20px 64px 20px !important; }
          .noelx-ds-section { padding: 72px 20px !important; }
          .noelx-ds-back-section {
            padding: 80px 20px 0 20px !important;
            margin-top: 64px !important;
          }
          .noelx-ds-divider { margin: 0 20px !important; }
          .noelx-ds-title { font-size: 2.5rem !important; }
          .noelx-ds-meta {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 20px !important;
          }
          .noelx-ds-swatch-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .noelx-ds-swatch-grid-3 { grid-template-columns: repeat(2, 1fr) !important; }
          .noelx-ds-swatch-grid-5 { grid-template-columns: repeat(2, 1fr) !important; }
          .noelx-ds-swatch-grid-6 { grid-template-columns: repeat(2, 1fr) !important; }
          .noelx-ds-radii { grid-template-columns: repeat(3, 1fr) !important; }
        }
      `}</style>
    </>
  )
}
