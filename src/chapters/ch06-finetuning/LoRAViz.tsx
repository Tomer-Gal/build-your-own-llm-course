import React, { useEffect, useRef, useState, useCallback } from 'react'
import * as d3 from 'd3'
import Slider from '../../components/Slider'

const D = 8 // weight matrix dimension (8x8 for display)

function makeRandomMatrix(rows: number, cols: number): number[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => (Math.random() * 2 - 1) * 0.5)
  )
}

interface MatrixGridProps {
  label: string
  rows: number
  cols: number
  values: number[][]
  colorScale: d3.ScaleSequential<string>
  svgRef: React.RefObject<SVGSVGElement>
}

function MatrixGrid({ label, rows, cols, values, colorScale, svgRef }: MatrixGridProps) {
  const cellSize = 28
  const padding = 4
  const width = cols * (cellSize + padding) + padding
  const height = rows * (cellSize + padding) + padding + 20

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const svgEl = d3.select(svg)
    svgEl.attr('viewBox', `0 0 ${width} ${height}`)

    const cells = svgEl
      .selectAll<SVGRectElement, number>('rect.cell')
      .data(values.flat())

    cells
      .enter()
      .append('rect')
      .attr('class', 'cell')
      .attr('rx', 3)
      .attr('width', cellSize)
      .attr('height', cellSize)
      .merge(cells)
      .attr('x', (_, i) => padding + (i % cols) * (cellSize + padding))
      .attr('y', (_, i) => padding + Math.floor(i / cols) * (cellSize + padding))
      .transition()
      .duration(400)
      .ease(d3.easeCubicOut)
      .attr('fill', (d) => colorScale(d))

    cells.exit().remove()
  }, [values, rows, cols, width, height, colorScale, svgRef])

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs text-slate-400 font-mono">{label}</span>
      <svg
        ref={svgRef}
        width="100%"
        style={{ height: height, maxWidth: width }}
        aria-label={`Matrix ${label} visualization`}
        role="img"
      />
    </div>
  )
}

export default function LoRAViz() {
  const [rank, setRank] = useState(2)
  const [matrices, setMatrices] = useState(() => ({
    W: makeRandomMatrix(D, D),
    A: makeRandomMatrix(D, 2),
    B: makeRandomMatrix(2, D),
  }))

  const svgWRef = useRef<SVGSVGElement>(null)
  const svgARef = useRef<SVGSVGElement>(null)
  const svgBRef = useRef<SVGSVGElement>(null)

  const colorScale = d3
    .scaleSequential(d3.interpolateRdBu)
    .domain([-0.6, 0.6])
    .clamp(true)

  const handleRankChange = useCallback((newRank: number) => {
    const r = Math.round(newRank)
    setRank(r)
    setMatrices({
      W: makeRandomMatrix(D, D),
      A: makeRandomMatrix(D, r),
      B: makeRandomMatrix(r, D),
    })
  }, [])

  const trainableParams = 2 * rank * D
  const fullParams = D * D
  const reduction = ((1 - (2 * rank) / D) * 100).toFixed(1)

  return (
    <div className="space-y-6" aria-label="LoRA rank visualizer">
      <Slider
        label="LoRA Rank r"
        value={rank}
        onChange={handleRankChange}
        min={1}
        max={8}
        step={1}
        formatValue={(v) => `r = ${Math.round(v)}`}
      />

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-surface-2 rounded-xl p-4 text-center">
          <p className="text-xs text-slate-400 mb-1">Trainable (LoRA)</p>
          <p className="text-xl font-bold text-brand-400 font-mono">{trainableParams.toLocaleString()}</p>
          <p className="text-xs text-slate-500">2 × r × d</p>
        </div>
        <div className="bg-surface-2 rounded-xl p-4 text-center">
          <p className="text-xs text-slate-400 mb-1">Full Fine-tune</p>
          <p className="text-xl font-bold text-slate-300 font-mono">{fullParams.toLocaleString()}</p>
          <p className="text-xs text-slate-500">d × d</p>
        </div>
        <div className="bg-surface-2 rounded-xl p-4 text-center">
          <p className="text-xs text-slate-400 mb-1">Param Reduction</p>
          <p className="text-xl font-bold text-green-400 font-mono">{reduction}%</p>
          <p className="text-xs text-slate-500">(1 − 2r/d) × 100</p>
        </div>
      </div>

      {/* Matrix grids */}
      <div className="flex flex-wrap gap-6 items-start justify-center">
        <MatrixGrid
          label={`W (${D}×${D}) frozen`}
          rows={D}
          cols={D}
          values={matrices.W}
          colorScale={colorScale}
          svgRef={svgWRef}
        />

        <div className="flex flex-col items-center justify-center gap-1 pt-6">
          <span className="text-slate-400 text-lg font-bold">+</span>
          <span className="text-xs text-slate-500">α/r ·</span>
        </div>

        <MatrixGrid
          label={`A (${D}×${rank}) trained`}
          rows={D}
          cols={rank}
          values={matrices.A}
          colorScale={colorScale}
          svgRef={svgARef}
        />

        <div className="flex items-center pt-6">
          <span className="text-slate-400 text-lg font-bold">×</span>
        </div>

        <MatrixGrid
          label={`B (${rank}×${D}) trained`}
          rows={rank}
          cols={D}
          values={matrices.B}
          colorScale={colorScale}
          svgRef={svgBRef}
        />
      </div>

      <p className="text-xs text-slate-500 text-center leading-relaxed">
        Cell color intensity represents weight magnitude (red = negative, blue = positive).
        Drag the rank slider to see how matrix dimensions and parameter counts change.
      </p>
    </div>
  )
}
