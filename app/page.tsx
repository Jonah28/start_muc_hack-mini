"use client";

import { useState } from "react";
import { AnimatedHero } from "@/components/ui/animated-hero";
import { HowItWorks } from "@/components/ui/how-it-works";
import { AboutSection } from "@/components/ui/about-section";

type Lang = "de" | "en";

export default function Home() {
  const [lang, setLang] = useState<Lang>("de");

  return (
    <div className="flex flex-col min-h-dvh" style={{ fontFamily: "var(--font-body)" }}>

      {/* ── Sticky header ────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-50 border-b border-border-subtle backdrop-blur-sm"
        style={{ background: "color-mix(in srgb, var(--color-surface) 88%, transparent)" }}
      >
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <span
            className="text-ink font-bold text-lg tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Handwerk<span className="text-brand-green">.digital</span>
          </span>
          <button
            onClick={() => setLang((l) => (l === "de" ? "en" : "de"))}
            className="text-[11px] font-bold tracking-widest text-ink-muted border border-border-subtle rounded-md px-3 py-1.5 hover:border-brand-green hover:text-brand-green hover:bg-brand-green-light transition-all cursor-pointer"
            aria-label="Switch language"
          >
            {lang === "de" ? "EN" : "DE"}
          </button>
        </div>
      </header>

      {/* ── Sections ────────────────────────────────────────────── */}
      <main className="flex-1">
        <AnimatedHero lang={lang} onLangChange={setLang} />
        <HowItWorks lang={lang} />
        <AboutSection lang={lang} />
      </main>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer
        className="border-t border-border-subtle py-6"
        style={{ background: "#f0ede9" }}
      >
        <div className="max-w-3xl mx-auto px-6 flex items-center justify-between gap-4 flex-wrap">
          <span
            className="font-bold text-ink tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Handwerk<span className="text-brand-green">.digital</span>
          </span>
          <p className="text-xs text-ink-muted">
            {lang === "de"
              ? "Gemacht für das deutsche Handwerk · start.muc Hackathon 2025"
              : "Made for German trades · start.muc Hackathon 2025"}
          </p>
        </div>
      </footer>
    </div>
  );
}
