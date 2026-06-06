import { PAGE_IDS, type BusinessProfile, type DesignChoices, type PageId } from "@/lib/types";
import { slugify } from "@/lib/utils";

const DEFAULT_DESIGN: DesignChoices = {
  template: { id: "classic-trades", name: "Classic Trades" },
  palette: {
    name: "Trusted Blue",
    colors: ["#1E3A8A", "#3B82F6", "#FFFFFF", "#475569"],
  },
  font: {
    name: "Modern Sans",
    heading: "'Poppins', sans-serif",
    body: "'Inter', sans-serif",
  },
  heroLayout: "split",
  sections: ["hero", "services", "about", "hours", "reviews", "contact"],
};

function isHex(value: unknown): value is string {
  return typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value);
}

function parseDesign(value: unknown): DesignChoices {
  if (!value || typeof value !== "object") return DEFAULT_DESIGN;
  const design = value as Partial<DesignChoices>;
  const colors = design.palette?.colors;
  return {
    template: {
      id: String(design.template?.id || DEFAULT_DESIGN.template.id).slice(0, 80),
      name: String(design.template?.name || DEFAULT_DESIGN.template.name).slice(0, 100),
    },
    palette: {
      name: String(design.palette?.name || DEFAULT_DESIGN.palette.name).slice(0, 100),
      colors:
        Array.isArray(colors) && colors.length === 4 && colors.every(isHex)
          ? (colors as [string, string, string, string])
          : DEFAULT_DESIGN.palette.colors,
    },
    font: {
      name: String(design.font?.name || DEFAULT_DESIGN.font.name).slice(0, 100),
      heading: String(design.font?.heading || DEFAULT_DESIGN.font.heading).slice(0, 120),
      body: String(design.font?.body || DEFAULT_DESIGN.font.body).slice(0, 120),
    },
    heroLayout: ["split", "full-bleed", "minimal", "trust-forward"].includes(
      String(design.heroLayout),
    )
      ? (design.heroLayout as DesignChoices["heroLayout"])
      : DEFAULT_DESIGN.heroLayout,
    sections: Array.isArray(design.sections)
      ? design.sections.map(String).slice(0, 20)
      : DEFAULT_DESIGN.sections,
  };
}

export function parseSiteInput(body: unknown) {
  if (!body || typeof body !== "object") throw new Error("Ungültige Eingabe.");
  const input = body as Record<string, unknown>;
  const profile = input.profile as BusinessProfile | undefined;
  if (!profile?.name || !profile.sourceUrl) throw new Error("Betriebsdaten fehlen.");

  const design = parseDesign(input.design);
  const pages = [
    ...(design.sections.includes("services") ? ["leistungen" as const] : []),
    ...(design.sections.includes("about") ? ["ueber-uns" as const] : []),
    ...(design.sections.includes("contact") ? ["kontakt" as const] : []),
  ].filter((page): page is PageId => PAGE_IDS.includes(page));

  return {
    profile,
    design,
    slug: slugify(String(input.slug || profile.name)) || "handwerksbetrieb",
    pages,
    indexable: Boolean(input.indexable),
  };
}
