'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

// Full-screen photo viewer, layered above the report details modal. The
// modal underneath already locks page scroll, so this doesn't need to.
export function ImageLightbox({
  photos,
  index,
  onIndexChange,
  onClose,
}: {
  photos: string[]
  index: number
  onIndexChange: (index: number) => void
  onClose: () => void
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight' && photos.length > 1) onIndexChange((index + 1) % photos.length)
      if (event.key === 'ArrowLeft' && photos.length > 1) onIndexChange((index - 1 + photos.length) % photos.length)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [index, photos.length, onIndexChange, onClose])

  if (!mounted) return null

  const arrowButtonClass =
    'absolute top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition-colors hover:bg-white/20'

  return createPortal(
    <div
      className="fixed inset-0 z-[2100] flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} of ${photos.length}`}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close photo viewer"
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl leading-none text-white transition-colors hover:bg-white/20"
      >
        ×
      </button>

      {photos.length > 1 && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onIndexChange((index - 1 + photos.length) % photos.length)
          }}
          aria-label="Previous photo"
          className={`${arrowButtonClass} left-2 sm:left-4`}
        >
          ‹
        </button>
      )}

      {/* eslint-disable-next-line @next/next/no-img-element -- remote ImageKit URL, not a local asset */}
      <img
        src={photos[index]}
        alt={`Photo ${index + 1} of ${photos.length} submitted with this report`}
        onClick={(event) => event.stopPropagation()}
        className="max-h-[85vh] max-w-full rounded-md object-contain"
      />

      {photos.length > 1 && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onIndexChange((index + 1) % photos.length)
          }}
          aria-label="Next photo"
          className={`${arrowButtonClass} right-2 sm:right-4`}
        >
          ›
        </button>
      )}

      {photos.length > 1 && (
        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/80">
          {index + 1} of {photos.length}
        </p>
      )}
    </div>,
    document.body,
  )
}
