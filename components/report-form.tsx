'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { REPORT_CATEGORIES } from '@/lib/data/types'

export function ReportForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)

    const form = new FormData(event.currentTarget)
    const payload = {
      category: form.get('category'),
      description: form.get('description'),
      latitude: form.get('latitude'),
      longitude: form.get('longitude'),
      reporterName: form.get('reporterName'),
    }

    const response = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    setSubmitting(false)

    if (!response.ok) {
      const body = await response.json().catch(() => null)
      setError(body?.error ?? 'Could not save the report')
      return
    }

    event.currentTarget.reset()
    router.refresh()
  }

  const inputClass = 'w-full rounded-md border border-input bg-background px-3 py-2 text-sm'

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-border bg-card p-5">
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

      <label className="block space-y-1 text-sm">
        <span className="font-medium">Description</span>
        <textarea name="description" rows={3} maxLength={500} className={inputClass} placeholder="What is happening and where?" />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block space-y-1 text-sm">
          <span className="font-medium">Latitude</span>
          <input name="latitude" type="number" step="any" required defaultValue="-0.6100" className={inputClass} />
        </label>
        <label className="block space-y-1 text-sm">
          <span className="font-medium">Longitude</span>
          <input name="longitude" type="number" step="any" required defaultValue="30.6500" className={inputClass} />
        </label>
      </div>

      <label className="block space-y-1 text-sm">
        <span className="font-medium">Your name (optional)</span>
        <input name="reporterName" className={inputClass} />
      </label>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
      >
        {submitting ? 'Saving…' : 'Submit report'}
      </button>
    </form>
  )
}
