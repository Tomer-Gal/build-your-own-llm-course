import { describe, it, expect, beforeEach } from 'vitest'
import { markVisited, getVisited, isVisited, clearProgress } from '../progress'

describe('progress utilities', () => {
  beforeEach(() => {
    clearProgress()
  })

  describe('markVisited', () => {
    it('after calling, isVisited(id) returns true', () => {
      markVisited(3)
      expect(isVisited(3)).toBe(true)
    })

    it('can mark multiple chapters as visited', () => {
      markVisited(1)
      markVisited(2)
      markVisited(5)
      expect(isVisited(1)).toBe(true)
      expect(isVisited(2)).toBe(true)
      expect(isVisited(5)).toBe(true)
    })

    it('calling markVisited twice does not duplicate the entry', () => {
      markVisited(4)
      markVisited(4)
      const visited = getVisited()
      expect(visited.filter(id => id === 4)).toHaveLength(1)
    })
  })

  describe('getVisited', () => {
    it('returns empty array when nothing visited', () => {
      expect(getVisited()).toEqual([])
    })

    it('returns array of visited ids', () => {
      markVisited(1)
      markVisited(3)
      const visited = getVisited()
      expect(visited).toContain(1)
      expect(visited).toContain(3)
      expect(visited).toHaveLength(2)
    })
  })

  describe('isVisited', () => {
    it('returns false for unvisited chapter', () => {
      expect(isVisited(7)).toBe(false)
    })

    it('returns true after markVisited', () => {
      markVisited(7)
      expect(isVisited(7)).toBe(true)
    })

    it('returns false for different chapter id', () => {
      markVisited(7)
      expect(isVisited(8)).toBe(false)
    })
  })

  describe('clearProgress', () => {
    it('after calling, getVisited() returns empty array', () => {
      markVisited(1)
      markVisited(2)
      clearProgress()
      expect(getVisited()).toEqual([])
    })

    it('after calling, isVisited returns false for previously visited', () => {
      markVisited(3)
      clearProgress()
      expect(isVisited(3)).toBe(false)
    })
  })
})
