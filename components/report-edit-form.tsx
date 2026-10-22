'use client'

import { useState } from 'react'
import { REPORT_CATEGORIES, type ReportCategory } from '@/lib/data/types'
import { Modal } from './modal'

export type EditableReport = {
  id: number
  category: ReportCategory
  description: string
  locationDescription: string
  reporterName: string | null
}

// Deliberately narrower than the public submission form: photos and
// coordinates stay as originally submitted, this only covers the fields
// someone would actually need to correct. See app/api/reports/[id]/route.ts.
export function ReportEditForm({
  report,
  onClose,
  onSaved,
}: {
  report: EditableReport
  onClose: () => void
  onSaved: () => void
}) {
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)

    const data = new FormData(event.currentTarget)

    try {
      const response = await fetch(`/api/reports/${report.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: data.get('category'),
          locationDescription: data.get('locationDescription'),
          description: data.get('description'),
          reporterName: data.get('reporterName'),
        }),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        setError(body?.error ?? 'Could not save the report')
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
  const categories = Object.keys(REPORT_CATEGORIES) as ReportCategory[]

  return (
    <Modal onClose={onClose} titleId="report-edit-form-title">
      <div className="flex items-start justify-between gap-4">
        <h3 id="report-edit-form-title" className="font-heading text-2xl">
          Edit report
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
        <label className="block space-y-1 text-sm">
          <span className="font-medium">Category</span>
          <select name="category" required defaultValue={report.category} className={inputClass}>
            {categories.map((category) => (
              <option key={category} value={category}>
                {REPORT_CATEGORIES[category]}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-1 text-sm">
          <span className="font-medium">Where</span>
          <input
            name="locationDescription"
            required
            minLength={2}
            maxLength={200}
            defaultValue={report.locationDescription}
            className={inputClass}
          />
        </label>

        <label className="block space-y-1 text-sm">
          <span className="font-medium">Description</span>
          <textarea name="description" rows={3} maxLength={1000} defaultValue={report.description} className={inputClass} />
        </label>

        <label className="block space-y-1 text-sm">
          <span className="font-medium">Reporter name (optional)</span>
          <input name="reporterName" maxLength={100} defaultValue={report.reporterName ?? ''} className={inputClass} />
        </label>

        <div aria-live="polite">
          {error && <p role="alert" className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
        >
          {submitting ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </Modal>
  )
}
