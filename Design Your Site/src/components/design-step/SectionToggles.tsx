import { motion, AnimatePresence } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { Check, Lock } from "lucide-react";
import { SECTIONS } from "./data";

const MANDATORY_IDS = ["hero", "services", "contact"];

interface Props {
  value: string[];
  onChange: (next: string[]) => void;
  accent: string;
}

export function SectionToggles({ value, onChange, accent }: Props) {
  const toggle = (id: string) => {
    if (MANDATORY_IDS.includes(id)) return;
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);
  };

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-xl font-semibold tracking-tight">Sections to include</h2>
        <p className="text-sm text-muted-foreground">Tap any block to add it to your page. You can change this later.</p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {SECTIONS.map((s) => {
          const isMandatory = MANDATORY_IDS.includes(s.id);
          const selected = value.includes(s.id) || isMandatory;
          const Icon = (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[s.iconName] ?? LucideIcons.Square;
          return (
            <motion.button
              key={s.id}
              type="button"
              onClick={() => toggle(s.id)}
              whileHover={isMandatory ? undefined : { y: -2 }}
              whileTap={isMandatory ? undefined : { scale: 0.98 }}
              animate={{
                boxShadow: selected
                  ? `0 0 0 2px ${accent}, 0 10px 28px -14px ${accent}55`
                  : "0 1px 2px rgba(0,0,0,0.04)",
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative flex items-start gap-3 rounded-2xl border border-border bg-card p-4 text-left"
              style={{ cursor: isMandatory ? "default" : "pointer" }}
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: selected ? accent : "transparent",
                  color: selected ? "#fff" : "var(--color-muted-foreground)",
                  border: selected ? "none" : "1px solid var(--color-border)",
                }}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-medium">{s.title}</div>
                  {isMandatory ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      <Lock className="h-3 w-3" />
                      Required
                    </span>
                  ) : (
                    <AnimatePresence>
                      {selected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="flex h-5 w-5 items-center justify-center rounded-full text-white"
                          style={{ backgroundColor: accent }}
                        >
                          <Check className="h-3 w-3" strokeWidth={3} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{s.description}</div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
