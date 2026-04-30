import React from 'react'
import type { Chapter } from '../data/chapters'

interface ChapterHeaderProps {
  chapter: Chapter
  totalChapters: number
}

const ChapterHeader: React.FC<ChapterHeaderProps> = ({ chapter, totalChapters }) => {
  const progress = (chapter.id / totalChapters) * 100

  return (
    <header className="mb-12">
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
        <span>Chapter {chapter.id}</span>
        <span>·</span>
        <span>{chapter.id} of {totalChapters}</span>
      </div>

      <div className="flex items-start gap-4 mb-6">
        <span className="text-5xl" aria-hidden>{chapter.emoji}</span>
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">{chapter.title}</h1>
          <p className="text-xl text-brand-500">{chapter.subtitle}</p>
        </div>
      </div>

      <p className="text-slate-400 text-lg leading-relaxed max-w-3xl mb-6">
        {chapter.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {chapter.topics.map((topic) => (
          <span
            key={topic}
            className="px-3 py-1 text-xs bg-surface-2 text-slate-400 rounded-full border border-slate-700/50"
          >
            {topic}
          </span>
        ))}
      </div>

      <div className="h-1 bg-surface-2 rounded-full" role="progressbar" aria-valuenow={chapter.id} aria-valuemax={totalChapters}>
        <div
          className="h-full bg-gradient-to-r from-brand-600 to-brand-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </header>
  )
}

export default ChapterHeader
