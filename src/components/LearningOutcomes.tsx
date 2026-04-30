import React from 'react'
import { motion } from 'framer-motion'

interface LearningOutcomesProps {
  outcomes: string[]
}

const LearningOutcomes: React.FC<LearningOutcomesProps> = ({ outcomes }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.4 }}
      className="bg-surface-2 border border-slate-700/50 rounded-xl p-5 mb-10"
      aria-label="Learning outcomes"
    >
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
        By the end of this chapter you will:
      </p>
      <ul className="space-y-2">
        {outcomes.map((outcome, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
            <span className="text-brand-500 font-bold mt-0.5 flex-shrink-0" aria-hidden>✓</span>
            <span>{outcome}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

export default LearningOutcomes
