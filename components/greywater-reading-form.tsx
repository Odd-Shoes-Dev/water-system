'use client'

import { useState } from 'react'
import { Modal } from './modal'

type UnitOption = { id: string; name: string; site: string }
// Minimal shape, not the full GreywaterReadingWithId: recordedAt crosses the
// server/client boundary as a string (see components/reports-list.tsx for
// the same pattern), and isn't edited here anyway.
type EditableReading = {
  id: number
  unitId: string
  litresCollected: number
  litresFiltered: number
  litresReused: number
}

export function GreywaterReadingForm({
  units,
  reading,
  onClose,
  onSaved,
}: {
  units: UnitOption[]
  reading?: EditableReading
  onClose: () => void
  onSaved: () => void
}) {
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const editing = Boolean(reading)
  const editingUnit = reading ? units.find((u) => u.id === reading.unitId) : null

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)

    const data = new FormData(event.currentTarget)
    const number = (name: string) => Number(data.get(name) || 0)

    try {
      const response = await fetch(editing ? `/api/greywater-readings/${reading!.id}` : '/api/greywater-readings', {
        method: editing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unitId: editing ? reading!.unitId : data.get('unitId'),
          litresCollected: number('litresCollected'),
          litresFiltered: number('litresFiltered'),
          litresReused: number('litresReused'),
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
    <Modal onClose={onClose} titleId="greywater-reading-form-title">
      <div className="flex items-start justify-between gap-4">
        <h3 id="greywater-reading-form-title" className="font-heading text-2xl">
          {editing ? 'Edit greywater reading' : 'Log a greywater reading'}
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

      {!editing && units.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          Add a greywater system first, then come back to log a reading for it.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {editing ? (
            <div className="text-sm">
              <span className="font-medium">System</span>
              <p className="mt-1 text-muted-foreground">
                {editingUnit ? `${editingUnit.name} · ${editingUnit.site}` : reading!.unitId}
              </p>
            </div>
          ) : (
            <label className="block space-y-1 text-sm">
              <span className="font-medium">System</span>
              <select name="unitId" required defaultValue={units[0].id} className={inputClass}>
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name} · {unit.site}
                  </option>
                ))}
              </select>
            </label>
          )}

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block space-y-1 text-sm">
              <span className="font-medium">Collected (L)</span>
              <input
                name="litresCollected"
                type="number"
                min={0}
                step="0.1"
                defaultValue={reading?.litresCollected ?? 0}
                required
                className={inputClass}
              />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="font-medium">Filtered (L)</span>
              <input
                name="litresFiltered"
                type="number"
                min={0}
                step="0.1"
                defaultValue={reading?.litresFiltered ?? 0}
                required
                className={inputClass}
              />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="font-medium">Reused (L)</span>
              <input
                name="litresReused"
                type="number"
                min={0}
                step="0.1"
                defaultValue={reading?.litresReused ?? 0}
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
