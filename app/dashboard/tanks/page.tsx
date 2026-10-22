import { TanksPanel } from '@/components/dashboard/tanks-panel'
import { getDataStore } from '@/lib/data'
import { getStreamsOverview } from '@/lib/services/streams'

export const dynamic = 'force-dynamic'

export default async function DashboardTanksPage() {
  const overview = await getStreamsOverview(getDataStore())
  return <TanksPanel overview={overview} />
}
