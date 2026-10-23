'use client'

import { useState } from 'react'

// Nothing is fetched until the reader clicks: the <video> element isn't even
// mounted before then, so there's no network request at all for people who
// never press play — not just preload="none" on an always-present element.
export function ClickToPlayVideo({
  src,
  poster,
  caption,
}: {
  src: string
  poster: string
  caption: string
}) {
  const [playing, setPlaying] = useState(false)

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-story-night">
      {playing ? (
        <video src={src} poster={poster} controls autoPlay className="h-full w-full" />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play video: ${caption}`}
          className="group relative block h-full w-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- local static poster, not optimized via next/image on purpose (kept tiny already) */}
          <img src={poster} alt={caption} className="h-full w-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center bg-story-night/30 transition-colors group-hover:bg-story-night/40">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-story-sun text-story-ink shadow-lg transition-transform group-hover:scale-105">
              <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-story-night/85 to-transparent px-5 pb-4 pt-10">
            <p className="font-heading text-sm text-white">{caption}</p>
          </div>
        </button>
      )}
    </div>
  )
}
