---
name: OneFlow by Datalens
description: AIOps observability console for data pipelines — light, dense, engineered; the Datalens gradient is the signature.
colors:
  paper: "oklch(0.99 0.003 250)"
  ink: "oklch(0.25 0.04 268)"
  lens-blue: "oklch(0.51 0.17 262)"
  lens-teal: "oklch(0.72 0.11 200)"
  lens-violet: "oklch(0.50 0.19 285)"
  muted-ink: "oklch(0.46 0.03 265)"
  hairline: "oklch(0.915 0.008 258)"
  surface-sunken: "oklch(0.962 0.007 255)"
  healthy: "oklch(0.62 0.14 165)"
  warning: "oklch(0.70 0.15 75)"
  failed: "oklch(0.577 0.215 27)"
typography:
  ui:
    fontFamily: "'Inter Variable', ui-sans-serif, system-ui, sans-serif"
  data:
    fontFamily: "'JetBrains Mono Variable', ui-monospace, monospace"
rounded:
  base: "0px"
  sm: "2px"
spacing:
  unit: "4px"
components:
  button-primary:
    backgroundColor: "{colors.lens-blue}"
    textColor: "{colors.paper}"
    rounded: "{rounded.base}"
---

# Design System: OneFlow by Datalens

## Overview

**Creative North Star: "The Operations Console"**

A Databricks-class enterprise workspace carrying the Datalens mark. The product's job is trust: AI proposes (schemas, meanings, rules, diagnoses), the human confirms. The interface therefore behaves like a well-run control room — light, calm, tabular, and exact — never a chatbot carnival and never a dark neon NOC. Density is a feature: operators scan rows, not billboards. The Datalens gradient (teal → blue → violet, from the brand mark) is the single gesture of flair, and it is rationed.

**Key Characteristics:**

- Light paper surfaces, ink-navy text, hairline dividers; depth comes from layering, not shadow.
- Square, engineered corners; the grid is visible in everything.
- One accent (Lens Blue) for action; the gradient appears only as the brand signature and AI-authored evidence.
- Monospace is reserved for data: schema types, file names, record counts, durations.
- Status is a disciplined semantic set (healthy / warning / failed / info), identical everywhere.

## Colors

A restrained strategy: cool neutrals carry the surface; one blue carries action; the gradient carries identity.

### Primary

- **Lens Blue** (oklch(0.51 0.17 262)): the only action color — primary buttons, active nav, focus rings, links that act. Drawn from the violet-blue heart of the Datalens mark.

### Neutral

- **Paper** (oklch(0.99 0.003 250)): app background; barely cool white.
- **Surface Sunken** (oklch(0.962 0.007 255)): recessed zones — table headers, code strips, the sidebar.
- **Ink** (oklch(0.25 0.04 268)): primary text; a navy, never pure black.
- **Muted Ink** (oklch(0.46 0.03 265)): secondary text; holds ≥4.5:1 on Paper.
- **Hairline** (oklch(0.915 0.008 258)): the only border color; 1px everywhere.

### Status

- **Healthy** (oklch(0.62 0.14 165)), **Warning** (oklch(0.70 0.15 75)), **Failed** (oklch(0.577 0.215 27)): used as small dots and soft-tinted badge washes with deep text — never as page-scale fills.

### Named Rules

**The Rationed Gradient Rule.** The teal→violet gradient appears in exactly three places: the brand mark, AI-attributed evidence (inferred schema badges, AI recommendation markers), and the primary-page moment of a surface. If it shows up on a button, a border, or a background, it is wrong.

**The One Action Hue Rule.** Lens Blue is the only hue that means "you can do something here." Status colors never sit on interactive elements.

## Typography

**UI Font:** Inter Variable (with ui-sans-serif fallback)
**Data Font:** JetBrains Mono Variable (with ui-monospace fallback)

**Character:** a workhorse grotesque set tight and quiet, with a real mono for anything measured. No display face; hierarchy comes from weight and spacing, not size theatre.

### Hierarchy

- **Page Title** (600, 1.25rem, 1.3): one per view; sentence case.
- **Section Heading** (600, 0.875rem, 1.4): introduces a table or panel; more space above than below.
- **Body** (400, 0.8125rem, 1.55): default UI text; measures stay under 75ch.
- **Label** (500, 0.6875rem, 0.04em tracking, uppercase): column headers, field labels, metadata keys.
- **Data** (400, 0.75rem, mono): schema types, file names, row counts, durations, IDs.

### Named Rules

**The Measured Mono Rule.** Mono is set only on things that are measured or machine-named — never as a "technical" costume for prose.

## Layout

Fixed sidebar (16rem) + top navbar (3.25rem) + canvas. Canvas content maxes at 72rem with 1.5–2rem gutters; tables run edge-to-edge of their container. Density target: a 1440×900 viewport shows a full table header and ≥12 rows without scrolling. On <1024px the sidebar collapses into a sheet; the navbar hamburger (user menu) never moves.

## Elevation & Depth

Flat by default. Hairlines do the separating. Shadows appear only for floating layers — dropdowns, sheets, popovers, toasts — as a single soft, offset shadow (0 8px 24px rgb(15 23 42 / 0.12)). No shadows on cards, tables, or buttons at rest.

### Named Rules

**The Flat-By-Default Rule.** If a surface needs a shadow to be seen, the hairline or the layering is wrong.

## Shapes

Engineered squareness. Corners are square (0px) on structural elements and 2px on small controls that request a radius. No pills, no blobs, no rounded cards. Status is a 6px square dot, not a circle, when it sits inside tables and lists.

## Components

### Buttons

- **Shape:** square (0px radius), compact (h-8 default).
- **Primary:** Lens Blue on Paper text; hover deepens ~8%; active translates 1px.
- **Outline / Ghost:** hairline border or none; hover fills with Surface Sunken.
- **Rules:** one primary per view; labels are verbs ("New workflow", "Run validation").

### Tables (the signature component)

- Hairline row dividers; header row in Surface Sunken with uppercase labels.
- Row hover: faint Lens Blue wash; whole row is the click target when it navigates.
- Numbers and types right-aligned in mono; status as a square dot + label.

### Badges

- Square, soft status wash (8–12% chroma tint) with deep status text; domain badges are neutral with Ink text.

### Inputs / Fields

- Hairline border, Paper background, square corners; focus swaps the border to Lens Blue with a 2px ring at 25% opacity. Error: Failed border + message naming the fix.

### Navigation

- Sidebar: Sunken surface; the active item is marked by a soft Lens Blue wash (~7% tint) and medium weight — no leading-edge bars or hard color blocks anywhere in the system. Hover stays a neutral gray so the two states never compete.
- Navbar: Paper, hairline under-edge; hamburger opens the user menu (settings, theme, misc) — it never navigates.

## Do's and Don'ts

### Do:

- **Do** give every AI proposal visible evidence (sample values, confidence) — trust is the product.
- **Do** keep tables dense, aligned, and mono where measured.
- **Do** use the gradient only per the Rationed Gradient Rule.
- **Do** mark demonstration data clearly when it could be mistaken for real customer data.

### Don't:

- **Don't** round corners beyond 2px or introduce pill shapes.
- **Don't** add shadows to resting surfaces, or glass/blur decoration anywhere.
- **Don't** use gradient text, sparkline placeholders, or progress rings as content substitutes.
- **Don't** let status color appear on interactive elements, or Lens Blue on non-interactive ones.
