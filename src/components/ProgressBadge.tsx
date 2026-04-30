import React from 'react'

interface ProgressBadgeProps {
  visited: boolean
  className?: string
}

const ProgressBadge: React.FC<ProgressBadgeProps> = ({ visited, className = '' }) => {
  if (!visited) return null

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium
        bg-green-500/10 text-green-400 border border-green-500/20 rounded-full ${className}`}
      aria-label="Completed"
    >
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
      Done
    </span>
  )
}

export default ProgressBadge
