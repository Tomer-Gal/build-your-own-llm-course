import React from 'react'

interface SectionDividerProps {
  label?: string
}

const SectionDivider: React.FC<SectionDividerProps> = ({ label }) => {
  if (!label) {
    return (
      <div
        className="my-10 h-px bg-gradient-to-r from-transparent via-surface-4 to-transparent"
        role="separator"
        aria-hidden
      />
    )
  }

  return (
    <div className="my-10 flex items-center gap-4" role="separator">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent to-surface-4" />
      <span className="text-xs text-ink-3 uppercase tracking-widest font-medium flex-shrink-0">
        {label}
      </span>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent to-surface-4" />
    </div>
  )
}

export default SectionDivider
