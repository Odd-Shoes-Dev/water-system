'use client'

import { useCountUp, useReveal } from './hooks'
import { PhotoGallery } from './photo-gallery'

const STATS = [
  { to: 2, label: 'water tanks installed', small: 'one 2,000-litre, one 1,000-litre' },
  { to: 50, pre: 'about ', label: 'people reached', small: 'across 10 households' },
  { to: 5000, pre: '~', suf: ' L', label: 'rainwater harvested', small: 'cumulative since installation' },
  { to: 500, pre: '~', suf: ' L', label: 'greywater recycled', small: 'reported cumulative total' },
  { to: 6, label: 'girls trained', small: 'in greywater recycling' },
  { to: 2, label: 'people employed', small: '4 volunteers also involved' },
]

const PROOF_PHOTOS = [
  { src: '/images/proof/IMG_1678.jpg', alt: 'Measuring a roofline for a rainwater harvesting installation', caption: 'On site with a household' },
  { src: '/images/proof/IMG_1673.jpg', alt: 'Measuring a roofline for a rainwater harvesting installation', caption: 'On site with a household' },
  { src: '/images/proof/IMG_1693.jpg', alt: "Setting up a household's rainwater harvesting system", caption: 'Setting up the system' },
  { src: '/images/proof/IMG_1694.jpg', alt: "Setting up a household's rainwater harvesting system", caption: 'Setting up the system' },
  { src: '/images/proof/IMG_1699.jpg', alt: "Setting up a household's rainwater harvesting system", caption: 'Setting up the system' },
  { src: '/images/proof/IMG_1723.jpg', alt: "Setting up a household's rainwater harvesting system", caption: 'Setting up the system' },
]

function Stat({ to, pre = '', suf = '', label, small, active }: (typeof STATS)[number] & { active: boolean }) {
  const value = useCountUp(to, active)
  return (
    <div>
      <dd className="font-heading text-4xl tabular-nums text-story-sun">
        {pre}
        {value.toLocaleString('en-US')}
        {suf}
      </dd>
      <dt className="mt-1 font-medium text-white">{label}</dt>
      <small className="text-story-mist/60">{small}</small>
    </div>
  )
}

export function PilotStatsSection() {
  const { ref, visible } = useReveal<HTMLDivElement>(0.3)

  return (
    <section id="pilot" className="scroll-mt-20 bg-story-deep py-14 text-story-mist sm:py-24">
      <div ref={ref} className={`story-reveal mx-auto max-w-6xl px-4 ${visible ? 'is-visible' : ''}`}>
        <p className="font-heading text-sm uppercase tracking-[0.2em] text-story-sun">04 / The pilot</p>
        <h2 className="mt-3 max-w-xl font-heading text-5xl text-white">And it has begun.</h2>
        <p className="mt-5 max-w-xl text-lg text-story-mist/80">
          Rain&amp;Renew started with two tanks. Here&apos;s what the pilot&apos;s ten households look like.
        </p>

        <div className="mx-auto mt-10 max-w-2xl">
          <PhotoGallery photos={PROOF_PHOTOS} />
        </div>

        <dl className="mt-14 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {STATS.map((stat, index) => (
            <Stat key={`${stat.label}-${index}`} {...stat} active={visible} />
          ))}
        </dl>

        <p className="mt-10 max-w-2xl text-sm text-story-mist/60">
          Figures are reported by Arinda Catherine and are approximate. Litres are totals since installation, not
          water currently in storage.
        </p>
      </div>
    </section>
  )
}
