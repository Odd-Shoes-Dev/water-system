import Image from 'next/image'

export function FounderSection() {
  return (
    <section className="bg-story-mist py-24 text-story-ink">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
        <div className="relative min-h-[380px] overflow-hidden rounded-3xl bg-story-predawn shadow-xl sm:min-h-[460px]">
          <Image
            src="/images/Profile photo.jpg"
            alt="Arinda Catherine"
            fill
            sizes="(min-width: 1024px) 35vw, 90vw"
            className="object-cover"
            style={{ objectPosition: 'center 27%' }}
          />
          <div className="absolute inset-x-[18px] bottom-[18px] flex items-center gap-3 rounded-2xl bg-story-night/90 px-5 py-4 font-heading text-white backdrop-blur">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-story-sun" />
            <span>
              Arinda Catherine <small className="font-body font-normal text-story-mist/70">Founder, Rain&amp;Renew</small>
            </span>
          </div>
        </div>

        <div>
          <p className="font-heading text-sm uppercase tracking-[0.2em] text-story-river">
            07 / The person behind the pilot
          </p>
          <h2 className="mt-3 font-heading text-5xl">It started with one person and two tanks.</h2>
          <p className="mt-5 text-lg text-story-ink/90">
            Arinda Catherine is a lawyer by profession and an award-winning youth leader by passion, working at the
            forefront of social and environmental justice.
          </p>
          <p className="mt-4 text-story-muted">
            Lawyer | Legal Researcher | Environmentalist | Youth and Human Rights Advocate | Passionate about SDG 4 &amp;
            5 | LDC Mbarara | Aspire Leaders Alumna | Fellow @beVisioneers: The Mercedes Benz Fellowship 2026
          </p>
          <div className="mt-5 space-y-4 text-story-muted">
            <p>
              She specializes in transforming legal frameworks into grassroots action, utilizing the law as a
              powerful catalyst for social and environmental reform.
            </p>
            <p>
              As the visionary behind the HerRights Project, recognized as the Best Community Project, she
              successfully spearheaded the enactment of a sub-county bylaw to end child marriage and promote
              education in Rubindi.
            </p>
            <p>
              Arinda is currently leveraging her legal expertise and policy advocacy to drive youth-led action
              addressing the ecological and climate crises in Western Uganda.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
