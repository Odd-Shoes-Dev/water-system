'use client'

import { useEffect, useRef, useState } from 'react'
import { ACTIVITY_KIND_LABELS, MAX_ACTIVITY_PHOTOS, type Activity, type ActivityKind } from '@/lib/data/types'
import { Modal } from './modal'

type PhotoSlot = { id: string; file: File; preview: string }

export function ActivityForm({
  activity,
  onClose,
  onSaved,
}: {
  activity?: Activity
  onClose: () => void
  onSaved: (activity: Activity) => void
}) {
  const editing = Boolean(activity)
  const [existingPhotoUrls, setExistingPhotoUrls] = useState<string[]>(activity?.photoUrls ?? [])
  const [photos, setPhotos] = useState<PhotoSlot[]>([])
  const [photoError, setPhotoError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [uploadingPhotos, setUploadingPhotos] = useState(false)
  const statusRef = useRef<HTMLDivElement>(null)
  const photoInputRef = useRef<HTMLInputElement>(null)

  const totalPhotoCount = existingPhotoUrls.length + photos.length

  useEffect(() => {
    if (error) statusRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [error])

  function addPhotos(event: React.ChangeEvent<HTMLInputElement>) {
    const chosen = Array.from(event.target.files ?? [])
    event.target.value = '' // lets the same file be picked again later if removed
    if (chosen.length === 0) return

    setPhotoError(null)
    setPhotos((current) => {
      const room = MAX_ACTIVITY_PHOTOS - existingPhotoUrls.length - current.length
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

  function removeExistingPhoto(url: string) {
    setExistingPhotoUrls((current) => current.filter((u) => u !== url))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    setError(null)
    setSubmitting(true)

    const data = new FormData(form)

    let uploadedUrls: string[] = []
    if (photos.length > 0) {
      setUploadingPhotos(true)
      try {
        uploadedUrls = await Promise.all(
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
      peopleReached: number('peopleReached'),
      peopleEmployed: number('peopleEmployed'),
      volunteers: number('volunteers'),
      treesPlanted: number('treesPlanted'),
      wasteCollectedKg: number('wasteCollectedKg'),
      areaRestoredM2: number('areaRestoredM2'),
      description: data.get('description'),
      photoUrls: [...existingPhotoUrls, ...uploadedUrls],
    }

    try {
      const response = await fetch(editing ? `/api/activities/${activity!.id}` : '/api/activities', {
        method: editing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        setError(body?.error ?? 'Could not save the activity')
        return
      }

      const body = await response.json()
      onSaved(body.activity as Activity)
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
          {editing ? 'Edit activity' : 'Restoration activity'}
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
            <select name="kind" required defaultValue={activity?.kind ?? kinds[1]} className={inputClass}>
              {kinds.map((kind) => (
                <option key={kind} value={kind}>{ACTIVITY_KIND_LABELS[kind]}</option>
              ))}
            </select>
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Location</span>
            <input
              name="location"
              required
              minLength={2}
              maxLength={100}
              defaultValue={activity?.location}
              placeholder="e.g. Kakyeka"
              className={inputClass}
            />
          </label>

          <label className="block space-y-1 text-sm">
            <span className="font-medium">Date</span>
            <input name="occurredOn" type="date" required defaultValue={activity?.occurredOn} className={inputClass} />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Participants</span>
            <input name="participants" type="number" min={0} defaultValue={activity?.participants ?? 0} className={inputClass} />
          </label>

          <label className="block space-y-1 text-sm">
            <span className="font-medium">Youth participants</span>
            <input name="youthCount" type="number" min={0} defaultValue={activity?.youthCount ?? 0} className={inputClass} />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Households reached</span>
            <input name="householdsReached" type="number" min={0} defaultValue={activity?.householdsReached ?? 0} className={inputClass} />
          </label>

          <label className="block space-y-1 text-sm">
            <span className="font-medium">People reached</span>
            <input name="peopleReached" type="number" min={0} defaultValue={activity?.peopleReached ?? 0} className={inputClass} />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">People employed</span>
            <input name="peopleEmployed" type="number" min={0} defaultValue={activity?.peopleEmployed ?? 0} className={inputClass} />
          </label>

          <label className="block space-y-1 text-sm">
            <span className="font-medium">Volunteers</span>
            <input name="volunteers" type="number" min={0} defaultValue={activity?.volunteers ?? 0} className={inputClass} />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Trees planted</span>
            <input name="treesPlanted" type="number" min={0} defaultValue={activity?.treesPlanted ?? 0} className={inputClass} />
          </label>

          <label className="block space-y-1 text-sm">
            <span className="font-medium">Waste collected (kg)</span>
            <input name="wasteCollectedKg" type="number" min={0} step="0.1" defaultValue={activity?.wasteCollectedKg ?? 0} className={inputClass} />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">Area cleaned / restored (m²)</span>
            <input name="areaRestoredM2" type="number" min={0} step="0.1" defaultValue={activity?.areaRestoredM2 ?? 0} className={inputClass} />
          </label>
        </div>

        <div className="space-y-2 text-sm">
          <span className="font-medium">Photos (optional, up to {MAX_ACTIVITY_PHOTOS})</span>
          {(existingPhotoUrls.length > 0 || photos.length > 0) && (
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
              {existingPhotoUrls.map((url) => (
                <div key={url} className="group relative aspect-square">
                  {/* eslint-disable-next-line @next/next/no-img-element -- remote ImageKit URL, not a local asset */}
                  <img src={url} alt="Previously added photo" className="h-full w-full rounded-md object-cover" />
                  <button
                    type="button"
                    onClick={() => removeExistingPhoto(url)}
                    aria-label="Remove this photo"
                    className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs leading-none text-destructive-foreground"
                  >
                    ×
                  </button>
                </div>
              ))}
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
          {totalPhotoCount < MAX_ACTIVITY_PHOTOS && (
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
          <textarea name="description" rows={3} maxLength={1000} defaultValue={activity?.description} className={inputClass} placeholder="What happened?" />
        </label>

        <div ref={statusRef} aria-live="polite">
          {error && <p role="alert" className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}
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
              : editing
                ? 'Save changes'
                : 'Save activity'}
        </button>
      </form>
    </Modal>
  )
}
