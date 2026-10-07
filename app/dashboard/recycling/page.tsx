import { getDataStore } from '@/lib/data'
import { getStreamsOverview } from '@/lib/services/streams'

export const dynamic = 'force-dynamic'

const number = (value: number) => value.toLocaleString('en-US')

export default async function DashboardRecyclingPage() {
  const overview = await getStreamsOverview(getDataStore())

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-accent">Recycling</p>
        <h1 className="mt-2 font-heading text-4xl">Greywater</h1>
      </div>

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
