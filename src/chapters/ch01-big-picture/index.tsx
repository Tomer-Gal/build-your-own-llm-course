import { useEffect } from 'react'
import { markVisited } from '../../utils/progress'
import { getChapter } from '../../data/chapters'
import ChapterHeader from '../../components/ChapterHeader'
import MathBlock from '../../components/MathBlock'
import InfoCard from '../../components/InfoCard'
import SectionDivider from '../../components/SectionDivider'
import NextWordDemo from './NextWordDemo'
import { content } from './content'

export default function Chapter01() {
  useEffect(() => {
    markVisited(1)
  }, [])

  const chapter = getChapter(1)!

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <ChapterHeader chapter={chapter} totalChapters={9} />

      {/* Intro paragraphs */}
      <div className="space-y-4 mb-10">
        {content.intro.map((para, i) => (
          <p key={i} className="text-slate-300 leading-relaxed text-lg">
            {para}
          </p>
        ))}
      </div>

      <SectionDivider label="Core Concept" />

      {/* Conditional probability formula */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">
          The next-token probability
        </h2>
        <p className="text-slate-400 mb-4">
          At every position in the sequence, the model defines a conditional probability over the vocabulary:
        </p>
        <MathBlock>{content.formulas.nextToken}</MathBlock>
      </div>

      {/* Sections */}
      {content.sections.map((section, i) => (
        <div key={i} className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-3">{section.heading}</h2>
          <p className="text-slate-400 leading-relaxed">{section.body}</p>
        </div>
      ))}

      <SectionDivider label="Training Objective" />

      {/* Cross-entropy formula */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">Cross-entropy loss</h2>
        <p className="text-slate-400 mb-4">
          Training minimizes the average cross-entropy loss across all token positions:
        </p>
        <MathBlock>{content.formulas.crossEntropy}</MathBlock>
      </div>

      {/* Softmax formula */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">
          Softmax with temperature
        </h2>
        <p className="text-slate-400 mb-4">
          The raw logits are converted to probabilities via temperature-scaled softmax:
        </p>
        <MathBlock>{content.formulas.softmax}</MathBlock>
      </div>

      <SectionDivider label="Interactive" />

      {/* Interactive: Next Word Demo */}
      <div className="interactive-card bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-2">
          Next-word prediction explorer
        </h2>
        <p className="text-slate-400 text-sm mb-6">
          Choose a seed phrase and adjust temperature to see how the model's predicted distribution changes.
        </p>
        <NextWordDemo />
      </div>

      {/* Info cards */}
      <InfoCard variant="tip" title="Intuition for temperature">
        Think of temperature like a confidence dial. At T = 0.1 the model is very sure of itself and
        almost always picks the top token. At T = 3.0 it becomes uncertain and exploratory — which is
        useful for brainstorming but harmful for factual tasks.
      </InfoCard>

      <InfoCard variant="concept" title="Why next-token prediction is so powerful">
        Because text encodes virtually all human knowledge, a model that predicts text well must
        implicitly learn world knowledge, reasoning patterns, and even theory of mind. This is the
        key insight behind the scaling hypothesis: more data + more compute = better prediction =
        better intelligence.
      </InfoCard>

      <InfoCard variant="warning" title="Probabilities are not confidence">
        A model can assign high probability to a wrong answer. The distribution reflects what the
        training data suggests is likely, not what is true. This is the root cause of hallucinations.
      </InfoCard>
    </article>
  )
}
