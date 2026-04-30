import { useState } from 'react'
import { causalMask } from '../../utils/mathHelpers'

const TOKENS = ['The', 'cat', 'sat', 'on', 'the', 'mat']
const SEQ_LEN = TOKENS.length

export default function CausalMask() {
  const [currentPos, setCurrentPos] = useState(0)

  const mask = causalMask(SEQ_LEN)
  const canAdvance = currentPos < SEQ_LEN - 1

  const handleNext = () => {
    if (canAdvance) setCurrentPos((p) => p + 1)
  }

  const handleReset = () => setCurrentPos(0)

  return (
    <div className="space-y-6">
      <p className="text-slate-400 text-sm leading-relaxed">
        During generation, each token can only attend to itself and earlier tokens.
        Blue cells are allowed; gray cells are masked out (set to −∞ before softmax).
      </p>

      {/* Grid */}
      <div
        className="overflow-x-auto"
        role="img"
        aria-label="Causal attention mask grid"
      >
        <div className="inline-block min-w-max">
          {/* Column headers */}
          <div className="flex ml-16 mb-1">
            {TOKENS.map((t, ci) => (
              <div
                key={ci}
                className={`w-12 text-center text-xs font-mono transition-colors ${
                  ci <= currentPos ? 'text-indigo-300' : 'text-slate-600'
                }`}
              >
                {t}
              </div>
            ))}
          </div>

          {/* Rows */}
          {TOKENS.map((rowToken, ri) => (
            <div key={ri} className="flex items-center mb-1">
              {/* Row label */}
              <div
                className={`w-16 text-right pr-2 text-xs font-mono flex-shrink-0 transition-colors ${
                  ri === currentPos
                    ? 'text-amber-300 font-semibold'
                    : ri < currentPos
                    ? 'text-slate-400'
                    : 'text-slate-600'
                }`}
              >
                {rowToken}
              </div>

              {/* Cells */}
              {TOKENS.map((_, ci) => {
                const allowed = mask[ri]![ci] === true
                const isCurrentRow = ri === currentPos
                const isPastRow = ri < currentPos

                const cellStyle =
                  allowed && (isCurrentRow || isPastRow)
                    ? isCurrentRow
                      ? 'bg-indigo-500/50 border-indigo-400/60 text-indigo-200'
                      : 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400'
                    : 'bg-slate-800/60 border-slate-700/40 text-slate-600'

                return (
                  <div
                    key={ci}
                    className={`w-12 h-10 flex items-center justify-center text-xs rounded border mx-0.5 transition-all duration-300 ${cellStyle}`}
                    role="cell"
                    aria-label={
                      allowed && (isCurrentRow || isPastRow)
                        ? `Allowed: ${rowToken} attends to ${TOKENS[ci]}`
                        : `Masked: ${rowToken} cannot attend to ${TOKENS[ci]}`
                    }
                  >
                    {allowed && (isCurrentRow || isPastRow) ? (
                      <span className="font-mono text-xs">
                        {(1 / (ci + 1)).toFixed(2).slice(1)}
                      </span>
                    ) : (
                      <span className="text-slate-600 text-xs">✕</span>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Generation status */}
      <div className="p-3 bg-slate-800/60 rounded-lg border border-slate-700/40">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-slate-500">Generating token at position:</span>
          <span className="text-sm font-mono font-semibold text-amber-300">
            {currentPos} — &ldquo;{TOKENS[currentPos]}&rdquo;
          </span>
        </div>
        <p className="text-xs text-slate-500">
          Can attend to:{' '}
          <span className="font-mono text-indigo-300">
            {TOKENS.slice(0, currentPos + 1).map((t) => `"${t}"`).join(', ')}
          </span>
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleNext}
          disabled={!canAdvance}
          aria-label="Advance to next token position"
          className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-500/20 border border-indigo-500/40
            text-indigo-300 hover:bg-indigo-500/30 hover:border-indigo-400/60
            disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next token →
        </button>
        <button
          onClick={handleReset}
          aria-label="Reset causal mask animation"
          className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-800 border border-slate-700
            text-slate-400 hover:border-slate-500 transition-colors"
        >
          Reset
        </button>
        {!canAdvance && (
          <span className="text-xs text-emerald-400">Full sequence generated</span>
        )}
      </div>
    </div>
  )
}
