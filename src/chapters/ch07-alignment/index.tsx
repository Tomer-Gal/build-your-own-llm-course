import { useEffect } from 'react'
import { markVisited } from '../../utils/progress'
import { getChapter } from '../../data/chapters'
import ChapterHeader from '../../components/ChapterHeader'
import MathBlock from '../../components/MathBlock'
import InfoCard from '../../components/InfoCard'
import SectionDivider from '../../components/SectionDivider'
import RLHFPipeline from './RLHFPipeline'
import { content } from './content'

export default function Chapter07() {
  useEffect(() => {
    markVisited(7)
  }, [])

  const chapter = getChapter(7)!

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

      <SectionDivider label="The Alignment Problem" />

      {/* Sections 1–2 */}
      {content.sections.slice(0, 2).map((section, i) => (
        <div key={i} className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-3">{section.heading}</h2>
          <p className="text-slate-400 leading-relaxed">{section.body}</p>
        </div>
      ))}

      <SectionDivider label="RLHF" />

      {/* Reward Model formula */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">Reward Model</h2>
        <p className="text-slate-400 mb-4">
          A reward model maps a prompt and response to a scalar quality score:
        </p>
        <MathBlock>{content.formulas.rewardModel}</MathBlock>
      </div>

      {/* Sections 3–4 */}
      {content.sections.slice(2, 4).map((section, i) => (
        <div key={i} className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-3">{section.heading}</h2>
          <p className="text-slate-400 leading-relaxed">{section.body}</p>
        </div>
      ))}

      {/* PPO formula */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">PPO Clipped Objective</h2>
        <p className="text-slate-400 mb-4">
          PPO clips the probability ratio to prevent large updates:
        </p>
        <MathBlock>{content.formulas.ppoClip}</MathBlock>
      </div>

      <InfoCard variant="concept" title="KL penalty prevents reward hacking">
        Without the KL divergence penalty, the language model would learn to "game" the reward
        model — producing outputs that score highly but are actually nonsensical or harmful.
        The KL term keeps the aligned model close to the original pretrained distribution.
      </InfoCard>

      <SectionDivider label="Alternatives to RLHF" />

      {/* Sections 5–6 */}
      {content.sections.slice(4).map((section, i) => (
        <div key={i} className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-3">{section.heading}</h2>
          <p className="text-slate-400 leading-relaxed">{section.body}</p>
        </div>
      ))}

      {/* DPO formula */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">DPO Objective</h2>
        <p className="text-slate-400 mb-4">
          DPO directly optimizes preference on chosen (y_w) vs rejected (y_l) responses
          relative to a reference policy:
        </p>
        <MathBlock>{content.formulas.dpoLoss}</MathBlock>
      </div>

      <SectionDivider label="Interactive" />

      {/* RLHF Pipeline visualizer */}
      <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-2">RLHF Pipeline Walkthrough</h2>
        <p className="text-slate-400 text-sm mb-6">
          Animate the five stages of the RLHF pipeline and click any stage for more detail.
        </p>
        <RLHFPipeline />
      </div>

      <InfoCard variant="tip" title="DPO vs RLHF in practice">
        DPO is simpler and more stable to train than full RLHF — no reward model to train
        separately, no RL optimization loop. For most use cases with under 70B parameters,
        DPO is the preferred approach. Full RLHF (PPO) is still used by the largest labs
        for flagship models.
      </InfoCard>

      <InfoCard variant="warning" title="Alignment is not a solved problem">
        Current RLHF/DPO-aligned models can still be jailbroken, produce harmful content in
        adversarial scenarios, and exhibit sycophancy (telling users what they want to hear).
        Alignment research is an active field with no complete solution.
      </InfoCard>
    </article>
  )
}
