import type { Palette, FontChoice, SectionDef, HeroLayoutDef, TemplateDef } from "./types";

export const PALETTES: Palette[] = [
  { name: "Trusted Blue", colors: ["#1E3A8A", "#3B82F6", "#FFFFFF", "#475569"], vibe: "Reliable & classic" },
  { name: "Bold Electric", colors: ["#0A0A0A", "#FACC15", "#FFFFFF", "#6B7280"], vibe: "Modern & energetic" },
  { name: "Warm Craft", colors: ["#5C4033", "#C65D3B", "#FAF3E0", "#1F3D2B"], vibe: "Handmade & local" },
  { name: "Fresh Green", colors: ["#14532D", "#84CC16", "#FFFFFF", "#1F2937"], vibe: "Clean & eco" },
  { name: "Slate Pro", colors: ["#1F2937", "#475B7A", "#E5E7EB", "#F97316"], vibe: "Premium & sharp" },
];

export const FONTS: FontChoice[] = [
  { name: "Modern Sans", heading: "'Poppins', sans-serif", body: "'Inter', sans-serif" },
  { name: "Classic Serif", heading: "'Playfair Display', serif", body: "'Lato', sans-serif" },
  { name: "Friendly Rounded", heading: "'Nunito', sans-serif", body: "'Nunito', sans-serif" },
];

export const SECTIONS: SectionDef[] = [
  { id: "hero", title: "Hero with call button", description: "Big welcome with your phone number front and center.", iconName: "Megaphone" },
  { id: "services", title: "Services", description: "List what you offer so customers know they're in the right place.", iconName: "Wrench" },
  { id: "about", title: "About us", description: "Your story, your team, what makes you trustworthy.", iconName: "Users" },
  { id: "hours", title: "Opening hours", description: "When you're available — clear and simple.", iconName: "Clock" },
  { id: "reviews", title: "Customer reviews", description: "Real words from happy customers build instant trust.", iconName: "Star" },
  { id: "gallery", title: "Photo gallery", description: "Show off your best work with photos of finished jobs.", iconName: "Image" },
  { id: "contact", title: "Contact form", description: "Let customers send a message without picking up the phone.", iconName: "Mail" },
  { id: "map", title: "Service area map", description: "Show the towns and regions you cover.", iconName: "MapPin" },
  { id: "faq", title: "FAQ", description: "Answer the questions you get asked over and over.", iconName: "HelpCircle" },
  { id: "emergency", title: "Emergency 24/7 banner", description: "A bold strip saying you're available around the clock.", iconName: "Siren" },
];

export const HERO_LAYOUTS: HeroLayoutDef[] = [
  { id: "split", name: "Split", description: "Headline + call button on the left, photo on the right." },
  { id: "full-bleed", name: "Full-bleed image", description: "Full-width photo with a bold headline on top." },
  { id: "minimal", name: "Minimal centered", description: "Clean, no photo — just headline and a big call button." },
  { id: "trust-forward", name: "Trust-forward", description: "Headline, call button, and trust badges. Photo on the right." },
];

export const TEMPLATES: TemplateDef[] = [
  {
    id: "classic-trades",
    name: "Classic Trades",
    tagline: "Reliable, no-nonsense — the safe pick.",
    paletteName: "Trusted Blue",
    fontName: "Modern Sans",
    heroLayout: "split",
    sections: ["hero", "services", "about", "hours", "reviews", "contact"],
  },
  {
    id: "bold-modern",
    name: "Bold Modern",
    tagline: "Confident and high-contrast — stands out fast.",
    paletteName: "Bold Electric",
    fontName: "Modern Sans",
    heroLayout: "full-bleed",
    sections: ["hero", "services", "gallery", "reviews", "faq", "contact"],
  },
  {
    id: "local-craft",
    name: "Local Craft",
    tagline: "Warm, handmade feel for family businesses.",
    paletteName: "Warm Craft",
    fontName: "Classic Serif",
    heroLayout: "trust-forward",
    sections: ["hero", "about", "gallery", "services", "reviews", "map", "contact"],
  },
  {
    id: "clean-eco",
    name: "Clean & Friendly",
    tagline: "Approachable, light, and easy to read.",
    paletteName: "Fresh Green",
    fontName: "Friendly Rounded",
    heroLayout: "minimal",
    sections: ["hero", "services", "about", "hours", "contact"],
  },
  {
    id: "emergency-pro",
    name: "Emergency Pro",
    tagline: "Built for 24/7 callouts and urgent jobs.",
    paletteName: "Slate Pro",
    fontName: "Modern Sans",
    heroLayout: "full-bleed",
    sections: ["emergency", "hero", "services", "hours", "reviews", "map", "contact"],
  },
];

export const DEFAULT_SECTIONS = TEMPLATES[0].sections;
