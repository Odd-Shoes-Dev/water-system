import { MapView } from '@/components/map-view'
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

// View-only: the public Reports & map page has the submission form. This is
// the team's view of the same reports.
export default async function DashboardRiverWatchPage() {
  const reports = await getDataStore().listRiverReports()

  const markers = reports.map((report) => ({
    id: report.id,
    latitude: report.latitude,
    longitude: report.longitude,
    title: REPORT_CATEGORIES[report.category],
    subtitle: `${report.locationDescription} · ${report.status}`,
    color: markerColors[report.category],
  }))

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-accent">River watch</p>
        <h1 className="mt-2 font-heading text-4xl">River Rwizi reports</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {reports.length} reports, submitted by youth from the public Reports &amp; map page.
        </p>
      </div>
      <MapView markers={markers} center={[-0.61, 30.65]} zoom={13} heightClassName="h-[420px]" />
      <ReportsList reports={reports.map((report) => ({ ...report, createdAt: report.createdAt.toISOString() }))} />
    </div>
  )
}
