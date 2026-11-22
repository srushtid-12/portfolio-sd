"use client";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, LoaderCircle, Mail, Send } from "lucide-react";
import { profile } from "@/data/cv";
import { LinkedInIcon, Reveal, Section } from "./ui";
import { FormTerminal, emailOk } from "./FormTerminal";

type Status = "idle" | "sending" | "sent" | "error";
type Fields = { name: string; email: string; subject: string; message: string; company: string };
const empty: Fields = { name: "", email: "", subject: "", message: "", company: "" };

function validate(f: Fields) {
  const e: Partial<Record<keyof Fields, string>> = {};
  if (f.name.trim().length < 2) e.name = "Please enter your name.";
  if (!emailOk(f.email)) e.email = "Please enter a valid email.";
  if (f.message.trim().length < 10) e.message = "Message should be at least 10 characters.";
  return e;
}

export function Contact() {
  const [fields, setFields] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  const startedAt = useRef(Date.now());
  const [focus, setFocus] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const set = (k: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFields((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setAttempt((n) => n + 1);
    const v = validate(fields);
    setErrors(v);
    if (Object.keys(v).length) return;
    setStatus("sending");
    setServerError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, startedAt: startedAt.current }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        if (data.fieldErrors) setErrors(data.fieldErrors);
        throw new Error(data.error || "Something went wrong.");
      }
      setStatus("sent");
      setFields(empty);
    } catch (err) {
      setStatus("error");
      setServerError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const input = "w-full rounded-2xl border bg-bg/40 px-4 py-3 text-[15px] outline-none transition placeholder:text-muted/70 focus:border-accent focus:ring-4 focus:ring-accent/15";
  const field = (k: keyof Fields) => `${input} ${errors[k] ? "border-rose-400/70" : "border-line"}`;
  const err = (k: keyof Fields) => errors[k] && <p id={`${k}-err`} className="mt-1.5 text-xs text-rose-400">{errors[k]}</p>;

  return (
    <Section id="contact" eyebrow="Contact" title={<>Let&apos;s <em className="text-accent">talk</em></>}>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <p className="font-display text-2xl italic leading-snug text-fg/90">Open to working-student roles, consulting, digital transformation, QA and AI work in Germany.</p>
          <div className="mt-8 space-y-3">
            <a href={`mailto:${profile.email}`} className="glass flex min-w-0 items-center gap-3 break-all rounded-2xl px-4 py-3 text-sm transition hover:border-accent">
              <Mail className="h-4 w-4 shrink-0 text-accent" /> {profile.email}
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="glass flex min-w-0 items-center gap-3 break-all rounded-2xl px-4 py-3 text-sm transition hover:border-accent">
              <LinkedInIcon className="h-4 w-4 shrink-0 text-accent" /> linkedin.com/in/srushti-desai12
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-8">
          <form onSubmit={submit} noValidate onFocusCapture={(e) => setFocus((e.target as HTMLElement).id || null)} onBlurCapture={() => setFocus(null)} className="glass relative overflow-hidden rounded-3xl p-5 sm:p-8">
            <AnimatePresence>
              {status === "sent" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-bg/85 p-6 text-center backdrop-blur">
                  <CheckCircle2 className="h-10 w-10 text-accent" />
                  <p className="font-display text-3xl italic">Thank you!</p>
                  <p className="font-mono-ui text-xs text-emerald-400">✓ all tests passed · message delivered</p>
                  <p className="text-sm text-muted">I&apos;ll get back to you soon.</p>
                  <button type="button" onClick={() => { setStatus("idle"); setAttempt(0); startedAt.current = Date.now(); }} className="mt-2 text-sm text-accent underline-offset-4 hover:underline">Send another</button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-muted">Name</label>
                <input id="name" autoComplete="name" value={fields.name} onChange={set("name")} className={field("name")} placeholder="Your name" aria-invalid={!!errors.name} aria-describedby="name-err" maxLength={80} />
                {err("name")}
              </div>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-muted">Email</label>
                <input id="email" type="email" autoComplete="email" value={fields.email} onChange={set("email")} className={field("email")} placeholder="you@company.com" aria-invalid={!!errors.email} aria-describedby="email-err" maxLength={160} />
                {err("email")}
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="subject" className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-muted">Subject <span className="normal-case tracking-normal">(optional)</span></label>
              <input id="subject" value={fields.subject} onChange={set("subject")} className={field("subject")} placeholder="What's it about?" maxLength={120} />
              {err("subject")}
            </div>
            <div className="mt-4">
              <label htmlFor="message" className="mb-1.5 block text-xs uppercase tracking-[0.2em] text-muted">Message</label>
              <textarea id="message" rows={6} value={fields.message} onChange={set("message")} className={`${field("message")} resize-y`} placeholder="Tell me a little about it…" aria-invalid={!!errors.message} aria-describedby="message-err" maxLength={5000} />
              {err("message")}
            </div>

            {/* Live "test run" of the form: reacts as you type */}
            <FormTerminal fields={fields} focus={focus} status={status} attempt={attempt} serverError={serverError} />

            {/* Honeypot: hidden from people, tempting for bots */}
            <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
              <label htmlFor="company">Company</label>
              <input id="company" tabIndex={-1} autoComplete="off" value={fields.company} onChange={set("company")} />
            </div>

            <div className="mt-6 flex flex-col-reverse items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="min-h-5 text-sm text-rose-400" role="alert">{status === "error" ? serverError : ""}</p>
              <button type="submit" disabled={status === "sending"} className="flex items-center gap-2 rounded-full bg-fg px-6 py-3 text-sm text-bg transition hover:opacity-85 disabled:opacity-60">
                {status === "sending" ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {status === "sending" ? "Running…" : "Run tests & send"}
              </button>
            </div>
          </form>
        </Reveal>
      </div>
    </Section>
  );
}
