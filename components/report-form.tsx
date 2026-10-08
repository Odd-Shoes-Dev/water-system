'use client'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { MAX_REPORT_PHOTOS, REPORT_CATEGORIES } from '@/lib/data/types'
import type { Position } from './location-picker'

// The map needs the browser, so it's loaded only on the client.
const LocationPicker = dynamic(() => import('./location-picker'), {
  ssr: false,
  loading: () => <div className="h-64 w-full animate-pulse rounded-md bg-muted" />,
})

const DEFAULT_POSITION: Position = { latitude: -0.61, longitude: 30.65 }
const round = (n: number) => Math.round(n * 1e6) / 1e6

type PhotoSlot = { id: string; file: File; preview: string }

export function ReportForm({ embedded = false }: { embedded?: boolean } = {}) {
  const router = useRouter()
  const [position, setPosition] = useState<Position>(DEFAULT_POSITION)
  const [target, setTarget] = useState<(Position & { nonce: number }) | null>(null)
  const [locating, setLocating] = useState(false)
  const [locationMessage, setLocationMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [photos, setPhotos] = useState<PhotoSlot[]>([])
  const [photoError, setPhotoError] = useState<string | null>(null)
  const [uploadingPhotos, setUploadingPhotos] = useState(false)
  const statusRef = useRef<HTMLDivElement>(null)
  const photoInputRef = useRef<HTMLInputElement>(null)

  // The button is at the bottom of a long form, so bring the result into view.
  useEffect(() => {
    if (error || success) {
      statusRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [error, success])

  function addPhotos(event: React.ChangeEvent<HTMLInputElement>) {
    const chosen = Array.from(event.target.files ?? [])
    event.target.value = '' // lets the same file be picked again later if removed
    if (chosen.length === 0) return

    setPhotoError(null)
    setPhotos((current) => {
      const room = MAX_REPORT_PHOTOS - current.length
      if (room <= 0) {
        setPhotoError(`You can attach up to ${MAX_REPORT_PHOTOS} photos.`)
        return current
      }
      const accepted = chosen.slice(0, room)
      if (chosen.length > accepted.length) {
        setPhotoError(`Only ${room} more photo${room === 1 ? '' : 's'} could be added (maximum ${MAX_REPORT_PHOTOS}).`)
      }
      const added = accepted.map((file) => ({ id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`, file, preview: URL.createObjectURL(file) }))
      return [...current, ...added]
    })
  }

  function removePhoto(id: string) {
    setPhotos((current) => {
      const target = current.find((p) => p.id === id)
      if (target) URL.revokeObjectURL(target.preview)
      return current.filter((p) => p.id !== id)
    })
  }

  function clearPhotos() {
    setPhotos((current) => {
      current.forEach((p) => URL.revokeObjectURL(p.preview))
      return []
    })
    setPhotoError(null)
    if (photoInputRef.current) photoInputRef.current.value = ''
  }

  function useMyLocation() {
    setLocationMessage(null)
    if (!navigator.geolocation) {
      setLocationMessage('This browser cannot find your location. Move the map to your spot instead.')
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (result) => {
        const found = { latitude: round(result.coords.latitude), longitude: round(result.coords.longitude) }
        setPosition(found)
        setTarget({ ...found, nonce: Date.now() })
        setLocating(false)
        setLocationMessage(
          `Found you, accurate to about ${Math.round(result.coords.accuracy)} m. Drag the map to put the pin on the exact spot.`,
        )
      },
      (failure) => {
        setLocating(false)
        setLocationMessage(
          failure.code === failure.PERMISSION_DENIED
            ? 'Location access is blocked. You can still move the map to your spot.'
            : 'Could not get your location. Move the map to your spot.',
        )
      },
      { enableHighAccuracy: true, timeout: 15_000, maximumAge: 0 },
    )
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // Keep a reference now: React clears event.currentTarget once the handler awaits.
    const form = event.currentTarget
    setError(null)
    setSuccess(false)
    setSubmitting(true)

    const data = new FormData(form)

    let photoUrls: string[] = []
    if (photos.length > 0) {
      setUploadingPhotos(true)
      try {
        photoUrls = await Promise.all(
          photos.map(async (photo) => {
            const photoData = new FormData()
            photoData.append('file', photo.file)
            const uploadResponse = await fetch('/api/uploads?purpose=river-report-photo', {
              method: 'POST',
              body: photoData,
            })
            const uploadBody = await uploadResponse.json().catch(() => null)
            if (!uploadResponse.ok) throw new Error(uploadBody?.error ?? 'Could not upload a photo')
            return uploadBody.url as string
          }),
        )
      } catch (uploadError) {
        setPhotoError(uploadError instanceof Error ? uploadError.message : 'Could not upload the photos')
        setSubmitting(false)
        setUploadingPhotos(false)
        return
      }
      setUploadingPhotos(false)
    }

    const payload = {
      category: data.get('category'),
      description: data.get('description'),
      locationDescription: data.get('locationDescription'),
      latitude: position.latitude,
      longitude: position.longitude,
      reporterName: data.get('reporterName'),
      photoUrls,
    }

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        setError(body?.error ?? 'Could not save the report')
        return
      }

      form.reset()
      clearPhotos()
      setSuccess(true)
      router.refresh()
    } catch {
      setError('Could not reach the server. Check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = 'w-full rounded-md border border-input bg-background px-3 py-2 text-sm'

  return (
    <form onSubmit={handleSubmit} className={embedded ? 'space-y-5' : 'space-y-5 rounded-lg border border-border bg-card p-5'}>
      {!embedded && <h2 className="font-heading text-2xl">Report an issue</h2>}

      <label className="block space-y-1 text-sm">
        <span className="font-medium">What did you see?</span>
        <select name="category" required className={inputClass} defaultValue="">
          <option value="" disabled>Choose a category</option>
          {Object.entries(REPORT_CATEGORIES).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </label>

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

        <label className="block space-y-1 text-sm">
          <span className="font-medium">Describe the spot</span>
          <input
            name="locationDescription"
            required
            minLength={3}
            maxLength={200}
            className={inputClass}
            placeholder='For example: "behind the big tree by the river"'
          />
        </label>
      </fieldset>

      <label className="block space-y-1 text-sm">
        <span className="font-medium">Description (optional)</span>
        <textarea name="description" rows={3} maxLength={500} className={inputClass} placeholder="What is happening?" />
      </label>

      <div className="space-y-2 text-sm">
        <span className="font-medium">Photos (optional, up to {MAX_REPORT_PHOTOS})</span>

        {photos.length > 0 && (
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
            {photos.map((photo) => (
              <div key={photo.id} className="group relative aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element -- preview of a locally chosen file, not a remote asset */}
                <img src={photo.preview} alt="Selected photo preview" className="h-full w-full rounded-md object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(photo.id)}
                  aria-label="Remove this photo"
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs leading-none text-destructive-foreground"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {photos.length < MAX_REPORT_PHOTOS && (
          <input
            ref={photoInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            capture="environment"
            multiple
            onChange={addPhotos}
            className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-full file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-sm file:font-medium file:text-secondary-foreground"
          />
        )}
        <p className="text-xs text-muted-foreground">{photos.length} of {MAX_REPORT_PHOTOS} photos added</p>
        {photoError && <p role="alert" className="text-sm text-destructive">{photoError}</p>}
      </div>

      <label className="block space-y-1 text-sm">
        <span className="font-medium">Your name (optional)</span>
        <input name="reporterName" className={inputClass} />
      </label>

      <div ref={statusRef} aria-live="polite">
        {error && <p role="alert" className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}
        {success && (
          <p role="status" className="rounded-md bg-success/10 px-4 py-3 text-sm text-success">
            Thank you. Your report has been saved and is on the map.
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
      >
        {uploadingPhotos
          ? `Uploading ${photos.length} photo${photos.length === 1 ? '' : 's'}…`
          : submitting
            ? 'Saving…'
            : 'Submit report'}
      </button>
    </form>
  )
}
