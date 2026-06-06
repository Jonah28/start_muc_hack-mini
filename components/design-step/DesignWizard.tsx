"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Lock, Sparkles } from "lucide-react";
import type { BusinessProfile, DesignChoices, HeroLayoutId, SiteConfig } from "@/lib/types";
import { FONTS, HERO_LAYOUTS, PALETTES, SECTIONS, TEMPLATES, choicesFromTemplate, type TemplateDef } from "./data";

const STEP_NAMES = ["Vorlage", "Farben", "Typografie", "Hero", "Bereiche", "Prüfen"];
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

  function chooseTemplate(template: TemplateDef) {
    setChoices(choicesFromTemplate(template));
    window.setTimeout(() => goNext(), 250);
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

      <main className="wizard-main">
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
            {step === 0 && <TemplateCards value={choices.template.id} onChange={chooseTemplate} profile={profile} />}
            {step === 1 && <PaletteCards choices={choices} onChange={(palette) => update({ palette })} />}
            {step === 2 && <FontCards choices={choices} onChange={(font) => update({ font })} profile={profile} />}
            {step === 3 && <HeroCards choices={choices} onChange={(heroLayout) => update({ heroLayout })} profile={profile} />}
            {step === 4 && <SectionCards choices={choices} toggle={toggleSection} />}
            {step === 5 && <Review choices={choices} profile={profile} sections={sectionTitles as string[]} />}

            <div className="wizard-actions">
              {step > 0 ? <button className="wizard-back" onClick={goBack}><ArrowLeft size={17} />Zurück</button> : <Link className="wizard-back" href="/"><ArrowLeft size={17} />Andere URL</Link>}
              {step < 5 ? <button className="wizard-next" onClick={goNext}>Weiter<ArrowRight size={17} /></button> : !site ? (
                <button className="wizard-next" onClick={publish} disabled={publishing}>{publishing ? "Wird veröffentlicht…" : "Website veröffentlichen"}<ArrowRight size={17} /></button>
              ) : null}
            </div>
            {site && <div className="published-panel"><strong>Website ist online</strong><a href={publishedUrl} target="_blank" rel="noreferrer">{publishedUrl}</a><label><input type="checkbox" checked={site.indexable} onChange={(event) => setIndexable(event.target.checked)} />Für Suchmaschinen freigeben</label></div>}
            {error && <p className="form-error">{error}</p>}
          </motion.section>
        </AnimatePresence>
      </main>
    </div>
  );
}

function stepTitle(step: number) {
  return ["Wähle eine Designvorlage", "Wähle deine Farbwelt", "Wähle die Design-Sprache", "Wähle den ersten Eindruck", "Welche Bereiche brauchst du?", "Passt alles?"][step];
}
function stepSubtitle(step: number) {
  return ["Jede Vorlage kombiniert Farben, Schrift und Aufbau. Alles kann danach angepasst werden.", "Diese Farben prägen die komplette neue Website.", "Die Schrift gibt Überschriften und Texten ihren Charakter.", "Der Hero ist das Erste, was Kunden sehen.", "Die wichtigsten Bereiche sind bereits ausgewählt.", "Diese Auswahl wird jetzt als echte Website veröffentlicht."][step];
}

function SelectMark({ selected, accent }: { selected: boolean; accent: string }) {
  return selected ? <span className="choice-check" style={{ background: accent }}><Check size={14} strokeWidth={3} /></span> : null;
}

function TemplateCards({ value, onChange, profile }: { value: string; onChange: (template: TemplateDef) => void; profile: BusinessProfile }) {
  return <div className="choice-grid template-choice-grid">{TEMPLATES.map((template) => {
    const palette = PALETTES.find((item) => item.name === template.paletteName) || PALETTES[0];
    const selected = value === template.id;
    return <button key={template.id} className={`choice-card ${selected ? "selected" : ""}`} style={{ "--choice-accent": palette.colors[1] } as React.CSSProperties} onClick={() => onChange(template)}>
      <div className="template-preview" style={{ background: palette.colors[2], color: palette.colors[0] }}><small style={{ color: palette.colors[1] }}>{profile.trade}</small><b>{profile.name}</b><i style={{ background: palette.colors[1] }}>Jetzt anrufen</i></div>
      <div className="choice-copy"><div><strong>{template.name}</strong><small>{template.tagline}</small></div><SelectMark selected={selected} accent={palette.colors[1]} /></div>
      <div className="palette-strip">{palette.colors.map((color) => <i key={color} style={{ background: color }} />)}</div>
    </button>;
  })}</div>;
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
  return <div className="choice-grid three">{FONTS.map((font) => {
    const selected = choices.font.name === font.name;
    return <button key={font.name} className={`choice-card font-card ${selected ? "selected" : ""}`} style={{ "--choice-accent": choices.palette.colors[1] } as React.CSSProperties} onClick={() => onChange(font)}>
      <div className="choice-copy"><small>{font.name}</small><SelectMark selected={selected} accent={choices.palette.colors[1]} /></div>
      <b style={{ fontFamily: font.heading }}>{profile.name}</b><p style={{ fontFamily: font.body }}>{profile.description}</p>
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

function MiniHero({ layout, choices, profile }: { layout: HeroLayoutId; choices: DesignChoices; profile: BusinessProfile }) {
  const [dark, accent, light] = choices.palette.colors;
  return <div className={`mini-new-hero hero-${layout}`} style={{ "--p-dark": dark, "--p-accent": accent, "--p-light": light, fontFamily: choices.font.body } as React.CSSProperties}><div><small>{profile.trade}</small><b style={{ fontFamily: choices.font.heading }}>{profile.name}</b><i>☎ Anrufen</i>{layout === "trust-forward" && <em>✓ Meisterbetrieb · ✓ Direkt erreichbar</em>}</div><span /></div>;
}

function SectionCards({ choices, toggle }: { choices: DesignChoices; toggle: (id: string) => void }) {
  return <div className="choice-grid">{SECTIONS.map((section) => {
    const required = REQUIRED_SECTIONS.includes(section.id);
    const selected = required || choices.sections.includes(section.id);
    return <button key={section.id} className={`choice-card section-card ${selected ? "selected" : ""}`} style={{ "--choice-accent": choices.palette.colors[1] } as React.CSSProperties} onClick={() => toggle(section.id)}>
      <span className="section-icon" style={{ background: selected ? choices.palette.colors[1] : undefined }}>{section.icon}</span>
      <div><strong>{section.title}</strong><small>{section.description}</small></div>
      {required ? <em><Lock size={11} />Pflicht</em> : <SelectMark selected={selected} accent={choices.palette.colors[1]} />}
    </button>;
  })}</div>;
}

function Review({ choices, profile, sections }: { choices: DesignChoices; profile: BusinessProfile; sections: string[] }) {
  return <div className="review-grid"><div className="review-preview"><MiniHero layout={choices.heroLayout} choices={choices} profile={profile} /><div className="review-sections">{sections.map((section) => <span key={section}>{section}</span>)}</div></div><div className="review-summary"><h2>{choices.template.name}</h2><p>{choices.palette.name} · {choices.font.name}</p><div className="palette-blocks">{choices.palette.colors.map((color) => <i key={color} style={{ background: color }} />)}</div><strong>{sections.length} Bereiche ausgewählt</strong><small>Die veröffentlichte Website startet mit noindex und kann anschließend für Suchmaschinen freigegeben werden.</small></div></div>;
}
