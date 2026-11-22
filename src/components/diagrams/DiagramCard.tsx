"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Hand, Pause, Play } from "lucide-react";
import type { Diagram } from "@/data/diagrams";
import type { Palette } from "./FlowScene";
import { useDeviceTier, usePageVisible } from "@/lib/use-device-tier";

const FlowScene = dynamic(() => import("./FlowScene"), { ssr: false, loading: () => <SceneSkeleton /> });

const palettes: Record<"dark" | "light", Palette> = {
  dark: { a: "#c9b6ff", b: "#9fb4ff", c: "#8a7fa8", good: "#a8f0d4", bad: "#ffa8c5", line: "#d9c9ff", spark: "#e9dcff", dark: true },
  light: { a: "#8b6be0", b: "#6f86e8", c: "#b3a6cc", good: "#3fbf94", bad: "#e46a93", line: "#9277dc", spark: "#a98bf0", dark: false },
};

const STEP_MS = 2800;

function SceneSkeleton() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="h-24 w-24 animate-pulse rounded-full bg-gradient-to-br from-accent/30 to-accent-2/20" />
    </div>
  );
}

export function DiagramCard({ diagram, height = "h-[460px] min-[480px]:h-[380px] sm:h-[400px]" }: { diagram: Diagram; height?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  // Load the 3D scene only when the card gets near the screen. Once loaded it
  // stays mounted but renders zero frames while off-screen (see `running`).
  const near = useInView(wrap, { margin: "250px 0px" });
  const [mounted, setMounted] = useState(false);
  useEffect(() => { if (near) setMounted(true); }, [near]);
  const visible = useInView(wrap, { margin: "0px" });
  const pageVisible = usePageVisible();
  const { low, reduced, mobile } = useDeviceTier();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const { resolvedTheme } = useTheme();
  const palette = palettes[resolvedTheme === "light" ? "light" : "dark"];
  const running = visible && pageVisible && !reduced;

  useEffect(() => {
    if (!playing || !running) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % diagram.nodes.length), STEP_MS);
    return () => clearInterval(t);
  }, [playing, running, diagram.nodes.length]);

  const active = diagram.nodes[index];
  const select = (id: string) => {
    setPlaying(false);
    setIndex(diagram.nodes.findIndex((n) => n.id === id));
  };

  return (
    <div ref={wrap} className="glass overflow-hidden rounded-3xl">
      <div className={`relative ${height}`} style={{ touchAction: "pan-y" }}>
        {mounted ? (
          <FlowScene nodes={diagram.nodes} edges={diagram.edges} activeId={active?.id ?? null} onSelect={select} palette={palette} running={running} low={low} touch={mobile} />
        ) : (
          <SceneSkeleton />
        )}
        <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-bg/70 px-2.5 py-1 text-[11px] text-muted sm:left-4 sm:top-4 sm:text-xs">
          <Hand className="h-3.5 w-3.5" /> {mobile ? "tap a shape" : "drag to rotate · click a shape"}
        </div>
        <button
          onClick={() => setPlaying((p) => !p)}
          className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full border border-line bg-bg/70 px-3 py-1 text-xs transition hover:border-accent sm:right-4 sm:top-4"
          aria-label={playing ? "Pause walkthrough" : "Play walkthrough"}
        >
          {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {playing ? "Pause" : "Play"}
        </button>
      </div>

      <div className="border-t border-line p-4 sm:p-6">
        <p className="font-display text-xl italic leading-snug sm:text-2xl">{diagram.title}</p>
        <p className="mt-1 text-sm text-muted">{diagram.hint}</p>

        <div className="mt-4 flex flex-wrap gap-1.5 sm:gap-2" role="tablist" aria-label="Diagram steps">
          {diagram.nodes.map((n, i) => (
            <button
              key={n.id}
              role="tab"
              aria-selected={i === index}
              onClick={() => select(n.id)}
              className={`rounded-full border px-2.5 py-1 text-[11px] transition sm:px-3 sm:text-xs ${i === index ? "border-accent bg-accent-soft text-fg" : "border-line text-muted hover:text-fg"}`}
            >
              <span className="mr-1 opacity-60">{i + 1}</span>
              {n.label}
            </button>
          ))}
        </div>

        <div className="mt-4 min-h-[4.5rem] sm:min-h-[3.5rem]" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.p key={active?.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }} className="text-[15px] leading-relaxed">
              <span className="font-medium text-accent">{active?.label}: </span>
              {active?.detail}
            </motion.p>
          </AnimatePresence>
        </div>

        {diagram.metric && <Metric {...diagram.metric} />}
      </div>
    </div>
  );
}

function Metric({ label, from, to }: { label: string; from: number; to: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="mt-4 space-y-2">
      <div className="flex justify-between text-xs text-muted">
        <span>{label}</span>
        <span>{from}% → <span className="font-medium text-accent">{to}%</span></span>
      </div>
      <div className="relative h-2 overflow-hidden rounded-full bg-accent-soft">
        <div className="absolute inset-y-0 left-0 rounded-full bg-muted/40" style={{ width: `${from}%` }} />
        <motion.div
          className="absolute inset-y-0 left-0 origin-left rounded-full bg-gradient-to-r from-accent to-accent-2"
          style={{ width: `${to}%` }}
          initial={{ scaleX: from / to }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.8, delay: 0.3, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
