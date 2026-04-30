import React, { useEffect } from 'react'
import { getChapter } from '../../data/chapters'
import { markVisited } from '../../utils/progress'
import ChapterHeader from '../../components/ChapterHeader'
import InfoCard from '../../components/InfoCard'
import SectionDivider from '../../components/SectionDivider'
import MathBlock from '../../components/MathBlock'
import { content } from './content'
import TrainingDynamics from './TrainingDynamics'
import LossSurface3D from './LossSurface3D'

const chapter = getChapter(5)!

const Ch05Pretraining: React.FC = () => {
  useEffect(() => {
    markVisited(5)
  }, [])

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <ChapterHeader chapter={chapter} totalChapters={9} />

      {/* Pretraining Objective */}
      <section id={content.sections[0].id} className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-4">{content.sections[0].title}</h2>
        {content.sections[0].body.map((para, i) => (
          <p key={i} className="text-slate-300 leading-relaxed mb-4">{para}</p>
        ))}

        {content.sections[0].formulas?.map(formula => (
          <div key={formula.label} className="my-6">
            <MathBlock>{formula.latex}</MathBlock>
            <p className="text-slate-400 text-sm text-center -mt-2">{formula.description}</p>
          </div>
        ))}

        <InfoCard variant="concept" title="Perplexity">
          A common metric derived from cross-entropy loss: Perplexity = e^loss. A perplexity of N means the model is, on average, as uncertain as if it had to choose uniformly among N options. GPT-2 achieved 18.34 on Penn Treebank; state-of-the-art models now achieve single digits.
        </InfoCard>
      </section>

      <SectionDivider />

      {/* Data Pipelines */}
      <section id={content.sections[1].id} className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-4">{content.sections[1].title}</h2>
        {content.sections[1].body.map((para, i) => (
          <p key={i} className="text-slate-300 leading-relaxed mb-4">{para}</p>
        ))}

        <InfoCard variant="info" title="Data scale">
          GPT-3 was trained on ~300B tokens. Llama 2 used 2T tokens. Modern frontier models train on 10T+ tokens. At these scales, data curation (filtering low-quality text, deduplication, domain mixing) becomes as important as the architecture.
        </InfoCard>
      </section>

      <SectionDivider />

      {/* Learning Rate Schedules */}
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

        <div className="interactive-card bg-surface-2 border border-slate-700/50 rounded-xl p-6 my-6">
          <h3 className="text-lg font-semibold text-white mb-4">Training Dynamics Simulator</h3>
          <TrainingDynamics />
        </div>
      </section>

      <SectionDivider />

      {/* Gradient Descent */}
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

        <InfoCard variant="tip" title="The loss landscape is high-dimensional">
          The 2D contour plot below is a simplified illustration. Real LLMs have billions of parameters — you cannot visualize the actual loss landscape. Researchers study 2D slices (e.g., loss sharpness / flatness) to gain intuition, but the full geometry is far beyond human perception.
        </InfoCard>

        <div className="interactive-card bg-surface-2 border border-slate-700/50 rounded-xl p-6 my-6">
          <h3 className="text-lg font-semibold text-white mb-4">Loss Landscape Explorer</h3>
          <LossSurface3D />
        </div>
      </section>
    </article>
  )
}

export default Ch05Pretraining
