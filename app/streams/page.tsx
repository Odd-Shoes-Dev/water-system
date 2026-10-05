import { getDataStore } from '@/lib/data'
import { getStreamsOverview } from '@/lib/services/streams'

export const dynamic = 'force-dynamic'

const number = (value: number) => value.toLocaleString('en-US')

export default async function StreamsPage() {
  const overview = await getStreamsOverview(getDataStore())

  return (
    <div className="space-y-12">
      <header className="space-y-2">
        <h1 className="font-heading text-5xl">Data streams</h1>
        <p className="max-w-2xl text-muted-foreground">
          Four streams feed the impact figures: rainwater, greywater, the River Rwizi and community activity.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="font-heading text-3xl">1. Rainwater</h2>
        <div className="overflow-x-auto rounded-lg border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Tank</th>
                <th className="px-4 py-3 font-medium">Site</th>
                <th className="px-4 py-3 font-medium">Capacity</th>
                <th className="px-4 py-3 font-medium">Level now</th>
                <th className="px-4 py-3 font-medium">Harvested (30 days)</th>
                <th className="px-4 py-3 font-medium">Used (30 days)</th>
              </tr>
            </thead>
            <tbody>
              {overview.tanks.map((tank) => (
                <tr key={tank.id} className="border-t border-border">
                  <td className="px-4 py-3">{tank.name}</td>
                  <td className="px-4 py-3">{tank.site}</td>
                  <td className="px-4 py-3">{number(tank.capacityLitres)} litres</td>
                  <td className="px-4 py-3">
                    <LevelBar percent={tank.latestLevelPercent} />
                  </td>
                  <td className="px-4 py-3">{number(tank.harvestedLast30Days)} litres</td>
                  <td className="px-4 py-3">{number(tank.usedLast30Days)} litres</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {overview.rainfall.map((r) => (
            <div key={r.site} className="rounded-lg border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">Rainfall, last 7 days · {r.site}</p>
              <p className="mt-1 font-body text-3xl font-medium tabular-nums">{r.last7DaysMm} mm</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-3xl">2. Greywater</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {overview.greywater.map((unit) => (
            <div key={unit.id} className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-medium">{unit.name}</h3>
                  <p className="text-sm text-muted-foreground">{unit.site}</p>
                </div>
                <StatusBadge status={unit.status} />
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Reused (30 days)</dt>
                  <dd className="font-medium">{number(unit.reusedLast30Days)} litres</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Filter pressure</dt>
                  <dd className="font-medium">
                    {unit.latestPressureKpa === null ? '—' : `${unit.latestPressureKpa} kPa`}
                  </dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-3xl">3. River Rwizi</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {overview.reportCounts.map((item) => (
            <div key={item.category} className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
              <span className="text-sm">{item.label}</span>
              <span className="font-body text-xl font-medium tabular-nums">{item.count}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-3xl">4. Community</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Youth trained</p>
            <p className="mt-1 font-body text-3xl font-medium tabular-nums">{number(overview.activityCounts.youthTrained)}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Clean-ups completed</p>
            <p className="mt-1 font-body text-3xl font-medium tabular-nums">{overview.activityCounts.clean_ups}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <p className="text-sm text-muted-foreground">Trees planted</p>
            <p className="mt-1 font-body text-3xl font-medium tabular-nums">{number(overview.activityCounts.trees)}</p>
          </div>
        </div>
      </section>
    </div>
  )
}

function LevelBar({ percent }: { percent: number | null }) {
  if (percent === null) return <span className="text-muted-foreground">No reading</span>
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-28 overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-accent" style={{ width: `${percent}%` }} />
      </div>
      <span>{percent}%</span>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    ok: 'bg-success/15 text-success',
    filter_due: 'bg-warning/15 text-warning',
    fault: 'bg-destructive/15 text-destructive',
  }
  const labels: Record<string, string> = { ok: 'OK', filter_due: 'Filter due', fault: 'Fault' }
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles[status] ?? ''}`}>
      {labels[status] ?? status}
    </span>
  )
}
