import React, { useEffect, useState } from 'react'
import { getChapter } from '../../data/chapters'
import { markVisited } from '../../utils/progress'
import ChapterHeader from '../../components/ChapterHeader'
import LearningOutcomes from '../../components/LearningOutcomes'
import ChapterNavButton from '../../components/ChapterNavButton'
import InfoCard from '../../components/InfoCard'
import SectionDivider from '../../components/SectionDivider'
import MathBlock from '../../components/MathBlock'
import ReactiveNumber from '../../components/ReactiveNumber'
import { content } from './content'
import TrainingDynamics from './TrainingDynamics'
import LossSurface3D from './LossSurface3D'

const chapter = getChapter(5)!

const Ch05Pretraining: React.FC = () => {
  useEffect(() => {
    markVisited(5)
  }, [])

  const [lr, setLr] = useState(0.001)
  const [warmupSteps, setWarmupSteps] = useState(100)
  const [contextLen, setContextLen] = useState(1024)

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <ChapterHeader chapter={chapter} totalChapters={9} />

      <LearningOutcomes
        outcomes={[
          'Explain why next-token prediction is self-supervised',
          'Describe how learning rate schedules stabilize training',
          'Interpret a loss curve and identify overfitting vs underfitting',
          'Understand how Chinchilla scaling laws guide training decisions',
        ]}
      />

      <InfoCard variant="warning" title="What happens with a bad learning rate?">
        A learning rate of <span className="font-mono text-amber-300">0.1</span> on
        a 1B-parameter model causes the loss to spike and oscillate — the optimizer
        overshoots every minimum. A rate of <span className="font-mono text-amber-300">0.000001</span>{' '}
        converges so slowly that training a GPT-2-sized model would take years.
        The entire challenge of training is finding and maintaining the right rate —
        which is why learning rate schedules exist.
      </InfoCard>

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

        {/* Reactive Prose — Bret Victor scrubable numbers */}
        <div className="bg-surface-2 border border-violet-500/10 rounded-xl p-6 my-8">
          <p className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-4">
            &#10022; Drag the numbers to explore
          </p>
          <p className="text-ink-1 leading-8">
            With a learning rate of{' '}
            <ReactiveNumber
              value={lr}
              onChange={setLr}
              min={0.0001}
              max={0.1}
              step={0.0001}
              format={v => v.toFixed(4)}
            />,
            the model trains for approximately{' '}
            <span className="font-mono text-cyan-400">
              {Math.round(500 / (lr / 0.001))} steps
            </span>{' '}
            before reaching a stable loss. With{' '}
            <ReactiveNumber
              value={warmupSteps}
              onChange={setWarmupSteps}
              min={0}
              max={500}
              step={1}
              format={v => Math.round(v).toString()}
              unit=" warmup steps"
            />,
            the learning rate ramps linearly from 0 before decaying.
            A context window of{' '}
            <ReactiveNumber
              value={contextLen}
              onChange={setContextLen}
              min={128}
              max={4096}
              step={64}
              format={v => Math.round(v).toString()}
              unit=" tokens"
            />{' '}
            means the model can attend to{' '}
            <span className="font-mono text-cyan-400">{contextLen}</span> past tokens
            at once, with{' '}
            <span className="font-mono text-cyan-400">
              {Math.round(contextLen * contextLen / 2).toLocaleString()}
            </span>{' '}
            attention computations per layer.
          </p>
        </div>

        <h3 className="text-lg font-semibold text-white mb-3">Training Dynamics Simulator</h3>
        <p className="text-slate-300 leading-relaxed mb-4">
          The simulator below lets you explore how learning rate and warmup interact during training.
          Adjust the sliders and observe how the loss curve evolves — a critical skill for debugging
          real training runs.
        </p>

        {/* Guided scenario — Karpathy / The Pudding pattern */}
        <div className="bg-surface-1 border border-surface-4 rounded-xl p-5 mb-4">
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-500 mb-2">
            &#10230; Guided: Watch this first
          </p>
          <p className="text-ink-2 text-sm mb-3">
            Start with <span className="text-violet-300 font-mono">lr=0.001</span>,{' '}
            <span className="text-violet-300 font-mono">100 warmup steps</span>, batch size 32.
            Watch the loss drop from ~10.8 (random chance) to below 4 in 1000 steps.
            Then try increasing the learning rate to 0.01 and watch it destabilize.
          </p>
          <p className="text-xs text-ink-3">Sandbox controls are below &#8595;</p>
        </div>

        <InfoCard variant="tip" title="What to observe">
          Try increasing the learning rate — you'll see the loss drop faster initially but become noisier. Try zero warmup steps — the loss often spikes before stabilizing. This mirrors real training instabilities that researchers encounter when scaling models.
        </InfoCard>

        <div className="interactive-card bg-surface-2 border border-slate-700/50 rounded-xl p-6 my-6">
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

        <h3 className="text-lg font-semibold text-white mb-3">Loss Landscape Explorer</h3>
        <p className="text-slate-300 leading-relaxed mb-4">
          The actual loss landscape of a large model has millions of dimensions — far beyond what
          any visualization can show. This 2D slice is a teaching tool: it builds intuition about
          local minima, saddle points, and why flat minima (wide valleys) generalize better than
          sharp ones. When you see an optimizer "escape" a local minimum in the visualization,
          think of gradient noise acting on a billion-dimensional surface.
        </p>

        <InfoCard variant="tip" title="The loss landscape is high-dimensional">
          The 2D contour plot below is a simplified illustration. Real LLMs have billions of parameters — you cannot visualize the actual loss landscape. Researchers study 2D slices (e.g., loss sharpness / flatness) to gain intuition, but the full geometry is far beyond human perception.
        </InfoCard>

        <div className="interactive-card bg-surface-2 border border-slate-700/50 rounded-xl p-6 my-6">
          <LossSurface3D />
        </div>
      </section>

      <SectionDivider />

      {/* Scaling Laws */}
      <section id={content.sections[4].id} className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-4">{content.sections[4].title}</h2>
        {content.sections[4].body.map((para, i) => (
          <p key={i} className="text-slate-300 leading-relaxed mb-4">{para}</p>
        ))}

        <InfoCard variant="concept" title="Chinchilla finding in one sentence">
          Most models released before 2022 were too large and undertrained. The compute-optimal strategy is to train a smaller model on more tokens — not to maximize parameter count.
        </InfoCard>
      </section>

      <ChapterNavButton
        currentChapterId={5}
        nextChapterTeaser="Chapter 6 tackles a practical problem: pretraining a model costs millions of dollars. Fine-tuning efficiently — using LoRA — costs almost nothing."
      />
    </article>
  )
}

export default Ch05Pretraining
