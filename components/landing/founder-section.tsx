import Image from 'next/image'

export function FounderSection() {
  return (
    <section className="bg-story-night py-24 text-story-mist">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 lg:grid-cols-[1fr_1.3fr] lg:items-start">
        <div className="rounded-lg border border-white/10 bg-story-predawn p-7">
          <span className="text-2xl text-story-sun">✳</span>
          <p className="mt-4 font-heading text-sm uppercase tracking-[0.2em] text-story-sun">Meet the founder</p>
          <h3 className="mt-2 font-heading text-3xl text-white">
            A practical start.
            <br />A bigger vision.
          </h3>
          <p className="mt-4 text-story-mist/80">
            Real stories and real community knowledge should lead the next chapter.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
              <Image src="/images/Profile photo.jpg" alt="Arinda Catherine" fill sizes="56px" className="object-cover" />
            </div>
            <p className="text-sm text-story-mist/70">Arinda Catherine · Founder, Rain&amp;Renew</p>
          </div>
        </div>

        <div>
          <p className="font-heading text-sm uppercase tracking-[0.2em] text-story-sun">07 / The person behind the pilot</p>
          <h2 className="mt-3 font-heading text-5xl text-white">It started with one person and two tanks.</h2>
          <p className="mt-5 text-lg text-story-mist/90">
            Arinda Catherine, known as Cathy, founded Rain&amp;Renew and manages the pilot herself.
          </p>
          <p className="mt-4 text-story-mist/80">
            Lawyer | Legal Researcher | Environmentalist | Youth and Human Rights Advocate | Passionate about SDG 4 &amp;
            5 | LDC Mbarara | Aspire Leaders Alumna | Fellow @beVisioneers: The Mercedes Benz Fellowship 2026
          </p>
          <div className="mt-5 space-y-4 text-story-mist/80">
            <p>
              Arinda Catherine is a lawyer by profession and an award-winning youth leader by passion, working at the
              forefront of social and environmental justice. She specializes in transforming legal frameworks into
              grassroots action, utilizing the law as a powerful catalyst for social and environmental reform.
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
