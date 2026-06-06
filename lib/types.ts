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

export interface SiteImageAsset {
  id: string;
  alt: string;
  prompt: string;
  url?: string;
}

export interface SitePageImages {
  hero: SiteImageAsset;
  feature: SiteImageAsset;
}

export interface ServiceContent {
  name: string;
  description: string;
}

export interface ValueContent {
  title: string;
  description: string;
}

export interface SiteContent {
  services: {
    eyebrow: string;
    title: string;
    intro: string;
    services: ServiceContent[];
    processTitle: string;
    processIntro: string;
    processSteps: string[];
    images: SitePageImages;
  };
  about: {
    eyebrow: string;
    title: string;
    intro: string;
    paragraphs: string[];
    values: ValueContent[];
    images: SitePageImages;
  };
  contact: {
    eyebrow: string;
    title: string;
    intro: string;
    callbackText: string;
    areaText: string;
    images: SitePageImages;
  };
}

export interface SiteConfig {
  id: string;
  slug: string;
  profile: BusinessProfile;
  design: DesignChoices;
  content: SiteContent;
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
