import { RecyclingPanel } from '@/components/dashboard/recycling-panel'
import { getDataStore } from '@/lib/data'
import { getStreamsOverview } from '@/lib/services/streams'

export const dynamic = 'force-dynamic'

export default async function DashboardRecyclingPage() {
  const store = getDataStore()
  const [overview, readings] = await Promise.all([getStreamsOverview(store), store.listGreywaterReadings()])

  return (
    <RecyclingPanel
      overview={overview}
      readings={readings.map((r) => ({ ...r, recordedAt: r.recordedAt.toISOString() }))}
    />
  )
}
