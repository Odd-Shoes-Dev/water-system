export function StatCard({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3 sm:p-5">
      <p className="text-xs text-muted-foreground sm:text-sm">{label}</p>
      <p className="mt-2 font-body text-2xl font-medium tabular-nums tracking-tight sm:text-3xl lg:text-4xl">
        {value}
        {unit && <span className="ml-1 font-body text-sm text-muted-foreground sm:text-base">{unit}</span>}
      </p>
    </div>
  )
}
