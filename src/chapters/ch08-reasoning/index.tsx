import { useEffect } from 'react'
import { markVisited } from '../../utils/progress'
import { getChapter } from '../../data/chapters'
import ChapterHeader from '../../components/ChapterHeader'
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

      {/* Intro */}
      <div className="space-y-4 mb-10">
        {content.intro.map((para, i) => (
          <p key={i} className="text-slate-300 leading-relaxed text-lg">
            {para}
          </p>
        ))}
      </div>

      <SectionDivider label="Chain-of-Thought" />

      {/* Sections 1–2 */}
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

      {/* Section 3 */}
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

      <SectionDivider label="Self-Improvement & Constitutional AI" />

      {/* Sections 4–5 */}
      {content.sections.slice(3).map((section, i) => (
        <div key={i} className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-3">{section.heading}</h2>
          <p className="text-slate-400 leading-relaxed">{section.body}</p>
        </div>
      ))}

      <SectionDivider label="Interactive" />

      {/* Chain of Thought visualizer */}
      <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-2">
          Chain-of-Thought Trace Visualizer
        </h2>
        <p className="text-slate-400 text-sm mb-6">
          Watch a model solve a word problem with and without chain-of-thought reasoning.
          Adjust the thinking budget to control how many steps the model takes.
        </p>
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
    </article>
  )
}
