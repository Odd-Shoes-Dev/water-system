'use client'

import { useState } from 'react'
import { Modal } from './modal'

// A reusable "are you sure?" dialog, built on the same Modal every add/edit
// form already uses, instead of the browser's own confirm().
export function ConfirmDialog({
  title,
  description,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  destructive = true,
  onConfirm,
  onClose,
}: {
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  onConfirm: () => void | Promise<void>
  onClose: () => void
}) {
  const [working, setWorking] = useState(false)

  async function handleConfirm() {
    setWorking(true)
    try {
      await onConfirm()
    } finally {
      setWorking(false)
    }
  }

  return (
    <Modal onClose={onClose} titleId="confirm-dialog-title">
      <h3 id="confirm-dialog-title" className="font-heading text-2xl">
        {title}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={working}
          className="rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-accent disabled:opacity-60"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={working}
          className={`rounded-full px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60 ${
            destructive ? 'bg-destructive' : 'bg-primary'
          }`}
        >
          {working ? 'Working…' : confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
