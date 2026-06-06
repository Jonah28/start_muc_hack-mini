"use client";

import { motion } from "framer-motion";

type Lang = "de" | "en";

const LOGOS = [
  { name: "Würth",     src: "/logos/wuerth-logo.png"              },
  { name: "Bosch",     src: "/logos/1280px-Bosch-logotype.svg.png" },
  { name: "Hilti",     src: "/logos/Hilti_logo.svg.png"           },
  { name: "Knauf",     src: "/logos/Knauf-Logo.png"               },
  { name: "Viessmann", src: "/logos/Viessmann-logo.svg.png"       },
  { name: "Hansgrohe", src: "/logos/Hansgrohe-Logo.svg.png"       },
  { name: "Stihl",     src: "/logos/Stihl_Logo.svg.png"           },
  { name: "Festool",   src: "/logos/Festool.svg.png"              },
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
                src={logo.src}
                alt={logo.name}
                width={90}
                height={40}
                className="object-contain max-h-[36px] max-w-[90px] transition-all duration-300 grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-90"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
