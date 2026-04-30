import * as d3 from 'd3'

// First 5 tokens of the anchor sentence: "The cat sat on the mat because it was [tired]"
const TOKENS = ['The', 'cat', 'sat', 'on', 'the']

interface HeadConfig {
  name: string
  description: string
  label: string
  // 5x5 attention weights (rows = queries, cols = keys)
  weights: number[][]
}

// Unified color scale — same vocabulary as AttentionMatrix for consistent reading
const COLOR_SCALE = (v: number) =>
  d3.interpolateRgb('#1a2235', '#7c3aed')(v)

const HEADS: HeadConfig[] = [
  {
    name: 'Head 1',
    description: 'Local attention',
    label: 'Each token attends to its nearest neighbors',
    // Diagonal-ish: strong self + adjacent
    weights: [
      [0.65, 0.25, 0.06, 0.02, 0.02],  // The  → The, cat
      [0.20, 0.55, 0.18, 0.05, 0.02],  // cat  → cat, sat
      [0.05, 0.18, 0.55, 0.17, 0.05],  // sat  → sat, on
      [0.03, 0.06, 0.20, 0.56, 0.15],  // on   → on, the
      [0.02, 0.03, 0.07, 0.23, 0.65],  // the  → the, on
    ],
  },
  {
    name: 'Head 2',
    description: 'Subject tracking',
    label: '"cat" attends to itself strongly across positions',
    // cat column is consistently attended
    weights: [
      [0.25, 0.45, 0.15, 0.10, 0.05],  // The     → cat
      [0.10, 0.65, 0.10, 0.10, 0.05],  // cat     → cat (self)
      [0.10, 0.50, 0.25, 0.10, 0.05],  // sat     → cat (subject of verb)
      [0.15, 0.40, 0.20, 0.15, 0.10],  // on      → cat
      [0.20, 0.45, 0.15, 0.12, 0.08],  // the     → cat
    ],
  },
  {
    name: 'Head 3',
    description: 'Syntactic',
    label: '"sat" attends to "cat" — verb tracks its subject',
    // sat→cat is the strongest off-diagonal weight
    weights: [
      [0.55, 0.20, 0.12, 0.08, 0.05],  // The     → The
      [0.25, 0.50, 0.12, 0.08, 0.05],  // cat     → cat
      [0.15, 0.55, 0.20, 0.07, 0.03],  // sat     → cat (verb→subject)
      [0.10, 0.20, 0.35, 0.25, 0.10],  // on      → sat (prep→verb)
      [0.30, 0.35, 0.15, 0.12, 0.08],  // the     → The/cat
    ],
  },
  {
    name: 'Head 4',
    description: 'Positional',
    label: 'Every token attends strongly to position 0 ("The")',
    // Column 0 (The) receives highest weight from all rows
    weights: [
      [0.60, 0.15, 0.10, 0.10, 0.05],  // The  → The (self + position 0)
      [0.50, 0.25, 0.12, 0.08, 0.05],  // cat  → The
      [0.48, 0.18, 0.20, 0.09, 0.05],  // sat  → The
      [0.45, 0.20, 0.15, 0.14, 0.06],  // on   → The
      [0.55, 0.20, 0.12, 0.08, 0.05],  // the  → The
    ],
  },
]

function getCellBg(value: number): string {
  return COLOR_SCALE(value)
}

function MiniHeatmap({ head }: { head: HeadConfig }) {
  return (
    <div
      className="p-4 rounded-xl border border-violet-500/20 bg-slate-900/50"
      role="region"
      aria-label={`${head.name}: ${head.description}`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-violet-300">{head.name}</span>
        <span className="text-xs text-ink-3">{head.description}</span>
      </div>
      <p className="text-xs text-ink-3 italic mb-3" style={{ fontSize: 10 }}>{head.label}</p>

      {/* Column headers */}
      <div className="flex mb-1 ml-8">
        {TOKENS.map((t) => (
          <div
            key={t}
            className="flex-1 text-center font-mono text-ink-3"
            style={{ fontSize: 10 }}
          >
            {t}
          </div>
        ))}
      </div>

      {/* Grid */}
      {head.weights.map((row, ri) => (
        <div key={ri} className="flex items-center gap-0.5 mb-0.5">
          {/* Row label */}
          <div className="w-8 font-mono text-ink-3 text-right pr-1 flex-shrink-0" style={{ fontSize: 10 }}>
            {TOKENS[ri]}
          </div>
          {row.map((val, ci) => (
            <div
              key={ci}
              className="flex-1 h-7 flex items-center justify-center rounded transition-all"
              style={{ backgroundColor: getCellBg(val) }}
              role="cell"
              aria-label={`${TOKENS[ri]} attends to ${TOKENS[ci]}: ${(val * 100).toFixed(0)}%`}
            >
              <span
                className={val > 0.35 ? 'text-white/80' : 'text-ink-3'}
                style={{ fontSize: 9, fontFamily: 'JetBrains Mono, monospace' }}
              >
                {val.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default function MultiHeadViz() {
  return (
    <div className="space-y-4">
      <p className="text-ink-2 text-sm leading-relaxed">
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

      {/* Unified scale legend note */}
      <p className="text-ink-3 text-xs italic text-center">
        All heads use the same color scale: light = low attention, deep violet = high attention
      </p>

      <p className="text-xs text-ink-3 leading-relaxed">
        Darker cells indicate higher attention weight. These patterns are illustrative — real heads
        learn complex, emergent specializations from data.
      </p>
    </div>
  )
}
