import { useEffect } from 'react'
import { markVisited } from '../../utils/progress'
import { getChapter } from '../../data/chapters'
import ChapterHeader from '../../components/ChapterHeader'
import LearningOutcomes from '../../components/LearningOutcomes'
import ChapterNavButton from '../../components/ChapterNavButton'
import MathBlock from '../../components/MathBlock'
import InfoCard from '../../components/InfoCard'
import SectionDivider from '../../components/SectionDivider'
import LoRAViz from './LoRAViz'
import { content } from './content'

export default function Chapter06() {
  useEffect(() => {
    markVisited(6)
  }, [])

  const chapter = getChapter(6)!

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <ChapterHeader chapter={chapter} totalChapters={9} />

      <LearningOutcomes
        outcomes={[
          'Understand why pretrained models need fine-tuning for specific tasks',
          'Calculate LoRA\'s parameter savings for a given rank and dimension',
          'Intuitively grasp why low-rank approximations work for fine-tuning',
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

      <SectionDivider label="Supervised Fine-Tuning" />

      {/* SFT Loss */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">SFT Training Objective</h2>
        <p className="text-slate-400 mb-4">
          SFT continues training on instruction-response pairs, maximizing the log-probability of
          the response tokens given the instruction:
        </p>
        <MathBlock>{content.formulas.sftLoss}</MathBlock>
      </div>

      {/* Sections 1–2 */}
      {content.sections.slice(0, 2).map((section, i) => (
        <div key={i} className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-3">{section.heading}</h2>
          <p className="text-slate-400 leading-relaxed">{section.body}</p>
        </div>
      ))}

      <InfoCard variant="concept" title="Data quality > data quantity">
        Research consistently shows that 10,000 high-quality, diverse instruction-response pairs
        can outperform 1,000,000 noisy or repetitive ones. Curate carefully.
      </InfoCard>

      <SectionDivider label="LoRA" />

      {/* Section 3: Parameter efficiency problem */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">{content.sections[2]!.heading}</h2>
        <p className="text-slate-400 leading-relaxed">{content.sections[2]!.body}</p>
      </div>

      {/* LoRA formulas */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">The LoRA Weight Update</h2>
        <p className="text-slate-400 mb-4">
          Instead of learning the full weight change ΔW, LoRA learns two small matrices A and B
          whose product approximates it:
        </p>
        <MathBlock>{content.formulas.loraUpdate}</MathBlock>
      </div>

      {/* Section 4: LoRA description */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">{content.sections[3]!.heading}</h2>
        <p className="text-slate-400 leading-relaxed">{content.sections[3]!.body}</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">Parameter Count Comparison</h2>
        <p className="text-slate-400 mb-4">
          The LoRA matrices require far fewer parameters than the full weight matrix:
        </p>
        <MathBlock>{content.formulas.loraParams}</MathBlock>
      </div>

      {/* Section 5: LoRA math */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">{content.sections[4]!.heading}</h2>
        <p className="text-slate-400 leading-relaxed">{content.sections[4]!.body}</p>
      </div>

      {/* Section 6: Choosing rank */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">{content.sections[5]!.heading}</h2>
        <p className="text-slate-400 leading-relaxed">{content.sections[5]!.body}</p>
      </div>

      <SectionDivider label="Interactive" />

      {/* LoRA Visualizer */}
      <h3 className="text-lg font-semibold text-white mb-3">LoRA Rank Explorer</h3>
      <p className="text-slate-300 leading-relaxed mb-4">
        Adjust the rank slider to see how the matrix dimensions change and how parameter
        count scales. The two matrices A and B are shown with their actual dimensions,
        making the math concrete.
      </p>

      <InfoCard variant="tip" title="What to observe">
        Move the rank slider and watch the parameter count change. Notice that even at rank r=1, you have 2×4096 = 8,192 trainable parameters — enough to meaningfully adapt a model's behavior. At rank r=64, you capture more complex adaptations while still using a tiny fraction of full fine-tuning parameters.
      </InfoCard>

      <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 mb-8">
        <LoRAViz />
      </div>

      <InfoCard variant="concept" title="Why low-rank works">
        LoRA works because fine-tuning updates are intrinsically low-rank — a finding confirmed empirically across models and tasks. The pre-training weight matrix W is already rich; fine-tuning only needs to nudge it in a low-dimensional direction. This means you can fine-tune a 7B parameter model on a single consumer GPU, opening cutting-edge model adaptation to anyone.
      </InfoCard>

      <InfoCard variant="tip" title="QLoRA: Quantized LoRA">
        QLoRA combines LoRA with 4-bit quantization of the base model. The frozen weights are
        quantized to INT4 (saving memory), while the LoRA adapters remain in BF16. This makes
        fine-tuning 70B models feasible on a single consumer GPU.
      </InfoCard>

      <InfoCard variant="warning" title="LoRA does not reduce inference cost">
        The LoRA adapters can be merged back into the base weights (W + AB) before deployment,
        so inference has the same cost as the original model. But during fine-tuning, you still
        forward through the full frozen model — the savings are in memory for optimizer states
        and gradients, not in forward pass FLOPs.
      </InfoCard>

      <ChapterNavButton
        currentChapterId={6}
        nextChapterTeaser="Chapter 7 addresses the hardest problem in LLM development: making a model actually helpful and honest. Enter RLHF."
      />
    </article>
  )
}
