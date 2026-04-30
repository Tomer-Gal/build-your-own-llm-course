import React from 'react'

interface ProgressBadgeProps {
  visited: boolean
  className?: string
}

const ProgressBadge: React.FC<ProgressBadgeProps> = ({ visited, className = '' }) => {
  if (!visited) return null

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full
        bg-gradient-to-r from-emerald-500/20 to-teal-500/20
        border border-emerald-500/30
        text-emerald-400
        shadow-[0_0_8px_rgba(16,185,129,0.2)]
        ${className}`}
      aria-label="Completed"
    >
      {/* Checkmark in small circle */}
      <span
        className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-emerald-500/25 border border-emerald-500/40"
        aria-hidden
      >
        <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 12 12" aria-hidden>
          <path
            fillRule="evenodd"
            d="M10.293 2.293a1 1 0 011.414 1.414l-6 6a1 1 0 01-1.414 0l-3-3a1 1 0 011.414-1.414L5 7.586l5.293-5.293z"
            clipRule="evenodd"
          />
        </svg>
      </span>
      <span>Complete</span>
      <span aria-hidden className="text-emerald-300/70">✦</span>
    </span>
  )
}

export default ProgressBadge
