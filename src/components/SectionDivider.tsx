import React from 'react'

interface SectionDividerProps {
  label?: string
}

const SectionDivider: React.FC<SectionDividerProps> = ({ label }) => {
  if (!label) {
    return <hr className="my-10 border-slate-700/50" />
  }

  return (
    <div className="my-10 flex items-center gap-4" role="separator">
      <div className="flex-1 h-px bg-slate-700/50" />
      <span className="text-xs text-slate-500 uppercase tracking-widest">{label}</span>
      <div className="flex-1 h-px bg-slate-700/50" />
    </div>
  )
}

export default SectionDivider
