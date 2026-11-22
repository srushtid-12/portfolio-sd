import { setConsoleFunction } from "three";

/**
 * @react-three/fiber 9.x still creates a THREE.Clock internally, which three r183+
 * flags as deprecated. It's harmless and will go away once fiber v10 is stable.
 * Using three's official console hook, drop only that one notice and pass
 * every other three.js message through unchanged.
 */
let installed = false;
export function quietThreeClockDeprecation() {
  if (installed) return;
  installed = true;
  setConsoleFunction((type: string, message: string, ...params: unknown[]) => {
    if (type === "warn" && message.startsWith("THREE.Clock")) return;
    const fn = (console as unknown as Record<string, (...a: unknown[]) => void>)[type] ?? console.log;
    fn(message, ...params);
  });
}

quietThreeClockDeprecation();
