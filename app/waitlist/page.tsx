import { WaitlistSection } from '@/components/waitlist-section'
import { getDataStore } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function WaitlistPage() {
  const count = await getDataStore().countWaitlistEntries()

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <header className="space-y-2">
        <h1 className="font-heading text-5xl">Join the programme</h1>
        <p className="max-w-2xl text-muted-foreground">
          A rainwater tank, a greywater unit, training, clean-ups, whatever fits where you are. Leave your
          details below and we&apos;ll reach out. Your name and phone number are kept private.
        </p>
      </header>

      <WaitlistSection initialCount={count} />
    </div>
  )
}
