// Placeholder block shown while a page's data loads. Matches the theme's muted
// color and rounded corners so the page doesn't jump when the content arrives.
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-muted motion-reduce:animate-none ${className}`} />
}

// Common page header: title and intro line.
export function SkeletonHeader() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-12 w-72 max-w-full" />
      <Skeleton className="h-4 w-full max-w-xl" />
      <Skeleton className="h-4 w-2/3 max-w-md" />
    </div>
  )
}
