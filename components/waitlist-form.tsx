'use client'

import { useEffect, useRef, useState } from 'react'

type EvidenceKind = 'photo' | 'audio'

async function uploadEvidence(file: File, purpose: 'waitlist-photo' | 'waitlist-audio'): Promise<string> {
  const data = new FormData()
  data.append('file', file)
  const response = await fetch(`/api/uploads?purpose=${purpose}`, { method: 'POST', body: data })
  const body = await response.json().catch(() => null)
  if (!response.ok) throw new Error(body?.error ?? 'Could not upload the file')
  return body.url as string
}

export function WaitlistForm({ onJoined }: { onJoined?: () => void }) {
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const statusRef = useRef<HTMLDivElement>(null)
  const photoInputRef = useRef<HTMLInputElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (error || success) statusRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [error, success])

  function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null
    setPhotoPreview((previous) => {
      if (previous) URL.revokeObjectURL(previous)
      return file ? URL.createObjectURL(file) : null
    })
    setPhotoFile(file)
  }

  function clearEvidence(kind: EvidenceKind) {
    if (kind === 'photo') {
      setPhotoPreview((previous) => {
        if (previous) URL.revokeObjectURL(previous)
        return null
      })
      setPhotoFile(null)
      if (photoInputRef.current) photoInputRef.current.value = ''
    } else {
      setAudioFile(null)
      if (audioInputRef.current) audioInputRef.current.value = ''
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    setError(null)
    setSuccess(false)
    setSubmitting(true)

    const data = new FormData(form)

    try {
      const [photoUrl, audioUrl] = await Promise.all([
        photoFile ? uploadEvidence(photoFile, 'waitlist-photo') : Promise.resolve(null),
        audioFile ? uploadEvidence(audioFile, 'waitlist-audio') : Promise.resolve(null),
      ])

      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          place: data.get('place'),
          phone: data.get('phone'),
          photoUrl,
          audioUrl,
        }),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        setError(body?.error ?? 'Could not join the waitlist')
        return
      }

      form.reset()
      clearEvidence('photo')
      clearEvidence('audio')
      setSuccess(true)
      onJoined?.()
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = 'w-full rounded-md border border-input bg-background px-3 py-2 text-sm'

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-border bg-card p-5">
      <label className="block space-y-1 text-sm">
        <span className="font-medium">Name</span>
        <input name="name" required minLength={2} maxLength={100} className={inputClass} />
      </label>

      <label className="block space-y-1 text-sm">
        <span className="font-medium">Place</span>
        <input name="place" required minLength={2} maxLength={100} className={inputClass} placeholder="Village, town or area" />
      </label>

      <label className="block space-y-1 text-sm">
        <span className="font-medium">Phone number</span>
        <input name="phone" type="tel" required className={inputClass} placeholder="+256 7xx xxx xxx" />
      </label>

      <div className="space-y-2 text-sm">
        <span className="font-medium">Photo showing your interest (optional)</span>
        {photoPreview ? (
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element -- preview of a locally chosen file, not a remote asset */}
            <img src={photoPreview} alt="Selected photo preview" className="h-16 w-16 rounded-md object-cover" />
            <button type="button" onClick={() => clearEvidence('photo')} className="text-xs font-medium text-muted-foreground underline">
              Remove
            </button>
          </div>
        ) : (
          <input
            ref={photoInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handlePhotoChange}
            className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-full file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-sm file:font-medium file:text-secondary-foreground"
          />
        )}
      </div>

      <div className="space-y-2 text-sm">
        <span className="font-medium">Or a short voice note (optional)</span>
        {audioFile ? (
          <div className="flex items-center gap-3">
            <span className="truncate text-muted-foreground">{audioFile.name}</span>
            <button type="button" onClick={() => clearEvidence('audio')} className="text-xs font-medium text-muted-foreground underline">
              Remove
            </button>
          </div>
        ) : (
          <input
            ref={audioInputRef}
            type="file"
            accept="audio/*"
            onChange={(event) => setAudioFile(event.target.files?.[0] ?? null)}
            className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-full file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-sm file:font-medium file:text-secondary-foreground"
          />
        )}
      </div>

      <div ref={statusRef} aria-live="polite">
        {error && <p role="alert" className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}
        {success && (
          <p role="status" className="rounded-md bg-success/10 px-4 py-3 text-sm text-success">
            Thank you for joining. We&apos;ll be in touch.
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
      >
        {submitting ? 'Joining…' : 'Join the waitlist'}
      </button>
    </form>
  )
}
