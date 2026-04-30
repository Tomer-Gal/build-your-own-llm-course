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

const LAST_VISITED_KEY = 'llm-course-last-visited'

export function setLastVisited(chapterId: number): void {
  try {
    localStorage.setItem(LAST_VISITED_KEY, String(chapterId))
  } catch {
    // storage unavailable
  }
}

export function getLastVisited(): number | null {
  try {
    const raw = localStorage.getItem(LAST_VISITED_KEY)
    if (!raw) return null
    const id = parseInt(raw, 10)
    return isNaN(id) ? null : id
  } catch {
    return null
  }
}
