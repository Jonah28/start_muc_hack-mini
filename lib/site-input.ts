import {
  COLOR_IDS,
  PAGE_IDS,
  SECTION_IDS,
  TEMPLATE_IDS,
  type BusinessProfile,
  type ColorId,
  type PageId,
  type SectionId,
  type TemplateId,
} from "@/lib/types";
import { slugify } from "@/lib/utils";

function includes<T extends string>(values: readonly T[], value: unknown): value is T {
  return typeof value === "string" && values.includes(value as T);
}

export function parseSiteInput(body: unknown) {
  if (!body || typeof body !== "object") throw new Error("Ungültige Eingabe.");
  const input = body as Record<string, unknown>;
  const profile = input.profile as BusinessProfile | undefined;
  if (!profile?.name || !profile.sourceUrl) throw new Error("Betriebsdaten fehlen.");

  return {
    profile,
    slug: slugify(String(input.slug || profile.name)) || "handwerksbetrieb",
    template: (includes(TEMPLATE_IDS, input.template) ? input.template : "klar") as TemplateId,
    color: (includes(COLOR_IDS, input.color) ? input.color : "blau") as ColorId,
    sections: (
      Array.isArray(input.sections)
        ? input.sections.filter((value): value is SectionId => includes(SECTION_IDS, value))
        : [...SECTION_IDS]
    ),
    pages: (
      Array.isArray(input.pages)
        ? input.pages.filter((value): value is PageId => includes(PAGE_IDS, value))
        : [...PAGE_IDS]
    ),
    indexable: Boolean(input.indexable),
  };
}
