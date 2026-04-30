import React, { useState, useEffect, useRef, useCallback } from 'react'
import Slider from '../../components/Slider'

const PROBLEM =
  'A store sells apples for $0.50 each and oranges for $0.75 each. If Alice buys 4 apples and 3 oranges, how much does she pay?'

const WITHOUT_COT = '$3.00'

interface ReasoningStep {
  label: string
  text: string
  highlights: [string, string][] // [substring, className]
}

const ALL_STEPS: ReasoningStep[] = [
  {
    label: 'Step 1: Identify values',
    text: 'Apple price: $0.50 each. Orange price: $0.75 each.',
    highlights: [
      ['$0.50', 'text-yellow-400 font-semibold'],
      ['$0.75', 'text-orange-400 font-semibold'],
    ],
  },
  {
    label: 'Step 2: Apples total',
    text: '4 apples × $0.50 = $2.00',
    highlights: [
      ['4 apples', 'text-yellow-400 font-semibold'],
      ['$2.00', 'text-green-400 font-semibold'],
    ],
  },
  {
    label: 'Step 3: Oranges total',
    text: '3 oranges × $0.75 = $2.25',
    highlights: [
      ['3 oranges', 'text-orange-400 font-semibold'],
      ['$2.25', 'text-green-400 font-semibold'],
    ],
  },
  {
    label: 'Step 4: Add totals',
    text: '$2.00 + $2.25 = $4.25',
    highlights: [
      ['$2.00', 'text-green-400 font-semibold'],
      ['$2.25', 'text-green-400 font-semibold'],
      ['$4.25', 'text-brand-400 font-bold'],
    ],
  },
  {
    label: 'Step 5: Final answer',
    text: 'Alice pays $4.25 in total.',
    highlights: [['$4.25', 'text-brand-400 font-bold text-base']],
  },
]

function highlightText(text: string, highlights: [string, string][]): React.ReactNode[] {
  if (highlights.length === 0) return [text]

  const parts: React.ReactNode[] = []
  let remaining = text

  while (remaining.length > 0) {
    let earliestIdx = -1
    let earliestHighlight: [string, string] | null = null

    for (const h of highlights) {
      const idx = remaining.indexOf(h[0])
      if (idx !== -1 && (earliestIdx === -1 || idx < earliestIdx)) {
        earliestIdx = idx
        earliestHighlight = h
      }
    }

    if (earliestIdx === -1 || !earliestHighlight) {
      parts.push(remaining)
      break
    }

    if (earliestIdx > 0) {
      parts.push(remaining.slice(0, earliestIdx))
    }
    parts.push(
      <span key={`${earliestIdx}-${earliestHighlight[0]}`} className={earliestHighlight[1]}>
        {earliestHighlight[0]}
      </span>
    )
    remaining = remaining.slice(earliestIdx + earliestHighlight[0].length)
  }

  return parts
}

interface TypingTextProps {
  text: string
  isPlaying: boolean
  onDone: () => void
}

function TypingText({ text, isPlaying, onDone }: TypingTextProps) {
  const [displayedChars, setDisplayedChars] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setDisplayedChars(0)
  }, [text])

  useEffect(() => {
    if (!isPlaying) return
    if (displayedChars >= text.length) {
      onDone()
      return
    }
    timerRef.current = setTimeout(() => {
      setDisplayedChars((c) => c + 1)
    }, 30)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [isPlaying, displayedChars, text, onDone])

  return <span>{text.slice(0, displayedChars)}</span>
}

export default function ChainOfThought() {
  const [budget, setBudget] = useState(3)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStepIdx, setCurrentStepIdx] = useState(-1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const visibleSteps = ALL_STEPS.slice(0, budget)

  const handlePlay = useCallback(() => {
    setCompletedSteps([])
    setCurrentStepIdx(0)
    setIsPlaying(true)
  }, [])

  const handleReset = useCallback(() => {
    setIsPlaying(false)
    setCurrentStepIdx(-1)
    setCompletedSteps([])
  }, [])

  const handleStepDone = useCallback(() => {
    setCompletedSteps((prev) => {
      const next = [...prev, currentStepIdx]
      const nextIdx = currentStepIdx + 1
      if (nextIdx < visibleSteps.length) {
        setCurrentStepIdx(nextIdx)
      } else {
        setIsPlaying(false)
        setCurrentStepIdx(-1)
      }
      return next
    })
  }, [currentStepIdx, visibleSteps.length])

  const handleBudgetChange = useCallback((v: number) => {
    setBudget(Math.round(v))
    handleReset()
  }, [handleReset])

  const isFinished = completedSteps.length === visibleSteps.length && visibleSteps.length > 0

  return (
    <div className="space-y-6" aria-label="Chain of thought visualizer">
      <Slider
        label="Thinking budget (steps)"
        value={budget}
        onChange={handleBudgetChange}
        min={1}
        max={5}
        step={1}
        formatValue={(v) => `${Math.round(v)} step${Math.round(v) !== 1 ? 's' : ''}`}
      />

      {/* Problem statement */}
      <div
        className="bg-surface-2 border border-slate-700/50 rounded-xl p-4"
        aria-label="Problem statement"
      >
        <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Problem</p>
        <p className="text-slate-200">{PROBLEM}</p>
      </div>

      {/* Two panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Without CoT */}
        <div
          className="bg-red-900/10 border border-red-500/20 rounded-xl p-4"
          aria-label="Response without chain of thought"
        >
          <p className="text-xs font-semibold text-red-400 uppercase tracking-widest mb-3">
            Without CoT
          </p>
          <div className="min-h-[100px] flex items-center justify-center">
            <p className="text-slate-300 font-mono text-xl font-bold">{WITHOUT_COT}</p>
          </div>
          <p className="text-xs text-red-400/70 mt-3">
            Jumps directly to an answer — often incorrect on multi-step problems.
          </p>
        </div>

        {/* With CoT */}
        <div
          className="bg-green-900/10 border border-green-500/20 rounded-xl p-4"
          aria-label="Response with chain of thought"
        >
          <p className="text-xs font-semibold text-green-400 uppercase tracking-widest mb-3">
            With CoT ({budget} step{budget !== 1 ? 's' : ''})
          </p>
          <div className="min-h-[100px] space-y-2">
            {visibleSteps.map((step, i) => {
              const isDone = completedSteps.includes(i)
              const isCurrent = currentStepIdx === i

              return (
                <div
                  key={i}
                  className={`text-sm transition-opacity duration-300 ${
                    isDone || isCurrent ? 'opacity-100' : 'opacity-0'
                  }`}
                  aria-hidden={!isDone && !isCurrent}
                >
                  <span className="text-slate-500 text-xs mr-2">{step.label}:</span>
                  {isCurrent && isPlaying ? (
                    <TypingText
                      text={step.text}
                      isPlaying={isPlaying}
                      onDone={handleStepDone}
                    />
                  ) : isDone ? (
                    <span className="text-slate-300">
                      {highlightText(step.text, step.highlights)}
                    </span>
                  ) : null}
                </div>
              )
            })}
          </div>
          {isFinished && (
            <p className="text-xs text-green-400/70 mt-3">
              Correct answer reached through step-by-step reasoning.
            </p>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={handlePlay}
          disabled={isPlaying}
          aria-label="Play chain of thought animation"
          className="px-4 py-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50
            disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium
            transition-colors focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-1"
        >
          {isPlaying ? 'Playing…' : 'Play'}
        </button>
        <button
          onClick={handleReset}
          aria-label="Reset chain of thought animation"
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg
            text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-slate-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-1"
        >
          Reset
        </button>
      </div>
    </div>
  )
}
