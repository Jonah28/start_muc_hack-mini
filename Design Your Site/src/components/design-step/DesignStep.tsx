import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, ChevronDown, Sparkles } from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { PALETTES, FONTS, SECTIONS, TEMPLATES, HERO_LAYOUTS } from "./data";
import type { DesignChoices, HeroLayoutId, TemplateDef } from "./types";
import { HeroLayoutCards } from "./HeroLayoutCards";
import { PaletteCards } from "./PaletteCards";
import { FontCards } from "./FontCards";
import { SectionToggles } from "./SectionToggles";


const MANDATORY_SECTIONS = ["hero", "services", "contact"];
const TOTAL_STEPS = 5;
const AUTO_ADVANCE_MS = 400;

const STEP_TITLES = [
  "Pick your color palette",
  "Pick your design language",
  "Choose your hero layout",
  "Which sections do you want?",
  "Review your choices",
];
const STEP_SUBTITLES = [
  "These colors set the tone of your site.",
  "Choose the typography that fits your brand.",
  "This is the first thing visitors see. Pick the layout that fits your business.",
  "We've pre-selected the essentials. Add anything else you need.",
  "Looks good? Hit generate and we'll build it.",
];
const STEP_LABELS = ["Colors", "Typography", "Hero", "Sections", "Review"];

export function DesignStep() {
  const initialTemplate = TEMPLATES[0];
  const [template, setTemplate] = useState<TemplateDef>(initialTemplate);
  const [palette, setPalette] = useState(
    PALETTES.find((p) => p.name === initialTemplate.paletteName) ?? PALETTES[0],
  );
  const [font, setFont] = useState(
    FONTS.find((f) => f.name === initialTemplate.fontName) ?? FONTS[0],
  );
  const [heroLayout, setHeroLayout] = useState<HeroLayoutId>(initialTemplate.heroLayout);
  const [sections, setSections] = useState<string[]>(initialTemplate.sections);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [showJson, setShowJson] = useState(false);

  const handleSectionsChange = (next: string[]) => {
    // Preserve order: mandatory first (if missing), then keep user-given order
    const merged: string[] = [];
    for (const id of MANDATORY_SECTIONS) if (!next.includes(id)) merged.push(id);
    for (const id of next) if (!merged.includes(id)) merged.push(id);
    setSections(merged);
  };

  const choices: DesignChoices = useMemo(
    () => ({
      template: { id: template.id, name: template.name },
      palette: { name: palette.name, colors: palette.colors },
      font,
      heroLayout,
      sections,
    }),
    [template, palette, font, heroLayout, sections],
  );

  const accent = palette.colors[1];

  const goNext = useCallback(() => {
    setDirection(1);
    setStep((s) => Math.min(TOTAL_STEPS - 1, s + 1));
  }, []);
  const goBack = useCallback(() => {
    setDirection(-1);
    setStep((s) => Math.max(0, s - 1));
  }, []);

  const handlePalettePick = (p: typeof palette) => {
    setPalette(p);
    if (step === 0) window.setTimeout(goNext, AUTO_ADVANCE_MS);
  };
  const handleFontPick = (f: typeof font) => {
    setFont(f);
    if (step === 1) window.setTimeout(goNext, AUTO_ADVANCE_MS);
  };
  const handleHeroPick = (id: HeroLayoutId) => {
    setHeroLayout(id);
    if (step === 2) window.setTimeout(goNext, AUTO_ADVANCE_MS);
  };

  const handleGenerate = useCallback(() => {
    console.log("DesignChoices:", choices);
    toast.success("Your website is being generated!", {
      description: "We'll have a preview ready in a moment.",
    });
    const colors = palette.colors;
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.8 }, colors });
    setTimeout(() => {
      confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0, y: 0.8 }, colors });
      confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1, y: 0.8 }, colors });
    }, 200);
    setShowJson(true);
  }, [choices, palette.colors]);

  // Keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable) return;
      if (e.key === "Enter") {
        e.preventDefault();
        if (step === TOTAL_STEPS - 1) handleGenerate();
        else goNext();
      } else if (e.key === "Escape" || e.key === "Backspace") {
        if (step > 0) {
          e.preventDefault();
          goBack();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, goNext, goBack, handleGenerate]);

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  const slideVariants = {
    enter: (dir: 1 | -1) => ({ opacity: 0, y: dir === 1 ? 40 : -40 }),
    center: { opacity: 1, y: 0 },
    exit: (dir: 1 | -1) => ({ opacity: 0, y: dir === 1 ? -40 : 40 }),
  };

  const sectionsStep = 3;
  const reviewStep = 4;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Sticky header with progress */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1100px] items-center gap-4 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white"
              style={{ background: `linear-gradient(135deg, ${accent}, ${palette.colors[0]})` }}
            >
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="hidden min-w-0 sm:block">
              <div className="truncate text-sm font-semibold">Markowsky Elektrotechnik</div>
              <div className="text-xs text-muted-foreground">detected from your site</div>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="text-xs font-medium text-muted-foreground">
              Step {step + 1} of {TOTAL_STEPS}
            </div>
            <div className="h-2 w-32 overflow-hidden rounded-full bg-muted sm:w-48">
              <motion.div
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${accent}, ${palette.colors[0]})` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Step viewport */}
      <main className="relative flex flex-1 items-start justify-center overflow-hidden px-4 py-8 sm:items-center sm:px-6 sm:py-12">
        <AnimatePresence custom={direction} mode="wait" initial={false}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[1000px]"
          >
            <div className="mb-6 sm:mb-8">
              <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: accent }}>
                Step {step + 1} · {STEP_LABELS[step]}
              </div>
              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                {STEP_TITLES[step]}
              </h1>
              <p className="mt-2 text-muted-foreground">{STEP_SUBTITLES[step]}</p>
            </div>

            {step === 0 && <PaletteCards value={palette} onChange={handlePalettePick} />}
            {step === 1 && <FontCards value={font} onChange={handleFontPick} accent={accent} />}
            {step === 2 && (
              <HeroLayoutCards value={heroLayout} onChange={handleHeroPick} palette={palette} font={font} />
            )}
            {step === sectionsStep && (
              <SectionToggles value={sections} onChange={handleSectionsChange} accent={accent} />
            )}
            {step === reviewStep && (
              <ReviewStep
                choices={choices}
                onEditStep={(s) => {
                  setDirection(-1);
                  setStep(s);
                }}
              />
            )}

            {/* Per-step actions */}
            <div className="mt-8 flex items-center justify-between gap-3">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={goBack}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
              ) : (
                <span />
              )}

              {step === sectionsStep && (
                <motion.button
                  type="button"
                  onClick={goNext}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-base font-semibold text-white shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${accent}, ${palette.colors[0]})` }}
                >
                  Continue
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
              )}

              {step === reviewStep && (
                <motion.button
                  type="button"
                  onClick={handleGenerate}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  animate={{
                    boxShadow: [
                      `0 0 0 0 ${accent}66`,
                      `0 0 0 12px ${accent}00`,
                      `0 0 0 0 ${accent}00`,
                    ],
                  }}
                  transition={{ boxShadow: { duration: 1.8, repeat: Infinity, ease: "easeOut" } }}
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-base font-semibold text-white shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${accent}, ${palette.colors[0]})` }}
                >
                  Generate my website
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
              )}

              {(step === 0 || step === 1 || step === 2) && (
                <div className="text-xs text-muted-foreground">
                  Tip: press <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px]">Enter</kbd> to continue
                </div>
              )}
            </div>

            {/* JSON reveal on final step */}
            {step === reviewStep && (
              <AnimatePresence>
                {showJson && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: 32 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="rounded-2xl border border-border bg-card shadow-sm">
                      <button
                        type="button"
                        onClick={() => setShowJson((s) => !s)}
                        className="flex w-full items-center justify-between px-5 py-4 text-left"
                      >
                        <div>
                          <div className="font-semibold">Your choices</div>
                          <div className="text-xs text-muted-foreground">
                            The exact data we'll use to build your site.
                          </div>
                        </div>
                        <ChevronDown className="h-5 w-5" />
                      </button>
                      <pre className="overflow-x-auto border-t border-border bg-muted/40 p-4 text-xs leading-relaxed">
{JSON.stringify(choices, null, 2)}
                      </pre>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

interface ReviewProps {
  choices: DesignChoices;
  onEditStep: (step: number) => void;
}

function ReviewStep({ choices, onEditStep }: ReviewProps) {
  const sectionTitles = choices.sections
    .map((id) => SECTIONS.find((s) => s.id === id)?.title)
    .filter((t): t is string => Boolean(t));
  const heroName = HERO_LAYOUTS.find((h) => h.id === choices.heroLayout)?.name ?? choices.heroLayout;

  return (
    <div className="space-y-4">
        <SummaryRow label="Color palette" onEdit={() => onEditStep(0)}>
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              {choices.palette.colors.map((c) => (
                <div
                  key={c}
                  className="h-7 w-7 rounded-md border border-border"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <div className="font-medium">{choices.palette.name}</div>
          </div>
        </SummaryRow>

        <SummaryRow label="Typography" onEdit={() => onEditStep(1)}>
          <div>
            <div className="text-lg" style={{ fontFamily: choices.font.heading, fontWeight: 700 }}>
              {choices.font.name}
            </div>
            <div className="text-sm text-muted-foreground" style={{ fontFamily: choices.font.body }}>
              Body sample · {choices.font.body}
            </div>
          </div>
        </SummaryRow>

        <SummaryRow label="Hero layout" onEdit={() => onEditStep(2)}>
          <div className="font-medium">{heroName}</div>
        </SummaryRow>

        <SummaryRow label={`Sections (${sectionTitles.length})`} onEdit={() => onEditStep(3)}>
          <div className="flex flex-wrap gap-1.5">
            {sectionTitles.map((t) => (
              <span
                key={t}
                className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        </SummaryRow>
    </div>

  );
}

function SummaryRow({
  label,
  onEdit,
  children,
}: {
  label: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="text-xs font-medium text-muted-foreground underline-offset-2 hover:underline"
        >
          Edit
        </button>
      </div>
      {children}
    </div>
  );
}
