"use client";
import { Award, GraduationCap, Languages, Sparkles } from "lucide-react";
import { award, certificates, education, experience, languages, principles, profile, projects, skills } from "@/data/cv";
import { HiddenBug } from "./BugHunt";
import { diagrams } from "@/data/diagrams";
import { DiagramCard } from "./diagrams/DiagramCard";
import { Reveal, Section, Tag } from "./ui";
import { ProfilePhoto } from "./ProfilePhoto";

export function About({ hasPhoto = false }: { hasPhoto?: boolean }) {
  return (
    <Section id="about" eyebrow="About" title={<>{profile.intro.replace("Srushti.", "")}<em className="text-accent">Srushti.</em></>}>
      <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-12 lg:gap-14">
        <Reveal className="md:col-span-5 lg:col-span-4">
          <ProfilePhoto available={hasPhoto} alt={`Portrait of ${profile.name}`} />
        </Reveal>
        <Reveal delay={0.1} className="md:col-span-7 lg:col-span-8">
          <p className="text-base leading-relaxed text-fg/85 sm:text-lg lg:text-xl">{profile.summary}</p>
          <p className="mt-5 flex items-start gap-3 text-sm text-muted sm:text-base">
            <Sparkles className="mt-1 h-4 w-4 shrink-0 text-accent" />
            {profile.learning}
          </p>
          <div className="mt-8 grid grid-cols-1 gap-3 min-[420px]:grid-cols-3">
            {profile.stats.map((s) => (
              <div key={s.label} className="glass flex items-baseline gap-3 rounded-3xl p-4 min-[420px]:block sm:p-5">
                <p className="font-display text-3xl text-accent sm:text-4xl">{s.value}</p>
                <p className="mt-1 text-xs text-muted sm:text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
      <div className="mt-16 sm:mt-20">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.3em] text-accent sm:text-xs">How I work</p>
        </Reveal>
        <ol className="mt-6 divide-y divide-line border-y border-line">
          {principles.map((pr, i) => (
            <Reveal key={pr.title} delay={i * 0.08}>
              <li className="grid grid-cols-1 gap-2 py-7 sm:grid-cols-12 sm:gap-8 sm:py-9">
                <span className="font-display text-5xl font-light italic text-accent/60 sm:col-span-1 sm:text-6xl">{i + 1}</span>
                <p className="font-display text-2xl leading-snug sm:col-span-5 sm:text-3xl">{pr.title}</p>
                <div className="sm:col-span-6">
                  <p className="text-[15px] leading-relaxed text-fg/80">{pr.body}</p>
                  <p className="font-mono-ui mt-2 text-[11px] text-muted">→ {pr.proof}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
}

export function Experience() {
  return (
    <Section id="experience" eyebrow="Experience" title={<>What I actually <em className="text-accent">did</em>, drawn out</>}>
      <div className="space-y-16 sm:space-y-24 lg:space-y-28">
        {experience.map((job, i) => (
          <article key={job.id} className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
            <Reveal className={`lg:col-span-5 ${i % 2 ? "lg:order-2" : ""}`}>
              <p className="text-[11px] uppercase tracking-[0.25em] text-muted sm:text-xs">{job.period} · {job.place}</p>
              <h3 className="mt-3 font-display text-[2.2rem] font-light leading-tight sm:text-5xl">{job.company}</h3>
              <p className="mt-1 text-accent">{job.role}</p>
              <p className="mt-5 font-display text-xl italic leading-snug text-fg/90">{job.summary}</p>
              <p className="mt-4 border-l-2 border-accent/60 pl-4 text-[15px] text-fg/80"><span className="font-mono-ui text-[11px] uppercase tracking-wider text-accent">The hard part · </span>{job.challenge}</p>
              <ul className="mt-5 space-y-2.5">
                {job.bullets.map((b) => (
                  <li key={b} className="flex gap-3 text-[15px] text-fg/80">
                    <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {b}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap gap-2">{job.tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>
            </Reveal>
            <Reveal delay={0.1} className={`lg:col-span-7 ${i % 2 ? "lg:order-1" : ""}`}>
              <DiagramCard diagram={diagrams[job.id]} />
            </Reveal>
          </article>
        ))}
      </div>
    </Section>
  );
}

export function Projects() {
  return (
    <Section id="projects" eyebrow="Projects" title={<>Things I built <em className="text-accent">before</em> anyone paid me to</>}>
      <div className="space-y-16 sm:space-y-20">
        {projects.map((p, i) => (
          <article key={p.id} className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12 lg:gap-12">
            <Reveal className={`lg:col-span-4 ${i % 2 ? "lg:order-2" : ""}`}>
              <p className="text-xs uppercase tracking-[0.25em] text-muted">{p.period}</p>
              <h3 className="mt-2 font-display text-3xl font-light sm:text-4xl">{p.name}</h3>
              <p className="mt-3 text-[15px] text-fg/80">{p.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">{p.tags.map((t) => <Tag key={t}>{t}</Tag>)}</div>
            </Reveal>
            <Reveal delay={0.1} className={`lg:col-span-8 ${i % 2 ? "lg:order-1" : ""}`}>
              <DiagramCard diagram={diagrams[p.id]} height="h-[420px] min-[480px]:h-[340px]" />
            </Reveal>
          </article>
        ))}
      </div>
    </Section>
  );
}

export function Skills() {
  return (
    <Section id="skills" eyebrow="Skills" title={<>What&apos;s in my <em className="text-accent">toolbox</em></>}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((g, i) => (
          <Reveal key={g.group} delay={i * 0.05}>
            <div className="glass relative h-full rounded-3xl p-6">
              {/* A tester's portfolio should have exactly one bug, hidden where it belongs */}
              {g.group === "Software testing" && <HiddenBug className="absolute bottom-3 right-4 rotate-[-18deg]" />}
              <p className="font-display text-2xl italic">{g.group}</p>
              <div className="mt-4 flex flex-wrap gap-2">{g.items.map((s) => <Tag key={s}>{s}</Tag>)}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export function Education() {
  return (
    <Section id="education" eyebrow="Education & recognition" title={<>Still a <em className="text-accent">student</em>, on purpose</>}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          {education.map((e) => (
            <Reveal key={e.degree}>
              <div className="glass rounded-3xl p-6">
                <GraduationCap className="h-5 w-5 text-accent" />
                <p className="mt-3 text-xs uppercase tracking-[0.25em] text-muted">{e.period}</p>
                <h3 className="mt-2 font-display text-3xl font-light">{e.degree}</h3>
                <p className="text-accent">{e.school}</p>
                <p className="mt-3 text-[15px] text-fg/80">{e.note}</p>
                {e.highlights.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{e.highlights.map((h) => <Tag key={h}>{h}</Tag>)}</div>}
              </div>
            </Reveal>
          ))}
        </div>
        <div className="space-y-6">
          <Reveal delay={0.1}>
            <div className="glass rounded-3xl p-6">
              <Award className="h-5 w-5 text-accent" />
              <h3 className="mt-3 font-display text-3xl font-light">Certificates</h3>
              <ul className="mt-4 space-y-3">
                {certificates.map((c) => (
                  <li key={c} className="flex gap-3 text-[15px] text-fg/85"><span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-accent" />{c}</li>
                ))}
              </ul>
              <div className="mt-6 rounded-2xl bg-accent-soft/70 p-4">
                <p className="font-display text-xl italic">{award.name} · {award.date}</p>
                <p className="mt-1 text-sm text-muted">{award.note}</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="glass rounded-3xl p-6">
              <Languages className="h-5 w-5 text-accent" />
              <div className="mt-3 grid grid-cols-1 gap-3 min-[420px]:grid-cols-3">
                {languages.map((l) => (
                  <div key={l.name}>
                    <p className="font-display text-2xl">{l.name}</p>
                    <p className="text-xs text-muted">{l.level}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
