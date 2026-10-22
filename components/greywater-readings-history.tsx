'use client'

import { useState } from 'react'
import { ConfirmDialog } from './confirm-dialog'
import { GreywaterReadingForm } from './greywater-reading-form'
import { Modal } from './modal'

type UnitOption = { id: string; name: string; site: string }

// recordedAt crosses the server/client boundary as a string: GreywaterReading
// is a Date on the server, same pattern as ReportListItem in reports-list.tsx.
export type ReadingListItem = {
  id: number
  unitId: string
  recordedAt: string
  litresCollected: number
  litresFiltered: number
  litresReused: number
}

const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', { dateStyle: 'medium' })
const number = (value: number) => value.toLocaleString('en-US')

export function GreywaterReadingsHistory({
  unit,
  units,
  readings,
  onClose,
  onChanged,
}: {
  unit: UnitOption
  units: UnitOption[]
  readings: ReadingListItem[]
  onClose: () => void
  onChanged: () => void
}) {
  const [editing, setEditing] = useState<ReadingListItem | null>(null)
  const [deleting, setDeleting] = useState<ReadingListItem | null>(null)

  const sorted = [...readings].sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime())
  const nestedModalOpen = Boolean(editing || deleting)

  async function handleDelete() {
    if (!deleting) return
    const response = await fetch(`/api/greywater-readings/${deleting.id}`, { method: 'DELETE' })
    setDeleting(null)
    if (response.ok) onChanged()
  }

  return (
    <>
      <Modal onClose={onClose} titleId="readings-history-title" disableEscape={nestedModalOpen}>
        <div className="flex items-start justify-between gap-4">
          <h3 id="readings-history-title" className="font-heading text-2xl">
            {unit.name} readings
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-full p-1 text-xl leading-none text-muted-foreground transition-colors hover:text-foreground"
          >
            ×
          </button>
        </div>

        {sorted.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No readings logged for this system yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-border text-sm">
            {sorted.map((reading) => (
              <li key={reading.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-medium">{formatDate(reading.recordedAt)}</p>
                  <p className="text-muted-foreground">
                    Collected {number(reading.litresCollected)} L · Filtered {number(reading.litresFiltered)} L ·
                    Reused {number(reading.litresReused)} L
                  </p>
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setEditing(reading)} className="text-accent hover:underline">
                    Edit
                  </button>
                  <button type="button" onClick={() => setDeleting(reading)} className="text-destructive hover:underline">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Modal>

      {editing && (
        <GreywaterReadingForm
          units={units}
          reading={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null)
            onChanged()
          }}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete this reading?"
          description="This removes it from the system's history and from the 30-day totals."
          onConfirm={handleDelete}
          onClose={() => setDeleting(null)}
        />
      )}
    </>
  )
}
