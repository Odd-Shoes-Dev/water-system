'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

// A small, dependency-free modal: closes on Escape or a click on the backdrop,
// and locks page scroll while open.
//
// Rendered through a portal straight into <body>, so it always covers the
// true viewport no matter what it's opened from — nothing on the page (a
// transform, an overflow, a stacking context) can clip or offset it.
export function Modal({
  onClose,
  titleId,
  children,
  disableEscape = false,
}: {
  onClose: () => void
  titleId: string
  children: React.ReactNode
  // Set while something else (for example a photo viewer) is layered on top,
  // so Escape closes that instead of this modal underneath it.
  disableEscape?: boolean
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (disableEscape) return
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)

    // Locking scroll removes the scrollbar, which would otherwise shift the
    // page's content sideways into the space it leaves behind. Padding the
    // body by that same width keeps everything in place.
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    const previousOverflow = document.body.style.overflow
    const previousPaddingRight = document.body.style.paddingRight
    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`

    panelRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPaddingRight
    }
  }, [onClose, disableEscape])

  if (!mounted) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className="thin-scrollbar max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-card p-6 shadow-xl outline-none"
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}
