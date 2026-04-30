import React, { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import Slider from '../../components/Slider'
import { layerNorm } from '../../utils/mathHelpers'

function sampleNormal(mean: number, std: number, n: number): number[] {
  const samples: number[] = []
  for (let i = 0; i < n; i++) {
    // Box-Muller transform
    const u1 = Math.random()
    const u2 = Math.random()
    const z = Math.sqrt(-2 * Math.log(u1 + 1e-10)) * Math.cos(2 * Math.PI * u2)
    samples.push(mean + std * z)
  }
  return samples
}

interface HistogramData {
  values: number[]
  color: string
  label: string
}

function drawHistogram(
  svgEl: SVGSVGElement,
  data: HistogramData,
  width: number,
  height: number,
  margin: { top: number; right: number; bottom: number; left: number }
) {
  const svg = d3.select(svgEl)
  svg.selectAll('*').remove()

  const innerW = width - margin.left - margin.right
  const innerH = height - margin.top - margin.bottom

  const g = svg
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  const xMin = d3.min(data.values) as number
  const xMax = d3.max(data.values) as number
  const xPad = (xMax - xMin) * 0.1 || 0.5

  const x = d3.scaleLinear()
    .domain([xMin - xPad, xMax + xPad])
    .range([0, innerW])

  const histogram = d3.bin<number, number>()
    .domain(x.domain() as [number, number])
    .thresholds(x.ticks(15))

  const bins = histogram(data.values)

  const y = d3.scaleLinear()
    .domain([0, d3.max(bins, d => d.length) as number])
    .nice()
    .range([innerH, 0])

  // Bars
  g.selectAll('rect')
    .data(bins)
    .join('rect')
    .attr('x', d => x(d.x0 as number) + 1)
    .attr('width', d => Math.max(0, x(d.x1 as number) - x(d.x0 as number) - 2))
    .attr('y', d => y(d.length))
    .attr('height', d => innerH - y(d.length))
    .attr('fill', data.color)
    .attr('opacity', 0.8)

  // X axis
  g.append('g')
    .attr('transform', `translate(0,${innerH})`)
    .call(d3.axisBottom(x).ticks(4).tickSize(3))
    .call(ax => ax.select('.domain').attr('stroke', '#475569'))
    .call(ax => ax.selectAll('.tick line').attr('stroke', '#475569'))
    .call(ax => ax.selectAll('.tick text').attr('fill', '#94a3b8').attr('font-size', '9px'))

  // Title
  g.append('text')
    .attr('x', innerW / 2)
    .attr('y', -6)
    .attr('text-anchor', 'middle')
    .attr('fill', '#e2e8f0')
    .attr('font-size', '11px')
    .attr('font-weight', '600')
    .text(data.label)
}

const LayerNormViz: React.FC = () => {
  const [spread, setSpread] = useState(2.0)
  const [meanOffset, setMeanOffset] = useState(1.5)
  const svgBeforeRef = useRef<SVGSVGElement>(null)
  const svgAfterRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    // Use a fixed seed-ish approach: regenerate same sample deterministically via spread/meanOffset
    // We'll regenerate on every change
    const raw = sampleNormal(meanOffset, spread, 50)
    const normed = layerNorm(raw)

    const margin = { top: 20, right: 10, bottom: 24, left: 28 }
    const width = 200
    const height = 160

    if (svgBeforeRef.current) {
      drawHistogram(
        svgBeforeRef.current,
        { values: raw, color: '#f97316', label: 'Before LayerNorm' },
        width,
        height,
        margin
      )
    }
    if (svgAfterRef.current) {
      drawHistogram(
        svgAfterRef.current,
        { values: normed, color: '#3b82f6', label: 'After LayerNorm' },
        width,
        height,
        margin
      )
    }
  }, [spread, meanOffset])

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Slider
          label="Distribution Spread (std)"
          value={spread}
          onChange={setSpread}
          min={0.5}
          max={5.0}
          step={0.1}
          formatValue={v => v.toFixed(1)}
        />
        <Slider
          label="Mean Offset"
          value={meanOffset}
          onChange={setMeanOffset}
          min={0}
          max={3}
          step={0.1}
          formatValue={v => v.toFixed(1)}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <svg ref={svgBeforeRef} width={200} height={160} aria-label="Before LayerNorm distribution" />
        <div className="text-slate-500 text-2xl font-light">→</div>
        <svg ref={svgAfterRef} width={200} height={160} aria-label="After LayerNorm distribution" />
      </div>

      <p className="text-slate-400 text-xs mt-3 text-center">
        After LayerNorm, the distribution is always centered near 0 with unit variance regardless of input mean or spread.
      </p>
    </div>
  )
}

export default LayerNormViz
