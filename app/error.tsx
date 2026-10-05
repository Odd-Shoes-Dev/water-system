'use client'

import { useEffect } from 'react'

// Shown when a page fails, for example if the database can't be reached.
// The technical detail is logged to the console and never shown to visitors.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="mx-auto max-w-md space-y-5 py-16 text-center" role="alert">
      <p className="text-sm uppercase tracking-[0.2em] text-accent">Something went wrong</p>
      <h1 className="font-heading text-5xl">We couldn&apos;t load this page.</h1>
      <p className="text-muted-foreground">
        The information may be temporarily unavailable. Please try again in a moment. If it keeps happening,
        let the team know.
      </p>
      <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Try again
        </button>
        <a
          href="/"
          className="rounded-full border border-border px-6 py-2.5 text-sm font-medium transition-colors hover:border-accent"
        >
          Go to home
        </a>
      </div>
      {error.digest && <p className="text-xs text-muted-foreground">Reference: {error.digest}</p>}
    </div>
  )
}
