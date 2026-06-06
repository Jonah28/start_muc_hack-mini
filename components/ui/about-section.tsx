"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { GlowCard } from "@/components/ui/spotlight-card";

type Lang = "de" | "en";

const CARDS = {
  de: [
    {
      num: "01",
      eyebrow: "Unsere Mission",
      title: "Moderne Websites für alle Handwerker.",
      desc: "Tausende Handwerksbetriebe in Deutschland haben eine veraltete Online-Präsenz — oder gar keine. Wir ändern das, in Minuten, nicht Monaten.",
    },
    {
      num: "02",
      eyebrow: "Entstanden beim Hackathon",
      title: "Ein Team aus München.",
      desc: "Wir sind ein Team junger Entwickler und Designer, die beim start.muc Hackathon zusammengekommen sind — mit einer klaren Vision.",
    },
    {
      num: "03",
      eyebrow: "Für Handwerker gemacht",
      title: "Kein Tech-Wissen nötig.",
      desc: "Einfach URL eingeben — der Rest läuft automatisch. Kein Baukurs, kein Webdesigner, kein Aufwand.",
    },
    {
      num: "04",
      eyebrow: "KI-gestützt",
      title: "Deine Inhalte bleiben deine Inhalte.",
      desc: "Unsere KI analysiert deine bestehende Website und überträgt alles — Text, Bilder, Struktur — in ein modernes Layout.",
    },
  ],
  en: [
    {
      num: "01",
      eyebrow: "Our mission",
      title: "Modern websites for every tradesperson.",
      desc: "Thousands of trade businesses across Germany have outdated or no online presence. We fix that — in minutes, not months.",
    },
    {
      num: "02",
      eyebrow: "Born at the hackathon",
      title: "A team from Munich.",
      desc: "We're a team of developers and designers who came together at the start.muc Hackathon — united by a clear vision.",
    },
    {
      num: "03",
      eyebrow: "Built for trades",
      title: "Zero tech knowledge needed.",
      desc: "Just enter a URL — everything else is automatic. No coding course, no web designer, no effort.",
    },
    {
      num: "04",
      eyebrow: "AI-powered",
      title: "Your content stays yours.",
      desc: "Our AI reads your existing website and transfers everything — text, images, structure — into a modern layout.",
    },
  ],
};

function AboutCard({
  card,
  delay,
}: {
  card: (typeof CARDS.de)[0];
  delay: number;
}) {
  const [hovered, setHovered] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView  = useInView(wrapRef, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={wrapRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className="flex-1 min-w-0 cursor-pointer"
    >
      <GlowCard glowColor="green" className="h-full min-h-[300px] md:min-h-[340px]">
        {/* Green fill — scales up from the bottom on hover */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: "linear-gradient(150deg, #2d6a4f 0%, #1b4d38 60%, #245c41 100%)",
            originY: 1,
          }}
          initial={false}
          animate={{ scaleY: hovered ? 1 : 0 }}
          transition={{ duration: 0.44, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Content — sits above the fill */}
        <div className="relative z-10 h-full flex flex-col justify-between p-6 xl:p-7" style={{ minHeight: 300 }}>

          {/* Number — top left, watermark style */}
          <motion.span
            className="font-extrabold leading-none select-none tabular-nums"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
            }}
            animate={{ color: hovered ? "rgba(255,255,255,0.18)" : "rgba(26,26,24,0.10)" }}
            transition={{ duration: 0.22 }}
            aria-hidden
          >
            {card.num}
          </motion.span>

          {/* Bottom block — eyebrow + title + description */}
          <div>
            {/* Eyebrow — only visible on hover */}
            <AnimatePresence>
              {hovered && (
                <motion.p
                  key="eyebrow"
                  className="text-[10px] font-bold tracking-[0.13em] uppercase mb-2"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  {card.eyebrow}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Title — always visible, color transitions */}
            <motion.h3
              className="font-bold leading-snug tracking-tight"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(0.95rem, 1.4vw, 1.1rem)",
              }}
              animate={{ color: hovered ? "#ffffff" : "#1a1a18" }}
              transition={{ duration: 0.22 }}
            >
              {card.title}
            </motion.h3>

            {/* Description — slides up on hover */}
            <AnimatePresence>
              {hovered && (
                <motion.p
                  key="desc"
                  className="text-sm leading-relaxed mt-3"
                  style={{ color: "rgba(255,255,255,0.70)" }}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.30, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  {card.desc}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </GlowCard>
    </motion.div>
  );
}

export function AboutSection({ lang = "de" }: { lang?: Lang }) {
  const cards = CARDS[lang];

  return (
    <section className="py-24 px-6" style={{ background: "#f0ede9" }}>
      <div className="max-w-6xl mx-auto">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <span
            className="text-[11px] font-bold tracking-[0.14em] uppercase text-brand-green opacity-75"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {lang === "de" ? "Wer wir sind" : "Who we are"}
          </span>
          <h2
            className="font-extrabold text-3xl md:text-4xl text-ink leading-tight tracking-tight mt-3 max-w-lg"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {lang === "de" ? "Handwerk verdient das Beste." : "Trades deserve the best."}
          </h2>
        </motion.div>

        {/* 4 horizontal cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card, i) => (
            <AboutCard key={card.num} card={card} delay={i * 0.07} />
          ))}
        </div>

      </div>
    </section>
  );
}
