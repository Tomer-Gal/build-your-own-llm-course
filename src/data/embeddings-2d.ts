export interface WordEmbedding {
  word: string
  x: number
  y: number
  category: string
}

// Pre-computed 2D projections (via t-SNE / PCA) of word embeddings for visualization
export const EMBEDDINGS_2D: WordEmbedding[] = [
  // Royalty cluster
  { word: 'king', x: 0.82, y: 0.71, category: 'royalty' },
  { word: 'queen', x: 0.78, y: 0.65, category: 'royalty' },
  { word: 'prince', x: 0.74, y: 0.69, category: 'royalty' },
  { word: 'princess', x: 0.70, y: 0.62, category: 'royalty' },
  // Animals
  { word: 'dog', x: 0.25, y: 0.30, category: 'animals' },
  { word: 'cat', x: 0.22, y: 0.35, category: 'animals' },
  { word: 'puppy', x: 0.28, y: 0.25, category: 'animals' },
  { word: 'kitten', x: 0.19, y: 0.38, category: 'animals' },
  { word: 'wolf', x: 0.32, y: 0.20, category: 'animals' },
  // Technology
  { word: 'computer', x: 0.55, y: 0.15, category: 'tech' },
  { word: 'laptop', x: 0.58, y: 0.12, category: 'tech' },
  { word: 'software', x: 0.61, y: 0.18, category: 'tech' },
  { word: 'algorithm', x: 0.65, y: 0.10, category: 'tech' },
  { word: 'neural', x: 0.68, y: 0.14, category: 'tech' },
  // Food
  { word: 'apple', x: 0.15, y: 0.70, category: 'food' },
  { word: 'banana', x: 0.12, y: 0.75, category: 'food' },
  { word: 'pizza', x: 0.18, y: 0.65, category: 'food' },
  { word: 'bread', x: 0.10, y: 0.80, category: 'food' },
  // Places
  { word: 'city', x: 0.45, y: 0.50, category: 'places' },
  { word: 'country', x: 0.48, y: 0.55, category: 'places' },
  { word: 'ocean', x: 0.40, y: 0.45, category: 'places' },
  { word: 'mountain', x: 0.42, y: 0.58, category: 'places' },
]

export const EMBEDDING_CATEGORIES = ['royalty', 'animals', 'tech', 'food', 'places'] as const
export type EmbeddingCategory = typeof EMBEDDING_CATEGORIES[number]

export const CATEGORY_COLORS: Record<EmbeddingCategory, string> = {
  royalty: '#f59e0b',
  animals: '#10b981',
  tech: '#6366f1',
  food: '#f43f5e',
  places: '#06b6d4',
}
