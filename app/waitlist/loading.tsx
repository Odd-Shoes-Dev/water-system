import { Skeleton, SkeletonHeader } from '@/components/skeleton'

// Shown while the waitlist page loads. Mirrors the count line and the form.
export default function Loading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading the waitlist">
      <SkeletonHeader />
      <Skeleton className="h-4 w-48" />
      <div className="max-w-xl space-y-3 rounded-lg border border-border bg-card p-5">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-11 w-full rounded-full" />
      </div>
    </div>
  )
}
