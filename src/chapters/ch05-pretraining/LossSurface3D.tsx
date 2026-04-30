import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'

const GRID_SIZE = 60
const X_RANGE: [number, number] = [-2.5, 2.5]
const Y_RANGE: [number, number] = [-2.5, 2.5]

function lossFn(x: number, y: number): number {
  return Math.sin(x * 2) * Math.cos(y * 2) * 2 + 0.5 * x * x + 0.5 * y * y
}

function generateGrid(): number[][] {
  return Array.from({ length: GRID_SIZE }, (_, iy) => {
    const y = Y_RANGE[0] + (iy / (GRID_SIZE - 1)) * (Y_RANGE[1] - Y_RANGE[0])
    return Array.from({ length: GRID_SIZE }, (_, ix) => {
      const x = X_RANGE[0] + (ix / (GRID_SIZE - 1)) * (X_RANGE[1] - X_RANGE[0])
      return lossFn(x, y)
    })
  })
}

// Pre-computed gradient descent path from a starting point
function computeGDPath(
  startX: number,
  startY: number,
  lr: number,
  steps: number
): Array<{ x: number; y: number; loss: number }> {
  const path: Array<{ x: number; y: number; loss: number }> = []
  let cx = startX
  let cy = startY
  const eps = 0.01

  for (let i = 0; i < steps; i++) {
    path.push({ x: cx, y: cy, loss: lossFn(cx, cy) })
    const gx = (lossFn(cx + eps, cy) - lossFn(cx - eps, cy)) / (2 * eps)
    const gy = (lossFn(cx, cy + eps) - lossFn(cx, cy - eps)) / (2 * eps)
    cx = cx - lr * gx
    cy = cy - lr * gy
    cx = Math.max(X_RANGE[0], Math.min(X_RANGE[1], cx))
    cy = Math.max(Y_RANGE[0], Math.min(Y_RANGE[1], cy))
  }
  path.push({ x: cx, y: cy, loss: lossFn(cx, cy) })
  return path
}

const GD_PATH = computeGDPath(-2.0, 1.8, 0.15, 40)

const LossSurface3D: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null)

  const margin = { top: 20, right: 20, bottom: 44, left: 52 }
  const width = 460
  const height = 380
  const innerW = width - margin.left - margin.right
  const innerH = height - margin.top - margin.bottom

  useEffect(() => {
    if (!svgRef.current) return
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    const x = d3.scaleLinear().domain(X_RANGE).range([0, innerW])
    const y = d3.scaleLinear().domain(Y_RANGE).range([innerH, 0])

    const grid = generateGrid()

    // Flatten the grid for contour generation
    const values: number[] = []
    for (const row of grid) {
      for (const val of row) {
        values.push(val)
      }
    }

    const vMin = d3.min(values) as number
    const vMax = d3.max(values) as number

    const colorScale = d3.scaleSequential(d3.interpolateRdYlGn)
      .domain([vMax, vMin])  // reversed: red=high loss, green=low loss

    // Generate contour paths
    const contourGen = d3.contours()
      .size([GRID_SIZE, GRID_SIZE])
      .thresholds(d3.range(vMin, vMax, (vMax - vMin) / 16))

    const contours = contourGen(values)

    // Scale transform: grid coords -> pixel coords
    const scaleX = innerW / GRID_SIZE
    const scaleY = innerH / GRID_SIZE

    const pathGen = d3.geoPath()

    // Draw contour fills
    g.append('g')
      .selectAll('path.contour')
      .data(contours)
      .join('path')
      .attr('class', 'contour')
      .attr('transform', `scale(${scaleX}, ${scaleY})`)
      .attr('d', pathGen)
      .attr('fill', d => colorScale(d.value))
      .attr('opacity', 0.85)
      .attr('stroke', 'none')

    // Contour lines on top
    g.append('g')
      .selectAll('path.contour-line')
      .data(contours.filter((_, i) => i % 2 === 0))
      .join('path')
      .attr('class', 'contour-line')
      .attr('transform', `scale(${scaleX}, ${scaleY})`)
      .attr('d', pathGen)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(0,0,0,0.25)')
      .attr('stroke-width', 0.3)

    // GD path
    const gdGroup = g.append('g').attr('class', 'gd-path')

    // Convert GD path from world coords to pixel coords
    const gdPixels = GD_PATH.map(pt => ({
      px: x(pt.x),
      py: y(pt.y),
      loss: pt.loss,
    }))

    const lineGen = d3.line<{ px: number; py: number }>()
      .x(d => d.px)
      .y(d => d.py)
      .curve(d3.curveCatmullRom)

    const pathEl = gdGroup.append('path')
      .datum(gdPixels)
      .attr('fill', 'none')
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .attr('d', lineGen)

    // Animate path drawing
    const totalLength = (pathEl.node() as SVGPathElement).getTotalLength()
    pathEl
      .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .delay(200)
      .duration(1200)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0)

    // Dots on path (delayed)
    gdGroup.selectAll('circle.step-dot')
      .data(gdPixels.filter((_, i) => i % 5 === 0))
      .join('circle')
      .attr('class', 'step-dot')
      .attr('cx', d => d.px)
      .attr('cy', d => d.py)
      .attr('r', 2.5)
      .attr('fill', 'white')
      .attr('opacity', 0)
      .transition()
      .delay(1400)
      .duration(200)
      .attr('opacity', 0.9)

    // Start point
    gdGroup.append('circle')
      .attr('cx', gdPixels[0].px)
      .attr('cy', gdPixels[0].py)
      .attr('r', 5)
      .attr('fill', '#fbbf24')
      .attr('stroke', 'white')
      .attr('stroke-width', 1.5)

    // End/minimum point
    const last = gdPixels[gdPixels.length - 1]
    gdGroup.append('circle')
      .attr('cx', last.px)
      .attr('cy', last.py)
      .attr('r', 6)
      .attr('fill', '#22c55e')
      .attr('stroke', 'white')
      .attr('stroke-width', 1.5)
      .attr('opacity', 0)
      .transition()
      .delay(1600)
      .duration(300)
      .attr('opacity', 1)

    // Axes
    g.append('g')
      .attr('transform', `translate(0,${innerH})`)
      .call(d3.axisBottom(x).ticks(5).tickSize(4))
      .call(ax => ax.select('.domain').attr('stroke', '#475569'))
      .call(ax => ax.selectAll('.tick line').attr('stroke', '#475569'))
      .call(ax => ax.selectAll('.tick text').attr('fill', '#94a3b8').attr('font-size', '10px'))

    g.append('text')
      .attr('x', innerW / 2).attr('y', innerH + 34)
      .attr('text-anchor', 'middle').attr('fill', '#64748b').attr('font-size', '11px')
      .text('Weight 1')

    g.append('g')
      .call(d3.axisLeft(y).ticks(5).tickSize(4))
      .call(ax => ax.select('.domain').attr('stroke', '#475569'))
      .call(ax => ax.selectAll('.tick line').attr('stroke', '#475569'))
      .call(ax => ax.selectAll('.tick text').attr('fill', '#94a3b8').attr('font-size', '10px'))

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerH / 2).attr('y', -42)
      .attr('text-anchor', 'middle').attr('fill', '#64748b').attr('font-size', '11px')
      .text('Weight 2')

    // Color legend
    const legendW = 120
    const legendH = 10
    const legendX = innerW - legendW - 4
    const legendY = 4

    const defs = svg.append('defs')
    const gradient = defs.append('linearGradient').attr('id', 'loss-legend-grad')
    gradient.append('stop').attr('offset', '0%').attr('stop-color', d3.interpolateRdYlGn(0))
    gradient.append('stop').attr('offset', '100%').attr('stop-color', d3.interpolateRdYlGn(1))

    const legendG = g.append('g').attr('transform', `translate(${legendX},${legendY})`)
    legendG.append('rect')
      .attr('width', legendW).attr('height', legendH).attr('rx', 2)
      .attr('fill', 'url(#loss-legend-grad)')

    legendG.append('text').attr('x', 0).attr('y', legendH + 12)
      .attr('fill', '#ef4444').attr('font-size', '9px').text('High Loss')

    legendG.append('text').attr('x', legendW).attr('y', legendH + 12)
      .attr('text-anchor', 'end').attr('fill', '#22c55e').attr('font-size', '9px').text('Low Loss')

    // Legend: path annotations
    const annotG = g.append('g').attr('transform', `translate(8,${innerH - 40})`)
    annotG.append('circle').attr('cx', 6).attr('cy', 6).attr('r', 5).attr('fill', '#fbbf24').attr('stroke', 'white').attr('stroke-width', 1)
    annotG.append('text').attr('x', 16).attr('y', 10).attr('fill', '#fbbf24').attr('font-size', '9px').text('Start')
    annotG.append('circle').attr('cx', 6).attr('cy', 24).attr('r', 6).attr('fill', '#22c55e').attr('stroke', 'white').attr('stroke-width', 1)
    annotG.append('text').attr('x', 16).attr('y', 28).attr('fill', '#22c55e').attr('font-size', '9px').text('Minimum (found)')
  }, [innerH, innerW, margin.bottom, margin.left, margin.right, margin.top])

  return (
    <div className="w-full">
      <p className="text-slate-400 text-sm mb-3">
        The loss landscape for a 2-parameter model. Contours show equal-loss curves.
        The white path traces gradient descent finding the minimum.
      </p>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        aria-label="2D loss surface contour plot with gradient descent path"
      />
      <p className="text-slate-500 text-xs mt-2 text-center">
        L(w1, w2) = sin(2w1)·cos(2w2)·2 + 0.5w1² + 0.5w2²
      </p>
    </div>
  )
}

export default LossSurface3D
