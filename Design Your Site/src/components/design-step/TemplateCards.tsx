import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { TEMPLATES, PALETTES, FONTS } from "./data";
import type { TemplateDef } from "./types";

interface Props {
  value: TemplateDef;
  onChange: (t: TemplateDef) => void;
}

export function TemplateCards({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {TEMPLATES.map((t) => {
        const palette = PALETTES.find((p) => p.name === t.paletteName)!;
        const font = FONTS.find((f) => f.name === t.fontName)!;
        const selected = t.id === value.id;
        const [dark, accent, light] = palette.colors;
        return (
          <motion.button
            key={t.id}
            type="button"
            onClick={() => onChange(t)}
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
            {/* Mini preview header */}
            <div
              className="relative h-24 px-3 py-2"
              style={{ backgroundColor: light }}
            >
              <div
                className="text-[8px] font-semibold uppercase tracking-wider"
                style={{ color: accent }}
              >
                Electrician
              </div>
              <div
                className="mt-0.5 text-[13px] leading-tight"
                style={{ fontFamily: font.heading, color: dark, fontWeight: 700 }}
              >
                Markowsky
              </div>
              <div
                className="absolute bottom-2 left-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold text-white"
                style={{ backgroundColor: accent }}
              >
                📞 Call
              </div>
            </div>
            <div className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.tagline}</div>
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
              <div className="flex gap-1">
                {palette.colors.map((c, i) => (
                  <div
                    key={i}
                    className="h-1.5 flex-1 rounded-full"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
