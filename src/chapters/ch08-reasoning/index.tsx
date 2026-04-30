import { useEffect } from 'react'
import { markVisited } from '../../utils/progress'
import { getChapter } from '../../data/chapters'
import ChapterHeader from '../../components/ChapterHeader'
import LearningOutcomes from '../../components/LearningOutcomes'
import ChapterNavButton from '../../components/ChapterNavButton'
import InfoCard from '../../components/InfoCard'
import SectionDivider from '../../components/SectionDivider'
import ChainOfThought from './ChainOfThought'
import { content } from './content'

export default function Chapter08() {
  useEffect(() => {
    markVisited(8)
  }, [])

  const chapter = getChapter(8)!

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <ChapterHeader chapter={chapter} totalChapters={9} />

      <LearningOutcomes
        outcomes={[
          'Explain why chain-of-thought prompting improves model accuracy',
          'Describe test-time compute scaling intuitively',
          'Understand the self-improvement loop that powers DeepSeek-R1',
          'Recognize the limits of reasoning on fact-retrieval tasks',
        ]}
      />

      {/* Intro */}
      <div className="space-y-4 mb-10">
        {content.intro.map((para, i) => (
          <p key={i} className="text-slate-300 leading-relaxed text-lg">
            {para}
          </p>
        ))}
      </div>

      <SectionDivider label="Chain-of-Thought" />

      {/* Sections 1–2: CoT and why it works */}
      {content.sections.slice(0, 2).map((section, i) => (
        <div key={i} className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-3">{section.heading}</h2>
          <p className="text-slate-400 leading-relaxed">{section.body}</p>
        </div>
      ))}

      <InfoCard variant="concept" title="The magic phrase">
        Simply adding "Let's think step by step" to a prompt improves accuracy on multi-step
        reasoning tasks by 10–40% with no additional training. This suggests that the CoT
        capability is already latent in large pretrained models — prompting just unlocks it.
      </InfoCard>

      <SectionDivider label="Test-Time Compute" />

      {/* Section 3: Test-time scaling */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">{content.sections[2]!.heading}</h2>
        <p className="text-slate-400 leading-relaxed">{content.sections[2]!.body}</p>
      </div>

      <InfoCard variant="tip" title="Scaling test-time compute">
        OpenAI's o1/o3 models use "Chain of Thought tokens" — a private reasoning trace that
        can be thousands of tokens long before the model produces a response. The more
        difficult the problem, the longer the trace. This is test-time compute scaling in
        action: spend more tokens thinking, get better answers.
      </InfoCard>

      <SectionDivider label="Self-Improvement & Limits" />

      {/* Section 4: DeepSeek-R1 self-improvement */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">{content.sections[3]!.heading}</h2>
        <p className="text-slate-400 leading-relaxed">{content.sections[3]!.body}</p>
      </div>

      {/* Section 5: Limits of reasoning */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">{content.sections[4]!.heading}</h2>
        <p className="text-slate-400 leading-relaxed">{content.sections[4]!.body}</p>
      </div>

      <SectionDivider label="Constitutional AI" />

      {/* Section 9 (index 8): Constitutional AI */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">{content.sections[8]!.heading}</h2>
        <p className="text-slate-400 leading-relaxed">{content.sections[8]!.body}</p>
      </div>

      <SectionDivider label="Interactive" />

      {/* Chain of Thought visualizer */}
      <h3 className="text-lg font-semibold text-white mb-3">
        Chain-of-Thought Trace Visualizer
      </h3>
      <p className="text-slate-300 leading-relaxed mb-4">
        Watch a model solve a word problem with and without chain-of-thought reasoning.
        The CoT version generates intermediate reasoning steps before committing to an answer —
        each step narrows the problem and provides context for the next token.
      </p>

      <InfoCard variant="tip" title="What to observe">
        Press 'Play' and watch the CoT version think aloud. Notice how each step becomes context for the next — the model doesn't need to hold the entire problem in a single forward pass, because it wrote down intermediate results. Then compare with the non-CoT version, which must compress all reasoning into the immediate answer tokens.
      </InfoCard>

      <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 mb-8">
        <ChainOfThought />
      </div>

      <InfoCard variant="warning" title="CoT can hallucinate convincingly">
        A step-by-step reasoning trace looks authoritative — but each step can contain errors
        that compound. A wrong intermediate answer leads to a confidently-stated wrong final
        answer. Always verify critical CoT outputs independently.
      </InfoCard>

      <InfoCard variant="concept" title="Process vs outcome reward">
        Training with outcome rewards (is the final answer correct?) is simpler but can lead
        to "shortcut" reasoning. Process reward models (PRM) score each individual reasoning
        step for correctness, leading to more reliable reasoning traces — but require much
        more expensive annotation.
      </InfoCard>

      <ChapterNavButton
        currentChapterId={8}
        nextChapterTeaser="Chapter 9 covers what happens after training — deploying and serving LLMs efficiently in production."
      />
    </article>
  )
}
