import type { Metadata } from 'next'
import { SiteNav } from '@/components/site-nav'
import './globals.css'

export const metadata: Metadata = {
  title: 'Rain & Renew',
  description: 'Water level sensing, youth reporting and impact tracking for rainwater and greywater.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <SiteNav />
        <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
        <footer className="mx-auto max-w-6xl px-4 pb-10 text-sm text-muted-foreground">
          Demo data is simulated for illustration.
        </footer>
      </body>
    </html>
  )
}
