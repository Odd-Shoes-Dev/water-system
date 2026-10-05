export function StatCard({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 font-heading text-4xl">
        {value}
        {unit && <span className="ml-1 font-body text-base text-muted-foreground">{unit}</span>}
      </p>
    </div>
  )
}
