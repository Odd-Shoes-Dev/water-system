import Link from 'next/link'
import { MapView } from '@/components/map-view'
import { ReportForm } from '@/components/report-form'
import { ReportsList } from '@/components/reports-list'
import { getDataStore } from '@/lib/data'
import { REPORT_CATEGORIES } from '@/lib/data/types'

export const dynamic = 'force-dynamic'

const markerColors: Record<string, string> = {
  illegal_dumping: 'hsl(356 72% 52%)',
  pollution_hotspot: 'hsl(32 90% 50%)',
  blocked_drainage: 'hsl(205 85% 20%)',
  riverbank_degradation: 'hsl(356 72% 52%)',
  clean_up: 'hsl(158 55% 38%)',
  restoration: 'hsl(158 55% 38%)',
}

export default async function ReportsPage() {
  const store = getDataStore()
  const [reports, waitlistCount] = await Promise.all([store.listRiverReports(), store.countWaitlistEntries()])

  const markers = reports.map((report) => ({
    id: report.id,
    latitude: report.latitude,
    longitude: report.longitude,
    title: REPORT_CATEGORIES[report.category],
    subtitle: `${report.locationDescription} · ${report.status}`,
    color: markerColors[report.category],
  }))

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-10">
      <header className="space-y-2">
        <h1 className="font-heading text-5xl">Reports &amp; map</h1>
        <p className="max-w-2xl text-muted-foreground">
          Youth report illegal dumping, pollution, blocked drainage and riverbank damage, and log clean-ups and
          restoration. Reports appear on the map as they come in.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        <ReportForm />
        <div className="space-y-4">
          <MapView markers={markers} center={[-0.61, 30.65]} zoom={13} />
          <p className="text-sm text-muted-foreground">{reports.length} reports on the map</p>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="font-heading text-3xl">Latest reports</h2>
        <p className="text-sm text-muted-foreground">Click a report to see its full details.</p>
        <ReportsList reports={reports.map((report) => ({ ...report, createdAt: report.createdAt.toISOString() }))} />
      </section>

      <Link
        href="/waitlist"
        className="block rounded-lg border border-border bg-card p-5 transition-colors hover:border-accent"
      >
        <h2 className="font-heading text-2xl">Want to join the programme?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {waitlistCount.toLocaleString('en-US')} {waitlistCount === 1 ? 'person has' : 'people have'} joined
          so far. Leave your details and we&apos;ll reach out.
        </p>
      </Link>
    </div>
  )
}
