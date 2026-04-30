import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CHAPTERS } from '../data/chapters'
import { isVisited } from '../utils/progress'
import ProgressBadge from '../components/ProgressBadge'

const Home: React.FC = () => {
  return (
    <div>
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h1 className="text-5xl font-bold text-white mb-4">
          Build Your Own <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-purple-400">LLM</span>
        </h1>
        <p className="text-xl text-slate-400 leading-relaxed max-w-2xl mb-6">
          An interactive course teaching transformer architecture, attention mechanisms, and training
          from first principles — with live visualizations you can explore.
        </p>
        <div className="flex flex-wrap gap-3">
          {['9 Chapters', 'Interactive Visualizations', 'Beautiful Math', 'No Setup Required'].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 text-xs font-medium bg-surface-2 text-slate-400 rounded-full border border-slate-700/50"
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Author card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-surface-1 border border-slate-700/50 rounded-xl p-5 mb-10 flex items-start gap-4"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          TG
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Tomer Gal</p>
          <p className="text-xs text-slate-500">Global CTO at Deloitte · NVIDIA DLI Instructor · CS Faculty, Braude College</p>
        </div>
      </motion.div>

      {/* Chapter grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" role="list" aria-label="Course chapters">
        {CHAPTERS.map((chapter, i) => {
          const visited = isVisited(chapter.id)
          return (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
              role="listitem"
            >
              <Link
                to={chapter.route}
                className="block bg-surface-1 border border-slate-700/50 rounded-xl p-5 hover:border-brand-500/50 hover:bg-surface-2 transition-all duration-200 group"
                aria-label={`Chapter ${chapter.id}: ${chapter.title}`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl group-hover:scale-110 transition-transform duration-200" aria-hidden>
                    {chapter.emoji}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs text-slate-500">Ch {chapter.id}</span>
                      <ProgressBadge visited={visited} />
                    </div>
                    <h2 className="text-base font-semibold text-white group-hover:text-brand-400 transition-colors">
                      {chapter.title}
                    </h2>
                    <p className="text-xs text-slate-500">{chapter.subtitle}</p>
                  </div>
                </div>

                <p className="text-sm text-slate-400 line-clamp-2 mb-3">{chapter.description}</p>

                <div className="flex flex-wrap gap-1.5">
                  {chapter.interactives.slice(0, 2).map((item) => (
                    <span
                      key={item}
                      className="px-2 py-0.5 text-xs bg-brand-500/10 text-brand-400 rounded border border-brand-500/20"
                    >
                      ✦ {item}
                    </span>
                  ))}
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default Home
