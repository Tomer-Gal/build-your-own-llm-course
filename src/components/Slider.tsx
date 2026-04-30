import React, { useId } from 'react'

interface SliderProps {
  label: string
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step?: number
  formatValue?: (value: number) => string
  /** Semantic pole labels, e.g. { left: "Uniform", right: "Peaked" } */
  hint?: { left: string; right: string }
  /** One sentence explaining what this slider controls */
  explanation?: string
  className?: string
}

const Slider: React.FC<SliderProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 0.01,
  formatValue,
  hint,
  explanation,
  className = '',
}) => {
  const id = useId()
  const displayValue = formatValue ? formatValue(value) : value.toFixed(2)
  const pct = ((value - min) / (max - min)) * 100

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value))
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Scoped thumb styling — gradient + glow shadow on the webkit thumb */}
      <style>{`
        #${CSS.escape(id)}::-webkit-slider-thumb {
          background: linear-gradient(135deg, #a78bfa, #7c3aed);
          box-shadow: 0 0 0 3px rgba(124,58,237,0.2), 0 2px 4px rgba(0,0,0,0.4);
          width: 20px;
          height: 20px;
          border-radius: 50%;
          appearance: none;
          -webkit-appearance: none;
          cursor: pointer;
          transition: box-shadow 150ms ease;
        }
        #${CSS.escape(id)}::-webkit-slider-thumb:hover {
          box-shadow: 0 0 0 5px rgba(124,58,237,0.25), 0 2px 6px rgba(0,0,0,0.5);
        }
        #${CSS.escape(id)}::-moz-range-thumb {
          background: linear-gradient(135deg, #a78bfa, #7c3aed);
          box-shadow: 0 0 0 3px rgba(124,58,237,0.2), 0 2px 4px rgba(0,0,0,0.4);
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
        }
      `}</style>

      {/* Label row */}
      <div className="flex items-center justify-between text-sm">
        <label htmlFor={id} className="text-ink-1 font-medium">
          {label}
        </label>
        <span
          className="text-cyan-400 font-mono font-medium tabular-nums"
          aria-live="polite"
        >
          {displayValue}
        </span>
      </div>

      {/* Track + thumb */}
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={displayValue}
        className="w-full h-2 rounded-full appearance-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-5
          [&::-webkit-slider-thumb]:h-5
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:cursor-pointer
          focus:outline-none
          focus-visible:ring-2
          focus-visible:ring-violet-500
          focus-visible:ring-offset-2
          focus-visible:ring-offset-surface-1"
        style={{
          background: `linear-gradient(to right, #7c3aed ${pct}%, #1a2235 ${pct}%)`,
          // Thumb styling via CSS custom properties fallback — actual webkit thumb styled via className above
        }}
      />

      {/* Hint labels */}
      <div className="flex justify-between text-xs text-ink-3">
        {hint ? (
          <>
            <span>← {hint.left}</span>
            <span>{hint.right} →</span>
          </>
        ) : (
          <>
            <span>{min}</span>
            <span>{max}</span>
          </>
        )}
      </div>

      {/* Explanation */}
      {explanation && (
        <p className="text-ink-2 text-xs italic mt-1">{explanation}</p>
      )}
    </div>
  )
}

export default Slider
