import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface DiagramNode {
  id: string
  label: string
  sublabel?: string
  explanation: string
  type: 'embedding' | 'positional' | 'attention' | 'norm' | 'ffn' | 'output'
}

const NODES: DiagramNode[] = [
  {
    id: 'input-embeddings',
    label: 'Input Embeddings',
    sublabel: 'token → vector',
    type: 'embedding',
    explanation:
      'Each input token is looked up in an embedding table to produce a dense vector of dimension d_model (e.g., 768 for GPT-2 small). The embedding table is learned during training and encodes the semantic relationships between tokens.',
  },
  {
    id: 'positional-encoding',
    label: 'Positional Encoding',
    sublabel: 'position → vector',
    type: 'positional',
    explanation:
      'Transformers have no inherent notion of order — attention is permutation-equivariant. Positional encodings add position information to each token embedding. GPT models use learned absolute position embeddings rather than the sinusoidal encodings from the original paper.',
  },
  {
    id: 'masked-self-attention',
    label: 'Masked Self-Attention',
    sublabel: 'causal attention',
    type: 'attention',
    explanation:
      'Scaled dot-product attention with a causal mask that prevents each token from attending to future tokens. Multi-head attention runs H independent attention heads in parallel, each learning different relationships. Q, K, V projections are learned weight matrices.',
  },
  {
    id: 'add-norm-1',
    label: 'Add & Norm',
    sublabel: 'residual + layernorm',
    type: 'norm',
    explanation:
      'The residual connection y = x + Sublayer(LayerNorm(x)) adds the original input back to the sub-layer output. This allows gradients to flow directly and stabilizes training. LayerNorm normalizes across the feature dimension for each token independently.',
  },
  {
    id: 'ffn',
    label: 'Feed-Forward Network',
    sublabel: 'FFN(x) = GELU(xW₁+b₁)W₂+b₂',
    type: 'ffn',
    explanation:
      "A two-layer MLP applied independently to each token. The hidden size is typically 4× d_model. GELU activation introduces non-linearity. The FFN is where most of the model's factual knowledge is stored — ablation studies show that factual associations are heavily localized in the FFN weights.",
  },
  {
    id: 'add-norm-2',
    label: 'Add & Norm',
    sublabel: 'residual + layernorm',
    type: 'norm',
    explanation:
      'Another residual connection and layer normalization after the FFN. This is the complete transformer block. GPT stacks N of these blocks — GPT-2 small uses 12, GPT-3 uses 96. The depth is what gives the model its expressive power.',
  },
  {
    id: 'output',
    label: 'Output (unembedding)',
    sublabel: 'vector → logits',
    type: 'output',
    explanation:
      'After N transformer blocks, a final LayerNorm is applied, then the output is projected to vocabulary logits using an unembedding matrix (often tied to the input embedding weights). A softmax over these logits gives the next-token probability distribution.',
  },
]

// Gradient IDs and colors per node type
const TYPE_GRADIENTS: Record<DiagramNode['type'], { id: string; from: string; to: string; dot: string }> = {
  embedding:  { id: 'grad-embedding',  from: '#7c3aed', to: '#6366f1', dot: '#7c3aed' },
  positional: { id: 'grad-positional', from: '#6366f1', to: '#22d3ee', dot: '#6366f1' },
  attention:  { id: 'grad-attention',  from: '#22d3ee', to: '#06b6d4', dot: '#22d3ee' },
  norm:       { id: 'grad-norm',       from: '#64748b', to: '#94a3b8', dot: '#94a3b8' },
  ffn:        { id: 'grad-ffn',        from: '#7c3aed', to: '#f43f5e', dot: '#f43f5e' },
  output:     { id: 'grad-output',     from: '#7c3aed', to: '#22d3ee', dot: '#10b981' },
}

const LEGEND_ITEMS: Array<{ label: string; type: DiagramNode['type'] }> = [
  { label: 'Embedding', type: 'embedding' },
  { label: 'Attention',  type: 'attention' },
  { label: 'FFN',        type: 'ffn' },
  { label: 'Norm',       type: 'norm' },
]

const TransformerDiagram: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>('masked-self-attention')

  const selectedNode = NODES.find((n) => n.id === selectedId) ?? null

  return (
    <div className="w-full">
      <p className="text-ink-2 text-sm mb-4">Click any component to see details.</p>

      {/* SVG diagram */}
      <svg
        viewBox="0 0 320 580"
        className="w-full max-w-sm mx-auto block"
        aria-label="GPT transformer block diagram"
      >
        <defs>
          {/* Arrow gradient */}
          <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>

          {/* Arrow marker */}
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#7c3aed" opacity={0.7} />
          </marker>

          {/* Glow filter for selected box */}
          <filter id="glowFilter" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Per-type stroke gradients (vertical, top→bottom of each box) */}
          {Object.entries(TYPE_GRADIENTS).map(([, g]) => (
            <linearGradient
              key={g.id}
              id={g.id}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor={g.from} />
              <stop offset="100%" stopColor={g.to} />
            </linearGradient>
          ))}
        </defs>

        {/* Arrows between nodes */}
        {NODES.slice(0, -1).map((_, i) => (
          <line
            key={`arrow-${i}`}
            x1={160}
            y1={52 + i * 72 + 32}
            x2={160}
            y2={52 + (i + 1) * 72 - 2}
            stroke="url(#arrowGradient)"
            strokeWidth={1.5}
            markerEnd="url(#arrowhead)"
            opacity={0.6}
          />
        ))}

        {/* "×N" bracket for the repeated block */}
        <rect
          x={8}
          y={160}
          width={6}
          height={218}
          rx={3}
          fill="none"
          stroke="#7c3aed"
          strokeWidth={1.5}
          strokeDasharray="4 2"
          opacity={0.6}
        />
        <text
          x={2}
          y={266}
          fontSize={9}
          fill="#7a8daa"
          transform="rotate(-90, 11, 266)"
          textAnchor="middle"
          fontFamily="'Space Grotesk', system-ui, sans-serif"
        >
          × N layers
        </text>

        {/* Node boxes */}
        {NODES.map((node, i) => {
          const y = 52 + i * 72
          const isSelected = selectedId === node.id
          const gradInfo = TYPE_GRADIENTS[node.type]

          return (
            <g
              key={node.id}
              onClick={() => setSelectedId(node.id === selectedId ? null : node.id)}
              style={{ cursor: 'pointer' }}
              role="button"
              aria-pressed={isSelected}
              aria-label={node.label}
            >
              {/* Glow rect when selected */}
              {isSelected && (
                <rect
                  x={28}
                  y={y - 3}
                  width={264}
                  height={60}
                  rx={12}
                  fill="none"
                  stroke={`url(#${gradInfo.id})`}
                  strokeWidth={2}
                  opacity={0.9}
                  filter="url(#glowFilter)"
                />
              )}

              {/* Main box */}
              <rect
                x={30}
                y={y}
                width={260}
                height={54}
                rx={10}
                ry={10}
                fill={isSelected ? 'rgba(124,58,237,0.12)' : 'rgba(17,24,39,0.9)'}
                stroke={isSelected ? `url(#${gradInfo.id})` : `url(#${gradInfo.id})`}
                strokeWidth={isSelected ? 1.5 : 0.8}
                strokeOpacity={isSelected ? 1 : 0.5}
              />

              {/* Label */}
              <text
                x={160}
                y={y + 20}
                fontSize={12}
                fontWeight="600"
                fill={isSelected ? '#c4b5fd' : '#c8d3e8'}
                textAnchor="middle"
                fontFamily="'Space Grotesk', system-ui, sans-serif"
              >
                {node.label}
              </text>

              {/* Sublabel */}
              {node.sublabel && (
                <text
                  x={160}
                  y={y + 36}
                  fontSize={9}
                  fill={isSelected ? '#7a8daa' : '#3d4f6b'}
                  textAnchor="middle"
                  fontFamily="'JetBrains Mono', monospace"
                >
                  {node.sublabel}
                </text>
              )}
            </g>
          )
        })}

        {/* Legend */}
        {LEGEND_ITEMS.map((item, i) => {
          const g = TYPE_GRADIENTS[item.type]
          return (
            <g key={item.type} transform={`translate(${30 + i * 72}, 556)`}>
              <circle cx={6} cy={6} r={5} fill={g.dot} opacity={0.8} />
              <text x={14} y={10} fontSize={9} fill="#7a8daa" fontFamily="'Space Grotesk', system-ui, sans-serif">
                {item.label}
              </text>
            </g>
          )
        })}
      </svg>

      {/* Detail panel */}
      <AnimatePresence mode="wait">
        {selectedNode && (
          <motion.div
            key={selectedNode.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="mt-4 p-4 rounded-xl bg-surface-2 relative overflow-hidden"
            style={{
              borderLeft: '3px solid transparent',
              borderImage: 'linear-gradient(180deg, #7c3aed, #22d3ee) 1',
            }}
          >
            {/* Subtle top border glow */}
            <div className="absolute inset-0 rounded-xl pointer-events-none"
              style={{ boxShadow: 'inset 0 0 0 1px rgba(124,58,237,0.15)' }} />

            <h4 className="text-violet-300 font-semibold mb-2">{selectedNode.label}</h4>
            <p className="text-ink-1 text-sm leading-relaxed">{selectedNode.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TransformerDiagram
