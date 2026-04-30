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
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-30 w-72 bg-surface-1 border-r border-slate-700/50
          transform transition-transform duration-300 lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <Sidebar onNavigate={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-slate-700/50 bg-surface-1">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-surface-2 transition-colors"
            aria-label="Open navigation menu"
          >
            <svg
              className="w-5 h-5 text-slate-400"
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
          <span className="text-sm font-medium text-slate-200">Build Your Own LLM</span>
        </div>

        {/* Scrollable content area */}
        <main
          className={`flex-1 overflow-y-auto ${isChapterPage ? 'lg:pb-0 pb-14' : ''}`}
          id="main-content"
        >
          <div className="max-w-4xl mx-auto px-4 py-8 lg:px-8 lg:py-12">
            <Outlet />
          </div>
        </main>

        {/* Mobile bottom nav — only on chapter pages */}
        {isChapterPage && currentChapter && (
          <div className="lg:hidden fixed bottom-0 inset-x-0 z-20 flex items-center bg-surface-1 border-t border-slate-700/50 h-14">
            {/* Previous chapter */}
            <div className="w-1/4 flex justify-start pl-3">
              {prevChapter ? (
                <Link
                  to={prevChapter.route}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors py-2 px-2 rounded-lg hover:bg-surface-2"
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
              <p className="text-xs font-medium text-slate-300 truncate text-center">
                {currentChapter.emoji} {currentChapter.title}
              </p>
            </div>

            {/* Next chapter */}
            <div className="w-1/4 flex justify-end pr-3">
              {nextChapter ? (
                <Link
                  to={nextChapter.route}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors py-2 px-2 rounded-lg hover:bg-surface-2"
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
