'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

type Photo = { src: string; alt: string; caption: string }

const AUTOPLAY_MS = 4500

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function PhotoGallery({ photos }: { photos: Photo[] }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  function goTo(i: number) {
    setIndex((i + photos.length) % photos.length)
  }

  // Autoplay, paused on hover/focus. Re-running this effect on every index
  // change (whether from autoplay or a manual click) naturally restarts the
  // timer, so a manual click doesn't get instantly overridden.
  useEffect(() => {
    if (paused || photos.length <= 1 || prefersReducedMotion()) return
    const timer = setTimeout(() => setIndex((i) => (i + 1) % photos.length), AUTOPLAY_MS)
    return () => clearTimeout(timer)
  }, [index, paused, photos.length])

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div
        className="relative aspect-[4/3] w-full overflow-hidden rounded-lg"
        role="group"
        aria-label={`Photo gallery, slide ${index + 1} of ${photos.length}`}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {photos.map((photo, i) => (
          <div
            key={photo.src}
            aria-hidden={i !== index}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              i === index ? 'opacity-100' : 'pointer-events-none opacity-0'
            }`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              priority={i === 0}
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-story-night/85 to-transparent px-5 pb-4 pt-10">
              <p className="font-heading text-sm text-white">{photo.caption}</p>
            </div>
          </div>
        ))}

        {photos.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              onClick={() => goTo(index - 1)}
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-story-night/70 text-white transition-opacity hover:opacity-90"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next photo"
              onClick={() => goTo(index + 1)}
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-story-night/70 text-white transition-opacity hover:opacity-90"
            >
              ›
            </button>
          </>
        )}
      </div>

      <div className="mt-4 flex items-center justify-center gap-2" role="tablist" aria-label="Choose a photo">
        {photos.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Photo ${i + 1} of ${photos.length}`}
            onClick={() => goTo(i)}
            className={`h-2.5 rounded-full transition-all ${
              i === index ? 'w-6 bg-story-sun' : 'w-2.5 bg-story-mist/30 hover:bg-story-mist/50'
            }`}
          />
        ))}
        <span className="ml-2 text-xs tabular-nums text-story-mist/60">
          {index + 1} / {photos.length}
        </span>
      </div>
    </div>
  )
}
