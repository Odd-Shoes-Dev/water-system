export default function DashboardAlertsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-accent">Alerts</p>
        <h1 className="mt-2 font-heading text-4xl">No alerts yet</h1>
      </div>
      <div className="rounded-lg border border-border bg-card p-10 text-center">
        <p className="text-muted-foreground">
          This section will flag low or overflowing tanks, sensors that have stopped reporting, and new river
          reports as they come in.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Not built yet, see <code className="rounded bg-muted px-1.5 py-0.5">docs/known-issues.md</code>.
        </p>
      </div>
    </div>
  )
}
