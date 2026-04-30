import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { attentionWeights, causalMask } from '../../utils/mathHelpers'
import Slider from '../../components/Slider'

const TOKENS = ['The', 'cat', 'sat', 'on', 'the', 'mat']
const SEQ_LEN = TOKENS.length

// Pre-set Q/K vectors (3D) per token — crafted to produce interesting attention patterns
const Q_VECTORS: number[][] = [
  [0.8, 0.3, -0.2],
  [0.4, 0.9, 0.1],
  [0.1, 0.5, 0.8],
  [-0.3, 0.2, 0.7],
  [0.7, 0.4, -0.1],
  [0.2, 0.6, 0.5],
]

const K_VECTORS: number[][] = [
  [0.6, 0.2, -0.1],
  [0.3, 0.8, 0.2],
  [0.1, 0.4, 0.9],
  [-0.2, 0.3, 0.6],
  [0.8, 0.3, 0.0],
  [0.1, 0.7, 0.4],
]

const CELL_SIZE = 56
const LABEL_SIZE = 48
const FONT_SIZE = 11

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

export default function AttentionMatrix() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [temperature, setTemperature] = useState(1.0)
  const [useCausalMask, setUseCausalMask] = useState(false)

  const matrix = computeAttentionMatrix(temperature, useCausalMask)

  const svgWidth = LABEL_SIZE + SEQ_LEN * CELL_SIZE + 20
  const svgHeight = LABEL_SIZE + SEQ_LEN * CELL_SIZE + 20

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const svgEl = d3.select(svg)

    const colorScale = d3.scaleSequential(d3.interpolateBlues).domain([0, 1])

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

      // Column labels (Key tokens) at top
      g.selectAll('text.col-label')
        .data(TOKENS)
        .enter()
        .append('text')
        .attr('class', 'col-label')
        .attr('x', (_, i) => LABEL_SIZE + i * CELL_SIZE + CELL_SIZE / 2)
        .attr('y', LABEL_SIZE - 8)
        .attr('text-anchor', 'middle')
        .attr('font-size', FONT_SIZE)
        .attr('fill', '#94a3b8')
        .attr('font-family', 'ui-monospace, monospace')
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
        .attr('font-size', FONT_SIZE)
        .attr('fill', '#94a3b8')
        .attr('font-family', 'ui-monospace, monospace')
        .text((d) => d)

      // Axis labels
      g.append('text')
        .attr('x', LABEL_SIZE + (SEQ_LEN * CELL_SIZE) / 2)
        .attr('y', 12)
        .attr('text-anchor', 'middle')
        .attr('font-size', 10)
        .attr('fill', '#64748b')
        .text('Key (attending to →)')

      g.append('text')
        .attr('transform', `rotate(-90)`)
        .attr('x', -(LABEL_SIZE + (SEQ_LEN * CELL_SIZE) / 2))
        .attr('y', 12)
        .attr('text-anchor', 'middle')
        .attr('font-size', 10)
        .attr('fill', '#64748b')
        .text('Query (from ↓)')
    }

    // Cells
    const rectG = g.selectAll<SVGRectElement, typeof cells[0]>('rect.attn-cell').data(cells)

    rectG
      .enter()
      .append('rect')
      .attr('class', 'attn-cell')
      .attr('x', (d) => LABEL_SIZE + d.col * CELL_SIZE)
      .attr('y', (d) => LABEL_SIZE + d.row * CELL_SIZE)
      .attr('width', CELL_SIZE - 2)
      .attr('height', CELL_SIZE - 2)
      .attr('rx', 3)
      .merge(rectG)
      .transition()
      .duration(250)
      .ease(d3.easeCubicOut)
      .attr('fill', (d) =>
        useCausalMask && d.col > d.row ? '#1e293b' : colorScale(d.value)
      )

    rectG.exit().remove()

    // Masked overlay (X mark)
    const maskedCells = cells.filter((d) => useCausalMask && d.col > d.row)
    const maskedText = g
      .selectAll<SVGTextElement, typeof cells[0]>('text.masked-x')
      .data(maskedCells, (d) => `${d.row}-${d.col}`)

    maskedText
      .enter()
      .append('text')
      .attr('class', 'masked-x')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', 14)
      .attr('fill', '#475569')
      .merge(maskedText)
      .attr('x', (d) => LABEL_SIZE + d.col * CELL_SIZE + (CELL_SIZE - 2) / 2)
      .attr('y', (d) => LABEL_SIZE + d.row * CELL_SIZE + (CELL_SIZE - 2) / 2)
      .text('✕')

    maskedText.exit().remove()

    // Value text labels
    const valueText = g
      .selectAll<SVGTextElement, typeof cells[0]>('text.attn-value')
      .data(cells)

    valueText
      .enter()
      .append('text')
      .attr('class', 'attn-value')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', 9)
      .attr('font-family', 'ui-monospace, monospace')
      .merge(valueText)
      .attr('x', (d) => LABEL_SIZE + d.col * CELL_SIZE + (CELL_SIZE - 2) / 2)
      .attr('y', (d) => LABEL_SIZE + d.row * CELL_SIZE + (CELL_SIZE - 2) / 2)
      .attr('fill', (d) => (d.value > 0.5 ? '#1e3a5f' : '#94a3b8'))
      .attr('display', (d) =>
        !useCausalMask || d.col <= d.row ? 'block' : 'none'
      )
      .text((d) => (d.value > 0.1 ? d.value.toFixed(2) : ''))
  }, [matrix, useCausalMask])

  return (
    <div className="space-y-5">
      {/* Causal mask toggle */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="causal-mask-toggle"
          checked={useCausalMask}
          onChange={(e) => setUseCausalMask(e.target.checked)}
          aria-label="Toggle causal mask"
          className="w-4 h-4 accent-indigo-500 cursor-pointer"
        />
        <label
          htmlFor="causal-mask-toggle"
          className="text-sm font-medium text-slate-300 cursor-pointer select-none"
        >
          Apply causal mask
        </label>
        {useCausalMask && (
          <span className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
            Autoregressive mode
          </span>
        )}
      </div>

      {/* SVG heatmap */}
      <div
        className="w-full overflow-x-auto"
        role="img"
        aria-label="Self-attention weight heatmap for a 6-token sequence"
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          width="100%"
          style={{ minWidth: 320 }}
          aria-hidden="true"
        />
      </div>

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

      <p className="text-xs text-slate-500 leading-relaxed">
        Darker blue = stronger attention. Cells show weight values when &gt; 0.1.
        Lower temperature sharpens the distribution; higher temperature makes it more uniform.
        {useCausalMask && ' Gray ✕ cells are masked (future positions).'}
      </p>
    </div>
  )
}
