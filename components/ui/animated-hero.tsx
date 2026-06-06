"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Globe } from "lucide-react";

const GREETINGS_DE = ["Moin", "Servus", "Hey", "Na", "Hallo", "Glück auf"];
const GREETINGS_EN = ["Hello", "Hi there", "Hey", "G'day", "Welcome"];

const ANALYSIS_STEPS_DE = [
  "Website wird geladen…",
  "Inhalte werden analysiert…",
  "Fast fertig…",
];
const ANALYSIS_STEPS_EN = [
  "Loading website…",
  "Analysing content…",
  "Almost done…",
];

type Lang = "de" | "en";

const copy = {
  de: {
    badge: "Für Handwerker",
    headline: "Aus deiner alten Website wird in Minuten eine neue.",
    subline:
      "Einfach die URL deiner bisherigen Website eingeben. Wir lesen sie automatisch aus und erstellen eine moderne, professionelle Seite für dein Handwerk.",
    placeholder: "z. B. https://www.schmidt-heizung.de",
    cta: "Website starten",
    altLink: "Keine Website? Kurzbeschreibung eingeben",
    errorEmpty: "Bitte gib eine Website-Adresse ein.",
    errorInvalid:
      "Bitte gib eine gültige URL ein, z. B. https://www.deinbetrieb.de",
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

function isValidUrl(val: string) {
  try {
    const url = new URL(val.startsWith("http") ? val : "https://" + val);
    return url.hostname.includes(".");
  } catch {
    return false;
  }
}

function normaliseUrl(val: string) {
  const t = val.trim();
  return t.startsWith("http://") || t.startsWith("https://")
    ? t
    : "https://" + t;
}

export function Hero() {
  const [lang, setLang] = useState<Lang>("de");
  const [greetingIdx, setGreetingIdx] = useState(0);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const greetings = lang === "de" ? GREETINGS_DE : GREETINGS_EN;
  const steps = lang === "de" ? ANALYSIS_STEPS_DE : ANALYSIS_STEPS_EN;
  const t = copy[lang];

  /* Rotate greeting every 2.2 s */
  useEffect(() => {
    const id = setTimeout(
      () => setGreetingIdx((i) => (i + 1) % greetings.length),
      2200,
    );
    return () => clearTimeout(id);
  }, [greetingIdx, greetings.length]);

  /* Advance analysis step text while loading */
  useEffect(() => {
    if (!isLoading) { setStep(0); return; }
    const t1 = setTimeout(() => setStep(1), 1500);
    const t2 = setTimeout(() => setStep(2), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [isLoading]);

  function clearError() {
    setError("");
  }

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
    setIsLoading(true);
    console.log("Submitting:", finalUrl);
    /*
     * TODO: replace with actual pipeline call or redirect, e.g.:
     * router.push(`/generate?url=${encodeURIComponent(finalUrl)}`)
     */
  }

  /* Stagger entrance */
  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <div className="flex flex-col min-h-dvh" style={{ fontFamily: "var(--font-body)" }}>

      {/* ── Header ────────────────────────────────── */}
      <header className="border-b border-border-subtle bg-surface/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <span
            className="text-ink font-bold text-lg tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            WebStart
          </span>
          <button
            onClick={() => { setLang((l) => (l === "de" ? "en" : "de")); setError(""); }}
            className="text-[11px] font-bold tracking-widest text-ink-muted border border-border-subtle rounded-md px-3 py-1.5 hover:border-brand-green hover:text-brand-green hover:bg-brand-green-light transition-all cursor-pointer"
            aria-label="Switch language"
          >
            {lang === "de" ? "EN" : "DE"}
          </button>
        </div>
      </header>

      {/* ── Hero ──────────────────────────────────── */}
      <main className="flex-1 flex items-center">
        <div className="max-w-3xl mx-auto px-6 py-20 w-full">

          {/* Badge */}
          <motion.div {...fadeUp(0.05)}>
            <span
              className="inline-flex items-center text-[11px] font-bold tracking-[0.1em] uppercase text-brand-green bg-brand-green-light rounded-full px-4 py-1.5 mb-8 select-none"
            >
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
                transition={{
                  duration: 0.38,
                  ease: [0.22, 1, 0.36, 1],
                }}
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
          <motion.form
            onSubmit={handleSubmit}
            noValidate
            {...fadeUp(0.3)}
          >
            <div className="flex gap-3 flex-col sm:flex-row sm:items-stretch">

              {/* URL input */}
              <div
                className={[
                  "flex-1 flex items-center gap-3 bg-white rounded-xl px-4 shadow-sm border-2 transition-all",
                  error
                    ? "border-red-400 focus-within:ring-4 focus-within:ring-red-100"
                    : "border-border-subtle focus-within:border-brand-green focus-within:ring-4 focus-within:ring-[color-mix(in_srgb,var(--color-brand-green)_12%,transparent)] focus-within:shadow-md",
                ].join(" ")}
              >
                <Globe
                  className="w-5 h-5 text-ink-muted flex-shrink-0 pointer-events-none"
                  aria-hidden
                />
                <input
                  ref={inputRef}
                  type="url"
                  value={url}
                  onChange={(e) => { setUrl(e.target.value); clearError(); }}
                  placeholder={t.placeholder}
                  disabled={isLoading}
                  autoComplete="url"
                  spellCheck={false}
                  className="flex-1 py-4 bg-transparent outline-none text-[1rem] text-ink placeholder:text-ink-muted disabled:opacity-50 min-w-0"
                  aria-label={lang === "de" ? "Aktuelle Website-URL" : "Current website URL"}
                />
              </div>

              {/* CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="flex-shrink-0 flex items-center justify-center gap-2 px-7 py-4 bg-brand-green text-white font-semibold rounded-xl shadow-[0_2px_12px_color-mix(in_srgb,var(--color-brand-green)_28%,transparent)] hover:bg-brand-green-hover hover:shadow-[0_4px_22px_color-mix(in_srgb,var(--color-brand-green)_40%,transparent)] active:translate-y-px transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 cursor-pointer"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {t.cta}
                <ArrowRight className="w-4 h-4" aria-hidden />
              </button>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.p
                  role="alert"
                  aria-live="polite"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="mt-2.5 text-sm text-red-600"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.form>

          {/* Loading state */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="mt-5 flex items-center gap-3 bg-brand-green-light rounded-xl px-5 py-4"
              >
                <div
                  className="w-5 h-5 rounded-full border-2 border-brand-green/25 border-t-brand-green animate-spin flex-shrink-0"
                  aria-hidden
                />
                <AnimatePresence mode="wait">
                  <motion.p
                    key={step}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-semibold text-brand-green"
                    aria-live="polite"
                  >
                    {steps[step]}
                  </motion.p>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Alt link */}
          <AnimatePresence>
            {!isLoading && (
              <motion.button
                type="button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="mt-5 block text-sm text-ink-muted underline underline-offset-[5px] decoration-border-subtle hover:text-ink-mid hover:decoration-ink-mid transition-all cursor-pointer"
              >
                {t.altLink}
              </motion.button>
            )}
          </AnimatePresence>

        </div>
      </main>

      {/* ── Footer ────────────────────────────────── */}
      <footer className="border-t border-border-subtle py-5">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-xs text-ink-muted">{t.footer}</p>
        </div>
      </footer>

    </div>
  );
}

export { Hero };
