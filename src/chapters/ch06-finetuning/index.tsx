import { useEffect } from 'react'
import { markVisited } from '../../utils/progress'
import { getChapter } from '../../data/chapters'
import ChapterHeader from '../../components/ChapterHeader'
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

      {/* LoRA formulas */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">The LoRA Weight Update</h2>
        <p className="text-slate-400 mb-4">
          Instead of learning the full weight change ΔW, LoRA learns two small matrices A and B
          whose product approximates it:
        </p>
        <MathBlock>{content.formulas.loraUpdate}</MathBlock>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">Parameter Count Comparison</h2>
        <p className="text-slate-400 mb-4">
          The LoRA matrices require far fewer parameters than the full weight matrix:
        </p>
        <MathBlock>{content.formulas.loraParams}</MathBlock>
      </div>

      {/* Sections 3–5 */}
      {content.sections.slice(2).map((section, i) => (
        <div key={i} className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-3">{section.heading}</h2>
          <p className="text-slate-400 leading-relaxed">{section.body}</p>
        </div>
      ))}

      <SectionDivider label="Interactive" />

      {/* LoRA Visualizer */}
      <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-2">LoRA Rank Explorer</h2>
        <p className="text-slate-400 text-sm mb-6">
          Adjust the rank r to see how the matrix dimensions change and compare trainable
          parameter counts between LoRA and full fine-tuning.
        </p>
        <LoRAViz />
      </div>

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
    </article>
  )
}
