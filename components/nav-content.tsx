'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Public-facing nav. Data streams and Stakeholders aren't listed here on
// purpose: they're the start of a "logged in" section, not public pages,
// and stay reachable by direct link until that split is built properly.
const links = [
  { href: '/#features', label: 'Features' },
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/reports', label: 'Reports & map' },
  { href: '/waitlist', label: 'Waitlist' },
]

// The logo, links and login button, shared by the solid header (every page
// but home) and the transparent one rendered inside the hero (home only).
export function NavContent({ transparent = false }: { transparent?: boolean }) {
  const pathname = usePathname()

  return (
    <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
      <Link href="/" className={`font-heading text-2xl ${transparent ? 'text-white' : ''}`}>
        Rain<span className="italic text-accent">&amp;</span>Renew
      </Link>
      <nav className="flex flex-wrap items-center gap-4 text-sm">
        {links.map((link) => {
          const path = link.href.split('#')[0] || '/'
          const current = path === '/' ? pathname === '/' && !link.href.includes('#') : pathname.startsWith(path)
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={current ? 'page' : undefined}
              className={
                transparent
                  ? `transition-colors hover:text-white ${
                      current ? 'font-semibold text-white underline decoration-accent decoration-2 underline-offset-8' : 'text-white/80'
                    }`
                  : `transition-colors hover:text-foreground ${
                      current ? 'font-semibold text-foreground underline decoration-accent decoration-2 underline-offset-8' : 'text-muted-foreground'
                    }`
              }
            >
              {link.label}
            </Link>
          )
        })}
      </nav>
      <Link
        href="/login"
        className={
          transparent
            ? 'rounded-full bg-white px-4 py-2 text-sm font-medium text-primary transition-opacity hover:opacity-90'
            : 'rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-accent hover:text-accent'
        }
      >
        Log in
      </Link>
    </div>
  )
}
