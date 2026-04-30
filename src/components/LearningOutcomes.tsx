import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface LearningOutcomesProps {
  outcomes: string[]
}

const LearningOutcomes: React.FC<LearningOutcomesProps> = ({ outcomes }) => {
  const shouldReduce = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduce ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.45, ease: 'easeOut' }}
      className="interactive-card mb-10"
      aria-label="Learning outcomes"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-base" aria-hidden>✦</span>
        <p className="text-xs font-bold text-violet-300 uppercase tracking-widest">
          In this chapter
        </p>
      </div>

      {/* Outcome list */}
      <motion.ul
        className="space-y-3"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: shouldReduce ? 0 : 0.05,
              delayChildren: 0.25,
            },
          },
        }}
      >
        {outcomes.map((outcome, i) => (
          <motion.li
            key={i}
            variants={{
              hidden: { opacity: 0, x: shouldReduce ? 0 : -8 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' } },
            }}
            className="flex items-start gap-3"
          >
            {/* Custom checkmark icon */}
            <span
              className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center
                bg-violet-500/20 border border-violet-500/40 text-violet-300 text-xs font-bold leading-none"
              aria-hidden
            >
              ✓
            </span>
            <span className="text-ink-1 text-sm leading-relaxed">{outcome}</span>
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  )
}

export default LearningOutcomes
