'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { GreywaterSummary, StreamsOverview } from '@/lib/services/streams'
import { ConfirmDialog } from '../confirm-dialog'
import { GreywaterReadingForm } from '../greywater-reading-form'
import { GreywaterReadingsHistory, type ReadingListItem } from '../greywater-readings-history'
import { GreywaterUnitForm } from '../greywater-unit-form'

const number = (value: number) => value.toLocaleString('en-US')

export function RecyclingPanel({
  overview,
  readings,
}: {
  overview: StreamsOverview
  readings: ReadingListItem[]
}) {
  const router = useRouter()
  const [unitFormOpen, setUnitFormOpen] = useState(false)
  const [editing, setEditing] = useState<GreywaterSummary | null>(null)
  const [readingFormOpen, setReadingFormOpen] = useState(false)
  const [deleting, setDeleting] = useState<GreywaterSummary | null>(null)
  const [viewingUnit, setViewingUnit] = useState<GreywaterSummary | null>(null)

  function openEdit(unit: GreywaterSummary) {
    setEditing(unit)
    setUnitFormOpen(true)
  }

  function openAdd() {
    setEditing(null)
    setUnitFormOpen(true)
  }

  async function handleDelete() {
    if (!deleting) return
    const response = await fetch(`/api/greywater-units/${deleting.id}`, { method: 'DELETE' })
    setDeleting(null)
    if (response.ok) router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-accent">Recycling</p>
          <h1 className="mt-2 font-heading text-4xl">Greywater</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setReadingFormOpen(true)}
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            + Log reading
          </button>
          <button
            type="button"
            onClick={openAdd}
            className="rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-accent"
          >
            + Add system
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {overview.greywater.length === 0 && (
          <p className="text-sm text-muted-foreground">No greywater systems yet. Add one to get started.</p>
        )}
        {overview.greywater.map((unit) => (
          <div key={unit.id} className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-medium">{unit.name}</h3>
                <p className="text-sm text-muted-foreground">{unit.site}</p>
              </div>
              <StatusBadge status={unit.status} />
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Reused (30 days)</dt>
                <dd className="font-medium">{number(unit.reusedLast30Days)} litres</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Filter pressure</dt>
                <dd className="font-medium">
                  {unit.latestPressureKpa === null ? '—' : `${unit.latestPressureKpa} kPa`}
                </dd>
              </div>
            </dl>
            <div className="mt-4 flex gap-3 text-sm">
              <button type="button" onClick={() => setViewingUnit(unit)} className="text-accent hover:underline">
                View readings
              </button>
              <button type="button" onClick={() => openEdit(unit)} className="text-accent hover:underline">
                Edit
              </button>
              <button type="button" onClick={() => setDeleting(unit)} className="text-destructive hover:underline">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {readingFormOpen && (
        <GreywaterReadingForm
          units={overview.greywater}
          onClose={() => setReadingFormOpen(false)}
          onSaved={() => {
            setReadingFormOpen(false)
            router.refresh()
          }}
        />
      )}

      {unitFormOpen && (
        <GreywaterUnitForm
          unit={editing ?? undefined}
          onClose={() => setUnitFormOpen(false)}
          onSaved={() => {
            setUnitFormOpen(false)
            router.refresh()
          }}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title={`Delete "${deleting.name}"?`}
          description="This hides it from the dashboard. Its reading history is kept."
          onConfirm={handleDelete}
          onClose={() => setDeleting(null)}
        />
      )}

      {viewingUnit && (
        <GreywaterReadingsHistory
          unit={viewingUnit}
          units={overview.greywater}
          readings={readings.filter((r) => r.unitId === viewingUnit.id)}
          onClose={() => setViewingUnit(null)}
          onChanged={() => router.refresh()}
        />
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    ok: 'bg-success/15 text-success',
    filter_due: 'bg-warning/15 text-warning',
    fault: 'bg-destructive/15 text-destructive',
  }
  const labels: Record<string, string> = { ok: 'OK', filter_due: 'Filter due', fault: 'Fault' }
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles[status] ?? ''}`}>
      {labels[status] ?? status}
    </span>
  )
}
