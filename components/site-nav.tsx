'use client'

import { usePathname } from 'next/navigation'
import { NavContent } from './nav-content'

// On the home page the nav is rendered inside the hero section itself (see
// app/page.tsx): in normal document flow, so it can wrap on any screen size
// without ever overlapping the headline, while the hero image still shows
// through behind it. The dashboard has its own sidebar nav instead (see
// components/dashboard/dashboard-nav.tsx). Every other page gets this plain
// solid header.
export function SiteNav() {
  const pathname = usePathname()
  if (pathname === '/' || pathname.startsWith('/dashboard')) return null

  return (
    <header className="border-b border-border bg-card">
      <NavContent />
    </header>
  )
}
