import { useEffect } from 'react'
import { markVisited } from '../../utils/progress'
import { getChapter } from '../../data/chapters'
import ChapterHeader from '../../components/ChapterHeader'
import LearningOutcomes from '../../components/LearningOutcomes'
import ChapterNavButton from '../../components/ChapterNavButton'
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

      <LearningOutcomes
        outcomes={[
          'Explain how KV cache reduces inference complexity from O(n²) to O(n)',
          'Calculate memory requirements for a model at different precisions',
          'Describe the trade-offs between quantization levels',
          'Understand how speculative decoding accelerates generation',
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

      {/* Quantization Widget */}
      <h3 className="text-lg font-semibold text-white mb-3">Quantization Trade-off Explorer</h3>
      <p className="text-slate-300 leading-relaxed mb-4">
        Compare memory usage, quality, and inference speed across precision formats.
        The memory bar shows VRAM required to load the model weights alone — KV cache
        and activations add additional overhead during inference.
      </p>

      <InfoCard variant="tip" title="What to observe">
        Select different precision levels and watch the memory bar change. Then move the model size slider — notice how even at INT4, a 70B model requires 35GB VRAM. This is why companies run large models on clusters, not laptops. Notice also that quality degrades gracefully: INT8 is nearly indistinguishable from FP16 for most tasks.
      </InfoCard>

      <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 mb-8">
        <QuantizationWidget />
      </div>

      <InfoCard variant="concept" title="The quantization sweet spot">
        The quantization sweet spot for most applications is INT4 or INT8 — you get 4–8× memory reduction with quality loss that is imperceptible in most use cases. This is why llama.cpp and Ollama have made 7B–13B models runnable on MacBooks, bringing cutting-edge models to consumer hardware without a cloud subscription.
      </InfoCard>

      <SectionDivider label="Speculative Decoding" />

      {/* Section 4: Speculative decoding */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">{content.sections[3]!.heading}</h2>
        <p className="text-slate-400 leading-relaxed">{content.sections[3]!.body}</p>
      </div>

      <SectionDivider label="Serving Architecture" />

      {/* Section 5: Serving architectures */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-3">{content.sections[4]!.heading}</h2>
        <p className="text-slate-400 leading-relaxed">{content.sections[4]!.body}</p>
      </div>

      <InfoCard variant="warning" title="INT4 quality depends on the task">
        Average benchmark scores make INT4 look nearly as good as FP32, but specific tasks —
        particularly those requiring precise numeric computation, rare-word vocabulary, or
        code generation — can show significant quality degradation. Always benchmark on your
        specific use case before deploying at low precision.
      </InfoCard>

      <ChapterNavButton currentChapterId={9} />
    </article>
  )
}
