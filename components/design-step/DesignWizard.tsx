"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Lock, Sparkles } from "lucide-react";
import type { BusinessProfile, DesignChoices, HeroLayoutId, SiteConfig } from "@/lib/types";
import { FONTS, HERO_LAYOUTS, PALETTES, SECTIONS, TEMPLATES, choicesFromTemplate, type TemplateDef } from "./data";
import { GameOverlay } from "@/components/ui/game-overlay";

const STEP_NAMES = ["Farben", "Typografie", "Hero", "Bereiche", "Prüfen"];
const REQUIRED_SECTIONS = ["hero", "services", "contact"];

export function DesignWizard({ initialUrl }: { initialUrl: string }) {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [choices, setChoices] = useState<DesignChoices>(() => choicesFromTemplate(TEMPLATES[0]));
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [site, setSite] = useState<SiteConfig | null>(null);
  const [publishedUrl, setPublishedUrl] = useState("");
  const [error, setError] = useState(initialUrl ? "" : "Keine Website-Adresse übergeben.");
  const [loading, setLoading] = useState(Boolean(initialUrl));
  const [publishing, setPublishing] = useState(false);
  const [showGame, setShowGame] = useState(false);

  useEffect(() => {
    if (!initialUrl) return;
    fetch("/api/extract", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: initialUrl }),
    })
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.error);
        setProfile(body.profile);
      })
      .catch((caught) => setError(caught.message || "Analyse fehlgeschlagen."))
      .finally(() => setLoading(false));
  }, [initialUrl]);

  const accent = choices.palette.colors[1];
  const progress = ((step + 1) / STEP_NAMES.length) * 100;
  const sectionTitles = useMemo(
    () => choices.sections.map((id) => SECTIONS.find((section) => section.id === id)?.title).filter(Boolean),
    [choices.sections],
  );

  function update(next: Partial<DesignChoices>) {
    setChoices((current) => ({ ...current, ...next }));
  }



  function toggleSection(id: string) {
    if (REQUIRED_SECTIONS.includes(id)) return;
    update({
      sections: choices.sections.includes(id)
        ? choices.sections.filter((section) => section !== id)
        : [...choices.sections, id],
    });
  }

  function goNext() {
    setDirection(1);
    setStep((current) => Math.min(STEP_NAMES.length - 1, current + 1));
  }

  function goBack() {
    setDirection(-1);
    setStep((current) => Math.max(0, current - 1));
  }

  async function publish() {
    if (!profile) return;
    setPublishing(true);
    setShowGame(true);
    setError("");
    try {
      const response = await fetch("/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, design: choices, indexable: false }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error);
      setSite(body.site);
      setPublishedUrl(body.url);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Veröffentlichung fehlgeschlagen.");
      setShowGame(false);
    } finally {
      setPublishing(false);
    }
  }

  async function setIndexable(indexable: boolean) {
    if (!site) return;
    const response = await fetch(`/api/sites/${site.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ indexable }),
    });
    if (response.ok) setSite({ ...site, indexable });
  }

  if (loading) return <main className="generator-status"><div className="spinner" />Website wird mit KI analysiert…</main>;
  if (!profile) return <main className="generator-status error-panel">{error}</main>;

  return (
    <div className="design-wizard" style={{ "--wizard-accent": accent } as React.CSSProperties}>
      <header className="wizard-header">
        <div className="wizard-business">
          <span className="wizard-logo"><Sparkles size={17} /></span>
          <div><strong>{profile.name}</strong><small>{profile.trade} · erkannt aus der Website</small></div>
        </div>
        <div className="wizard-progress"><span>Schritt {step + 1} von {STEP_NAMES.length}</span><div><i style={{ width: `${progress}%` }} /></div></div>
      </header>

      <div className="wizard-split-layout">
        <main className="wizard-main">
        {showGame && (
          <GameOverlay
            url={publishedUrl || profile.name}
            isPublishing={publishing}
            buildSeconds={15}
            onComplete={() => {
              setShowGame(false);
              if (publishedUrl) window.open(publishedUrl, "_blank");
            }}
          />
        )}
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.section
            key={step}
            custom={direction}
            initial={{ opacity: 0, y: direction === 1 ? 28 : -28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: direction === 1 ? -28 : 28 }}
            transition={{ duration: .25 }}
            className="wizard-step"
          >
            <div className="wizard-title"><span>Schritt {step + 1} · {STEP_NAMES[step]}</span><h1>{stepTitle(step)}</h1><p>{stepSubtitle(step)}</p></div>
            {step === 0 && <PaletteCards choices={choices} onChange={(palette) => update({ palette })} />}
            {step === 1 && <FontCards choices={choices} onChange={(font) => update({ font })} profile={profile} />}
            {step === 2 && <HeroCards choices={choices} onChange={(heroLayout) => update({ heroLayout })} profile={profile} />}
            {step === 3 && <SectionCards choices={choices} toggle={toggleSection} />}
            {step === 4 && <Review choices={choices} sections={sectionTitles as string[]} />}

            <div className="wizard-actions">
              {step > 0 ? <button className="wizard-back" onClick={goBack}><ArrowLeft size={17} />Zurück</button> : <Link className="wizard-back" href="/"><ArrowLeft size={17} />Andere URL</Link>}
              {step < 4 ? <button className="wizard-next" onClick={goNext}>Weiter<ArrowRight size={17} /></button> : !site ? (
                <button className="wizard-next" onClick={publish} disabled={publishing}>{publishing ? "Wird veröffentlicht…" : "Website veröffentlichen"}<ArrowRight size={17} /></button>
              ) : null}
            </div>
            {site && <div className="published-panel"><strong>Website ist online</strong><a href={publishedUrl} target="_blank" rel="noreferrer">{publishedUrl}</a><label><input type="checkbox" checked={site.indexable} onChange={(event) => setIndexable(event.target.checked)} />Für Suchmaschinen freigeben</label></div>}
            {error && <p className="form-error">{error}</p>}
          </motion.section>
        </AnimatePresence>
      </main>

      <aside className="wizard-live-preview">
        <div className="preview-container">
          <MiniHero layout={choices.heroLayout} choices={choices} profile={profile} scale="large" />
          <div className="preview-body" style={{ background: choices.palette.colors[2] }}>
            {choices.sections.filter((id) => id !== "hero").map((sectionId) => (
              <PreviewSectionPlaceholder key={sectionId} sectionId={sectionId} choices={choices} />
            ))}
          </div>
        </div>
      </aside>
    </div>
    </div>
  );
}

function stepTitle(step: number) {
  return ["Wähle deine Farbwelt", "Wähle die Design-Sprache", "Wähle den ersten Eindruck", "Welche Bereiche brauchst du?", "Passt alles?"][step];
}
function stepSubtitle(step: number) {
  return ["Diese Farben prägen die komplette neue Website.", "Die Schrift gibt Überschriften und Texten ihren Charakter.", "Der Hero ist das Erste, was Kunden sehen.", "Die wichtigsten Bereiche sind bereits ausgewählt.", "Diese Auswahl wird jetzt als echte Website veröffentlicht."][step];
}

function SelectMark({ selected, accent }: { selected: boolean; accent: string }) {
  return selected ? <span className="choice-check" style={{ background: accent }}><Check size={14} strokeWidth={3} /></span> : null;
}



function PaletteCards({ choices, onChange }: { choices: DesignChoices; onChange: (palette: DesignChoices["palette"]) => void }) {
  return <div className="choice-grid">{PALETTES.map((palette) => {
    const selected = choices.palette.name === palette.name;
    return <button key={palette.name} className={`choice-card palette-card ${selected ? "selected" : ""}`} style={{ "--choice-accent": palette.colors[1] } as React.CSSProperties} onClick={() => onChange({ name: palette.name, colors: palette.colors })}>
      <div className="choice-copy"><div><strong>{palette.name}</strong><small>{palette.vibe}</small></div><SelectMark selected={selected} accent={palette.colors[1]} /></div>
      <div className="palette-blocks">{palette.colors.map((color) => <i key={color} style={{ background: color }} />)}</div>
    </button>;
  })}</div>;
}

function FontCards({ choices, onChange, profile }: { choices: DesignChoices; onChange: (font: DesignChoices["font"]) => void; profile: BusinessProfile }) {
  const dark = choices.palette.colors[0];
  return <div className="choice-grid three">{FONTS.map((font) => {
    const selected = choices.font.name === font.name;
    return <button key={font.name} className={`choice-card font-card ${selected ? "selected" : ""}`} style={{ "--choice-accent": choices.palette.colors[1] } as React.CSSProperties} onClick={() => onChange(font)}>
      <div className="choice-copy"><small>{font.name}</small><SelectMark selected={selected} accent={choices.palette.colors[1]} /></div>
      <b style={{ fontFamily: font.heading, color: dark, fontSize: "1.2rem", display: "block" }}>{profile.name || "Dein Unternehmen"}</b>
      <p style={{ fontFamily: font.body, marginTop: "0.5rem", color: "#697386", fontSize: "0.85rem", lineHeight: 1.5 }}>Ein kurzer Beispieltext, um die Wirkung der Schriftart im Fließtext zu zeigen.</p>
    </button>;
  })}</div>;
}

function HeroCards({ choices, onChange, profile }: { choices: DesignChoices; onChange: (hero: HeroLayoutId) => void; profile: BusinessProfile }) {
  return <div className="choice-grid">{HERO_LAYOUTS.map((hero) => {
    const selected = choices.heroLayout === hero.id;
    return <button key={hero.id} className={`choice-card hero-card ${selected ? "selected" : ""}`} style={{ "--choice-accent": choices.palette.colors[1] } as React.CSSProperties} onClick={() => onChange(hero.id)}>
      <MiniHero layout={hero.id} choices={choices} profile={profile} />
      <div className="choice-copy"><div><strong>{hero.name}</strong><small>{hero.description}</small></div><SelectMark selected={selected} accent={choices.palette.colors[1]} /></div>
    </button>;
  })}</div>;
}

function MiniHero({ layout, choices, profile, scale = "small" }: { layout: HeroLayoutId; choices: DesignChoices; profile: BusinessProfile; scale?: "small" | "large" }) {
  const [dark, accent, light] = choices.palette.colors;
  return <div className={`mini-new-hero hero-${layout} ${scale === "large" ? "scale-large" : ""}`} style={{ "--p-dark": dark, "--p-accent": accent, "--p-light": light, fontFamily: choices.font.body } as React.CSSProperties}><div><small>Dein Text</small><b style={{ fontFamily: choices.font.heading }}>{profile.name}</b><i>☎ Anrufen</i>{layout === "trust-forward" && <em>✓ Meisterbetrieb · ✓ Direkt erreichbar</em>}</div><span /></div>;
}

function SectionCards({ choices, toggle }: { choices: DesignChoices; toggle: (id: string) => void }) {
  return <div className="choice-grid">{SECTIONS.map((section) => {
    const required = REQUIRED_SECTIONS.includes(section.id);
    const selected = required || choices.sections.includes(section.id);
    return <button key={section.id} className={`choice-card section-card ${selected ? "selected" : ""}`} style={{ "--choice-accent": choices.palette.colors[1] } as React.CSSProperties} onClick={() => toggle(section.id)}>
      <div className="flex w-full items-start justify-between mb-3">
        <span className="section-icon" style={{ background: selected ? choices.palette.colors[1] : undefined }}>{section.icon}</span>
        {required ? <em><Lock size={11} />Pflicht</em> : <SelectMark selected={selected} accent={choices.palette.colors[1]} />}
      </div>
      <div><strong className="block text-sm mb-1 leading-tight">{section.title}</strong><small className="block text-xs text-gray-500 leading-snug">{section.description}</small></div>
    </button>;
  })}</div>;
}

function Review({ choices, sections }: { choices: DesignChoices; sections: string[] }) {
  return <div className="review-summary"><h2>{choices.template.name}</h2><p>{choices.palette.name} · {choices.font.name}</p><div className="palette-blocks">{choices.palette.colors.map((color) => <i key={color} style={{ background: color }} />)}</div><strong>{sections.length} Bereiche ausgewählt</strong><small>Die veröffentlichte Website startet mit noindex und kann anschließend für Suchmaschinen freigegeben werden.</small></div>;
}

function PreviewSectionPlaceholder({ sectionId, choices }: { sectionId: string; choices: DesignChoices }) {
  const sectionDef = SECTIONS.find((s) => s.id === sectionId);
  if (!sectionDef) return null;
  const [dark, accent, light] = choices.palette.colors;
  
  let content = null;
  switch (sectionId) {
    case "services":
      content = (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex flex-col rounded-2xl bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] w-full">
              <div className="flex items-center justify-center mb-4 w-10 h-10 rounded-lg" style={{ background: light, color: accent }}>{sectionDef.icon}</div>
              <div className="h-3 rounded-full mb-3" style={{ width: "60%", background: dark }} />
              <div className="h-3 rounded-full bg-slate-200 mb-3 w-[90%]" />
              <div className="h-3 rounded-full bg-slate-200 mb-3 w-[80%]" />
            </div>
          ))}
        </div>
      );
      break;
    case "about":
      content = (
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12 w-full">
          <div className="w-full">
            <div className="h-3 rounded-full bg-slate-200 mb-3 w-full" />
            <div className="h-3 rounded-full bg-slate-200 mb-3 w-[90%]" />
            <div className="h-3 rounded-full bg-slate-200 mb-3 w-[95%]" />
            <div className="h-3 rounded-full bg-slate-200 mb-3 w-[80%]" />
            <div className="mt-8 w-fit rounded-full px-8 py-3 font-bold text-white grid place-items-center" style={{ background: accent }}>Mehr erfahren</div>
          </div>
          <div className="aspect-[4/3] rounded-2xl bg-slate-200 w-full" />
        </div>
      );
      break;
    case "hours":
      content = (
        <div className="mx-auto w-full max-w-[400px] flex flex-col rounded-2xl bg-white p-8" style={{ border: `2px solid ${light}` }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex justify-between border-b border-slate-100 pb-4 mb-4 last:border-0 last:pb-0 last:mb-0 w-full">
              <div className="h-3 rounded-full bg-slate-200 w-[40%]" />
              <div className="h-3 rounded-full w-[30%]" style={{ background: accent }} />
            </div>
          ))}
        </div>
      );
      break;
    case "reviews":
      content = (
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12 w-full">
          {[1, 2].map(i => (
            <div key={i} className="flex flex-col rounded-2xl bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] w-full">
              <div className="mb-4 text-[#FACC15] text-xl">★★★★★</div>
              <div className="h-3 rounded-full bg-slate-200 mb-3 w-full" />
              <div className="h-3 rounded-full bg-slate-200 mb-3 w-[90%]" />
              <div className="mt-6 flex items-center gap-4">
                <div className="h-10 w-10 shrink-0 rounded-full" style={{ background: light }} />
                <div className="h-3 rounded-full bg-slate-200 w-[40%]" />
              </div>
            </div>
          ))}
        </div>
      );
      break;
    case "gallery":
      content = (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full">
          {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="aspect-square rounded-2xl bg-slate-200 w-full" />)}
        </div>
      );
      break;
    case "contact":
      content = (
        <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-12 w-full">
          <div className="grid gap-4 w-full">
            <div className="h-11 rounded-lg border border-slate-200 bg-white w-full" />
            <div className="h-11 rounded-lg border border-slate-200 bg-white w-full" />
            <div className="h-[120px] rounded-lg border border-slate-200 bg-white w-full" />
            <div className="w-fit rounded-full px-8 py-3 font-bold text-white grid place-items-center mt-2" style={{ background: accent }}>Senden</div>
          </div>
          <div className="flex flex-col rounded-2xl p-8 w-full" style={{ background: light, color: dark }}>
            <div className="h-3 rounded-full mb-6 w-[50%]" style={{ background: dark }} />
            <div className="h-3 rounded-full mb-3 w-[70%]" style={{ background: accent }} />
            <div className="h-3 rounded-full mb-3 w-[60%]" style={{ background: accent }} />
          </div>
        </div>
      );
      break;
    case "map":
      content = <div className="aspect-[21/9] rounded-2xl bg-slate-200 w-full" />;
      break;
    case "faq":
      content = (
        <div className="mx-auto flex w-full max-w-[600px] flex-col gap-4">
          {[1, 2, 3, 4].map(i => (
             <div key={i} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 w-full">
               <div className="h-3 rounded-full m-0 w-[60%]" style={{ background: dark }} />
               <span className="text-2xl font-bold leading-none" style={{ color: accent }}>+</span>
             </div>
          ))}
        </div>
      );
      break;
    case "emergency":
      return (
        <div className="py-20 px-8 text-center" style={{ background: accent, color: "white" }}>
          <div className="mx-auto flex w-full max-w-[600px] flex-col items-center gap-8">
             <h3 className="text-3xl md:text-4xl font-bold leading-tight" style={{ fontFamily: choices.font.heading, color: "white" }}>{sectionDef.title}</h3>
             <div className="w-full space-y-4">
               <div className="h-3 rounded-full bg-white/80 w-full" />
               <div className="mx-auto h-3 rounded-full bg-white/80 w-[80%]" />
             </div>
             <div className="mt-4 grid w-fit place-items-center rounded-full bg-white px-8 py-4 font-bold shadow-lg" style={{ color: accent }}>Jetzt Notdienst rufen</div>
          </div>
        </div>
      );
    default:
      content = (
        <div className="space-y-4 w-full">
          <div className="h-3 rounded-full bg-slate-200 w-full" />
          <div className="h-3 rounded-full bg-slate-200 w-[80%]" />
        </div>
      );
  }

  return (
    <section className="flex flex-col border-b border-slate-100 py-16 px-6 md:px-12 even:bg-[#fafcff] bg-white w-full" style={{ color: dark, fontFamily: choices.font.body }}>
      <div className="mx-auto flex w-full max-w-[900px] flex-col gap-10">
        <div className="text-center">
          <span className="mb-6 inline-block rounded-full px-5 py-2.5 text-sm font-bold" style={{ background: light, color: accent }}>{sectionDef.icon} {sectionDef.title}</span>
          <h3 className="text-3xl md:text-4xl font-bold leading-tight" style={{ fontFamily: choices.font.heading }}>Dein Text für {sectionDef.title}</h3>
        </div>
        <div className="w-full flex justify-center">
          {content}
        </div>
      </div>
    </section>
  );
}
