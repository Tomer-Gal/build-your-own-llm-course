import React from 'react'

type Variant = 'info' | 'tip' | 'warning' | 'concept'

interface InfoCardProps {
  title?: string
  variant?: Variant
  children: React.ReactNode
}

/* ── Tip variant ─────────────────────────────────────────── */
const TipCard: React.FC<InfoCardProps> = ({ title, children }) => (
  <div
    className="my-6 rounded-xl p-5 bg-emerald-500/5"
    style={{ borderLeft: '3px solid #10b981' }}
    role="note"
  >
    <p className="observe-label" style={{ color: '#10b981' }}>
      💡 What to observe
    </p>
    {title && (
      <p className="font-semibold text-emerald-400 text-sm mb-1">{title}</p>
    )}
    <div className="text-ink-1 text-sm leading-relaxed">{children}</div>
  </div>
)

/* ── Concept variant ──────────────────────────────────────── */
const ConceptCard: React.FC<InfoCardProps> = ({ title, children }) => (
  <div
    className="interactive-card my-6 bg-violet-500/5 border border-violet-500/20"
    role="note"
  >
    <p className="text-xs font-bold uppercase tracking-wider text-violet-300 mb-2">
      🧩 Key Concept
    </p>
    {title && (
      <p className="font-semibold text-violet-300 mb-2">{title}</p>
    )}
    <div className="text-ink-1 text-sm leading-relaxed">{children}</div>
  </div>
)

/* ── Warning variant ──────────────────────────────────────── */
const WarningCard: React.FC<InfoCardProps> = ({ title, children }) => (
  <div
    className="my-6 rounded-xl p-5 bg-amber-500/5"
    style={{ borderLeft: '3px solid #f59e0b' }}
    role="note"
  >
    <p className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
      ⚠️ Watch out
    </p>
    {title && (
      <p className="font-semibold text-amber-400 text-sm mb-1">{title}</p>
    )}
    <div className="text-ink-1 text-sm leading-relaxed">{children}</div>
  </div>
)

/* ── Info variant ─────────────────────────────────────────── */
const InfoVariantCard: React.FC<InfoCardProps> = ({ title, children }) => (
  <div
    className="my-6 rounded-xl p-5 bg-cyan-500/5"
    style={{ borderLeft: '3px solid #06b6d4' }}
    role="note"
  >
    <p className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
      ℹ️ Note
    </p>
    {title && (
      <p className="font-semibold text-cyan-400 text-sm mb-1">{title}</p>
    )}
    <div className="text-ink-1 text-sm leading-relaxed">{children}</div>
  </div>
)

/* ── Main export ──────────────────────────────────────────── */
const InfoCard: React.FC<InfoCardProps> = ({ title, variant = 'info', children }) => {
  switch (variant) {
    case 'tip':
      return <TipCard title={title}>{children}</TipCard>
    case 'concept':
      return <ConceptCard title={title}>{children}</ConceptCard>
    case 'warning':
      return <WarningCard title={title}>{children}</WarningCard>
    case 'info':
    default:
      return <InfoVariantCard title={title}>{children}</InfoVariantCard>
  }
}

export default InfoCard
