import { WaitlistPanel } from '@/components/dashboard/waitlist-panel'
import { getDataStore } from '@/lib/data'

export const dynamic = 'force-dynamic'

// Dashboard-only view of full waitlist entries, including contact details.
// The public /waitlist page only ever shows a count — see
// app/api/waitlist/route.ts and docs/known-issues.md.
export default async function DashboardWaitlistPage() {
  const entries = await getDataStore().listWaitlistEntries()
  return <WaitlistPanel entries={entries.map((e) => ({ ...e, createdAt: e.createdAt.toISOString() }))} />
}
