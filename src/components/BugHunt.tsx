"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bug, X } from "lucide-react";

type Ctx = { found: boolean; find: () => void };
const BugCtx = createContext<Ctx>({ found: false, find: () => {} });
const KEY = "sd-bug-found";

/** Holds whether the visitor found the hidden bug (remembered in localStorage). */
export function BugHuntProvider({ children }: { children: React.ReactNode }) {
  const [found, setFound] = useState(false);
  const [toast, setToast] = useState(false);
  useEffect(() => {
    try { setFound(localStorage.getItem(KEY) === "1"); } catch {}
  }, []);
  const find = () => {
    setToast(true);
    if (found) return;
    setFound(true);
    try { localStorage.setItem(KEY, "1"); } catch {}
  };
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(false), 6000);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <BugCtx.Provider value={{ found, find }}>
      {children}
      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            className="glass fixed inset-x-4 bottom-4 z-[60] mx-auto flex max-w-md items-start gap-3 rounded-2xl p-4 shadow-2xl sm:bottom-6"
          >
            <Bug className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <div className="text-sm">
              <p className="font-medium">You found a bug!</p>
              <p className="mt-0.5 text-muted">Finding these is literally my job. Want someone with that eye on your team? <a href="#contact" onClick={() => setToast(false)} className="text-accent underline-offset-4 hover:underline">Let&apos;s talk.</a></p>
            </div>
            <button onClick={() => setToast(false)} aria-label="Close" className="text-muted hover:text-fg"><X className="h-4 w-4" /></button>
          </motion.div>
        )}
      </AnimatePresence>
    </BugCtx.Provider>
  );
}

/** The bug itself: tiny, a little crooked, easy to miss. */
export function HiddenBug({ className = "" }: { className?: string }) {
  const { find, found } = useContext(BugCtx);
  return (
    <button
      onClick={find}
      aria-label="A small bug. Click to report it"
      title="Hmm, what's that?"
      className={`group inline-flex h-7 w-7 items-center justify-center rounded-full text-muted/50 transition hover:rotate-12 hover:text-accent ${className}`}
    >
      <Bug className={`h-3.5 w-3.5 transition-transform group-hover:scale-125 ${found ? "text-emerald-400/70" : ""}`} />
    </button>
  );
}

/** Footer counter. */
export function BugCounter() {
  const { found } = useContext(BugCtx);
  return <span className="font-mono-ui text-xs">bugs found: {found ? "1" : "0"}/1</span>;
}
