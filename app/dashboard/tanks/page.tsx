import { getDataStore } from '@/lib/data'
import { getStreamsOverview } from '@/lib/services/streams'

export const dynamic = 'force-dynamic'

const number = (value: number) => value.toLocaleString('en-US')

export default async function DashboardTanksPage() {
  const overview = await getStreamsOverview(getDataStore())

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-accent">Tanks</p>
        <h1 className="mt-2 font-heading text-4xl">Rainwater tanks</h1>
      </div>

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

      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3">
        {overview.rainfall.map((r) => (
          <div key={r.site} className="rounded-lg border border-border bg-card p-3 sm:p-4">
            <p className="text-xs text-muted-foreground sm:text-sm">Rainfall, last 7 days · {r.site}</p>
            <p className="mt-1 font-body text-2xl font-medium tabular-nums sm:text-3xl">{r.last7DaysMm} mm</p>
          </div>
        ))}
      </div>
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
