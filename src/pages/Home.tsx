import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CHAPTERS } from '../data/chapters'
import { isVisited, getVisited, getLastVisited } from '../utils/progress'
import ProgressBadge from '../components/ProgressBadge'

const Home: React.FC = () => {
  const visitedIds = useMemo(() => new Set(getVisited()), [])
  const lastVisited = useMemo(() => getLastVisited(), [])

  const resumeChapter = useMemo(() => {
    if (lastVisited !== null) {
      return CHAPTERS.find((c) => c.id === lastVisited) ?? null
    }
    // Fall back to highest visited id if last-visited key not set yet
    const visited = [...visitedIds].sort((a, b) => b - a)
    if (visited.length > 0) {
      return CHAPTERS.find((c) => c.id === visited[0]) ?? null
    }
    return null
  }, [visitedIds, lastVisited])

  return (
    <div>
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-5xl font-bold text-white mb-4">
          Build Your Own{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-purple-400">
            LLM
          </span>
        </h1>
        <p className="text-xl text-slate-300 leading-relaxed max-w-2xl mb-8">
          By the end, you'll understand exactly how GPT works — from raw bytes to RLHF — with
          interactive visualizations you can manipulate.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <Link
            to="/chapter/1"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Start learning →
          </Link>

          {resumeChapter ? (
            <Link
              to={resumeChapter.route}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface-2 hover:bg-surface-3 text-slate-300 hover:text-white font-medium rounded-lg border border-slate-700/50 transition-all duration-200"
            >
              Resume: Chapter {resumeChapter.id} — {resumeChapter.title} →
            </Link>
          ) : (
            <Link
              to="/chapter/1"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-surface-2 hover:bg-surface-3 text-slate-400 hover:text-slate-200 font-medium rounded-lg border border-slate-700/50 transition-all duration-200"
            >
              Start with Chapter 1 →
            </Link>
          )}
        </div>
      </motion.div>

      {/* Author card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="bg-surface-1 border border-slate-700/50 rounded-xl p-5 mb-10 flex items-start gap-4"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          TG
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Tomer Gal</p>
          <p className="text-xs text-slate-500">
            Global CTO at Deloitte · NVIDIA DLI Instructor · CS Faculty, Braude College
          </p>
        </div>
      </motion.div>

      {/* Chapter grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-14"
        role="list"
        aria-label="Course chapters"
      >
        {CHAPTERS.map((chapter, i) => {
          const visited = isVisited(chapter.id)
          const unmetPrereqs = chapter.prerequisites.filter((pid) => !visitedIds.has(pid))
          return (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i + 0.1, duration: 0.4 }}
              role="listitem"
            >
              <Link
                to={chapter.route}
                className="block bg-surface-1 border border-slate-700/50 rounded-xl p-5 hover:border-brand-500/50 hover:bg-surface-2 transition-all duration-200 group h-full"
                aria-label={`Chapter ${chapter.id}: ${chapter.title}`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <span
                    className="text-3xl group-hover:scale-110 transition-transform duration-200"
                    aria-hidden
                  >
                    {chapter.emoji}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="text-xs text-slate-500">Ch {chapter.id}</span>
                      {/* Estimated read time badge */}
                      <span className="px-1.5 py-0.5 text-xs bg-surface-3 text-slate-400 rounded border border-slate-700/40">
                        ~{chapter.estimatedMinutes} min
                      </span>
                      <ProgressBadge visited={visited} />
                    </div>
                    <h2 className="text-base font-semibold text-white group-hover:text-brand-400 transition-colors">
                      {chapter.title}
                    </h2>
                    <p className="text-xs text-slate-500">{chapter.subtitle}</p>
                  </div>
                </div>

                <p className="text-sm text-slate-400 line-clamp-2 mb-3">{chapter.description}</p>

                <div className="flex flex-wrap gap-1.5 mb-2">
                  {chapter.interactives.slice(0, 2).map((item) => (
                    <span
                      key={item}
                      className="px-2 py-0.5 text-xs bg-brand-500/10 text-brand-400 rounded border border-brand-500/20"
                    >
                      ✦ {item}
                    </span>
                  ))}
                </div>

                {/* Prerequisite hints — only show unmet ones */}
                {unmetPrereqs.length > 0 && (
                  <p className="text-xs text-slate-600 mt-1">
                    Requires Ch {unmetPrereqs.join(', ')}
                  </p>
                )}
              </Link>
            </motion.div>
          )
        })}
      </div>

      {/* How this course works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="border-t border-slate-700/50 pt-10"
      >
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
          How this course works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: '🎯',
              title: 'Interactive first',
              body: 'Manipulate sliders to build intuition before the math lands.',
            },
            {
              icon: '📐',
              title: 'Math made clear',
              body: 'Every formula is explained in plain English — no prerequisites assumed.',
            },
            {
              icon: '🔁',
              title: 'No setup required',
              body: 'Everything runs in the browser. Open a chapter and start learning.',
            },
          ].map(({ icon, title, body }) => (
            <div
              key={title}
              className="bg-surface-1 border border-slate-700/50 rounded-xl p-6 text-center"
            >
              <div className="text-3xl mb-3" aria-hidden>
                {icon}
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default Home
