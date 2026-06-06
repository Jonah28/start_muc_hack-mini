"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type {
  BusinessProfile,
  ColorId,
  PageId,
  SectionId,
  SiteConfig,
  TemplateId,
} from "@/lib/types";
import { PAGE_IDS, SECTION_IDS } from "@/lib/types";

const templates: Array<{ id: TemplateId; name: string; note: string }> = [
  { id: "klar", name: "Klar", note: "Hell, direkt, modern" },
  { id: "tradition", name: "Tradition", note: "Vertraut und bodenständig" },
  { id: "premium", name: "Premium", note: "Ruhig und hochwertig" },
];
const colors: Array<{ id: ColorId; name: string; hex: string }> = [
  { id: "blau", name: "Blau", hex: "#195f92" },
  { id: "gruen", name: "Grün", hex: "#2d6a4f" },
  { id: "orange", name: "Orange", hex: "#c45d18" },
  { id: "anthrazit", name: "Anthrazit", hex: "#30343b" },
];
const sectionLabels: Record<SectionId, string> = {
  services: "Leistungen",
  about: "Über uns",
  area: "Einsatzgebiet",
  contact: "Kontakt",
};
const pageLabels: Record<PageId, string> = {
  leistungen: "Leistungsseite",
  "ueber-uns": "Über-uns-Seite",
  kontakt: "Kontaktseite",
};

export function Generator({ initialUrl }: { initialUrl: string }) {
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [template, setTemplate] = useState<TemplateId>("klar");
  const [color, setColor] = useState<ColorId>("blau");
  const [sections, setSections] = useState<SectionId[]>([...SECTION_IDS]);
  const [pages, setPages] = useState<PageId[]>([...PAGE_IDS]);
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

  function toggle<T extends string>(list: T[], value: T, setter: (next: T[]) => void) {
    setter(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  }

  async function publish() {
    if (!profile) return;
    setPublishing(true);
    setError("");
    try {
      const response = await fetch("/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, template, color, sections, pages, indexable: false }),
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

  if (loading) {
    return <main className="generator-status"><div className="spinner" />Website wird analysiert…</main>;
  }

  if (!profile) {
    return <main className="generator-status error-panel">{error}</main>;
  }

  return (
    <main className="generator-shell">
      <header className="generator-topbar">
        <Link href="/">Werkseite</Link>
        <span>Daten erkannt</span>
      </header>
      <div className="generator-grid">
        <section className="generator-controls">
          <div>
            <p className="eyebrow">Erkannter Betrieb</p>
            <h1>{profile.name}</h1>
            <p>{profile.trade} · {profile.serviceArea}</p>
          </div>

          <fieldset>
            <legend>Design</legend>
            <div className="template-options">
              {templates.map((item) => (
                <label className={`template-card ${template === item.id ? "selected" : ""}`} key={item.id}>
                  <input type="radio" name="template" checked={template === item.id} onChange={() => setTemplate(item.id)} />
                  <span className={`template-swatch template-${item.id}`} />
                  <strong>{item.name}</strong>
                  <small>{item.note}</small>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>Farbe</legend>
            <div className="color-options">
              {colors.map((item) => (
                <label key={item.id} title={item.name}>
                  <input type="radio" name="color" checked={color === item.id} onChange={() => setColor(item.id)} />
                  <span style={{ background: item.hex }} />
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>Homepage-Bereiche</legend>
            <div className="check-options">
              {SECTION_IDS.map((id) => (
                <label key={id}><input type="checkbox" checked={sections.includes(id)} onChange={() => toggle(sections, id, setSections)} />{sectionLabels[id]}</label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>Unterseiten</legend>
            <div className="check-options">
              {PAGE_IDS.map((id) => (
                <label key={id}><input type="checkbox" checked={pages.includes(id)} onChange={() => toggle(pages, id, setPages)} />{pageLabels[id]}</label>
              ))}
            </div>
          </fieldset>

          {!site ? (
            <button className="publish-button" disabled={publishing} onClick={publish}>
              {publishing ? "Wird veröffentlicht…" : "Website veröffentlichen"}
            </button>
          ) : (
            <div className="published-panel">
              <strong>Website ist online</strong>
              <a href={publishedUrl} target="_blank" rel="noreferrer">{publishedUrl}</a>
              <label><input type="checkbox" checked={site.indexable} onChange={(event) => setIndexable(event.target.checked)} />Für Suchmaschinen freigeben</label>
            </div>
          )}
          <p className="form-error">{error}</p>
        </section>

        <section className="generator-preview">
          <div className={`mini-site template-${template} color-${color}`}>
            <header><strong>{profile.name}</strong><span>Anrufen</span></header>
            <div className="mini-hero"><small>{profile.trade}</small><h2>{profile.name}</h2><p>{profile.description}</p><button>Jetzt anrufen</button></div>
            {sections.includes("services") && <div className="mini-block"><h3>Unsere Leistungen</h3><div className="mini-services">{profile.services.slice(0, 3).map((service) => <span key={service}>{service}</span>)}</div></div>}
            {sections.includes("about") && <div className="mini-block muted"><h3>Über uns</h3></div>}
            {sections.includes("contact") && <div className="mini-block"><h3>Kontakt</h3></div>}
          </div>
        </section>
      </div>
    </main>
  );
}
