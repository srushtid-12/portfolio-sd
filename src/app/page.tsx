import { existsSync } from "node:fs";
import path from "node:path";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { About, Education, Experience, Projects, Skills } from "@/components/Sections";
import { Journey } from "@/components/Journey";
import { OffScreen } from "@/components/OffScreen";
import { Contact } from "@/components/Contact";
import { MandalaDivider } from "@/components/Mandala";
import { BugCounter, BugHuntProvider } from "@/components/BugHunt";
import { photos, profile } from "@/data/cv";

// Checked on the server, so no broken-image requests are made for photos you haven't added yet.
const img = (...p: string[]) => existsSync(path.join(process.cwd(), "public", "images", ...p));
const hasPhoto = img("profile.jpg");
const photoAvailable = photos.map((p) => img("photos", p.file));

export default function Home() {
  return (
    <BugHuntProvider>
      <Nav />
      <main>
        <Hero />
        <About hasPhoto={hasPhoto} />
        <MandalaDivider />
        <Journey />
        <MandalaDivider />
        <Experience />
        <MandalaDivider />
        <Projects />
        <MandalaDivider />
        <Skills />
        <Education />
        <MandalaDivider />
        <OffScreen available={photoAvailable} />
        <MandalaDivider />
        <Contact />
      </main>
      <footer className="mx-auto max-w-6xl px-4 pb-10 pt-6 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-3 border-t border-line pt-8 text-sm text-muted sm:flex-row">
          <p className="font-display text-lg italic">{profile.name}</p>
          <BugCounter />
          <p>© {new Date().getFullYear()} · Drawn &amp; tested in {profile.location.split(",")[0]}</p>
        </div>
      </footer>
    </BugHuntProvider>
  );
}
