import { useState } from 'react'
import { runBPESteps } from '../../utils/bpe'
import type { MergeRule } from '../../utils/bpe'

const CORPUS = 'the cat sat on the mat the cat sat'
const MAX_STEPS = 8

const { steps: ALL_STEPS } = runBPESteps(CORPUS, MAX_STEPS)

function getTokensAfterSteps(numSteps: number): string[] {
  const { finalTokens } = runBPESteps(CORPUS, numSteps)
  return finalTokens
}

const CHIP_COLORS = [
  'bg-indigo-500/20 border-indigo-500/40 text-indigo-300',
  'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
  'bg-amber-500/20 border-amber-500/40 text-amber-300',
  'bg-rose-500/20 border-rose-500/40 text-rose-300',
  'bg-cyan-500/20 border-cyan-500/40 text-cyan-300',
  'bg-purple-500/20 border-purple-500/40 text-purple-300',
  'bg-orange-500/20 border-orange-500/40 text-orange-300',
  'bg-teal-500/20 border-teal-500/40 text-teal-300',
]

function getChipColor(token: string, mergeRule: MergeRule | undefined): string {
  if (mergeRule && token === mergeRule.merged) {
    return 'bg-indigo-500/40 border-indigo-400/70 text-indigo-200 ring-1 ring-indigo-400/50'
  }
  const hash = token.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return CHIP_COLORS[hash % CHIP_COLORS.length] ?? CHIP_COLORS[0]!
}

export default function BPEVisualizer() {
  const [stepIndex, setStepIndex] = useState(0)

  const currentTokens = getTokensAfterSteps(stepIndex)
  const currentRule: MergeRule | undefined = ALL_STEPS[stepIndex - 1]
  const canAdvance = stepIndex < Math.min(MAX_STEPS, ALL_STEPS.length)

  const handleNext = () => {
    if (canAdvance) setStepIndex((s) => s + 1)
  }

  const handleReset = () => setStepIndex(0)

  return (
    <div className="space-y-6">
      {/* Token sequence */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-300">
            Current token sequence
          </span>
          <span className="text-xs text-slate-500 font-mono">
            {currentTokens.length} tokens
          </span>
        </div>
        <div
          className="flex flex-wrap gap-1.5 p-3 bg-slate-800/60 rounded-lg min-h-[56px]"
          role="list"
          aria-label="Current token sequence"
        >
          {currentTokens.map((token, i) => (
            <span
              key={i}
              role="listitem"
              className={`px-2 py-0.5 text-xs font-mono rounded border transition-all duration-300 ${getChipColor(token, currentRule)}`}
            >
              {token === 'Ġ' ? '⎵' : token}
            </span>
          ))}
        </div>
      </div>

      {/* Step history */}
      <div>
        <h4 className="text-sm font-medium text-slate-300 mb-3">
          Merge history ({stepIndex} / {Math.min(MAX_STEPS, ALL_STEPS.length)} steps)
        </h4>
        {stepIndex === 0 ? (
          <p className="text-slate-500 text-sm italic">
            Press &ldquo;Next Step&rdquo; to begin merging tokens.
          </p>
        ) : (
          <ol className="space-y-2" aria-label="BPE merge steps">
            {ALL_STEPS.slice(0, stepIndex).map((rule, i) => (
              <li
                key={i}
                className={`flex items-center gap-3 p-2.5 rounded-lg text-sm transition-all ${
                  i === stepIndex - 1
                    ? 'bg-indigo-500/15 border border-indigo-500/30'
                    : 'bg-slate-800/40'
                }`}
              >
                <span className="text-slate-500 font-mono text-xs w-5 flex-shrink-0">
                  {i + 1}.
                </span>
                <span className="text-slate-400">Merge</span>
                <span className="font-mono text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded text-xs">
                  &apos;{rule.pair[0]}&apos;
                </span>
                <span className="text-slate-500">+</span>
                <span className="font-mono text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded text-xs">
                  &apos;{rule.pair[1]}&apos;
                </span>
                <span className="text-slate-400">&#x2192;</span>
                <span className="font-mono text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded text-xs font-semibold">
                  &apos;{rule.merged}&apos;
                </span>
                <span className="text-slate-500 ml-auto text-xs">
                  freq: {rule.frequency}
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleNext}
          disabled={!canAdvance}
          aria-label="Advance to next BPE merge step"
          className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-500/20 border border-indigo-500/40
            text-indigo-300 hover:bg-indigo-500/30 hover:border-indigo-400/60
            disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next Step →
        </button>
        <button
          onClick={handleReset}
          aria-label="Reset BPE visualizer to start"
          className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-800 border border-slate-700
            text-slate-400 hover:border-slate-500 transition-colors"
        >
          Reset
        </button>
        {!canAdvance && (
          <span className="text-xs text-emerald-400 ml-2">
            All {Math.min(MAX_STEPS, ALL_STEPS.length)} merges complete
          </span>
        )}
      </div>

      <p className="text-xs text-slate-500">
        Corpus: <span className="font-mono text-slate-400">&ldquo;{CORPUS}&rdquo;</span>
      </p>
    </div>
  )
}
