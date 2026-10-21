'use client'

import { useState } from 'react'
import { useReveal } from './hooks'

const TOTAL_HOUSEHOLDS = 500
const REACHED = 10
const DOTS = Array.from({ length: TOTAL_HOUSEHOLDS }, (_, i) => i < REACHED)

export function GoalsSection() {
  const { ref, visible } = useReveal<HTMLDivElement>(0.2)
  const [showGoal, setShowGoal] = useState(false)

  return (
    <section className="bg-story-day py-24 text-story-ink">
      <div ref={ref} className={`story-reveal mx-auto max-w-6xl px-4 ${visible ? 'is-visible' : ''}`}>
        <p className="font-heading text-sm uppercase tracking-[0.2em] text-story-river">06 / The next chapter</p>
        <h2 className="mt-3 max-w-xl font-heading text-5xl">Ten households is a beginning.</h2>
        <p className="mt-5 max-w-2xl text-lg text-story-ink/90">
          Each dot is one household. The pilot has reached ten. The goal for the next phase is 500, along with about
          15 schools and hospitals.
        </p>

        <div
          className="mt-10 grid gap-1"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(10px, 1fr))' }}
          aria-hidden="true"
        >
          {DOTS.map((reached, i) => (
            <span
              key={i}
              className={`aspect-square rounded-full transition-colors duration-300 ${
                reached ? 'bg-story-leaf' : showGoal ? 'bg-story-leaf/25' : 'bg-story-ink/10'
              }`}
              style={visible ? { transitionDelay: `${Math.min(i, REACHED) * 15}ms` } : undefined}
            />
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            type="button"
            aria-pressed={showGoal}
            onClick={() => setShowGoal((v) => !v)}
            className="rounded-full bg-story-deep px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            {showGoal ? 'Hide the goal' : 'Show the goal'}
          </button>
          <p className="text-sm text-story-muted">
            {showGoal
              ? 'Green dots are the households we hope to reach. Lit dots are reached already.'
              : 'Lit dots are households already reached.'}
          </p>
        </div>

        <p className="mt-9 max-w-2xl text-sm text-story-muted">
          These are goals, not results. Reaching them needs funding, technical support, community participation and
          ongoing maintenance. Households will be chosen by need and technical assessment.
        </p>
      </div>
    </section>
  )
}
