import { TanksPanel } from '@/components/dashboard/tanks-panel'
import { getDataStore } from '@/lib/data'
import { getStreamsOverview } from '@/lib/services/streams'

export const dynamic = 'force-dynamic'

export default async function DashboardTanksPage() {
  const store = getDataStore()
  const [overview, readings] = await Promise.all([getStreamsOverview(store), store.listTankReadings()])

  return (
    <TanksPanel
      overview={overview}
      readings={readings.map((r) => ({ ...r, recordedAt: r.recordedAt.toISOString() }))}
    />
  )
}
