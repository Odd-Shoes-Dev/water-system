'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BellIcon,
  ChartIcon,
  DropletIcon,
  GridIcon,
  LogOutIcon,
  MapIcon,
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

  return (
    <aside className="flex w-64 shrink-0 flex-col bg-sidebar px-4 py-6 text-sidebar-foreground">
      <Link href="/" className="flex items-center gap-2 px-2 font-heading text-xl text-white">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sidebar-accent text-accent">
          <DropletIcon className="h-4 w-4" />
        </span>
        Rain<span className="italic text-accent">&amp;</span>Renew
      </Link>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {links.map(({ href, label, Icon }) => {
          const current = href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              aria-current={current ? 'page' : undefined}
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
  )
}
