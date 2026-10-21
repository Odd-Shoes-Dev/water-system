import Image from 'next/image'
import Link from 'next/link'
import { DaySliderSection } from '@/components/landing/day-slider-section'
import { FounderSection } from '@/components/landing/founder-section'
import { GetInvolvedSection } from '@/components/landing/get-involved-section'
import { GoalsSection } from '@/components/landing/goals-section'
import { JourneySection } from '@/components/landing/journey-section'
import { PilotStatsSection } from '@/components/landing/pilot-stats-section'
import { RiverSection } from '@/components/landing/river-section'
import { ScrollProgressBar } from '@/components/landing/scroll-progress-bar'
import { TankSection } from '@/components/landing/tank-section'
import { NavContent } from '@/components/nav-content'

// The landing page's wording and section order follow
// rain_and_renew_visual_landing_page.html, the prototype Cathy sent. Anything
// that prototype itself flagged as needing her confirmation (donation
// details, costs, the founder's own-words quote, contact details) is left
// out rather than guessed at — see the plan this was built from.

export default function HomePage() {
  return (
    <div>
      <ScrollProgressBar />

      {/* Hero: full-bleed, breaks out of the usual page width on purpose. */}
      <section className="relative overflow-hidden bg-story-night">
        <div className="absolute inset-0">
          <Image src="/hero-image.png" alt="" fill priority sizes="100vw" className="object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-b from-story-night/60 via-story-night/45 to-story-night/80" />
        </div>
        <div className="relative">
          <NavContent transparent />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-8 sm:pb-32 sm:pt-12">
          <p className="font-heading text-sm uppercase tracking-[0.2em] text-story-sun">
            Rubindi &amp; Mbarara · Western Uganda
          </p>
          <h1 className="mt-5 max-w-3xl font-heading text-6xl leading-tight text-white sm:text-7xl">
            For some girls, the school day begins with a journey for water.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-story-mist/80">
            This is Rubindi and Mbarara, in western Uganda. It is where Rain&amp;Renew began.
          </p>
          <p className="mt-3 max-w-xl text-base text-story-mist/70">
            Rainwater harvesting. Greywater recycling. Community action for the River Rwizi.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="#pilot"
              className="rounded-full bg-story-sun px-7 py-3.5 text-base font-semibold text-story-ink transition-opacity hover:opacity-90"
            >
              Bring water closer ↗
            </Link>
            <Link
              href="#journey"
              className="rounded-full border border-white/30 px-7 py-3.5 text-base font-medium text-white transition-colors hover:border-white"
            >
              Experience the journey ↓
            </Link>
          </div>
          <p className="mt-9 text-sm text-story-mist/50">Scroll slowly. There are a few things to try along the way.</p>
        </div>
      </section>

      <div id="journey" className="scroll-mt-20">
        <JourneySection />
      </div>
      <TankSection />
      <DaySliderSection />
      <PilotStatsSection />
      <RiverSection />
      <GoalsSection />
      <FounderSection />
      <GetInvolvedSection />

      {/* Closing call to action */}
      <section className="bg-story-night py-14 text-center text-story-mist sm:py-24">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="font-heading text-5xl text-white">The next drop can make a difference.</h2>
          <p className="mt-5 text-lg text-story-mist/80">
            A household with another source of water. A girl learning a new skill. A community ready to protect its
            river.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              href="#get-involved"
              className="rounded-full bg-story-sun px-7 py-3.5 text-base font-semibold text-story-ink transition-opacity hover:opacity-90"
            >
              Be part of the next chapter ↗
            </Link>
            <Link
              href="/reports"
              className="rounded-full border border-white/30 px-7 py-3.5 text-base font-medium text-white transition-colors hover:border-white"
            >
              Report an issue
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
