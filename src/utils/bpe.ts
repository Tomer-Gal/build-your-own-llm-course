export type TokenPair = [string, string]
export type Vocabulary = Map<string, number>
export type MergeRule = { pair: TokenPair; merged: string; frequency: number }

function getTokenPairs(tokens: string[]): Map<string, number> {
  const pairs = new Map<string, number>()
  for (let i = 0; i < tokens.length - 1; i++) {
    const key = `${tokens[i]}|||${tokens[i + 1]}`
    pairs.set(key, (pairs.get(key) ?? 0) + 1)
  }
  return pairs
}

function decodePairKey(key: string): TokenPair {
  const idx = key.indexOf('|||')
  return [key.slice(0, idx), key.slice(idx + 3)] as TokenPair
}

function applyMerge(tokens: string[], pair: TokenPair): string[] {
  const result: string[] = []
  let i = 0
  while (i < tokens.length) {
    if (i < tokens.length - 1 && tokens[i] === pair[0] && tokens[i + 1] === pair[1]) {
      result.push(pair[0] + pair[1])
      i += 2
    } else {
      result.push(tokens[i]!)
      i++
    }
  }
  return result
}

export function runBPESteps(text: string, numMerges: number): {
  steps: MergeRule[]
  finalTokens: string[]
} {
  let tokens = text.split('').map((c) => (c === ' ' ? 'Ġ' : c))
  const steps: MergeRule[] = []

  for (let step = 0; step < numMerges; step++) {
    const pairs = getTokenPairs(tokens)
    if (pairs.size === 0) break

    let bestKey = ''
    let bestCount = 0
    for (const [key, count] of pairs) {
      if (count > bestCount) {
        bestCount = count
        bestKey = key
      }
    }

    const pair = decodePairKey(bestKey)
    steps.push({ pair, merged: pair[0] + pair[1], frequency: bestCount })
    tokens = applyMerge(tokens, pair)
  }

  return { steps, finalTokens: tokens }
}

export function tokenize(text: string, mergeRules: MergeRule[]): string[] {
  let tokens = text.split('').map((c) => (c === ' ' ? 'Ġ' : c))
  for (const rule of mergeRules) {
    tokens = applyMerge(tokens, rule.pair)
  }
  return tokens
}

export const DEMO_MERGE_RULES: MergeRule[] = (() => {
  const { steps } = runBPESteps('the cat sat on the mat the cat', 8)
  return steps
})()
