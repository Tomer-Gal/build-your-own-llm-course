import { describe, it, expect } from 'vitest'
import { CHAPTERS, getChapter } from '../chapters'

describe('CHAPTERS data', () => {
  it('has exactly 9 entries', () => {
    expect(CHAPTERS).toHaveLength(9)
  })

  it('each chapter has id, title, description, route, emoji, topics, interactives', () => {
    CHAPTERS.forEach(chapter => {
      expect(typeof chapter.id).toBe('number')
      expect(typeof chapter.title).toBe('string')
      expect(chapter.title.length).toBeGreaterThan(0)
      expect(typeof chapter.description).toBe('string')
      expect(chapter.description.length).toBeGreaterThan(0)
      expect(typeof chapter.route).toBe('string')
      expect(typeof chapter.emoji).toBe('string')
      expect(Array.isArray(chapter.topics)).toBe(true)
      expect(chapter.topics.length).toBeGreaterThan(0)
      expect(Array.isArray(chapter.interactives)).toBe(true)
      expect(chapter.interactives.length).toBeGreaterThan(0)
    })
  })

  it('routes follow pattern /chapter/N', () => {
    CHAPTERS.forEach((chapter, index) => {
      expect(chapter.route).toBe(`/chapter/${index + 1}`)
    })
  })

  it('chapter ids are sequential from 1 to 9', () => {
    CHAPTERS.forEach((chapter, index) => {
      expect(chapter.id).toBe(index + 1)
    })
  })
})

describe('getChapter', () => {
  it('getChapter(1) returns chapter with id 1', () => {
    const chapter = getChapter(1)
    expect(chapter).toBeDefined()
    expect(chapter?.id).toBe(1)
  })

  it('getChapter(9) returns the last chapter', () => {
    const chapter = getChapter(9)
    expect(chapter).toBeDefined()
    expect(chapter?.id).toBe(9)
  })

  it('getChapter(99) returns undefined', () => {
    expect(getChapter(99)).toBeUndefined()
  })

  it('getChapter(0) returns undefined', () => {
    expect(getChapter(0)).toBeUndefined()
  })

  it('returns correct title for chapter 4', () => {
    const chapter = getChapter(4)
    expect(chapter?.title).toBe('The Transformer Architecture')
  })

  it('returns correct title for chapter 5', () => {
    const chapter = getChapter(5)
    expect(chapter?.title).toBe('Pretraining')
  })
})
