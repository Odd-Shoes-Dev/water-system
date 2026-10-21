import Link from 'next/link'

const INTERESTS = ['Household water systems', "Girls' training", 'River Rwizi activities', 'The whole programme', 'A partnership']

const TRUST: { label: string; value: string }[] = [
  { label: 'Who manages the project', value: 'Arinda Catherine, personally.' },
  {
    label: 'How money is used',
    value: 'Each contribution is tied to a published budget covering systems, installation, training, maintenance and monitoring.',
  },
  { label: 'How you will hear back', value: 'Updates on installations, training, litres of water and community activities.' },
]

const FAQS = [
  {
    q: 'Are the results verified?',
    a: 'The figures are reported by Cathy and are approximate. Litres are cumulative totals, not stored water.',
  },
  {
    q: 'Is the recycled water safe?',
    a: 'Greywater is treated and reused only for non-drinking purposes. Systems are designed and maintained with health and safety in mind.',
  },
  {
    q: 'Is Rain&Renew part of YFC?',
    a: 'No. Cathy works with Youth Fraternity for Change Uganda (YFC), and that experience informs her work, but Rain&Renew is her own initiative.',
  },
  {
    q: 'Has the river programme started?',
    a: 'Yes. Reporting an issue and logging a clean-up or restoration activity are both live today on River watch.',
  },
]

export function GetInvolvedSection() {
  return (
    <section id="get-involved" className="scroll-mt-20 bg-story-deep py-24 text-story-mist">
      <div className="mx-auto max-w-6xl px-4">
        <p className="font-heading text-sm uppercase tracking-[0.2em] text-story-sun">08 / Get involved</p>
        <h2 className="mt-3 max-w-xl font-heading text-5xl text-white">Help the next drop do more.</h2>
        <p className="mt-5 max-w-2xl text-lg text-story-mist/80">
          Growing Rain&amp;Renew needs water systems, installation, training, maintenance and a way to measure
          results. Tell us how you&apos;d like to help and we&apos;ll reach out with the current plan.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div>
            <p className="font-heading text-lg font-semibold text-white">I&apos;m interested in</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {INTERESTS.map((interest) => (
                <li key={interest} className="rounded-full border border-white/20 px-4 py-2 text-sm text-story-mist/90">
                  {interest}
                </li>
              ))}
            </ul>
            <Link
              href="/waitlist"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-story-sun px-7 py-3.5 text-base font-semibold text-story-ink transition-opacity hover:opacity-90"
            >
              Start the conversation ↗
            </Link>

            <ul className="mt-10 space-y-5 border-t border-white/10 pt-8 text-sm">
              {TRUST.map((item) => (
                <li key={item.label}>
                  <b className="text-white">{item.label}</b>
                  <p className="mt-1 text-story-mist/70">{item.value}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="rounded-lg border border-white/10 p-7">
              <h3 className="font-heading text-xl text-white">Why there&apos;s no price list yet</h3>
              <p className="mt-3 text-story-mist/80">
                The full budget will cover training, installation differences, maintenance, monitoring, river
                activities and staffing. We&apos;ll publish it before asking for a specific amount, and we&apos;ll
                never claim a donation covers more than it does.
              </p>
            </div>

            <div className="mt-6 space-y-2">
              {FAQS.map((faq) => (
                <details key={faq.q} className="rounded-lg border border-white/10 p-4 open:bg-white/5">
                  <summary className="cursor-pointer font-medium text-white">{faq.q}</summary>
                  <p className="mt-2 text-sm text-story-mist/70">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
