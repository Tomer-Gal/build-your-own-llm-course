import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import * as THREE from 'three'

const WORDS_3D = [
  // Anchor sentence words (prominent cluster, spread along one axis)
  { word: 'The',     x: -2.0, y:  0.5, z:  0.2, category: 'function' },
  { word: 'cat',     x:  1.8, y:  1.2, z:  0.3, category: 'animals' },
  { word: 'sat',     x:  0.1, y: -0.8, z:  1.5, category: 'verbs' },
  { word: 'on',      x: -1.9, y:  0.2, z:  0.1, category: 'function' },
  { word: 'mat',     x:  1.6, y:  1.0, z: -0.4, category: 'objects' },
  { word: 'because', x: -2.2, y: -0.3, z:  0.3, category: 'function' },
  { word: 'it',      x:  1.7, y:  1.5, z:  0.1, category: 'function' },
  { word: 'was',     x: -0.3, y: -0.9, z:  1.4, category: 'verbs' },
  { word: 'tired',   x:  0.8, y: -1.8, z: -0.5, category: 'adjectives' },
  // Additional words
  { word: 'dog',     x:  2.1, y:  0.8, z:  0.5, category: 'animals' },
  { word: 'bird',    x:  2.3, y:  1.4, z:  0.1, category: 'animals' },
  { word: 'run',     x:  0.3, y: -0.6, z:  1.8, category: 'verbs' },
  { word: 'king',    x: -1.2, y:  2.8, z:  0.6, category: 'royalty' },
  { word: 'queen',   x: -0.9, y:  2.5, z:  0.9, category: 'royalty' },
  { word: 'man',     x: -1.5, y:  2.1, z:  0.2, category: 'people' },
  { word: 'woman',   x: -1.1, y:  2.3, z:  0.5, category: 'people' },
  { word: 'apple',   x:  0.5, y: -2.2, z: -1.2, category: 'food' },
  { word: 'pizza',   x:  0.2, y: -2.5, z: -0.8, category: 'food' },
  { word: 'happy',   x:  0.6, y: -1.5, z: -0.8, category: 'adjectives' },
]

const CATEGORY_COLORS: Record<string, string> = {
  'function':   '#7a8daa',  // muted — function words are "invisible"
  'animals':    '#10b981',  // emerald
  'verbs':      '#6366f1',  // indigo
  'objects':    '#f59e0b',  // amber
  'adjectives': '#f43f5e',  // rose
  'royalty':    '#a78bfa',  // violet
  'people':     '#22d3ee',  // cyan
  'food':       '#fb923c',  // orange
}

const ANCHOR_WORDS = new Set(['The', 'cat', 'sat', 'on', 'mat', 'because', 'it', 'was', 'tired'])

interface WordPointProps {
  word: string
  position: [number, number, number]
  color: string
  isAnchor: boolean
  isHovered: boolean
  onHover: (word: string | null) => void
}

function WordPoint({ word, position, color, isAnchor, isHovered, onHover }: WordPointProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (meshRef.current) {
      const targetScale = isHovered ? 1.4 : isAnchor ? 1.1 : 0.8
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    }
  })

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerEnter={() => onHover(word)}
        onPointerLeave={() => onHover(null)}
      >
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isHovered ? 0.8 : isAnchor ? 0.4 : 0.1}
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>
      <Text
        position={[0, 0.22, 0]}
        fontSize={isAnchor ? 0.14 : 0.1}
        color={isHovered ? '#ffffff' : isAnchor ? '#e2e8f0' : '#7a8daa'}
        anchorX="center"
        anchorY="bottom"
        font={undefined}
      >
        {word}
      </Text>
    </group>
  )
}

const EmbeddingSpace3D: React.FC = () => {
  const [hoveredWord, setHoveredWord] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      {/* Hovered word info panel */}
      <div className="h-12 flex items-center justify-center">
        {hoveredWord ? (
          <div className="text-sm">
            <span className="text-ink-2">Word vector for </span>
            <span className="font-mono text-violet-300 font-semibold">"{hoveredWord}"</span>
            <span className="text-ink-2"> — a point in embedding space</span>
          </div>
        ) : (
          <p className="text-xs text-ink-3">Drag to rotate · Scroll to zoom · Hover a word</p>
        )}
      </div>

      {/* 3D Canvas */}
      <div className="w-full h-96 rounded-xl overflow-hidden bg-surface-0 border border-surface-4">
        <Canvas camera={{ position: [4, 2, 6], fov: 50 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -5, -5]} intensity={0.3} color="#7c3aed" />

          {WORDS_3D.map(({ word, x, y, z, category }) => (
            <WordPoint
              key={word}
              word={word}
              position={[x, y, z]}
              color={CATEGORY_COLORS[category] ?? '#ffffff'}
              isAnchor={ANCHOR_WORDS.has(word)}
              isHovered={hoveredWord === word}
              onHover={setHoveredWord}
            />
          ))}

          <OrbitControls
            autoRotate
            autoRotateSpeed={0.5}
            enableZoom
            enablePan={false}
            minDistance={3}
            maxDistance={12}
          />

          {/* Subtle grid */}
          <gridHelper args={[10, 10, '#1a2235', '#1a2235']} position={[0, -2.5, 0]} />
        </Canvas>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 justify-center">
        {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
          <div key={cat} className="flex items-center gap-1.5 text-xs text-ink-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            {cat}
          </div>
        ))}
      </div>

      {/* The king-queen-man-woman insight */}
      <div className="bg-surface-2 border border-violet-500/10 rounded-lg p-4 text-sm text-ink-1">
        <span className="text-violet-300 font-semibold">Key insight: </span>
        Notice how "cat" and "dog" cluster together, and "king" and "queen" cluster together.
        The geometric relationship between "king" and "queen" is nearly identical to the relationship
        between "man" and "woman" — the model learned this purely from context,
        without being told what gender means.
      </div>
    </div>
  )
}

export default EmbeddingSpace3D
