'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

const navItems = [
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Header() {
  const pathname = usePathname()

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '20px 48px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(250, 250, 249, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <Link href="/" style={{
        fontFamily: 'var(--font-display)',
        fontSize: '0.9375rem',
        fontWeight: 600,
        letterSpacing: '-0.01em',
        color: 'var(--text-primary)',
      }}>
        Cj Nnemeka
      </Link>

      <nav style={{ display: 'flex', gap: '36px', alignItems: 'center' }}>
        {navItems.map((item) => {
          const isActive = item.href === '/about' && pathname === '/about'
          return (
            <Link
              key={item.label}
              href={item.href}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.8125rem',
                fontWeight: 400,
                color: 'var(--text-primary)',
                letterSpacing: '0.01em',
                opacity: isActive ? 0.9 : 0.7,
                transition: 'opacity 0.4s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = isActive ? '0.9' : '0.7')}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </motion.header>
  )
}
