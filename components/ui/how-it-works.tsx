"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

type Lang = "de" | "en";

const CONTENT: Record<Lang, { heading: string; steps: { num: string; title: string; desc: string; tag: string }[] }> = {
  de: {
    heading: "So einfach geht's",
    steps: [
      {
        num: "01",
        title: "URL eingeben",
        desc: "Du gibst einfach die Adresse deiner alten Website ein — fertig. Wir erledigen den Rest vollautomatisch.",
        tag: "30 Sekunden",
      },
      {
        num: "02",
        title: "Wir analysieren",
        desc: "Unsere KI liest deine bestehende Seite aus: Texte, Bilder, Dienstleistungen, Kontaktdaten — nichts geht verloren.",
        tag: "Vollautomatisch",
      },
      {
        num: "03",
        title: "Neue Website",
        desc: "Du erhältst eine moderne, professionelle Website, die sofort live gehen kann. Kein Entwickler, kein Aufwand.",
        tag: "Bereit in Minuten",
      },
    ],
  },
  en: {
    heading: "It's that simple",
    steps: [
      {
        num: "01",
        title: "Enter your URL",
        desc: "Just paste the address of your old website — that's it. We handle everything else automatically.",
        tag: "30 seconds",
      },
      {
        num: "02",
        title: "We analyse",
        desc: "Our AI reads your existing site: text, images, services, contact details — nothing gets lost.",
        tag: "Fully automatic",
      },
      {
        num: "03",
        title: "New website",
        desc: "You get a modern, professional website ready to go live. No developer, no effort.",
        tag: "Live in minutes",
      },
    ],
  },
};

const ACCENT = "#2d6a4f";

export function HowItWorks({ lang = "de" }: { lang?: Lang }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const c = CONTENT[lang];

  /* Each step occupies ~⅓ of the scroll range with a small crossfade overlap */
  const step0Opacity = useTransform(scrollYProgress, [0, 0.06, 0.28, 0.38], [0, 1, 1, 0]);
  const step0Y       = useTransform(scrollYProgress, [0, 0.06, 0.28, 0.38], [48, 0, 0, -48]);
  const step0NumS    = useTransform(scrollYProgress, [0, 0.06, 0.28, 0.38], [0.88, 1, 1, 1.06]);

  const step1Opacity = useTransform(scrollYProgress, [0.28, 0.38, 0.58, 0.68], [0, 1, 1, 0]);
  const step1Y       = useTransform(scrollYProgress, [0.28, 0.38, 0.58, 0.68], [48, 0, 0, -48]);
  const step1NumS    = useTransform(scrollYProgress, [0.28, 0.38, 0.58, 0.68], [0.88, 1, 1, 1.06]);

  const step2Opacity = useTransform(scrollYProgress, [0.62, 0.72, 1], [0, 1, 1]);
  const step2Y       = useTransform(scrollYProgress, [0.62, 0.72, 1], [48, 0, 0]);
  const step2NumS    = useTransform(scrollYProgress, [0.62, 0.72, 1], [0.88, 1, 1]);

  const progressFill = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const dot0 = useTransform(scrollYProgress, [0, 0.06], [0, 1]);
  const dot1 = useTransform(scrollYProgress, [0.28, 0.38], [0, 1]);
  const dot2 = useTransform(scrollYProgress, [0.62, 0.72], [0, 1]);
  const dots = [dot0, dot1, dot2];

  const steps = [
    { opacity: step0Opacity, y: step0Y, numScale: step0NumS },
    { opacity: step1Opacity, y: step1Y, numScale: step1NumS },
    { opacity: step2Opacity, y: step2Y, numScale: step2NumS },
  ];

  return (
    <div
      ref={sectionRef}
      className="relative"
      style={{ height: "280vh" }}
    >
      {/* White-to-surface gradient bridge from hero */}
      <div
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none z-10"
        style={{ background: "linear-gradient(to bottom, var(--color-surface), transparent)" }}
      />

      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">

        {/* Right edge progress track */}
        <div
          className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 h-40 w-[2px] rounded-full overflow-hidden z-20"
          style={{ background: "rgba(45,106,79,0.12)" }}
        >
          <motion.div
            className="w-full rounded-full origin-top"
            style={{ height: progressFill, background: ACCENT }}
          />
        </div>

        {/* Step dots */}
        <div className="absolute right-[14px] md:right-[26px] top-1/2 -translate-y-1/2 flex flex-col gap-[18px] z-20">
          {dots.map((dotOpacity, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: ACCENT,
                opacity: dotOpacity,
                boxShadow: `0 0 8px ${ACCENT}`,
              }}
            />
          ))}
        </div>

        {/* Section label */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 z-20">
          <span
            className="text-[11px] font-bold tracking-[0.14em] uppercase text-brand-green opacity-70"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {lang === "de" ? "So funktioniert es" : "How it works"}
          </span>
        </div>

        {/* Step panels */}
        <div className="relative w-full max-w-3xl mx-auto px-6">
          {c.steps.map((step, i) => {
            const s = steps[i];
            return (
              <motion.div
                key={step.num}
                className="absolute inset-x-0 px-6"
                style={{ opacity: s.opacity, y: s.y }}
              >
                <div className="relative">
                  {/* Watermark number */}
                  <motion.div
                    className="absolute -top-12 -left-4 md:-left-8 select-none pointer-events-none"
                    style={{ scale: s.numScale, transformOrigin: "left center" }}
                    aria-hidden
                  >
                    <span
                      className="font-extrabold leading-none"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(7rem, 18vw, 14rem)",
                        color: "rgba(45,106,79,0.07)",
                        letterSpacing: "-0.04em",
                      }}
                    >
                      {step.num}
                    </span>
                  </motion.div>

                  {/* Content */}
                  <div className="relative z-10 pt-4">
                    <div className="mb-4">
                      <span
                        className="inline-block text-xs font-bold tracking-widest uppercase rounded-full px-3 py-1"
                        style={{
                          background: "rgba(45,106,79,0.10)",
                          color: ACCENT,
                        }}
                      >
                        {step.tag}
                      </span>
                    </div>

                    <h2
                      className="font-extrabold text-[2.25rem] md:text-[3.25rem] text-ink leading-tight tracking-tight mb-5 max-w-xl"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {step.title}
                    </h2>

                    <p className="text-lg md:text-xl text-ink-mid leading-relaxed max-w-md">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Heading — fixed bottom left */}
        <div className="absolute bottom-10 left-6 md:left-10">
          <p
            className="text-[11px] font-semibold tracking-[0.12em] uppercase text-ink-muted"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {c.heading}
          </p>
        </div>
      </div>

      {/* Bottom gradient bridge to about section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10"
        style={{ background: "linear-gradient(to top, #f0ede9, transparent)" }}
      />
    </div>
  );
}
