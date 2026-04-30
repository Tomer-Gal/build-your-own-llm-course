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
const MARGIN = { top: 10, right: 80, bottom: 20, left: 90 }
const BAR_HEIGHT = 28
const BAR_GAP = 6

export default function NextWordDemo() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [seedIndex, setSeedIndex] = useState(0)
  const [temperature, setTemperature] = useState(1.0)

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
    const innerHeight = totalHeight - MARGIN.top - MARGIN.bottom

    svgEl.attr('viewBox', `0 0 ${width} ${totalHeight}`)

    let g = svgEl.select<SVGGElement>('g.chart-root')
    if (g.empty()) {
      g = svgEl.append('g').attr('class', 'chart-root')
    }
    g.attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)

    const xScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([0, innerWidth])
      .clamp(true)

    const yPositions = tokenData.map((_, i) => i * (BAR_HEIGHT + BAR_GAP))

    // Token labels
    const labels = g
      .selectAll<SVGTextElement, string>('text.token-label')
      .data(tokenData.map((d) => d.token))
    labels
      .enter()
      .append('text')
      .attr('class', 'token-label')
      .merge(labels)
      .attr('x', -8)
      .attr('y', (_, i) => (yPositions[i] ?? 0) + BAR_HEIGHT / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'end')
      .attr('fill', (_, i) => (i === maxProbIndex ? '#818cf8' : '#94a3b8'))
      .attr('font-size', 13)
      .attr('font-family', 'ui-monospace, monospace')
      .attr('font-weight', (_, i) => (i === maxProbIndex ? '600' : '400'))
      .text((d) => d)
    labels.exit().remove()

    // Bars
    const bars = g
      .selectAll<SVGRectElement, number>('rect.prob-bar')
      .data(probs)
    bars
      .enter()
      .append('rect')
      .attr('class', 'prob-bar')
      .attr('rx', 4)
      .attr('height', BAR_HEIGHT)
      .attr('x', 0)
      .attr('width', 0)
      .merge(bars)
      .attr('y', (_, i) => yPositions[i] ?? 0)
      .attr('fill', (_, i) =>
        i === maxProbIndex ? '#6366f1' : '#334155'
      )
      .transition()
      .duration(300)
      .ease(d3.easeCubicOut)
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
      .attr('font-size', 11)
      .attr('fill', '#94a3b8')
      .attr('font-family', 'ui-monospace, monospace')
      .transition()
      .duration(300)
      .attr('x', (d) => xScale(d) + 6)
      .tween('text', function (d) {
        const self = this as SVGTextElement
        const i = d3.interpolateNumber(
          parseFloat(self.textContent?.replace('%', '') ?? '0'),
          d * 100
        )
        return (t: number) => {
          self.textContent = i(t).toFixed(1) + '%'
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
      .call((ax) => ax.select('.domain').attr('stroke', '#475569'))
      .call((ax) => ax.selectAll('text').attr('fill', '#64748b').attr('font-size', 10))
      .call((ax) => ax.selectAll('line').attr('stroke', '#475569'))
  }, [probs, tokenData, maxProbIndex, totalHeight])

  return (
    <div className="space-y-6">
      {/* Seed selector */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Seed phrase
        </label>
        <div className="flex flex-wrap gap-2">
          {SEED_KEYS.map((key, i) => (
            <button
              key={key}
              onClick={() => setSeedIndex(i)}
              aria-pressed={seedIndex === i}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                seedIndex === i
                  ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
              }`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* Most likely next token */}
      <div className="flex items-center gap-3 p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
        <span className="text-slate-400 text-sm">Most likely next token:</span>
        <span className="font-mono font-semibold text-indigo-300 text-lg">
          &ldquo;{tokenData[maxProbIndex]?.token ?? '?'}&rdquo;
        </span>
        <span className="text-slate-500 text-sm ml-auto">
          {(Math.max(...probs) * 100).toFixed(1)}%
        </span>
      </div>

      {/* Bar chart */}
      <div className="w-full" role="img" aria-label="Token probability distribution bar chart">
        <svg
          ref={svgRef}
          width="100%"
          style={{ height: totalHeight }}
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
        Temperature scales the logits before softmax. Lower values concentrate probability on the top token; higher values spread it more evenly.
      </p>
    </div>
  )
}
