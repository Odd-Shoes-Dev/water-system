'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import type { GreywaterUnit } from '@/lib/data/types'
import { Modal } from './modal'
import { useLocationPicker } from './use-location-picker'

const LocationPicker = dynamic(() => import('./location-picker'), {
  ssr: false,
  loading: () => <div className="h-64 w-full animate-pulse rounded-md bg-muted" />,
})

const DEFAULT_POSITION = { latitude: -0.61, longitude: 30.65 }

export function GreywaterUnitForm({
  unit,
  onClose,
  onSaved,
}: {
  unit?: GreywaterUnit
  onClose: () => void
  onSaved: (unit: GreywaterUnit) => void
}) {
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const { position, setPosition, target, locating, locationMessage, useMyLocation } = useLocationPicker(
    unit ? { latitude: unit.latitude, longitude: unit.longitude } : DEFAULT_POSITION,
  )

  const editing = Boolean(unit)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)

    const data = new FormData(event.currentTarget)

    try {
      const response = await fetch(editing ? `/api/greywater-units/${unit!.id}` : '/api/greywater-units', {
        method: editing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          site: data.get('site'),
          latitude: position.latitude,
          longitude: position.longitude,
        }),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        setError(body?.error ?? 'Could not save the system')
        return
      }

      const body = await response.json()
      onSaved(body.unit as GreywaterUnit)
    } catch {
      setError('Could not reach the server. Check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = 'w-full rounded-md border border-input bg-background px-3 py-2 text-sm'

  return (
    <Modal onClose={onClose} titleId="greywater-unit-form-title">
      <div className="flex items-start justify-between gap-4">
        <h3 id="greywater-unit-form-title" className="font-heading text-2xl">
          {editing ? 'Edit greywater system' : 'Add a greywater system'}
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

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Name</span>
            <input
              name="name"
              required
              minLength={2}
              maxLength={100}
              defaultValue={unit?.name}
              placeholder="e.g. Kakyeka Primary"
              className={inputClass}
            />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Site</span>
            <input
              name="site"
              required
              minLength={2}
              maxLength={100}
              defaultValue={unit?.site}
              placeholder="e.g. Kakyeka"
              className={inputClass}
            />
          </label>
        </div>

        <fieldset className="space-y-3">
          <legend className="mb-1 text-sm font-medium">Where is it?</legend>

          <button
            type="button"
            onClick={useMyLocation}
            disabled={locating}
            className="w-full rounded-full border border-accent px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/10 disabled:opacity-60"
          >
            {locating ? 'Finding you…' : '📍 Use my location'}
          </button>

          <LocationPicker value={position} target={target} onChange={setPosition} />

          <p className="text-xs text-muted-foreground">
            Move the map so the pin is on the spot. Pin: {position.latitude.toFixed(5)}, {position.longitude.toFixed(5)}
          </p>
          {locationMessage && <p className="text-sm text-muted-foreground">{locationMessage}</p>}
        </fieldset>

        <div aria-live="polite">
          {error && <p role="alert" className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
        >
          {submitting ? 'Saving…' : editing ? 'Save changes' : 'Save system'}
        </button>
      </form>
    </Modal>
  )
}
