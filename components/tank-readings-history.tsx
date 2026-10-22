'use client'

import { useState } from 'react'
import { ConfirmDialog } from './confirm-dialog'
import { Modal } from './modal'
import { TankReadingForm } from './tank-reading-form'

type TankOption = { id: string; name: string; site: string }

// recordedAt crosses the server/client boundary as a string: TankReading is
// a Date on the server, same pattern as ReportListItem in reports-list.tsx.
export type TankReadingListItem = {
  id: number
  tankId: string
  recordedAt: string
  levelPercent: number
  litresHarvested: number
  litresUsed: number
}

const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', { dateStyle: 'medium' })
const number = (value: number) => value.toLocaleString('en-US')

export function TankReadingsHistory({
  tank,
  tanks,
  readings,
  onClose,
  onChanged,
}: {
  tank: TankOption
  tanks: TankOption[]
  readings: TankReadingListItem[]
  onClose: () => void
  onChanged: () => void
}) {
  const [editing, setEditing] = useState<TankReadingListItem | null>(null)
  const [deleting, setDeleting] = useState<TankReadingListItem | null>(null)

  const sorted = [...readings].sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime())
  const nestedModalOpen = Boolean(editing || deleting)

  async function handleDelete() {
    if (!deleting) return
    const response = await fetch(`/api/tank-readings/${deleting.id}`, { method: 'DELETE' })
    setDeleting(null)
    if (response.ok) onChanged()
  }

  return (
    <>
      <Modal onClose={onClose} titleId="tank-readings-history-title" disableEscape={nestedModalOpen}>
        <div className="flex items-start justify-between gap-4">
          <h3 id="tank-readings-history-title" className="font-heading text-2xl">
            {tank.name} readings
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
          <p className="mt-4 text-sm text-muted-foreground">No readings logged for this tank yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-border text-sm">
            {sorted.map((reading) => (
              <li key={reading.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-medium">{formatDate(reading.recordedAt)}</p>
                  <p className="text-muted-foreground">
                    {reading.levelPercent}% full · Harvested {number(reading.litresHarvested)} L · Used{' '}
                    {number(reading.litresUsed)} L
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
        <TankReadingForm
          tanks={tanks}
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
          description="This removes it from the tank's history and from the 30-day totals."
          onConfirm={handleDelete}
          onClose={() => setDeleting(null)}
        />
      )}
    </>
  )
}
