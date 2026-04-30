import * as d3 from 'd3'

export const attentionColorScale = d3
  .scaleSequential(d3.interpolateBlues)
  .domain([0, 1])

export const lossColorScale = d3
  .scaleSequential(d3.interpolateRdYlGn)
  .domain([3, 0])

export const embeddingColorScale = d3
  .scaleOrdinal(d3.schemeTableau10)

export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}
