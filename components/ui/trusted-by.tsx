"use client";

import { motion } from "framer-motion";

type Lang = "de" | "en";

const LOGOS = [
  { name: "Würth",     domain: "wurth.com"     },
  { name: "Bosch",     domain: "bosch.com"     },
  { name: "Hilti",     domain: "hilti.com"     },
  { name: "Knauf",     domain: "knauf.com"     },
  { name: "Viessmann", domain: "viessmann.com" },
  { name: "Hansgrohe", domain: "hansgrohe.com" },
  { name: "Stihl",     domain: "stihl.com"     },
  { name: "Festool",   domain: "festool.com"   },
];

const COPY = {
  de: "Vertraut von Handwerksbetrieben, die mit diesen Marken arbeiten",
  en: "Trusted by tradespeople who work with these brands",
};

export function TrustedBy({ lang = "de" }: { lang?: Lang }) {
  /* Duplicate for seamless loop — animation scrolls -50% (= one full set) */
  const doubled = [...LOGOS, ...LOGOS];

  return (
    <section
      className="py-14 border-y border-border-subtle overflow-hidden"
      style={{ background: "var(--color-surface)" }}
    >
      <div className="max-w-6xl mx-auto px-6 mb-8">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center text-[11px] font-bold tracking-[0.14em] uppercase text-ink-muted"
        >
          {COPY[lang]}
        </motion.p>
      </div>

      {/* Marquee — CSS keyframe animation is gapless; framer-motion repeat snaps */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      ` }} />
      <div className="[mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <div
          className="flex items-center gap-12 md:gap-16"
          style={{
            width: "max-content",
            animation: "marquee-scroll 28s linear infinite",
          }}
        >
          {doubled.map((logo, i) => (
            <div
              key={i}
              className="flex items-center justify-center flex-shrink-0 group"
              style={{ width: 110, height: 48 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://logo.clearbit.com/${logo.domain}`}
                alt={logo.name}
                width={90}
                height={40}
                className="object-contain max-h-[36px] max-w-[90px] transition-all duration-300 grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-90"
                onError={(e) => {
                  /* fallback to text if logo fails to load */
                  const parent = (e.target as HTMLImageElement).parentElement;
                  if (parent) {
                    (e.target as HTMLImageElement).style.display = "none";
                    parent.innerHTML = `<span style="font-family:var(--font-display);font-weight:700;font-size:0.8rem;color:rgba(26,26,24,0.35);letter-spacing:-0.01em">${logo.name}</span>`;
                  }
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
