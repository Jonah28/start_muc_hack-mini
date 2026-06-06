"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";

type Lang = "de" | "en";

const CITIES_DE = ["Bayern", "Berlin", "Hamburg", "Leipzig", "Stuttgart", "Köln", "Dresden", "Frankfurt"];
const CITIES_EN = ["Bavaria", "Berlin", "Hamburg", "Leipzig", "Stuttgart", "Cologne", "Dresden", "Frankfurt"];

const testimonials = [
  {
    text: "Ich habe die URL meiner alten Seite eingegeben – nach zwei Minuten hatte ich eine moderne Website. Meine Kunden dachten, ich hätte einen Profi engagiert.",
    image: "https://i.pravatar.cc/80?img=11",
    name: "Klaus Bergmann",
    role: "Heizungsbau Bergmann, München",
  },
  {
    text: "Als Elektriker bin ich kein Web-Experte. Werkseite hat das komplett gelöst. Die neue Seite lädt schnell und sieht auf dem Handy super aus.",
    image: "https://i.pravatar.cc/80?img=32",
    name: "Monika Schreiber",
    role: "Elektro Schreiber, Augsburg",
  },
  {
    text: "Endlich eine Website, auf die ich stolz bin. Der Prozess war so einfach – URL eingeben, kurz warten, fertig. Kann ich nur empfehlen.",
    image: "https://i.pravatar.cc/80?img=53",
    name: "Stefan Huber",
    role: "Schreinerei Huber, Rosenheim",
  },
  {
    text: "Meine alte Website war von 2012. Jetzt habe ich eine Seite, die wirklich zu meinem Betrieb passt. Neue Anfragen kommen seitdem regelmäßig rein.",
    image: "https://i.pravatar.cc/80?img=44",
    name: "Andrea Müller",
    role: "Malerei & Lackierung Müller, Landsberg",
  },
  {
    text: "Schnell, unkompliziert, professionell. Ich hab's morgens gestartet und mittags war alles fertig. Mein bester Invest seit langem.",
    image: "https://i.pravatar.cc/80?img=15",
    name: "Thomas Bauer",
    role: "Klempner Bauer, Freising",
  },
  {
    text: "Das Tool hat unsere bestehenden Inhalte perfekt übernommen und modern aufbereitet. Kein Datenverlust, keine Arbeit – einfach klasse.",
    image: "https://i.pravatar.cc/80?img=26",
    name: "Sabine Zimmermann",
    role: "Fliesen Zimmermann, Ingolstadt",
  },
  {
    text: "Ich war skeptisch, aber das Ergebnis hat mich überzeugt. Sieht aus wie von einer Agentur – hat aber nichts gekostet. Unglaublich.",
    image: "https://i.pravatar.cc/80?img=57",
    name: "Michael Gruber",
    role: "Dachdeckermeister Gruber, Dachau",
  },
  {
    text: "Werkseite hat verstanden, was mein Betrieb ausmacht. Die neue Seite wirkt professionell und authentisch – genau das wollte ich.",
    image: "https://i.pravatar.cc/80?img=48",
    name: "Petra Winkler",
    role: "Raumausstattung Winkler, Erding",
  },
  {
    text: "Super einfach. URL eingeben, kurz spielen – und schon ist die neue Website da. Hab das Spiel sogar gewonnen!",
    image: "https://i.pravatar.cc/80?img=19",
    name: "Felix Braun",
    role: "Maurermeister Braun, Wasserburg",
  },
];

const firstColumn  = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn  = testimonials.slice(6, 9);

const copy = {
  de: {
    badge: "Kundenstimmen",
    sub: "Von der alten zur neuen Website – in Minuten. Das sagen Betriebe, die bereits dabei sind.",
  },
  en: {
    badge: "Testimonials",
    sub: "From old website to new — in minutes. Here's what businesses already using it say.",
  },
};

export function TestimonialsSection({ lang = "de" }: { lang?: Lang }) {
  const t = copy[lang];
  const cities = lang === "de" ? CITIES_DE : CITIES_EN;
  const [cityIdx, setCityIdx] = useState(0);

  useEffect(() => {
    const id = setTimeout(() => setCityIdx((i) => (i + 1) % cities.length), 2000);
    return () => clearTimeout(id);
  }, [cityIdx, cities.length]);

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: "var(--color-surface)" }}>
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center max-w-[540px] mx-auto mb-14 text-center"
        >
          <span className="inline-flex items-center text-[11px] font-bold tracking-[0.1em] uppercase text-brand-green bg-brand-green-light rounded-full px-4 py-1.5 mb-5 select-none">
            {t.badge}
          </span>
          <h2
            className="text-3xl md:text-[2.5rem] font-extrabold tracking-tight text-ink leading-[1.2] mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {lang === "de" ? (
              <>
                Handwerker{" "}
                <span className="whitespace-nowrap">
                  in ganz{" "}
                  <span className="relative inline-flex overflow-hidden align-bottom" style={{ minWidth: "9ch" }}>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={cityIdx}
                        className="text-brand-green whitespace-nowrap"
                        initial={{ y: 32, opacity: 0, filter: "blur(6px)" }}
                        animate={{ y: 0,  opacity: 1, filter: "blur(0px)" }}
                        exit={{   y: -32, opacity: 0, filter: "blur(6px)" }}
                        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {cities[cityIdx]}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </span>{" "}
                vertrauen uns.
              </>
            ) : (
              <>
                Tradespeople{" "}
                <span className="whitespace-nowrap">
                  across{" "}
                  <span className="relative inline-flex overflow-hidden align-bottom" style={{ minWidth: "9ch" }}>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={cityIdx}
                        className="text-brand-green whitespace-nowrap"
                        initial={{ y: 32, opacity: 0, filter: "blur(6px)" }}
                        animate={{ y: 0,  opacity: 1, filter: "blur(0px)" }}
                        exit={{   y: -32, opacity: 0, filter: "blur(6px)" }}
                        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {cities[cityIdx]}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </span>{" "}
                trust us.
              </>
            )}
          </h2>
          <p className="text-base text-ink-mid leading-relaxed">
            {t.sub}
          </p>
        </motion.div>

        {/* Columns */}
        <div className="flex justify-center gap-5 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] max-h-[700px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn}  duration={15} />
          <TestimonialsColumn testimonials={secondColumn} duration={19} className="hidden md:block" />
          <TestimonialsColumn testimonials={thirdColumn}  duration={17} className="hidden lg:block" />
        </div>

      </div>
    </section>
  );
}
