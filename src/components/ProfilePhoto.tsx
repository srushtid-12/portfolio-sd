"use client";
import Image from "next/image";
import { useState } from "react";
import { ImageIcon } from "lucide-react";

/**
 * Profile photo with a soft skeleton.
 * Drop your picture at /public/images/profile.jpg (any orientation; it is cropped to a square, centred).
 * Until then, or if it fails to load, a placeholder is shown.
 */
export const PROFILE_PHOTO = "/images/profile.jpg";

export function ProfilePhoto({ available, alt }: { available: boolean; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const showImage = available && !failed;

  return (
    <div className="relative mx-auto w-full max-w-[340px] lg:max-w-none">
      {/* soft glow frame */}
      <div className="absolute -inset-3 rounded-[2.5rem] bg-gradient-to-br from-accent/35 via-accent-2/20 to-transparent opacity-70" aria-hidden />
      <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-line bg-bg-soft">
        {(!showImage || !loaded) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted">
            <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-accent-soft via-bg-soft to-accent-soft" />
            {!showImage && (
              <div className="relative flex flex-col items-center gap-2 px-6 text-center">
                <ImageIcon className="h-8 w-8 opacity-60" />
                <p className="text-xs leading-relaxed opacity-80">
                  Add your photo at
                  <br />
                  <code className="text-accent">public{PROFILE_PHOTO}</code>
                </p>
              </div>
            )}
          </div>
        )}
        {showImage && (
          <Image
            src={PROFILE_PHOTO}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 360px, 340px"
            className={`object-cover object-[50%_35%] transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
          />
        )}
      </div>
    </div>
  );
}
