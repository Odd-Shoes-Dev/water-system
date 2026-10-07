import Image from 'next/image'
import Link from 'next/link'
import { ChartIcon, MapIcon, MapPinIcon, UsersIcon } from '@/components/icons'
import { NavContent } from '@/components/nav-content'

// Pure marketing content, no data fetching, so this can prerender. The
// impact figures live on /streams for now; see docs/known-issues.md once
// a logged-in dashboard exists.

const features = [
  {
    Icon: MapPinIcon,
    title: 'Report an issue',
    description: "Spot illegal dumping, pollution or a blocked drain. Add a photo and drop a pin, it's on the map in minutes.",
  },
  {
    Icon: MapIcon,
    title: 'One map, every report',
    description: 'See pollution hotspots, clean-ups and restoration work across every site, as they come in.',
  },
  {
    Icon: ChartIcon,
    title: 'Real impact, not estimates',
    description: 'Litres harvested, households reached, clean-ups completed, all calculated from real data.',
  },
  {
    Icon: UsersIcon,
    title: 'Join the programme',
    description: "Want a tank, training or to help with a clean-up? Leave your details and we'll reach out.",
  },
]

const steps = [
  {
    title: 'Report or join',
    description: 'Youth report issues on the map, or households join the waitlist for a tank, training or a clean-up.',
  },
  {
    title: "It's logged and located",
    description: 'Every report and request is recorded with its location, so nothing gets lost.',
  },
  {
    title: 'The community acts',
    description: 'Clean-ups happen, tanks get installed, and the impact adds up, visible to everyone.',
  },
]

const ctaButtonClass = 'rounded-full px-7 py-3.5 text-base font-medium'

export default function HomePage() {
  return (
    <div>
      {/* Hero: full-bleed, breaks out of the usual page width on purpose. The nav
          sits in normal document flow at the top of this same relative block, so
          it can wrap on any screen size without ever overlapping the headline,
          while the image stays visible behind both. */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/hero-image.png" alt="" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/50 to-primary/85" />
        </div>
        <div className="relative">
          <NavContent transparent />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-8 sm:pb-32 sm:pt-12">
          <p className="text-base uppercase tracking-[0.2em] text-accent">Smart water &amp; community reporting</p>
          <h1 className="mt-5 max-w-3xl font-heading text-6xl leading-tight text-white sm:text-7xl">
            Know every drop, <em className="text-accent">before</em> it runs out.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/80">
            Rain&amp;Renew tracks rainwater tanks, greywater reuse and river health, while youth report issues
            straight from their phones.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/reports"
              className={`${ctaButtonClass} bg-accent text-accent-foreground transition-opacity hover:opacity-90`}
            >
              Report an issue
            </Link>
            <Link
              href="/waitlist"
              className={`${ctaButtonClass} border border-white/30 text-white transition-colors hover:border-white`}
            >
              Join the programme
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24">
        <p className="text-base uppercase tracking-[0.2em] text-accent">Features</p>
        <h2 className="mt-3 max-w-xl font-heading text-5xl">
          Quiet reporting. <em className="text-accent">Clear</em> answers.
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ Icon, title, description }) => (
            <div key={title} className="rounded-lg border border-border bg-card p-7">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-accent/40 text-accent">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-heading text-2xl">{title}</h3>
              <p className="mt-2 text-base text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works: full-bleed dark band, like the features section it breaks out of the page width. */}
      <section id="how-it-works" className="scroll-mt-20 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 py-24">
          <p className="text-base uppercase tracking-[0.2em] text-accent">How it works</p>
          <h2 className="mt-3 max-w-xl font-heading text-5xl">
            From a report to <em className="text-accent">real change</em>, in three steps.
          </h2>
          <div className="mt-14 divide-y divide-white/10">
            {steps.map((step, index) => (
              <div key={step.title} className="grid gap-2 py-7 sm:grid-cols-[5rem_1fr] sm:items-baseline sm:gap-6">
                <span className="font-heading text-5xl text-accent/40">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="text-lg font-medium text-white">{step.title}</h3>
                  <p className="mt-1 text-base text-white/70">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing call to action */}
      <section className="mx-auto max-w-6xl px-4 py-24 text-center">
        <h2 className="font-heading text-5xl">Ready to get involved?</h2>
        <p className="mx-auto mt-3 max-w-xl text-lg text-muted-foreground">
          Report what you see, or join the programme, whichever fits where you are.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Link
            href="/reports"
            className={`${ctaButtonClass} bg-primary text-primary-foreground transition-opacity hover:opacity-90`}
          >
            Report an issue
          </Link>
          <Link
            href="/waitlist"
            className={`${ctaButtonClass} border border-border transition-colors hover:border-accent`}
          >
            Join the waitlist
          </Link>
        </div>
      </section>
    </div>
  )
}
