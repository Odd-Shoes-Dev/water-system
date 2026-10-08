import { DashboardNav } from '@/components/dashboard/dashboard-nav'

export default function DashboardLayout({ children }: LayoutProps<'/dashboard'>) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <DashboardNav />
      <main className="flex-1 overflow-x-hidden bg-background px-6 py-8 sm:px-10 sm:py-10">{children}</main>
    </div>
  )
}
