
# Design Your Website — Step 3 of 4

A single-page, fully standalone React screen with mock data, framer-motion animations, and a live hero preview that updates as the user picks a palette, font, and sections.

## Scope

- One route at `/` (replaces the placeholder index page).
- No backend, no persistence — pure local state.
- Desktop-first two-column layout, collapses to one column on mobile.

## Files

- `src/routes/index.tsx` — route shell + page metadata, renders `<DesignStep />`.
- `src/components/design-step/DesignStep.tsx` — top-level layout, state container for `DesignChoices`, sticky header + sticky footer, generate handler (confetti + toast + console.log + reveal JSON panel).
- `src/components/design-step/PaletteCards.tsx` — 5 palette cards (radio), swatches, ring + check on selected, "🎲 Surprise me" shuffle.
- `src/components/design-step/FontCards.tsx` — 3 font cards (radio) with live font samples.
- `src/components/design-step/SectionToggles.tsx` — 10 multi-select toggle cards with lucide icons.
- `src/components/design-step/HeroPreview.tsx` — browser-framed mock preview using selected palette/font + animated stacked section placeholders (framer-motion `layout`).
- `src/components/design-step/data.ts` — palette, font, and section mock data (exact hex/font/section values from the spec).
- `src/components/design-step/types.ts` — `DesignChoices` interface.

## Dependencies to add

- `framer-motion` — animations + layout transitions.
- `canvas-confetti` (+ `@types/canvas-confetti`) — confetti on generate.
- Toast: use existing `sonner` (already wired in stack).
- Lucide icons: already installed.

## Fonts

Load via `<link>` in `src/routes/__root.tsx` head (per Tailwind v4 rules, no `@import` URL in CSS):
Poppins, Inter, Playfair Display, Lato, Nunito.
No `@theme` token needed — fonts are applied inline via `style={{ fontFamily }}` because they are user-selected at runtime.

## State shape (exact contract)

```ts
interface DesignChoices {
  palette: { name: string; colors: string[] };
  font: { name: string; heading: string; body: string };
  sections: string[];
}
```

Initial state: palette = "Trusted Blue", font = "Modern Sans", sections = ["hero","services","about","hours","contact"].

## Layout

```text
┌─────────────────────────────────────────────────┐
│ Sticky header: Markowsky Elektrotechnik         │
│ [detected from your site]   Step 3 of 4 ▓▓▓░    │
├─────────────────────────────────────────────────┤
│  max-w-[1000px], px-6, py-8                     │
│  ┌────────────────┐   ┌─────────────────────┐   │
│  │ Palette cards  │   │  Live hero preview  │   │
│  │ Font cards     │   │  (sticky on desktop)│   │
│  │ Section toggles│   │  + section stack    │   │
│  └────────────────┘   └─────────────────────┘   │
├─────────────────────────────────────────────────┤
│ Sticky footer: [ Generate my website → ] pulse  │
└─────────────────────────────────────────────────┘
```

Mobile: single column, preview moves above choices (or below — will pick whichever reads best; preview-above gives instant feedback context).

## Live preview details

- Browser chrome with three dots, address bar showing "markowsky-elektrotechnik.de".
- Background uses palette color[2] (light), accent button uses color[1], headline uses color[0], body text uses color[3].
- Headline "Markowsky Elektrotechnik" in selected heading font; tagline in body font.
- Always-visible "📞 Call now" button styled with palette accent.
- Below the hero: vertical stack of compact placeholder blocks, one per selected section, each with its lucide icon + label. Uses framer-motion `<AnimatePresence>` + `layout` so adding/removing sections animates smoothly.

## Polish

- Staggered fade-in on initial mount (motion variants with `staggerChildren`).
- Cards: `whileHover={{ y: -2 }}` lift + soft shadow bump.
- Selected state: animated ring + check badge (scale-in).
- Generate button: subtle infinite `scale` pulse via motion.
- On generate: `canvas-confetti` burst, `toast.success("Your website is ready!")`, `console.log(choices)`, expand a `<details>`-style JSON panel below the footer showing the `DesignChoices` object pretty-printed.

## Design tokens

Use existing semantic tokens (`bg-background`, `text-foreground`, `bg-card`, `border-border`, `text-muted-foreground`) for the chrome. Palette swatches and preview use raw user-selected hex values inline — this is intentional (user is literally picking colors).

## Out of scope

- Real crawling, backend, persistence, routing to other steps, auth.
- Step 1/2/4 screens (only the progress bar reflects Step 3 of 4).
