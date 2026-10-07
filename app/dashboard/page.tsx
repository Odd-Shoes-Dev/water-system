import Link from 'next/link'
import { getDataStore } from '@/lib/data'
import { getImpactSummary } from '@/lib/services/impact'
import { getStreamsOverview } from '@/lib/services/streams'

export const dynamic = 'force-dynamic'

const number = (value: number) => value.toLocaleString('en-US')

export default async function DashboardOverviewPage() {
  const store = getDataStore()
  const [overview, impact] = await Promise.all([getStreamsOverview(store), getImpactSummary(store)])

  const tanksWithReadings = overview.tanks.filter((t) => t.latestLevelPercent !== null)
  const averageLevel = tanksWithReadings.length
    ? Math.round(tanksWithReadings.reduce((sum, t) => sum + (t.latestLevelPercent ?? 0), 0) / tanksWithReadings.length)
    : null
  const waterAvailableL = Math.round(
    overview.tanks.reduce((sum, t) => sum + ((t.latestLevelPercent ?? 0) / 100) * t.capacityLitres, 0),
  )
  const lowestTanks = [...tanksWithReadings]
    .sort((a, b) => (a.latestLevelPercent ?? 0) - (b.latestLevelPercent ?? 0))
    .slice(0, 5)

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-accent">Overview</p>
        <h1 className="mt-2 font-heading text-5xl">Welcome back</h1>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <DashboardStat label="Installed tanks" value={number(overview.tanks.length)} />
        <DashboardStat label="Average level" value={averageLevel === null ? '—' : String(averageLevel)} unit={averageLevel === null ? undefined : '%'} />
        <DashboardStat label="Water available" value={number(waterAvailableL)} unit="L" />
        <DashboardStat label="Greywater recycled" value={number(impact.greywaterRecycledL)} unit="L" />
        <DashboardStat label="Open alerts" value="—" caption="Coming soon" />
        <DashboardStat label="Sensors offline" value="—" caption="Coming soon" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-2xl">Lowest tanks</h2>
            <Link href="/dashboard/tanks" className="text-sm text-accent hover:underline">
              All tanks
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-border text-sm">
            {lowestTanks.length === 0 && <li className="py-3 text-muted-foreground">No tanks yet.</li>}
            {lowestTanks.map((tank) => (
              <li key={tank.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">{tank.name}</p>
                  <p className="text-muted-foreground">{tank.site}</p>
                </div>
                <span className="font-body font-medium tabular-nums">{tank.latestLevelPercent}%</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="font-heading text-2xl">Open alerts</h2>
          <p className="mt-4 text-sm text-muted-foreground">
            No alerts yet. This will show water level alerts, rainfall warnings and new report notifications
            once built.
          </p>
        </div>
      </div>
    </div>
  )
}

function DashboardStat({
  label,
  value,
  unit,
  caption,
}: {
  label: string
  value: string
  unit?: string
  caption?: string
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 font-body text-3xl font-medium tabular-nums">
        {value}
        {unit && <span className="ml-1 text-base text-muted-foreground">{unit}</span>}
      </p>
      {caption && <p className="mt-1 text-xs text-muted-foreground">{caption}</p>}
    </div>
  )
}
