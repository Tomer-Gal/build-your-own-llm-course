export interface Formula {
  label: string
  latex: string
  description: string
}

export interface Section {
  id: string
  title: string
  body: string[]
  formulas?: Formula[]
}

export interface ChapterContent {
  sections: Section[]
}

export const content: ChapterContent = {
  sections: [
    {
      id: 'transformer-block-overview',
      title: 'The Transformer Block',
      body: [
        'A GPT-style transformer is a stack of identical blocks. Each block receives a sequence of token embeddings and outputs a transformed sequence of the same shape — so the architecture is a deep composition of the same operation applied repeatedly, each time refining the representation.',
        'Every block contains two sub-layers: a masked multi-head self-attention layer and a position-wise feed-forward network. Both sub-layers use residual connections and layer normalization. The residual connections mean information can flow directly through the block without modification, while the sub-layers learn incremental refinements — not complete rewrites.',
        'Modern GPT models use pre-norm (LayerNorm applied before the sub-layer input, not after), which stabilizes training at scale by keeping activation magnitudes under control throughout the forward pass. The original "Attention is All You Need" paper used post-norm, which works well for smaller models but becomes difficult to train at depth. GPT-3, LLaMA, and virtually all modern large models have adopted pre-norm as the default.',
      ],
    },
    {
      id: 'layer-normalization',
      title: 'Layer Normalization',
      body: [
        'Layer normalization standardizes the activations across the feature dimension for each token independently — computing the mean and variance over the d_model values of a single token, then re-centering and re-scaling. Unlike batch normalization, it does not depend on batch size and operates identically at training and inference time, making it well-suited for variable-length sequences and autoregressive generation.',
        'Think of LayerNorm as resetting the "scale" of each token\'s representation at the start of each sub-layer. Without it, activations can drift to very large or very small magnitudes over many layers, causing gradients to explode or vanish. By normalizing to zero mean and unit variance at each sub-layer input, LayerNorm keeps every layer operating in a numerically stable regime.',
        'The learnable parameters gamma (scale) and beta (shift) are critically important: they allow the model to undo the normalization if needed. Without them, LayerNorm would constrain the representation to a fixed distribution, limiting expressivity. With them, the model can learn to operate at any scale or offset it finds useful — getting the numerical stability benefit without sacrificing representational flexibility.',
      ],
      formulas: [
        {
          label: 'layerNorm',
          latex:
            '\\text{LayerNorm}(x) = \\frac{x - \\mu}{\\sqrt{\\sigma^2 + \\varepsilon}} \\cdot \\gamma + \\beta',
          description:
            'Normalizes across the feature dimension. mu and sigma are the mean and variance of the current token\'s activations. Gamma and beta are learned scale and shift parameters. Epsilon prevents division by zero when variance is tiny.',
        },
      ],
    },
    {
      id: 'feed-forward-network',
      title: 'Feed-Forward Network (FFN): The Model\'s Memory',
      body: [
        'Each transformer block contains a two-layer MLP applied independently to each token position. The hidden dimension is typically 4× the model dimension — for a d_model of 4096 (like LLaMA-7B), the FFN expands to 16,384 dimensions before projecting back down. This large intermediate space gives each token a rich set of "scratch space" to reason before projecting back to d_model.',
        'Research has revealed a striking role for the FFN: it stores factual knowledge. When you ask a language model "The capital of France is ___", the attention layers determine which tokens are relevant, but it is the FFN weights that actually "know" the fact Paris. Studies on localized fact-editing (like ROME and MEMIT) confirm that specific factual associations can be traced to specific FFN neurons. This is why the FFN is sometimes called the model\'s "key-value memory" — attention finds where to look, and the FFN provides what to say.',
        'GPT models use the GELU (Gaussian Error Linear Unit) activation rather than ReLU. While ReLU is a hard threshold — exactly zero for any negative input — GELU has a smooth, non-zero gradient for small negative values, behaving like a soft gate rather than a hard switch. This smoothness tends to produce better results in practice because it avoids "dead neurons" (units that get stuck at exactly zero and stop contributing gradient during training).',
      ],
      formulas: [
        {
          label: 'ffn',
          latex:
            '\\text{FFN}(x) = \\text{GELU}(xW_1 + b_1)W_2 + b_2',
          description:
            'A two-layer MLP. W1 projects up to 4d_model dimensions, GELU introduces smooth non-linearity, W2 projects back down to d_model. Applied identically and independently to each token — no information flows between token positions inside the FFN.',
        },
      ],
    },
    {
      id: 'residual-connections',
      title: 'Residual Connections: Small Corrections, Not Full Rewrites',
      body: [
        'Residual (skip) connections add the sub-layer\'s input directly to its output: y = x + Sublayer(x). The key insight is what this implies about how the model learns: each sub-layer only needs to learn the difference between its input and desired output — a small incremental correction rather than a full computation from scratch. This is analogous to gradient boosting in traditional ML: each learner refines the residual error of the previous one.',
        'The gradient-flow benefit is equally important. Without residual connections, training a 96-layer transformer (like GPT-3) would be practically impossible — the gradient signal would attenuate exponentially with depth, reaching nearly zero at the earliest layers. Residual connections create a "gradient superhighway": the gradient of the loss can flow directly from the output layer to any intermediate layer without passing through every sub-layer in between. This is the same insight that enabled very deep ResNets in computer vision — depth becomes tractable when layers add to their input rather than fully transforming it.',
        'In practice, the combination of residual connections and pre-norm layer normalization is what makes it feasible to train transformers with dozens or hundreds of layers. Each block leaves most of the representation intact (via the residual path) while making targeted refinements (via the sub-layer path). The model architecture as a whole can be read as: start from the token embeddings, and iteratively refine them through 96 small corrections, until the final layer\'s representation is rich enough to predict the next token accurately.',
      ],
      formulas: [
        {
          label: 'residual',
          latex: 'y = x + \\text{Sublayer}(\\text{LayerNorm}(x))',
          description:
            'Pre-norm residual block. The input x is normalized before the sub-layer, and the original x is added back to the output. The sub-layer only needs to learn the residual — the correction to x — making optimization much easier.',
        },
      ],
    },
  ],
}
