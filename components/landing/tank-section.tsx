'use client'

import { useEffect, useRef, useState } from 'react'
import { useReveal } from './hooks'

const CAPACITY_L = 2000

function statusFor(level: number, raining: boolean) {
  if (level === 0) return raining ? 'The first drops are falling.' : 'Press the button and let it rain.'
  if (level < 0.35) return 'The water is starting to gather.'
  if (level < 0.8) return 'Every roof becomes a source.'
  if (level < 1) return 'Almost full. This is water kept close to home.'
  return "Full. Ready for the days when it doesn't rain."
}

export function TankSection() {
  const { ref, visible } = useReveal<HTMLDivElement>()
  const [level, setLevel] = useState(0)
  const [raining, setRaining] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current)
  }, [])

  function stopRain() {
    setRaining(false)
    if (timerRef.current) clearInterval(timerRef.current)
  }

  function toggleRain() {
    if (raining) {
      stopRain()
      return
    }
    if (level >= 1) return
    setRaining(true)
    timerRef.current = setInterval(() => {
      setLevel((current) => {
        const next = Math.min(1, current + 0.012)
        if (next >= 1) stopRain()
        return next
      })
    }, 100)
  }

  function reset() {
    stopRain()
    setLevel(0)
  }

  const litres = Math.round(level * CAPACITY_L)
  const buttonLabel = raining ? 'Pause the rain' : level >= 1 ? 'Tank full' : 'Make it rain ↓'

  return (
    <section className="bg-story-day py-24 text-story-ink">
      <div ref={ref} className={`story-reveal mx-auto max-w-6xl px-4 ${visible ? 'is-visible' : ''}`}>
        <p className="font-heading text-sm uppercase tracking-[0.2em] text-story-river">02 / A practical answer</p>
        <h2 className="mt-3 max-w-xl font-heading text-5xl">Now bring the water closer.</h2>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-lg text-story-ink/90">
              Rain falls on every roof. A tank can keep it for the days when it doesn&apos;t.
            </p>
            <p className="mt-4 text-story-muted">
              Rain&amp;Renew installs rainwater harvesting systems at households in water-insecure communities. The
              first two pilot tanks hold 2,000 litres and 1,000 litres.
            </p>
            <p className="mt-4 text-story-muted">
              Water used for washing doesn&apos;t have to be wasted either. Treated greywater can be reused for
              non-drinking purposes, so every drop works twice.
            </p>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <b className="font-heading text-4xl tabular-nums">{litres.toLocaleString('en-US')}</b>
              <span className="text-story-muted">of 2,000 litres</span>
            </div>
            <div className="mt-3 h-4 w-full overflow-hidden rounded-full bg-story-ink/10">
              <span
                className="block h-full rounded-full bg-story-river transition-[width] duration-150"
                style={{ width: `${level * 100}%` }}
              />
            </div>
            <p className="mt-4 text-sm font-medium text-story-river" role="status">
              {statusFor(level, raining)}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                aria-pressed={raining}
                onClick={toggleRain}
                className="rounded-full bg-story-deep px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                {buttonLabel}
              </button>
              <button
                type="button"
                onClick={reset}
                className="rounded-full border-2 border-story-deep px-6 py-3 text-sm font-semibold text-story-deep transition-colors hover:bg-story-deep/10"
              >
                Empty the tank
              </button>
            </div>
            <p className="mt-5 text-sm text-story-muted">
              An illustration of how a 2,000-litre tank fills. It is not a record of the pilot&apos;s tanks.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
