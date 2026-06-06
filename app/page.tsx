"use client";

import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { AuroraButton } from "@/components/ui/aurora-button";
import { AnimatedHero } from "@/components/ui/animated-hero";
import { TrustedBy } from "@/components/ui/trusted-by";
import { HowItWorks } from "@/components/ui/how-it-works";
import { TestimonialsSection } from "@/components/ui/testimonials-section";
import { AboutSection } from "@/components/ui/about-section";

type Lang = "de" | "en";

function NavLogo() {
  const { scrollY } = useScroll();
  const logoTextOpacity    = useTransform(scrollY, [0, 90], [1, 0]);
  const logoTextMaxWidth   = useTransform(scrollY, [0, 90], [160, 0]);
  const logoTextPaddingLeft = useTransform(scrollY, [0, 90], [10, 0]);

  return (
    <a href="#" className="flex items-center overflow-hidden" aria-label="werkseite.org">
      {/* Icon — always visible */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-icon.png"
        alt=""
        className="shrink-0 rounded-lg"
        style={{ width: 36, height: 36, objectFit: "contain" }}
      />

      {/* Wordmark — fades + collapses on scroll */}
      <motion.span
        style={{
          opacity: logoTextOpacity,
          maxWidth: logoTextMaxWidth,
          paddingLeft: logoTextPaddingLeft,
          overflow: "hidden",
          whiteSpace: "nowrap",
          display: "inline-block",
          fontFamily: "var(--font-display)",
        }}
        className="font-bold text-[1.05rem] tracking-tight text-ink"
      >
        werkseite<span className="text-brand-green">.org</span>
      </motion.span>
    </a>
  );
}

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
          <NavLogo />
          <AuroraButton
            onClick={() => setLang((l) => (l === "de" ? "en" : "de"))}
            aria-label="Switch language"
          >
            {lang === "de" ? "EN" : "DE"}
          </AuroraButton>
        </div>
      </header>

      {/* ── Sections ────────────────────────────────────────────── */}
      <main className="flex-1">
        <AnimatedHero lang={lang} onLangChange={setLang} />
        <TrustedBy lang={lang} />
        <HowItWorks lang={lang} />
        <TestimonialsSection lang={lang} />
        <AboutSection lang={lang} />
      </main>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer
        className="border-t border-border-subtle py-6"
        style={{ background: "#f0ede9" }}
      >
        <div className="max-w-3xl mx-auto px-6 flex items-center justify-between gap-4 flex-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-icon.png" alt="werkseite.org" style={{ height: 28, objectFit: "contain" }} />
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
