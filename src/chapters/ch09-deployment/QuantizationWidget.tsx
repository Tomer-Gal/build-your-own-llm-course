import React, { useEffect, useRef, useState, useCallback } from 'react'
import * as d3 from 'd3'
import Slider from '../../components/Slider'

type Precision = 'FP32' | 'FP16' | 'INT8' | 'INT4'

interface PrecisionInfo {
  label: Precision
  bytesPerParam: number
  qualityScore: number
  speedMultiplier: number
  color: string
}

const PRECISIONS: PrecisionInfo[] = [
  { label: 'FP32', bytesPerParam: 4, qualityScore: 100, speedMultiplier: 1, color: '#6366f1' },
  { label: 'FP16', bytesPerParam: 2, qualityScore: 99.9, speedMultiplier: 2, color: '#8b5cf6' },
  { label: 'INT8', bytesPerParam: 1, qualityScore: 99, speedMultiplier: 3, color: '#a78bfa' },
  { label: 'INT4', bytesPerParam: 0.5, qualityScore: 95, speedMultiplier: 4, color: '#c4b5fd' },
]

interface BarChartProps {
  svgRef: React.RefObject<SVGSVGElement>
  data: { label: Precision; value: number; color: string }[]
  selectedLabel: Precision
  yLabel: string
  formatTick: (v: number) => string
  maxValue: number
}

function BarChart({ svgRef, data, selectedLabel, yLabel, formatTick, maxValue }: BarChartProps) {
  const MARGIN = { top: 20, right: 16, bottom: 32, left: 48 }
  const HEIGHT = 160

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const totalWidth = svg.clientWidth || 260
    const innerWidth = totalWidth - MARGIN.left - MARGIN.right
    const innerHeight = HEIGHT - MARGIN.top - MARGIN.bottom

    const svgEl = d3.select(svg)
    svgEl.attr('viewBox', `0 0 ${totalWidth} ${HEIGHT}`)

    let g = svgEl.select<SVGGElement>('g.chart-root')
    if (g.empty()) {
      g = svgEl.append('g').attr('class', 'chart-root')
    }
    g.attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)

    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([0, innerWidth])
      .padding(0.25)

    const yScale = d3.scaleLinear().domain([0, maxValue]).range([innerHeight, 0]).nice()

    // Y axis
    let yAxis = g.select<SVGGElement>('g.y-axis')
    if (yAxis.empty()) yAxis = g.append('g').attr('class', 'y-axis')
    yAxis
      .call(d3.axisLeft(yScale).ticks(4).tickFormat((d) => formatTick(+d)))
      .call((ax) => ax.select('.domain').attr('stroke', '#475569'))
      .call((ax) => ax.selectAll('text').attr('fill', '#64748b').attr('font-size', 10))
      .call((ax) => ax.selectAll('line').attr('stroke', '#334155'))

    // Y label
    let yLabelEl = g.select<SVGTextElement>('text.y-label')
    if (yLabelEl.empty()) {
      yLabelEl = g.append('text').attr('class', 'y-label')
    }
    yLabelEl
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -36)
      .attr('text-anchor', 'middle')
      .attr('fill', '#64748b')
      .attr('font-size', 9)
      .text(yLabel)

    // Bars
    const bars = g
      .selectAll<SVGRectElement, (typeof data)[number]>('rect.bar')
      .data(data, (d) => d.label)

    bars
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('rx', 3)
      .attr('x', (d) => xScale(d.label) ?? 0)
      .attr('width', xScale.bandwidth())
      .attr('y', innerHeight)
      .attr('height', 0)
      .merge(bars)
      .attr('x', (d) => xScale(d.label) ?? 0)
      .attr('width', xScale.bandwidth())
      .attr('fill', (d) => d.color)
      .attr('opacity', (d) => (d.label === selectedLabel ? 1 : 0.4))
      .attr('stroke', (d) => (d.label === selectedLabel ? 'white' : 'none'))
      .attr('stroke-width', 1.5)
      .transition()
      .duration(400)
      .ease(d3.easeCubicOut)
      .attr('y', (d) => yScale(d.value))
      .attr('height', (d) => innerHeight - yScale(d.value))

    bars.exit().remove()

    // X axis labels
    const labels = g
      .selectAll<SVGTextElement, (typeof data)[number]>('text.x-label')
      .data(data, (d) => d.label)

    labels
      .enter()
      .append('text')
      .attr('class', 'x-label')
      .merge(labels)
      .attr('x', (d) => (xScale(d.label) ?? 0) + xScale.bandwidth() / 2)
      .attr('y', innerHeight + 18)
      .attr('text-anchor', 'middle')
      .attr('font-size', 10)
      .attr('fill', (d) => (d.label === selectedLabel ? 'white' : '#64748b'))
      .attr('font-weight', (d) => (d.label === selectedLabel ? '600' : '400'))
      .text((d) => d.label)

    labels.exit().remove()
  }, [data, selectedLabel, maxValue, yLabel, formatTick, MARGIN.left, MARGIN.top, MARGIN.right, MARGIN.bottom, HEIGHT])

  return (
    <svg
      ref={svgRef}
      width="100%"
      style={{ height: HEIGHT }}
      role="img"
      aria-label={`Bar chart showing ${yLabel}`}
    />
  )
}

export default function QuantizationWidget() {
  const [selected, setSelected] = useState<Precision>('FP16')
  const [modelSize, setModelSize] = useState(7)

  const svgMemRef = useRef<SVGSVGElement>(null)
  const svgQualRef = useRef<SVGSVGElement>(null)
  const svgSpeedRef = useRef<SVGSVGElement>(null)

  const selectedInfo = PRECISIONS.find((p) => p.label === selected)!
  const memoryGB = modelSize * selectedInfo.bytesPerParam

  const handleModelSizeChange = useCallback((v: number) => setModelSize(Math.round(v)), [])

  const memData = PRECISIONS.map((p) => ({
    label: p.label,
    value: p.bytesPerParam,
    color: p.color,
  }))
  const qualData = PRECISIONS.map((p) => ({
    label: p.label,
    value: p.qualityScore,
    color: p.color,
  }))
  const speedData = PRECISIONS.map((p) => ({
    label: p.label,
    value: p.speedMultiplier,
    color: p.color,
  }))

  const memTick = useCallback((v: number) => `${v}GB`, [])
  const qualTick = useCallback((v: number) => `${v}%`, [])
  const speedTick = useCallback((v: number) => `${v}x`, [])

  return (
    <div className="space-y-6" aria-label="Quantization trade-off explorer">
      {/* Precision selector */}
      <div>
        <p className="text-sm text-slate-400 mb-3 font-medium">Select precision:</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Precision options">
          {PRECISIONS.map((p) => (
            <button
              key={p.label}
              onClick={() => setSelected(p.label)}
              aria-pressed={selected === p.label}
              aria-label={`Select ${p.label} precision`}
              className={`px-4 py-2 rounded-lg text-sm font-mono font-semibold border transition-all
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500
                focus-visible:ring-offset-2 focus-visible:ring-offset-surface-1
                ${
                  selected === p.label
                    ? 'bg-brand-600/30 border-brand-500/70 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Selected info card */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-surface-2 rounded-xl p-3 text-center">
          <p className="text-xs text-slate-400 mb-1">Memory / Param</p>
          <p className="text-lg font-bold text-brand-400 font-mono">{selectedInfo.bytesPerParam} GB/B</p>
        </div>
        <div className="bg-surface-2 rounded-xl p-3 text-center">
          <p className="text-xs text-slate-400 mb-1">Quality Score</p>
          <p className="text-lg font-bold text-green-400 font-mono">{selectedInfo.qualityScore}%</p>
        </div>
        <div className="bg-surface-2 rounded-xl p-3 text-center">
          <p className="text-xs text-slate-400 mb-1">Speed</p>
          <p className="text-lg font-bold text-amber-400 font-mono">{selectedInfo.speedMultiplier}×</p>
        </div>
      </div>

      {/* Model size slider + memory estimate */}
      <Slider
        label="Model size (B parameters)"
        value={modelSize}
        onChange={handleModelSizeChange}
        min={1}
        max={70}
        step={1}
        formatValue={(v) => `${Math.round(v)}B`}
      />

      <div
        className="bg-brand-900/20 border border-brand-500/30 rounded-xl p-4 text-center"
        aria-live="polite"
        aria-label={`Memory estimate for ${modelSize}B parameters at ${selected}`}
      >
        <p className="text-slate-400 text-sm">
          To run <span className="text-white font-semibold">{modelSize}B parameters</span> at{' '}
          <span className="text-white font-semibold">{selected}</span>:
        </p>
        <p className="text-3xl font-bold text-brand-400 font-mono mt-1">
          ~{memoryGB >= 1000 ? `${(memoryGB / 1024).toFixed(1)} TB` : `${memoryGB.toFixed(1)} GB`} VRAM
        </p>
      </div>

      {/* Bar charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-slate-400 text-center mb-2">Memory (GB per 1B params)</p>
          <BarChart
            svgRef={svgMemRef}
            data={memData}
            selectedLabel={selected}
            yLabel="GB / 1B params"
            formatTick={memTick}
            maxValue={5}
          />
        </div>
        <div>
          <p className="text-xs text-slate-400 text-center mb-2">Quality Score (%)</p>
          <BarChart
            svgRef={svgQualRef}
            data={qualData}
            selectedLabel={selected}
            yLabel="Quality %"
            formatTick={qualTick}
            maxValue={105}
          />
        </div>
        <div>
          <p className="text-xs text-slate-400 text-center mb-2">Speed Multiplier</p>
          <BarChart
            svgRef={svgSpeedRef}
            data={speedData}
            selectedLabel={selected}
            yLabel="Speed"
            formatTick={speedTick}
            maxValue={5}
          />
        </div>
      </div>
    </div>
  )
}
