# Project Constitution — Build Your Own LLM (Interactive Course Website)

## Project Purpose
An interactive, browser-based tutorial website teaching LLM fundamentals from first principles.
Target audience: engineers, researchers, and AI enthusiasts who want to understand how LLMs work under the hood.

## Code Quality
- No TypeScript compilation errors (strict mode)
- ESLint with react-hooks plugin; no warnings in production build
- Max component file length: 300 lines (split into sub-components otherwise)
- No inline styles except for dynamic values; use CSS modules or Tailwind
- Prefer composition over prop drilling beyond 2 levels

## Testing
- TDD is mandatory — tests are written before implementation code
- A failing test is the expected starting state for any task
- Unit tests: Vitest + React Testing Library for components and utility functions
- Coverage threshold: 70% for utility functions; UI components covered by integration tests
- No snapshot tests — test behavior, not markup

## TIA — Test Impact Analysis
- Test runner: Vitest
- TIA scoping command: `npx vitest run --reporter=verbose $(git diff --name-only HEAD | grep -E '\.(ts|tsx)$' | sed 's|src/||' | sed 's|\.tsx\?$||' | tr '\n' ' ')`
- Full test suite: `npm test`
- Never invoke `vitest` directly — always use `npm test` or the TIA scoping command above

## Architecture
- Single-page application (SPA) with hash-based routing (no server required)
- Layers: `pages/` → `sections/` (lesson components) → `components/` (interactive widgets) → `utils/` (math/data helpers)
- State flows down via props; no global store unless more than 3 components share state
- Forbidden: `any` type in TypeScript, `console.log` left in production code, direct DOM manipulation outside of `useEffect`
- Each lesson section is a self-contained component; no cross-lesson imports

## Tech Standards
- React 18 + TypeScript 5 (strict mode)
- Vite as build tool
- Tailwind CSS for styling
- D3.js for data visualizations and interactive graphics
- Framer Motion for animations
- KaTeX for math formula rendering
- React Router v6 (hash routing)
- Vitest + React Testing Library for tests
- No banned libraries; minimize dependency count — prefer one library doing one job well

## Performance
- Initial page load < 2s on a standard laptop (Lighthouse score > 80)
- Lazy-load each lesson chapter (code splitting)
- Interactive simulations must run at 60fps; debounce slider inputs at 16ms
- Bundle size: warn if any chunk exceeds 500KB gzipped

## Compliance / Accessibility
- WCAG 2.1 AA: all interactive elements keyboard-navigable, proper ARIA labels on sliders
- No PII collected; no analytics without user consent
- All math formulas must have alt-text equivalents

## Forbidden Patterns
- No class components (hooks only)
- No jQuery or Lodash (use native JS/TS)
- No direct fetch calls in components — isolate in `utils/`
- No hardcoded lesson content in component JSX — content lives in `data/` or `content/` files
- No circular imports

## Git Conventions
- Feature branches: `feat/NNN-feature-name`
- Commit messages: conventional commits (`feat:`, `fix:`, `docs:`, `test:`, `refactor:`)
- Never commit with `--no-verify`
