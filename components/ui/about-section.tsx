"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Zap, Wrench, Globe, Users } from "lucide-react";

type Lang = "de" | "en";

const CARDS = {
  de: [
    {
      num: "01",
      icon: Zap,
      eyebrow: "Unsere Mission",
      title: "Moderne Websites für alle Handwerker.",
      desc: "Tausende Handwerksbetriebe in Deutschland haben eine veraltete Online-Präsenz — oder gar keine. Wir ändern das, in Minuten, nicht Monaten.",
      theme: "hero",
    },
    {
      num: "02",
      icon: Users,
      eyebrow: "Entstanden",
      title: "Ein Team aus München.",
      desc: "Wir sind ein Team junger Entwickler und Designer, die beim start.muc Hackathon zusammengekommen sind — mit einer klaren Vision.",
      theme: "dark",
    },
    {
      num: "03",
      icon: Wrench,
      eyebrow: "Für Handwerker",
      title: "Kein Tech-Wissen nötig.",
      desc: "Einfach URL eingeben — der Rest läuft automatisch. Kein Baukurs, kein Webdesigner, kein Aufwand.",
      theme: "light",
    },
    {
      num: "04",
      icon: Globe,
      eyebrow: "KI-gestützt",
      title: "Deine Inhalte bleiben deine Inhalte.",
      desc: "Unsere KI analysiert deine bestehende Website und überträgt alles — Text, Bilder, Struktur — in ein modernes Layout.",
      theme: "stone",
    },
  ],
  en: [
    {
      num: "01",
      icon: Zap,
      eyebrow: "Our mission",
      title: "Modern websites for every tradesperson.",
      desc: "Thousands of trade businesses across Germany have outdated or no online presence. We fix that — in minutes, not months.",
      theme: "hero",
    },
    {
      num: "02",
      icon: Users,
      eyebrow: "Origin",
      title: "A team from Munich.",
      desc: "We're a team of developers and designers who came together at the start.muc Hackathon — united by a clear vision.",
      theme: "dark",
    },
    {
      num: "03",
      icon: Wrench,
      eyebrow: "For trades",
      title: "Zero tech knowledge needed.",
      desc: "Just enter a URL — everything else is automatic. No coding course, no web designer, no effort.",
      theme: "light",
    },
    {
      num: "04",
      icon: Globe,
      eyebrow: "AI-powered",
      title: "Your content stays yours.",
      desc: "Our AI reads your existing website and transfers everything — text, images, structure — into a modern layout.",
      theme: "stone",
    },
  ],
};

const THEMES = {
  hero: {
    bg: "linear-gradient(150deg, #2d6a4f 0%, #1b4d38 55%, #245c41 100%)",
    numColor: "rgba(255,255,255,0.06)",
    iconColor: "#ffffff",
    iconBg: "rgba(255,255,255,0.15)",
    eyebrowColor: "rgba(255,255,255,0.55)",
    titleColor: "#ffffff",
    descColor: "rgba(255,255,255,0.70)",
    border: "none",
  },
  dark: {
    bg: "linear-gradient(150deg, #1a1a18 0%, #262620 100%)",
    numColor: "rgba(255,255,255,0.04)",
    iconColor: "#52b788",
    iconBg: "rgba(82,183,136,0.12)",
    eyebrowColor: "rgba(255,255,255,0.32)",
    titleColor: "#ffffff",
    descColor: "rgba(255,255,255,0.52)",
    border: "1px solid rgba(255,255,255,0.07)",
  },
  light: {
    bg: "linear-gradient(150deg, #d8ede4 0%, #c2e0d0 100%)",
    numColor: "rgba(45,106,79,0.07)",
    iconColor: "#2d6a4f",
    iconBg: "rgba(45,106,79,0.12)",
    eyebrowColor: "rgba(26,26,24,0.40)",
    titleColor: "#1a1a18",
    descColor: "rgba(26,26,24,0.62)",
    border: "1px solid rgba(45,106,79,0.14)",
  },
  stone: {
    bg: "linear-gradient(150deg, #f0ede9 0%, #e5e0d8 100%)",
    numColor: "rgba(26,26,24,0.05)",
    iconColor: "#2d6a4f",
    iconBg: "rgba(45,106,79,0.09)",
    eyebrowColor: "rgba(26,26,24,0.38)",
    titleColor: "#1a1a18",
    descColor: "rgba(26,26,24,0.58)",
    border: "1px solid rgba(0,0,0,0.07)",
  },
} as const;

function BentoCard({
  card,
  delay,
}: {
  card: (typeof CARDS.de)[0];
  delay: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const inView  = useInView(cardRef, { once: true, margin: "-60px" });
  const theme   = THEMES[card.theme as keyof typeof THEMES];
  const Icon    = card.icon;

  return (
    <motion.div
      ref={cardRef}
      className="relative overflow-hidden rounded-2xl p-7 flex flex-col justify-between min-h-[260px]"
      style={{
        background: theme.bg,
        border: theme.border || undefined,
      }}
      initial={{ opacity: 0, y: 32, clipPath: "inset(8% 0% 8% 0% round 16px)" }}
      animate={
        inView
          ? { opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0% round 16px)" }
          : {}
      }
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Watermark number */}
      <div
        className="absolute -bottom-4 -right-2 select-none pointer-events-none leading-none font-extrabold"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "8rem",
          color: theme.numColor,
          letterSpacing: "-0.04em",
        }}
        aria-hidden
      >
        {card.num}
      </div>

      {/* Icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-6 flex-shrink-0"
        style={{ background: theme.iconBg }}
      >
        <Icon className="w-5 h-5" style={{ color: theme.iconColor }} />
      </div>

      {/* Text */}
      <div className="relative z-10">
        <p
          className="text-[11px] font-bold tracking-[0.1em] uppercase mb-2"
          style={{ color: theme.eyebrowColor }}
        >
          {card.eyebrow}
        </p>
        <h3
          className="font-extrabold text-xl leading-snug tracking-tight mb-3"
          style={{ fontFamily: "var(--font-display)", color: theme.titleColor }}
        >
          {card.title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: theme.descColor }}>
          {card.desc}
        </p>
      </div>
    </motion.div>
  );
}

export function AboutSection({ lang = "de" }: { lang?: Lang }) {
  const cards = CARDS[lang];

  return (
    <section className="py-24 px-6" style={{ background: "#f0ede9" }}>
      <div className="max-w-3xl mx-auto">
        {/* Section eyebrow */}
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
            {lang === "de"
              ? "Handwerk verdient das Beste."
              : "Trades deserve the best."}
          </h2>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Hero card — full width on mobile, full height on md+ left column */}
          <div className="md:row-span-2">
            <BentoCard card={cards[0]} delay={0} />
          </div>
          <BentoCard card={cards[1]} delay={0.08} />
          <BentoCard card={cards[2]} delay={0.14} />
          {/* Stone card — full width below */}
          <div className="md:col-span-2">
            <BentoCard card={cards[3]} delay={0.20} />
          </div>
        </div>
      </div>
    </section>
  );
}
