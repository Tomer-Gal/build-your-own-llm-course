import { useEffect } from 'react'
import { markVisited } from '../../utils/progress'
import { getChapter } from '../../data/chapters'
import ChapterHeader from '../../components/ChapterHeader'
import MathBlock from '../../components/MathBlock'
import InfoCard from '../../components/InfoCard'
import SectionDivider from '../../components/SectionDivider'
import LearningOutcomes from '../../components/LearningOutcomes'
import ChapterNavButton from '../../components/ChapterNavButton'
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

      <LearningOutcomes
        outcomes={[
          'Explain why subword tokenization (BPE) is preferred over character-level or word-level tokenization, and what the vocabulary size trade-off means in practice',
          'Trace through the BPE algorithm step by step — from a character vocabulary through iterative pair merges — and predict which pairs will be merged first',
          'Describe how the embedding matrix maps token IDs to dense vectors, and why geometrically similar vectors correspond to semantically similar tokens',
        ]}
      />

      {/* Anchor sentence callout */}
      <div className="mb-6 p-4 rounded-xl bg-surface-2 border border-violet-500/20 text-sm text-ink-1">
        <span className="text-violet-300 font-semibold">Running example: </span>
        Throughout Chapters 1–3 we trace one sentence through every concept.
        Here in Chapter 2 we tokenize it and place its words in embedding space:{' '}
        <span className="font-mono text-violet-300">"The cat sat on the mat because it was tired."</span>
      </div>

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
        <p className="text-slate-400 text-sm mt-3 leading-relaxed">
          This greedy approach is efficient and produces a vocabulary that closely mirrors the statistical structure of the training corpus — common words and subwords earn their own tokens, while rare sequences are represented as compositions.
        </p>
      </div>

      {/* Worked Example Wrapper: BPE Visualizer */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-white mb-2">
          Watching BPE build a vocabulary
        </h2>
        <p className="text-slate-400 mb-4 leading-relaxed">
          The visualizer below steps through the BPE algorithm on a small example corpus. At each step it finds the most frequent adjacent pair, merges them into a single token, and updates the corpus. After enough merges, common English words emerge as single units.
        </p>

        <InfoCard variant="tip" title="What to observe">
          Watch how the algorithm finds "th" before "the" — it always merges the most frequent pair at each step. Because "th" appears in "the", "this", "that", "there", and many other words, it is more frequent than any complete word. Only after "th" is merged does "the" (now "th" + "e") become frequent enough to merge next. Notice how merge order determines the final vocabulary and which words get a single token versus multiple tokens.
        </InfoCard>

        <div className="interactive-card bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-2">BPE step-by-step</h3>
          <p className="text-slate-400 text-sm mb-6">
            The visualizer below is tokenizing our anchor sentence:{' '}
            <span className="font-mono text-violet-300">"The cat sat on the mat because it was tired."</span>{' '}
            Watch how Byte-Pair Encoding iteratively merges the most frequent adjacent pairs.
          </p>
          <BPEVisualizer />
        </div>
      </div>

      <SectionDivider label="Live Tokenizer" />

      <p className="text-slate-400 leading-relaxed mb-6">
        Try it yourself — type any text below and see how BPE splits it into tokens. Notice how common English words like "the" and "is" become single tokens, while rare or technical words get broken into pieces. Proper nouns, unusual spellings, and code identifiers often fragment dramatically — this is why models sometimes struggle with names and specialized terminology.
      </p>

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
          Token index <em>t</em> selects row <em>t</em> from the embedding matrix <em>W_E</em>:
        </p>
        <MathBlock>{content.formulas.embeddingLookup}</MathBlock>
        <p className="text-slate-400 text-sm mt-3 leading-relaxed">
          <em>|V|</em> is the vocabulary size and <em>d_model</em> is the model's hidden dimension. The full embedding matrix contains <em>|V| × d_model</em> learned parameters — for GPT-4's ~100k vocabulary and d_model of 12,288, that is over 1.2 billion parameters just for embeddings.
        </p>
      </div>

      {/* Positional encoding formula */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">Positional encoding</h2>
        <p className="text-slate-400 mb-4">
          Sinusoidal encodings inject position information using different frequencies per dimension:
        </p>
        <MathBlock>{content.formulas.positionalEncoding}</MathBlock>
        <p className="text-slate-400 text-sm mt-3 leading-relaxed">
          <em>pos</em> is the token position, <em>i</em> is the dimension index, and <em>d_model</em> is the embedding size. The exponentially increasing period (10000^{'{2i/d_model}'}) ensures that each dimension oscillates at a different frequency, giving every position a unique fingerprint across all dimensions combined.
        </p>
      </div>

      {/* Worked Example Wrapper: Embedding Space */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-white mb-2">
          The geometry of meaning
        </h2>
        <p className="text-slate-400 mb-4 leading-relaxed">
          The 3D scatter plot below shows token embeddings projected down from their high-dimensional space. Because the original dimensions have been compressed via PCA, exact distances are approximate — but the clustering structure reflects real semantic relationships learned from data.
        </p>

        <InfoCard variant="tip" title="What to observe">
          The words from our anchor sentence — "cat", "sat", "mat", "tired" — are highlighted with larger spheres. Notice how "cat" and "mat" sit close in the animals/objects region, while "sat" and "was" cluster with other verbs. The model learned this purely from context: "The cat sat on the mat" appeared countless times alongside similar animal-action-location sentences. The embedding space is a map of conceptual similarity drawn entirely from statistical co-occurrence.
        </InfoCard>

        <div className="interactive-card bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Embedding space explorer</h3>
          <p className="text-slate-400 text-sm mb-6">
            Semantically similar words cluster together. Hover over points to inspect words.
            Use the legend to filter categories.
          </p>
          <EmbeddingSpace3D />
        </div>
      </div>

      <InfoCard variant="concept" title="Subword tokenization is a design choice">
        The tokenizer vocabulary size directly affects the model size (via the embedding matrix) and
        the average sequence length. GPT-4 uses ~100k tokens; smaller models often use 32k–50k.
        Larger vocabularies shorten sequences but increase memory and require more training data per token;
        smaller ones produce longer sequences but are more data-efficient. There is no universally correct
        answer — the right vocabulary size depends on the target domain, available compute, and context length.
      </InfoCard>

      <ChapterNavButton
        currentChapterId={2}
        nextChapterTeaser="Now that we have tokens and embeddings, Chapter 3 introduces the mechanism that lets every token 'look at' every other token simultaneously: the attention mechanism. This is the core innovation that made the transformer architecture possible."
      />
    </article>
  )
}
