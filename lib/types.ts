export const TEMPLATE_IDS = ["klar", "tradition", "premium"] as const;
export const COLOR_IDS = ["blau", "gruen", "orange", "anthrazit"] as const;
export const SECTION_IDS = ["services", "about", "area", "contact"] as const;
export const PAGE_IDS = ["leistungen", "ueber-uns", "kontakt"] as const;

export type TemplateId = (typeof TEMPLATE_IDS)[number];
export type ColorId = (typeof COLOR_IDS)[number];
export type SectionId = (typeof SECTION_IDS)[number];
export type PageId = (typeof PAGE_IDS)[number];

export interface BusinessProfile {
  name: string;
  trade: string;
  description: string;
  services: string[];
  serviceArea: string;
  phone: string;
  email: string;
  address: string;
  imageUrls: string[];
  sourceUrl: string;
}

export interface SiteConfig {
  id: string;
  slug: string;
  profile: BusinessProfile;
  template: TemplateId;
  color: ColorId;
  sections: SectionId[];
  pages: PageId[];
  indexable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Inquiry {
  id: string;
  siteId: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface Database {
  sites: SiteConfig[];
  inquiries: Inquiry[];
}
