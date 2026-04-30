import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Stage {
  id: number
  title: string
  icon: string
  shortDesc: string
  detail: string
  color: string
}

const STAGES: Stage[] = [
  {
    id: 1,
    title: 'Pretrained LM',
    icon: '🌐',
    shortDesc: 'Base model from pretraining',
    detail:
      'The starting point: a language model pretrained on vast text corpora using next-token prediction. It has broad knowledge but doesn\'t know how to follow instructions or behave safely.',
    color: 'border-slate-500/50 bg-slate-800/60',
  },
  {
    id: 2,
    title: 'Human Preferences',
    icon: '👥',
    shortDesc: 'Annotators rank outputs A vs B',
    detail:
      'Human annotators are shown the same prompt with two different model responses (A and B) and asked to indicate which is better. These pairwise comparisons encode nuanced human values that are hard to specify as rules.',
    color: 'border-blue-500/50 bg-blue-900/20',
  },
  {
    id: 3,
    title: 'Reward Model',
    icon: '🎯',
    shortDesc: 'Trained to predict human preferences',
    detail:
      'A reward model r_θ(x, y) is trained on the preference data to predict which response humans prefer. It takes a prompt and response and outputs a scalar quality score. This model acts as a proxy for human judgment during RL training.',
    color: 'border-purple-500/50 bg-purple-900/20',
  },
  {
    id: 4,
    title: 'RL Training (PPO)',
    icon: '⚙️',
    shortDesc: 'LM fine-tuned with reward signal',
    detail:
      'Proximal Policy Optimization (PPO) treats the LM as a policy and the reward model\'s score as the reward signal. The LM is updated to maximize reward while a KL divergence penalty keeps it from drifting too far from the original model (preventing reward hacking).',
    color: 'border-amber-500/50 bg-amber-900/20',
  },
  {
    id: 5,
    title: 'Aligned LM',
    icon: '✅',
    shortDesc: 'Helpful, harmless, and honest',
    detail:
      'The final aligned model produces responses that humans prefer: more helpful, less harmful, and more honest. The model has internalized the reward signal and produces high-quality responses without needing the reward model at inference time.',
    color: 'border-green-500/50 bg-green-900/20',
  },
]

export default function RLHFPipeline() {
  const [visibleCount, setVisibleCount] = useState(0)
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleAnimate = useCallback(() => {
    if (isAnimating) return
    setVisibleCount(0)
    setIsAnimating(true)
    let count = 0
    const interval = setInterval(() => {
      count += 1
      setVisibleCount(count)
      if (count >= STAGES.length) {
        clearInterval(interval)
        setIsAnimating(false)
      }
    }, 600)
  }, [isAnimating])

  const handleReset = useCallback(() => {
    setVisibleCount(0)
    setIsAnimating(false)
    setSelectedStage(null)
  }, [])

  return (
    <div className="space-y-6" aria-label="RLHF pipeline diagram">
      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={handleAnimate}
          disabled={isAnimating}
          aria-label="Animate RLHF pipeline"
          className="px-4 py-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50
            disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium
            transition-colors focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-1"
        >
          {isAnimating ? 'Animating…' : visibleCount === STAGES.length ? 'Replay' : 'Animate'}
        </button>
        <button
          onClick={handleReset}
          aria-label="Reset RLHF pipeline animation"
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg
            text-sm font-medium transition-colors focus-visible:outline-none
            focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2
            focus-visible:ring-offset-surface-1"
        >
          Reset
        </button>
      </div>

      {/* Pipeline stages */}
      <div
        className="flex flex-col md:flex-row gap-2 md:gap-0 items-center"
        role="list"
        aria-label="RLHF pipeline stages"
      >
        {STAGES.map((stage, i) => (
          <React.Fragment key={stage.id}>
            <AnimatePresence>
              {i < visibleCount && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  onClick={() => setSelectedStage(selectedStage?.id === stage.id ? null : stage)}
                  aria-pressed={selectedStage?.id === stage.id}
                  aria-label={`Stage ${stage.id}: ${stage.title}. Click for more detail.`}
                  role="listitem"
                  className={`flex-1 min-w-[120px] max-w-[180px] border rounded-xl p-4 text-left
                    cursor-pointer transition-all hover:scale-105 focus-visible:outline-none
                    focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2
                    focus-visible:ring-offset-surface-1
                    ${stage.color}
                    ${selectedStage?.id === stage.id ? 'ring-2 ring-brand-500' : ''}`}
                >
                  <div className="text-2xl mb-2" aria-hidden="true">{stage.icon}</div>
                  <p className="text-sm font-semibold text-white leading-tight">{stage.title}</p>
                  <p className="text-xs text-slate-400 mt-1 leading-snug">{stage.shortDesc}</p>
                </motion.button>
              )}
            </AnimatePresence>

            {/* Arrow between stages */}
            {i < STAGES.length - 1 && i < visibleCount - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hidden md:flex items-center px-1 text-slate-500 text-lg flex-shrink-0"
                aria-hidden="true"
              >
                →
              </motion.div>
            )}
            {i < STAGES.length - 1 && i < visibleCount - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="md:hidden text-slate-500 text-lg"
                aria-hidden="true"
              >
                ↓
              </motion.div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Detail popover */}
      <AnimatePresence>
        {selectedStage && (
          <motion.div
            key={selectedStage.id}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className={`border rounded-xl p-5 ${selectedStage.color}`}
            role="region"
            aria-label={`Details for stage: ${selectedStage.title}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0" aria-hidden="true">{selectedStage.icon}</span>
              <div>
                <h3 className="font-semibold text-white mb-2">
                  Stage {selectedStage.id}: {selectedStage.title}
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">{selectedStage.detail}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {visibleCount === 0 && (
        <p className="text-slate-500 text-sm text-center py-8">
          Click "Animate" to walk through the RLHF pipeline step by step,
          then click any stage for more details.
        </p>
      )}
    </div>
  )
}
