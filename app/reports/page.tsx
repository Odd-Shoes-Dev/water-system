import { MapView } from '@/components/map-view'
import { ReportForm } from '@/components/report-form'
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
    <div className="space-y-10">
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
        <ul className="divide-y divide-border rounded-lg border border-border bg-card">
          {reports.map((report) => (
            <li key={report.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div className="flex items-center gap-3">
                {report.photoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element -- remote ImageKit URL, not a local asset
                  <img
                    src={report.photoUrl}
                    alt={`Photo submitted with the ${REPORT_CATEGORIES[report.category].toLowerCase()} report`}
                    className="h-14 w-14 shrink-0 rounded-md object-cover"
                  />
                )}
                <div>
                  <p className="font-medium">{REPORT_CATEGORIES[report.category]}</p>
                  <p className="text-sm text-muted-foreground">{report.locationDescription}</p>
                  {report.description && <p className="text-sm text-muted-foreground">{report.description}</p>}
                </div>
              </div>
              <span className="rounded-full bg-muted px-3 py-1 text-xs capitalize">{report.status}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
