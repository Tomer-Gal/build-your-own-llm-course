export function softmax(values: number[]): number[] {
  const maxVal = Math.max(...values)
  const exps = values.map((v) => Math.exp(v - maxVal))
  const sum = exps.reduce((a, b) => a + b, 0)
  return exps.map((e) => e / sum)
}

export function dotProduct(a: number[], b: number[]): number {
  return a.reduce((sum, ai, i) => sum + ai * (b[i] ?? 0), 0)
}

export function scaledDotProduct(q: number[], k: number[]): number {
  const dk = Math.sqrt(q.length)
  return dotProduct(q, k) / dk
}

export function attentionWeights(query: number[], keys: number[][], temperature: number = 1): number[] {
  const scores = keys.map((k) => scaledDotProduct(query, k) / temperature)
  return softmax(scores)
}

export function causalMask(seqLen: number): boolean[][] {
  return Array.from({ length: seqLen }, (_, i) =>
    Array.from({ length: seqLen }, (_, j) => j <= i)
  )
}

export function layerNorm(x: number[], eps: number = 1e-5): number[] {
  const mean = x.reduce((a, b) => a + b, 0) / x.length
  const variance = x.reduce((a, b) => a + (b - mean) ** 2, 0) / x.length
  return x.map((v) => (v - mean) / Math.sqrt(variance + eps))
}

export function gelu(x: number): number {
  return 0.5 * x * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * x ** 3)))
}

export function relu(x: number): number {
  return Math.max(0, x)
}

export function crossEntropy(logits: number[], targetIndex: number): number {
  const probs = softmax(logits)
  return -Math.log(probs[targetIndex] ?? 1e-10)
}
