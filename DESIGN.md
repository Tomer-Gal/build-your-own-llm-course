---
# Design tokens — machine-readable (used by AI agents for UI generation)
colors:
  # Backgrounds (dark theme)
  surface-0: "#0f1117"      # App background
  surface-1: "#161b27"      # Sidebar, cards
  surface-2: "#1d2435"      # Hover states, code blocks
  surface-3: "#242c3f"      # Slider tracks, input backgrounds

  # Brand (indigo-blue)
  brand-50:  "#f0f4ff"
  brand-100: "#e0e9ff"
  brand-400: "#6b87fa"
  brand-500: "#4f6ef7"      # Primary CTA, active links, highlighted values
  brand-600: "#3d5ce6"
  brand-700: "#2c4bd4"
  brand-900: "#1a2e9e"

  # Semantic
  success:   "#10b981"      # Completed badges, correct answers
  warning:   "#f59e0b"      # Watch-out InfoCards, royalty cluster
  danger:    "#f43f5e"      # Error states, high-loss regions
  info:      "#06b6d4"      # Info InfoCards, places cluster

  # Text
  text-primary:   "#f1f5f9"  # Headings, body copy
  text-secondary: "#94a3b8"  # Subtitles, labels
  text-muted:     "#475569"  # Footnotes, dividers, min/max labels

  # Accent palette (used in visualizations and chapter badges)
  vis-royalty:  "#f59e0b"
  vis-animals:  "#10b981"
  vis-tech:     "#6366f1"
  vis-food:     "#f43f5e"
  vis-places:   "#06b6d4"

typography:
  fontFamily-sans:  "Inter, system-ui, sans-serif"
  fontFamily-mono:  "JetBrains Mono, Fira Code, monospace"
  scale:
    xs:   { size: "0.75rem",  lineHeight: "1rem",    weight: 400 }
    sm:   { size: "0.875rem", lineHeight: "1.25rem",  weight: 400 }
    base: { size: "1rem",     lineHeight: "1.75rem",  weight: 400 }
    lg:   { size: "1.125rem", lineHeight: "1.75rem",  weight: 400 }
    xl:   { size: "1.25rem",  lineHeight: "1.75rem",  weight: 500 }
    2xl:  { size: "1.5rem",   lineHeight: "2rem",     weight: 600 }
    3xl:  { size: "1.875rem", lineHeight: "2.25rem",  weight: 700 }
    4xl:  { size: "2.25rem",  lineHeight: "2.5rem",   weight: 700 }
    5xl:  { size: "3rem",     lineHeight: "1",         weight: 800 }

spacing:
  # 4px base unit
  1: "4px"   2: "8px"   3: "12px"  4: "16px"  5: "20px"
  6: "24px"  8: "32px"  10: "40px" 12: "48px" 16: "64px"

radii:
  sm: "6px"   md: "10px"   lg: "14px"   xl: "18px"   full: "9999px"

components:
  InteractiveCard:
    background: surface-2
    border: "1px solid rgba(148,163,184,0.1)"
    borderRadius: xl
    padding: 6
    headerSize: xl
    headerWeight: 600

  InfoCard:
    variants: [info, tip, warning, concept]
    borderRadius: lg
    padding: 5
    iconSize: "1.125rem"

  Slider:
    trackHeight: "8px"
    thumbSize: "18px"
    thumbColor: brand-500
    valueColor: brand-500
    valueFontFamily: mono

  ProgressBadge:
    color: success
    background: "rgba(16,185,129,0.1)"
    border: "rgba(16,185,129,0.2)"

  ChapterCard:
    hover: { border: brand-500, background: surface-2 }
    transition: "200ms ease"

  ChapterNavButton:
    # "Next Chapter →" / "← Previous" at bottom of each chapter
    background: surface-2
    hoverBackground: surface-3
    borderRadius: lg
    padding: "12px 20px"
    fontWeight: 500

educational:
  WorkedExampleWrapper:
    # Surrounds every interactive widget
    preWidget:
      heading: { size: lg, weight: 600 }
      observe: "What to observe"  # Required before each interactive
    postWidget:
      insight: "What this tells us"  # Optional; used for complex widgets
  LearningOutcomes:
    # Top of each chapter, after ChapterHeader
    style: "checklist"
    icon: "✓"
    max: 4
  ChapterBridge:
    # Bottom of each chapter, before NextChapterNav
    style: "callout"
    icon: "→"

accessibility:
  contrastRatio: "WCAG AA (4.5:1 minimum for text)"
  focusRing: "2px solid brand-500, offset 2px"
  reducedMotion: "Respect prefers-reduced-motion on all Framer Motion components"
  ariaRequired:
    - "All sliders: aria-label, aria-valuenow, aria-valuemin, aria-valuemax, aria-valuetext"
    - "All interactive SVGs: role=img + aria-label"
    - "Progress bars: role=progressbar + aria-valuenow + aria-valuemax"
    - "InfoCards: role=note"
---

# DESIGN.md — Build Your Own LLM Course

> Design system specification for the interactive LLM course website.
> Machine-readable tokens are in the YAML front matter above.
> This document describes the *why* behind each decision so AI agents and contributors
> can make consistent choices without consulting a designer.

---

## 1. Philosophy

**Dark, focused, educational.** The interface gets out of the way so concepts take centre stage.
Inspired by: Linear (surface hierarchy), Brilliant.org (integrated interactives), 3Blue1Brown (visual-first maths).

Three rules:
1. **Text and visuals pair, never compete.** Every formula has adjacent prose; every interactive has a "What to observe" heading before it and an insight after it.
2. **One thing at a time.** Progressive disclosure. Show the concept, then the formula, then the interactive. Not all at once.
3. **Dark backgrounds, bright accents.** The dark palette reduces eye strain for long reading sessions. Brand indigo (`#4f6ef7`) is the single accent — used sparingly so it retains meaning.

---

## 2. Colors

### Surface hierarchy (four levels)
| Token | Hex | Use |
|---|---|---|
| `surface-0` | `#0f1117` | App background — the floor everything sits on |
| `surface-1` | `#161b27` | Sidebar, chapter cards — one level up from background |
| `surface-2` | `#1d2435` | Interactive card backgrounds, hover states |
| `surface-3` | `#242c3f` | Slider tracks, input backgrounds, tertiary surfaces |

**Rule:** Never jump more than one level in a single nesting. A card on `surface-0` uses `surface-1`; a card inside that uses `surface-2`.

### Brand indigo
Used for: active nav links, slider thumbs, highlighted values, primary CTAs, progress bars.
**Do not** use brand color for decorative purposes — it signals interactivity or importance.

### Semantic colors
| Use | Color |
|---|---|
| Success / complete | `#10b981` (emerald) |
| Warning / watch out | `#f59e0b` (amber) |
| Error / high loss | `#f43f5e` (rose) |
| Info / neutral note | `#06b6d4` (cyan) |

### Visualization palette
Each embedding category and data group has a fixed color. Never reuse a vis color for UI chrome — keep viz palette separate from brand palette.

---

## 3. Typography

**Inter** for all prose and UI. **JetBrains Mono** for code, formula values, and slider readouts.

| Role | Size | Weight | Notes |
|---|---|---|---|
| Chapter title (h1) | 3xl–4xl | 700 | Always white (`text-primary`) |
| Chapter subtitle | xl | 500 | Brand color (`brand-500`) |
| Section heading (h2) | 2xl | 600 | White |
| Widget heading | lg–xl | 600 | White |
| "What to observe" label | sm | 600 | `text-secondary`, uppercase, tracked |
| Body prose | base | 400 | `text-secondary` (`#94a3b8`), line-height 1.75 |
| Captions / muted labels | sm–xs | 400 | `text-muted` (`#475569`) |
| Slider value readout | sm | 500 | Mono, `brand-500` |
| Code | sm | 400 | Mono, `surface-2` background |

**Rule:** Never set body prose to pure white (`text-primary`). Use `text-secondary` (`#94a3b8`). Reserve white for headings. This contrast difference guides the eye naturally.

---

## 4. Layout

### Page shell
- Sidebar: 288px fixed, `surface-1` background
- Main content: fluid, max-width 4xl (896px), centered
- Content padding: `px-4 py-8 lg:px-8 lg:py-12`
- Mobile: sidebar hidden behind hamburger; bottom "Next Chapter" bar always visible

### Spacing rhythm
All vertical spacing uses multiples of 4px. Section dividers use `my-10` (40px). Inter-paragraph spacing uses `mb-4` (16px). Interactive cards use `my-8` (32px) top margin to breathe.

### Content width
- Prose max-width: `max-w-3xl` (768px) — optimal line length for reading (~70 chars)
- Interactive cards: `max-w-4xl` (896px) — can be wider than prose to fit visualizations
- Full-bleed: only for hero sections on the home page

---

## 5. Educational UX Patterns

These patterns encode research from cognitive load theory, the worked examples effect, and progressive disclosure.

### Pattern 1: The Worked Example Wrapper
**Every interactive widget must be wrapped in this structure:**

```
[Widget Section Heading]            ← lg font, bold
[1–2 sentences: what this shows]   ← prose, explains the concept before interacting
[💡 What to observe]               ← sm, uppercase label
  [Specific thing to watch]        ← 1 bullet or short sentence
[Interactive widget]               ← the D3/React component
[What this tells us]               ← 1 sentence insight after interacting (optional)
```

**Why:** The worked examples effect (Sweller, 2006) shows novices learn better by studying a worked example first, then practicing. Placing widgets after explanatory text, not before, matches this pattern. The "What to observe" label further reduces extraneous cognitive load by directing attention.

### Pattern 2: Chapter Learning Outcomes
**Every chapter starts with a `<LearningOutcomes>` section** (after ChapterHeader):
```
By the end of this chapter you will:
✓ Understand [concrete thing 1]
✓ Be able to [do concrete thing 2]
✓ Intuitively grasp [intuition 3]
```
Maximum 4 outcomes. Use concrete verbs: "calculate", "visualize", "explain to someone else", not "understand" alone.

### Pattern 3: Chapter Bridge (end of chapter)
**Every chapter ends with a "What's next" callout** before the Next Chapter navigation:
```
→ In the next chapter: [specific topic]
  [1 sentence connecting this chapter to the next — why the order matters]
```
This creates narrative continuity and answers "why am I learning this now?"

### Pattern 4: Progressive Disclosure on Sliders
Sliders should have:
- A `hint` prop: semantic label for each pole (e.g., "← Uniform | Peaked →")
- An `explanation` prop: one sentence below the slider explaining what changing it does

### Pattern 5: Formula Integration
Formulas must never float alone. Structure:
```
[Prose sentence ending in a colon:]
[Formula block]
[Sentence explaining each variable — x is..., y is...]
```

---

## 6. Component Specifications

### InteractiveCard
The container for every widget. `surface-2` background, `xl` border-radius, `p-6` padding.
Has a required `title` prop (displayed as `lg` heading) and optional `description` prop (1 sentence, `sm`, `text-secondary`).

### Slider
Required props: `label`, `value`, `onChange`, `min`, `max`.
Optional props: `hint` (pole labels), `step`, `formatValue`.
`hint` renders as `"← {hintLeft} | {hintRight} →"` in `xs text-muted` below the track.

### InfoCard
Four variants: `info`, `tip`, `warning`, `concept`.
Use `concept` for key definitions (purple border). Use `tip` for actionable takeaways. Use `warning` for common misconceptions. Use `info` for supplementary context.
**Do not stack more than 2 InfoCards in a row** without intervening prose — it reads as a listicle, not a narrative.

### ChapterNavButton
Displayed at the bottom of every chapter. Two buttons: `← Previous` (left-aligned) and `Next Chapter: [Title] →` (right-aligned). Both link to `/chapter/N`. First chapter hides "Previous". Last chapter shows "You've completed the course! 🎉" instead of "Next".

### LearningOutcomes
Displayed immediately after `ChapterHeader`. Small checklist in a subtle `surface-2` box. Items begin with `✓`. Max 4 items.

---

## 7. Elevation & Depth

No box shadows on the dark theme — depth is communicated through background color stepping.
| Element | Depth |
|---|---|
| App background | 0 (surface-0) |
| Sidebar / main cards | 1 (surface-1) |
| Interactive widget cards | 2 (surface-2) |
| Tooltip / popover | border only, no shadow |
| Modal (if ever used) | surface-1 + backdrop blur |

---

## 8. Motion & Animation

All animations should feel **precise, not decorative**. Serve comprehension, not aesthetics.

| Context | Guideline |
|---|---|
| Page entrance | `opacity 0→1, y 20→0, duration 0.4s` (Framer Motion) |
| Staggered lists | 50ms delay per item |
| Widget updates (D3) | `duration(400).ease(d3.easeCubicOut)` |
| Sidebar collapse | `duration 300ms ease` |
| All animations | Respect `prefers-reduced-motion` via Framer Motion `useReducedMotion()` |

---

## 9. Do's and Don'ts

### Do
- Pair every formula with a prose explanation immediately after
- Add "What to observe" before every interactive
- Connect chapters with a "What's next" bridge at the end
- Use `text-secondary` for body prose, white only for headings
- Use `brand-500` only for interactive/important elements
- Keep InfoCards to ≤2 in a row

### Don't
- Don't add a widget without preceding explanatory prose
- Don't use `text-white` (`text-primary`) for long-form body copy
- Don't use brand color decoratively
- Don't nest more than 2 surface levels in a single component
- Don't use box shadows (use surface level stepping instead)
- Don't animate for decoration — every animation should aid comprehension
- Don't stack 3+ InfoCards without intervening prose
