import { StatCard } from '@/components/stat-card'
import { getDataStore } from '@/lib/data'
import { getImpactSummary } from '@/lib/services/impact'

export const dynamic = 'force-dynamic'

const number = (value: number) => value.toLocaleString('en-US')

// This is the old home-page dashboard, moved here when the home page became
// a public marketing landing page. Same figures, same calculation.
export default async function DashboardImpactPage() {
  const impact = await getImpactSummary(getDataStore())

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-accent">Impact</p>
        <h1 className="mt-2 font-heading text-4xl">Programme impact</h1>
        <p className="mt-1 text-sm text-muted-foreground">Calculated from stored data, not estimates.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard label="💧 Rainwater harvested" value={number(impact.rainwaterHarvestedL)} unit="litres" />
        <StatCard label="♻️ Greywater recycled" value={number(impact.greywaterRecycledL)} unit="litres" />
        <StatCard label="🚰 Water reused" value={number(impact.waterReusedL)} unit="litres" />
        <StatCard label="🌱 Trees / gardens supported" value={number(impact.treesGardensSupported)} />
        <StatCard label="🌊 Pollution reports" value={number(impact.pollutionReports)} />
        <StatCard label="🧹 Clean-ups conducted" value={number(impact.cleanUpsConducted)} />
        <StatCard label="👥 Youth engaged" value={number(impact.youthEngaged)} />
        <StatCard label="🏠 Households reached" value={number(impact.householdsReached)} />
      </div>
    </div>
  )
}
