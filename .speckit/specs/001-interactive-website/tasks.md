# Tasks — Build Your Own LLM: Interactive Course Website

## Phase 1: Project Scaffold

- [ ] TEST: Verify scaffold tooling resolves correctly
      File: `src/__tests__/app.test.tsx`
      TIA scope: `npx vitest run src/__tests__/app.test.tsx`
      Notes: Write a test that imports App and checks it renders without crashing

- [ ] IMPL: Initialize Vite + React + TypeScript project, install all dependencies
      Files: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/styles/index.css`, `tailwind.config.ts`, `postcss.config.js`
      Exit criteria: `npm run build` succeeds; `npm test` passes the smoke test above

## Phase 2: Shell & Navigation

- [ ] TEST: Write failing tests for progress tracking utility
      File: `src/utils/__tests__/progress.test.ts`
      TIA scope: `npx vitest run src/utils/__tests__/progress.test.ts`
      Notes: Test markVisited(), getVisited(), isVisited() with mocked localStorage

- [ ] IMPL: Implement progress.ts (localStorage read/write)
      File: `src/utils/progress.ts`
      Exit criteria: progress.test.ts passes

- [ ] TEST: Write failing tests for chapters data
      File: `src/data/__tests__/chapters.test.ts`
      TIA scope: `npx vitest run src/data/__tests__/chapters.test.ts`
      Notes: Assert all 9 chapters present, each has id/title/description/route fields

- [ ] IMPL: Create chapters.ts metadata
      File: `src/data/chapters.ts`
      Exit criteria: chapters.test.ts passes

- [ ] TEST: Write failing tests for Layout and Sidebar rendering
      File: `src/components/__tests__/Layout.test.tsx`
      TIA scope: `npx vitest run src/components/__tests__/Layout.test.tsx`
      Notes: Render Layout with mock children; assert sidebar renders chapter names; assert nav links present

- [ ] IMPL: Build Layout.tsx, Sidebar.tsx, router.tsx
      Files: `src/components/Layout.tsx`, `src/components/Sidebar.tsx`, `src/router.tsx`
      Exit criteria: Layout.test.tsx passes; all 9 chapter routes defined with React.lazy()

- [ ] TEST: Write failing test for Home page
      File: `src/pages/__tests__/Home.test.tsx`
      TIA scope: `npx vitest run src/pages/__tests__/Home.test.tsx`
      Notes: Assert 9 chapter cards render; assert each has a link to /chapter/:id

- [ ] IMPL: Build Home.tsx (chapter grid)
      File: `src/pages/Home.tsx`
      Exit criteria: Home.test.tsx passes

## Phase 3: Shared Components [P]

- [ ] TEST: Write failing tests for MathBlock and MathInline
      File: `src/components/__tests__/Math.test.tsx`
      TIA scope: `npx vitest run src/components/__tests__/Math.test.tsx`
      Notes: Render MathBlock with a LaTeX string; assert rendered output contains expected elements; test error fallback

- [ ] IMPL [P]: Implement MathBlock.tsx and MathInline.tsx
      Files: `src/components/MathBlock.tsx`, `src/components/MathInline.tsx`
      Exit criteria: Math.test.tsx passes

- [ ] TEST: Write failing tests for Slider component
      File: `src/components/__tests__/Slider.test.tsx`
      TIA scope: `npx vitest run src/components/__tests__/Slider.test.tsx`
      Notes: Assert ARIA label present; assert keyboard interaction changes value; test min/max/step

- [ ] IMPL [P]: Implement Slider.tsx
      File: `src/components/Slider.tsx`
      Exit criteria: Slider.test.tsx passes

- [ ] TEST: Write failing tests for InfoCard and ChapterHeader
      File: `src/components/__tests__/InfoCard.test.tsx`
      TIA scope: `npx vitest run src/components/__tests__/InfoCard.test.tsx`
      Notes: Render with title/body props; assert text visible; test variant prop (info/warning/tip)

- [ ] IMPL [P]: Implement InfoCard.tsx, ChapterHeader.tsx, ProgressBadge.tsx, SectionDivider.tsx
      Files: `src/components/InfoCard.tsx`, `src/components/ChapterHeader.tsx`, `src/components/ProgressBadge.tsx`, `src/components/SectionDivider.tsx`
      Exit criteria: InfoCard.test.tsx passes

## Phase 4: mathHelpers and BPE utilities [P]

- [ ] TEST: Write failing tests for mathHelpers
      File: `src/utils/__tests__/mathHelpers.test.ts`
      TIA scope: `npx vitest run src/utils/__tests__/mathHelpers.test.ts`
      Notes: Test softmax (sum=1, preserves order), dotProduct, scaledDotProduct, causalMask generation

- [ ] IMPL [P]: Implement mathHelpers.ts
      File: `src/utils/mathHelpers.ts`
      Exit criteria: mathHelpers.test.ts passes

- [ ] TEST: Write failing tests for BPE tokenizer
      File: `src/utils/__tests__/bpe.test.ts`
      TIA scope: `npx vitest run src/utils/__tests__/bpe.test.ts`
      Notes: Test tokenize("hello") returns expected token array; test merge step; test vocabulary building on small corpus

- [ ] IMPL [P]: Implement bpe.ts (demo BPE tokenizer)
      File: `src/utils/bpe.ts`
      Exit criteria: bpe.test.ts passes

## Phase 5: Chapter 1 — The Big Picture [P]

- [ ] TEST: Write failing test for NextWordDemo widget
      File: `src/chapters/ch01-big-picture/__tests__/NextWordDemo.test.tsx`
      TIA scope: `npx vitest run src/chapters/ch01-big-picture/__tests__/NextWordDemo.test.tsx`
      Notes: Render widget; assert probability bars render; assert slider changes temperature and re-renders bars

- [ ] IMPL [P]: Build Chapter 1
      Files: `src/chapters/ch01-big-picture/index.tsx`, `src/chapters/ch01-big-picture/NextWordDemo.tsx`, `src/chapters/ch01-big-picture/content.ts`
      Exit criteria: NextWordDemo.test.tsx passes; chapter renders full prose + formulas + widget

## Phase 6: Chapter 2 — Tokenization & Embeddings [P]

- [ ] TEST: Write failing tests for BPEVisualizer and TokenizerWidget
      File: `src/chapters/ch02-tokenization/__tests__/Tokenization.test.tsx`
      TIA scope: `npx vitest run src/chapters/ch02-tokenization/__tests__/Tokenization.test.tsx`
      Notes: BPEVisualizer: assert each merge step is rendered; TokenizerWidget: type input, assert tokens appear

- [ ] IMPL [P]: Build Chapter 2
      Files: `src/chapters/ch02-tokenization/index.tsx`, `src/chapters/ch02-tokenization/BPEVisualizer.tsx`, `src/chapters/ch02-tokenization/TokenizerWidget.tsx`, `src/chapters/ch02-tokenization/EmbeddingSpace3D.tsx`, `src/chapters/ch02-tokenization/content.ts`, `src/data/embeddings-2d.ts`
      Exit criteria: Tokenization.test.tsx passes

## Phase 7: Chapter 3 — Attention Mechanisms [P]

- [ ] TEST: Write failing tests for AttentionMatrix
      File: `src/chapters/ch03-attention/__tests__/Attention.test.tsx`
      TIA scope: `npx vitest run src/chapters/ch03-attention/__tests__/Attention.test.tsx`
      Notes: Render AttentionMatrix with mock sequence; assert SVG cells rendered; assert temperature slider present; assert causal mask toggles upper-triangle cells

- [ ] IMPL [P]: Build Chapter 3
      Files: `src/chapters/ch03-attention/index.tsx`, `src/chapters/ch03-attention/AttentionMatrix.tsx`, `src/chapters/ch03-attention/MultiHeadViz.tsx`, `src/chapters/ch03-attention/CausalMask.tsx`, `src/chapters/ch03-attention/content.ts`
      Exit criteria: Attention.test.tsx passes

## Phase 8: Chapter 4 — Transformer Architecture [P]

- [ ] TEST: Write failing test for TransformerDiagram
      File: `src/chapters/ch04-transformer/__tests__/Transformer.test.tsx`
      TIA scope: `npx vitest run src/chapters/ch04-transformer/__tests__/Transformer.test.tsx`
      Notes: Render diagram; assert major component labels present (Embedding, Attention, FFN, LayerNorm, Output); assert click on a component shows detail panel

- [ ] IMPL [P]: Build Chapter 4
      Files: `src/chapters/ch04-transformer/index.tsx`, `src/chapters/ch04-transformer/TransformerDiagram.tsx`, `src/chapters/ch04-transformer/LayerNormViz.tsx`, `src/chapters/ch04-transformer/ActivationViz.tsx`, `src/chapters/ch04-transformer/content.ts`
      Exit criteria: Transformer.test.tsx passes

## Phase 9: Chapter 5 — Pretraining [P]

- [ ] TEST: Write failing test for TrainingDynamics widget
      File: `src/chapters/ch05-pretraining/__tests__/Pretraining.test.tsx`
      TIA scope: `npx vitest run src/chapters/ch05-pretraining/__tests__/Pretraining.test.tsx`
      Notes: Render TrainingDynamics; assert loss curve SVG rendered; assert LR slider present and changes curve

- [ ] IMPL [P]: Build Chapter 5
      Files: `src/chapters/ch05-pretraining/index.tsx`, `src/chapters/ch05-pretraining/LossSurface3D.tsx`, `src/chapters/ch05-pretraining/TrainingDynamics.tsx`, `src/chapters/ch05-pretraining/content.ts`
      Exit criteria: Pretraining.test.tsx passes

## Phase 10: Chapters 6–9 [P]

- [ ] TEST: Write failing tests for LoRAViz, RLHFPipeline, ChainOfThought, QuantizationWidget
      File: `src/chapters/__tests__/LaterChapters.test.tsx`
      TIA scope: `npx vitest run src/chapters/__tests__/LaterChapters.test.tsx`
      Notes: Each: render component, assert key UI elements and at least one interactive control present

- [ ] IMPL [P]: Build Chapters 6–9
      Files: `src/chapters/ch06-finetuning/`, `src/chapters/ch07-alignment/`, `src/chapters/ch08-reasoning/`, `src/chapters/ch09-deployment/`
      Exit criteria: LaterChapters.test.tsx passes

## Phase 11: Deploy

- [ ] IMPL: Configure GitHub Pages deployment
      Files: `vite.config.ts` (base URL), `.github/workflows/deploy.yml`
      Notes: base = '/build-your-own-llm-course/'; workflow triggers on push to main
      Exit criteria: `npm run build` produces correct asset paths with the base prefix

- [ ] IMPL: Final polish — error boundaries, 404 fallback, README update
      Files: `src/components/ErrorBoundary.tsx`, `public/404.html`, `README.md`
      Exit criteria: No console errors on any chapter; 404 redirects to home

## Checkpoint Summary

| Phase | # Tasks | Key Deliverable |
|---|---|---|
| 1 Scaffold | 2 | Working Vite+React app with tests |
| 2 Shell | 6 | Nav, sidebar, home page, progress tracking |
| 3 Shared Components | 6 | MathBlock, Slider, InfoCard — all tested |
| 4 Utilities | 4 | mathHelpers + BPE — all tested |
| 5 Chapter 1 | 2 | Big Picture with NextWordDemo |
| 6 Chapter 2 | 2 | Tokenization with BPE viz + 3D embeddings |
| 7 Chapter 3 | 2 | Attention matrix + multi-head viz |
| 8 Chapter 4 | 2 | Clickable transformer diagram |
| 9 Chapter 5 | 2 | Loss surface + training dynamics |
| 10 Chapters 6–9 | 2 | LoRA, RLHF, CoT, Quantization |
| 11 Deploy | 2 | GitHub Pages live |
