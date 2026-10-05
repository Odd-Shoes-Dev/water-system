'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

// A thin bar at the top of the page. It starts when an internal link is clicked
// and finishes when the new page appears, so people can see the site is working.
export function RouteProgress() {
  const pathname = usePathname()
  const [active, setActive] = useState(false)

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const anchor = (event.target as Element | null)?.closest('a')
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return

      const url = new URL(anchor.href, window.location.href)
      if (url.origin !== window.location.origin) return
      if (url.pathname === window.location.pathname) return

      setActive(true)
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  // Route changed: the new page is on screen, so stop the bar.
  useEffect(() => {
    setActive(false)
  }, [pathname])

  // Safety net: never leave the bar running if a navigation is cancelled.
  useEffect(() => {
    if (!active) return
    const timeout = window.setTimeout(() => setActive(false), 10_000)
    return () => window.clearTimeout(timeout)
  }, [active])

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 overflow-hidden bg-transparent transition-opacity duration-300 ${
        active ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="route-progress-bar h-full w-1/3 bg-accent" />
    </div>
  )
}
