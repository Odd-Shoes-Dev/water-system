import { MapView } from '@/components/map-view'
import { getDataStore } from '@/lib/data'
import { getStreamsOverview } from '@/lib/services/streams'

export const dynamic = 'force-dynamic'

function levelColor(percent: number | null) {
  if (percent === null) return 'hsl(210 15% 55%)'
  if (percent < 20) return 'hsl(356 72% 52%)'
  if (percent < 50) return 'hsl(32 90% 50%)'
  return 'hsl(158 55% 38%)'
}

export default async function DashboardMapPage() {
  const store = getDataStore()
  const [tanks, overview] = await Promise.all([store.listTanks(), getStreamsOverview(store)])
  const levelByTankId = new Map(overview.tanks.map((t) => [t.id, t.latestLevelPercent]))

  const markers = tanks.map((tank) => {
    const level = levelByTankId.get(tank.id) ?? null
    return {
      id: tank.id,
      latitude: tank.latitude,
      longitude: tank.longitude,
      title: tank.name,
      subtitle: `${tank.site} · ${level === null ? 'no reading' : `${level}%`}`,
      color: levelColor(level),
    }
  })

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-accent">Map</p>
        <h1 className="mt-2 font-heading text-4xl">Every site, one map</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Every installed tank, colored by level: green is healthy, amber is getting low, red needs attention,
          gray means no reading yet.
        </p>
      </div>
      <MapView markers={markers} center={[1.2, 31.5]} zoom={6} heightClassName="h-[520px]" />
    </div>
  )
}
