import { Skeleton, SkeletonHeader } from '@/components/skeleton'

// Shown while reports load. Mirrors the form, the map and the report list.
export default function Loading() {
  return (
    <div className="space-y-10" aria-busy="true" aria-label="Loading reports and map">
      <SkeletonHeader />

      <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-4 rounded-lg border border-border bg-card p-5">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-11 w-full rounded-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-[420px] w-full" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>

      <section className="space-y-4">
        <Skeleton className="h-8 w-44" />
        <div className="divide-y divide-border rounded-lg border border-border bg-card">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-44" />
                <Skeleton className="h-3 w-64 max-w-full" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
