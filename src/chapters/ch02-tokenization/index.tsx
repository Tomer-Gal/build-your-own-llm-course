import { useEffect } from 'react'
import { markVisited } from '../../utils/progress'
import { getChapter } from '../../data/chapters'
import ChapterHeader from '../../components/ChapterHeader'
import MathBlock from '../../components/MathBlock'
import InfoCard from '../../components/InfoCard'
import SectionDivider from '../../components/SectionDivider'
import BPEVisualizer from './BPEVisualizer'
import TokenizerWidget from './TokenizerWidget'
import EmbeddingSpace3D from './EmbeddingSpace3D'
import { content } from './content'

export default function Chapter02() {
  useEffect(() => {
    markVisited(2)
  }, [])

  const chapter = getChapter(2)!

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <ChapterHeader chapter={chapter} totalChapters={9} />

      {/* Sections 0 & 1 */}
      {content.sections.slice(0, 2).map((section, i) => (
        <div key={i} className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-3">{section.heading}</h2>
          <p className="text-slate-400 leading-relaxed">{section.body}</p>
        </div>
      ))}

      <SectionDivider label="BPE Algorithm" />

      {/* BPE objective formula */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-3">The BPE merge criterion</h2>
        <p className="text-slate-400 mb-4">
          At each step, find the pair of adjacent tokens with the highest joint frequency and merge them:
        </p>
        <MathBlock>{content.formulas.bpeObjective}</MathBlock>
      </div>

      {/* BPE Visualizer */}
      <div className="interactive-card bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 mb-10">
        <h3 className="text-lg font-semibold text-white mb-2">BPE step-by-step</h3>
        <p className="text-slate-400 text-sm mb-6">
          Watch how Byte-Pair Encoding iteratively merges the most frequent adjacent pairs.
        </p>
        <BPEVisualizer />
      </div>

      <SectionDivider label="Live Tokenizer" />

      {/* Tokenizer Widget */}
      <div className="interactive-card bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 mb-10">
        <h3 className="text-lg font-semibold text-white mb-2">Live tokenizer</h3>
        <p className="text-slate-400 text-sm mb-6">
          Type any text to see how it is tokenized using a small demo BPE vocabulary.
        </p>
        <TokenizerWidget />
      </div>

      <SectionDivider label="Embeddings" />

      {/* Sections 2 & 3 */}
      {content.sections.slice(2).map((section, i) => (
        <div key={i + 2} className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-3">{section.heading}</h2>
          <p className="text-slate-400 leading-relaxed">{section.body}</p>
        </div>
      ))}

      {/* Embedding lookup formula */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-3">Embedding lookup</h2>
        <p className="text-slate-400 mb-4">
          Token index <em>t</em> selects column <em>t</em> from the embedding matrix:
        </p>
        <MathBlock>{content.formulas.embeddingLookup}</MathBlock>
      </div>

      {/* Positional encoding formula */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">Positional encoding</h2>
        <p className="text-slate-400 mb-4">
          Sinusoidal encodings inject position information using different frequencies per dimension:
        </p>
        <MathBlock>{content.formulas.positionalEncoding}</MathBlock>
      </div>

      {/* Embedding space scatter */}
      <div className="interactive-card bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 mb-10">
        <h3 className="text-lg font-semibold text-white mb-2">Embedding space explorer</h3>
        <p className="text-slate-400 text-sm mb-6">
          Semantically similar words cluster together. Hover over points to inspect words.
          Use the legend to filter categories.
        </p>
        <EmbeddingSpace3D />
      </div>

      <InfoCard variant="concept" title="Subword tokenization is a design choice">
        The tokenizer vocabulary size directly affects the model size (via the embedding matrix) and
        the average sequence length. GPT-4 uses ~100k tokens; smaller models often use 32k–50k.
        Larger vocabularies shorten sequences but increase memory; smaller ones do the opposite.
      </InfoCard>

      <InfoCard variant="tip" title="Tokens ≠ words">
        Common English words like &ldquo;the&rdquo; and &ldquo;is&rdquo; are usually single tokens.
        Rare or technical words may be split into many subword tokens — which means they get
        &ldquo;less attention&rdquo; per character than common words, a subtle but important bias.
      </InfoCard>
    </article>
  )
}
