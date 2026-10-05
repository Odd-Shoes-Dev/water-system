import Link from 'next/link'

const links = [
  { href: '/', label: 'Home' },
  { href: '/streams', label: 'Data streams' },
  { href: '/reports', label: 'Reports & map' },
  { href: '/stakeholders', label: 'Stakeholders' },
]

export function SiteNav() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="font-heading text-2xl">
          Rain<span className="italic text-accent">&amp;</span>Renew
        </Link>
        <nav className="flex flex-wrap gap-4 text-sm">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-muted-foreground transition-colors hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
