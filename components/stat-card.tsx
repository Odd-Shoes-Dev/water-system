import Link from 'next/link'

export function StatCard({
  label,
  value,
  unit,
  href,
}: {
  label: string
  value: string
  unit?: string
  // Optional: makes the card a link to where this figure is explained in detail.
  href?: string
}) {
  const content = (
    <>
      <p className="text-xs text-muted-foreground sm:text-sm">{label}</p>
      <p className="mt-2 font-body text-2xl font-medium tabular-nums tracking-tight sm:text-3xl lg:text-4xl">
        {value}
        {unit && <span className="ml-1 font-body text-sm text-muted-foreground sm:text-base">{unit}</span>}
      </p>
    </>
  )

  if (href) {
    return (
      <Link
        href={href}
        className="block rounded-lg border border-border bg-card p-3 transition-colors hover:border-accent sm:p-5"
      >
        {content}
      </Link>
    )
  }

  return <div className="rounded-lg border border-border bg-card p-3 sm:p-5">{content}</div>
}
