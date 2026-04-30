import type { CSSProperties } from 'react'

const TOKENS = ['cat', 'sat', 'on', 'mat']

interface HeadConfig {
  name: string
  description: string
  color: string
  // 4x4 attention weights (rows = queries, cols = keys)
  weights: number[][]
}

const HEADS: HeadConfig[] = [
  {
    name: 'Head 1',
    description: 'Local attention',
    color: 'indigo',
    weights: [
      [0.7, 0.2, 0.07, 0.03],
      [0.15, 0.65, 0.15, 0.05],
      [0.05, 0.2, 0.6, 0.15],
      [0.03, 0.07, 0.25, 0.65],
    ],
  },
  {
    name: 'Head 2',
    description: 'Semantic similarity',
    color: 'emerald',
    weights: [
      [0.4, 0.3, 0.1, 0.2],
      [0.25, 0.35, 0.2, 0.2],
      [0.1, 0.15, 0.45, 0.3],
      [0.15, 0.2, 0.25, 0.4],
    ],
  },
  {
    name: 'Head 3',
    description: 'Subject–verb binding',
    color: 'amber',
    weights: [
      [0.5, 0.4, 0.05, 0.05],
      [0.45, 0.45, 0.05, 0.05],
      [0.15, 0.1, 0.45, 0.3],
      [0.05, 0.1, 0.3, 0.55],
    ],
  },
  {
    name: 'Head 4',
    description: 'Global context',
    color: 'rose',
    weights: [
      [0.28, 0.24, 0.25, 0.23],
      [0.22, 0.3, 0.25, 0.23],
      [0.24, 0.23, 0.27, 0.26],
      [0.25, 0.24, 0.24, 0.27],
    ],
  },
]

const COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
  indigo: { bg: 'bg-indigo-500/20', text: 'text-indigo-300', border: 'border-indigo-500/30' },
  emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/30' },
  amber: { bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/30' },
  rose: { bg: 'bg-rose-500/20', text: 'text-rose-300', border: 'border-rose-500/30' },
}

// Interpolate between light and saturated color based on value
const INTENSITY_BASES: Record<string, string[]> = {
  indigo: ['#1e1b4b10', '#4f46e5'],
  emerald: ['#02250910', '#10b981'],
  amber: ['#2d180010', '#f59e0b'],
  rose: ['#2d000a10', '#f43f5e'],
}

function getCellStyle(value: number, color: string): CSSProperties {
  const [, full] = INTENSITY_BASES[color] ?? ['#00000010', '#6366f1']
  // Interpolate alpha
  const alpha = Math.round(value * 220)
  const hex = alpha.toString(16).padStart(2, '0')
  const fullColor = (full ?? '#6366f1') + hex
  return { backgroundColor: fullColor }
}

function MiniHeatmap({ head }: { head: HeadConfig }) {
  const colors = COLOR_MAP[head.color] ?? COLOR_MAP['indigo']!

  return (
    <div
      className={`p-4 rounded-xl border ${colors.border} bg-slate-900/50`}
      role="region"
      aria-label={`${head.name}: ${head.description}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-semibold ${colors.text}`}>{head.name}</span>
        <span className="text-xs text-slate-500">{head.description}</span>
      </div>

      {/* Column headers */}
      <div className="flex mb-1 ml-8">
        {TOKENS.map((t) => (
          <div
            key={t}
            className="flex-1 text-center text-xs text-slate-600 font-mono"
          >
            {t}
          </div>
        ))}
      </div>

      {/* Grid */}
      {head.weights.map((row, ri) => (
        <div key={ri} className="flex items-center gap-0.5 mb-0.5">
          {/* Row label */}
          <div className="w-8 text-xs text-slate-600 font-mono text-right pr-1 flex-shrink-0">
            {TOKENS[ri]}
          </div>
          {row.map((val, ci) => (
            <div
              key={ci}
              className="flex-1 h-7 flex items-center justify-center rounded text-xs font-mono transition-all"
              style={getCellStyle(val, head.color)}
              role="cell"
              aria-label={`${TOKENS[ri]} attends to ${TOKENS[ci]}: ${(val * 100).toFixed(0)}%`}
            >
              <span
                className={val > 0.3 ? 'text-white/80' : 'text-slate-600'}
                style={{ fontSize: 9 }}
              >
                {val.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      ))}

      <p className="text-xs text-slate-600 mt-2 italic">{head.description}</p>
    </div>
  )
}

export default function MultiHeadViz() {
  return (
    <div className="space-y-4">
      <p className="text-slate-400 text-sm leading-relaxed">
        Each attention head learns a different relationship pattern. The outputs are
        concatenated and projected, letting the model integrate multiple perspectives simultaneously.
      </p>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        role="group"
        aria-label="Multi-head attention patterns"
      >
        {HEADS.map((head) => (
          <MiniHeatmap key={head.name} head={head} />
        ))}
      </div>

      <p className="text-xs text-slate-500 leading-relaxed">
        Darker cells indicate higher attention weight. These patterns are illustrative — real heads
        learn complex, emergent specializations from data.
      </p>
    </div>
  )
}
