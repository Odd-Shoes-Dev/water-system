import Link from 'next/link'
import { StatCard } from '@/components/stat-card'
import { getDataStore } from '@/lib/data'
import { getImpactSummary } from '@/lib/services/impact'

export const dynamic = 'force-dynamic'

const number = (value: number) => value.toLocaleString('en-US')

export default async function HomePage() {
  const impact = await getImpactSummary(getDataStore())

  return (
    <div className="space-y-10">
      <section className="space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-accent">Rain &amp; Renew impact</p>
        <h1 className="font-heading text-5xl leading-tight">
          Know every drop, <em>before</em> it runs out.
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Live tank levels, greywater reuse, river reports and community activity, all calculated from the data
          our sensors and youth send in.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="💧 Rainwater harvested" value={number(impact.rainwaterHarvestedL)} unit="litres" />
        <StatCard label="♻️ Greywater recycled" value={number(impact.greywaterRecycledL)} unit="litres" />
        <StatCard label="🚰 Water reused" value={number(impact.waterReusedL)} unit="litres" />
        <StatCard label="🌱 Trees / gardens supported" value={number(impact.treesGardensSupported)} />
        <StatCard label="🌊 Pollution reports" value={number(impact.pollutionReports)} />
        <StatCard label="🧹 Clean-ups conducted" value={number(impact.cleanUpsConducted)} />
        <StatCard label="👥 Youth engaged" value={number(impact.youthEngaged)} />
        <StatCard label="🏠 Households reached" value={number(impact.householdsReached)} />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Link href="/streams" className="rounded-lg border border-border bg-card p-5 transition-colors hover:border-accent">
          <h2 className="font-heading text-2xl">Data streams</h2>
          <p className="mt-1 text-sm text-muted-foreground">Rainwater, greywater, river and community data.</p>
        </Link>
        <Link href="/reports" className="rounded-lg border border-border bg-card p-5 transition-colors hover:border-accent">
          <h2 className="font-heading text-2xl">Reports &amp; map</h2>
          <p className="mt-1 text-sm text-muted-foreground">Youth report issues along the river and see them on the map.</p>
        </Link>
        <Link href="/stakeholders" className="rounded-lg border border-border bg-card p-5 transition-colors hover:border-accent">
          <h2 className="font-heading text-2xl">Stakeholders</h2>
          <p className="mt-1 text-sm text-muted-foreground">Influence and interest matrix, with locations.</p>
        </Link>
      </section>
    </div>
  )
}
