import { useEffect } from 'react'
import { markVisited } from '../../utils/progress'
import { getChapter } from '../../data/chapters'
import ChapterHeader from '../../components/ChapterHeader'
import MathBlock from '../../components/MathBlock'
import InfoCard from '../../components/InfoCard'
import SectionDivider from '../../components/SectionDivider'
import LearningOutcomes from '../../components/LearningOutcomes'
import ChapterNavButton from '../../components/ChapterNavButton'
import AttentionMatrix from './AttentionMatrix'
import MultiHeadViz from './MultiHeadViz'
import CausalMask from './CausalMask'
import { content } from './content'

export default function Chapter03() {
  useEffect(() => {
    markVisited(3)
  }, [])

  const chapter = getChapter(3)!

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <ChapterHeader chapter={chapter} totalChapters={9} />

      <LearningOutcomes
        outcomes={[
          'Calculate attention weights for a simple sequence by hand, applying the scaled dot-product formula step by step',
          'Explain intuitively what Q, K, and V represent using the search-engine analogy, and why scaling by sqrt(d_k) is necessary',
          'Understand why causal masking is necessary for text generation and how it makes training and inference consistent',
        ]}
      />

      {/* Sections 0–1: Core intuition */}
      {content.sections.slice(0, 2).map((section, i) => (
        <div key={i} className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-3">{section.heading}</h2>
          <p className="text-slate-400 leading-relaxed">{section.body}</p>
        </div>
      ))}

      <SectionDivider label="Attention Formula" />

      {/* Attention formula */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-3">Scaled dot-product attention</h2>
        <p className="text-slate-400 mb-4">
          The full attention computation in matrix form — Q, K, V are matrices of all token queries, keys, and values stacked as rows:
        </p>
        <MathBlock>{content.formulas.attention}</MathBlock>
        <p className="text-slate-400 text-sm mt-3 leading-relaxed">
          <em>Q</em> is the query matrix, <em>K</em> is the key matrix, <em>V</em> is the value matrix, and <em>d_k</em> is the dimension of each key vector. The softmax is applied row-wise, so each token gets its own probability distribution over all other tokens.
        </p>
      </div>

      {/* Per-position form */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-3">Attention weight for position i attending to position j</h2>
        <p className="text-slate-400 mb-4">
          Expanding to the scalar form for a single query-key pair makes the computation concrete:
        </p>
        <MathBlock>{content.formulas.scaledAttention}</MathBlock>
        <p className="text-slate-400 text-sm mt-3 leading-relaxed">
          <em>a_ij</em> is the weight that token <em>i</em> places on token <em>j</em> when computing its output. All weights for a given row <em>i</em> sum to 1, making each row a valid probability distribution over positions.
        </p>
      </div>

      {/* Sections 2–3: Scaling and multi-head */}
      {content.sections.slice(2, 4).map((section, i) => (
        <div key={i + 2} className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-3">{section.heading}</h2>
          <p className="text-slate-400 leading-relaxed">{section.body}</p>
        </div>
      ))}

      <SectionDivider label="Interactive: Attention Matrix" />

      {/* Worked Example Wrapper: Attention heatmap */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-white mb-2">
          Seeing attention weights directly
        </h2>
        <p className="text-slate-400 mb-4 leading-relaxed">
          The heatmap below shows the full attention weight matrix for a 6-token sequence. Each row represents one token's query, and each column represents one token's key — the cell at row <em>i</em>, column <em>j</em> shows how much token <em>i</em> attends to token <em>j</em>. Rows sum to 1 (they are probability distributions). The temperature slider controls how sharply peaked these distributions are.
        </p>

        <InfoCard variant="tip" title="What to observe">
          Each cell [row i, col j] shows how much token i attends to token j. Brighter blue means stronger attention. Try dragging the temperature slider: at temperature near 0, each row becomes nearly a one-hot vector — the model commits entirely to a single position. At high temperature, attention becomes nearly uniform — the model is equally uncertain about all positions. This is exactly how "confidence" works in neural networks: lower temperature = more decisive, higher temperature = more exploratory. Toggle the causal mask to see how upper-triangular positions are blocked during autoregressive generation.
        </InfoCard>

        <div className="interactive-card bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Self-attention heatmap</h3>
          <p className="text-slate-400 text-sm mb-6">
            Visualize attention weights for a 6-token sequence. Adjust temperature and toggle
            the causal mask.
          </p>
          <AttentionMatrix />
        </div>
      </div>

      <InfoCard variant="concept" title="Key insight: Attention is differentiable">
        Attention is differentiable — meaning the model can learn WHICH tokens to attend to, not just HOW to combine them. The weight matrix is not fixed by rules; it is the output of a learned function (the dot product of learned Q and K vectors). Backpropagation can adjust W_Q and W_K so that the resulting attention patterns improve prediction. This is what makes transformers so powerful: the routing of information between tokens is itself a learned, adaptive computation.
      </InfoCard>

      <SectionDivider label="Multi-Head Attention" />

      {/* Section 4: Multi-head */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">{content.sections[4].heading}</h2>
        <p className="text-slate-400 leading-relaxed">{content.sections[4].body}</p>
      </div>

      {/* Multi-head formula */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-3">Multi-head attention formula</h2>
        <p className="text-slate-400 mb-4">
          Each head computes attention in its own subspace; results are concatenated and projected:
        </p>
        <MathBlock>{content.formulas.multiHead}</MathBlock>
        <p className="text-slate-400 text-sm mt-3 leading-relaxed">
          <em>W_i^Q</em>, <em>W_i^K</em>, <em>W_i^V</em> are the projection matrices for head <em>i</em>, and <em>W^O</em> is the output projection. Each head operates in <em>d_k = d_model / h</em> dimensions.
        </p>
      </div>

      {/* Multi-head viz */}
      <div className="interactive-card bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 mb-10">
        <h3 className="text-lg font-semibold text-white mb-2">Attention head specializations</h3>
        <p className="text-slate-400 text-sm mb-6">
          Four attention heads showing different learned patterns on a 4-token sequence. Notice how each head has developed a distinct pattern — some attend locally, others globally, some diagonally.
        </p>
        <MultiHeadViz />
      </div>

      <SectionDivider label="Causal Masking" />

      {/* Causal masking prose */}
      <p className="text-slate-400 leading-relaxed mb-8">
        The attention mechanism as described so far is bidirectional — every token can attend to every other token, including tokens that come later in the sequence. This is useful for tasks like reading comprehension where the full context is available upfront. But for text generation, we need the model to produce tokens one at a time, each conditioned only on what has come before. Causal masking imposes this constraint at training time, ensuring the model never accidentally learns to use future information.
      </p>

      {/* Section 5: Causal masking */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">{content.sections[5].heading}</h2>
        <p className="text-slate-400 leading-relaxed">{content.sections[5].body}</p>
      </div>

      {/* Causal mask viz */}
      <div className="interactive-card bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 mb-10">
        <h3 className="text-lg font-semibold text-white mb-2">Causal mask animation</h3>
        <p className="text-slate-400 text-sm mb-6">
          Step through the generation process to see which positions are visible at each step. Each new token can only attend to the tokens already generated — the upper triangle is always masked.
        </p>
        <CausalMask />
      </div>

      <InfoCard variant="concept" title="Attention complexity">
        Standard self-attention is O(n²) in both time and memory with respect to sequence length n.
        For a 4096-token context, that is ~16M attention scores per head per layer. This quadratic
        scaling is the main reason why extending context length is expensive and why efficient
        attention variants (Flash Attention, linear attention, sparse attention) are important research
        directions. Flash Attention, for instance, achieves the same result while being 2-4x faster
        by tiling the computation to avoid materializing the full attention matrix in GPU memory.
      </InfoCard>

      <ChapterNavButton
        currentChapterId={3}
        nextChapterTeaser="Chapter 4 shows how attention fits into the full transformer block — alongside layer normalization, feed-forward networks, and residual connections. Together these components explain why transformers can be trained to hundreds of layers without gradient collapse."
      />
    </article>
  )
}
