import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { attentionWeights, causalMask } from '../../utils/mathHelpers'
import Slider from '../../components/Slider'

// Anchor sentence: "The cat sat on the mat because it was [tired]"
const TOKENS = ['The', 'cat', 'sat', 'on', 'the', 'mat', 'because', 'it', 'was']
const SEQ_LEN = TOKENS.length

// Pre-set Q/K vectors (4D) per token — crafted to produce interesting attention patterns.
// Key design: 'it' (index 7) has dim-1 dominant, matching 'cat' (index 1) key,
// so attentionWeights(Q_VECTORS[7], K_VECTORS, 1.0) gives index 1 ('cat') the highest weight.
const Q_VECTORS: number[][] = [
  [1.0, 0.1, 0.1, 0.1],  // The   - article (dim 0)
  [0.1, 1.0, 0.2, 0.1],  // cat   - subject (dim 1, hint of dim 2)
  [0.1, 0.2, 1.0, 0.1],  // sat   - verb (dim 2)
  [0.1, 0.1, 0.3, 0.9],  // on    - preposition (dim 3)
  [0.9, 0.2, 0.1, 0.1],  // the   - article (similar to The, dim 0)
  [0.3, 0.7, 0.2, 0.3],  // mat   - object (mix dim 1+3)
  [0.1, 0.2, 0.5, 0.8],  // because - connector (dim 2+3)
  [0.2, 0.9, 0.1, 0.2],  // it    - pronoun (dim 1, slightly different from cat → attends to cat)
  [0.2, 0.1, 0.8, 0.4],  // was   - verb (dim 2 mix)
]

// K_VECTORS same as Q (self-attention)
const K_VECTORS = Q_VECTORS

const CELL_SIZE = 52
const LABEL_SIZE = 52
const LEGEND_HEIGHT = 24
const LEGEND_MARGIN = 16
const LEFT_MARGIN = LABEL_SIZE
const TOP_MARGIN = LABEL_SIZE

// Unified color scale — same as MultiHeadViz for consistent reading
const COLOR_SCALE = (v: number) =>
  d3.interpolateRgb('#1a2235', '#7c3aed')(v)

function computeAttentionMatrix(temperature: number, useCausalMask: boolean): number[][] {
  const mask = causalMask(SEQ_LEN)
  return Q_VECTORS.map((q, i) => {
    const rawWeights = attentionWeights(q, K_VECTORS, temperature)
    if (!useCausalMask) return rawWeights
    // Apply causal mask: zero out future positions then renormalize
    const masked = rawWeights.map((w, j) => (mask[i]![j] ? w : 0))
    const sum = masked.reduce((a, b) => a + b, 0)
    return sum === 0 ? masked : masked.map((w) => w / sum)
  })
}

function getTemperatureHint(temperature: number): string {
  if (temperature < 0.5) return 'High confidence — model has strong preferences'
  if (temperature <= 1.5) return 'Balanced — natural attention distribution'
  return 'High entropy — model attends broadly'
}

export default function AttentionMatrix() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [temperature, setTemperature] = useState(1.0)
  const [showCausalMask, setShowCausalMask] = useState(false)
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)
  const hasAnimated = useRef(false)

  const matrix = computeAttentionMatrix(temperature, showCausalMask)

  const svgWidth = LABEL_SIZE + SEQ_LEN * CELL_SIZE + 20
  const svgHeight = LABEL_SIZE + SEQ_LEN * CELL_SIZE + LEGEND_MARGIN + LEGEND_HEIGHT + 20

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const svgEl = d3.select(svg)

    const colorScale = d3.scaleSequential()
      .domain([0, 1])
      .interpolator(COLOR_SCALE)

    // Flatten matrix for data binding
    const cells: Array<{ row: number; col: number; value: number }> = []
    for (let r = 0; r < SEQ_LEN; r++) {
      for (let c = 0; c < SEQ_LEN; c++) {
        cells.push({ row: r, col: c, value: matrix[r]![c] ?? 0 })
      }
    }

    let g = svgEl.select<SVGGElement>('g.matrix-root')
    if (g.empty()) {
      g = svgEl.append('g').attr('class', 'matrix-root')

      // SVG defs for legend gradient
      const defs = svgEl.append('defs')
      const legendGrad = defs.append('linearGradient')
        .attr('id', 'attn-legend-gradient')
        .attr('x1', '0%').attr('y1', '0%')
        .attr('x2', '100%').attr('y2', '0%')
      legendGrad.append('stop').attr('offset', '0%').attr('stop-color', '#1a2235')
      legendGrad.append('stop').attr('offset', '100%').attr('stop-color', '#7c3aed')

      // Column labels (Key tokens) at top
      g.selectAll('text.col-label')
        .data(TOKENS)
        .enter()
        .append('text')
        .attr('class', 'col-label')
        .attr('x', (_, i) => LABEL_SIZE + i * CELL_SIZE + CELL_SIZE / 2)
        .attr('y', LABEL_SIZE - 8)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('fill', '#c8d3e8')
        .attr('font-weight', '500')
        .attr('font-family', 'JetBrains Mono, ui-monospace, monospace')
        .text((d) => d)

      // Row labels (Query tokens) at left
      g.selectAll('text.row-label')
        .data(TOKENS)
        .enter()
        .append('text')
        .attr('class', 'row-label')
        .attr('x', LABEL_SIZE - 6)
        .attr('y', (_, i) => LABEL_SIZE + i * CELL_SIZE + CELL_SIZE / 2)
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '10px')
        .attr('fill', '#c8d3e8')
        .attr('font-weight', '500')
        .attr('font-family', 'JetBrains Mono, ui-monospace, monospace')
        .text((d) => d)

      // Axis labels
      g.append('text')
        .attr('x', LABEL_SIZE + (SEQ_LEN * CELL_SIZE) / 2)
        .attr('y', 12)
        .attr('text-anchor', 'middle')
        .attr('font-size', 10)
        .attr('fill', '#7a8daa')
        .text('Key (attending to →)')

      g.append('text')
        .attr('transform', `rotate(-90)`)
        .attr('x', -(LABEL_SIZE + (SEQ_LEN * CELL_SIZE) / 2))
        .attr('y', 12)
        .attr('text-anchor', 'middle')
        .attr('font-size', 10)
        .attr('fill', '#7a8daa')
        .text('Query (from ↓)')

      // Legend bar
      const legendY = LABEL_SIZE + SEQ_LEN * CELL_SIZE + LEGEND_MARGIN
      const legendX = LABEL_SIZE
      const legendW = SEQ_LEN * CELL_SIZE
      g.append('rect')
        .attr('x', legendX)
        .attr('y', legendY)
        .attr('width', legendW)
        .attr('height', LEGEND_HEIGHT - 8)
        .attr('rx', 3)
        .attr('fill', 'url(#attn-legend-gradient)')
        .attr('opacity', 0.8)
      g.append('text')
        .attr('x', legendX)
        .attr('y', legendY + LEGEND_HEIGHT)
        .attr('font-size', 9)
        .attr('fill', '#7a8daa')
        .attr('font-family', 'JetBrains Mono, ui-monospace, monospace')
        .text('Low')
      g.append('text')
        .attr('x', legendX + legendW)
        .attr('y', legendY + LEGEND_HEIGHT)
        .attr('font-size', 9)
        .attr('fill', '#7a8daa')
        .attr('font-family', 'JetBrains Mono, ui-monospace, monospace')
        .attr('text-anchor', 'end')
        .text('High')
    }

    // Cells — use D3 enter/update pattern
    const rectG = svgEl.select('g.matrix-root')
      .selectAll<SVGRectElement, (typeof cells)[0]>('rect.attn-cell')
      .data(cells)

    const entered = rectG
      .enter()
      .append('rect')
      .attr('class', 'attn-cell')
      .attr('x', (d) => LABEL_SIZE + d.col * CELL_SIZE + 1)
      .attr('y', (d) => LABEL_SIZE + d.row * CELL_SIZE + 1)
      .attr('width', CELL_SIZE - 2)
      .attr('height', CELL_SIZE - 2)
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('stroke', 'rgba(255,255,255,0.03)')
      .attr('stroke-width', 0.5)
      .attr('fill', '#1a2235')

    const allRects = entered.merge(rectG)

    allRects
      .attr('x', (d) => LABEL_SIZE + d.col * CELL_SIZE + 1)
      .attr('y', (d) => LABEL_SIZE + d.row * CELL_SIZE + 1)
      .transition()
      .duration(400)
      .ease(d3.easeCubicOut)
      .attr('fill', (d) =>
        showCausalMask && d.col > d.row ? '#0d1117' : colorScale(d.value)
      )
      .attr('opacity', (d) => {
        if (hoveredRow === null) return 1
        return d.row === hoveredRow ? 1 : 0.25
      })

    rectG.exit().remove()

    // Remove old masked text/lines
    g.selectAll('text.masked-x').remove()
    g.selectAll('line.masked-line').remove()

    // Masked X pattern: two diagonal SVG lines
    if (showCausalMask) {
      const maskedCells = cells.filter((d) => d.col > d.row)
      maskedCells.forEach((d) => {
        const x0 = LABEL_SIZE + d.col * CELL_SIZE + 3
        const y0 = LABEL_SIZE + d.row * CELL_SIZE + 3
        const x1 = LABEL_SIZE + (d.col + 1) * CELL_SIZE - 3
        const y1 = LABEL_SIZE + (d.row + 1) * CELL_SIZE - 3
        g.append('line').attr('class', 'masked-line')
          .attr('x1', x0).attr('y1', y0)
          .attr('x2', x1).attr('y2', y1)
          .attr('stroke', '#f43f5e')
          .attr('stroke-opacity', 0.35)
          .attr('stroke-width', 1)
          .attr('pointer-events', 'none')
        g.append('line').attr('class', 'masked-line')
          .attr('x1', x1).attr('y1', y0)
          .attr('x2', x0).attr('y2', y1)
          .attr('stroke', '#f43f5e')
          .attr('stroke-opacity', 0.35)
          .attr('stroke-width', 1)
          .attr('pointer-events', 'none')
      })
    }

    // Value text labels
    const valueText = svgEl.select('g.matrix-root')
      .selectAll<SVGTextElement, (typeof cells)[0]>('text.attn-value')
      .data(cells)

    const allText = valueText
      .enter()
      .append('text')
      .attr('class', 'attn-value')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '9px')
      .attr('font-family', 'JetBrains Mono, ui-monospace, monospace')
      .attr('pointer-events', 'none')
      .merge(valueText)

    allText
      .attr('x', (d) => LABEL_SIZE + d.col * CELL_SIZE + (CELL_SIZE - 2) / 2)
      .attr('y', (d) => LABEL_SIZE + d.row * CELL_SIZE + (CELL_SIZE - 2) / 2)
      .attr('fill', 'rgba(255,255,255,0.7)')
      .transition()
      .duration(400)
      .ease(d3.easeCubicOut)
      .attr('opacity', (d) => {
        const isMasked = showCausalMask && d.col > d.row
        if (isMasked) return 0
        if (hoveredRow !== null && d.row !== hoveredRow) return 0
        return d.value > 0.12 ? 1 : 0
      })
      .text((d) => (d.value > 0.12 ? d.value.toFixed(2) : ''))

    valueText.exit().remove()

    // First-mount reveal animation using D3 transitions (GSAP not installed)
    if (!hasAnimated.current) {
      hasAnimated.current = true
      svgEl.selectAll<SVGRectElement, (typeof cells)[0]>('rect.attn-cell')
        .attr('opacity', 0)
        .attr('transform', 'scale(0.85)')
        .transition()
        .duration(400)
        .delay((_, i) => {
          // Stagger from center
          const row = Math.floor(i / SEQ_LEN)
          const col = i % SEQ_LEN
          const centerRow = (SEQ_LEN - 1) / 2
          const centerCol = (SEQ_LEN - 1) / 2
          const dist = Math.abs(row - centerRow) + Math.abs(col - centerCol)
          return dist * 30
        })
        .ease(d3.easeBackOut.overshoot(1.4))
        .attr('opacity', 1)
        .attr('transform', 'scale(1)')
    }
  }, [matrix, showCausalMask, hoveredRow])

  const temperatureHint = getTemperatureHint(temperature)

  return (
    <div className="space-y-5">
      {/* Hover callout label */}
      {hoveredRow !== null ? (
        <div className="text-sm text-center mb-3 transition-all duration-150">
          <span className="text-ink-2">Token </span>
          <span className="font-mono text-violet-300 font-semibold">
            &ldquo;{TOKENS[hoveredRow]}&rdquo;
          </span>
          <span className="text-ink-2"> attends to each position &rarr;</span>
        </div>
      ) : (
        <p className="text-xs text-ink-3 text-center mb-3">
          Hover any token row to see its attention pattern
        </p>
      )}

      {/* Causal mask toggle */}
      <div className="flex items-center gap-3">
        <button
          role="switch"
          aria-checked={showCausalMask}
          onClick={() => setShowCausalMask(v => !v)}
          className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${
            showCausalMask ? 'bg-violet-600' : 'bg-surface-3'
          }`}
        >
          <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
            showCausalMask ? 'translate-x-5' : 'translate-x-0'
          }`} />
        </button>
        <label
          className="text-sm font-medium text-ink-1 cursor-pointer select-none"
          onClick={() => setShowCausalMask(v => !v)}
        >
          Apply causal mask
        </label>
        {showCausalMask && (
          <span className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
            Autoregressive mode
          </span>
        )}
      </div>

      {/* SVG heatmap with React hover overlay */}
      <div
        className="w-full overflow-x-auto"
        role="img"
        aria-label="Self-attention weight heatmap for a 9-token sentence: The cat sat on the mat because it was"
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          width="100%"
          style={{ minWidth: 380, background: 'transparent' }}
          aria-hidden="true"
        >
          {/* Transparent row-capture overlays for hover — React synthetic events on SVG rects */}
          {TOKENS.map((_, rowIdx) => (
            <rect
              key={rowIdx}
              x={LEFT_MARGIN}
              y={TOP_MARGIN + rowIdx * CELL_SIZE}
              width={TOKENS.length * CELL_SIZE}
              height={CELL_SIZE}
              fill="transparent"
              onMouseEnter={() => setHoveredRow(rowIdx)}
              onMouseLeave={() => setHoveredRow(null)}
              style={{ cursor: 'crosshair' }}
            />
          ))}
        </svg>
      </div>

      {/* Coreference callout for "it" */}
      {hoveredRow === 7 && (
        <p className="text-cyan-400 text-xs font-mono text-center leading-relaxed">
          &ldquo;it&rdquo; attends most strongly to &ldquo;cat&rdquo; &mdash; this is coreference resolution. The model learns that &ldquo;it&rdquo; refers to the cat.
        </p>
      )}

      {/* Temperature slider */}
      <Slider
        label="Temperature"
        value={temperature}
        onChange={setTemperature}
        min={0.1}
        max={3.0}
        step={0.05}
        formatValue={(v) => v.toFixed(2)}
      />

      {/* Temperature effect indicator */}
      <p className="text-cyan-400 text-xs font-mono text-center mt-3">
        {temperatureHint}
      </p>

      <p className="text-xs text-ink-3 leading-relaxed">
        Darker violet = stronger attention. Cells show weight values when &gt; 0.12.
        Lower temperature sharpens the distribution; higher temperature makes it more uniform.
        {showCausalMask && ' Red ✕ cells are masked (future positions).'}
      </p>
    </div>
  )
}
