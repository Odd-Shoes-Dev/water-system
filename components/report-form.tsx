'use client'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { REPORT_CATEGORIES } from '@/lib/data/types'
import type { Position } from './location-picker'

// The map needs the browser, so it's loaded only on the client.
const LocationPicker = dynamic(() => import('./location-picker'), {
  ssr: false,
  loading: () => <div className="h-64 w-full animate-pulse rounded-md bg-muted" />,
})

const DEFAULT_POSITION: Position = { latitude: -0.61, longitude: 30.65 }
const round = (n: number) => Math.round(n * 1e6) / 1e6

export function ReportForm() {
  const router = useRouter()
  const [position, setPosition] = useState<Position>(DEFAULT_POSITION)
  const [target, setTarget] = useState<(Position & { nonce: number }) | null>(null)
  const [locating, setLocating] = useState(false)
  const [locationMessage, setLocationMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoError, setPhotoError] = useState<string | null>(null)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const statusRef = useRef<HTMLDivElement>(null)
  const photoInputRef = useRef<HTMLInputElement>(null)

  // The button is at the bottom of a long form, so bring the result into view.
  useEffect(() => {
    if (error || success) {
      statusRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [error, success])

  function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null
    setPhotoError(null)
    setPhotoPreview((previous) => {
      if (previous) URL.revokeObjectURL(previous)
      return file ? URL.createObjectURL(file) : null
    })
    setPhotoFile(file)
  }

  function clearPhoto() {
    setPhotoPreview((previous) => {
      if (previous) URL.revokeObjectURL(previous)
      return null
    })
    setPhotoFile(null)
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

    let photoUrl: string | null = null
    if (photoFile) {
      setUploadingPhoto(true)
      const photoData = new FormData()
      photoData.append('file', photoFile)
      try {
        const uploadResponse = await fetch('/api/uploads', { method: 'POST', body: photoData })
        const uploadBody = await uploadResponse.json().catch(() => null)
        if (!uploadResponse.ok) {
          setPhotoError(uploadBody?.error ?? 'Could not upload the photo')
          setSubmitting(false)
          setUploadingPhoto(false)
          return
        }
        photoUrl = uploadBody.url
      } catch {
        setPhotoError('Could not upload the photo. Check your connection and try again.')
        setSubmitting(false)
        setUploadingPhoto(false)
        return
      }
      setUploadingPhoto(false)
    }

    const payload = {
      category: data.get('category'),
      description: data.get('description'),
      locationDescription: data.get('locationDescription'),
      latitude: position.latitude,
      longitude: position.longitude,
      reporterName: data.get('reporterName'),
      photoUrl,
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
      clearPhoto()
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
    <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border border-border bg-card p-5">
      <h2 className="font-heading text-2xl">Report an issue</h2>

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
        <span className="font-medium">Photo (optional)</span>
        {photoPreview ? (
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element -- preview of a locally chosen file, not a remote asset */}
            <img src={photoPreview} alt="Selected photo preview" className="h-20 w-20 rounded-md object-cover" />
            <button
              type="button"
              onClick={clearPhoto}
              className="rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:border-destructive hover:text-destructive"
            >
              Remove photo
            </button>
          </div>
        ) : (
          <input
            ref={photoInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            capture="environment"
            onChange={handlePhotoChange}
            className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-full file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-sm file:font-medium file:text-secondary-foreground"
          />
        )}
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
        {uploadingPhoto ? 'Uploading photo…' : submitting ? 'Saving…' : 'Submit report'}
      </button>
    </form>
  )
}
