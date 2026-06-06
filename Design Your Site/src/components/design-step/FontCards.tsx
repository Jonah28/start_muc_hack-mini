import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { FONTS } from "./data";
import type { FontChoice } from "./types";

interface Props {
  value: FontChoice;
  onChange: (f: FontChoice) => void;
  accent: string;
}

export function FontCards({ value, onChange, accent }: Props) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-xl font-semibold tracking-tight">Choose a design language</h2>
        <p className="text-sm text-muted-foreground">The typeface sets the personality of your headlines.</p>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {FONTS.map((f) => {
          const selected = f.name === value.name;
          return (
            <motion.button
              key={f.name}
              type="button"
              onClick={() => onChange(f)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              animate={{
                boxShadow: selected
                  ? `0 0 0 2px ${accent}, 0 10px 30px -12px ${accent}55`
                  : "0 1px 2px rgba(0,0,0,0.04)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 text-left"
            >
              <div className="flex items-start justify-between">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{f.name}</div>
                <AnimatePresence>
                  {selected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex h-6 w-6 items-center justify-center rounded-full text-white"
                      style={{ backgroundColor: accent }}
                    >
                      <Check className="h-4 w-4" strokeWidth={3} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div>
                <div
                  className="text-xl leading-tight text-foreground"
                  style={{ fontFamily: f.heading, fontWeight: 700 }}
                >
                  Markowsky Elektrotechnik
                </div>
                <div
                  className="mt-2 text-sm text-muted-foreground"
                  style={{ fontFamily: f.body }}
                >
                  Your trusted local electrician since 1998.
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
