'use client'

import { ClickToPlayVideo } from './click-to-play-video'
import { useCountUp, useReveal } from './hooks'
import { PhotoGallery } from './photo-gallery'

const PROOF_PHOTOS = [
  { src: '/images/proof/IMG_1678.jpg', alt: 'Measuring a roofline for a rainwater harvesting installation', caption: 'On site with a household' },
  { src: '/images/proof/IMG_1673.jpg', alt: 'Measuring a roofline for a rainwater harvesting installation', caption: 'On site with a household' },
  { src: '/images/proof/IMG_1693.jpg', alt: "Setting up a household's rainwater harvesting system", caption: 'Setting up the system' },
  { src: '/images/proof/IMG_1694.jpg', alt: "Setting up a household's rainwater harvesting system", caption: 'Setting up the system' },
  { src: '/images/proof/IMG_1699.jpg', alt: "Setting up a household's rainwater harvesting system", caption: 'Setting up the system' },
  { src: '/images/proof/IMG_1723.jpg', alt: "Setting up a household's rainwater harvesting system", caption: 'Setting up the system' },
]

type StatSpec = { to: number; pre?: string; suf?: string; label: string; small: string }

function Stat({ to, pre = '', suf = '', label, small, active }: StatSpec & { active: boolean }) {
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

export function PilotStatsSection({
  tanksInstalled,
  totalCapacityL,
  peopleReached,
  householdsReached,
  rainwaterHarvestedL,
  greywaterRecycledL,
  youthTrained,
  peopleEmployed,
  volunteers,
}: {
  tanksInstalled: number
  totalCapacityL: number
  peopleReached: number
  householdsReached: number
  rainwaterHarvestedL: number
  greywaterRecycledL: number
  youthTrained: number
  peopleEmployed: number
  volunteers: number
}) {
  const { ref, visible } = useReveal<HTMLDivElement>(0.3)

  const stats: StatSpec[] = [
    {
      to: tanksInstalled,
      label: tanksInstalled === 1 ? 'water tank installed' : 'water tanks installed',
      small: totalCapacityL > 0 ? `${totalCapacityL.toLocaleString('en-US')} litres total capacity` : 'capacity to be confirmed',
    },
    {
      to: peopleReached,
      pre: 'about ',
      label: 'people reached',
      small: `across ${householdsReached.toLocaleString('en-US')} household${householdsReached === 1 ? '' : 's'}`,
    },
    { to: rainwaterHarvestedL, pre: '~', suf: ' L', label: 'rainwater harvested', small: 'cumulative since installation' },
    { to: greywaterRecycledL, pre: '~', suf: ' L', label: 'greywater recycled', small: 'cumulative since installation' },
    { to: youthTrained, label: 'youth trained', small: 'across training activities' },
    {
      to: peopleEmployed,
      label: 'people employed',
      small: volunteers > 0 ? `${volunteers} volunteer${volunteers === 1 ? '' : 's'} also involved` : 'no volunteers logged yet',
    },
  ]

  return (
    <section id="pilot" className="scroll-mt-20 bg-story-deep py-14 text-story-mist sm:py-24">
      <div ref={ref} className={`story-reveal mx-auto max-w-6xl px-4 ${visible ? 'is-visible' : ''}`}>
        <p className="font-heading text-sm uppercase tracking-[0.2em] text-story-sun">04 / The pilot</p>
        <h2 className="mt-3 max-w-xl font-heading text-5xl text-white">And it has begun.</h2>
        <p className="mt-5 max-w-xl text-lg text-story-mist/80">
          Rain&amp;Renew started with {tanksInstalled === 1 ? 'one tank' : `${tanksInstalled} tanks`}.
          Here&apos;s what the pilot looks like so far.
        </p>

        <div className="mx-auto mt-10 max-w-2xl">
          <PhotoGallery photos={PROOF_PHOTOS} />
        </div>

        <div className="mx-auto mt-10 max-w-2xl">
          <h3 className="font-heading text-xl text-white">Building the greywater system</h3>
          <p className="mt-2 text-sm text-story-mist/70">
            A first prototype, built and tested with what was on hand.
          </p>
          <div className="mt-4">
            <ClickToPlayVideo
              src="/videos/sand-filtration-setup.mp4"
              poster="/videos/sand-filtration-poster.jpg"
              caption="Greywater recycling: prototype #1"
            />
          </div>
        </div>

        <dl className="mt-14 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => (
            <Stat key={`${stat.label}-${index}`} {...stat} active={visible} />
          ))}
        </dl>

        <p className="mt-10 max-w-2xl text-sm text-story-mist/60">
          Figures are calculated live from the programme&apos;s own records — tanks, activities and greywater
          readings logged in the dashboard. Litres are totals since installation, not water currently in storage.
        </p>
      </div>
    </section>
  )
}
