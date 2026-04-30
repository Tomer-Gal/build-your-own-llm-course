import { useEffect } from 'react'
import { markVisited } from '../../utils/progress'
import { getChapter } from '../../data/chapters'
import ChapterHeader from '../../components/ChapterHeader'
import MathBlock from '../../components/MathBlock'
import InfoCard from '../../components/InfoCard'
import SectionDivider from '../../components/SectionDivider'
import LearningOutcomes from '../../components/LearningOutcomes'
import ChapterNavButton from '../../components/ChapterNavButton'
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

      <LearningOutcomes
        outcomes={[
          'Explain what a language model actually is (not the sci-fi version) — a probability distribution over tokens, not a thinking machine',
          'Understand why predicting the next token is the fundamental task that drives all emergent capabilities in LLMs',
          'Describe the pretraining → SFT → RLHF pipeline and what each stage contributes to the final model',
        ]}
      />

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
        <p className="text-slate-400 text-sm mt-3 leading-relaxed">
          Here <em>x_t</em> is the token at position <em>t</em>, and the conditioning on all prior tokens <em>x_1 … x_t-1</em> is what makes this a language model rather than a simple unigram distribution.
        </p>
      </div>

      {/* Sections 0 and 1 */}
      {content.sections.slice(0, 2).map((section, i) => (
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
        <p className="text-slate-400 text-sm mt-3 leading-relaxed">
          <em>T</em> is the sequence length. Each term penalizes the model for assigning low probability to the token that actually appeared. The log makes the loss additive across positions and numerically stable.
        </p>
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
        <p className="text-slate-400 text-sm mt-3 leading-relaxed">
          <em>z_i</em> is the raw logit for token <em>i</em>, and <em>T</em> is the temperature parameter. When <em>T = 1</em> this is standard softmax; when <em>T &lt; 1</em> the distribution sharpens; when <em>T &gt; 1</em> it flattens.
        </p>
      </div>

      {/* Sections 2 and 3 */}
      {content.sections.slice(2).map((section, i) => (
        <div key={i + 2} className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-3">{section.heading}</h2>
          <p className="text-slate-400 leading-relaxed">{section.body}</p>
        </div>
      ))}

      <SectionDivider label="Interactive" />

      {/* Worked Example Wrapper: Next Word Demo */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-2">
          Seeing probability in action
        </h2>
        <p className="text-slate-400 mb-4 leading-relaxed">
          The demo below shows the probability distribution a language model produces at a single token position. Choose a seed phrase, and the chart shows how probability is spread across possible next tokens. Drag the temperature slider to watch the distribution sharpen or flatten in real time.
        </p>
        <p className="text-slate-400 mb-4 leading-relaxed">
          Try our anchor sentence: select <span className="font-mono text-violet-300 text-sm">"The cat sat on the"</span> and observe that "mat" is among the top predictions — this is the same sentence we will tokenize in Chapter 2 and visualize as embedding vectors in 3D space.
        </p>

        <InfoCard variant="tip" title="What to observe">
          Watch what happens to the distribution as you move the temperature slider. At very low temperatures (near 0.1) almost all probability collapses onto the single most likely token — the model is maximally confident. At high temperatures (near 3.0) probability spreads nearly uniformly — the model becomes exploratory and unpredictable. This is exactly the trade-off between factual accuracy and creative diversity in real applications.
        </InfoCard>

        <div className="interactive-card bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-2">
            Next-word prediction explorer
          </h3>
          <p className="text-slate-400 text-sm mb-6">
            Choose a seed phrase and adjust temperature to see how the model's predicted distribution changes.
          </p>
          <NextWordDemo />
        </div>
      </div>

      <p className="text-slate-400 leading-relaxed mb-8">
        Notice that even for the "obvious" continuations — "time" after "Once upon a" or "mat" after "The cat sat on the" — the model never assigns 100% probability. Language is inherently uncertain, and the model faithfully represents that uncertainty in its distribution. This is a feature, not a bug: a model forced to be maximally certain would be brittle and overconfident.
      </p>

      <InfoCard variant="warning" title="Probabilities are not confidence">
        A model can assign high probability to a wrong answer. The distribution reflects what the
        training data suggests is likely, not what is true. This is the root cause of hallucinations:
        the model generates the statistically plausible continuation, which may be factually incorrect.
        High probability means "this is what text like this usually says," not "this is verified fact."
      </InfoCard>

      <InfoCard variant="concept" title="Why next-token prediction is so powerful">
        Because text encodes virtually all human knowledge, a model that predicts text well must
        implicitly learn world knowledge, reasoning patterns, and even theory of mind. This is the
        key insight behind the scaling hypothesis: more data + more compute = better prediction =
        better intelligence. The skills that emerge at scale — coding, multi-step reasoning, translation —
        were never explicitly trained for. They arise because they are necessary to predict text well.
      </InfoCard>

      <ChapterNavButton
        currentChapterId={1}
        nextChapterTeaser="In Chapter 2 we dive into tokenization — the first irreversible decision made before a model ever sees data. The choice of vocabulary shapes everything downstream: sequence length, out-of-vocabulary handling, and even which languages and code styles the model handles gracefully."
      />
    </article>
  )
}
