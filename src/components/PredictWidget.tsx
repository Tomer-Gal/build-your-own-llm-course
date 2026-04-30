import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PredictWidgetProps {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  wrongExplanation?: string
}

type State = 'idle' | 'correct' | 'wrong'

export default function PredictWidget({
  question,
  options,
  correctIndex,
  explanation,
  wrongExplanation,
}: PredictWidgetProps) {
  const [state, setState] = useState<State>('idle')
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  function handleSelect(index: number) {
    if (state !== 'idle') return
    setSelectedIndex(index)
    // Small delay before revealing so the chip-lock feels intentional
    setTimeout(() => {
      setState(index === correctIndex ? 'correct' : 'wrong')
    }, 300)
  }

  function handleReset() {
    setState('idle')
    setSelectedIndex(null)
  }

  function chipClassName(index: number): string {
    const base =
      'px-3 py-1.5 rounded-lg border text-sm font-mono transition-all duration-150 select-none'

    if (state === 'idle') {
      return (
        base +
        ' border-surface-4 bg-surface-2 text-ink-1' +
        ' hover:border-violet-500/40 hover:bg-violet-500/10 cursor-pointer'
      )
    }

    // After reveal
    if (index === correctIndex) {
      return base + ' border-emerald-500/60 bg-emerald-500/15 text-emerald-300 cursor-default'
    }
    if (index === selectedIndex && state === 'wrong') {
      return base + ' border-red-500/60 bg-red-500/10 text-red-300 cursor-default'
    }
    return base + ' border-surface-4 bg-surface-2 text-ink-3 cursor-default opacity-50'
  }

  return (
    <div className="bg-surface-2 border border-violet-500/15 rounded-xl p-5 my-6">
      {/* Question */}
      <p className="text-ink-0 font-semibold text-sm mb-4 leading-relaxed">{question}</p>

      {/* Prediction prompt */}
      {state === 'idle' && (
        <p className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3">
          Make a prediction before continuing
        </p>
      )}

      {/* Word chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        {options.map((word, index) => {
          const isCorrect = index === correctIndex
          const isSelected = index === selectedIndex

          return (
            <motion.button
              key={index}
              className={chipClassName(index)}
              onClick={() => handleSelect(index)}
              disabled={state !== 'idle'}
              aria-pressed={isSelected}
              animate={
                state === 'correct' && isCorrect
                  ? { scale: [1, 1.2, 1] }
                  : state === 'wrong' && isSelected
                    ? { x: [0, -4, 4, -4, 4, 0] }
                    : {}
              }
              transition={
                state === 'correct' && isCorrect
                  ? { duration: 0.45, ease: 'easeOut' }
                  : state === 'wrong' && isSelected
                    ? { duration: 0.35, ease: 'easeInOut' }
                    : {}
              }
            >
              {state !== 'idle' && isCorrect ? '✓ ' : ''}
              {word}
            </motion.button>
          )
        })}
      </div>

      {/* Explanation reveal */}
      <AnimatePresence>
        {state !== 'idle' && (
          <motion.div
            key="explanation"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {state === 'wrong' && wrongExplanation && (
              <p className="text-red-300 text-sm mb-3 leading-relaxed">
                {wrongExplanation}
              </p>
            )}
            <p
              className={
                'text-sm leading-relaxed ' +
                (state === 'correct' ? 'text-emerald-300' : 'text-ink-1')
              }
            >
              {explanation}
            </p>

            {/* Reset */}
            <button
              onClick={handleReset}
              className="mt-4 text-xs font-semibold text-violet-300 hover:text-violet-200
                         border border-violet-500/30 hover:border-violet-500/60
                         px-3 py-1.5 rounded-lg transition-all duration-150"
            >
              Try another
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
