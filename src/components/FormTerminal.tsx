"use client";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { useEffect } from "react";

type Fields = { name: string; email: string; subject: string; message: string; company: string };
type State = "pass" | "warn" | "fail" | "skip";
type Line = { key: string; field?: keyof Fields; state: State; text: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clip = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

export function emailOk(e: string) { return EMAIL.test(e.trim()); }

/** Turns the current form values into friendly, test-runner style lines. */
function lines(f: Fields): Line[] {
  const name = f.name.trim();
  const email = f.email.trim();
  const subject = f.subject.trim();
  const msg = f.message.trim();
  const first = name.split(/\s+/)[0];

  const nameLine: Line = !name
    ? { key: "name", field: "name", state: "fail", text: "name: required. Who am I talking to?" }
    : name.length < 2
      ? { key: "name", field: "name", state: "warn", text: "name: one more letter…" }
      : { key: "name", field: "name", state: "pass", text: `name: nice to meet you, ${clip(first, 18)}!` };

  const emailLine: Line = !email
    ? { key: "email", field: "email", state: "fail", text: "email: required, so I can write back" }
    : !email.includes("@")
      ? { key: "email", field: "email", state: "warn", text: "email: missing an @" }
      : /@[^.]*$/.test(email) || /\.$|\.[^.]$/.test(email)
        ? { key: "email", field: "email", state: "warn", text: "email: almost there, needs a domain like .com" }
        : !EMAIL.test(email)
          ? { key: "email", field: "email", state: "warn", text: "email: hmm, that doesn't look quite right" }
          : { key: "email", field: "email", state: "pass", text: `email: valid. I'll reply to ${clip(email, 28)}` };

  const subjectLine: Line = !subject
    ? { key: "subject", field: "subject", state: "skip", text: "subject: optional, skipped" }
    : { key: "subject", field: "subject", state: "pass", text: `subject: "${clip(subject, 30)}"` };

  const msgLine: Line = !msg
    ? { key: "message", field: "message", state: "fail", text: "message: required. Say hi, ask anything" }
    : msg.length < 10
      ? { key: "message", field: "message", state: "warn", text: `message: ${msg.length}/10 characters, a little more` }
      : msg.length < 280
        ? { key: "message", field: "message", state: "pass", text: `message: ${msg.length} characters, looks great` }
        : { key: "message", field: "message", state: "pass", text: `message: ${msg.length} characters, a proper letter! I'll read every word` };

  const human: Line = f.company
    ? { key: "human", state: "fail", text: "human check: beep boop? 🤖" }
    : { key: "human", state: "pass", text: "human check: passed, no robots here" };

  return [nameLine, emailLine, subjectLine, msgLine, human];
}

const icon: Record<State, string> = { pass: "✓", warn: "…", fail: "✗", skip: "○" };
const tone: Record<State, string> = { pass: "text-emerald-400", warn: "text-amber-300", fail: "text-rose-400", skip: "text-muted" };

export function failingCount(f: Fields) {
  return lines(f).filter((l) => l.state === "fail" || l.state === "warn").length;
}

export function FormTerminal({
  fields, focus, status, attempt, serverError,
}: { fields: Fields; focus: string | null; status: "idle" | "sending" | "sent" | "error"; attempt: number; serverError: string }) {
  const ls = lines(fields);
  const failed = ls.filter((l) => l.state === "fail").length;
  const pending = ls.filter((l) => l.state === "warn").length;
  const passed = ls.filter((l) => l.state === "pass").length;
  const allGood = failed + pending === 0;
  const controls = useAnimationControls();

  // Shake when someone tries to send with failing checks.
  useEffect(() => {
    if (attempt > 0 && !allGood) controls.start({ x: [0, -8, 8, -6, 6, -3, 0], transition: { duration: 0.45 } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt]);

  return (
    <motion.div animate={controls} className="font-mono-ui mt-5 overflow-hidden rounded-2xl border border-line bg-[#0b0912]/80 text-[11px] text-[#d8d0ea] shadow-inner sm:text-xs" aria-live="polite">
      <div className="flex items-center gap-1.5 border-b border-white/5 px-4 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-300/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
        <span className="ml-2 text-[10px] text-white/40">contact-form.spec.ts</span>
      </div>
      <div className="space-y-1 px-4 py-3">
        <p className="text-white/50"><span className="text-[#c9b6ff]">$</span> npx playwright test contact-form --watch</p>
        {ls.map((l) => (
          <div key={l.key} className={`-mx-2 flex gap-2 rounded px-2 py-0.5 transition-colors ${focus && l.field === focus ? "bg-white/[0.06]" : ""}`}>
            <span className={`w-3 shrink-0 text-center ${tone[l.state]}`}>{focus && l.field === focus ? "▸" : icon[l.state]}</span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={l.text} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className={l.state === "pass" ? "text-[#e9e3f5]" : l.state === "skip" ? "text-white/40" : tone[l.state]}>
                {l.text}
              </motion.span>
            </AnimatePresence>
          </div>
        ))}
        <div className="pt-1.5">
          {status === "sending" ? (
            <p className="text-[#c9b6ff]">→ all green, sending via Resend<span className="animate-pulse">…</span></p>
          ) : status === "error" ? (
            <p className="text-rose-400">✗ send failed: {serverError}</p>
          ) : attempt > 0 && !allGood ? (
            <p className="text-rose-400">✗ run aborted: fix the {failed + pending} failing check{failed + pending > 1 ? "s" : ""} above</p>
          ) : allGood ? (
            <p className="text-emerald-400">✓ all checks passed. Hit &ldquo;Run tests &amp; send&rdquo;</p>
          ) : (
            <p className="text-white/50">
              Tests: {failed > 0 && <span className="text-rose-400">{failed} failed</span>}
              {failed > 0 && (pending > 0 || passed > 0) && ", "}
              {pending > 0 && <span className="text-amber-300">{pending} in progress</span>}
              {pending > 0 && passed > 0 && ", "}
              {passed > 0 && <span className="text-emerald-400">{passed} passed</span>}
            </p>
          )}
          <span className="inline-block h-3.5 w-1.5 translate-y-0.5 animate-pulse bg-[#c9b6ff]/80" />
        </div>
      </div>
    </motion.div>
  );
}
