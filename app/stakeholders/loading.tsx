import { Skeleton, SkeletonHeader } from '@/components/skeleton'

// Shown while stakeholders load. Mirrors the four quadrant boxes and the map.
export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-10" aria-busy="true" aria-label="Loading stakeholders">
      <SkeletonHeader />

      <section className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-lg border border-border bg-card p-5">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-[420px] w-full" />
      </section>
    </div>
  )
}
