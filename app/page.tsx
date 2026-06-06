"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import { AuroraButton } from "@/components/ui/aurora-button";
import { AnimatedHero } from "@/components/ui/animated-hero";
import { TrustedBy } from "@/components/ui/trusted-by";
import { HowItWorks } from "@/components/ui/how-it-works";
import { TestimonialsSection } from "@/components/ui/testimonials-section";
import { FAQSection } from "@/components/ui/faq-section";
import { AboutSection } from "@/components/ui/about-section";

type Lang = "de" | "en";

/* ── Navigation items ─────────────────────────────────────────────────── */
type NavItem =
  | { id: string; label: string; targetId: string; targetPage?: never }
  | { id: string; label: string; targetPage: string; targetId?: never };

const NAV_ITEMS: Record<Lang, NavItem[]> = {
  de: [
    { id: "how",          label: "Wie es funktioniert", targetId: "how-it-works" },
    { id: "testimonials", label: "Erfahrungen",         targetId: "testimonials" },
    { id: "faq",          label: "FAQ",                 targetId: "faq" },
    { id: "about",        label: "Über uns",            targetPage: "/about" },
  ],
  en: [
    { id: "how",          label: "How it Works",  targetId: "how-it-works" },
    { id: "testimonials", label: "Testimonials",  targetId: "testimonials" },
    { id: "faq",          label: "FAQs",          targetId: "faq" },
    { id: "about",        label: "Who we are",    targetPage: "/about" },
  ],
};

/* ── Pill nav ─────────────────────────────────────────────────────────── */
function SectionNav({ lang }: { lang: Lang }) {
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const items = NAV_ITEMS[lang];

  function handleClick(item: NavItem) {
    if (item.targetPage) { router.push(item.targetPage); return; }
    if (item.targetId) {
      document.getElementById(item.targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <nav
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 3,
        padding: "5px 10px",
        background: "rgba(255,255,255,0.13)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.22)",
        boxShadow: "0 2px 20px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.15)",
        overflow: "hidden",
      }}
    >
      {items.map((item, i) => {
        const isHovered = hoveredIndex === i;
        return (
          <button
            key={item.id}
            onClick={() => handleClick(item)}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{
              position: "relative",
              padding: "8px 20px",
              borderRadius: 999,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.015em",
              whiteSpace: "nowrap",
              overflow: "hidden",
              color: isHovered ? "#ffffff" : "rgba(255,255,255,0.60)",
              transition: "color 0.25s ease",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 999,
                background: "linear-gradient(135deg, #2d6a4f, #52b788)",
                opacity: isHovered ? 0.55 : 0,
                filter: "blur(9px)",
                transition: "opacity 0.4s ease",
                pointerEvents: "none",
              }}
            />
            <span style={{ position: "relative", zIndex: 1 }}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

/* ── Logo with collapsing wordmark ────────────────────────────────────── */
function NavLogo({ pastHero }: { pastHero: boolean }) {
  const { scrollY } = useScroll();
  const logoTextOpacity     = useTransform(scrollY, [0, 90], [1, 0]);
  const logoTextMaxWidth    = useTransform(scrollY, [0, 90], [140, 0]);
  const logoTextPaddingLeft = useTransform(scrollY, [0, 90], [8, 0]);

  return (
    <a href="#" className="flex items-center overflow-hidden" aria-label="werkseite.org">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-icon.png"
        alt=""
        className="shrink-0 rounded-lg"
        style={{ width: 36, height: 36, objectFit: "contain" }}
      />
      <motion.span
        style={{
          opacity: logoTextOpacity,
          maxWidth: logoTextMaxWidth,
          paddingLeft: logoTextPaddingLeft,
          overflow: "hidden",
          whiteSpace: "nowrap",
          display: "inline-block",
          fontFamily: "var(--font-display)",
          color: pastHero ? "#1c1917" : "#ffffff",
          transition: "color 0.3s ease",
        }}
        className="font-bold text-[1.05rem] tracking-tight"
      >
        werkseite
        <span style={{ color: pastHero ? "var(--color-brand-green)" : "rgba(255,255,255,0.55)" }}>
          .org
        </span>
      </motion.span>
    </a>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────── */
export default function Home() {
  const [lang, setLang] = useState<Lang>("de");
  const [scrolled,  setScrolled]  = useState(false);
  const [pastHero,  setPastHero]  = useState(false);

  const { scrollY } = useScroll();
  const sectionNavOpacity = useTransform(scrollY, [0, 100], [1, 0]);
  const sectionNavX       = useTransform(scrollY, [0, 100], [0, -32]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      /* Hero section is min-h-[160vh]; past ~2.1× vh it's fully scrolled */
      setPastHero(window.scrollY > window.innerHeight * 2.1);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-dvh" style={{ fontFamily: "var(--font-body)" }}>

      {/* ── Fixed scroll-aware navbar ─────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: !scrolled
            ? "transparent"
            : pastHero
            ? "rgba(255,255,255,0.85)"
            : "rgba(0,0,0,0.15)",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: pastHero && scrolled ? "1px solid rgba(0,0,0,0.05)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 grid grid-cols-3 items-center">

          {/* Left — logo */}
          <NavLogo pastHero={pastHero} />

          {/* Center — pill nav (desktop only, fades as user scrolls) */}
          <motion.div
            style={{ opacity: sectionNavOpacity, x: sectionNavX }}
            className="hidden lg:flex justify-center pointer-events-none"
          >
            <div className="pointer-events-auto">
              <SectionNav lang={lang} />
            </div>
          </motion.div>

          {/* Right — lang toggle + CTA */}
          <div className="flex items-center justify-end gap-2 md:gap-3">
            <AuroraButton
              onClick={() => setLang((l) => (l === "de" ? "en" : "de"))}
              aria-label="Switch language"
            >
              {lang === "de" ? "EN" : "DE"}
            </AuroraButton>

            <a
              href="#how-it-works"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg text-[11px] font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer"
              style={{
                fontFamily: "var(--font-display)",
                ...(pastHero
                  ? {
                      background: "var(--color-brand-green)",
                      color: "#fff",
                      boxShadow: "0 2px 12px color-mix(in srgb, var(--color-brand-green) 28%, transparent)",
                    }
                  : {
                      background: "rgba(255,255,255,0.15)",
                      color: "#fff",
                      border: "1px solid rgba(255,255,255,0.25)",
                    }),
              }}
            >
              {lang === "de" ? "Jetzt starten" : "Get started"}
            </a>
          </div>
        </div>
      </nav>

      {/* ── Sections ─────────────────────────────────────────────── */}
      <main className="flex-1">
        <AnimatedHero lang={lang} onLangChange={setLang} />
        <TrustedBy lang={lang} />
        <div id="how-it-works"><HowItWorks lang={lang} /></div>
        <div id="testimonials"><TestimonialsSection lang={lang} /></div>
        <div id="faq"><FAQSection lang={lang} /></div>
        <AboutSection lang={lang} />
      </main>

      {/* ── Footer ───────────────────────────────────────────────── */}
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
