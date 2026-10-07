import type { Metadata } from 'next'
import { RouteProgress } from '@/components/route-progress'
import { SiteNav } from '@/components/site-nav'
import './globals.css'

const title = 'Rain & Renew'
const description = 'Water level sensing, youth reporting and impact tracking for rainwater and greywater.'

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, images: ['/hero-image.png'] },
  twitter: { card: 'summary_large_image', title, description, images: ['/hero-image.png'] },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <RouteProgress />
        <SiteNav />
        <main>{children}</main>
      </body>
    </html>
  )
}
