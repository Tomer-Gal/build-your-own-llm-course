import { useEffect } from 'react'
import { markVisited } from '../../utils/progress'
import { getChapter } from '../../data/chapters'
import ChapterHeader from '../../components/ChapterHeader'
import MathBlock from '../../components/MathBlock'
import InfoCard from '../../components/InfoCard'
import SectionDivider from '../../components/SectionDivider'
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

      {/* Sections 0–1 */}
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
        <MathBlock>{content.formulas.attention}</MathBlock>
      </div>

      {/* Per-position form */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-3">Attention weight for position i, j</h2>
        <MathBlock>{content.formulas.scaledAttention}</MathBlock>
      </div>

      {/* Sections 2–3 */}
      {content.sections.slice(2, 4).map((section, i) => (
        <div key={i + 2} className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-3">{section.heading}</h2>
          <p className="text-slate-400 leading-relaxed">{section.body}</p>
        </div>
      ))}

      <SectionDivider label="Interactive: Attention Matrix" />

      {/* Attention heatmap */}
      <div className="interactive-card bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 mb-10">
        <h3 className="text-lg font-semibold text-white mb-2">Self-attention heatmap</h3>
        <p className="text-slate-400 text-sm mb-6">
          Visualize attention weights for a 6-token sequence. Adjust temperature and toggle
          the causal mask.
        </p>
        <AttentionMatrix />
      </div>

      <SectionDivider label="Multi-Head Attention" />

      {/* Multi-head formula */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-3">Multi-head attention</h2>
        <MathBlock>{content.formulas.multiHead}</MathBlock>
      </div>

      {/* Multi-head viz */}
      <div className="interactive-card bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 mb-10">
        <h3 className="text-lg font-semibold text-white mb-2">Attention head specializations</h3>
        <p className="text-slate-400 text-sm mb-6">
          Four attention heads showing different learned patterns on a 4-token sequence.
        </p>
        <MultiHeadViz />
      </div>

      <SectionDivider label="Causal Masking" />

      {/* Causal masking section */}
      {content.sections.slice(4).map((section, i) => (
        <div key={i + 4} className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-3">{section.heading}</h2>
          <p className="text-slate-400 leading-relaxed">{section.body}</p>
        </div>
      ))}

      {/* Causal mask viz */}
      <div className="interactive-card bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 mb-10">
        <h3 className="text-lg font-semibold text-white mb-2">Causal mask animation</h3>
        <p className="text-slate-400 text-sm mb-6">
          Step through the generation process to see which positions are visible at each step.
        </p>
        <CausalMask />
      </div>

      <InfoCard variant="concept" title="Attention complexity">
        Standard self-attention is O(n²) in both time and memory with respect to sequence length n.
        For a 4096-token context, that is ~16M attention scores per head per layer. This quadratic
        scaling is the main reason why extending context length is expensive and why efficient
        attention variants (Flash Attention, linear attention) are important research directions.
      </InfoCard>

      <InfoCard variant="tip" title="Interpreting attention is tricky">
        High attention weight does not necessarily mean the model is &ldquo;using&rdquo; that token for the
        right reason. Attention patterns are a byproduct of the optimization process, not a
        ground-truth explanation of model behavior. Use caution when drawing causal interpretations
        from attention visualizations.
      </InfoCard>
    </article>
  )
}
