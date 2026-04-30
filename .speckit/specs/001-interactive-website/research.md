# Research — Interactive LLM Course Website

## Tech Stack Decisions

### Build Tool: Vite 5
- Fastest HMR, native ESM, excellent code splitting
- `npm create vite@latest` bootstraps React+TypeScript template

### UI: React 18 + TypeScript 5 (strict)
- Industry standard, best ecosystem for interactive UIs
- Concurrent features for smooth animations

### Styling: Tailwind CSS 3.4
- Utility-first, zero runtime cost, excellent dark mode support
- `tailwindcss@3` + `postcss` + `autoprefixer`

### Visualizations: D3.js v7
- Most complete SVG/canvas manipulation library
- Use with React via `useEffect` + refs (D3 owns the DOM inside SVG)
- Alternative considered: Recharts — rejected (too opinionated, limits custom simulations)
- Alternative considered: Three.js — use only for 3D embeddings chapter

### Animations: Framer Motion 11
- Declarative animations, layout animations, gesture support
- Pairs perfectly with React; better DX than raw CSS transitions

### Math: KaTeX 0.16
- Faster than MathJax, React component via `react-katex`
- Renders LaTeX inline and block

### 3D (Chapter 2 embeddings): Three.js r166 + @react-three/fiber
- Only loaded in Chapter 2 (lazy import)
- `@react-three/drei` for helpers (OrbitControls, etc.)

### Routing: React Router v6 (hash mode)
- `createHashRouter` — no server config required, works on GitHub Pages
- Each chapter is a route `/chapter/:id`

### Testing: Vitest 1.x + React Testing Library 14
- Vitest is Vite-native, fast, compatible with Jest API
- RTL for component behavior tests
- `@vitest/coverage-v8` for coverage reports

## Considered Alternatives

| Decision | Chosen | Rejected | Reason |
|---|---|---|---|
| Build tool | Vite | CRA, Webpack | Speed, modern |
| Charts | D3 + custom | Recharts, Victory | Full control for educational viz |
| Styling | Tailwind | styled-components, CSS modules | Utility class speed |
| Routing | React Router hash | Next.js, Remix | No server needed |
| Math | KaTeX | MathJax | 10x faster render |

## Library Versions (pinned)
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.26.2",
  "d3": "^7.9.0",
  "framer-motion": "^11.3.31",
  "katex": "^0.16.11",
  "react-katex": "^3.0.1",
  "three": "^0.166.1",
  "@react-three/fiber": "^8.17.5",
  "@react-three/drei": "^9.109.2",
  "tailwindcss": "^3.4.10",
  "typescript": "^5.5.4",
  "vite": "^5.4.2",
  "vitest": "^1.6.0",
  "@testing-library/react": "^14.3.1"
}
```

## GitHub Pages Deployment
- Build: `npm run build` → `dist/`
- Deploy: `gh-pages` npm package or GitHub Actions
- Base URL: set `base: '/build-your-own-llm-course/'` in `vite.config.ts`
