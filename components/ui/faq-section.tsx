"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { AuroraButton } from "@/components/ui/aurora-button";

type Lang = "de" | "en";

interface FAQ { q: string; a: string; }

const FAQS: Record<Lang, FAQ[]> = {
  de: [
    {
      q: "Wie funktioniert Werkseite.org genau?",
      a: "Du gibst einfach die URL deiner bestehenden Website ein. Unsere KI analysiert automatisch alle Inhalte — Texte, Bilder, Kontaktdaten, Dienstleistungen — und erstellt daraus eine moderne, professionelle Website. Der gesamte Prozess dauert nur wenige Minuten, ohne dass du selbst etwas programmieren oder gestalten musst.",
    },
    {
      q: "Was kostet die Erstellung meiner neuen Handwerker-Website?",
      a: "Werkseite.org ist für Handwerksbetriebe erschwinglich gehalten — weit günstiger als eine Agentur oder ein Freelancer. Es gibt keine versteckten Kosten und keine Einrichtungsgebühren. Du zahlst nur für das, was du wirklich nutzt. Genaue Preise findest du in unserem transparenten Preismodell nach der Erstellung deiner Website.",
    },
    {
      q: "Wie lange dauert es, bis meine neue Handwerker-Website fertig ist?",
      a: "In der Regel ist deine neue Website innerhalb von 2 bis 5 Minuten fertig — von der URL-Eingabe bis zur fertigen Seite. Du kannst in dieser Zeit sogar Wreck-It-Ralph spielen. Keine wochenlangen Abstimmungen, kein Warten auf einen Designer.",
    },
    {
      q: "Brauche ich technisches Wissen oder Programmierkenntnisse?",
      a: "Nein. Werkseite.org wurde speziell für Handwerksbetriebe entwickelt, die sich nicht mit Technik beschäftigen wollen. Du brauchst nur die Adresse deiner alten Website — alles andere erledigt unsere KI vollautomatisch. Kein Code, kein Design, keine Vorkenntnisse.",
    },
    {
      q: "Was passiert mit den Inhalten meiner alten Handwerker-Website?",
      a: "Deine bestehenden Inhalte werden vollständig übernommen und modernisiert. Texte, Bilder, Dienstleistungen, Öffnungszeiten und Kontaktdaten bleiben erhalten — nur das Design wird professionell und zeitgemäß. Nichts geht verloren, nichts musst du neu eingeben.",
    },
    {
      q: "Kann ich meine neue Website nachträglich noch anpassen?",
      a: "Ja. Nach der automatischen Erstellung kannst du alle Texte, Bilder und Informationen jederzeit anpassen. Unser Editor ist einfach zu bedienen — wie ein Textverarbeitungsprogramm, nur für Websites. Kein technisches Wissen nötig.",
    },
    {
      q: "Ist die neue Handwerker-Website auch auf dem Smartphone gut?",
      a: "Absolut. Alle von Werkseite.org erstellten Websites sind vollständig responsiv und für Mobilgeräte optimiert. Da über 70 % der Aufträge heute über das Smartphone angefragt werden, ist das für Handwerksbetriebe entscheidend. Deine neue Website sieht auf jedem Gerät professionell aus.",
    },
    {
      q: "Wie hilft die neue Website meinem Betrieb, bei Google gefunden zu werden?",
      a: "Werkseite.org erstellt automatisch suchmaschinenoptimierte Seiten mit korrekten Meta-Titeln, strukturierten Daten und schnellen Ladezeiten — alle Faktoren, die Google für lokale Handwerksbetriebe bewertet. Kunden, die nach 'Klempner in München' oder 'Elektriker in Hamburg' suchen, finden deinen Betrieb damit deutlich leichter.",
    },
  ],
  en: [
    {
      q: "How does werkseite.org work exactly?",
      a: "Simply enter the URL of your existing website. Our AI automatically analyses all content — texts, images, contact details, services — and creates a modern, professional website from it. The entire process takes only a few minutes, without you needing to program or design anything yourself.",
    },
    {
      q: "How much does creating a new tradesperson website cost?",
      a: "Werkseite.org is priced affordably for trade businesses — far cheaper than an agency or freelancer. There are no hidden costs and no setup fees. You only pay for what you actually use. Exact pricing is available in our transparent pricing model after your website is created.",
    },
    {
      q: "How long does it take until my new website is ready?",
      a: "As a rule, your new website is ready within 2 to 5 minutes — from entering the URL to the finished page. You can even play Wreck-It-Ralph in the meantime. No weeks of back-and-forth, no waiting for a designer.",
    },
    {
      q: "Do I need technical or programming knowledge?",
      a: "No. Werkseite.org was developed specifically for trade businesses that don't want to deal with technology. You only need the address of your old website — our AI handles everything else automatically. No code, no design, no prior knowledge required.",
    },
    {
      q: "What happens to the content from my old tradesperson website?",
      a: "Your existing content is fully transferred and modernised. Texts, images, services, opening hours and contact details are all preserved — only the design becomes professional and contemporary. Nothing is lost, nothing needs to be re-entered.",
    },
    {
      q: "Can I customise my new website afterwards?",
      a: "Yes. After the automatic creation, you can adjust all texts, images and information at any time. Our editor is easy to use — like a word processor, but for websites. No technical knowledge needed.",
    },
    {
      q: "Will my new website work well on smartphones?",
      a: "Absolutely. All websites created by werkseite.org are fully responsive and optimised for mobile devices. Since over 70% of job enquiries today come via smartphone, this is crucial for trade businesses. Your new website looks professional on every device.",
    },
    {
      q: "How does the new website help my business get found on Google?",
      a: "Werkseite.org automatically creates search-engine-optimised pages with correct meta titles, structured data and fast loading times — all the factors Google evaluates for local trade businesses. Customers searching for 'plumber in Munich' or 'electrician in Hamburg' will find your business much more easily.",
    },
  ],
};

const COPY = {
  de: {
    eyebrow: "FAQ",
    headline: "Häufig gestellte Fragen.",
    sub: "Alles, was Handwerksbetriebe über Werkseite.org wissen wollen.",
    cta: "Noch Fragen? Schreib uns",
  },
  en: {
    eyebrow: "FAQ",
    headline: "Frequently asked questions.",
    sub: "Everything trade businesses want to know about werkseite.org.",
    cta: "Still have questions? Write to us",
  },
};

function FAQItem({ faq, isOpen, onToggle }: { faq: FAQ; isOpen: boolean; onToggle: () => void }) {
  return (
    <div
      className="border-b border-border-subtle last:border-0"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group cursor-pointer"
        aria-expanded={isOpen}
      >
        <span
          className="font-semibold text-base md:text-[1.05rem] text-ink leading-snug group-hover:text-brand-green transition-colors duration-200"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {faq.q}
        </span>
        <span
          className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 border"
          style={{
            background: isOpen ? "var(--color-brand-green)" : "transparent",
            borderColor: isOpen ? "var(--color-brand-green)" : "rgba(0,0,0,0.12)",
            color: isOpen ? "#fff" : "var(--color-ink-muted)",
          }}
        >
          {isOpen
            ? <Minus className="w-3.5 h-3.5" />
            : <Plus  className="w-3.5 h-3.5" />
          }
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: "hidden" }}
          >
            <p className="text-sm md:text-base text-ink-mid leading-relaxed pb-5 max-w-2xl">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQSection({ lang = "de" }: { lang?: Lang }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const faqs = FAQS[lang];
  const t    = COPY[lang];

  return (
    <section className="py-24 px-6" style={{ background: "var(--color-surface)" }}>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
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
            {t.eyebrow}
          </span>
          <h2
            className="font-extrabold text-3xl md:text-4xl text-ink leading-tight tracking-tight mt-3 mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t.headline}
          </h2>
          <p className="text-base text-ink-mid">{t.sub}</p>
        </motion.div>

        {/* Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14"
        >
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              isOpen={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? null : i)}
            />
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="flex justify-center"
        >
          <AuroraButton
            glowClassName="from-emerald-500 via-green-300 to-teal-400"
            className="px-6 py-2.5 text-sm"
            onClick={() => window.location.href = "mailto:hallo@werkseite.org"}
          >
            {t.cta}
          </AuroraButton>
        </motion.div>

      </div>
    </section>
  );
}
