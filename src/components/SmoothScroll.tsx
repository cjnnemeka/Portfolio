'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'

declare global {
  interface Window {
    __lenis?: Lenis
  }
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const prevPathname = useRef(pathname)
  const scrollPositions = useRef<Map<string, number>>(new Map())
  const isPopState = useRef(false)

  // Flag popstate navigations (browser back/forward) so we can distinguish
  // them from forward link clicks in the pathname effect below.
  useEffect(() => {
    const handlePopState = () => {
      isPopState.current = true
    }
    window.addEventListener('popstate', handlePopState)
    // Disable the browser's default scroll restoration; we're doing it manually
    // because Lenis hijacks scroll and the native restore fights it.
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    })

    window.__lenis = lenis

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
      if (window.__lenis === lenis) {
        delete window.__lenis
      }
    }
  }, [])

  useEffect(() => {
    // Record the outgoing page's scroll so we can put it back if the user returns via back/forward.
    scrollPositions.current.set(prevPathname.current, window.scrollY)

    if (isPopState.current) {
      const saved = scrollPositions.current.get(pathname) ?? 0
      window.__lenis?.scrollTo(saved, { immediate: true, force: true })
      isPopState.current = false
    } else {
      window.__lenis?.scrollTo(0, { immediate: true, force: true })
    }

    prevPathname.current = pathname
  }, [pathname])

  return <>{children}</>
}
