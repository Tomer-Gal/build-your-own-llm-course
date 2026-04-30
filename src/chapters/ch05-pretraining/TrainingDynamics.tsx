import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import Slider from '../../components/Slider'

interface TrainingPoint {
  step: number
  loss: number
  lr: number
}

const TOTAL_STEPS = 1000
const BATCH_OPTIONS = [16, 32, 64, 128] as const
type BatchSize = (typeof BATCH_OPTIONS)[number]

function cosineLR(step: number, warmupSteps: number, lrMax: number, lrMin: number): number {
  if (step < warmupSteps) {
    return lrMin + (lrMax - lrMin) * (step / Math.max(1, warmupSteps))
  }
  const t = step - warmupSteps
  const T = TOTAL_STEPS - warmupSteps
  return lrMin + 0.5 * (lrMax - lrMin) * (1 + Math.cos(Math.PI * t / Math.max(1, T)))
}

function generateTrainingData(
  lrMax: number,
  batchSize: BatchSize,
  warmupSteps: number
): TrainingPoint[] {
  const lrMin = lrMax * 0.1
  const noiseFactor = lrMax * 80  // higher LR → more noise
  const batchFactor = 1 + 0.2 * Math.log2(128 / batchSize)  // smaller batch → noisier

  // Pseudo-random noise using simple deterministic sequence
  const seed = Math.round(lrMax * 10000) + batchSize + warmupSteps
  let rng = seed

  function nextRandom(): number {
    rng = (rng * 1664525 + 1013904223) & 0xffffffff
    return ((rng >>> 0) / 0xffffffff) - 0.5
  }

  const data: TrainingPoint[] = []
  let smoothedLoss = 5.0

  for (let step = 0; step <= TOTAL_STEPS; step += 5) {
    const lr = cosineLR(step, warmupSteps, lrMax, lrMin)
    // Exponential decay base
    const decayRate = 3.5 * lr / lrMax
    const targetLoss = 0.8 + 4.2 * Math.exp(-decayRate * step * batchFactor / 100)
    // Smoothed loss with noise
    const noise = nextRandom() * noiseFactor * batchFactor * (1 + 3 / (1 + step / 100))
    smoothedLoss = smoothedLoss * 0.7 + targetLoss * 0.3 + noise * 0.3
    data.push({ step, loss: Math.max(0.5, smoothedLoss), lr })
  }

  return data
}

const TrainingDynamics: React.FC = () => {
  const lossSvgRef = useRef<SVGSVGElement>(null)
  const lrSvgRef = useRef<SVGSVGElement>(null)

  const [lrMax, setLrMax] = useState(0.001)
  const [batchSize, setBatchSize] = useState<BatchSize>(32)
  const [warmupSteps, setWarmupSteps] = useState(100)

  const margin = { top: 16, right: 20, bottom: 36, left: 52 }
  const width = 480
  const lossHeight = 220
  const lrHeight = 120

  useEffect(() => {
    const data = generateTrainingData(lrMax, batchSize, warmupSteps)

    // --- Loss chart ---
    if (lossSvgRef.current) {
      const svg = d3.select(lossSvgRef.current)
      svg.selectAll('*').remove()

      const innerW = width - margin.left - margin.right
      const innerH = lossHeight - margin.top - margin.bottom

      const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

      const x = d3.scaleLinear().domain([0, TOTAL_STEPS]).range([0, innerW])
      const yMax = d3.max(data, d => d.loss) as number
      const y = d3.scaleLinear().domain([0, Math.ceil(yMax)]).range([innerH, 0])

      // Grid
      g.append('g').selectAll('line')
        .data(y.ticks(4))
        .join('line')
        .attr('x1', 0).attr('x2', innerW)
        .attr('y1', d => y(d)).attr('y2', d => y(d))
        .attr('stroke', '#1e293b').attr('stroke-width', 1)

      // Warmup boundary
      if (warmupSteps > 0) {
        g.append('line')
          .attr('x1', x(warmupSteps)).attr('x2', x(warmupSteps))
          .attr('y1', 0).attr('y2', innerH)
          .attr('stroke', '#f59e0b').attr('stroke-width', 1.5)
          .attr('stroke-dasharray', '4 2')

        g.append('text')
          .attr('x', x(warmupSteps) + 4)
          .attr('y', 12)
          .attr('fill', '#f59e0b')
          .attr('font-size', '9px')
          .text('warmup')
      }

      // Loss line with transition
      const lineGen = d3.line<TrainingPoint>()
        .x(d => x(d.step))
        .y(d => y(d.loss))
        .curve(d3.curveCatmullRom)

      const path = g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#3b82f6')
        .attr('stroke-width', 2)
        .attr('d', lineGen)

      // Animate draw
      const totalLength = (path.node() as SVGPathElement).getTotalLength()
      path
        .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(600)
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', 0)

      // Axes
      g.append('g')
        .attr('transform', `translate(0,${innerH})`)
        .call(d3.axisBottom(x).ticks(5).tickSize(4))
        .call(ax => ax.select('.domain').attr('stroke', '#475569'))
        .call(ax => ax.selectAll('.tick line').attr('stroke', '#475569'))
        .call(ax => ax.selectAll('.tick text').attr('fill', '#94a3b8').attr('font-size', '10px'))

      g.append('g')
        .call(d3.axisLeft(y).ticks(4).tickSize(4))
        .call(ax => ax.select('.domain').attr('stroke', '#475569'))
        .call(ax => ax.selectAll('.tick line').attr('stroke', '#475569'))
        .call(ax => ax.selectAll('.tick text').attr('fill', '#94a3b8').attr('font-size', '10px'))

      g.append('text')
        .attr('x', innerW / 2).attr('y', innerH + 28)
        .attr('text-anchor', 'middle').attr('fill', '#64748b').attr('font-size', '11px')
        .text('Training Steps')

      g.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -innerH / 2).attr('y', -40)
        .attr('text-anchor', 'middle').attr('fill', '#64748b').attr('font-size', '11px')
        .text('Loss')
    }

    // --- LR schedule chart ---
    if (lrSvgRef.current) {
      const svg = d3.select(lrSvgRef.current)
      svg.selectAll('*').remove()

      const innerW = width - margin.left - margin.right
      const innerH = lrHeight - margin.top - margin.bottom

      const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

      const x = d3.scaleLinear().domain([0, TOTAL_STEPS]).range([0, innerW])
      const y = d3.scaleLinear().domain([0, lrMax * 1.1]).range([innerH, 0])

      const lineGen = d3.line<TrainingPoint>()
        .x(d => x(d.step))
        .y(d => y(d.lr))

      g.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#10b981')
        .attr('stroke-width', 2)
        .attr('d', lineGen)

      g.append('g')
        .attr('transform', `translate(0,${innerH})`)
        .call(d3.axisBottom(x).ticks(5).tickSize(4))
        .call(ax => ax.select('.domain').attr('stroke', '#475569'))
        .call(ax => ax.selectAll('.tick line').attr('stroke', '#475569'))
        .call(ax => ax.selectAll('.tick text').attr('fill', '#94a3b8').attr('font-size', '10px'))

      g.append('g')
        .call(d3.axisLeft(y).ticks(3).tickSize(4).tickFormat(d3.format('.0e')))
        .call(ax => ax.select('.domain').attr('stroke', '#475569'))
        .call(ax => ax.selectAll('.tick line').attr('stroke', '#475569'))
        .call(ax => ax.selectAll('.tick text').attr('fill', '#94a3b8').attr('font-size', '9px'))

      g.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -innerH / 2).attr('y', -44)
        .attr('text-anchor', 'middle').attr('fill', '#64748b').attr('font-size', '10px')
        .text('LR')
    }
  }, [lrMax, batchSize, warmupSteps, lossHeight, lrHeight, margin.bottom, margin.left, margin.right, margin.top, width])

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Slider
          label="Peak Learning Rate"
          value={lrMax}
          onChange={setLrMax}
          min={0.0001}
          max={0.01}
          step={0.0001}
          formatValue={v => v.toExponential(1)}
        />
        <div className="flex flex-col gap-2">
          <span className="text-slate-300 text-sm font-medium">Batch Size</span>
          <div className="flex gap-2">
            {BATCH_OPTIONS.map(bs => (
              <button
                key={bs}
                onClick={() => setBatchSize(bs)}
                className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                  batchSize === bs
                    ? 'bg-brand-500 text-white'
                    : 'bg-surface-3 text-slate-400 hover:text-white'
                }`}
              >
                {bs}
              </button>
            ))}
          </div>
        </div>
        <Slider
          label="Warmup Steps"
          value={warmupSteps}
          onChange={v => setWarmupSteps(Math.round(v))}
          min={0}
          max={500}
          step={10}
          formatValue={v => String(Math.round(v))}
        />
      </div>

      <div className="space-y-1">
        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Training Loss</p>
        <svg
          ref={lossSvgRef}
          viewBox={`0 0 ${width} ${lossHeight}`}
          className="w-full"
          aria-label="Training loss curve"
        />
        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mt-3">Learning Rate Schedule</p>
        <svg
          ref={lrSvgRef}
          viewBox={`0 0 ${width} ${lrHeight}`}
          className="w-full"
          aria-label="Learning rate schedule"
        />
      </div>
    </div>
  )
}

export default TrainingDynamics
