"use client";
import { motion } from "framer-motion";

export function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Section({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: React.ReactNode; children: React.ReactNode }) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
      <Reveal>
        <p className="text-[11px] uppercase tracking-[0.3em] text-accent sm:text-xs">{eyebrow}</p>
        <h2 className="mt-3 font-display text-[2.4rem] font-light leading-[1.05] sm:text-5xl md:text-6xl">{title}</h2>
      </Reveal>
      <div className="mt-10 sm:mt-14">{children}</div>
    </section>
  );
}

export function Tag({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-line bg-accent-soft/60 px-3 py-1 text-xs text-fg/80">{children}</span>;
}

export function LinkedInIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4v11H3v-11zm6.5 0h3.8v1.5h.06c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1v5.45h-4v-4.83c0-1.15-.02-2.63-1.6-2.63-1.6 0-1.85 1.25-1.85 2.55v4.91h-4v-11z" />
    </svg>
  );
}
