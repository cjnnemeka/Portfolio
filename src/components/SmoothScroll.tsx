'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'

declare global {
  interface Window {
    __lenis?: Lenis
  }
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

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

  // Reset scroll to top on route change — Lenis otherwise preserves the previous page's position.
  useEffect(() => {
    window.__lenis?.scrollTo(0, { immediate: true, force: true })
  }, [pathname])

  return <>{children}</>
}
