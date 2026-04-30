import { useState } from 'react'
import { tokenize, DEMO_MERGE_RULES } from '../../utils/bpe'

const TOKEN_COLORS = [
  'bg-indigo-500/25 border-indigo-500/50 text-indigo-200',
  'bg-emerald-500/25 border-emerald-500/50 text-emerald-200',
  'bg-amber-500/25 border-amber-500/50 text-amber-200',
  'bg-rose-500/25 border-rose-500/50 text-rose-200',
  'bg-cyan-500/25 border-cyan-500/50 text-cyan-200',
  'bg-purple-500/25 border-purple-500/50 text-purple-200',
]

export default function TokenizerWidget() {
  const [text, setText] = useState('Hello, world!')

  const tokens = tokenize(text, DEMO_MERGE_RULES)

  return (
    <div className="space-y-5">
      <div>
        <label
          htmlFor="tokenizer-input"
          className="block text-sm font-medium text-slate-300 mb-2"
        >
          Input text
        </label>
        <input
          id="tokenizer-input"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type something..."
          aria-label="Text to tokenize"
          className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg
            text-slate-200 font-mono text-sm placeholder-slate-600
            focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50
            transition-colors"
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-300">Tokens</span>
        <span
          className="text-xs font-mono text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/30"
          aria-live="polite"
          aria-label={`${tokens.length} tokens`}
        >
          {tokens.length} token{tokens.length !== 1 ? 's' : ''}
        </span>
      </div>

      {tokens.length > 0 ? (
        <div
          className="flex flex-wrap gap-1.5 p-3 bg-slate-800/60 rounded-lg min-h-[48px]"
          role="list"
          aria-label="Tokenized output"
        >
          {tokens.map((token, i) => (
            <span
              key={i}
              role="listitem"
              title={`Token ${i + 1}: "${token}"`}
              className={`px-2 py-0.5 text-xs font-mono rounded border ${
                TOKEN_COLORS[i % TOKEN_COLORS.length] ?? TOKEN_COLORS[0]!
              }`}
            >
              {token === 'Ġ' ? '⎵' : token}
            </span>
          ))}
        </div>
      ) : (
        <div className="p-3 bg-slate-800/40 rounded-lg text-slate-500 text-sm italic">
          No tokens — type something above.
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="p-3 bg-slate-800/40 rounded-lg">
          <p className="text-slate-500 text-xs mb-1">Characters</p>
          <p className="text-slate-300 font-mono font-semibold">{text.length}</p>
        </div>
        <div className="p-3 bg-slate-800/40 rounded-lg">
          <p className="text-slate-500 text-xs mb-1">Tokens</p>
          <p className="text-indigo-300 font-mono font-semibold">{tokens.length}</p>
        </div>
      </div>

      <p className="text-xs text-slate-500">
        Using {DEMO_MERGE_RULES.length} BPE merge rules learned from a small demo corpus.
        Spaces are represented as <span className="font-mono">Ġ</span> (shown as ⎵).
      </p>
    </div>
  )
}
