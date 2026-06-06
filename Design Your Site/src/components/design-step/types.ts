export interface Palette {
  name: string;
  colors: string[]; // [primary/dark, accent, light bg, muted text]
  vibe: string;
}

export interface FontChoice {
  name: string;
  heading: string;
  body: string;
}

export interface SectionDef {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export type HeroLayoutId = "split" | "full-bleed" | "minimal" | "trust-forward";

export interface HeroLayoutDef {
  id: HeroLayoutId;
  name: string;
  description: string;
}

export interface TemplateDef {
  id: string;
  name: string;
  tagline: string;
  paletteName: string;
  fontName: string;
  heroLayout: HeroLayoutId;
  sections: string[]; // ordered
}

export interface DesignChoices {
  template: { id: string; name: string };
  palette: { name: string; colors: string[] };
  font: { name: string; heading: string; body: string };
  heroLayout: HeroLayoutId;
  sections: string[];
}
