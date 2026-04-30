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
const LEGEND_HEIGHT = 24
const LEGEND_MARGIN = 16

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

  const matrix = computeAttentionMatrix(temperature, showCausalMask)

  const svgWidth = LABEL_SIZE + SEQ_LEN * CELL_SIZE + 20
  const svgHeight = LABEL_SIZE + SEQ_LEN * CELL_SIZE + LEGEND_MARGIN + LEGEND_HEIGHT + 20

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const svgEl = d3.select(svg)

    // Color scale: dark navy → violet
    const colorScale = d3.scaleSequential()
      .domain([0, 1])
      .interpolator(d3.interpolateRgb('#1a2235', '#7c3aed'))

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

      // Row/col highlight overlay groups (rendered first so cells appear on top)
      g.append('g').attr('class', 'row-highlight')
      g.append('g').attr('class', 'col-highlight')

      // Column labels (Key tokens) at top
      g.selectAll('text.col-label')
        .data(TOKENS)
        .enter()
        .append('text')
        .attr('class', 'col-label')
        .attr('x', (_, i) => LABEL_SIZE + i * CELL_SIZE + CELL_SIZE / 2)
        .attr('y', LABEL_SIZE - 8)
        .attr('text-anchor', 'middle')
        .attr('font-size', '11px')
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
        .attr('font-size', '11px')
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

    // Row/col highlight rectangles (invisible by default)
    const rowHighlightG = g.select<SVGGElement>('g.row-highlight')
    const colHighlightG = g.select<SVGGElement>('g.col-highlight')

    if (rowHighlightG.select('rect.row-hl').empty()) {
      rowHighlightG.append('rect').attr('class', 'row-hl')
        .attr('width', SEQ_LEN * CELL_SIZE)
        .attr('height', CELL_SIZE)
        .attr('x', LABEL_SIZE)
        .attr('fill', 'rgba(124,58,237,0.08)')
        .attr('pointer-events', 'none')
        .attr('opacity', 0)
    }
    if (colHighlightG.select('rect.col-hl').empty()) {
      colHighlightG.append('rect').attr('class', 'col-hl')
        .attr('width', CELL_SIZE)
        .attr('height', SEQ_LEN * CELL_SIZE)
        .attr('y', LABEL_SIZE)
        .attr('fill', 'rgba(124,58,237,0.08)')
        .attr('pointer-events', 'none')
        .attr('opacity', 0)
    }

    // Cells
    const rectG = g.selectAll<SVGRectElement, (typeof cells)[0]>('rect.attn-cell').data(cells)

    const allRects = rectG
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
      .on('mouseover', function (_, d) {
        rowHighlightG.select('rect.row-hl')
          .attr('y', LABEL_SIZE + d.row * CELL_SIZE)
          .attr('opacity', 1)
        colHighlightG.select('rect.col-hl')
          .attr('x', LABEL_SIZE + d.col * CELL_SIZE)
          .attr('opacity', 1)
      })
      .on('mouseout', function () {
        rowHighlightG.select('rect.row-hl').attr('opacity', 0)
        colHighlightG.select('rect.col-hl').attr('opacity', 0)
      })
      .merge(rectG)

    allRects
      .attr('x', (d) => LABEL_SIZE + d.col * CELL_SIZE + 1)
      .attr('y', (d) => LABEL_SIZE + d.row * CELL_SIZE + 1)
      .classed('attn-cell-hot', (d) => !showCausalMask || d.col <= d.row ? d.value > 0.4 : false)
      .transition()
      .duration(400)
      .ease(d3.easeCubicOut)
      .attr('fill', (d) =>
        showCausalMask && d.col > d.row ? '#0d1117' : colorScale(d.value)
      )

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
    const valueText = g
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
        return d.value > 0.12 ? 1 : 0
      })
      .text((d) => (d.value > 0.12 ? d.value.toFixed(2) : ''))

    valueText.exit().remove()
  }, [matrix, showCausalMask])

  const temperatureHint = getTemperatureHint(temperature)

  return (
    <div className="space-y-5">
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
          style={{ minWidth: 320, background: 'transparent' }}
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
