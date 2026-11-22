"use client";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Srushti's own hand-drawn mandala (public/images/mandala-mask.webp), used as a
 * CSS mask so it can be tinted with the theme colours.
 *  - `draw`: sweeps in once, like a pen going round the circle
 *  - spins very slowly (a GPU-only transform, so it costs almost nothing)
 */
export function Mandala({ className = "", draw = false, spin = true }: { className?: string; draw?: boolean; spin?: boolean }) {
  return (
    <div className={`${draw ? "mandala-draw" : ""} ${className}`} aria-hidden>
      <div className={`mandala-art ${spin ? "mandala-spin" : ""}`} />
    </div>
  );
}

/** Small mandala between sections that turns as you scroll. */
export function MandalaDivider() {
  const { scrollY } = useScroll();
  const rotate = useTransform(scrollY, (v) => v * 0.08);
  return (
    <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 sm:px-6" aria-hidden>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-line" />
      <motion.div style={{ rotate }} className="h-10 w-10 opacity-70 sm:h-12 sm:w-12">
        <div className="mandala-art" />
      </motion.div>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-line" />
    </div>
  );
}
