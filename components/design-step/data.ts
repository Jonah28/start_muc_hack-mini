import type { DesignChoices, FontChoice, HeroLayoutId, PaletteChoice } from "@/lib/types";

export interface Palette extends PaletteChoice {
  vibe: string;
}

export interface SectionDef {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface TemplateDef {
  id: string;
  name: string;
  tagline: string;
  paletteName: string;
  fontName: string;
  heroLayout: HeroLayoutId;
  sections: string[];
}

export const PALETTES: Palette[] = [
  { name: "Trusted Blue", colors: ["#1E3A8A", "#3B82F6", "#FFFFFF", "#475569"], vibe: "Verlässlich und klassisch" },
  { name: "Bold Electric", colors: ["#0A0A0A", "#FACC15", "#FFFFFF", "#6B7280"], vibe: "Modern und energiegeladen" },
  { name: "Warm Craft", colors: ["#5C4033", "#C65D3B", "#FAF3E0", "#1F3D2B"], vibe: "Handgemacht und lokal" },
  { name: "Fresh Green", colors: ["#14532D", "#84CC16", "#FFFFFF", "#1F2937"], vibe: "Sauber und nachhaltig" },
  { name: "Slate Pro", colors: ["#1F2937", "#475B7A", "#E5E7EB", "#F97316"], vibe: "Premium und prägnant" },
];

export const FONTS: FontChoice[] = [
  { name: "Modern Sans", heading: "'Poppins', sans-serif", body: "'Inter', sans-serif" },
  { name: "Classic Serif", heading: "'Playfair Display', serif", body: "'Lato', sans-serif" },
  { name: "Friendly Rounded", heading: "'Nunito', sans-serif", body: "'Nunito', sans-serif" },
];

export const HERO_LAYOUTS: Array<{ id: HeroLayoutId; name: string; description: string }> = [
  { id: "split", name: "Geteilt", description: "Text und Anrufbutton links, Foto rechts." },
  { id: "full-bleed", name: "Großes Bild", description: "Vollflächiges Bild mit starker Überschrift." },
  { id: "minimal", name: "Minimal zentriert", description: "Klar, ohne Bild und mit großem Anrufbutton." },
  { id: "trust-forward", name: "Vertrauen zuerst", description: "Überschrift, Anrufbutton und Vertrauenssignale." },
];

export const SECTIONS: SectionDef[] = [
  { id: "hero", title: "Hero mit Anrufbutton", description: "Große Begrüßung mit direktem Hey-Telo-Anruf.", icon: "📣" },
  { id: "services", title: "Leistungen", description: "Zeigt auf einen Blick, was der Betrieb anbietet.", icon: "🔧" },
  { id: "about", title: "Über uns", description: "Geschichte und Vertrauensaufbau.", icon: "👥" },
  { id: "hours", title: "Öffnungszeiten", description: "Macht die Erreichbarkeit klar.", icon: "🕐" },
  { id: "reviews", title: "Kundenstimmen", description: "Sozialer Beweis für neue Interessenten.", icon: "★" },
  { id: "gallery", title: "Bildergalerie", description: "Zeigt Arbeiten und Projekte.", icon: "▧" },
  { id: "contact", title: "Kontaktformular", description: "Kunden können direkt eine Anfrage senden.", icon: "✉" },
  { id: "map", title: "Einsatzgebiet", description: "Zeigt Städte und Regionen.", icon: "⌖" },
  { id: "faq", title: "Häufige Fragen", description: "Beantwortet typische Kundenfragen.", icon: "?" },
  { id: "emergency", title: "24/7 Notdienst", description: "Prominenter Hinweis für dringende Fälle.", icon: "!" },
];

export const TEMPLATES: TemplateDef[] = [
  { id: "classic-trades", name: "Classic Trades", tagline: "Verlässlich und schnörkellos.", paletteName: "Trusted Blue", fontName: "Modern Sans", heroLayout: "split", sections: ["hero", "services", "about", "hours", "reviews", "contact"] },
  { id: "bold-modern", name: "Bold Modern", tagline: "Kontrastreich und selbstbewusst.", paletteName: "Bold Electric", fontName: "Modern Sans", heroLayout: "full-bleed", sections: ["hero", "services", "gallery", "reviews", "faq", "contact"] },
  { id: "local-craft", name: "Local Craft", tagline: "Warm und passend für Familienbetriebe.", paletteName: "Warm Craft", fontName: "Classic Serif", heroLayout: "trust-forward", sections: ["hero", "about", "gallery", "services", "reviews", "map", "contact"] },
  { id: "clean-eco", name: "Clean & Friendly", tagline: "Freundlich, hell und leicht lesbar.", paletteName: "Fresh Green", fontName: "Friendly Rounded", heroLayout: "minimal", sections: ["hero", "services", "about", "hours", "contact"] },
  { id: "emergency-pro", name: "Emergency Pro", tagline: "Für Notdienste und dringende Einsätze.", paletteName: "Slate Pro", fontName: "Modern Sans", heroLayout: "full-bleed", sections: ["emergency", "hero", "services", "hours", "reviews", "map", "contact"] },
];

export function choicesFromTemplate(template: TemplateDef): DesignChoices {
  const palette = PALETTES.find((item) => item.name === template.paletteName) || PALETTES[0];
  const font = FONTS.find((item) => item.name === template.fontName) || FONTS[0];
  return {
    template: { id: template.id, name: template.name },
    palette: { name: palette.name, colors: palette.colors },
    font,
    heroLayout: template.heroLayout,
    sections: template.sections,
  };
}
