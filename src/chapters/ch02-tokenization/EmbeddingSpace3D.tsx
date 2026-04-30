import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { EMBEDDINGS_2D, CATEGORY_COLORS, EMBEDDING_CATEGORIES } from '../../data/embeddings-2d'
import type { EmbeddingCategory } from '../../data/embeddings-2d'

const MARGIN = { top: 20, right: 20, bottom: 40, left: 40 }
const VIEW_W = 560
const VIEW_H = 420

interface TooltipState {
  word: string
  category: string
  x: number
  y: number
  visible: boolean
}

export default function EmbeddingSpace3D() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [hoveredWord, setHoveredWord] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<TooltipState>({
    word: '',
    category: '',
    x: 0,
    y: 0,
    visible: false,
  })
  const [activeCategories, setActiveCategories] = useState<Set<EmbeddingCategory>>(
    new Set(EMBEDDING_CATEGORIES)
  )

  const toggleCategory = (cat: EmbeddingCategory) => {
    setActiveCategories((prev) => {
      const next = new Set(prev)
      if (next.has(cat)) {
        if (next.size > 1) next.delete(cat)
      } else {
        next.add(cat)
      }
      return next
    })
  }

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const innerW = VIEW_W - MARGIN.left - MARGIN.right
    const innerH = VIEW_H - MARGIN.top - MARGIN.bottom

    const svgEl = d3.select(svg)

    const xScale = d3.scaleLinear().domain([0, 1]).range([0, innerW])
    const yScale = d3.scaleLinear().domain([0, 1]).range([innerH, 0])

    let root = svgEl.select<SVGGElement>('g.scatter-root')
    if (root.empty()) {
      root = svgEl.append('g').attr('class', 'scatter-root')
      // Grid lines
      const gridG = root.append('g').attr('class', 'grid')
      gridG
        .selectAll('line.grid-h')
        .data(d3.range(0, 1.1, 0.2))
        .enter()
        .append('line')
        .attr('class', 'grid-h')
        .attr('x1', 0)
        .attr('x2', innerW)
        .attr('y1', (d) => yScale(d))
        .attr('y2', (d) => yScale(d))
        .attr('stroke', '#1e293b')
        .attr('stroke-width', 1)

      gridG
        .selectAll('line.grid-v')
        .data(d3.range(0, 1.1, 0.2))
        .enter()
        .append('line')
        .attr('class', 'grid-v')
        .attr('x1', (d) => xScale(d))
        .attr('x2', (d) => xScale(d))
        .attr('y1', 0)
        .attr('y2', innerH)
        .attr('stroke', '#1e293b')
        .attr('stroke-width', 1)

      // X axis
      root
        .append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${innerH})`)
        .call(d3.axisBottom(xScale).ticks(5).tickFormat(() => ''))
        .call((ax) => ax.select('.domain').attr('stroke', '#334155'))
        .call((ax) => ax.selectAll('line').attr('stroke', '#334155'))

      root
        .append('text')
        .attr('x', innerW / 2)
        .attr('y', innerH + 32)
        .attr('text-anchor', 'middle')
        .attr('fill', '#64748b')
        .attr('font-size', 11)
        .text('Embedding dimension 1 (PCA)')

      // Y axis
      root
        .append('g')
        .attr('class', 'y-axis')
        .call(d3.axisLeft(yScale).ticks(5).tickFormat(() => ''))
        .call((ax) => ax.select('.domain').attr('stroke', '#334155'))
        .call((ax) => ax.selectAll('line').attr('stroke', '#334155'))

      root
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -innerH / 2)
        .attr('y', -28)
        .attr('text-anchor', 'middle')
        .attr('fill', '#64748b')
        .attr('font-size', 11)
        .text('Embedding dimension 2 (PCA)')
    }

    root.attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)

    const filtered = EMBEDDINGS_2D.filter((d) =>
      activeCategories.has(d.category as EmbeddingCategory)
    )

    // Points
    const circles = root
      .selectAll<SVGCircleElement, typeof EMBEDDINGS_2D[0]>('circle.word-point')
      .data(filtered, (d) => d.word)

    circles
      .enter()
      .append('circle')
      .attr('class', 'word-point')
      .attr('cx', (d) => xScale(d.x))
      .attr('cy', (d) => yScale(d.y))
      .attr('r', 0)
      .merge(circles)
      .attr('cx', (d) => xScale(d.x))
      .attr('cy', (d) => yScale(d.y))
      .attr('fill', (d) => CATEGORY_COLORS[d.category as EmbeddingCategory] ?? '#64748b')
      .attr('opacity', (d) => (hoveredWord === null || d.word === hoveredWord ? 0.85 : 0.25))
      .attr('stroke', (d) => (d.word === hoveredWord ? '#fff' : 'transparent'))
      .attr('stroke-width', 2)
      .attr('cursor', 'pointer')
      .attr('role', 'button')
      .attr('aria-label', (d) => `${d.word} (${d.category})`)
      .transition()
      .duration(300)
      .attr('r', (d) => (d.word === hoveredWord ? 7 : 5))

    circles.exit().transition().duration(200).attr('r', 0).remove()

    // Labels
    const labels = root
      .selectAll<SVGTextElement, typeof EMBEDDINGS_2D[0]>('text.word-label')
      .data(filtered, (d) => d.word)

    labels
      .enter()
      .append('text')
      .attr('class', 'word-label')
      .merge(labels)
      .attr('x', (d) => xScale(d.x) + 7)
      .attr('y', (d) => yScale(d.y) + 4)
      .attr('font-size', 10)
      .attr('font-family', 'ui-sans-serif, sans-serif')
      .attr('fill', (d) => CATEGORY_COLORS[d.category as EmbeddingCategory] ?? '#64748b')
      .attr('opacity', (d) => (hoveredWord === null || d.word === hoveredWord ? 1 : 0.2))
      .attr('font-weight', (d) => (d.word === hoveredWord ? '700' : '400'))
      .attr('pointer-events', 'none')
      .text((d) => d.word)

    labels.exit().remove()

    // Mouse events via re-selection
    root
      .selectAll<SVGCircleElement, typeof EMBEDDINGS_2D[0]>('circle.word-point')
      .on('mouseenter', function (event: MouseEvent, d) {
        setHoveredWord(d.word)
        const rect = svg.getBoundingClientRect()
        setTooltip({
          word: d.word,
          category: d.category,
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
          visible: true,
        })
      })
      .on('mouseleave', () => {
        setHoveredWord(null)
        setTooltip((t) => ({ ...t, visible: false }))
      })
  }, [activeCategories, hoveredWord])

  return (
    <div className="space-y-4">
      {/* Legend / filter */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {EMBEDDING_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => toggleCategory(cat)}
            aria-pressed={activeCategories.has(cat)}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-full border transition-all ${
              activeCategories.has(cat)
                ? 'border-slate-600 bg-slate-800/60 opacity-100'
                : 'border-slate-700/30 bg-slate-900/40 opacity-40'
            }`}
          >
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: CATEGORY_COLORS[cat] }}
              aria-hidden
            />
            <span className="text-slate-300 capitalize">{cat}</span>
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="relative w-full">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          width="100%"
          role="img"
          aria-label="2D embedding space scatter plot showing word clusters by category"
          className="rounded-lg bg-slate-900/40"
        />

        {/* Tooltip */}
        {tooltip.visible && (
          <div
            className="absolute pointer-events-none z-10 px-2.5 py-1.5 text-xs rounded-lg bg-slate-800 border border-slate-700 shadow-xl"
            style={{ left: tooltip.x + 10, top: tooltip.y - 10 }}
            role="tooltip"
          >
            <span className="font-semibold text-white">{tooltip.word}</span>
            <span className="text-slate-400 ml-1.5 capitalize">{tooltip.category}</span>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-500 leading-relaxed">
        Words with similar meanings cluster together in embedding space. These are 2D projections
        of higher-dimensional learned embeddings, grouped by semantic category.
      </p>
    </div>
  )
}
