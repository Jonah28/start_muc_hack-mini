"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
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
    footer: "Gemacht für das deutsche Handwerk.",
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
    footer: "Made for German trades.",
  },
};

/* ── Floating emoji layer ──────────────────────────────────────────────── */
const TRADE_EMOJIS = [
  { emoji: "🔨", x: "8%",  baseY: "22%", speed: 0.7, entryDelay: 0.10, size: 28 },
  { emoji: "🔧", x: "88%", baseY: "15%", speed: 0.5, entryDelay: 0.05, size: 24 },
  { emoji: "⛑️", x: "76%", baseY: "55%", speed: 0.9, entryDelay: 0.18, size: 30 },
  { emoji: "🧱", x: "14%", baseY: "65%", speed: 0.6, entryDelay: 0.22, size: 26 },
  { emoji: "🪚", x: "91%", baseY: "78%", speed: 0.8, entryDelay: 0.14, size: 22 },
  { emoji: "🔩", x: "4%",  baseY: "48%", speed: 0.55,entryDelay: 0.28, size: 20 },
  { emoji: "🏗️", x: "50%", baseY: "5%",  speed: 0.4, entryDelay: 0.08, size: 32 },
  { emoji: "🪛", x: "60%", baseY: "90%", speed: 0.65,entryDelay: 0.20, size: 22 },
];

function FloatingEmoji({
  emoji, x, baseY, speed, entryDelay, size, scrollYProgress,
}: {
  emoji: string; x: string; baseY: string; speed: number;
  entryDelay: number; size: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const opacity  = useTransform(scrollYProgress, [0, 0.08 + entryDelay * 0.3, 0.85], [0, 0.85, 0]);
  const yOffset  = useTransform(scrollYProgress, [0, 1], [60, -80 * speed]);
  const rotate   = useTransform(scrollYProgress, [0, 1], [-15, 25 * speed]);
  const scale    = useTransform(scrollYProgress, [0, 0.1 + entryDelay * 0.2, 0.9], [0.4, 1, 0.7]);

  return (
    <motion.div
      className="absolute pointer-events-none select-none hidden md:block"
      style={{ left: x, top: baseY, opacity, y: yOffset, rotate, scale, fontSize: size }}
      aria-hidden
    >
      {emoji}
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

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

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
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section ref={heroRef} className="relative overflow-hidden min-h-[90vh] flex items-center">

      {/* Floating emoji layer */}
      {TRADE_EMOJIS.map((e) => (
        <FloatingEmoji key={e.emoji} {...e} scrollYProgress={scrollYProgress} />
      ))}

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-24 w-full">
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
          className="text-base md:text-[1.05rem] text-ink-mid leading-relaxed max-w-xl mb-10"
          {...fadeUp(0.22)}
        >
          {t.subline}
        </motion.p>

        {/* Form */}
        <motion.form onSubmit={handleSubmit} noValidate {...fadeUp(0.3)}>
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
        </motion.form>

        {/* Alt link */}
        <motion.button
          type="button"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="mt-5 block text-sm text-ink-muted underline underline-offset-[5px] decoration-border-subtle hover:text-ink-mid hover:decoration-ink-mid transition-all cursor-pointer"
        >
          {t.altLink}
        </motion.button>
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
