import { useEffect } from 'react'
import { markVisited } from '../../utils/progress'
import { getChapter } from '../../data/chapters'
import ChapterHeader from '../../components/ChapterHeader'
import InfoCard from '../../components/InfoCard'
import SectionDivider from '../../components/SectionDivider'
import QuantizationWidget from './QuantizationWidget'
import { content } from './content'

export default function Chapter09() {
  useEffect(() => {
    markVisited(9)
  }, [])

  const chapter = getChapter(9)!

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

      <SectionDivider label="KV Cache" />

      {/* Section 1: KV cache */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">{content.sections[0]!.heading}</h2>
        <p className="text-slate-400 leading-relaxed">{content.sections[0]!.body}</p>
      </div>

      <InfoCard variant="concept" title="KV cache memory cost">
        The KV cache is not free — it requires memory proportional to sequence length × number
        of layers × hidden dimension. For a 70B parameter model with a 128k context window,
        the KV cache alone can require 10s of gigabytes of VRAM. This is why KV cache
        management (PagedAttention, sliding window) is a major area of serving research.
      </InfoCard>

      <SectionDivider label="Batching" />

      {/* Section 2: Batching */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">{content.sections[1]!.heading}</h2>
        <p className="text-slate-400 leading-relaxed">{content.sections[1]!.body}</p>
      </div>

      <InfoCard variant="tip" title="Continuous batching vs static batching">
        Static batching can leave GPU cores idle waiting for long requests to finish.
        Continuous batching (also called "iteration-level scheduling") solves this by
        inserting new requests as soon as any position in the batch completes. vLLM and
        HuggingFace TGI both use continuous batching to achieve near-100% GPU utilization.
      </InfoCard>

      <SectionDivider label="Quantization" />

      {/* Section 3: Quantization */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">{content.sections[2]!.heading}</h2>
        <p className="text-slate-400 leading-relaxed">{content.sections[2]!.body}</p>
      </div>

      <SectionDivider label="Serving Architecture" />

      {/* Sections 4–5 */}
      {content.sections.slice(3).map((section, i) => (
        <div key={i} className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-3">{section.heading}</h2>
          <p className="text-slate-400 leading-relaxed">{section.body}</p>
        </div>
      ))}

      <SectionDivider label="Interactive" />

      {/* Quantization Widget */}
      <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-2">
          Quantization Trade-off Explorer
        </h2>
        <p className="text-slate-400 text-sm mb-6">
          Compare memory usage, quality, and inference speed across precision formats.
          Adjust model size to estimate VRAM requirements.
        </p>
        <QuantizationWidget />
      </div>

      <InfoCard variant="warning" title="INT4 quality depends on the task">
        Average benchmark scores make INT4 look nearly as good as FP32, but specific tasks —
        particularly those requiring precise numeric computation, rare-word vocabulary, or
        code generation — can show significant quality degradation. Always benchmark on your
        specific use case before deploying at low precision.
      </InfoCard>

      <InfoCard variant="concept" title="The end of the course">
        You have now covered the full LLM lifecycle: from raw text and tokenization, through
        transformer architecture and pretraining, to fine-tuning, alignment, reasoning, and
        production deployment. The field moves fast — but these fundamentals will remain
        relevant as the architectures evolve.
      </InfoCard>
    </article>
  )
}
