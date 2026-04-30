import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { softmax } from '../../utils/mathHelpers'
import Slider from '../../components/Slider'

interface TokenProb {
  token: string
  logit: number
}

const SEED_OPTIONS: Record<string, TokenProb[]> = {
  'The cat sat on the': [
    { token: 'mat', logit: 1.6 },
    { token: 'floor', logit: 1.2 },
    { token: 'chair', logit: 0.9 },
    { token: 'table', logit: 0.6 },
    { token: 'roof', logit: 0.1 },
    { token: 'sky', logit: -0.3 },
    { token: 'ocean', logit: -0.8 },
    { token: 'moon', logit: -1.2 },
  ],
  'Once upon a': [
    { token: 'time', logit: 2.1 },
    { token: 'day', logit: 1.0 },
    { token: 'midnight', logit: 0.5 },
    { token: 'dream', logit: 0.3 },
    { token: 'hill', logit: -0.1 },
    { token: 'cloud', logit: -0.5 },
    { token: 'star', logit: -0.9 },
    { token: 'number', logit: -1.5 },
  ],
  'The neural network learns': [
    { token: 'to', logit: 1.8 },
    { token: 'patterns', logit: 1.3 },
    { token: 'weights', logit: 0.8 },
    { token: 'features', logit: 0.6 },
    { token: 'nothing', logit: -0.2 },
    { token: 'colors', logit: -0.6 },
    { token: 'music', logit: -1.0 },
    { token: 'sleep', logit: -1.4 },
  ],
  'In the beginning there': [
    { token: 'was', logit: 2.0 },
    { token: 'were', logit: 1.1 },
    { token: 'lived', logit: 0.4 },
    { token: 'existed', logit: 0.2 },
    { token: 'stood', logit: -0.2 },
    { token: 'sang', logit: -0.7 },
    { token: 'danced', logit: -1.1 },
    { token: 'flew', logit: -1.6 },
  ],
}

const SEED_KEYS = Object.keys(SEED_OPTIONS)
const MARGIN = { top: 10, right: 90, bottom: 28, left: 100 }
const BAR_HEIGHT = 36
const BAR_GAP = 8

export default function NextWordDemo() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [seedIndex, setSeedIndex] = useState(0)
  const [temperature, setTemperature] = useState(1.0)
  // Track whether this is a first render (for bars animating from width=0)
  const isFirstRender = useRef(true)
  const prevSeedIndex = useRef(seedIndex)

  const seedKey = SEED_KEYS[seedIndex] ?? SEED_KEYS[0]!
  const tokenData = SEED_OPTIONS[seedKey] ?? []
  const logits = tokenData.map((d) => d.logit / temperature)
  const probs = softmax(logits)
  const maxProbIndex = probs.indexOf(Math.max(...probs))

  const totalHeight = tokenData.length * (BAR_HEIGHT + BAR_GAP) + MARGIN.top + MARGIN.bottom

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const svgEl = d3.select(svg)
    const width = svg.clientWidth || 480
    const innerWidth = width - MARGIN.left - MARGIN.right

    svgEl.attr('viewBox', `0 0 ${width} ${totalHeight}`)

    let g = svgEl.select<SVGGElement>('g.chart-root')
    if (g.empty()) {
      g = svgEl.append('g').attr('class', 'chart-root')

      // Define gradient in defs
      const defs = svgEl.append('defs')
      const grad = defs.append('linearGradient')
        .attr('id', 'bar-gradient')
        .attr('x1', '0%').attr('y1', '0%')
        .attr('x2', '100%').attr('y2', '0%')
      grad.append('stop').attr('offset', '0%').attr('stop-color', '#7c3aed')
      grad.append('stop').attr('offset', '100%').attr('stop-color', '#22d3ee')

      // Grid lines group (behind bars)
      g.append('g').attr('class', 'grid-lines')
    }
    g.attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)

    const xScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([0, innerWidth])
      .clamp(true)

    const yPositions = tokenData.map((_, i) => i * (BAR_HEIGHT + BAR_GAP))
    const innerHeight = tokenData.length * (BAR_HEIGHT + BAR_GAP) - BAR_GAP

    // Subtle horizontal grid lines at 25%, 50%, 75%
    const gridG = g.select<SVGGElement>('g.grid-lines')
    const gridData = [0.25, 0.5, 0.75]
    const gridLines = gridG.selectAll<SVGLineElement, number>('line.grid-line').data(gridData)
    gridLines.enter()
      .append('line')
      .attr('class', 'grid-line')
      .merge(gridLines)
      .attr('x1', (d) => xScale(d))
      .attr('y1', 0)
      .attr('x2', (d) => xScale(d))
      .attr('y2', innerHeight)
      .attr('stroke', 'rgba(255,255,255,0.04)')
      .attr('stroke-dasharray', '3 3')
      .attr('stroke-width', 1)
    gridLines.exit().remove()

    // Seed changed? reset bars to 0 first so they animate in
    const seedChanged = prevSeedIndex.current !== seedIndex
    prevSeedIndex.current = seedIndex

    // Token labels
    const labels = g
      .selectAll<SVGTextElement, TokenProb>('text.token-label')
      .data(tokenData)
    labels
      .enter()
      .append('text')
      .attr('class', 'token-label')
      .merge(labels)
      .attr('x', -8)
      .attr('y', (_, i) => (yPositions[i] ?? 0) + BAR_HEIGHT / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .attr('fill', (_, i) => (i === maxProbIndex ? '#c4b5fd' : '#c8d3e8'))
      .attr('font-size', '12px')
      .attr('font-family', 'JetBrains Mono, ui-monospace, monospace')
      .attr('font-weight', (_, i) => (i === maxProbIndex ? '600' : '400'))
      .text((d) => d.token)
    labels.exit().remove()

    // "Most likely" marker (▶) next to top token label
    const markerData = [maxProbIndex]
    const markers = g.selectAll<SVGTextElement, number>('text.top-marker').data(markerData)
    markers.enter()
      .append('text')
      .attr('class', 'top-marker')
      .merge(markers)
      .attr('x', -MARGIN.left + 4)
      .attr('y', (i) => (yPositions[i] ?? 0) + BAR_HEIGHT / 2)
      .attr('dy', '0.35em')
      .attr('font-size', '10px')
      .attr('fill', '#7c3aed')
      .text('▶')
    markers.exit().remove()

    // Bars — if seed changed or first render, reset to width 0
    const bars = g
      .selectAll<SVGRectElement, number>('rect.prob-bar')
      .data(probs)

    const newBars = bars.enter()
      .append('rect')
      .attr('class', 'prob-bar')
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('height', BAR_HEIGHT)
      .attr('x', 0)
      .attr('width', 0)

    const allBars = newBars.merge(bars)

    if (seedChanged || isFirstRender.current) {
      isFirstRender.current = false
      allBars.attr('width', 0)
    }

    allBars
      .attr('y', (_, i) => yPositions[i] ?? 0)
      .attr('fill', (_, i) => (i === maxProbIndex ? 'url(#bar-gradient)' : 'url(#bar-gradient)'))
      .attr('opacity', (_, i) => (i === maxProbIndex ? 1 : 0.6))
      .transition()
      .duration(350)
      .ease(d3.easeQuadOut)
      .attr('width', (d) => xScale(d))
    bars.exit().remove()

    // Probability value labels
    const valueLabels = g
      .selectAll<SVGTextElement, number>('text.prob-value')
      .data(probs)

    valueLabels
      .enter()
      .append('text')
      .attr('class', 'prob-value')
      .merge(valueLabels)
      .attr('y', (_, i) => (yPositions[i] ?? 0) + BAR_HEIGHT / 2)
      .attr('dy', '0.35em')
      .attr('font-size', '11px')
      .attr('font-family', 'JetBrains Mono, ui-monospace, monospace')
      .transition()
      .duration(350)
      .ease(d3.easeQuadOut)
      .attr('x', (d) => {
        const barW = xScale(d)
        return barW >= 50 ? barW - 6 : barW + 6
      })
      .attr('text-anchor', (d) => (xScale(d) >= 50 ? 'end' : 'start'))
      .attr('fill', (d) => (xScale(d) >= 50 ? 'rgba(255,255,255,0.9)' : '#7c3aed'))
      .tween('text', function (d) {
        const self = this as SVGTextElement
        const prevText = self.textContent?.replace('%', '') ?? '0'
        const prevVal = parseFloat(prevText) || 0
        const interp = d3.interpolateNumber(prevVal, d * 100)
        return (t: number) => {
          self.textContent = interp(t).toFixed(1) + '%'
        }
      })
    valueLabels.exit().remove()

    // X axis
    let xAxis = g.select<SVGGElement>('g.x-axis')
    if (xAxis.empty()) {
      xAxis = g.append('g').attr('class', 'x-axis')
    }
    xAxis
      .attr('transform', `translate(0,${innerHeight + 4})`)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(4)
          .tickFormat((d) => `${(+d * 100).toFixed(0)}%`)
      )
      .call((ax) => ax.select('.domain').attr('stroke', '#1f2d45'))
      .call((ax) => ax.selectAll('text').attr('fill', '#7a8daa').attr('font-size', 10))
      .call((ax) => ax.selectAll('line').attr('stroke', '#1f2d45'))
  }, [probs, tokenData, maxProbIndex, totalHeight, seedIndex])

  return (
    <div className="space-y-6">
      {/* Seed selector */}
      <div>
        <label className="block text-sm font-medium text-ink-2 mb-2">
          Seed phrase
        </label>
        <div className="flex flex-wrap gap-2">
          {SEED_KEYS.map((key, i) => (
            <button
              key={key}
              onClick={() => setSeedIndex(i)}
              aria-pressed={seedIndex === i}
              className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                seedIndex === i
                  ? 'bg-violet-500/15 text-violet-300 border-violet-500/30'
                  : 'bg-surface-2 hover:bg-surface-3 text-ink-1 border-surface-4'
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* Most likely next token */}
      <div className="flex items-center gap-3 p-3 bg-violet-500/10 border border-violet-500/30 rounded-lg">
        <span className="text-ink-2 text-sm">Most likely next token:</span>
        <span className="font-mono font-semibold text-violet-300 text-lg">
          &ldquo;{tokenData[maxProbIndex]?.token ?? '?'}&rdquo;
        </span>
        <span className="text-ink-3 text-sm ml-auto">
          {(Math.max(...probs) * 100).toFixed(1)}%
        </span>
      </div>

      {/* Bar chart */}
      <div className="w-full" role="img" aria-label="Token probability distribution bar chart">
        <svg
          ref={svgRef}
          width="100%"
          style={{ height: totalHeight, background: 'transparent' }}
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

      <p className="text-xs text-ink-3 leading-relaxed">
        Temperature scales the logits before softmax. Lower values concentrate probability on the top token; higher values spread it more evenly.
      </p>
    </div>
  )
}
