import React, { useEffect, useRef, useState, useCallback } from 'react'
import * as d3 from 'd3'
import { gelu, relu } from '../../utils/mathHelpers'

const X_MIN = -3
const X_MAX = 3
const Y_MIN = -0.5
const Y_MAX = 3
const NUM_POINTS = 200

const GELU_COLOR = '#3b82f6'
const RELU_COLOR = '#f97316'

const ActivationViz: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [dragX, setDragX] = useState(1.0)
  const dragging = useRef(false)

  const margin = { top: 20, right: 20, bottom: 36, left: 44 }
  const width = 480
  const height = 280
  const innerW = width - margin.left - margin.right
  const innerH = height - margin.top - margin.bottom

  const xScale = d3.scaleLinear().domain([X_MIN, X_MAX]).range([0, innerW])
  const yScale = d3.scaleLinear().domain([Y_MIN, Y_MAX]).range([innerH, 0])

  const buildPath = useCallback(
    (fn: (x: number) => number): string => {
      const xs = d3.range(NUM_POINTS).map(i => X_MIN + (i / (NUM_POINTS - 1)) * (X_MAX - X_MIN))
      const lineGen = d3.line<number>()
        .x(x => xScale(x))
        .y(x => yScale(fn(x)))
        .curve(d3.curveCatmullRom)
      return lineGen(xs) ?? ''
    },
    [xScale, yScale]
  )

  useEffect(() => {
    if (!svgRef.current) return
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    // Grid lines
    g.append('g')
      .selectAll('line.grid-h')
      .data(yScale.ticks(5))
      .join('line')
      .attr('x1', 0).attr('x2', innerW)
      .attr('y1', d => yScale(d)).attr('y2', d => yScale(d))
      .attr('stroke', '#1e293b').attr('stroke-width', 1)

    g.append('g')
      .selectAll('line.grid-v')
      .data(xScale.ticks(7))
      .join('line')
      .attr('x1', d => xScale(d)).attr('x2', d => xScale(d))
      .attr('y1', 0).attr('y2', innerH)
      .attr('stroke', '#1e293b').attr('stroke-width', 1)

    // Zero axes
    g.append('line')
      .attr('x1', 0).attr('x2', innerW)
      .attr('y1', yScale(0)).attr('y2', yScale(0))
      .attr('stroke', '#334155').attr('stroke-width', 1.5)

    g.append('line')
      .attr('x1', xScale(0)).attr('x2', xScale(0))
      .attr('y1', 0).attr('y2', innerH)
      .attr('stroke', '#334155').attr('stroke-width', 1.5)

    // GELU curve
    g.append('path')
      .attr('d', buildPath(gelu))
      .attr('fill', 'none')
      .attr('stroke', GELU_COLOR)
      .attr('stroke-width', 2.5)

    // ReLU curve
    g.append('path')
      .attr('d', buildPath(relu))
      .attr('fill', 'none')
      .attr('stroke', RELU_COLOR)
      .attr('stroke-width', 2.5)

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${innerH})`)
      .call(d3.axisBottom(xScale).ticks(7).tickSize(4))
      .call(ax => ax.select('.domain').attr('stroke', '#475569'))
      .call(ax => ax.selectAll('.tick line').attr('stroke', '#475569'))
      .call(ax => ax.selectAll('.tick text').attr('fill', '#94a3b8').attr('font-size', '11px'))

    g.append('text')
      .attr('x', innerW / 2).attr('y', innerH + 30)
      .attr('text-anchor', 'middle').attr('fill', '#64748b').attr('font-size', '11px')
      .text('x')

    // Y axis
    g.append('g')
      .call(d3.axisLeft(yScale).ticks(5).tickSize(4))
      .call(ax => ax.select('.domain').attr('stroke', '#475569'))
      .call(ax => ax.selectAll('.tick line').attr('stroke', '#475569'))
      .call(ax => ax.selectAll('.tick text').attr('fill', '#94a3b8').attr('font-size', '11px'))

    // Draggable vertical line — clip to bounds
    const clampedX = Math.max(X_MIN, Math.min(X_MAX, dragX))
    const lineX = xScale(clampedX)

    const dragGroup = g.append('g').attr('class', 'drag-group').style('cursor', 'ew-resize')

    dragGroup.append('line')
      .attr('x1', lineX).attr('x2', lineX)
      .attr('y1', 0).attr('y2', innerH)
      .attr('stroke', '#94a3b8')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4 2')

    // Value labels
    const geluVal = gelu(clampedX)
    const reluVal = relu(clampedX)

    dragGroup.append('circle').attr('cx', lineX).attr('cy', yScale(geluVal))
      .attr('r', 4).attr('fill', GELU_COLOR)

    dragGroup.append('circle').attr('cx', lineX).attr('cy', yScale(reluVal))
      .attr('r', 4).attr('fill', RELU_COLOR)

    const labelX = lineX > innerW * 0.7 ? lineX - 8 : lineX + 8
    const anchor = lineX > innerW * 0.7 ? 'end' : 'start'

    dragGroup.append('text')
      .attr('x', labelX).attr('y', yScale(geluVal) - 6)
      .attr('text-anchor', anchor).attr('fill', GELU_COLOR).attr('font-size', '10px')
      .text(`GELU: ${geluVal.toFixed(3)}`)

    dragGroup.append('text')
      .attr('x', labelX).attr('y', yScale(reluVal) + (reluVal === geluVal ? 16 : -6))
      .attr('text-anchor', anchor).attr('fill', RELU_COLOR).attr('font-size', '10px')
      .text(`ReLU: ${reluVal.toFixed(3)}`)

    // Drag handler overlay
    const dragHandler = d3.drag<SVGRectElement, unknown>()
      .on('start', () => { dragging.current = true })
      .on('drag', (event: d3.D3DragEvent<SVGRectElement, unknown, unknown>) => {
        const newX = xScale.invert(event.x)
        const clamped = Math.max(X_MIN, Math.min(X_MAX, newX))
        setDragX(clamped)
      })
      .on('end', () => { dragging.current = false })

    g.append('rect')
      .attr('x', 0).attr('y', 0)
      .attr('width', innerW).attr('height', innerH)
      .attr('fill', 'transparent')
      .call(dragHandler)
  }, [dragX, buildPath, innerH, innerW, margin.left, margin.top, xScale, yScale])

  return (
    <div className="w-full">
      <div className="flex gap-6 mb-3 text-sm">
        <span className="flex items-center gap-2">
          <span style={{ background: GELU_COLOR }} className="inline-block w-6 h-0.5" />
          <span className="text-slate-300">GELU</span>
        </span>
        <span className="flex items-center gap-2">
          <span style={{ background: RELU_COLOR }} className="inline-block w-6 h-0.5" />
          <span className="text-slate-300">ReLU</span>
        </span>
        <span className="text-slate-500 text-xs self-center">Drag to inspect values</span>
      </div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        aria-label="GELU and ReLU activation functions chart"
      />
    </div>
  )
}

export default ActivationViz
