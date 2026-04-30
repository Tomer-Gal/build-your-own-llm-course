import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface DiagramNode {
  id: string
  label: string
  sublabel?: string
  color: string
  borderColor: string
  explanation: string
}

const NODES: DiagramNode[] = [
  {
    id: 'input-embeddings',
    label: 'Input Embeddings',
    sublabel: 'token → vector',
    color: 'bg-indigo-500/20',
    borderColor: 'border-indigo-500/60',
    explanation:
      'Each input token is looked up in an embedding table to produce a dense vector of dimension d_model (e.g., 768 for GPT-2 small). The embedding table is learned during training and encodes the semantic relationships between tokens.',
  },
  {
    id: 'positional-encoding',
    label: 'Positional Encoding',
    sublabel: 'position → vector',
    color: 'bg-teal-500/20',
    borderColor: 'border-teal-500/60',
    explanation:
      'Transformers have no inherent notion of order — attention is permutation-equivariant. Positional encodings add position information to each token embedding. GPT models use learned absolute position embeddings rather than the sinusoidal encodings from the original paper.',
  },
  {
    id: 'masked-self-attention',
    label: 'Masked Self-Attention',
    sublabel: 'causal attention',
    color: 'bg-blue-500/20',
    borderColor: 'border-blue-500/60',
    explanation:
      'Scaled dot-product attention with a causal mask that prevents each token from attending to future tokens. Multi-head attention runs H independent attention heads in parallel, each learning different relationships. Q, K, V projections are learned weight matrices.',
  },
  {
    id: 'add-norm-1',
    label: 'Add & Norm',
    sublabel: 'residual + layernorm',
    color: 'bg-purple-500/20',
    borderColor: 'border-purple-500/60',
    explanation:
      'The residual connection y = x + Sublayer(LayerNorm(x)) adds the original input back to the sub-layer output. This allows gradients to flow directly and stabilizes training. LayerNorm normalizes across the feature dimension for each token independently.',
  },
  {
    id: 'ffn',
    label: 'Feed-Forward Network',
    sublabel: 'FFN(x) = GELU(xW₁+b₁)W₂+b₂',
    color: 'bg-orange-500/20',
    borderColor: 'border-orange-500/60',
    explanation:
      'A two-layer MLP applied independently to each token. The hidden size is typically 4× d_model. GELU activation introduces non-linearity. The FFN is where most of the model\'s factual knowledge is stored — ablation studies show that factual associations are heavily localized in the FFN weights.',
  },
  {
    id: 'add-norm-2',
    label: 'Add & Norm',
    sublabel: 'residual + layernorm',
    color: 'bg-purple-500/20',
    borderColor: 'border-purple-500/60',
    explanation:
      'Another residual connection and layer normalization after the FFN. This is the complete transformer block. GPT stacks N of these blocks — GPT-2 small uses 12, GPT-3 uses 96. The depth is what gives the model its expressive power.',
  },
  {
    id: 'output',
    label: 'Output (unembedding)',
    sublabel: 'vector → logits',
    color: 'bg-green-500/20',
    borderColor: 'border-green-500/60',
    explanation:
      'After N transformer blocks, a final LayerNorm is applied, then the output is projected to vocabulary logits using an unembedding matrix (often tied to the input embedding weights). A softmax over these logits gives the next-token probability distribution.',
  },
]

const TransformerDiagram: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>('masked-self-attention')

  const selectedNode = NODES.find(n => n.id === selectedId) ?? null

  return (
    <div className="w-full">
      <p className="text-slate-400 text-sm mb-4">Click any component to see details.</p>

      {/* SVG diagram */}
      <svg
        viewBox="0 0 320 560"
        className="w-full max-w-sm mx-auto block"
        aria-label="GPT transformer block diagram"
      >
        {/* Arrow definitions */}
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#475569" />
          </marker>
        </defs>

        {/* Arrows between nodes */}
        {NODES.slice(0, -1).map((_, i) => (
          <line
            key={`arrow-${i}`}
            x1={160}
            y1={52 + i * 72 + 32}
            x2={160}
            y2={52 + (i + 1) * 72 - 2}
            stroke="#475569"
            strokeWidth={1.5}
            markerEnd="url(#arrowhead)"
          />
        ))}

        {/* "×N" bracket for the repeated block */}
        <rect x={8} y={160} width={6} height={218} rx={3} fill="none" stroke="#6366f1" strokeWidth={1.5} strokeDasharray="4 2" />
        <text x={2} y={266} fontSize={9} fill="#818cf8" transform="rotate(-90, 11, 266)" textAnchor="middle">
          × N blocks
        </text>

        {/* Node boxes */}
        {NODES.map((node, i) => {
          const y = 52 + i * 72
          const isSelected = selectedId === node.id
          return (
            <g
              key={node.id}
              onClick={() => setSelectedId(node.id === selectedId ? null : node.id)}
              style={{ cursor: 'pointer' }}
              role="button"
              aria-pressed={isSelected}
              aria-label={node.label}
            >
              {/* Glow when selected */}
              {isSelected && (
                <rect
                  x={28}
                  y={y - 2}
                  width={264}
                  height={58}
                  rx={10}
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth={2}
                  opacity={0.9}
                />
              )}
              <rect
                x={30}
                y={y}
                width={260}
                height={54}
                rx={8}
                className={isSelected ? 'fill-slate-700' : 'fill-slate-800'}
                stroke={isSelected ? '#6366f1' : '#334155'}
                strokeWidth={isSelected ? 1.5 : 1}
              />
              <text x={160} y={y + 20} fontSize={11} fontWeight="600" fill="#e2e8f0" textAnchor="middle">
                {node.label}
              </text>
              {node.sublabel && (
                <text x={160} y={y + 36} fontSize={9} fill="#94a3b8" textAnchor="middle" fontFamily="monospace">
                  {node.sublabel}
                </text>
              )}
            </g>
          )
        })}
      </svg>

      {/* Detail panel */}
      <AnimatePresence mode="wait">
        {selectedNode && (
          <motion.div
            key={selectedNode.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className={`mt-4 p-4 rounded-xl border ${selectedNode.borderColor} ${selectedNode.color}`}
          >
            <h4 className="text-white font-semibold mb-2">{selectedNode.label}</h4>
            <p className="text-slate-300 text-sm leading-relaxed">{selectedNode.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TransformerDiagram
