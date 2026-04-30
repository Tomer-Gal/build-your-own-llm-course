# Spec — Build Your Own LLM: Interactive Course Website

## Feature Summary
An interactive, browser-based educational website that teaches how Large Language Models work from first principles. Learners progress through self-contained lessons, each with visual animations, interactive sliders/simulations, and real-time feedback — no code execution environment required.

## Motivation
The target audience (engineers, researchers, AI enthusiasts) learns best by *seeing* concepts in action. Static notebooks and PDFs can't show attention weights shifting as temperature changes, or embedding spaces rotating in 3D. An interactive website fills this gap with zero setup friction.

## Course Structure & Content

### Chapter 1 — The Big Picture
- What is an LLM? Language models as probability distributions over token sequences
- The training pipeline: pretraining → fine-tuning → RLHF (visual overview)
- Interactive: "Predict the next word" demonstration with probability bar charts

### Chapter 2 — Tokenization & Embeddings
- Byte-Pair Encoding (BPE) step-by-step visualization
- Vocabulary construction walkthrough (interactive: type a word, see it tokenized)
- Token embeddings as vectors: 2D/3D scatter plot of word similarities
- Positional encodings: sine/cosine waves, interactive frequency explorer

### Chapter 3 — Attention Mechanisms
- Dot-product attention with animated matrix multiplication
- Scaled dot-product: why we divide by √d_k (interactive temperature effect)
- Multi-head attention: heads focusing on different relationships (interactive)
- Self-attention vs cross-attention comparison
- Causal masking visualization (autoregressive generation)

### Chapter 4 — The Transformer Architecture
- Complete GPT-style transformer diagram (interactive: click any component to zoom/explain)
- Layer Normalization: before vs after, visual distribution shift
- Feed-forward network: ReLU/GELU activation visualization
- Residual connections: gradient flow animation

### Chapter 5 — Pretraining
- Next-token prediction objective
- Cross-entropy loss landscape (3D interactive surface)
- Training dynamics: loss curves, learning rate schedules (interactive: adjust hyperparams)
- Data pipeline: tokenization → batching → masking

### Chapter 6 — Fine-Tuning & LoRA
- Supervised Fine-Tuning (SFT): instruction-response pairs
- Parameter-efficient fine-tuning: LoRA rank decomposition visualization
- Interactive: slider to adjust LoRA rank, see parameter count change

### Chapter 7 — Alignment & RLHF
- RLHF pipeline: reward model → PPO loop (animated)
- RLAIF and Constitutional AI overview
- DPO: direct preference optimization intuition

### Chapter 8 — Reasoning Models
- Chain-of-thought: example trace visualization
- Test-time compute scaling
- DeepSeek-R1 style self-improvement loop

### Chapter 9 — Deployment & Serving
- Inference optimization: KV cache, batching strategies
- Quantization trade-offs (interactive: bit width → quality vs speed)
- Model serving architectures overview

## User Stories

**US1 — Learner navigates the course**
As a learner, I can see a course home page with all chapters listed, click any chapter to jump to it, and track which chapters I've visited — so I know where I am and what's left.

**US2 — Learner interacts with visualizations**
As a learner, I can manipulate sliders, drag points, and toggle parameters in any lesson visualization and see the output update in real time — so I build intuition through experimentation.

**US3 — Learner reads math with clarity**
As a learner, I see all formulas rendered beautifully (LaTeX) with prose explanations next to them, so math doesn't become a barrier.

**US4 — Learner uses the site on any device**
As a learner on a laptop or large tablet, the site is fully usable with keyboard and mouse — all interactive elements are accessible.

**US5 — Learner can share/bookmark a lesson**
As a learner, the URL updates to reflect the current chapter/section (hash routing) — so I can bookmark or share a direct link.

**US6 — Learner sees progress**
As a learner, a sidebar or top navigation shows which chapters are complete (visited) so I feel a sense of progress.

## Acceptance Criteria

- [ ] Home page lists all 9 chapters with titles, short descriptions, and status badges
- [ ] Each chapter renders in < 1.5s after the initial bundle is loaded
- [ ] Every chapter has at least one interactive widget (slider, drag, toggle, or animation)
- [ ] All formulas rendered with KaTeX (no plain-text math)
- [ ] URL hash updates on chapter/section navigation
- [ ] Visited chapters persist across page refreshes (localStorage)
- [ ] Lighthouse score > 80 on performance and accessibility
- [ ] All sliders have ARIA labels and are keyboard-navigable
- [ ] Mobile: site is readable (responsive layout) even if some complex visualizations are simplified
- [ ] No JavaScript errors in console on any chapter

## Out of Scope
- User accounts, login, or persistent scores
- Code execution environment (no Jupyter/Pyodide)
- Video embedding
- Comments or community features
- Backend API
