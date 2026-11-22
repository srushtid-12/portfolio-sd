"use client";
import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

/**
 * Drives a frameloop="demand" canvas at a capped frame rate, and not at all when
 * `running` is false. Capping to 30fps roughly halves GPU work versus 60fps,
 * and the slow, floaty motion looks the same.
 */
export function Ticker({ fps, running }: { fps: number; running: boolean }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    invalidate(); // always draw at least one frame
    if (!running) return;
    const id = setInterval(() => invalidate(), 1000 / fps);
    return () => clearInterval(id);
  }, [fps, running, invalidate]);
  return null;
}
