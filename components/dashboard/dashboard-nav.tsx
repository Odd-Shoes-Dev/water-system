'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  BellIcon,
  ChartIcon,
  CloseIcon,
  DropletIcon,
  GridIcon,
  LogOutIcon,
  MapIcon,
  MenuIcon,
  RecycleIcon,
  WavesIcon,
} from '@/components/icons'

const links = [
  { href: '/dashboard', label: 'Overview', Icon: GridIcon },
  { href: '/dashboard/tanks', label: 'Tanks', Icon: DropletIcon },
  { href: '/dashboard/map', label: 'Map', Icon: MapIcon },
  { href: '/dashboard/alerts', label: 'Alerts', Icon: BellIcon },
  { href: '/dashboard/recycling', label: 'Recycling', Icon: RecycleIcon },
  { href: '/dashboard/river-watch', label: 'River watch', Icon: WavesIcon },
  { href: '/dashboard/impact', label: 'Impact', Icon: ChartIcon },
]

export function DashboardNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Close the drawer whenever navigation actually happens, as a backup to
  // closing it on click, and on Escape while it's open.
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    if (!open) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

  return (
    <>
      {/* Mobile-only top bar: the sidebar itself is off-canvas below md. */}
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-card px-4 py-3 md:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="rounded-md p-1.5 text-foreground transition-colors hover:bg-muted"
        >
          <MenuIcon className="h-5 w-5" />
        </button>
        <span className="font-heading text-lg">
          Rain<span className="italic text-accent">&amp;</span>Renew
        </span>
      </header>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-64 shrink-0 flex-col overflow-y-auto bg-sidebar px-4 py-6 text-sidebar-foreground transition-transform duration-200 ease-in-out md:sticky md:top-0 md:z-auto md:h-screen md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 px-2 font-heading text-xl text-white">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sidebar-accent text-accent">
              <DropletIcon className="h-4 w-4" />
            </span>
            Rain<span className="italic text-accent">&amp;</span>Renew
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="rounded-md p-1.5 text-sidebar-foreground/70 transition-colors hover:text-sidebar-foreground md:hidden"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {links.map(({ href, label, Icon }) => {
            const current = href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                aria-current={current ? 'page' : undefined}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                  current
                    ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-sidebar-border pt-4">
          {/* No real session yet: see docs/known-issues.md for the planned Google sign-in + allowlist. */}
          <p className="px-2 text-sm font-medium text-white">Team member</p>
          <p className="px-2 text-xs text-sidebar-foreground/60">Demo access</p>
          <Link
            href="/"
            className="mt-3 flex items-center gap-2 rounded-md px-2 py-2 text-sm text-sidebar-foreground/70 transition-colors hover:text-sidebar-foreground"
          >
            <LogOutIcon className="h-4 w-4" />
            Sign out
          </Link>
        </div>
      </aside>
    </>
  )
}
