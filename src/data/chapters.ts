export interface Chapter {
  id: number
  slug: string
  title: string
  subtitle: string
  description: string
  route: string
  emoji: string
  topics: string[]
  interactives: string[]
  estimatedMinutes: number
  prerequisites: number[]
}

export const CHAPTERS: Chapter[] = [
  {
    id: 1,
    slug: 'big-picture',
    title: 'The Big Picture',
    subtitle: 'What is a Language Model?',
    description: 'Understand what LLMs are, how they model probability distributions over language, and the training pipeline that brings them to life.',
    route: '/chapter/1',
    emoji: '🌐',
    topics: ['Language models as probability distributions', 'Next-token prediction', 'Pretraining → Fine-tuning → RLHF pipeline'],
    interactives: ['Next-word prediction with temperature control'],
    estimatedMinutes: 15,
    prerequisites: [],
  },
  {
    id: 2,
    slug: 'tokenization',
    title: 'Tokenization & Embeddings',
    subtitle: 'From Characters to Vectors',
    description: 'Explore how text is converted into tokens using Byte-Pair Encoding, and how tokens become dense vector representations.',
    route: '/chapter/2',
    emoji: '🔤',
    topics: ['Byte-Pair Encoding (BPE)', 'Vocabulary construction', 'Token embeddings', 'Positional encodings'],
    interactives: ['BPE step-by-step visualizer', 'Live tokenizer widget', '3D embedding space explorer', 'Positional encoding frequency explorer'],
    estimatedMinutes: 20,
    prerequisites: [1],
  },
  {
    id: 3,
    slug: 'attention',
    title: 'Attention Mechanisms',
    subtitle: 'The Heart of the Transformer',
    description: 'Unpack scaled dot-product attention, visualize attention weights, explore multi-head attention, and see how causal masking enables autoregressive generation.',
    route: '/chapter/3',
    emoji: '👁️',
    topics: ['Dot-product attention', 'Scaling by √d_k', 'Multi-head attention', 'Causal masking'],
    interactives: ['Animated attention matrix with temperature', 'Multi-head attention patterns', 'Causal mask toggle'],
    estimatedMinutes: 25,
    prerequisites: [1, 2],
  },
  {
    id: 4,
    slug: 'transformer',
    title: 'The Transformer Architecture',
    subtitle: 'Putting It All Together',
    description: 'See the complete GPT-style transformer. Click any component to zoom in, explore Layer Normalization, GELU activation, and residual connections.',
    route: '/chapter/4',
    emoji: '🏗️',
    topics: ['GPT architecture overview', 'Layer Normalization', 'Feed-forward networks', 'Residual connections'],
    interactives: ['Clickable architecture diagram', 'LayerNorm distribution visualizer', 'GELU vs ReLU activation plot'],
    estimatedMinutes: 20,
    prerequisites: [1, 2, 3],
  },
  {
    id: 5,
    slug: 'pretraining',
    title: 'Pretraining',
    subtitle: 'Learning from Raw Text',
    description: 'Understand the next-token prediction objective, explore the loss landscape, and see how hyperparameters affect training dynamics.',
    route: '/chapter/5',
    emoji: '🏋️',
    topics: ['Cross-entropy loss', 'Data pipelines', 'Learning rate schedules', 'Training dynamics'],
    interactives: ['3D loss surface explorer', 'Training dynamics simulator with LR slider'],
    estimatedMinutes: 20,
    prerequisites: [1, 2, 3, 4],
  },
  {
    id: 6,
    slug: 'finetuning',
    title: 'Fine-Tuning & LoRA',
    subtitle: 'Specializing a Pretrained Model',
    description: 'Learn how Supervised Fine-Tuning adapts a base model and how LoRA achieves the same result with a fraction of the parameters.',
    route: '/chapter/6',
    emoji: '🎯',
    topics: ['Supervised Fine-Tuning (SFT)', 'Instruction-response pairs', 'LoRA rank decomposition', 'Parameter efficiency'],
    interactives: ['LoRA rank explorer with parameter counter'],
    estimatedMinutes: 15,
    prerequisites: [1, 5],
  },
  {
    id: 7,
    slug: 'alignment',
    title: 'Alignment & RLHF',
    subtitle: 'Making Models Helpful',
    description: 'Understand the RLHF pipeline — reward modeling, PPO optimization — and explore DPO as a simpler alternative.',
    route: '/chapter/7',
    emoji: '🧭',
    topics: ['Reward modeling', 'PPO optimization', 'RLAIF', 'DPO — Direct Preference Optimization'],
    interactives: ['Animated RLHF pipeline', 'Preference data explorer'],
    estimatedMinutes: 15,
    prerequisites: [1, 6],
  },
  {
    id: 8,
    slug: 'reasoning',
    title: 'Reasoning Models',
    subtitle: 'Chain-of-Thought and Beyond',
    description: 'Explore how models can reason step-by-step, how test-time compute scaling works, and the self-improvement loop behind models like DeepSeek-R1.',
    route: '/chapter/8',
    emoji: '🧠',
    topics: ['Chain-of-thought prompting', 'Test-time compute scaling', 'Self-improvement loops'],
    interactives: ['Chain-of-thought trace visualizer'],
    estimatedMinutes: 15,
    prerequisites: [1, 3],
  },
  {
    id: 9,
    slug: 'deployment',
    title: 'Deployment & Serving',
    subtitle: 'From Training to Production',
    description: 'Learn how to serve LLMs efficiently using KV caching, batching, and quantization — and the trade-offs involved.',
    route: '/chapter/9',
    emoji: '🚀',
    topics: ['KV cache mechanics', 'Batching strategies', 'Quantization (INT4/INT8/FP16)', 'Serving architectures'],
    interactives: ['Quantization quality vs speed trade-off slider'],
    estimatedMinutes: 15,
    prerequisites: [1, 5],
  },
]

export function getChapter(id: number): Chapter | undefined {
  return CHAPTERS.find((c) => c.id === id)
}
