import React from 'react'
import { Link } from 'react-router-dom'
import { CHAPTERS } from '../data/chapters'

interface ChapterNavButtonProps {
  currentChapterId: number
  nextChapterTeaser?: string
}

const ChapterNavButton: React.FC<ChapterNavButtonProps> = ({ currentChapterId, nextChapterTeaser }) => {
  const prev = CHAPTERS.find((c) => c.id === currentChapterId - 1)
  const next = CHAPTERS.find((c) => c.id === currentChapterId + 1)
  const isLast = !next

  return (
    <div className="mt-16 pt-8 border-t border-slate-700/50">
      {nextChapterTeaser && next && (
        <div className="mb-6 flex items-start gap-3 bg-surface-2 border border-slate-700/50 rounded-xl p-4">
          <span className="text-brand-500 font-bold mt-0.5 flex-shrink-0 text-lg" aria-hidden>→</span>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">
              What's next
            </p>
            <p className="text-sm text-slate-300">{nextChapterTeaser}</p>
          </div>
        </div>
      )}

      {isLast ? (
        <div className="text-center py-8">
          <p className="text-2xl mb-2" aria-hidden>🎉</p>
          <p className="text-lg font-semibold text-white mb-1">You've completed the course!</p>
          <p className="text-sm text-slate-400">You now understand how LLMs work from first principles.</p>
          <Link
            to="/"
            className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            ← Back to course overview
          </Link>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-4">
          {prev ? (
            <Link
              to={prev.route}
              className="flex items-center gap-2 px-4 py-3 bg-surface-2 hover:bg-surface-3 border border-slate-700/50 rounded-xl text-sm text-slate-400 hover:text-slate-200 transition-colors"
              aria-label={`Previous chapter: ${prev.title}`}
            >
              <span aria-hidden>←</span>
              <div className="text-left">
                <div className="text-xs text-slate-500">Previous</div>
                <div className="font-medium">{prev.emoji} {prev.title}</div>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {next && (
            <Link
              to={next.route}
              className="flex items-center gap-2 px-4 py-3 bg-brand-700/20 hover:bg-brand-700/30 border border-brand-500/30 rounded-xl text-sm text-brand-400 hover:text-brand-300 transition-colors ml-auto"
              aria-label={`Next chapter: ${next.title}`}
            >
              <div className="text-right">
                <div className="text-xs text-brand-500/70">Next chapter</div>
                <div className="font-medium">{next.emoji} {next.title}</div>
              </div>
              <span aria-hidden>→</span>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default ChapterNavButton
