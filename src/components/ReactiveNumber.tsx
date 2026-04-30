import React, { useEffect, useRef, useState } from 'react'

interface ReactiveNumberProps {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step: number
  format?: (v: number) => string
  unit?: string
}

const ReactiveNumber: React.FC<ReactiveNumberProps> = ({
  value,
  onChange,
  min,
  max,
  step,
  format,
  unit,
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const startXRef = useRef(0)
  const startValueRef = useRef(value)

  const display = format ? format(value) : value.toFixed(2)

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    startXRef.current = e.clientX
    startValueRef.current = value
    e.preventDefault()
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const delta = (e.clientX - startXRef.current) * step
      const newVal = Math.min(max, Math.max(min, startValueRef.current + delta))
      onChange(newVal)
    }

    const handleMouseUp = () => setIsDragging(false)

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, min, max, step, onChange])

  return (
    <span
      onMouseDown={handleMouseDown}
      className={`inline-flex items-center gap-0.5 font-mono font-semibold
        text-violet-300 border-b border-dashed border-violet-400/50
        cursor-ew-resize select-none transition-colors duration-100
        ${isDragging ? 'text-cyan-300 border-cyan-400/60' : 'hover:text-violet-200'}`}
      title="Drag left/right to change value"
      aria-label={`Adjustable value: ${display}${unit ?? ''}`}
    >
      {display}{unit}
      <span className="text-xs opacity-50" aria-hidden="true">&#x21D4;</span>
    </span>
  )
}

export default ReactiveNumber
