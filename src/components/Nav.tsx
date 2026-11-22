"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Moon, Sun, X } from "lucide-react";

const links = [
  ["About", "#about"],
  ["Journey", "#journey"],
  ["Experience", "#experience"],
  ["Projects", "#projects"],
  ["Off-screen", "#off-screen"],
  ["Contact", "#contact"],
] as const;

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const dark = !mounted || resolvedTheme !== "light";
  return (
    <button
      onClick={() => setTheme(dark ? "light" : "dark")}
      className="relative flex h-9 w-9 items-center justify-center rounded-full border border-line transition hover:border-accent"
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={dark ? "moon" : "sun"} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.25 }}>
          {dark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <nav className={`mx-auto flex max-w-6xl items-center justify-between rounded-full px-4 py-2 transition-all duration-500 sm:px-6 ${scrolled || open ? "glass shadow-[0_8px_40px_-12px_var(--blob-1)]" : ""}`}>
        <a href="#top" className="font-display text-2xl italic tracking-wide">
          Srushti<span className="text-accent">.</span>
        </a>
        <div className="flex items-center gap-1 sm:gap-2">
          <ul className="hidden items-center gap-1 md:flex">
            {links.map(([label, href]) => (
              <li key={href}>
                <a href={href} className="rounded-full px-3 py-1.5 text-sm text-muted transition hover:text-fg">{label}</a>
              </li>
            ))}
          </ul>
          <ThemeToggle />
          <button className="flex h-9 w-9 items-center justify-center rounded-full border border-line md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu" aria-expanded={open}>
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.ul initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="glass mx-auto mt-2 max-w-6xl rounded-3xl p-3 md:hidden">
            {links.map(([label, href]) => (
              <li key={href}>
                <a href={href} onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3 font-display text-xl">{label}</a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}
