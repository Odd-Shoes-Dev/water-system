import { ReportForm } from '@/components/report-form'

export default function ReportsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-10">
      <header className="space-y-2">
        <h1 className="font-heading text-5xl">Reports &amp; map</h1>
        <p className="max-w-2xl text-muted-foreground">
          Youth report illegal dumping, pollution, blocked drainage and riverbank damage, and log clean-ups and
          restoration. Reports appear on the map as they come in.
        </p>
      </header>

      <div className="mx-auto max-w-xl">
        <ReportForm />
      </div>
    </div>
  )
}
