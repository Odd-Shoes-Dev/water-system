'use client'

import { useState } from 'react'
import { Modal } from './modal'

type TankOption = { id: string; name: string; site: string }
// Minimal shape, not the full TankReadingWithId: recordedAt crosses the
// server/client boundary as a string (see components/reports-list.tsx for
// the same pattern), and isn't edited here anyway.
type EditableReading = {
  id: number
  tankId: string
  levelPercent: number
  litresHarvested: number
  litresUsed: number
}

export function TankReadingForm({
  tanks,
  reading,
  onClose,
  onSaved,
}: {
  tanks: TankOption[]
  reading?: EditableReading
  onClose: () => void
  onSaved: () => void
}) {
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const editing = Boolean(reading)
  const editingTank = reading ? tanks.find((t) => t.id === reading.tankId) : null

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)

    const data = new FormData(event.currentTarget)
    const number = (name: string) => Number(data.get(name) || 0)

    try {
      const response = await fetch(editing ? `/api/tank-readings/${reading!.id}` : '/api/tank-readings', {
        method: editing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tankId: editing ? reading!.tankId : data.get('tankId'),
          levelPercent: number('levelPercent'),
          litresHarvested: number('litresHarvested'),
          litresUsed: number('litresUsed'),
        }),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        setError(body?.error ?? 'Could not save the reading')
        return
      }

      onSaved()
    } catch {
      setError('Could not reach the server. Check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = 'w-full rounded-md border border-input bg-background px-3 py-2 text-sm'

  return (
    <Modal onClose={onClose} titleId="tank-reading-form-title">
      <div className="flex items-start justify-between gap-4">
        <h3 id="tank-reading-form-title" className="font-heading text-2xl">
          {editing ? 'Edit tank reading' : 'Log a tank reading'}
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

      {!editing && tanks.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">Add a tank first, then come back to log a reading for it.</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {editing ? (
            <div className="text-sm">
              <span className="font-medium">Tank</span>
              <p className="mt-1 text-muted-foreground">
                {editingTank ? `${editingTank.name} · ${editingTank.site}` : reading!.tankId}
              </p>
            </div>
          ) : (
            <label className="block space-y-1 text-sm">
              <span className="font-medium">Tank</span>
              <select name="tankId" required defaultValue={tanks[0].id} className={inputClass}>
                {tanks.map((tank) => (
                  <option key={tank.id} value={tank.id}>
                    {tank.name} · {tank.site}
                  </option>
                ))}
              </select>
            </label>
          )}

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block space-y-1 text-sm">
              <span className="font-medium">Level (%)</span>
              <input
                name="levelPercent"
                type="number"
                min={0}
                max={100}
                step="0.1"
                defaultValue={reading?.levelPercent ?? 0}
                required
                className={inputClass}
              />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="font-medium">Harvested (L)</span>
              <input
                name="litresHarvested"
                type="number"
                min={0}
                step="0.1"
                defaultValue={reading?.litresHarvested ?? 0}
                required
                className={inputClass}
              />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="font-medium">Used (L)</span>
              <input
                name="litresUsed"
                type="number"
                min={0}
                step="0.1"
                defaultValue={reading?.litresUsed ?? 0}
                required
                className={inputClass}
              />
            </label>
          </div>

          <div aria-live="polite">
            {error && <p role="alert" className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            {submitting ? 'Saving…' : editing ? 'Save changes' : 'Save reading'}
          </button>
        </form>
      )}
    </Modal>
  )
}
