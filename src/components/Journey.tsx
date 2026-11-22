"use client";
import { useLayoutEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { Plane } from "lucide-react";
import { journey } from "@/data/cv";
import { Section } from "./ui";

const W = 1000;
const H = 340;
// A loose, hand-drawn-feeling route from Pune (bottom left) to Nürnberg (top right).
const ROUTE = "M70,262 C190,268 230,150 340,170 S520,290 610,214 S760,70 860,92 S930,80 940,74";

type Pt = { x: number; y: number };

export function Journey() {
  const target = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
  const head = useRef<SVGGElement>(null);
  const [points, setPoints] = useState<Pt[]>([]);
  const [reached, setReached] = useState(0);

  const { scrollYProgress } = useScroll({ target, offset: ["start 80%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 24, restDelta: 0.001 });

  useLayoutEffect(() => {
    const p = path.current;
    if (!p) return;
    const len = p.getTotalLength();
    setPoints(journey.stops.map((s) => { const q = p.getPointAtLength(s.at * len); return { x: q.x, y: q.y }; }));
  }, []);

  useMotionValueEvent(progress, "change", (v) => {
    const n = journey.stops.filter((s) => v >= s.at - 0.01).length;
    setReached((r) => (r === n ? r : n));
    const p = path.current;
    if (p && head.current) {
      const q = p.getPointAtLength(Math.min(Math.max(v, 0), 1) * p.getTotalLength());
      head.current.setAttribute("transform", `translate(${q.x} ${q.y})`);
    }
  });

  return (
    <Section id="journey" eyebrow="The route so far" title={<>From <em className="text-accent">{journey.from.city}</em> to <em className="text-accent">{journey.to.city}</em></>}>
      <div ref={target}>
        {/* Desktop / tablet: cities on top, the drawn route below */}
        <div className="hidden items-end justify-between gap-6 md:flex">
          <div>
            <p className="font-display text-4xl italic lg:text-5xl">{journey.from.city}</p>
            <p className="text-xs uppercase tracking-[0.25em] text-muted">{journey.from.country}</p>
          </div>
          <div className="mb-3 flex flex-1 items-center gap-3 text-xs text-muted">
            <span className="h-px flex-1 border-t border-dashed border-line" />
            <Plane className="h-4 w-4 text-accent" /> {journey.distance}
            <span className="h-px flex-1 border-t border-dashed border-line" />
          </div>
          <div className="text-right">
            <p className="font-display text-4xl italic lg:text-5xl">{journey.to.city}</p>
            <p className="text-xs uppercase tracking-[0.25em] text-muted">{journey.to.country}</p>
          </div>
        </div>
        <div className="relative mb-16 mt-24 hidden md:block" style={{ aspectRatio: `${W} / ${H}` }}>
          <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
            <path d={ROUTE} fill="none" stroke="var(--border)" strokeWidth="2" strokeDasharray="2 8" strokeLinecap="round" />
            <motion.path ref={path} d={ROUTE} fill="none" stroke="url(#route)" strokeWidth="2.5" strokeLinecap="round" style={{ pathLength: progress }} />
            <defs>
              <linearGradient id="route" x1="0" x2="1">
                <stop offset="0" stopColor="var(--accent)" />
                <stop offset="1" stopColor="var(--accent-2)" />
              </linearGradient>
            </defs>
            {points.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={i < reached ? 6 : 4} fill={i < reached ? "var(--accent)" : "var(--bg)"} stroke="var(--accent)" strokeWidth="1.5" style={{ transition: "r .4s, fill .4s" }} />
            ))}
            <g ref={head}>
              <circle r="10" fill="var(--accent)" opacity="0.25" />
              <circle r="4" fill="var(--accent-2)" />
            </g>
          </svg>

          {/* Stops */}
          {points.map((p, i) => {
            const s = journey.stops[i];
            const above = s.side === "up";
            return (
              <div
                key={s.year + s.title}
                className="absolute w-32 text-center transition-opacity duration-500 lg:w-40"
                style={{
                  left: `${(p.x / W) * 100}%`,
                  top: `${(p.y / H) * 100}%`,
                  transform: `translate(-50%, ${above ? "calc(-100% - 18px)" : "18px"})`,
                  opacity: i < reached ? 1 : 0.15,
                }}
              >
                <p className="font-mono-ui text-[11px] text-accent">{s.year}</p>
                <p className="font-display text-lg leading-tight">{s.title}</p>
                <p className="text-[11px] text-muted">{s.place}</p>
              </div>
            );
          })}
        </div>

        {/* Phones: the same story as a vertical route */}
        <div className="relative pl-8 md:hidden">
          <div className="absolute bottom-2 left-[7px] top-2 w-px bg-line" />
          <motion.div className="absolute bottom-2 left-[7px] top-2 w-px origin-top bg-gradient-to-b from-accent to-accent-2" style={{ scaleY: progress }} />
          <p className="font-display text-3xl italic">{journey.from.city} <span className="text-sm not-italic text-muted">{journey.from.country}</span></p>
          <ol className="mt-6 space-y-6">
            {journey.stops.map((s, i) => (
              <li key={s.year + s.title} className="relative transition-opacity duration-500" style={{ opacity: i < reached ? 1 : 0.3 }}>
                <span className={`absolute -left-[29px] top-1.5 h-3 w-3 rounded-full border border-accent transition-colors ${i < reached ? "bg-accent" : "bg-bg"}`} />
                {s.year === "2024" && (
                  <p className="mb-2 flex items-center gap-1.5 text-xs text-muted"><Plane className="h-3.5 w-3.5 text-accent" /> {journey.distance}</p>
                )}
                <p className="font-mono-ui text-[11px] text-accent">{s.year}</p>
                <p className="font-display text-xl leading-tight">{s.title}</p>
                <p className="text-xs text-muted">{s.place}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 font-display text-3xl italic">{journey.to.city} <span className="text-sm not-italic text-muted">{journey.to.country}</span></p>
        </div>
      </div>
    </Section>
  );
}
