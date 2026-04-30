import { useEffect } from 'react'
import { markVisited } from '../../utils/progress'
import { getChapter } from '../../data/chapters'
import ChapterHeader from '../../components/ChapterHeader'
import LearningOutcomes from '../../components/LearningOutcomes'
import ChapterNavButton from '../../components/ChapterNavButton'
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

      <LearningOutcomes
        outcomes={[
          'Explain the alignment problem in concrete terms',
          'Describe the RLHF pipeline\'s three stages',
          'Distinguish between PPO-based RLHF and DPO',
          'Understand why the KL penalty prevents reward hacking',
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

      <SectionDivider label="The Alignment Problem" />

      {/* Section 1: Alignment problem */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">{content.sections[0]!.heading}</h2>
        <p className="text-slate-400 leading-relaxed">{content.sections[0]!.body}</p>
      </div>

      <SectionDivider label="RLHF" />

      {/* Section 2: Collecting preferences */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">{content.sections[1]!.heading}</h2>
        <p className="text-slate-400 leading-relaxed">{content.sections[1]!.body}</p>
      </div>

      {/* Reward Model formula */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">Reward Model</h2>
        <p className="text-slate-400 mb-4">
          A reward model maps a prompt and response to a scalar quality score:
        </p>
        <MathBlock>{content.formulas.rewardModel}</MathBlock>
      </div>

      {/* Section 3: Reward model training */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">{content.sections[2]!.heading}</h2>
        <p className="text-slate-400 leading-relaxed">{content.sections[2]!.body}</p>
      </div>

      {/* Section 4: PPO */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">{content.sections[3]!.heading}</h2>
        <p className="text-slate-400 leading-relaxed">{content.sections[3]!.body}</p>
      </div>

      {/* PPO formula */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">PPO Clipped Objective</h2>
        <p className="text-slate-400 mb-4">
          PPO clips the probability ratio to prevent large updates:
        </p>
        <MathBlock>{content.formulas.ppoClip}</MathBlock>
      </div>

      {/* Section 5: KL penalty */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">{content.sections[4]!.heading}</h2>
        <p className="text-slate-400 leading-relaxed">{content.sections[4]!.body}</p>
      </div>

      <InfoCard variant="concept" title="KL penalty prevents reward hacking">
        Without the KL divergence penalty, the language model would learn to "game" the reward
        model — producing outputs that score highly but are actually nonsensical or harmful.
        The KL term keeps the aligned model close to the original pretrained distribution.
      </InfoCard>

      <SectionDivider label="Alternatives to RLHF" />

      {/* Section 6: DPO */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">{content.sections[5]!.heading}</h2>
        <p className="text-slate-400 leading-relaxed">{content.sections[5]!.body}</p>
      </div>

      {/* DPO formula */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">DPO Objective</h2>
        <p className="text-slate-400 mb-4">
          DPO directly optimizes preference on chosen (y_w) vs rejected (y_l) responses
          relative to a reference policy:
        </p>
        <MathBlock>{content.formulas.dpoLoss}</MathBlock>
      </div>

      {/* Section 7: RLAIF */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">{content.sections[6]!.heading}</h2>
        <p className="text-slate-400 leading-relaxed">{content.sections[6]!.body}</p>
      </div>

      <InfoCard variant="tip" title="DPO vs RLHF in practice">
        DPO is simpler and more stable to train than full RLHF — no reward model to train
        separately, no RL optimization loop. For most use cases with under 70B parameters,
        DPO is the preferred approach. Full RLHF (PPO) is still used by the largest labs
        for flagship models.
      </InfoCard>

      <SectionDivider label="Interactive" />

      {/* RLHF Pipeline visualizer */}
      <h3 className="text-lg font-semibold text-white mb-3">RLHF Pipeline Walkthrough</h3>
      <p className="text-slate-300 leading-relaxed mb-4">
        The RLHF pipeline is a three-stage process: human preferences are collected, a reward model
        is trained on those preferences, and finally the language model is optimized via RL to
        maximize the reward model's score. Each stage builds on the previous one.
      </p>

      <InfoCard variant="tip" title="What to observe">
        Click 'Animate' and watch each stage appear in order. The critical insight is Stage 3 (PPO) — it's applying reinforcement learning to text generation, treating each generated token as an 'action' and the reward model's score as the 'reward'. This is why RLHF is computationally intensive: you're running RL over a sequence space with vocabulary-size actions at each step.
      </InfoCard>

      <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 mb-8">
        <RLHFPipeline />
      </div>

      <InfoCard variant="warning" title="Alignment is not a solved problem">
        Current RLHF/DPO-aligned models can still be jailbroken, produce harmful content in
        adversarial scenarios, and exhibit sycophancy (telling users what they want to hear).
        Alignment research is an active field with no complete solution.
      </InfoCard>

      <ChapterNavButton
        currentChapterId={7}
        nextChapterTeaser="Chapter 8 explores reasoning models — models that think step-by-step before answering, dramatically improving performance on complex problems."
      />
    </article>
  )
}
