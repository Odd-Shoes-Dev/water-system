import { RiverWatchTabs } from '@/components/river-watch-tabs'
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

// The "+ Report issue" / "+ Log activity" button (in RiverWatchTabs) lets a
// logged-in team member report something they heard about, or log a
// restoration activity, reusing the same public report form either way.
export default async function DashboardRiverWatchPage() {
  const store = getDataStore()
  const [reports, activities] = await Promise.all([store.listRiverReports(), store.listActivities()])

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
      <p className="text-sm uppercase tracking-[0.2em] text-accent">River Rwizi</p>
      <RiverWatchTabs
        reports={reports.map((report) => ({ ...report, createdAt: report.createdAt.toISOString() }))}
        activities={activities}
        markers={markers}
      />
    </div>
  )
}
