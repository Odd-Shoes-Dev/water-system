import { redirect } from 'next/navigation'
import { DashboardNav } from '@/components/dashboard/dashboard-nav'
import { getSession } from '@/lib/services/session'

export default async function DashboardLayout({ children }: LayoutProps<'/dashboard'>) {
  // proxy.ts already gates /dashboard; this is a second check so the page
  // never renders team-only content without a valid session.
  const session = await getSession()
  if (!session) redirect('/login')

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <DashboardNav session={session} />
      <main className="flex-1 overflow-x-hidden bg-background px-6 py-8 sm:px-10 sm:py-10">{children}</main>
    </div>
  )
}
