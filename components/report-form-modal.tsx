'use client'

import { Modal } from './modal'
import { ReportForm } from './report-form'

// Lets a logged-in team member report something they heard about, reusing
// the exact same public form and validation, just inside a modal.
export function ReportFormModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal onClose={onClose} titleId="report-form-title">
      <div className="flex items-start justify-between gap-4">
        <h3 id="report-form-title" className="font-heading text-2xl">
          Report an issue
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
      <div className="mt-4">
        <ReportForm embedded />
      </div>
    </Modal>
  )
}
