import React from 'react'
import { BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'

interface MathBlockProps {
  children: string
}

interface MathErrorBoundaryState {
  hasError: boolean
}

class MathErrorBoundary extends React.Component<
  React.PropsWithChildren,
  MathErrorBoundaryState
> {
  state: MathErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(): MathErrorBoundaryState {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return <code className="text-red-400 text-sm">[formula parse error]</code>
    }
    return this.props.children
  }
}

const MathBlock: React.FC<MathBlockProps> = ({ children }) => {
  return (
    <MathErrorBoundary>
      <div className="my-6 overflow-x-auto text-center" role="math" aria-label={children}>
        <BlockMath math={children} />
      </div>
    </MathErrorBoundary>
  )
}

export default MathBlock
