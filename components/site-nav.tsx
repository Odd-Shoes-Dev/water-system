'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Home' },
  { href: '/streams', label: 'Data streams' },
  { href: '/reports', label: 'Reports & map' },
  { href: '/waitlist', label: 'Waitlist' },
  { href: '/stakeholders', label: 'Stakeholders' },
]

export function SiteNav() {
  const pathname = usePathname()

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="font-heading text-2xl">
          Rain<span className="italic text-accent">&amp;</span>Renew
        </Link>
        <nav className="flex flex-wrap gap-4 text-sm">
          {links.map((link) => {
            const current = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={current ? 'page' : undefined}
                className={`transition-colors hover:text-foreground ${
                  current ? 'font-semibold text-foreground underline decoration-accent decoration-2 underline-offset-8' : 'text-muted-foreground'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
