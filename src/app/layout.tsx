import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});
const sans = Jost({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--font-jost", display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Srushti Desai · AI Test Automation & Digital Transformation",
  description:
    "Portfolio of Srushti Desai: AI-first test automation, quality engineering and digital transformation. MSc International Information Systems, FAU Erlangen-Nürnberg.",
  openGraph: {
    title: "Srushti Desai · Portfolio",
    description: "AI-first test automation, quality engineering and digital transformation.",
    url: siteUrl,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0d0a15" },
    { media: "(prefers-color-scheme: light)", color: "#f8f4fd" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans font-light antialiased">
        <Providers>
          <div className="dream-bg" aria-hidden>
            <span />
            <span />
            <span />
          </div>
          {children}
        </Providers>
      </body>
    </html>
  );
}
