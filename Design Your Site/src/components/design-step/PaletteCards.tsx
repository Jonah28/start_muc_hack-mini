import { motion, AnimatePresence } from "framer-motion";
import { Check, Shuffle } from "lucide-react";
import { useState } from "react";
import { PALETTES } from "./data";
import type { Palette } from "./types";

interface Props {
  value: Palette;
  onChange: (p: Palette) => void;
}

export function PaletteCards({ value, onChange }: Props) {
  const [shuffling, setShuffling] = useState(false);

  const surprise = () => {
    setShuffling(true);
    let i = 0;
    const interval = setInterval(() => {
      onChange(PALETTES[Math.floor(Math.random() * PALETTES.length)]);
      i++;
      if (i > 6) {
        clearInterval(interval);
        const pick = PALETTES.filter((p) => p.name !== value.name)[
          Math.floor(Math.random() * (PALETTES.length - 1))
        ];
        onChange(pick);
        setShuffling(false);
      }
    }, 90);
  };

  return (
    <section>
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Pick a color palette</h2>
          <p className="text-sm text-muted-foreground">This sets the look and feel of your whole site.</p>
        </div>
        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          whileHover={{ y: -1 }}
          onClick={surprise}
          disabled={shuffling}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm font-medium shadow-sm hover:bg-accent disabled:opacity-60"
        >
          <Shuffle className={`h-4 w-4 ${shuffling ? "animate-spin" : ""}`} />
          🎲 Surprise me
        </motion.button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {PALETTES.map((p) => {
          const selected = p.name === value.name;
          return (
            <motion.button
              key={p.name}
              type="button"
              onClick={() => onChange(p)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              animate={{
                boxShadow: selected
                  ? `0 0 0 2px ${p.colors[1]}, 0 10px 30px -12px ${p.colors[1]}55`
                  : "0 1px 2px rgba(0,0,0,0.04)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative rounded-2xl border border-border bg-card p-4 text-left"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.vibe}</div>
                </div>
                <AnimatePresence>
                  {selected && (
                    <motion.div
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0 }}
                      className="flex h-6 w-6 items-center justify-center rounded-full text-white"
                      style={{ backgroundColor: p.colors[1] }}
                    >
                      <Check className="h-4 w-4" strokeWidth={3} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="mt-3 flex gap-2">
                {p.colors.map((c, i) => (
                  <motion.div
                    key={i}
                    layout
                    className="h-8 flex-1 rounded-lg border border-black/5"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
