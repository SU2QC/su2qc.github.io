---
name: SU2QC
description: Academic collaboration website for AI-accelerated quantum simulation of non-Abelian gauge dynamics.
colors:
  paper: "#f7f6f2"
  white: "#ffffff"
  ink: "#10213b"
  muted: "#566478"
  line: "#d9dce2"
  cobalt: "#3157d5"
  soft: "#eceff5"
  ink-soft: "#c6ceda"
  focus-gold: "#ffbf47"
  footer-ink: "#091529"
typography:
  display:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "clamp(48px, 6vw, 80px)"
    fontWeight: 600
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "clamp(36px, 4vw, 55px)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "30px"
    fontWeight: 600
    lineHeight: 1.1
  body:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "0.16em"
  micro:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "10px"
    fontWeight: 600
    lineHeight: 1.2
  nav:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 650
    lineHeight: 1.2
  lede:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "20px"
    fontWeight: 400
    lineHeight: 1.55
  body-small:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.4
  research-note:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.6
  person-initials:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "31px"
    fontWeight: 600
    lineHeight: 1
  person-label:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "11px"
    fontWeight: 800
    lineHeight: 1.2
  mobile-display:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "46px"
    fontWeight: 600
    lineHeight: 0.98
rounded:
  none: "0px"
  circle: "50%"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  section: "92px"
components:
  button-primary:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.white}"
    rounded: "{rounded.none}"
    padding: "10px 18px"
    height: "44px"
  button-quiet:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "10px 18px"
    height: "44px"
  field:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "12px"
  surface:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "28px"
---

# Design System: SU2QC

## Overview

**Creative North Star: "The Research Ledger"**

SU2QC presents serious research with the calm authority of an editorial institute: warm paper, deep ink, a single cobalt signal, and typography that carries most of the expression. The system is intentionally spare so the subject matter, people, and materials remain the visual center.

The layout alternates open reading space with precise rules and one restrained dark field. Surfaces are flat and useful. Motion is limited to native interaction feedback; nothing competes with reading or suggests scientific results that are not present.

**Key Characteristics:**

- Editorial serif headlines paired with an exact sans-serif interface.
- Warm paper ground, deep ink, neutral rules, and restrained cobalt emphasis.
- A disciplined 1180px shell with generous section rhythm and narrow prose.
- Source-backed content and explicit empty states instead of invented proof.

## Colors

The palette is institutional and low-noise: one dark anchor, one signal accent, and neutral paper surfaces.

### Primary

- **Restrained Cobalt** (`{colors.cobalt}`): Actions, links, active states, research markers, and focus-adjacent emphasis.

### Neutral

- **Deep Ink** (`{colors.ink}`): Primary text, navigation anchor, dark bands, and brand mark.
- **Footer Ink** (`{colors.footer-ink}`): The deepest footer field.
- **Muted Slate** (`{colors.muted}`): Supporting copy and metadata; never for primary text.
- **Paper** (`{colors.paper}`): The default reading surface.
- **White** (`{colors.white}`): Discrete content surfaces and form surfaces.
- **Hairline** (`{colors.line}`): Rules and borders.
- **Soft Mist** (`{colors.soft}`): Secondary tonal section background and tags.

**The One Signal Rule.** Cobalt is reserved for actions, navigation state, and meaningful research emphasis; it should not become a decorative wash.

## Typography

**Display Font:** Source Serif 4 (with Georgia, serif)

**Body Font:** Inter (with Arial, sans-serif)

**Character:** The serif gives scientific and editorial material a human voice. Inter keeps navigation, metadata, labels, and form controls exact and easy to scan.

### Hierarchy

- **Display** (600, `clamp(48px, 6vw, 80px)`, 0.98): Home and page-opening statements.
- **Headline** (600, `clamp(36px, 4vw, 55px)`, 1.05): Section-level arguments and dark-band statements.
- **Title** (600, 30px, 1.1): Research pillars and material titles.
- **Body** (400, 16px, 1.6): Reading copy with a comfortable 65–75ch measure where possible.
- **Label** (800, 12px, 0.16em, uppercase): Compact metadata and section context, used sparingly.

**The Type Carries Rule.** Use scale, weight, and whitespace to establish hierarchy before adding ornament or color.

## Layout

The page uses a centered shell capped near 1180px with 20px horizontal gutters on desktop and 14px on narrow screens. Sections use a generous 92px vertical rhythm, while 8px multiples organize component spacing. Prose stays narrower than the shell. Desktop compositions use two-column editorial grids; at 850px they collapse to readable single-column flows, and at 560px controls and content become full width.

## Elevation & Depth

The system is flat by default. Depth comes from tonal changes between paper, white, soft mist, deep ink, and thin rules rather than shadows. Focus is an explicit state with a high-contrast ring; hover changes borders or color without lifting cards.

**The Flat Surface Rule.** Use a border or tonal field for structure, never a decorative shadow stack.

## Shapes

The form language is square and editorial: zero-radius buttons, fields, cards, and panels. Portraits use a consistent rectangular crop; borders remain 1px hairlines and tags remain compact rectangular labels rather than pills.

## Components

### Buttons

- **Shape:** Square corners (`0px`) with a 44px minimum height.
- **Primary:** Cobalt field, white text, 10px 18px padding.
- **Hover / Focus:** Preserve the cobalt signal, darken or strengthen the border on quiet controls, and use the global visible focus ring.
- **Secondary / Quiet:** White field with a hairline border and ink text.

### Cards / Containers

- **Corner Style:** Square (`0px`).
- **Background:** White for discrete objects; paper or soft mist for grouping.
- **Shadow Strategy:** No resting shadow; structure comes from a hairline or tonal contrast.
- **Border:** One neutral 1px rule where the object needs containment.
- **Internal Padding:** 24–45px depending on object scale.

### Inputs / Fields

- **Style:** White field, neutral 1px border, square corners, 12px internal padding.
- **Focus:** Cobalt border with a visible 3px translucent ring.
- **Error / Disabled:** Plain-language status below the control; preserve readable contrast and never rely on color alone.

### Navigation

- **Style:** Sticky paper header with a hairline lower rule; the supplied `public/images/su2qc-logo.png` wordmark identifies the home link; Inter labels and cobalt mark the current route.
- **Desktop:** Inline links and a bordered member-upload action.
- **Mobile:** Preserve every route in a native disclosure menu; never hide the primary navigation entirely.

### Research Lattice

The home signature is the supplied SU2QC diagram: oriented SU(2) links, a highlighted plaquette loop, and a separate quantum-circuit region with a Gauss-check stage. It is a conceptual diagram, not a scientific result claim; render the full transparent image inside a restrained academic frame.

## Do's and Don'ts

### Do:

- **Do** let the research copy and investigator names lead the page.
- **Do** use rules, whitespace, and tonal fields to group content.
- **Do** keep public claims traceable to the official source register.
- **Do** make loading, empty, error, and success states explicit and useful.
- **Do** preserve keyboard focus, reduced motion, and minimum touch targets.

### Don't:

- **Don't** use gradients, glassmorphism, neon effects, stock science imagery, or decorative charts.
- **Don't** fabricate students, publications, awards, results, or endorsements.
- **Don't** turn every section into a repeated card wall.
- **Don't** use gray-on-gray text or hide mobile navigation links.
