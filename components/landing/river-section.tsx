'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useReveal } from './hooks'

const STEPS = [
  { title: 'Report', text: 'A young person sends a photo, a description and a location of an environmental concern.' },
  { title: 'Review', text: 'The team checks the report for accuracy before it is shown publicly.' },
  { title: 'Act', text: 'Neighbours and local partners organise a clean-up.' },
  { title: 'Measure', text: 'What was done is recorded and shared, so people can see their report mattered.' },
]

export function RiverSection() {
  const { ref, visible } = useReveal<HTMLDivElement>()
  const [step, setStep] = useState(0)
  const current = STEPS[step]

  return (
    <section id="river" className="scroll-mt-20 bg-story-day pb-12 pt-14 text-story-ink sm:pt-24">
      <div ref={ref} className={`story-reveal mx-auto max-w-6xl px-4 ${visible ? 'is-visible' : ''}`}>
        <p className="font-heading text-sm uppercase tracking-[0.2em] text-story-river">05 / Beyond the household</p>
        <h2 className="mt-3 max-w-xl font-heading text-5xl">Then look to the river.</h2>
        <p className="mt-5 max-w-2xl text-lg text-story-ink/90">
          The River Rwizi serves Mbarara and the communities around it. Uganda&apos;s Ministry of Water and
          Environment has documented pressures on its catchment, including wetland encroachment, siltation and land
          use linked to reduced flows.
        </p>
        <p className="mt-3 max-w-2xl text-story-muted">A river cannot report what is happening to it. People can.</p>

        <div className="mt-10 max-w-2xl rounded-lg border border-story-ink/10 bg-white p-7">
          <ol className="flex flex-wrap gap-2" aria-label="Report steps">
            {STEPS.map((s, index) => (
              <li key={s.title}>
                <button
                  type="button"
                  onClick={() => setStep(index)}
                  aria-current={index === step ? 'step' : undefined}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    index === step
                      ? 'bg-story-river text-white'
                      : 'bg-story-ink/5 text-story-muted hover:bg-story-ink/10'
                  }`}
                >
                  {s.title}
                </button>
              </li>
            ))}
          </ol>

          <h3 className="mt-6 font-heading text-2xl">{current.title}</h3>
          <p role="status" className="mt-2 text-story-ink/90">
            {current.text}
          </p>
          <button
            type="button"
            onClick={() => setStep((step + 1) % STEPS.length)}
            className="mt-5 rounded-full bg-story-deep px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            {step === STEPS.length - 1 ? 'Start again' : 'Next step ↗'}
          </button>
          <p className="mt-5 text-sm text-story-muted">
            This is already live. Report what you see on{' '}
            <Link href="/reports" className="font-medium text-story-river underline">
              our River watch map
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  )
}
