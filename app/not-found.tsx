import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md space-y-5 px-4 py-16 text-center">
      <p className="text-sm uppercase tracking-[0.2em] text-accent">Page not found</p>
      <h1 className="font-heading text-5xl">This page has run dry.</h1>
      <p className="text-muted-foreground">
        The link may be out of date, or the page may have moved. Try one of these instead.
      </p>
      <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row">
        <Link
          href="/"
          className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Go to home
        </Link>
        <Link
          href="/reports"
          className="rounded-full border border-border px-6 py-2.5 text-sm font-medium transition-colors hover:border-accent"
        >
          Reports &amp; map
        </Link>
      </div>
    </div>
  )
}
