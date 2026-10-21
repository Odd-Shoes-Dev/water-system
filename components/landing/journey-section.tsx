'use client'

import { useReveal, usePressHold } from './hooks'

// Progress-ring circumference for r=90 (2 * PI * 90), matching the SVG below.
const CIRCUMFERENCE = 2 * Math.PI * 90
const LINES = [
  { at: 0.12, text: 'Every trip takes time.' },
  { at: 0.38, text: 'Time that could go to school, to study, to rest.' },
  { at: 0.66, text: 'And some of those journeys expose girls to unsafe situations.' },
]

export function JourneySection() {
  const { ref, visible } = useReveal<HTMLDivElement>()
  const { progress, holding, finished, begin, end } = usePressHold()

  const label = finished ? 'Press to try again' : holding ? 'Keep holding' : 'Press and hold'

  return (
    <section className="bg-story-night py-24 text-story-mist">
      <div
        ref={ref}
        className={`story-reveal mx-auto max-w-6xl px-4 ${visible ? 'is-visible' : ''}`}
      >
        <p className="font-heading text-sm uppercase tracking-[0.2em] text-story-sun">01 / The journey</p>
        <h2 className="mt-3 max-w-xl font-heading text-5xl text-white">Try carrying it.</h2>
        <p className="mt-5 max-w-xl text-lg text-story-mist/80">
          Press and hold the circle. Stay with it for a moment.
        </p>

        <div className="mt-10 grid gap-10 sm:grid-cols-[auto_1fr] sm:items-center">
          <button
            type="button"
            aria-label="Press and hold to carry the water"
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId)
              begin()
            }}
            onPointerUp={end}
            onPointerCancel={end}
            onContextMenu={(e) => e.preventDefault()}
            onKeyDown={(e) => {
              if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
                e.preventDefault()
                begin()
              }
            }}
            onKeyUp={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault()
                end()
              }
            }}
            onBlur={end}
            onClick={(e) => e.preventDefault()}
            className="relative flex h-48 w-48 shrink-0 select-none items-center justify-center rounded-full bg-story-predawn text-white outline-none transition-transform active:scale-[0.98] focus-visible:ring-4 focus-visible:ring-story-sun"
          >
            <svg viewBox="0 0 200 200" aria-hidden="true" className="absolute inset-0 -rotate-90">
              <circle cx="100" cy="100" r="90" fill="none" stroke="#ffffff22" strokeWidth="8" />
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="#f0b83a"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
                style={{ transition: holding ? 'none' : 'stroke-dashoffset 0.3s ease' }}
              />
            </svg>
            <span className="relative flex flex-col items-center gap-1 px-4 text-center">
              <strong className="text-2xl">↟</strong>
              <span className="text-sm font-medium">{label}</span>
            </span>
          </button>

          <div>
            <ul className="space-y-3 text-lg text-white">
              {LINES.map((line) => (
                <li
                  key={line.text}
                  className={`transition-opacity duration-500 ${progress >= line.at ? 'opacity-100' : 'opacity-0'}`}
                >
                  {line.text}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-story-sun" role="status">
              {finished ? 'Now imagine this as part of an ordinary day. This is the weight we want to lift.' : ''}
            </p>
          </div>
        </div>

        <p className="mt-9 max-w-2xl text-sm text-story-mist/60">
          An illustration, not a measurement of any one person&apos;s journey. Keyboard: hold Space or Enter.
        </p>
      </div>
    </section>
  )
}
