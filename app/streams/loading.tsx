import { Skeleton, SkeletonHeader } from '@/components/skeleton'

// Shown while the data streams load. Mirrors the tank table, greywater cards,
// river counts and community figures.
export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-10" aria-busy="true" aria-label="Loading data streams">
      <SkeletonHeader />

      <section className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-3 rounded-lg border border-border bg-card p-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="grid grid-cols-3 gap-4 sm:grid-cols-6">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="hidden h-5 w-full sm:block" />
              <Skeleton className="hidden h-5 w-full sm:block" />
              <Skeleton className="hidden h-5 w-full sm:block" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-border bg-card p-3 sm:p-4">
              <Skeleton className="h-4 w-28 sm:w-40" />
              <Skeleton className="mt-2 h-7 w-20 sm:h-8 sm:w-24" />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-border bg-card p-5">
              <Skeleton className="h-5 w-56" />
              <Skeleton className="mt-2 h-4 w-24" />
              <Skeleton className="mt-4 h-4 w-full" />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <Skeleton className="h-8 w-44" />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <Skeleton className="h-8 w-44" />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <Skeleton className="h-32 w-full" />
      </section>
    </div>
  )
}
