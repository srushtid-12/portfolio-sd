"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowDown, MapPin } from "lucide-react";
import { profile } from "@/data/cv";
import { Mandala } from "./Mandala";

gsap.registerPlugin(useGSAP);

const SUITE = ["hero", "about", "journey", "experience", "projects", "contact"];

/** A tiny "test run" of the portfolio itself: a nod to what I do. */
function TestRun() {
  const [step, setStep] = useState(-1);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setStep(SUITE.length); return; }
    const start = setTimeout(() => setStep(0), 1600);
    return () => clearTimeout(start);
  }, []);
  useEffect(() => {
    if (step < 0 || step >= SUITE.length) return;
    const t = setTimeout(() => setStep((s) => s + 1), 260);
    return () => clearTimeout(t);
  }, [step]);
  const done = step >= SUITE.length;
  return (
    <div className="hero-fade font-mono-ui mt-8 max-w-md rounded-2xl border border-line bg-bg/50 px-4 py-3 text-[11px] leading-relaxed text-muted sm:text-xs">
      <p><span className="text-accent">$</span> npx playwright test portfolio</p>
      <p className="mt-1 flex flex-wrap gap-x-3">
        {SUITE.map((s, i) => (
          <span key={s} className={`transition-opacity duration-300 ${i < step || done ? "opacity-100" : "opacity-0"}`}>
            <span className="text-emerald-400">✓</span> {s}
          </span>
        ))}
      </p>
      <p className={`mt-1 transition-opacity duration-500 ${done ? "opacity-100" : "opacity-0"}`}>
        <span className="text-emerald-400">{SUITE.length} passed</span> · scroll down to see why
      </p>
    </div>
  );
}

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const rotate = useTransform(scrollY, [0, 900], [0, 50]);
  const fade = useTransform(scrollY, [0, 700], [1, 0.25]);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-char", { yPercent: 110, opacity: 0, stagger: 0.04, duration: 1 })
        .from(".hero-fade", { y: 18, opacity: 0, stagger: 0.1, duration: 0.8 }, "-=0.6");
    },
    { scope: root },
  );

  const [first, last] = profile.name.split(" ");
  const split = (w: string) =>
    w.split("").map((c, i) => (
      <span key={i} className="inline-block overflow-hidden pb-2 align-bottom">
        <span className="hero-char inline-block will-change-transform">{c}</span>
      </span>
    ));

  return (
    <section id="top" ref={root} className="relative overflow-hidden">
      <div className="mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-center px-4 pb-20 pt-24 sm:px-6 md:pt-28">
        {/* My hand-drawn mandala: in the flow on phones, large on the right from md up */}
        <motion.div
          style={{ rotate, opacity: fade }}
          className="pointer-events-none relative mx-auto mb-6 h-[230px] w-[230px] sm:h-[300px] sm:w-[300px] md:absolute md:right-[-4%] md:top-1/2 md:mx-0 md:mb-0 md:h-[360px] md:w-[360px] md:-translate-y-1/2 md:opacity-70 lg:h-[500px] lg:w-[500px] lg:opacity-100 xl:h-[580px] xl:w-[580px]"
        >
          <div className="absolute inset-[12%] rounded-full bg-[radial-gradient(circle,var(--blob-1)_0%,transparent_70%)] opacity-80" />
          <Mandala draw className="relative h-full w-full" />
        </motion.div>

        <div className="relative z-10 max-w-3xl">
          <p className="hero-fade mb-4 flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-muted sm:mb-6 sm:text-xs">
            <MapPin className="h-3.5 w-3.5" /> {profile.location}
          </p>
          <h1 className="font-display text-[clamp(3.25rem,14vw,9rem)] font-light leading-[0.9] tracking-tight">
            <span className="block">{split(first)}</span>
            <span className="block italic text-accent [text-shadow:0_0_40px_color-mix(in_srgb,var(--accent)_45%,transparent)]">{split(last)}</span>
          </h1>
          <p className="hero-fade mt-6 max-w-xl font-display text-xl italic leading-snug text-fg/90 sm:mt-8 sm:text-3xl">{profile.tagline}</p>
          <ul className="hero-fade mt-5 flex flex-wrap gap-x-3 gap-y-2 text-sm text-muted sm:mt-6 sm:gap-x-4">
            {profile.roles.map((r, i) => (
              <li key={r} className="flex items-center gap-3 sm:gap-4">
                {i > 0 && <span className="h-1 w-1 rounded-full bg-accent" />}
                {r}
              </li>
            ))}
          </ul>
          <TestRun />
          <div className="hero-fade mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#experience" className="rounded-full bg-fg px-6 py-3 text-center text-sm text-bg transition hover:opacity-85">See what I&apos;ve built</a>
            <a href="#contact" className="glass rounded-full px-6 py-3 text-center text-sm transition hover:border-accent">Say hello</a>
          </div>
        </div>
      </div>

      <a href="#about" className="hero-fade absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs text-muted sm:flex" aria-label="Scroll to about">
        scroll
        <ArrowDown className="h-4 w-4 animate-bounce" />
      </a>
    </section>
  );
}
