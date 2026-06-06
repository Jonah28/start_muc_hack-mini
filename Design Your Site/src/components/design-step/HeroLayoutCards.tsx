import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { HERO_LAYOUTS } from "./data";
import type { HeroLayoutId, Palette, FontChoice } from "./types";

interface Props {
  value: HeroLayoutId;
  onChange: (id: HeroLayoutId) => void;
  palette: Palette;
  font: FontChoice;
}

export function HeroLayoutCards({ value, onChange, palette, font }: Props) {
  const [dark, accent, light, muted] = palette.colors;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {HERO_LAYOUTS.map((layout) => {
        const selected = layout.id === value;
        return (
          <motion.button
            key={layout.id}
            type="button"
            onClick={() => onChange(layout.id)}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            animate={{
              boxShadow: selected
                ? `0 0 0 2px ${accent}, 0 14px 40px -12px ${accent}66`
                : "0 1px 2px rgba(0,0,0,0.04)",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative overflow-hidden rounded-2xl border border-border bg-card text-left"
          >
            <div className="relative h-44 w-full overflow-hidden border-b border-border">
              <HeroThumb layout={layout.id} dark={dark} accent={accent} light={light} muted={muted} font={font} />
            </div>
            <div className="flex items-start justify-between gap-2 p-4">
              <div>
                <div className="font-semibold">{layout.name}</div>
                <div className="text-xs text-muted-foreground">{layout.description}</div>
              </div>
              <AnimatePresence>
                {selected && (
                  <motion.div
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0 }}
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white"
                    style={{ backgroundColor: accent }}
                  >
                    <Check className="h-4 w-4" strokeWidth={3} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

function CallChip({ accent, font, size = "sm" }: { accent: string; font: FontChoice; size?: "sm" | "md" }) {
  const padding = size === "md" ? "px-3 py-1.5 text-[11px]" : "px-2 py-1 text-[9px]";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold text-white shadow ${padding}`}
      style={{ backgroundColor: accent, fontFamily: font.body }}
    >
      📞 Call now
    </span>
  );
}

function FakePhoto({ dark, accent }: { dark: string; accent: string }) {
  return (
    <div
      className="h-full w-full"
      style={{
        background: `linear-gradient(135deg, ${dark} 0%, ${accent} 100%)`,
      }}
    >
      <div className="flex h-full items-end justify-end p-2 opacity-30">
        <div className="h-2 w-10 rounded-full bg-white" />
      </div>
    </div>
  );
}

function HeroThumb({
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
  font: FontChoice;
}) {
  if (layout === "split") {
    return (
      <div className="grid h-full grid-cols-[1.2fr_1fr]" style={{ backgroundColor: light }}>
        <div className="flex flex-col justify-center gap-1.5 px-3">
          <div className="text-[8px] font-semibold uppercase tracking-wider" style={{ color: accent }}>
            Schwabach
          </div>
          <div
            className="text-[13px] leading-tight"
            style={{ fontFamily: font.heading, color: dark, fontWeight: 700 }}
          >
            Markowsky Elektro
          </div>
          <div className="text-[8px]" style={{ color: muted, fontFamily: font.body }}>
            25+ Jahre Erfahrung
          </div>
          <div className="mt-1">
            <CallChip accent={accent} font={font} />
          </div>
        </div>
        <FakePhoto dark={dark} accent={accent} />
      </div>
    );
  }
  if (layout === "full-bleed") {
    return (
      <div className="relative h-full w-full">
        <FakePhoto dark={dark} accent={accent} />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-3 text-center">
          <div className="text-[8px] font-semibold uppercase tracking-wider text-white/80">
            24/7 Notdienst
          </div>
          <div
            className="text-[14px] leading-tight text-white"
            style={{ fontFamily: font.heading, fontWeight: 700 }}
          >
            Markowsky Elektro
          </div>
          <div className="mt-0.5">
            <CallChip accent={accent} font={font} />
          </div>
        </div>
      </div>
    );
  }
  if (layout === "minimal") {
    return (
      <div
        className="flex h-full flex-col items-center justify-center gap-1.5 px-3 text-center"
        style={{ backgroundColor: light }}
      >
        <div
          className="text-[14px] leading-tight"
          style={{ fontFamily: font.heading, color: dark, fontWeight: 700 }}
        >
          Markowsky Elektro
        </div>
        <div className="text-[8px]" style={{ color: muted, fontFamily: font.body }}>
          Elektriker in Schwabach
        </div>
        <div className="mt-1">
          <CallChip accent={accent} font={font} size="md" />
        </div>
      </div>
    );
  }
  // trust-forward
  return (
    <div className="grid h-full grid-cols-[1.3fr_1fr]" style={{ backgroundColor: light }}>
      <div className="flex flex-col justify-center gap-1 px-3">
        <div
          className="text-[12px] leading-tight"
          style={{ fontFamily: font.heading, color: dark, fontWeight: 700 }}
        >
          Markowsky Elektro
        </div>
        <div className="mt-0.5">
          <CallChip accent={accent} font={font} />
        </div>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {["70+ Jahre", "Meisterbetrieb", "24/7"].map((b) => (
            <span
              key={b}
              className="rounded-full border px-1.5 py-0.5 text-[7px] font-medium"
              style={{ borderColor: dark + "33", color: dark, fontFamily: font.body }}
            >
              {b}
            </span>
          ))}
        </div>
      </div>
      <FakePhoto dark={dark} accent={accent} />
    </div>
  );
}
