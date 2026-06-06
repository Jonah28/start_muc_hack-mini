import { motion, AnimatePresence } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { Phone } from "lucide-react";
import { SECTIONS } from "./data";
import type { DesignChoices, HeroLayoutId } from "./types";

interface Props {
  choices: DesignChoices;
}

export function HeroPreview({ choices }: Props) {
  const [dark, accent, light, muted] = choices.palette.colors;
  // Preserve user-chosen ordering from the template's section list
  const selectedSections = choices.sections
    .map((id) => SECTIONS.find((s) => s.id === id))
    .filter((s): s is (typeof SECTIONS)[number] => Boolean(s));

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Live preview
        </div>
        <motion.div
          key={choices.palette.name + choices.font.name + choices.heroLayout}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-muted-foreground"
        >
          updates as you choose
        </motion.div>
      </div>

      <motion.div
        layout
        className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
      >
        {/* Browser chrome */}
        <div className="flex items-center gap-2 border-b border-border bg-muted/60 px-3 py-2">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
          </div>
          <div className="mx-auto rounded-md bg-background px-3 py-0.5 text-[11px] text-muted-foreground">
            markowsky-elektrotechnik.de
          </div>
        </div>

        {/* Hero (variant) */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={choices.heroLayout}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <HeroVariant
              layout={choices.heroLayout}
              dark={dark}
              accent={accent}
              light={light}
              muted={muted}
              font={choices.font}
            />
          </motion.div>
        </AnimatePresence>

        {/* Section placeholders */}
        <div className="space-y-2 border-t border-border bg-background p-4">
          <AnimatePresence initial={false}>
            {selectedSections.map((s) => {
              const Icon =
                (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[s.iconName] ??
                LucideIcons.Square;
              return (
                <motion.div
                  key={s.id}
                  layout
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, height: 0, marginTop: 0, paddingTop: 0, paddingBottom: 0 }}
                  transition={{ type: "spring", stiffness: 320, damping: 28 }}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5"
                >
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{ backgroundColor: accent + "22", color: accent }}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 text-sm font-medium" style={{ color: dark, fontFamily: choices.font.body }}>
                    {s.title}
                  </div>
                  <div className="h-1.5 w-12 rounded-full" style={{ backgroundColor: accent + "33" }} />
                </motion.div>
              );
            })}
          </AnimatePresence>
          {selectedSections.length === 0 && (
            <div className="py-6 text-center text-xs text-muted-foreground">
              Pick at least one section to add to your page.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function HeroVariant({
  layout,
  dark,
  accent,
  light,
  muted,
  font,
}: {
  layout: HeroLayoutId;
  dark: string;
  accent: string;
  light: string;
  muted: string;
  font: { heading: string; body: string };
}) {
  const callBtn = (
    <motion.button
      type="button"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold shadow-lg"
      style={{ backgroundColor: accent, color: getReadableText(accent), fontFamily: font.body }}
    >
      <Phone className="h-4 w-4" />
      📞 Call now
    </motion.button>
  );

  if (layout === "split") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-[1.2fr_1fr]" style={{ backgroundColor: light }}>
        <div className="px-6 py-8 sm:px-8 sm:py-10">
          <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: accent }}>
            Elektriker · Schwabach
          </div>
          <h1
            className="mt-2 text-3xl leading-tight sm:text-4xl"
            style={{ fontFamily: font.heading, color: dark, fontWeight: 700 }}
          >
            Markowsky Elektrotechnik
          </h1>
          <p className="mt-3 max-w-md text-sm sm:text-base" style={{ fontFamily: font.body, color: muted }}>
            Zuverlässige Elektroinstallationen — seit über 25 Jahren.
          </p>
          <div className="mt-5">{callBtn}</div>
        </div>
        <div style={{ background: `linear-gradient(135deg, ${dark}, ${accent})` }} className="min-h-[160px]" />
      </div>
    );
  }

  if (layout === "full-bleed") {
    return (
      <div className="relative min-h-[260px] overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(135deg, ${dark}, ${accent})` }}
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative flex min-h-[260px] flex-col items-center justify-center px-6 py-10 text-center">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-white/80">
            24/7 Notdienst · Schwabach
          </div>
          <h1
            className="mt-2 text-3xl leading-tight text-white sm:text-4xl"
            style={{ fontFamily: font.heading, fontWeight: 700 }}
          >
            Markowsky Elektrotechnik
          </h1>
          <p className="mt-3 max-w-md text-sm text-white/85" style={{ fontFamily: font.body }}>
            Schnelle Hilfe wenn der Strom ausfällt.
          </p>
          <div className="mt-5">{callBtn}</div>
        </div>
      </div>
    );
  }

  if (layout === "minimal") {
    return (
      <div
        className="flex flex-col items-center justify-center px-6 py-12 text-center sm:py-16"
        style={{ backgroundColor: light }}
      >
        <h1
          className="text-3xl leading-tight sm:text-4xl"
          style={{ fontFamily: font.heading, color: dark, fontWeight: 700 }}
        >
          Markowsky Elektrotechnik
        </h1>
        <p className="mt-3 max-w-md text-sm sm:text-base" style={{ fontFamily: font.body, color: muted }}>
          Ihr Elektriker in Schwabach.
        </p>
        <div className="mt-6">{callBtn}</div>
      </div>
    );
  }

  // trust-forward
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1.3fr_1fr]" style={{ backgroundColor: light }}>
      <div className="px-6 py-8 sm:px-8 sm:py-10">
        <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: accent }}>
          Meisterbetrieb · Schwabach
        </div>
        <h1
          className="mt-2 text-3xl leading-tight sm:text-4xl"
          style={{ fontFamily: font.heading, color: dark, fontWeight: 700 }}
        >
          Markowsky Elektrotechnik
        </h1>
        <div className="mt-4">{callBtn}</div>
        <div className="mt-4 flex flex-wrap gap-2">
          {["70+ Jahre", "Meisterbetrieb", "24/7 Notdienst"].map((b) => (
            <span
              key={b}
              className="rounded-full border px-2.5 py-1 text-[11px] font-semibold"
              style={{ borderColor: dark + "33", color: dark, fontFamily: font.body }}
            >
              ✓ {b}
            </span>
          ))}
        </div>
      </div>
      <div style={{ background: `linear-gradient(135deg, ${dark}, ${accent})` }} className="min-h-[160px]" />
    </div>
  );
}

function getReadableText(hex: string) {
  const c = hex.replace("#", "");
  if (c.length !== 6) return "#fff";
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#0A0A0A" : "#FFFFFF";
}
