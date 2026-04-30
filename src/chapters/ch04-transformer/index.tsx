import React, { useEffect } from 'react'
import { getChapter } from '../../data/chapters'
import { markVisited } from '../../utils/progress'
import ChapterHeader from '../../components/ChapterHeader'
import InfoCard from '../../components/InfoCard'
import SectionDivider from '../../components/SectionDivider'
import MathBlock from '../../components/MathBlock'
import LearningOutcomes from '../../components/LearningOutcomes'
import ChapterNavButton from '../../components/ChapterNavButton'
import { content } from './content'
import TransformerDiagram from './TransformerDiagram'
import LayerNormViz from './LayerNormViz'
import ActivationViz from './ActivationViz'

const chapter = getChapter(4)!

const Ch04Transformer: React.FC = () => {
  useEffect(() => {
    markVisited(4)
  }, [])

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <ChapterHeader chapter={chapter} totalChapters={9} />

      <LearningOutcomes
        outcomes={[
          'Describe the two sub-layers in every transformer block and explain what role each plays — attention routes information, FFN transforms it',
          'Explain why pre-norm (LayerNorm before the sub-layer) stabilizes training better than post-norm at scale, and what gamma and beta contribute',
          'Explain why residual connections are essential for training deep networks — what the "gradient superhighway" insight means in practice',
        ]}
      />

      {/* Transformer Block Overview */}
      <section id={content.sections[0].id} className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-4">{content.sections[0].title}</h2>
        {content.sections[0].body.map((para, i) => (
          <p key={i} className="text-slate-300 leading-relaxed mb-4">{para}</p>
        ))}

        {/* Worked Example Wrapper: TransformerDiagram */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-2">
            Exploring the architecture interactively
          </h3>
          <p className="text-slate-400 mb-4 leading-relaxed">
            The diagram below shows the full GPT-style transformer block. Every component you have read about in this chapter — attention, feed-forward network, layer normalization, and residual connections — is present and clickable.
          </p>

          <InfoCard variant="tip" title="What to observe">
            Click any component in the diagram to see what it does. Pay close attention to the arrows — information flows bottom-up through the block, but residual connections create bypass paths that skip around each sub-layer. Each sub-layer is a refinement of its input, not a replacement. Notice how layer normalization appears before each sub-layer in the pre-norm design, keeping activations in a stable range before the heavier computations.
          </InfoCard>

          <div className="interactive-card bg-surface-2 border border-slate-700/50 rounded-xl p-6 my-6">
            <h3 className="text-lg font-semibold text-white mb-4">Transformer Block Architecture</h3>
            <TransformerDiagram />
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Layer Normalization */}
      <section id={content.sections[1].id} className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-4">{content.sections[1].title}</h2>
        {content.sections[1].body.map((para, i) => (
          <p key={i} className="text-slate-300 leading-relaxed mb-4">{para}</p>
        ))}

        {content.sections[1].formulas?.map(formula => (
          <div key={formula.label} className="my-6">
            <MathBlock>{formula.latex}</MathBlock>
            <p className="text-slate-400 text-sm text-center -mt-2">{formula.description}</p>
          </div>
        ))}

        <p className="text-slate-300 leading-relaxed mb-4">
          The visualizer below lets you see LayerNorm in action: it removes the mean (centering) and divides by the standard deviation (scaling to unit variance), then applies the learnable gamma and beta. Drag the input activations to see how the normalization responds, and notice how the output distribution stays tightly controlled regardless of how wild the inputs are.
        </p>

        <div className="interactive-card bg-surface-2 border border-slate-700/50 rounded-xl p-6 my-6">
          <h3 className="text-lg font-semibold text-white mb-4">LayerNorm Distribution Visualizer</h3>
          <LayerNormViz />
        </div>
      </section>

      <SectionDivider />

      {/* Feed-Forward Network */}
      <section id={content.sections[2].id} className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-4">{content.sections[2].title}</h2>
        {content.sections[2].body.map((para, i) => (
          <p key={i} className="text-slate-300 leading-relaxed mb-4">{para}</p>
        ))}

        {content.sections[2].formulas?.map(formula => (
          <div key={formula.label} className="my-6">
            <MathBlock>{formula.latex}</MathBlock>
            <p className="text-slate-400 text-sm text-center -mt-2">{formula.description}</p>
          </div>
        ))}

        <p className="text-slate-300 leading-relaxed mb-4">
          GELU versus ReLU — the activation function choice matters more than it might seem. The plot below lets you compare the two functions directly. Notice that GELU has a smooth gradient everywhere (important for training stability), while ReLU has a sharp corner at 0 that can cause "dead neurons" — units that get stuck at exactly zero and stop receiving gradient updates entirely, effectively dropping out of the computation permanently.
        </p>

        <div className="interactive-card bg-surface-2 border border-slate-700/50 rounded-xl p-6 my-6">
          <h3 className="text-lg font-semibold text-white mb-4">GELU vs ReLU Activation Plot</h3>
          <ActivationViz />
        </div>

        <InfoCard variant="tip" title="Why GELU over ReLU?">
          GELU has a smooth, non-zero gradient for small negative values (unlike the hard zero of ReLU). This prevents "dead neurons" and tends to produce better downstream task performance. Intuitively, GELU acts like a soft probabilistic gate: for very negative inputs it outputs near zero (like ReLU), but the transition is smooth rather than sudden, which keeps gradient information flowing even through near-zero activations.
        </InfoCard>
      </section>

      <SectionDivider />

      {/* Residual Connections */}
      <section id={content.sections[3].id} className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-4">{content.sections[3].title}</h2>
        {content.sections[3].body.map((para, i) => (
          <p key={i} className="text-slate-300 leading-relaxed mb-4">{para}</p>
        ))}

        {content.sections[3].formulas?.map(formula => (
          <div key={formula.label} className="my-6">
            <MathBlock>{formula.latex}</MathBlock>
            <p className="text-slate-400 text-sm text-center -mt-2">{formula.description}</p>
          </div>
        ))}

        <InfoCard variant="info" title="Deep networks need residual connections">
          Without residual connections, training a 96-layer transformer (like GPT-3) would be practically impossible — gradients would vanish or explode long before reaching the early layers. Residual connections create a "gradient superhighway" that lets the learning signal propagate all the way back. This is the transformer equivalent of the skip connections in ResNet that made 100+ layer vision networks trainable for the first time in 2015.
        </InfoCard>
      </section>

      <ChapterNavButton
        currentChapterId={4}
        nextChapterTeaser="Chapter 5 covers pretraining — taking the transformer architecture you just learned and training it on billions of tokens using next-token prediction. You will see how the loss landscape shapes what the model learns, and why scale matters so dramatically."
      />
    </article>
  )
}

export default Ch04Transformer
