import React from 'react'
import { InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'

interface MathInlineProps {
  children: string
}

class MathErrorBoundary extends React.Component<
  React.PropsWithChildren,
  { hasError: boolean }
> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return <code className="text-red-400 text-xs">[?]</code>
    }
    return this.props.children
  }
}

const MathInline: React.FC<MathInlineProps> = ({ children }) => {
  return (
    <MathErrorBoundary>
      <span role="math" aria-label={children}>
        <InlineMath math={children} />
      </span>
    </MathErrorBoundary>
  )
}

export default MathInline
