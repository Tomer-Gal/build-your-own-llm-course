import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CHAPTERS } from '../data/chapters'
import { isVisited, getVisited, getLastVisited } from '../utils/progress'
import ProgressBadge from '../components/ProgressBadge'

// Interpolate a color along the violet→cyan gradient by chapter position
function chapterAccentColor(index: number, total: number): string {
  const t = total <= 1 ? 0 : index / (total - 1)
  // violet-600 (#7c3aed) → cyan-400 (#22d3ee)
  const r = Math.round(124 + (34 - 124) * t)
  const g = Math.round(58 + (211 - 58) * t)
  const b = Math.round(237 + (238 - 237) * t)
  return `rgb(${r},${g},${b})`
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
}

const Home: React.FC = () => {
  const visitedIds = useMemo(() => new Set(getVisited()), [])
  const lastVisited = useMemo(() => getLastVisited(), [])

  const resumeChapter = useMemo(() => {
    if (lastVisited !== null) {
      return CHAPTERS.find((c) => c.id === lastVisited) ?? null
    }
    const visited = [...visitedIds].sort((a, b) => b - a)
    if (visited.length > 0) {
      return CHAPTERS.find((c) => c.id === visited[0]) ?? null
    }
    return null
  }, [visitedIds, lastVisited])

  return (
    <div>
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden -mx-4 -mt-8 lg:-mx-8 lg:-mt-12 px-6 pt-20 pb-16 lg:px-12 lg:pt-28 lg:pb-24 bg-gradient-mesh bg-grid-pattern bg-grid mb-0">
        {/* Floating ambient orbs */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-[-80px] left-[-60px] w-[480px] h-[480px] rounded-full bg-violet-600/20 blur-3xl animate-pulse-slow"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-[-60px] right-[-40px] w-[380px] h-[380px] rounded-full bg-cyan-500/15 blur-3xl animate-pulse-slow"
          style={{ animationDelay: '2s' }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] rounded-full bg-violet-600/8 blur-3xl"
        />

        <div className="relative z-10 max-w-3xl">
          {/* Chapter count pill */}
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 mb-6"
          >
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-violet-300 tracking-wide"
              style={{
                background: 'rgba(124,58,237,0.1)',
                border: '1px solid rgba(124,58,237,0.3)',
                boxShadow: '0 0 12px rgba(124,58,237,0.1)',
              }}
            >
              9 Chapters
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="font-display text-6xl md:text-7xl font-extrabold mb-5 leading-none tracking-tight"
          >
            <span className="text-gradient">Build Your Own</span>
            <br />
            <span className="text-ink-0">LLM</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-xl text-ink-1 leading-relaxed max-w-2xl mb-8"
          >
            By the end, you'll understand exactly how GPT works — from raw bytes to RLHF — with
            interactive visualizations you can manipulate in the browser.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap items-center gap-3 mb-10"
          >
            <Link to="/chapter/1" className="btn-primary">
              Start Learning →
            </Link>
            {resumeChapter ? (
              <Link to={resumeChapter.route} className="btn-secondary">
                Resume: Ch {resumeChapter.id} — {resumeChapter.title}
              </Link>
            ) : (
              <Link to="/chapter/1" className="btn-secondary">
                Chapter 1: The Big Picture
              </Link>
            )}
          </motion.div>

          {/* Social proof strip */}
          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-2"
          >
            {[
              '9 Interactive Chapters',
              'D3.js Visualizations',
              'Beautiful Math',
              'Zero Setup',
            ].map((item, i) => (
              <span key={item} className="flex items-center gap-2">
                {i > 0 && <span className="hidden sm:inline text-ink-3">·</span>}
                {item}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Stats bar ──────────────────────────────────────── */}
      <motion.section
        custom={5}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-4 border border-surface-4 rounded-2xl overflow-hidden mb-14 mt-10"
        style={{ background: 'rgba(13,17,23,0.8)' }}
      >
        {[
          { value: '9', label: 'Chapters' },
          { value: '25+', label: 'Interactive Widgets' },
          { value: '50+', label: 'Mathematical Concepts' },
          { value: '0', label: 'Setup Required' },
        ].map(({ value, label }, i) => (
          <div
            key={label}
            className={`flex flex-col items-center justify-center py-6 px-4 ${
              i < 3 ? 'border-r border-surface-4' : ''
            } ${i >= 2 ? 'border-t md:border-t-0 border-surface-4' : ''}`}
          >
            <span className="text-gradient font-display text-3xl font-black mb-1">{value}</span>
            <span className="text-ink-2 text-xs text-center">{label}</span>
          </div>
        ))}
      </motion.section>

      {/* ── How it works ───────────────────────────────────── */}
      <motion.section
        custom={6}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mb-14"
      >
        <h2 className="section-heading mb-6">How this course works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: '🎯',
              title: 'Interact First',
              body: 'Manipulate sliders and widgets to build intuition before the math lands.',
            },
            {
              icon: '📐',
              title: 'Math Made Clear',
              body: 'Every formula is explained in plain English — no prerequisites assumed.',
            },
            {
              icon: '⚡',
              title: 'No Setup',
              body: 'Everything runs in the browser. Open a chapter and start learning immediately.',
            },
          ].map(({ icon, title, body }) => (
            <div key={title} className="interactive-card text-center">
              <div className="text-3xl mb-3" aria-hidden>
                {icon}
              </div>
              <h3 className="font-display font-semibold text-ink-0 mb-2">{title}</h3>
              <p className="text-sm text-ink-1 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── Chapter grid ───────────────────────────────────── */}
      <section className="mb-14">
        <h2 className="section-heading mb-6">Course Curriculum</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" role="list" aria-label="Course chapters">
          {CHAPTERS.map((chapter, i) => {
            const visited = isVisited(chapter.id)
            const unmetPrereqs = chapter.prerequisites.filter((pid) => !visitedIds.has(pid))
            const accentColor = chapterAccentColor(i, CHAPTERS.length)

            return (
              <motion.div
                key={chapter.id}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                role="listitem"
              >
                <Link
                  to={chapter.route}
                  aria-label={`Chapter ${chapter.id}: ${chapter.title}`}
                  className="group relative block h-full rounded-2xl overflow-hidden transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                  style={{
                    background: '#111827',
                    boxShadow:
                      '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.boxShadow =
                      '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.3)'
                    el.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.boxShadow =
                      '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)'
                    el.style.transform = 'translateY(0px)'
                  }}
                >
                  {/* Left accent bar */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-[3px]"
                    style={{ background: accentColor }}
                    aria-hidden
                  />

                  {/* Watermark chapter number */}
                  <span
                    className="absolute top-3 right-4 text-5xl font-black text-violet-400 select-none pointer-events-none"
                    style={{ opacity: 0.1 }}
                    aria-hidden
                  >
                    {chapter.id}
                  </span>

                  <div className="pl-5 pr-5 pt-5 pb-4">
                    {/* Header row */}
                    <div className="flex items-start gap-3 mb-3">
                      <span
                        className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-200"
                        aria-hidden
                      >
                        {chapter.emoji}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-xs text-ink-3">Ch {chapter.id}</span>
                          <span
                            className="px-1.5 py-0.5 text-xs rounded"
                            style={{
                              background: 'rgba(31,45,69,0.8)',
                              color: '#7a8daa',
                              border: '1px solid rgba(255,255,255,0.06)',
                            }}
                          >
                            ~{chapter.estimatedMinutes} min
                          </span>
                          <ProgressBadge visited={visited} />
                        </div>
                        <h3 className="font-display font-semibold text-ink-0 text-base leading-snug">
                          {chapter.title}
                        </h3>
                        <p className="text-xs text-ink-2 mt-0.5">{chapter.subtitle}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-ink-1 line-clamp-2 mb-3 leading-relaxed">
                      {chapter.description}
                    </p>

                    {/* Interactive badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {chapter.interactives.slice(0, 2).map((item) => (
                        <span
                          key={item}
                          className="px-2 py-0.5 text-xs rounded"
                          style={{
                            background: 'rgba(124,58,237,0.08)',
                            color: '#a78bfa',
                            border: '1px solid rgba(124,58,237,0.18)',
                          }}
                        >
                          ✦ {item}
                        </span>
                      ))}
                    </div>

                    {/* Unmet prereqs */}
                    {unmetPrereqs.length > 0 && (
                      <p className="text-xs text-ink-3 mt-2">
                        Requires Ch {unmetPrereqs.join(', ')}
                      </p>
                    )}
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* ── Author section ─────────────────────────────────── */}
      <motion.section
        custom={10}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="border-t border-surface-4 pt-8 pb-4 flex items-center gap-4"
      >
        <div
          className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #22d3ee)' }}
          aria-hidden
        >
          TG
        </div>
        <div>
          <p className="text-sm font-semibold text-ink-0">Tomer Gal</p>
          <p className="text-xs text-ink-2">
            Global CTO at Deloitte · NVIDIA DLI Instructor · CS Faculty, Braude College
          </p>
        </div>
      </motion.section>
    </div>
  )
}

export default Home
