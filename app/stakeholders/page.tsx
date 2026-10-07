import { MapView } from '@/components/map-view'
import { getDataStore } from '@/lib/data'
import { groupByQuadrant, QUADRANT_LABELS, type Quadrant } from '@/lib/services/stakeholders'

export const dynamic = 'force-dynamic'

const quadrantOrder: Quadrant[] = ['manage_closely', 'keep_satisfied', 'keep_informed', 'monitor']

export default async function StakeholdersPage() {
  const stakeholders = await getDataStore().listStakeholders()
  const groups = groupByQuadrant(stakeholders)

  const markers = stakeholders
    .filter((s) => s.latitude !== null && s.longitude !== null)
    .map((s) => ({
      id: s.id,
      latitude: s.latitude as number,
      longitude: s.longitude as number,
      title: s.name,
      subtitle: `${s.role} · influence ${s.influence}, interest ${s.interest}`,
    }))

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-10">
      <header className="space-y-2">
        <h1 className="font-heading text-5xl">Stakeholders</h1>
        <p className="max-w-2xl text-muted-foreground">
          Who has the most influence over the programme and who is most interested in it, so engagement can be
          planned for each group.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {quadrantOrder.map((quadrant) => (
          <div key={quadrant} className="rounded-lg border border-border bg-card p-5">
            <h2 className="font-heading text-2xl">{QUADRANT_LABELS[quadrant]}</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {groups[quadrant].length === 0 && <li className="text-muted-foreground">None yet</li>}
              {groups[quadrant].map((s) => (
                <li key={s.id}>
                  <span className="font-medium">{s.name}</span>
                  <span className="text-muted-foreground"> · {s.role}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="font-heading text-3xl">Where they are</h2>
        <MapView markers={markers} center={[1.2, 31.5]} zoom={6} />
        <p className="text-sm text-muted-foreground">
          Stakeholders without a location (for example, funders) are listed in the matrix above only.
        </p>
      </section>
    </div>
  )
}
