'use client'

import { useEffect, useRef, useState } from 'react'
import { ACTIVITY_KIND_LABELS, MAX_ACTIVITY_PHOTOS, type Activity, type ActivityKind } from '@/lib/data/types'
import { Modal } from './modal'

type PhotoSlot = { id: string; file: File; preview: string }

export function ActivityForm({
  onClose,
  onCreated,
}: {
  onClose: () => void
  onCreated: (activity: Activity) => void
}) {
  const [photos, setPhotos] = useState<PhotoSlot[]>([])
  const [photoError, setPhotoError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [uploadingPhotos, setUploadingPhotos] = useState(false)
  const statusRef = useRef<HTMLDivElement>(null)
  const photoInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (error) statusRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [error])

  function addPhotos(event: React.ChangeEvent<HTMLInputElement>) {
    const chosen = Array.from(event.target.files ?? [])
    event.target.value = ''
    if (chosen.length === 0) return

    setPhotoError(null)
    setPhotos((current) => {
      const room = MAX_ACTIVITY_PHOTOS - current.length
      if (room <= 0) {
        setPhotoError(`You can attach up to ${MAX_ACTIVITY_PHOTOS} photos.`)
        return current
      }
      const accepted = chosen.slice(0, room)
      if (chosen.length > accepted.length) {
        setPhotoError(`Only ${room} more photo${room === 1 ? '' : 's'} could be added (maximum ${MAX_ACTIVITY_PHOTOS}).`)
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    setError(null)
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
            const uploadResponse = await fetch('/api/uploads?purpose=activity-photo', { method: 'POST', body: photoData })
            const uploadBody = await uploadResponse.json().catch(() => null)
            if (!uploadResponse.ok) throw new Error(uploadBody?.error ?? 'Could not upload a photo')
            return uploadBody.url as string
          }),
        )
      } catch (uploadError) {
        setError(uploadError instanceof Error ? uploadError.message : 'Could not upload the photos')
        setSubmitting(false)
        setUploadingPhotos(false)
        return
      }
      setUploadingPhotos(false)
    }

    const number = (name: string) => Number(data.get(name) || 0)

    const payload = {
      kind: data.get('kind'),
      location: data.get('location'),
      occurredOn: data.get('occurredOn'),
      participants: number('participants'),
      youthCount: number('youthCount'),
      householdsReached: number('householdsReached'),
      treesPlanted: number('treesPlanted'),
      wasteCollectedKg: number('wasteCollectedKg'),
      areaRestoredM2: number('areaRestoredM2'),
      description: data.get('description'),
      photoUrls,
    }

    try {
      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        setError(body?.error ?? 'Could not save the activity')
        return
      }

      const body = await response.json()
      onCreated(body.activity as Activity)
    } catch {
      setError('Could not reach the server. Check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = 'w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
  const kinds = Object.keys(ACTIVITY_KIND_LABELS) as ActivityKind[]

  return (
    <Modal onClose={onClose} titleId="activity-form-title">
      <div className="flex items-start justify-between gap-4">
        <h3 id="activity-form-title" className="font-heading text-2xl">
          Restoration activity
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
            <span className="font-medium">Activity type</span>
            <select name="kind" required defaultValue={kinds[1]} className={inputClass}>
              {kinds.map((kind) => (
                <option key={kind} value={kind}>{ACTIVITY_KIND_LABELS[kind]}</option>
              ))}
            </select>
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Location</span>
            <input name="location" required minLength={2} maxLength={100} placeholder="e.g. Kakyeka" className={inputClass} />
          </label>

          <label className="block space-y-1 text-sm">
            <span className="font-medium">Date</span>
            <input name="occurredOn" type="date" required className={inputClass} />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Participants</span>
            <input name="participants" type="number" min={0} defaultValue={0} className={inputClass} />
          </label>

          <label className="block space-y-1 text-sm">
            <span className="font-medium">Youth participants</span>
            <input name="youthCount" type="number" min={0} defaultValue={0} className={inputClass} />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Households reached</span>
            <input name="householdsReached" type="number" min={0} defaultValue={0} className={inputClass} />
          </label>

          <label className="block space-y-1 text-sm">
            <span className="font-medium">Trees planted</span>
            <input name="treesPlanted" type="number" min={0} defaultValue={0} className={inputClass} />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Waste collected (kg)</span>
            <input name="wasteCollectedKg" type="number" min={0} step="0.1" defaultValue={0} className={inputClass} />
          </label>
        </div>

        <label className="block space-y-1 text-sm">
          <span className="font-medium">Area cleaned / restored (m²)</span>
          <input name="areaRestoredM2" type="number" min={0} step="0.1" defaultValue={0} className={inputClass} />
        </label>

        <div className="space-y-2 text-sm">
          <span className="font-medium">Photos (optional, up to {MAX_ACTIVITY_PHOTOS})</span>
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
          {photos.length < MAX_ACTIVITY_PHOTOS && (
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
          {photoError && <p role="alert" className="text-sm text-destructive">{photoError}</p>}
        </div>

        <label className="block space-y-1 text-sm">
          <span className="font-medium">Remarks</span>
          <textarea name="description" rows={3} maxLength={1000} className={inputClass} placeholder="What happened?" />
        </label>

        <div ref={statusRef} aria-live="polite">
          {error && <p role="alert" className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
        >
          {uploadingPhotos ? `Uploading ${photos.length} photo${photos.length === 1 ? '' : 's'}…` : submitting ? 'Saving…' : 'Save activity'}
        </button>
      </form>
    </Modal>
  )
}
