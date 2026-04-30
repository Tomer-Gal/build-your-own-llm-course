const STORAGE_KEY = 'llm-course-progress'

function readStorage(): Set<number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    const arr = JSON.parse(raw) as number[]
    return new Set(arr)
  } catch {
    return new Set()
  }
}

function writeStorage(visited: Set<number>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...visited]))
  } catch {
    // storage unavailable — silently ignore
  }
}

export function markVisited(chapterId: number): void {
  const visited = readStorage()
  visited.add(chapterId)
  writeStorage(visited)
}

export function getVisited(): number[] {
  return [...readStorage()]
}

export function isVisited(chapterId: number): boolean {
  return readStorage().has(chapterId)
}

export function clearProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // storage unavailable
  }
}
