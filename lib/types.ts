export const PAGE_IDS = ["leistungen", "ueber-uns", "kontakt"] as const;
export type PageId = (typeof PAGE_IDS)[number];

export type HeroLayoutId = "split" | "full-bleed" | "minimal" | "trust-forward";

export interface PaletteChoice {
  name: string;
  colors: [string, string, string, string];
}

export interface FontChoice {
  name: string;
  heading: string;
  body: string;
}

export interface DesignChoices {
  template: { id: string; name: string };
  palette: PaletteChoice;
  font: FontChoice;
  heroLayout: HeroLayoutId;
  sections: string[];
}

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
  design: DesignChoices;
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
