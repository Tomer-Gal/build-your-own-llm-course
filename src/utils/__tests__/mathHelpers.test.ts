import { describe, it, expect } from 'vitest'
import {
  softmax,
  dotProduct,
  scaledDotProduct,
  attentionWeights,
  causalMask,
  layerNorm,
  gelu,
  relu,
  crossEntropy,
} from '../mathHelpers'

describe('softmax', () => {
  it('output sums to 1', () => {
    const result = softmax([1, 2, 3])
    const sum = result.reduce((a, b) => a + b, 0)
    expect(sum).toBeCloseTo(1, 10)
  })

  it('preserves relative order', () => {
    const result = softmax([1, 2, 3])
    expect(result[0]).toBeLessThan(result[1])
    expect(result[1]).toBeLessThan(result[2])
  })

  it('handles single element', () => {
    const result = softmax([5])
    expect(result).toHaveLength(1)
    expect(result[0]).toBeCloseTo(1, 10)
  })

  it('handles negative values', () => {
    const result = softmax([-1, 0, 1])
    const sum = result.reduce((a, b) => a + b, 0)
    expect(sum).toBeCloseTo(1, 10)
  })
})

describe('dotProduct', () => {
  it('computes basic case', () => {
    expect(dotProduct([1, 2, 3], [4, 5, 6])).toBeCloseTo(32)
  })

  it('handles different lengths gracefully (treats missing as 0)', () => {
    expect(dotProduct([1, 2, 3], [1])).toBeCloseTo(1)
  })

  it('returns 0 for zero vectors', () => {
    expect(dotProduct([0, 0], [0, 0])).toBe(0)
  })
})

describe('scaledDotProduct', () => {
  it('divides by sqrt(length)', () => {
    const q = [1, 2, 3, 4]
    const k = [1, 2, 3, 4]
    const raw = dotProduct(q, k)
    const scaled = scaledDotProduct(q, k)
    expect(scaled).toBeCloseTo(raw / Math.sqrt(q.length), 10)
  })

  it('produces a smaller value than raw dot product for vectors with norm > 1', () => {
    const q = [2, 2, 2, 2]
    const k = [2, 2, 2, 2]
    expect(scaledDotProduct(q, k)).toBeLessThan(dotProduct(q, k))
  })
})

describe('attentionWeights', () => {
  it('output sums to 1', () => {
    const query = [1, 0, 0]
    const keys = [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
    const weights = attentionWeights(query, keys)
    const sum = weights.reduce((a, b) => a + b, 0)
    expect(sum).toBeCloseTo(1, 10)
  })

  it('high temperature makes distribution more uniform', () => {
    const query = [2, 0, 0]
    const keys = [[2, 0, 0], [0, 0, 0], [0, 0, 0]]
    const lowTemp = attentionWeights(query, keys, 0.1)
    const highTemp = attentionWeights(query, keys, 10)
    // With low temperature, the max weight should be much higher (more peaked)
    // With high temperature, weights should be more uniform
    const maxLow = Math.max(...lowTemp)
    const maxHigh = Math.max(...highTemp)
    expect(maxLow).toBeGreaterThan(maxHigh)
  })

  it('low temperature makes distribution more peaked', () => {
    const query = [3, 0]
    const keys = [[3, 0], [0, 0]]
    const weights = attentionWeights(query, keys, 0.01)
    // With very low temperature, highest score key should dominate
    expect(weights[0]).toBeGreaterThan(0.99)
  })
})

describe('causalMask', () => {
  it('produces 4x4 output for seqLen=4', () => {
    const mask = causalMask(4)
    expect(mask).toHaveLength(4)
    mask.forEach(row => expect(row).toHaveLength(4))
  })

  it('upper triangle is false (positions cannot attend to future)', () => {
    const mask = causalMask(4)
    expect(mask[0][1]).toBe(false)
    expect(mask[0][2]).toBe(false)
    expect(mask[0][3]).toBe(false)
    expect(mask[1][2]).toBe(false)
    expect(mask[1][3]).toBe(false)
    expect(mask[2][3]).toBe(false)
  })

  it('diagonal is true (can attend to self)', () => {
    const mask = causalMask(4)
    expect(mask[0][0]).toBe(true)
    expect(mask[1][1]).toBe(true)
    expect(mask[2][2]).toBe(true)
    expect(mask[3][3]).toBe(true)
  })

  it('lower triangle is true (can attend to past)', () => {
    const mask = causalMask(4)
    expect(mask[1][0]).toBe(true)
    expect(mask[2][0]).toBe(true)
    expect(mask[2][1]).toBe(true)
    expect(mask[3][0]).toBe(true)
    expect(mask[3][1]).toBe(true)
    expect(mask[3][2]).toBe(true)
  })
})

describe('layerNorm', () => {
  it('mean is approximately 0 after normalization', () => {
    const input = [1, 2, 3, 4, 5]
    const result = layerNorm(input)
    const mean = result.reduce((a, b) => a + b, 0) / result.length
    expect(mean).toBeCloseTo(0, 5)
  })

  it('variance is approximately 1 after normalization', () => {
    const input = [1, 3, 5, 7, 9]
    const result = layerNorm(input)
    const mean = result.reduce((a, b) => a + b, 0) / result.length
    const variance = result.reduce((a, b) => a + (b - mean) ** 2, 0) / result.length
    expect(variance).toBeCloseTo(1, 4)
  })

  it('handles constant input without crashing', () => {
    // All same values — variance is 0, result should be all 0 (eps prevents div by zero)
    const result = layerNorm([2, 2, 2])
    result.forEach(v => expect(isFinite(v)).toBe(true))
  })
})

describe('gelu', () => {
  it('gelu(0) ≈ 0', () => {
    expect(gelu(0)).toBeCloseTo(0, 5)
  })

  it('gelu(1) > 0', () => {
    expect(gelu(1)).toBeGreaterThan(0)
  })

  it('gelu(-1) < 0', () => {
    expect(gelu(-1)).toBeLessThan(0)
  })

  it('gelu is monotonically increasing for large positive x', () => {
    expect(gelu(3)).toBeGreaterThan(gelu(2))
    expect(gelu(2)).toBeGreaterThan(gelu(1))
  })
})

describe('relu', () => {
  it('relu(0) = 0', () => {
    expect(relu(0)).toBe(0)
  })

  it('relu of positive is identity', () => {
    expect(relu(3)).toBe(3)
  })

  it('relu of negative is 0', () => {
    expect(relu(-5)).toBe(0)
  })
})

describe('crossEntropy', () => {
  it('returns a finite positive number', () => {
    const logits = [2.0, 1.0, 0.5]
    const loss = crossEntropy(logits, 0)
    expect(isFinite(loss)).toBe(true)
    expect(loss).toBeGreaterThan(0)
  })

  it('lower loss when target is the highest logit', () => {
    const logits = [5.0, 1.0, 0.5]
    const lossCorrect = crossEntropy(logits, 0)   // target matches highest
    const lossWrong = crossEntropy(logits, 2)      // target matches lowest
    expect(lossCorrect).toBeLessThan(lossWrong)
  })

  it('returns positive value for any valid target', () => {
    const logits = [1.0, 2.0, 3.0]
    expect(crossEntropy(logits, 0)).toBeGreaterThan(0)
    expect(crossEntropy(logits, 1)).toBeGreaterThan(0)
    expect(crossEntropy(logits, 2)).toBeGreaterThan(0)
  })
})
