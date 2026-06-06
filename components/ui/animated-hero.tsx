"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowRight, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { GameOverlay } from "@/components/ui/game-overlay";

const GREETINGS_DE = ["Moin", "Servus", "Hey", "Na", "Hallo", "Glück auf"];
const GREETINGS_EN = ["Hello", "Hi there", "Hey", "G'day", "Welcome"];

type Lang = "de" | "en";

const copy = {
  de: {
    badge: "Für Handwerker",
    headline: "Aus deiner alten Website wird in Minuten eine neue.",
    subline:
      "Einfach die URL deiner bisherigen Website eingeben. Wir lesen sie automatisch aus und erstellen eine moderne, professionelle Seite für dein Handwerk.",
    placeholder: "z. B. https://www.schmidt-heizung.de",
    cta: "Website starten",
    altLink: "Keine Website? Kurzbeschreibung eingeben",
    errorEmpty: "Bitte gib eine Website-Adresse ein.",
    errorInvalid:
      "Bitte gib eine gültige URL ein, z. B. https://www.deinbetrieb.de",
    scrollHint: "Scroll für mehr",
  },
  en: {
    badge: "For Tradespeople",
    headline: "Turn your old website into a new one in minutes.",
    subline:
      "Just enter the URL of your current website. We read it automatically and create a modern, professional site for your trade.",
    placeholder: "e.g. https://www.smith-plumbing.co.uk",
    cta: "Start website",
    altLink: "No website? Enter a short description",
    errorEmpty: "Please enter a website address.",
    errorInvalid:
      "Please enter a valid URL, e.g. https://www.yourbusiness.com",
    scrollHint: "Scroll for more",
  },
};

/* ── Floating emoji layer ──────────────────────────────────────────────── */
const TRADE_EMOJIS = [
  { emoji: "🔨", de: "Zimmermann",  en: "Carpenter",    x: "3%",  baseY: "18%", speed: 0.55, mountDelay: 0.10, rotate0: -18, rotate1: 12 },
  { emoji: "🔧", de: "Klempner",    en: "Plumber",      x: "85%", baseY: "10%", speed: 0.40, mountDelay: 0.05, rotate0:  10, rotate1: -8 },
  { emoji: "⛑️", de: "Bauleiter",   en: "Site Manager", x: "80%", baseY: "52%", speed: 0.70, mountDelay: 0.20, rotate0: -10, rotate1: 14 },
  { emoji: "🧱", de: "Maurer",      en: "Bricklayer",   x: "5%",  baseY: "62%", speed: 0.50, mountDelay: 0.25, rotate0:   8, rotate1: -12 },
  { emoji: "🪚", de: "Schreiner",   en: "Carpenter",    x: "88%", baseY: "75%", speed: 0.65, mountDelay: 0.15, rotate0: -14, rotate1: 10 },
  { emoji: "🏗️", de: "Baustelle",   en: "Construction", x: "44%", baseY: "10%", speed: 0.35, mountDelay: 0.08, rotate0:   6, rotate1: -10 },
  { emoji: "🔩", de: "Metallbauer", en: "Metal Worker", x: "1%",  baseY: "40%", speed: 0.45, mountDelay: 0.30, rotate0: -20, rotate1: 16 },
  { emoji: "🪛", de: "Elektriker",  en: "Electrician",  x: "67%", baseY: "88%", speed: 0.60, mountDelay: 0.18, rotate0:  12, rotate1: -14 },
];

function FloatingEmoji({
  emoji, de, en, lang, x, baseY, speed, mountDelay, rotate0, rotate1, scrollYProgress,
}: {
  emoji: string; de: string; en: string; lang: Lang; x: string; baseY: string; speed: number;
  mountDelay: number; rotate0: number; rotate1: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const yOffset = useTransform(scrollYProgress, [0, 1], [0, -140 * speed]);
  const rotate  = useTransform(scrollYProgress, [0, 1], [rotate0, rotate1]);
  const scale   = useTransform(scrollYProgress, [0, 0.8], [1, 0.82]);

  return (
    <motion.div
      className="absolute pointer-events-none select-none hidden lg:flex flex-col items-center gap-1.5"
      style={{ left: x, top: baseY, opacity, y: yOffset, rotate, scale }}
      initial={{ opacity: 0, y: 24, scale: 0.7 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: mountDelay, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden
    >
      <div
        className="flex items-center justify-center rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.10)] border border-white/80 bg-white/70 backdrop-blur-sm"
        style={{ width: 72, height: 72, fontSize: 38 }}
      >
        {emoji}
      </div>
      <span
        className="text-[10px] font-bold tracking-widest uppercase text-ink-mid/70 bg-white/60 backdrop-blur-sm rounded-full px-2.5 py-0.5 border border-white/60"
        style={{ fontFamily: "var(--font-display)", letterSpacing: "0.12em" }}
      >
        {lang === "de" ? de : en}
      </span>
    </motion.div>
  );
}

/* ── Scroll indicator ──────────────────────────────────────────────────── */
function ScrollDots({ opacity }: { opacity: ReturnType<typeof useTransform> }) {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none select-none"
      style={{ opacity }}
      aria-hidden
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block rounded-full"
          style={{
            width: 5,
            height: 5,
            background: "var(--color-brand-green)",
            opacity: 0.35,
          }}
          animate={{ opacity: [0.2, 0.9, 0.2], y: [0, 4, 0] }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            delay: i * 0.22,
            ease: "easeInOut",
          }}
        />
      ))}
    </motion.div>
  );
}

/* ── Helpers ───────────────────────────────────────────────────────────── */
function isValidUrl(val: string) {
  try {
    const url = new URL(val.startsWith("http") ? val : "https://" + val);
    return url.hostname.includes(".");
  } catch { return false; }
}

function normaliseUrl(val: string) {
  const t = val.trim();
  return t.startsWith("http://") || t.startsWith("https://") ? t : "https://" + t;
}

/* ── Component ─────────────────────────────────────────────────────────── */
interface HeroProps {
  lang: Lang;
  onLangChange: (l: Lang) => void;
}

export function AnimatedHero({ lang, onLangChange }: HeroProps) {
  const router = useRouter();
  const [greetingIdx,  setGreetingIdx]  = useState(0);
  const [url,          setUrl]          = useState("");
  const [error,        setError]        = useState("");
  const [showGame,     setShowGame]     = useState(false);
  const [submittedUrl, setSubmittedUrl] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const heroRef  = useRef<HTMLDivElement>(null);

  const greetings = lang === "de" ? GREETINGS_DE : GREETINGS_EN;
  const t         = copy[lang];

  /* scrollYProgress: 0 = section top at viewport top
                      1 = section bottom exits viewport top
     With 160vh section height, the sticky viewport holds for 60vh of scroll budget. */
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  /* Form reveals between 12–32% of scroll progress */
  const formOpacity       = useTransform(scrollYProgress, [0.12, 0.32], [0, 1]);
  const formY             = useTransform(scrollYProgress, [0.12, 0.32], [52, 0]);
  const formPointerEvents = useTransform(scrollYProgress, (v) => (v > 0.12 ? "auto" : "none"));

  /* Text drifts slightly upward as form comes in */
  const textY = useTransform(scrollYProgress, [0.10, 0.32], [0, -22]);

  /* Scroll hint fades as user starts scrolling */
  const hintOpacity = useTransform(scrollYProgress, [0, 0.06, 0.16], [1, 1, 0]);

  useEffect(() => {
    const id = setTimeout(
      () => setGreetingIdx((i) => (i + 1) % greetings.length),
      2200,
    );
    return () => clearTimeout(id);
  }, [greetingIdx, greetings.length]);

  function clearError() { setError(""); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const raw = url.trim();
    if (!raw) {
      setError(t.errorEmpty);
      inputRef.current?.focus();
      return;
    }
    if (!isValidUrl(raw)) {
      setError(t.errorInvalid);
      inputRef.current?.focus();
      return;
    }
    const finalUrl = normaliseUrl(raw);
    setSubmittedUrl(finalUrl);
    setShowGame(true);
  }

  const fadeUp = (delay: number) => ({
    initial: false as const,
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    /* ── Outer section: 160vh gives scroll budget for the sticky reveal ── */
    <section ref={heroRef} className="relative min-h-[160vh]">

      {/* ── Sticky viewport ─────────────────────────────────────────────── */}
      <div className="sticky top-0 h-dvh overflow-hidden flex items-center">

        {/* Floating emoji layer — inside sticky so they stay visible */}
        {TRADE_EMOJIS.map((e) => (
          <FloatingEmoji key={e.emoji} {...e} lang={lang} scrollYProgress={scrollYProgress} />
        ))}

        {/* Scroll indicator */}
        <ScrollDots opacity={hintOpacity} />

        {/* Content column */}
        <div className="relative z-10 max-w-3xl mx-auto px-6 w-full">

          {/* Text group: badge + greeting + headline + subline */}
          <motion.div style={{ y: textY }}>

            {/* Badge */}
            <motion.div {...fadeUp(0.05)}>
              <span className="inline-flex items-center text-[11px] font-bold tracking-[0.1em] uppercase text-brand-green bg-brand-green-light rounded-full px-4 py-1.5 mb-8 select-none">
                {t.badge}
              </span>
            </motion.div>

            {/* Rotating greeting */}
            <div className="h-16 md:h-[4.5rem] overflow-hidden flex items-center mb-3">
              <AnimatePresence mode="wait">
                <motion.span
                  key={`${lang}-${greetingIdx}`}
                  className="block font-extrabold text-5xl md:text-[3.75rem] leading-none tracking-tight text-brand-green"
                  style={{ fontFamily: "var(--font-display)" }}
                  initial={{ y: 64, opacity: 0, filter: "blur(6px)" }}
                  animate={{ y: 0,  opacity: 1, filter: "blur(0px)" }}
                  exit={{   y: -64, opacity: 0, filter: "blur(6px)" }}
                  transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                >
                  {greetings[greetingIdx]}.
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Headline */}
            <motion.h1
              className="font-extrabold text-[2rem] md:text-[2.75rem] text-ink leading-[1.15] tracking-tight max-w-2xl mb-5"
              style={{ fontFamily: "var(--font-display)" }}
              {...fadeUp(0.15)}
            >
              {t.headline}
            </motion.h1>

            {/* Subline */}
            <motion.p
              className="text-base md:text-[1.05rem] text-ink-mid leading-relaxed max-w-xl"
              {...fadeUp(0.22)}
            >
              {t.subline}
            </motion.p>
          </motion.div>

          {/* Form group: scroll-revealed ─────────────────────────────── */}
          <motion.div
            style={{
              opacity: formOpacity,
              y: formY,
              pointerEvents: formPointerEvents,
            }}
            className="mt-10"
          >
            <form onSubmit={handleSubmit} noValidate>
              <div className="flex gap-3 flex-col sm:flex-row sm:items-stretch">
                <div
                  className={[
                    "flex-1 flex items-center gap-3 bg-white rounded-xl px-4 shadow-sm border-2 transition-all",
                    error
                      ? "border-red-400 focus-within:ring-4 focus-within:ring-red-100"
                      : "border-border-subtle focus-within:border-brand-green focus-within:ring-4 focus-within:ring-[color-mix(in_srgb,var(--color-brand-green)_12%,transparent)] focus-within:shadow-md",
                  ].join(" ")}
                >
                  <Globe className="w-5 h-5 text-ink-muted flex-shrink-0 pointer-events-none" aria-hidden />
                  <input
                    ref={inputRef}
                    type="url"
                    value={url}
                    onChange={(e) => { setUrl(e.target.value); clearError(); }}
                    placeholder={t.placeholder}
                    autoComplete="url"
                    spellCheck={false}
                    className="flex-1 py-4 bg-transparent outline-none text-[1rem] text-ink placeholder:text-ink-muted min-w-0"
                    aria-label={lang === "de" ? "Aktuelle Website-URL" : "Current website URL"}
                  />
                </div>
                <button
                  type="submit"
                  className="flex-shrink-0 flex items-center justify-center gap-2 px-7 py-4 bg-brand-green text-white font-semibold rounded-xl shadow-[0_2px_12px_color-mix(in_srgb,var(--color-brand-green)_28%,transparent)] hover:bg-brand-green-hover hover:shadow-[0_4px_22px_color-mix(in_srgb,var(--color-brand-green)_40%,transparent)] active:translate-y-px transition-all cursor-pointer"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {t.cta}
                  <ArrowRight className="w-4 h-4" aria-hidden />
                </button>
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    role="alert" aria-live="polite"
                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="mt-2.5 text-sm text-red-600"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </form>

            {/* Alt link */}
            <button
              type="button"
              className="mt-5 block text-sm text-ink-muted underline underline-offset-[5px] decoration-border-subtle hover:text-ink-mid hover:decoration-ink-mid transition-all cursor-pointer"
            >
              {t.altLink}
            </button>
          </motion.div>

        </div>
      </div>

      {/* Game overlay — mounts on valid submit, redirects to /generator on complete */}
      <AnimatePresence>
        {showGame && (
          <GameOverlay
            url={submittedUrl}
            onComplete={() => {
              setShowGame(false);
              setUrl("");
              router.push(`/generator?url=${encodeURIComponent(submittedUrl)}`);
            }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
