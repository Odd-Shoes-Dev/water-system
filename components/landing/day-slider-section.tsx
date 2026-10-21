'use client'

import { useState } from 'react'
import { useReveal } from './hooks'

// Flex-grow weights per segment at t=0 (far away) and t=1 (close to home).
// Proportions are illustrative, same as the prototype — see the disclaimer below.
const FROM = { water: 28, school: 30, study: 12, rest: 30 }
const TO = { water: 8, school: 36, study: 22, rest: 34 }

const SEGMENTS: { key: keyof typeof FROM; label: string; color: string }[] = [
  { key: 'water', label: 'Fetching water', color: 'bg-story-river' },
  { key: 'school', label: 'School', color: 'bg-story-deep' },
  { key: 'study', label: 'Study', color: 'bg-story-leaf' },
  { key: 'rest', label: 'Rest & family', color: 'bg-story-sun' },
]

function messageFor(t: number) {
  if (t < 0.15) return 'Water takes a large share of the day.'
  if (t < 0.6) return 'A little time begins to come back.'
  if (t < 0.95) return 'More room for school, study and rest.'
  return 'A day with room to learn, and to breathe.'
}

export function DaySliderSection() {
  const { ref, visible } = useReveal<HTMLDivElement>()
  const [value, setValue] = useState(0)
  const t = value / 100

  return (
    <section className="bg-story-day py-14 text-story-ink sm:py-24">
      <div ref={ref} className={`story-reveal mx-auto max-w-6xl px-4 ${visible ? 'is-visible' : ''}`}>
        <p className="font-heading text-sm uppercase tracking-[0.2em] text-story-river">03 / What changes</p>
        <h2 className="mt-3 max-w-xl font-heading text-5xl">Water closer. A day with more room.</h2>
        <p className="mt-5 max-w-xl text-lg text-story-ink/90">
          Drag the slider and watch what changes in a girl&apos;s day.
        </p>

        <div className="mt-10 flex h-14 w-full overflow-hidden rounded-full" aria-hidden="true">
          {SEGMENTS.map((segment) => (
            <div
              key={segment.key}
              className={`flex items-center justify-center overflow-hidden whitespace-nowrap px-2 text-xs font-medium text-white ${segment.color}`}
              style={{ flexGrow: FROM[segment.key] + (TO[segment.key] - FROM[segment.key]) * t, flexBasis: 0 }}
            >
              {segment.key === 'water' ? (t > 0.85 ? 'Water' : 'Fetching water') : segment.label}
            </div>
          ))}
        </div>

        <div className="mt-6 max-w-xl">
          <label htmlFor="day-dial" className="text-sm font-medium text-story-muted">
            Water closer to home
          </label>
          <input
            id="day-dial"
            type="range"
            min={0}
            max={100}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            aria-describedby="day-msg"
            className="mt-2 w-full accent-story-river"
          />
          <div className="mt-1 flex justify-between text-xs text-story-muted">
            <span>Far away</span>
            <span>Close to home</span>
          </div>
        </div>

        <p id="day-msg" role="status" className="mt-4 font-medium text-story-river">
          {messageFor(t)}
        </p>
        <p className="mt-2 text-sm text-story-muted">
          An illustration of the idea, with proportions invented for the picture. Rain&amp;Renew has not yet measured
          the time saved, and will not claim it until it has. Measuring it is part of the next phase.
        </p>
      </div>
    </section>
  )
}
