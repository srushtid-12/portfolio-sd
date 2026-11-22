"use client";
import { useEffect, useState } from "react";

export type Tier = { low: boolean; reduced: boolean; mobile: boolean };

/**
 * Rough device capability check so 3D can scale down on weaker machines:
 * few CPU cores, little memory, touch-first devices, or reduced-motion users.
 */
export function useDeviceTier(): Tier {
  const [tier, setTier] = useState<Tier>({ low: true, reduced: false, mobile: false });
  useEffect(() => {
    const nav = navigator as Navigator & { deviceMemory?: number };
    const mobile = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const weakCpu = (nav.hardwareConcurrency ?? 4) <= 4;
    const weakMem = (nav.deviceMemory ?? 8) <= 4;
    setTier({ low: mobile || weakCpu || weakMem || reduced, reduced, mobile });
  }, []);
  return tier;
}

/** Tracks whether the browser tab is visible, so animation can stop when it isn't. */
export function usePageVisible() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const on = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", on);
    return () => document.removeEventListener("visibilitychange", on);
  }, []);
  return visible;
}
