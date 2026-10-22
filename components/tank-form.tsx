'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import type { Tank } from '@/lib/data/types'
import { Modal } from './modal'
import { useLocationPicker } from './use-location-picker'

// The map needs the browser, so it's loaded only on the client.
const LocationPicker = dynamic(() => import('./location-picker'), {
  ssr: false,
  loading: () => <div className="h-64 w-full animate-pulse rounded-md bg-muted" />,
})

const DEFAULT_POSITION = { latitude: -0.61, longitude: 30.65 }

export function TankForm({
  tank,
  onClose,
  onSaved,
}: {
  tank?: Tank
  onClose: () => void
  onSaved: (tank: Tank) => void
}) {
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const { position, setPosition, target, locating, locationMessage, useMyLocation } = useLocationPicker(
    tank ? { latitude: tank.latitude, longitude: tank.longitude } : DEFAULT_POSITION,
  )

  const editing = Boolean(tank)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)

    const data = new FormData(event.currentTarget)
    const number = (name: string) => Number(data.get(name) || 0)

    try {
      const response = await fetch(editing ? `/api/tanks/${tank!.id}` : '/api/tanks', {
        method: editing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          site: data.get('site'),
          latitude: position.latitude,
          longitude: position.longitude,
          capacityLitres: number('capacityLitres'),
          roofAreaM2: number('roofAreaM2'),
        }),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        setError(body?.error ?? 'Could not save the tank')
        return
      }

      const body = await response.json()
      onSaved(body.tank as Tank)
    } catch {
      setError('Could not reach the server. Check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = 'w-full rounded-md border border-input bg-background px-3 py-2 text-sm'

  return (
    <Modal onClose={onClose} titleId="tank-form-title">
      <div className="flex items-start justify-between gap-4">
        <h3 id="tank-form-title" className="font-heading text-2xl">
          {editing ? 'Edit tank' : 'Add a tank'}
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
              defaultValue={tank?.name}
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
              defaultValue={tank?.site}
              placeholder="e.g. Kakyeka"
              className={inputClass}
            />
          </label>

          <label className="block space-y-1 text-sm">
            <span className="font-medium">Capacity (litres, optional)</span>
            <input
              name="capacityLitres"
              type="number"
              min={0}
              defaultValue={tank?.capacityLitres || ''}
              placeholder="e.g. 2000"
              className={inputClass}
            />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Roof area (m², optional)</span>
            <input
              name="roofAreaM2"
              type="number"
              min={0}
              step="0.1"
              defaultValue={tank?.roofAreaM2 || ''}
              placeholder="e.g. 12.5"
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
          {submitting ? 'Saving…' : editing ? 'Save changes' : 'Save tank'}
        </button>
      </form>
    </Modal>
  )
}
