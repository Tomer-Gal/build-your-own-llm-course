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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value))
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center justify-between text-sm">
        <label htmlFor={id} className="text-slate-300 font-medium">
          {label}
        </label>
        <span className="text-brand-500 font-mono font-medium" aria-live="polite">
          {displayValue}
        </span>
      </div>
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
        className="w-full h-2 bg-surface-3 rounded-full appearance-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-brand-500 [&::-webkit-slider-thumb]:cursor-pointer
          [&::-webkit-slider-thumb]:shadow-md
          focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2
          focus-visible:ring-offset-surface-1"
      />
      <div className="flex justify-between text-xs text-slate-500">
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
      {explanation && (
        <p className="text-xs text-slate-500 mt-1">{explanation}</p>
      )}
    </div>
  )
}

export default Slider
