"use client";
import Image from "next/image";
import { useState } from "react";
import { Camera } from "lucide-react";
import { photos } from "@/data/cv";
import { Reveal, Section } from "./ui";

const ratio = { tall: "aspect-[3/4]", wide: "aspect-[3/2]", square: "aspect-square" } as const;

function Photo({ file, place, year, shape, index, available }: (typeof photos)[number] & { index: number; available: boolean }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const show = available && !failed;
  return (
    <figure className="mb-5 break-inside-avoid">
      <div className={`relative overflow-hidden rounded-2xl border border-line bg-bg-soft ${ratio[shape]}`}>
        {(!show || !loaded) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted">
            <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-accent-soft via-bg-soft to-accent-soft" />
            {!show && (
              <div className="relative flex flex-col items-center gap-1.5 px-4 text-center">
                <Camera className="h-6 w-6 opacity-60" />
                <code className="text-[11px] text-accent">public/images/photos/{file}</code>
              </div>
            )}
          </div>
        )}
        {show && (
          <Image
            src={`/images/photos/${file}`}
            alt={`Photograph: ${place}`}
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            className={`object-cover transition duration-700 hover:scale-[1.03] ${loaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
          />
        )}
      </div>
      {/* contact-sheet style caption */}
      <figcaption className="font-mono-ui mt-2 flex justify-between text-[11px] text-muted">
        <span>{String(index + 1).padStart(2, "0")} · {place}</span>
        <span>{year}</span>
      </figcaption>
    </figure>
  );
}

export function OffScreen({ available }: { available: boolean[] }) {
  return (
    <Section id="off-screen" eyebrow="Off-screen" title={<>When I&apos;m not testing, I&apos;m <em className="text-accent">noticing</em></>}>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
        <Reveal className="lg:col-span-5">
          <figure className="lg:sticky lg:top-28">
            <div className="relative rotate-[-1.5deg] rounded-sm bg-[#f4f1e8] p-3 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] sm:p-4">
              <Image src="/images/mandala-original.jpg" alt="Hand-drawn mandala with sunflowers, pen on paper, by Srushti Desai" width={1000} height={1400} sizes="(min-width: 1024px) 420px, 90vw" className="h-auto w-full" />
            </div>
            <figcaption className="mt-5 max-w-sm">
              <p className="font-display text-2xl italic">Pen on paper.</p>
              <p className="mt-1 text-sm text-muted">The mandala turning at the top of this site is this drawing. Mandalas and testing need the same thing: patience, and an eye for the one line that&apos;s out of place.</p>
            </figcaption>
          </figure>
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-7">
          <p className="mb-6 max-w-lg text-[15px] text-fg/80">Photography trains the same muscle as exploratory testing: slow down, look again, and notice what everyone else walked past.</p>
          <div className="columns-1 gap-5 min-[480px]:columns-2">
            {photos.map((p, i) => <Photo key={p.file} {...p} index={i} available={available[i]} />)}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
