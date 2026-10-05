import { Skeleton } from '@/components/skeleton'

// Shown while the home page loads. Mirrors the impact cards and link cards.
export default function Loading() {
  return (
    <div className="space-y-10" aria-busy="true" aria-label="Loading impact figures">
      <section className="space-y-3">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-12 w-full max-w-xl" />
        <Skeleton className="h-12 w-2/3 max-w-md" />
        <Skeleton className="h-4 w-full max-w-2xl" />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-5">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="mt-4 h-10 w-28" />
          </div>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-card p-5">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="mt-3 h-4 w-full" />
          </div>
        ))}
      </section>
    </div>
  )
}
