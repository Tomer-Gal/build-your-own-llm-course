import React, { useEffect } from 'react'
import { getChapter } from '../../data/chapters'
import { markVisited } from '../../utils/progress'
import ChapterHeader from '../../components/ChapterHeader'
import InfoCard from '../../components/InfoCard'
import SectionDivider from '../../components/SectionDivider'
import MathBlock from '../../components/MathBlock'
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

      {/* Transformer Block Overview */}
      <section id={content.sections[0].id} className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-4">{content.sections[0].title}</h2>
        {content.sections[0].body.map((para, i) => (
          <p key={i} className="text-slate-300 leading-relaxed mb-4">{para}</p>
        ))}

        <InfoCard variant="concept" title="Interactive Architecture Diagram">
          The diagram below shows the full GPT-style transformer block. Click any component to learn what it does.
        </InfoCard>

        <div className="interactive-card bg-surface-2 border border-slate-700/50 rounded-xl p-6 my-6">
          <h3 className="text-lg font-semibold text-white mb-4">Transformer Block Architecture</h3>
          <TransformerDiagram />
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

        <InfoCard variant="tip" title="Why GELU over ReLU?">
          GELU has a smooth, non-zero gradient for small negative values (unlike the hard zero of ReLU). This prevents &quot;dead neurons&quot; and tends to produce better downstream task performance. See the plot below.
        </InfoCard>

        <div className="interactive-card bg-surface-2 border border-slate-700/50 rounded-xl p-6 my-6">
          <h3 className="text-lg font-semibold text-white mb-4">GELU vs ReLU Activation Plot</h3>
          <ActivationViz />
        </div>
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
          Without residual connections, training a 96-layer transformer (like GPT-3) would be practically impossible — gradients would vanish or explode long before reaching the early layers. Residual connections create a &quot;gradient superhighway&quot; that lets the learning signal propagate all the way back.
        </InfoCard>
      </section>
    </article>
  )
}

export default Ch04Transformer
