import { Skeleton, SkeletonHeader } from '@/components/skeleton'

// Shown while the report form loads. Mirrors app/reports/page.tsx.
export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-10" aria-busy="true" aria-label="Loading report form">
      <SkeletonHeader />

      <div className="mx-auto max-w-xl space-y-4 rounded-lg border border-border bg-card p-5">
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
    </div>
  )
}
