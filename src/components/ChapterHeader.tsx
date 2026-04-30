import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { Chapter } from '../data/chapters'

interface ChapterHeaderProps {
  chapter: Chapter
  totalChapters: number
}

const ChapterHeader: React.FC<ChapterHeaderProps> = ({ chapter, totalChapters }) => {
  const shouldReduce = useReducedMotion()
  const progress = (chapter.id / totalChapters) * 100
  const chapterNum = String(chapter.id).padStart(2, '0')

  const fadeUp = (delay: number) => ({
    initial: shouldReduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  })

  return (
    <header className="relative mb-12 overflow-hidden">
      {/* Decorative ghosted chapter number watermark */}
      <span
        className="absolute top-0 right-0 text-7xl font-black select-none pointer-events-none font-display"
        style={{ opacity: 0.04, color: '#a78bfa', lineHeight: 1 }}
        aria-hidden
      >
        {chapterNum}
      </span>

      {/* Chapter label pill */}
      <motion.div {...fadeUp(0)} className="mb-5">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-violet-500/5 border border-violet-500/20 text-violet-300">
          Chapter {chapter.id} of {totalChapters}
        </span>
      </motion.div>

      {/* Emoji + title row */}
      <motion.div {...fadeUp(0.05)} className="flex items-start gap-5 mb-4">
        <span
          className="text-4xl flex-shrink-0 animate-float"
          aria-hidden
          style={{ display: 'inline-block' }}
        >
          {chapter.emoji}
        </span>
        <div>
          <h1 className="text-5xl font-bold font-display text-ink-0 mb-2">
            <span className="text-gradient">{chapter.title}</span>
          </h1>
          <p className="text-lg text-violet-300 font-medium">{chapter.subtitle}</p>
        </div>
      </motion.div>

      {/* Description */}
      <motion.p {...fadeUp(0.1)} className="text-ink-1 text-base leading-8 max-w-2xl mb-6">
        {chapter.description}
      </motion.p>

      {/* Topic pills — staggered */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: shouldReduce ? 0 : 0.06, delayChildren: 0.15 } },
        }}
        className="flex flex-wrap gap-2 mb-8"
      >
        {chapter.topics.map((topic) => (
          <motion.span
            key={topic}
            variants={{
              hidden: { opacity: 0, y: shouldReduce ? 0 : 8 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
            }}
            className="px-3 py-1 text-xs bg-surface-2 border border-surface-4 text-ink-2 rounded-full"
          >
            {topic}
          </motion.span>
        ))}
      </motion.div>

      {/* Progress bar */}
      <div
        className="h-[2px] w-full bg-surface-3 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={chapter.id}
        aria-valuemin={1}
        aria-valuemax={totalChapters}
        aria-label={`Chapter ${chapter.id} of ${totalChapters}`}
      >
        <motion.div
          className="h-full shimmer-bar rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
        />
      </div>
    </header>
  )
}

export default ChapterHeader
