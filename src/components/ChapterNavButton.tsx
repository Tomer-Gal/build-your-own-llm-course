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
    <div className="mt-16 pt-8 border-t border-surface-4">

      {/* What's next teaser */}
      {nextChapterTeaser && next && (
        <div className="mb-6 flex items-start gap-4 bg-surface-2 border-l-[3px] border-l-violet-500 border border-surface-4 rounded-xl p-4 pl-5">
          <div className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-full bg-violet-500/15 border border-violet-500/30 flex items-center justify-center">
            <span className="text-violet-300 text-xs font-bold" aria-hidden>→</span>
          </div>
          <div>
            <p className="text-xs font-bold text-violet-300/70 uppercase tracking-widest mb-1">
              What's next
            </p>
            <p className="text-sm text-ink-1">{nextChapterTeaser}</p>
          </div>
        </div>
      )}

      {isLast ? (
        /* Course completion celebration */
        <div className="text-center py-10 px-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-surface-2 to-teal-500/10 border border-emerald-500/20">
          <div className="text-3xl mb-3" aria-hidden>🎉</div>
          <h3 className="text-xl font-bold font-display text-ink-0 mb-2">
            You've completed the course!
          </h3>
          <p className="text-sm text-ink-2 mb-6 max-w-sm mx-auto">
            You now understand how LLMs work from first principles. Congratulations on making it this far.
          </p>
          <Link to="/" className="btn-primary">
            <span aria-hidden>←</span>
            Return to Overview
          </Link>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-4">
          {prev ? (
            <Link
              to={prev.route}
              className="flex items-center gap-3 px-4 py-3 bg-surface-2 hover:bg-surface-3 border border-surface-4 rounded-xl text-sm text-ink-2 hover:text-ink-1 transition-all duration-200 ease-spring group"
              aria-label={`Previous chapter: ${prev.title}`}
            >
              <span
                className="text-ink-3 group-hover:text-ink-2 transition-colors duration-200"
                aria-hidden
              >
                ←
              </span>
              <div className="text-left">
                <div className="text-xs text-ink-3 mb-0.5">Previous</div>
                <div className="font-medium text-ink-1">{prev.emoji} {prev.title}</div>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {next && (
            <Link
              to={next.route}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm ml-auto
                bg-gradient-to-r from-violet-600/20 to-cyan-500/10
                border border-violet-500/25 hover:border-violet-500/50
                text-violet-300 hover:text-violet-200
                hover:shadow-glow-violet
                transition-all duration-200 ease-spring group"
              aria-label={`Next chapter: ${next.title}`}
            >
              <div className="text-right">
                <div className="text-xs text-violet-400/60 mb-0.5">Next chapter</div>
                <div className="font-medium">{next.emoji} {next.title}</div>
              </div>
              <span
                className="text-violet-400 group-hover:translate-x-0.5 transition-transform duration-200"
                aria-hidden
              >
                →
              </span>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default ChapterNavButton
