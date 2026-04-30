import React, { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { CHAPTERS } from '../data/chapters'
import { getVisited, setLastVisited } from '../utils/progress'
import ProgressBadge from './ProgressBadge'

interface SidebarProps {
  onNavigate?: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate }) => {
  const [visited, setVisited] = useState<Set<number>>(new Set())
  const location = useLocation()

  // Refresh visited state whenever location changes
  useEffect(() => {
    setVisited(new Set(getVisited()))
  }, [location.pathname])

  // Detect if we're on a chapter page and track last-visited
  useEffect(() => {
    const match = location.pathname.match(/^\/chapter\/(\d+)$/)
    if (match) {
      const id = parseInt(match[1], 10)
      if (!isNaN(id)) {
        setLastVisited(id)
      }
    }
  }, [location.pathname])

  const completedCount = CHAPTERS.filter((c) => visited.has(c.id)).length

  // Determine which chapter ID is "active" from the URL for the ring highlight
  const activeChapterId = (() => {
    const match = location.pathname.match(/^\/chapter\/(\d+)$/)
    return match ? parseInt(match[1], 10) : null
  })()

  return (
    <aside className="flex flex-col h-full">
      <div className="px-4 py-6 border-b border-slate-700/50">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl" aria-hidden>🧠</span>
          <h2 className="font-bold text-white text-sm leading-tight">
            Build Your Own LLM
          </h2>
        </div>
        <p className="text-xs text-slate-500 ml-8">
          {completedCount}/{CHAPTERS.length} chapters complete
        </p>
        <div className="mt-3 h-1.5 bg-surface-3 rounded-full ml-8">
          <div
            className="h-full bg-gradient-to-r from-brand-600 to-brand-500 rounded-full transition-all duration-500"
            style={{ width: `${(completedCount / CHAPTERS.length) * 100}%` }}
          />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4" aria-label="Course chapters">
        <ul className="space-y-0.5">
          {CHAPTERS.map((chapter) => {
            const isCurrentChapter = chapter.id === activeChapterId
            return (
              <li key={chapter.id}>
                <NavLink
                  to={chapter.route}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `chapter-link ${isActive ? 'active' : ''} ${
                      isCurrentChapter
                        ? 'ring-1 ring-brand-500/40 rounded-lg'
                        : ''
                    }`
                  }
                >
                  <span className="text-xl flex-shrink-0" aria-hidden>{chapter.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Ch {chapter.id}</span>
                      <ProgressBadge visited={visited.has(chapter.id)} />
                      {isCurrentChapter && (
                        <span className="text-xs text-brand-400 font-medium ml-auto">
                          ← Here
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-slate-200 truncate">
                      {chapter.title}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{chapter.subtitle}</p>
                  </div>
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="px-4 py-3 border-t border-slate-700/50">
        <p className="text-xs text-slate-600 text-center">
          by Tomer Gal · Deloitte CTO
        </p>
      </div>
    </aside>
  )
}

export default Sidebar
