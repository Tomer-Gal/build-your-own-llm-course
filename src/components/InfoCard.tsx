import React from 'react'

type Variant = 'info' | 'tip' | 'warning' | 'concept'

const VARIANT_STYLES: Record<Variant, { border: string; bg: string; icon: string; label: string }> = {
  info: {
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/5',
    icon: 'ℹ️',
    label: 'Note',
  },
  tip: {
    border: 'border-green-500/30',
    bg: 'bg-green-500/5',
    icon: '💡',
    label: 'Tip',
  },
  warning: {
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/5',
    icon: '⚠️',
    label: 'Watch out',
  },
  concept: {
    border: 'border-purple-500/30',
    bg: 'bg-purple-500/5',
    icon: '🧩',
    label: 'Key concept',
  },
}

interface InfoCardProps {
  title?: string
  variant?: Variant
  children: React.ReactNode
}

const InfoCard: React.FC<InfoCardProps> = ({ title, variant = 'info', children }) => {
  const styles = VARIANT_STYLES[variant]

  return (
    <div
      className={`border ${styles.border} ${styles.bg} rounded-xl p-5 my-6`}
      role="note"
    >
      <div className="flex items-start gap-3">
        <span className="text-lg flex-shrink-0 mt-0.5" aria-hidden>
          {styles.icon}
        </span>
        <div className="flex-1 min-w-0">
          {title ? (
            <p className="font-semibold text-slate-200 mb-1">{title}</p>
          ) : (
            <p className="font-semibold text-slate-400 text-xs uppercase tracking-wider mb-1">
              {styles.label}
            </p>
          )}
          <div className="text-slate-300 text-sm leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default InfoCard
