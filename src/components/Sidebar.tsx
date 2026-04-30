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

  // Track last-visited chapter on chapter pages
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
  const progressPct = (completedCount / CHAPTERS.length) * 100

  const activeChapterId = (() => {
    const match = location.pathname.match(/^\/chapter\/(\d+)$/)
    return match ? parseInt(match[1], 10) : null
  })()

  return (
    <aside className="flex flex-col h-full">
      {/* ── Logo / header area ────────────────────────────── */}
      <div className="px-4 py-5 border-b border-surface-4">
        <div className="flex items-center gap-2.5 mb-3">
          {/* Brain icon in gradient square */}
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-base"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #22d3ee)' }}
            aria-hidden
          >
            🧠
          </div>
          <h2 className="font-display font-semibold text-ink-0 text-sm leading-snug">
            Build Your Own LLM
          </h2>
        </div>

        {/* Progress */}
        <div className="pl-10">
          <p className="text-xs text-ink-2 mb-2">
            {completedCount}/{CHAPTERS.length} complete
          </p>
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ background: 'rgba(31,45,69,0.8)' }}
          >
            {completedCount > 0 ? (
              <div
                className="h-full rounded-full shimmer-bar transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            ) : (
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progressPct}%`,
                  background: 'linear-gradient(135deg, #7c3aed, #22d3ee)',
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* ── Chapter list ─────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-2 py-3" aria-label="Course chapters">
        <ul className="space-y-0.5">
          {CHAPTERS.map((chapter) => {
            const isActive = chapter.id === activeChapterId
            const isComplete = visited.has(chapter.id)

            return (
              <li key={chapter.id}>
                <NavLink
                  to={chapter.route}
                  onClick={onNavigate}
                  className={({ isActive: navActive }) =>
                    `chapter-link ${navActive ? 'active' : ''}`
                  }
                >
                  {/* Emoji */}
                  <span className="text-xl flex-shrink-0" aria-hidden>
                    {chapter.emoji}
                  </span>

                  <div className="flex-1 min-w-0">
                    {/* Meta row */}
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-xs text-ink-3">Ch {chapter.id}</span>
                      <ProgressBadge visited={isComplete} />
                    </div>

                    {/* Title */}
                    <p
                      className="chapter-link-title truncate"
                      style={isActive ? { color: '#c4b5fd' } : undefined}
                    >
                      {chapter.title}
                    </p>

                    {/* Subtitle */}
                    <p className="text-xs text-ink-3 truncate mt-0.5">{chapter.subtitle}</p>
                  </div>
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* ── Footer ───────────────────────────────────────── */}
      <div className="px-4 py-3 border-t border-surface-4">
        <p className="text-xs text-ink-3 text-center">by Tomer Gal</p>
      </div>
    </aside>
  )
}

export default Sidebar
