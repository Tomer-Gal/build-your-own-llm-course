import React, { useState } from 'react'
import { Outlet, useLocation, Link } from 'react-router-dom'
import Sidebar from './Sidebar'
import { CHAPTERS } from '../data/chapters'

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  // Detect chapter route
  const chapterMatch = location.pathname.match(/^\/chapter\/(\d+)$/)
  const currentChapterId = chapterMatch ? parseInt(chapterMatch[1], 10) : null
  const isChapterPage = currentChapterId !== null

  const currentChapter = isChapterPage
    ? CHAPTERS.find((c) => c.id === currentChapterId) ?? null
    : null
  const prevChapter =
    currentChapterId !== null
      ? CHAPTERS.find((c) => c.id === currentChapterId - 1) ?? null
      : null
  const nextChapter =
    currentChapterId !== null
      ? CHAPTERS.find((c) => c.id === currentChapterId + 1) ?? null
      : null

  return (
    <div className="flex h-screen bg-surface-0 overflow-hidden">
      {/* Mobile sidebar overlay — backdrop-blur for premium feel */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 lg:hidden"
          style={{
            background: 'rgba(8,9,15,0.7)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-30 w-72 border-r border-surface-4
          transform transition-transform duration-300 lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{
          background: '#0d1117',
          backgroundImage:
            'radial-gradient(ellipse 60% 40% at 0% 0%, rgba(124,58,237,0.07) 0%, transparent 60%)',
        }}
      >
        <Sidebar onNavigate={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <div
          className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-surface-4"
          style={{ background: 'rgba(13,17,23,0.95)', backdropFilter: 'blur(12px)' }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg transition-colors"
            style={{ color: '#7a8daa' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.08)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'transparent'
            }}
            aria-label="Open navigation menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <span className="font-display font-semibold text-ink-0 text-sm">
            Build Your Own LLM
          </span>
        </div>

        {/* Scrollable content area */}
        <main
          className={`flex-1 overflow-y-auto ${isChapterPage ? 'lg:pb-0 pb-16' : ''}`}
          id="main-content"
        >
          <div className="max-w-4xl mx-auto px-4 py-8 lg:px-8 lg:py-12">
            <Outlet />
          </div>
        </main>

        {/* Mobile bottom nav — only on chapter pages */}
        {isChapterPage && currentChapter && (
          <div
            className="lg:hidden fixed bottom-0 inset-x-0 z-20 flex items-center h-14 border-t border-surface-4"
            style={{
              background: 'rgba(13,17,23,0.9)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            {/* Previous chapter */}
            <div className="w-1/4 flex justify-start pl-3">
              {prevChapter ? (
                <Link
                  to={prevChapter.route}
                  className="flex items-center gap-1 text-xs text-ink-2 py-2 px-2 rounded-lg transition-colors"
                  style={{ transition: 'color 150ms' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = '#f4f6fb'
                    ;(e.currentTarget as HTMLElement).style.background =
                      'rgba(124,58,237,0.08)'
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = '#7a8daa'
                    ;(e.currentTarget as HTMLElement).style.background = 'transparent'
                  }}
                  aria-label={`Previous: Chapter ${prevChapter.id}`}
                >
                  ← Ch {prevChapter.id}
                </Link>
              ) : (
                <span className="w-full" />
              )}
            </div>

            {/* Current chapter title */}
            <div className="flex-1 flex justify-center px-2">
              <p className="text-xs font-medium text-ink-1 truncate text-center">
                {currentChapter.emoji} {currentChapter.title}
              </p>
            </div>

            {/* Next chapter */}
            <div className="w-1/4 flex justify-end pr-3">
              {nextChapter ? (
                <Link
                  to={nextChapter.route}
                  className="flex items-center gap-1 text-xs text-ink-2 py-2 px-2 rounded-lg transition-colors"
                  style={{ transition: 'color 150ms' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = '#f4f6fb'
                    ;(e.currentTarget as HTMLElement).style.background =
                      'rgba(124,58,237,0.08)'
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = '#7a8daa'
                    ;(e.currentTarget as HTMLElement).style.background = 'transparent'
                  }}
                  aria-label={`Next: Chapter ${nextChapter.id}`}
                >
                  Ch {nextChapter.id} →
                </Link>
              ) : (
                <span className="w-full" />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Layout
