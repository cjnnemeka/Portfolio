'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ImageLightbox from '@/components/ImageLightbox'

const ACCENT = '#1D4ED8'

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

/* ── Section scaffolding ──────────────────────────── */

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
  variant = 'light',
}: {
  children: React.ReactNode
  height?: string
  variant?: 'light' | 'dark'
}) {
  const isLight = variant === 'light'
  const lightVars = {
    '--text-primary': '#111111',
    '--text-secondary': '#6A6A6A',
    '--text-muted': '#9A9A9A',
    '--bg-secondary': '#F0F0F0',
    '--bg-card': '#FFFFFF',
    '--bg-card-hover': '#F3F3F3',
    '--border': 'rgba(0, 0, 0, 0.12)',
    '--border-hover': 'rgba(0, 0, 0, 0.22)',
    '--inline-code-bg': 'rgba(0, 0, 0, 0.06)',
  } as React.CSSProperties
  return (
    <div style={{
      backgroundColor: isLight ? '#FAFAFA' : '#050505',
      borderRadius: '8px',
      border: '1px solid var(--border)',
      padding: '28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: height === 'auto' ? '100px' : height,
      flexWrap: 'wrap',
      gap: '12px',
      ...(isLight ? lightVars : {}),
    }}>
      {children}
    </div>
  )
}

/* ── Color system tokens (for display only) ───────── */

type Swatch = { name: string; hex: string; role: string; textOn?: 'light' | 'dark' }

const PAGE_SWATCHES: Swatch[] = [
  { name: 'bg-primary', hex: '#050505', role: 'Page background', textOn: 'light' },
  { name: 'bg-secondary', hex: '#0C0C0C', role: 'Dense surface', textOn: 'light' },
  { name: 'bg-card', hex: '#111111', role: 'Card / row / module', textOn: 'light' },
  { name: 'bg-card-hover', hex: '#161616', role: 'Card hover', textOn: 'light' },
]

const TEXT_SWATCHES: Swatch[] = [
  { name: 'text-primary', hex: '#EDEDEC', role: 'Body claim, heading' },
  { name: 'text-secondary', hex: '#8A8A8A', role: 'Secondary claim, label' },
  { name: 'text-muted', hex: '#4A4A4A', role: 'Eyebrow, counter, decoration' },
]

const ACCENT_SWATCHES: Swatch[] = [
  { name: 'accent / decision', hex: '#1D4ED8', role: 'Decision moments' },
  { name: 'accent / subtle', hex: 'rgba(29, 78, 216, 0.10)', role: 'Accent surface, tag bg' },
]

const SEVERITY_SWATCHES: Swatch[] = [
  { name: 'severity / high', hex: '#DC2626', role: 'High-severity drift' },
  { name: 'severity / medium', hex: '#EA580C', role: 'Medium-severity drift' },
  { name: 'severity / low', hex: '#A8A29E', role: 'Low-severity drift' },
]

function SwatchCard({ swatch }: { swatch: Swatch }) {
  const isRgba = swatch.hex.startsWith('rgba')
  return (
    <div style={{
      borderRadius: '10px',
      border: '1px solid var(--border)',
      overflow: 'hidden',
      backgroundColor: 'var(--bg-card)',
    }}>
      <div style={{
        height: '88px',
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
          {isRgba ? swatch.hex : swatch.hex.toUpperCase()}
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

/* ── Components (recreated in HTML for accuracy) ──── */

function PrimaryButton({ label = 'Run audit' }: { label?: string }) {
  return (
    <button style={{
      fontFamily: 'var(--font-body)',
      fontSize: '13px',
      fontWeight: 500,
      color: '#EDEDEC',
      background: '#1A1A1A',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '6px',
      padding: '8px 14px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer',
    }}>
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 10a5 5 0 0 0 8.5 3.5L13 12" />
        <path d="M13 3v3h-3" />
        <path d="M13 8a5 5 0 0 0-8.5-3.5L3 6" />
      </svg>
      {label}
    </button>
  )
}

function IconButton({ children, ariaLabel }: { children: React.ReactNode; ariaLabel: string }) {
  return (
    <button aria-label={ariaLabel} style={{
      width: '30px',
      height: '30px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent',
      color: 'var(--text-secondary)',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
    }}>
      {children}
    </button>
  )
}

function SeverityBadge({ level }: { level: 'High' | 'Medium' | 'Low' }) {
  const color = level === 'High' ? '#DC2626' : level === 'Medium' ? '#EA580C' : '#A8A29E'
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      fontFamily: 'var(--font-body)',
      fontSize: '12.5px',
      fontWeight: 500,
      color: 'var(--text-primary)',
    }}>
      <span style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        backgroundColor: color,
      }} />
      {level}
    </span>
  )
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code style={{
      fontFamily: 'var(--font-mono)',
      fontSize: '12.5px',
      color: 'var(--text-primary)',
      background: 'var(--inline-code-bg, rgba(255, 255, 255, 0.05))',
      padding: '2px 6px',
      borderRadius: '4px',
    }}>
      {children}
    </code>
  )
}

function AccentCode({ children }: { children: React.ReactNode }) {
  return (
    <code style={{
      fontFamily: 'var(--font-mono)',
      fontSize: '12.5px',
      color: ACCENT,
      background: 'rgba(29, 78, 216, 0.10)',
      padding: '2px 6px',
      borderRadius: '4px',
    }}>
      {children}
    </code>
  )
}

function AvatarChip() {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
      <div style={{
        width: '26px',
        height: '26px',
        borderRadius: '50%',
        background: ACCENT,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        fontWeight: 600,
        color: '#FFFFFF',
        letterSpacing: '0.04em',
      }}>
        MC
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: '13px',
          fontWeight: 500,
          color: 'var(--text-primary)',
        }}>
          Maya Chen
        </span>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: '11.5px',
          fontWeight: 400,
          color: 'var(--text-secondary)',
        }}>
          maya@meridian.co
        </span>
      </div>
    </div>
  )
}

function TrustSegmentedControl({ active = 1 }: { active?: 0 | 1 | 2 }) {
  const options = ['Suggest only', 'Draft PR', 'Auto-merge']
  return (
    <div style={{
      display: 'inline-flex',
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border)',
      borderRadius: '8px',
      padding: '3px',
    }}>
      {options.map((opt, i) => (
        <span
          key={opt}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            fontWeight: 500,
            color: i === active ? '#FFFFFF' : 'var(--text-secondary)',
            background: i === active ? ACCENT : 'transparent',
            padding: '6px 12px',
            borderRadius: '6px',
          }}
        >
          {opt}
        </span>
      ))}
    </div>
  )
}

function StatusPill({ label, variant }: { label: string; variant: 'pass' | 'fail' | 'pending' | 'neutral' }) {
  const palette = {
    pass: { bg: 'rgba(34, 197, 94, 0.10)', color: '#4ADE80' },
    fail: { bg: 'rgba(220, 38, 38, 0.10)', color: '#F87171' },
    pending: { bg: 'rgba(29, 78, 216, 0.12)', color: '#60A5FA' },
    neutral: { bg: 'rgba(255, 255, 255, 0.06)', color: 'var(--text-secondary)' },
  }[variant]

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      fontFamily: 'var(--font-mono)',
      fontSize: '10.5px',
      fontWeight: 500,
      color: palette.color,
      background: palette.bg,
      padding: '3px 9px',
      borderRadius: '100px',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
    }}>
      {label}
    </span>
  )
}

function FilterTrigger({ label }: { label: string }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      fontFamily: 'var(--font-body)',
      fontSize: '12.5px',
      fontWeight: 400,
      color: 'var(--text-secondary)',
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      padding: '6px 11px',
      borderRadius: '6px',
    }}>
      {label}
      <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M4 6l4 4 4-4" />
      </svg>
    </span>
  )
}

function SeverityBar() {
  return (
    <div style={{ width: '100%', maxWidth: '360px' }}>
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        fontWeight: 500,
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        marginBottom: '10px',
      }}>
        Active drift by severity
      </p>
      <div style={{
        display: 'flex',
        height: '8px',
        borderRadius: '100px',
        overflow: 'hidden',
        gap: '2px',
      }}>
        <div style={{ flex: '3', background: '#DC2626' }} />
        <div style={{ flex: '3', background: '#EA580C' }} />
        <div style={{ flex: '3', background: '#A8A29E' }} />
        <div style={{ flex: '3', background: 'rgba(255,255,255,0.06)' }} />
      </div>
      <div style={{ display: 'flex', gap: '14px', marginTop: '10px' }}>
        <SeverityBadge level="High" />
        <SeverityBadge level="Medium" />
        <SeverityBadge level="Low" />
      </div>
    </div>
  )
}

function HealthScore() {
  return (
    <div>
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        fontWeight: 500,
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        marginBottom: '8px',
      }}>
        System health
      </p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: '48px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '-0.04em',
          lineHeight: 1,
        }}>
          62
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '14px',
          color: 'var(--text-muted)',
        }}>
          /100
        </span>
      </div>
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '11.5px',
        fontWeight: 400,
        color: 'var(--text-secondary)',
        marginTop: '4px',
      }}>
        ↓ 4 from last week
      </p>
    </div>
  )
}

function TableRowDemo() {
  return (
    <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
    <div style={{
      width: '100%',
      minWidth: '480px',
      maxWidth: '560px',
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: '8px',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '90px 1fr 130px',
        padding: '10px 16px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-secondary)',
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        fontWeight: 500,
        color: 'var(--text-secondary)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
      }}>
        <span>Severity</span>
        <span>Issue</span>
        <span>Detected</span>
      </div>
      {[
        { sev: 'High' as const, file: 'Textarea.tsx', msg: 'references undefined token', token: 'input-border', time: '3h ago' },
        { sev: 'Medium' as const, file: 'Badge.tsx', msg: 'uses off-scale spacing', token: 'spacing-5', time: '3h ago' },
        { sev: 'Low' as const, file: 'Tooltip.tsx', msg: 'uses off-scale spacing', token: 'spacing-7', time: '3h ago' },
      ].map((row, i) => (
        <div
          key={i}
          style={{
            display: 'grid',
            gridTemplateColumns: '90px 1fr 130px',
            padding: '14px 16px',
            borderBottom: i === 2 ? 'none' : '1px solid var(--border)',
            alignItems: 'center',
            fontFamily: 'var(--font-body)',
            fontSize: '12.5px',
          }}
        >
          <SeverityBadge level={row.sev} />
          <span style={{ color: 'var(--text-primary)' }}>
            <InlineCode>{row.file}</InlineCode> <span style={{ color: 'var(--text-secondary)' }}>{row.msg}</span> <AccentCode>{row.token}</AccentCode>
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11.5px',
            color: 'var(--text-secondary)',
          }}>
            {row.time}
          </span>
        </div>
      ))}
    </div>
    </div>
  )
}

function AcceptRejectBar() {
  return (
    <div style={{ display: 'inline-flex', gap: '10px' }}>
      <button style={{
        fontFamily: 'var(--font-body)',
        fontSize: '13px',
        fontWeight: 500,
        color: '#FFFFFF',
        background: ACCENT,
        border: 'none',
        borderRadius: '6px',
        padding: '8px 18px',
        cursor: 'pointer',
      }}>
        Accept fix
      </button>
      <button style={{
        fontFamily: 'var(--font-body)',
        fontSize: '13px',
        fontWeight: 500,
        color: 'var(--text-primary)',
        background: 'transparent',
        border: '1px solid var(--border)',
        borderRadius: '6px',
        padding: '8px 16px',
        cursor: 'pointer',
      }}>
        Reject
      </button>
    </div>
  )
}

function SettingsPopover({ theme }: { theme: 'light' | 'dark' }) {
  const isDark = theme === 'dark'
  const palette = isDark
    ? {
        bg: '#0C0C0C',
        border: 'rgba(255, 255, 255, 0.08)',
        divider: 'rgba(255, 255, 255, 0.06)',
        textPrimary: '#EDEDEC',
        textSecondary: '#8A8A8A',
        textMuted: '#5A5A5A',
        chipBg: 'rgba(255, 255, 255, 0.06)',
        chipText: '#8A8A8A',
        shortcutBg: 'rgba(255, 255, 255, 0.06)',
        shortcutText: '#8A8A8A',
        shadow: '0 18px 40px rgba(0, 0, 0, 0.55)',
      }
    : {
        bg: '#FFFFFF',
        border: 'rgba(0, 0, 0, 0.08)',
        divider: 'rgba(0, 0, 0, 0.06)',
        textPrimary: '#111111',
        textSecondary: '#6A6A6A',
        textMuted: '#A0A0A0',
        chipBg: '#F0F0F0',
        chipText: '#6A6A6A',
        shortcutBg: '#F0F0F0',
        shortcutText: '#6A6A6A',
        shadow: '0 18px 40px rgba(0, 0, 0, 0.12)',
      }

  const sectionLabel = {
    fontFamily: 'var(--font-mono)',
    fontSize: '9.5px',
    fontWeight: 500,
    color: palette.textMuted,
    letterSpacing: '0.14em',
    textTransform: 'uppercase' as const,
    marginBottom: '10px',
  }

  const rowItem = {
    fontFamily: 'var(--font-body)',
    fontSize: '13px',
    fontWeight: 500,
    color: palette.textPrimary,
    lineHeight: 1.2,
  }

  const rowSub = {
    fontFamily: 'var(--font-body)',
    fontSize: '11px',
    color: palette.textSecondary,
    marginTop: '3px',
  }

  const chipStyle = {
    fontFamily: 'var(--font-mono)',
    fontSize: '9.5px',
    fontWeight: 500,
    color: palette.chipText,
    background: palette.chipBg,
    padding: '3px 8px',
    borderRadius: '4px',
    letterSpacing: '0.08em',
  }

  return (
    <div style={{
      width: '248px',
      background: palette.bg,
      border: `1px solid ${palette.border}`,
      borderRadius: '10px',
      boxShadow: palette.shadow,
      overflow: 'hidden',
    }}>
      {/* ACCOUNT */}
      <div style={{ padding: '14px 16px 14px 16px' }}>
        <p style={sectionLabel}>Account</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            background: ACCENT,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.04em',
            flexShrink: 0,
          }}>MC</div>
          <div style={{ minWidth: 0 }}>
            <p style={{ ...rowItem, fontSize: '13px' }}>Maya Chen</p>
            <p style={{ ...rowSub, fontSize: '11.5px' }}>maya@meridian.co</p>
          </div>
        </div>
      </div>

      <div style={{ height: '1px', background: palette.divider }} />

      {/* WORKSPACE */}
      <div style={{ padding: '14px 16px 10px 16px' }}>
        <p style={sectionLabel}>Workspace</p>
        {[
          { label: 'Drift alert frequency', sub: 'Real-time' },
          { label: 'Connected systems', sub: '2 active' },
        ].map((item) => (
          <div key={item.label} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '7px 0',
            gap: '12px',
          }}>
            <div>
              <p style={rowItem}>{item.label}</p>
              <p style={rowSub}>{item.sub}</p>
            </div>
            <span style={chipStyle}>SOON</span>
          </div>
        ))}
      </div>

      <div style={{ height: '1px', background: palette.divider }} />

      {/* SESSION */}
      <div style={{ padding: '14px 16px 16px 16px' }}>
        <p style={sectionLabel}>Session</p>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 0',
        }}>
          <p style={rowItem}>Keyboard shortcuts</p>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10.5px',
            color: palette.shortcutText,
            background: palette.shortcutBg,
            padding: '2px 7px',
            borderRadius: '4px',
            letterSpacing: '0.04em',
          }}>⌘ /</span>
        </div>
        <div style={{ padding: '8px 0 2px 0' }}>
          <p style={{ ...rowItem, color: ACCENT }}>Sign out</p>
        </div>
      </div>
    </div>
  )
}

function TypeSpecimen({ label, size, family, sample }: { label: string; size: string; family: string; sample: string }) {
  return (
    <div style={{
      padding: '24px 0',
      borderBottom: '1px solid var(--border)',
      display: 'grid',
      gridTemplateColumns: '160px 1fr',
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
          {size}
        </p>
      </div>
      <p style={{
        fontFamily: family,
        fontSize: size,
        color: 'var(--text-primary)',
        lineHeight: 1.2,
        letterSpacing: size.includes('rem') && parseFloat(size) >= 2 ? '-0.03em' : '-0.01em',
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
        width: `${value * 4}px`,
        background: ACCENT,
        borderRadius: '2px',
      }} />
    </div>
  )
}

function RadiusTile({ name, value }: { name: string; value: number }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: '72px',
        height: '72px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-hover)',
        borderRadius: `${value}px`,
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
        {value}px
      </p>
    </div>
  )
}

/* ── Page ─────────────────────────────────────────── */

export default function KeelDesignSystem() {
  return (
    <>
      <Header />

      <main className="keel-ds-main" style={{ paddingTop: '160px' }}>

        {/* ━━━ HERO ━━━ */}
        <section className="responsive-padding keel-ds-hero" style={{ padding: '0 48px 96px 48px' }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Link href="/work/keel" style={{
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
              ← Back to Keel case study
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
              className="keel-ds-title"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.75rem, 6vw, 5rem)',
                fontWeight: 700,
                letterSpacing: '-0.04em',
                lineHeight: 1.05,
                color: 'var(--text-primary)',
              }}
            >
              The Keel design system
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
            Keel is a tool that audits design systems. Keel&rsquo;s own surface is built from a design system — foundations, components, and theming decided before the first screen was drawn. This page is the reference. Every token and component shown below is the source of truth for what ships in the product.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
            className="responsive-grid-4 keel-ds-meta"
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
              { label: 'Foundations', value: 'Color · Type · Space · Radii' },
              { label: 'Components', value: '12 documented here · 40+ in product' },
              { label: 'Theming', value: 'Light + Dark parity' },
              { label: 'Tokens', value: 'CSS variables, Tailwind-exported' },
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

        <div className="keel-ds-divider" style={{ height: '1px', background: 'var(--border)', margin: '0 48px' }} />

        {/* ━━━ 01 FOUNDATIONS ━━━ */}
        <section className="responsive-padding keel-ds-section" style={{ padding: '96px 48px' }}>
          <StaggerContainer>
            <motion.div variants={staggerChild}>
              <SectionEyebrow number="01" label="Foundations" />
            </motion.div>
            <motion.div variants={staggerChild}>
              <SectionTitle>The tokens everything else is built from.</SectionTitle>
            </motion.div>
            <motion.div variants={staggerChild}>
              <SectionIntro>
                Keel&rsquo;s foundation is narrow on purpose. Nine surface colors, three text weights, one accent, three severity tones. Narrow foundations make violations visible — which is Keel&rsquo;s job.
              </SectionIntro>
            </motion.div>

            {/* COLOR */}
            <div style={{ marginTop: '72px' }}>
              <motion.div variants={staggerChild}>
                <SubsectionHeading label="Color" name="Surfaces, text, accent, severity" />
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
                  The page is grayscale because it is a review log. Dark blue marks decision moments (accept, approve, pending, ship). Severity colors belong to drift-severity only — nothing else in the product earns red, orange, or yellow.
                </p>
              </motion.div>

              {/* Surface swatches */}
              <motion.div variants={staggerChild} style={{ marginBottom: '32px' }}>
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10.5px',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  marginBottom: '16px',
                }}>
                  Surfaces
                </p>
                <div className="keel-ds-swatch-grid" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '16px',
                }}>
                  {PAGE_SWATCHES.map((s) => <SwatchCard key={s.name} swatch={s} />)}
                </div>
              </motion.div>

              {/* Text swatches */}
              <motion.div variants={staggerChild} style={{ marginBottom: '32px' }}>
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10.5px',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  marginBottom: '16px',
                }}>
                  Text hierarchy
                </p>
                <div className="keel-ds-swatch-grid-3" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '16px',
                }}>
                  {TEXT_SWATCHES.map((s) => <SwatchCard key={s.name} swatch={s} />)}
                </div>
              </motion.div>

              {/* Accent + severity */}
              <div className="keel-ds-swatch-split" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <motion.div variants={staggerChild}>
                  <p style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10.5px',
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    marginBottom: '16px',
                  }}>
                    Accent (decision)
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                    {ACCENT_SWATCHES.map((s) => <SwatchCard key={s.name} swatch={s} />)}
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
                  }}>
                    Severity (drift only)
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    {SEVERITY_SWATCHES.map((s) => <SwatchCard key={s.name} swatch={s} />)}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* TYPOGRAPHY */}
            <div style={{ marginTop: '88px' }}>
              <motion.div variants={staggerChild}>
                <SubsectionHeading label="Typography" name="Mono for facts. Body for claims. Display for moments." />
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
                  Three families. Mono carries everything the system knows to be true: tokens, filenames, timestamps, severities. Body carries rhetoric: claims, descriptions, copy. Display is reserved for page-level typographic moments.
                </p>
              </motion.div>

              <motion.div variants={staggerChild}>
                <TypeSpecimen label="Display / 3rem" size="3rem" family="var(--font-display)" sample="Every surface answers one question at a glance." />
                <TypeSpecimen label="Display / 1.5rem" size="1.5rem" family="var(--font-display)" sample="Section heading" />
                <TypeSpecimen label="Body / 1.0625rem" size="1.0625rem" family="var(--font-body)" sample="Keel watches AI-generated pull requests against your design system." />
                <TypeSpecimen label="Body / 0.875rem" size="0.875rem" family="var(--font-body)" sample="Supporting text for labels, captions, table cells." />
                <TypeSpecimen label="Mono / 0.8125rem" size="0.8125rem" family="var(--font-mono)" sample="Textarea.tsx — input-border — 3h ago" />
                <TypeSpecimen label="Mono / 0.625rem" size="0.625rem" family="var(--font-mono)" sample="EYEBROW / LABEL / METRIC LABEL" />
              </motion.div>
            </div>

            {/* SPACING */}
            <div style={{ marginTop: '88px' }}>
              <motion.div variants={staggerChild}>
                <SubsectionHeading label="Spacing" name="4-based scale. No p-7." />
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
                  Six values. Anything else is a violation — one of the three categories Keel&rsquo;s parity checker flags on AI output.
                </p>
              </motion.div>
              <motion.div variants={staggerChild} style={{ maxWidth: '520px' }}>
                {[4, 8, 12, 16, 20, 24].map((v) => <SpacingRow key={v} value={v} />)}
              </motion.div>
            </div>

            {/* RADII */}
            <div style={{ marginTop: '88px' }}>
              <motion.div variants={staggerChild}>
                <SubsectionHeading label="Radii" name="Four sizes for four roles" />
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
                  <InlineCode>sm</InlineCode> for inline pills and chips. <InlineCode>md</InlineCode> for buttons and inputs. <InlineCode>lg</InlineCode> for cards and panels. <InlineCode>xl</InlineCode> for hero-scale surfaces.
                </p>
              </motion.div>
              <motion.div variants={staggerChild} className="keel-ds-radii" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', maxWidth: '480px' }}>
                <RadiusTile name="sm" value={4} />
                <RadiusTile name="md" value={8} />
                <RadiusTile name="lg" value={12} />
                <RadiusTile name="xl" value={16} />
              </motion.div>
            </div>
          </StaggerContainer>
        </section>

        <div className="keel-ds-divider" style={{ height: '1px', background: 'var(--border)', margin: '0 48px' }} />

        {/* ━━━ 02 COMPONENTS ━━━ */}
        <section className="responsive-padding keel-ds-section" style={{ padding: '96px 48px' }}>
          <StaggerContainer>
            <motion.div variants={staggerChild}>
              <SectionEyebrow number="02" label="Components" />
            </motion.div>
            <motion.div variants={staggerChild}>
              <SectionTitle>12 components. 5 subsystems. One system.</SectionTitle>
            </motion.div>
            <motion.div variants={staggerChild}>
              <SectionIntro>
                Every component was designed to carry a specific kind of information. Severity badges never mean anything except drift severity. Inline code pills carry literal identifiers from the codebase. The accent color only appears on things the user is about to decide on.
              </SectionIntro>
            </motion.div>

            {/* ACTIONS */}
            <div style={{ marginTop: '72px' }}>
              <motion.div variants={staggerChild}>
                <SubsectionHeading label="Actions" name="Buttons, icon buttons, decision bar" />
              </motion.div>

              <motion.div variants={staggerChild} className="keel-ds-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                <ComponentCard>
                  <ComponentCaption name="Primary button" note="Black fill, subtle border, icon-first. Used for the one primary action on a view — never two at once." />
                  <ComponentPreview>
                    <PrimaryButton />
                  </ComponentPreview>
                </ComponentCard>

                <ComponentCard>
                  <ComponentCaption name="Icon buttons" note="Unstyled except at hover. Used for theme toggle, settings, row actions — never for destructive work." />
                  <ComponentPreview>
                    <IconButton ariaLabel="Toggle theme">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                      </svg>
                    </IconButton>
                    <IconButton ariaLabel="Settings">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                      </svg>
                    </IconButton>
                    <IconButton ariaLabel="More">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="5" cy="12" r="1.3" />
                        <circle cx="12" cy="12" r="1.3" />
                        <circle cx="19" cy="12" r="1.3" />
                      </svg>
                    </IconButton>
                  </ComponentPreview>
                </ComponentCard>

                <ComponentCard>
                  <ComponentCaption name="Decision bar" note="Two buttons. Primary action in accent. Secondary reject in ghost. Never stacked, never three." />
                  <ComponentPreview>
                    <AcceptRejectBar />
                  </ComponentPreview>
                </ComponentCard>

                <ComponentCard>
                  <ComponentCaption name="Segmented control (trust levels)" note="Three options, one axis, always in order of increasing trust. Policy config uses one per action row." />
                  <ComponentPreview>
                    <TrustSegmentedControl active={1} />
                  </ComponentPreview>
                </ComponentCard>
              </motion.div>
            </div>

            {/* STATUS & DATA */}
            <div style={{ marginTop: '56px' }}>
              <motion.div variants={staggerChild}>
                <SubsectionHeading label="Status & data display" name="Badges, pills, code, avatars" />
              </motion.div>

              <motion.div variants={staggerChild} className="keel-ds-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                <ComponentCard>
                  <ComponentCaption name="Severity badge" note="Dot + label. The three colors are the entire severity palette. No other component borrows these hues." />
                  <ComponentPreview>
                    <SeverityBadge level="High" />
                    <SeverityBadge level="Medium" />
                    <SeverityBadge level="Low" />
                  </ComponentPreview>
                </ComponentCard>

                <ComponentCard>
                  <ComponentCaption name="Status pill" note="Short uppercase mono. Used on parity results, policy decisions, timeline states." />
                  <ComponentPreview>
                    <StatusPill label="Pass" variant="pass" />
                    <StatusPill label="Fail" variant="fail" />
                    <StatusPill label="Draft PR" variant="pending" />
                    <StatusPill label="Suggest only" variant="neutral" />
                  </ComponentPreview>
                </ComponentCard>

                <ComponentCard>
                  <ComponentCaption name="Inline code pill" note="Two variants. Neutral for filenames and known-good tokens. Accented for the token at the center of a drift." />
                  <ComponentPreview>
                    <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)', fontSize: '13.5px' }}>
                      <InlineCode>Textarea.tsx</InlineCode> references <AccentCode>input-border</AccentCode>
                    </span>
                  </ComponentPreview>
                </ComponentCard>

                <ComponentCard>
                  <ComponentCaption name="Avatar chip" note="Initials circle + name + email. Accent-filled circle — the only place in the product an avatar earns color." />
                  <ComponentPreview>
                    <AvatarChip />
                  </ComponentPreview>
                </ComponentCard>

                <ComponentCard>
                  <ComponentCaption name="Severity distribution bar" note="Proportional segments in severity colors. Dashboard-level read at a glance — how is drift distributed this week?" />
                  <ComponentPreview>
                    <SeverityBar />
                  </ComponentPreview>
                </ComponentCard>

                <ComponentCard>
                  <ComponentCaption name="Health score" note="Display-size number, mono denominator, single delta line. The dashboard's one hero metric." />
                  <ComponentPreview>
                    <HealthScore />
                  </ComponentPreview>
                </ComponentCard>
              </motion.div>
            </div>

            {/* TABLE + FILTERS */}
            <div style={{ marginTop: '56px' }}>
              <motion.div variants={staggerChild}>
                <SubsectionHeading label="Tables & filters" name="The core data surface" />
              </motion.div>

              <motion.div variants={staggerChild} className="keel-ds-grid-2" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px' }}>
                <ComponentCard>
                  <ComponentCaption name="Table row" note="Severity, issue text with inline code, timestamp. 48px row height is non-negotiable — fifteen rows fit above the fold." />
                  <ComponentPreview height="200px">
                    <TableRowDemo />
                  </ComponentPreview>
                </ComponentCard>

                <ComponentCard>
                  <ComponentCaption name="Filter trigger" note="Label + caret. The options dropdown uses the popover pattern below. No full modals for filters, ever." />
                  <ComponentPreview>
                    <FilterTrigger label="All severities" />
                    <FilterTrigger label="All categories" />
                    <FilterTrigger label="All sources" />
                  </ComponentPreview>
                </ComponentCard>
              </motion.div>
            </div>

            {/* POPOVER */}
            <div style={{ marginTop: '56px' }}>
              <motion.div variants={staggerChild}>
                <SubsectionHeading label="Containers" name="Popovers, not modals" />
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
                  Keel has zero blocking modals. Anchored popovers carry settings, filters, row actions. A blocking modal in a review tool is an interruption to the reviewer&rsquo;s scan — and the scan is the job.
                </p>
              </motion.div>

              <motion.div variants={staggerChild} className="keel-ds-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                <ComponentCard>
                  <ComponentCaption name="Settings popover — light" note="Sectioned dropdown (Account · Workspace · Session). Accent avatar, SOON chips for not-yet-shipped entries, mono shortcut affordances." />
                  <ComponentPreview height="360px" variant="dark">
                    <SettingsPopover theme="light" />
                  </ComponentPreview>
                </ComponentCard>

                <ComponentCard>
                  <ComponentCaption name="Settings popover — dark" note="Identical IA, reinforced contrast. Section dividers slightly brightened for dark-mode legibility." />
                  <ComponentPreview height="360px">
                    <SettingsPopover theme="dark" />
                  </ComponentPreview>
                </ComponentCard>
              </motion.div>
            </div>
          </StaggerContainer>
        </section>

        <div className="keel-ds-divider" style={{ height: '1px', background: 'var(--border)', margin: '0 48px' }} />

        {/* ━━━ 03 THEMING ━━━ */}
        <section className="responsive-padding keel-ds-section" style={{ padding: '96px 48px' }}>
          <StaggerContainer>
            <motion.div variants={staggerChild}>
              <SectionEyebrow number="03" label="Theming" />
            </motion.div>
            <motion.div variants={staggerChild}>
              <SectionTitle>Light and dark are the same system, not two systems.</SectionTitle>
            </motion.div>
            <motion.div variants={staggerChild}>
              <SectionIntro>
                Every token has a light and dark value. Every component renders the same information architecture in both. The theme toggle is a lookup swap, not a re-skin — if a component looks materially different across modes, the component is wrong, not the theme.
              </SectionIntro>
            </motion.div>

            <motion.div variants={staggerChild} className="keel-ds-grid-2" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '20px',
              marginTop: '56px',
            }}>
              <ComponentCard>
                <ComponentCaption name="Drift dashboard — light" note="The same rows, same hierarchy, same severities. Surfaces brighten; severity hues shift one step darker to preserve contrast." />
                <div style={{
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1px solid var(--border)',
                }}>
                  <ImageLightbox
                    src="/images/Keel/drift-dashboard-light.png"
                    alt="Keel drift dashboard — light mode"
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </div>
              </ComponentCard>

              <ComponentCard>
                <ComponentCaption name="Drift dashboard — dark" note="Dark-mode parity. Same dense layout, same ten-rows-before-scroll rule. Every component here earns its dark treatment from a token, not a stylesheet." />
                <div style={{
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1px solid var(--border)',
                }}>
                  <ImageLightbox
                    src="/images/Keel/drift-dashboard-dark.png"
                    alt="Keel drift dashboard — dark mode"
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </div>
              </ComponentCard>

              <ComponentCard>
                <ComponentCaption name="Parity audit — light" note="Pass-state auditing. Green fill-at-low-opacity signals a clean run. No severity hues appear when there is nothing to flag." />
                <div style={{
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1px solid var(--border)',
                }}>
                  <ImageLightbox
                    src="/images/Keel/parity-pass-light.png"
                    alt="Keel parity audit — passing, light mode"
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </div>
              </ComponentCard>

              <ComponentCard>
                <ComponentCaption name="Parity audit — dark" note="Five violations on an AI-authored PR. Severity colors only activate when the foundation rules disagree with what was shipped." />
                <div style={{
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1px solid var(--border)',
                }}>
                  <ImageLightbox
                    src="/images/Keel/parity-failing-5-dark.png"
                    alt="Keel parity audit — failing, dark mode"
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </div>
              </ComponentCard>
            </motion.div>
          </StaggerContainer>
        </section>

        {/* ━━━ BACK TO CASE STUDY ━━━ */}
        <section className="responsive-padding keel-ds-back-section" style={{
          padding: '120px 48px 0 48px',
          borderTop: '1px solid var(--border)',
          marginTop: '96px',
        }}>
          <Link href="/work/keel" style={{ textDecoration: 'none', display: 'block' }}>
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
                  Keel
                </h2>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  fontWeight: 400,
                  color: 'var(--text-secondary)',
                  marginTop: '8px',
                }}>
                  Governance for AI-Authored Design Systems
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
          .keel-ds-swatch-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .keel-ds-swatch-grid-3 {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .keel-ds-swatch-split {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .keel-ds-grid-2 {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 768px) {
          .keel-ds-hero {
            padding: 0 20px 64px 20px !important;
          }
          .keel-ds-section {
            padding: 72px 20px !important;
          }
          .keel-ds-back-section {
            padding: 80px 20px 0 20px !important;
            margin-top: 64px !important;
          }
          .keel-ds-divider {
            margin: 0 20px !important;
          }
          .keel-ds-title {
            font-size: 2.5rem !important;
          }
          .keel-ds-meta {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 20px !important;
          }
          .keel-ds-swatch-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .keel-ds-swatch-grid-3 {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .keel-ds-radii {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
      `}</style>
    </>
  )
}
