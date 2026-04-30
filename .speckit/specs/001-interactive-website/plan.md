# Plan — Build Your Own LLM: Interactive Course Website

> **For agentic workers:** Use `/speckit.implement` to execute this plan task-by-task.
> Tasks use checkbox (`- [ ]`) syntax. Work in dependency order; respect `[P]` markers for parallel groups.

## Overview

A Vite + React + TypeScript SPA deployed to GitHub Pages. Each of the 9 course chapters is a lazily-loaded route. Chapters contain prose, KaTeX formulas, and D3-powered interactive visualizations. No backend.

## Directory Structure

```
build-your-own-llm-course/
├── src/
│   ├── main.tsx                    # App entry, router setup
│   ├── App.tsx                     # Shell: nav sidebar + router outlet
│   ├── router.tsx                  # Hash router definition, lazy chapter imports
│   ├── pages/
│   │   └── Home.tsx                # Course homepage, chapter grid
│   ├── chapters/
│   │   ├── ch01-big-picture/
│   │   │   ├── index.tsx           # Chapter 1 root component
│   │   │   ├── NextWordDemo.tsx    # Interactive next-word prediction
│   │   │   └── content.ts          # Prose, formulas as data
│   │   ├── ch02-tokenization/
│   │   │   ├── index.tsx
│   │   │   ├── BPEVisualizer.tsx   # Byte-pair encoding step visualizer
│   │   │   ├── TokenizerWidget.tsx # Type-a-word tokenizer
│   │   │   ├── EmbeddingSpace3D.tsx # Three.js 3D embedding plot
│   │   │   └── content.ts
│   │   ├── ch03-attention/
│   │   │   ├── index.tsx
│   │   │   ├── AttentionMatrix.tsx  # Animated dot-product attention
│   │   │   ├── MultiHeadViz.tsx    # Multi-head attention visualization
│   │   │   ├── CausalMask.tsx      # Autoregressive masking
│   │   │   └── content.ts
│   │   ├── ch04-transformer/
│   │   │   ├── index.tsx
│   │   │   ├── TransformerDiagram.tsx # Clickable architecture diagram
│   │   │   ├── LayerNormViz.tsx
│   │   │   ├── ActivationViz.tsx   # GELU/ReLU plot
│   │   │   └── content.ts
│   │   ├── ch05-pretraining/
│   │   │   ├── index.tsx
│   │   │   ├── LossSurface3D.tsx   # 3D loss landscape
│   │   │   ├── TrainingDynamics.tsx # Live loss curve with LR slider
│   │   │   └── content.ts
│   │   ├── ch06-finetuning/
│   │   │   ├── index.tsx
│   │   │   ├── LoRAViz.tsx         # Rank decomposition, param counter
│   │   │   └── content.ts
│   │   ├── ch07-alignment/
│   │   │   ├── index.tsx
│   │   │   ├── RLHFPipeline.tsx    # Animated pipeline diagram
│   │   │   └── content.ts
│   │   ├── ch08-reasoning/
│   │   │   ├── index.tsx
│   │   │   ├── ChainOfThought.tsx  # CoT trace visualization
│   │   │   └── content.ts
│   │   └── ch09-deployment/
│   │       ├── index.tsx
│   │       ├── QuantizationWidget.tsx # Bit-width slider
│   │       └── content.ts
│   ├── components/
│   │   ├── Layout.tsx              # Page shell with nav
│   │   ├── Sidebar.tsx             # Chapter list, progress tracking
│   │   ├── ChapterHeader.tsx       # Title, progress bar
│   │   ├── MathBlock.tsx           # KaTeX wrapper (block)
│   │   ├── MathInline.tsx          # KaTeX wrapper (inline)
│   │   ├── Slider.tsx              # Accessible slider with label
│   │   ├── InfoCard.tsx            # Highlighted callout boxes
│   │   ├── ProgressBadge.tsx       # Visited/complete badge
│   │   └── SectionDivider.tsx      # Visual separator between sections
│   ├── utils/
│   │   ├── progress.ts             # localStorage read/write for visited chapters
│   │   ├── mathHelpers.ts          # softmax, attention score, etc.
│   │   ├── bpe.ts                  # BPE tokenization algorithm (demo)
│   │   └── colorScales.ts          # D3 color scale helpers
│   ├── data/
│   │   ├── chapters.ts             # Chapter metadata (id, title, description, route)
│   │   └── embeddings-2d.ts        # Pre-computed 2D word embeddings for viz
│   └── styles/
│       └── index.css               # Tailwind directives + global overrides
├── public/
│   └── favicon.svg
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.node.json
└── package.json
```

## Architecture Decisions

### 1. Chapter Isolation
Each chapter is a React.lazy() import — zero impact on initial bundle. Chapters share only the `components/` and `utils/` layer; they never import from each other.

### 2. Interactive Widget Pattern
Every widget follows the same structure:
```tsx
// WidgetName.tsx
const WidgetName: React.FC = () => {
  const [param, setParam] = useState(defaultValue);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // D3 renders into svgRef.current
    // Depends on param
  }, [param]);

  return (
    <div>
      <svg ref={svgRef} />
      <Slider value={param} onChange={setParam} label="..." min={...} max={...} />
    </div>
  );
};
```

### 3. Progress Persistence
`utils/progress.ts` stores visited chapter IDs in `localStorage` under key `llm-course-progress`. `Sidebar.tsx` reads this on mount; chapter route components mark themselves visited via `useEffect`.

### 4. Math Rendering
`MathBlock` and `MathInline` wrap `react-katex` with error boundaries — if a formula fails to parse, it falls back to the raw LaTeX string rather than crashing the page.

### 5. Routing
`createHashRouter` with routes:
- `/` → `Home` (chapter grid)
- `/chapter/1` through `/chapter/9` → lazy chapter components
- `*` → redirect to `/`

## Implementation Phases

### Phase 1 — Project Scaffold
Set up Vite + React + TypeScript + Tailwind + dependencies. Get a working "Hello World" page with routing.

Files: `package.json`, `vite.config.ts`, `tailwind.config.ts`, `tsconfig.json`, `src/main.tsx`, `src/App.tsx`, `index.html`

### Phase 2 — Shell & Navigation
Build the Layout, Sidebar, and Home page. Progress tracking via localStorage.

Files: `src/components/Layout.tsx`, `src/components/Sidebar.tsx`, `src/pages/Home.tsx`, `src/data/chapters.ts`, `src/utils/progress.ts`, `src/router.tsx`

### Phase 3 — Shared Components
MathBlock/MathInline (KaTeX), Slider, InfoCard, ChapterHeader, ProgressBadge.

Files: `src/components/MathBlock.tsx`, `src/components/MathInline.tsx`, `src/components/Slider.tsx`, `src/components/InfoCard.tsx`, `src/components/ChapterHeader.tsx`, `src/components/ProgressBadge.tsx`

### Phase 4 — Chapter 1: The Big Picture [P]
Chapter 1 with the "next-word prediction" interactive widget (D3 probability bar chart).

Files: `src/chapters/ch01-big-picture/`

### Phase 5 — Chapter 2: Tokenization & Embeddings [P]
BPE visualizer, tokenizer widget, 3D embedding space (Three.js), positional encoding explorer.

Files: `src/chapters/ch02-tokenization/`, `src/utils/bpe.ts`, `src/data/embeddings-2d.ts`

### Phase 6 — Chapter 3: Attention Mechanisms [P]
Animated attention matrix, multi-head attention viz, causal mask.

Files: `src/chapters/ch03-attention/`, `src/utils/mathHelpers.ts`

### Phase 7 — Chapter 4: Transformer Architecture [P]
Clickable transformer diagram, LayerNorm viz, GELU activation plot.

Files: `src/chapters/ch04-transformer/`

### Phase 8 — Chapter 5: Pretraining [P]
3D loss surface, training dynamics simulator with LR slider.

Files: `src/chapters/ch05-pretraining/`

### Phase 9 — Chapters 6–9: Fine-Tuning, Alignment, Reasoning, Deployment [P]
LoRA visualization, RLHF pipeline animation, CoT trace, quantization widget.

Files: `src/chapters/ch06-finetuning/`, `src/chapters/ch07-alignment/`, `src/chapters/ch08-reasoning/`, `src/chapters/ch09-deployment/`

### Phase 10 — Polish & Deploy
Performance audit, accessibility pass, GitHub Pages deployment config.

Files: `vite.config.ts` (base URL), `.github/workflows/deploy.yml`

## Spec Coverage Check
| Spec Requirement | Plan Section |
|---|---|
| Home page with 9 chapters | Phase 2 — Home.tsx + chapters.ts |
| Each chapter < 1.5s load | Phase 1 — lazy imports (code splitting) |
| At least one interactive widget per chapter | Phases 4–9 — each chapter has dedicated widget components |
| KaTeX formulas | Phase 3 — MathBlock/MathInline |
| URL hash routing | Phase 1/2 — createHashRouter |
| Visited chapters in localStorage | Phase 2 — utils/progress.ts |
| Lighthouse > 80 | Phase 10 — perf audit |
| ARIA labels on sliders | Phase 3 — Slider.tsx |
| Responsive layout | Phase 2 — Layout.tsx (Tailwind responsive classes) |
| No JS errors | Phase 10 — error boundaries |
