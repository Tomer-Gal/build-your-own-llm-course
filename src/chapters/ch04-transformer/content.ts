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
        'A GPT-style transformer is a stack of identical blocks. Each block receives a sequence of token embeddings and outputs a transformed sequence of the same shape.',
        'Every block contains two sub-layers: a masked multi-head self-attention layer and a position-wise feed-forward network. Both sub-layers use residual connections and layer normalization.',
        'Modern GPT models use pre-norm (LayerNorm before the sub-layer), which stabilizes training at scale. The original "Attention is All You Need" paper used post-norm.',
      ],
    },
    {
      id: 'layer-normalization',
      title: 'Layer Normalization',
      body: [
        'Layer normalization standardizes the activations across the feature dimension for each token independently. Unlike batch normalization, it does not depend on the batch size, making it well-suited for variable-length sequences.',
        'Pre-norm variants normalize the input before passing it to the sub-layer, then add the residual. This is now the dominant design in large language models because it leads to more stable gradient flow.',
        'The learnable parameters gamma and beta allow the model to rescale and shift the normalized output, giving it the expressive power to undo normalization if needed.',
      ],
      formulas: [
        {
          label: 'layerNorm',
          latex:
            '\\text{LayerNorm}(x) = \\frac{x - \\mu}{\\sqrt{\\sigma^2 + \\varepsilon}} \\cdot \\gamma + \\beta',
          description:
            'Normalizes across the feature dimension. mu and sigma are the mean and variance of the current token\'s activations. Gamma and beta are learned scale and shift parameters.',
        },
      ],
    },
    {
      id: 'feed-forward-network',
      title: 'Feed-Forward Network (FFN)',
      body: [
        'Each transformer block contains a two-layer MLP applied independently to each token position. The hidden dimension is typically 4× the model dimension, allowing each token to reason over a large feature space.',
        'GPT models use the GELU (Gaussian Error Linear Unit) activation rather than ReLU. GELU has smooth, non-zero gradients for small negative values, which tends to produce better results in practice.',
        'The FFN is responsible for storing factual knowledge and performing position-wise transformations. Research shows that factual associations in LLMs are largely localized in the FFN weights.',
      ],
      formulas: [
        {
          label: 'ffn',
          latex:
            '\\text{FFN}(x) = \\text{GELU}(xW_1 + b_1)W_2 + b_2',
          description:
            'A two-layer MLP. W1 projects up to 4d_model, GELU introduces non-linearity, W2 projects back down. Applied identically to each token.',
        },
      ],
    },
    {
      id: 'residual-connections',
      title: 'Residual Connections',
      body: [
        'Residual (skip) connections add the sub-layer\'s input directly to its output: y = x + Sublayer(x). This allows gradients to flow directly through the network without passing through every sub-layer, solving the vanishing gradient problem for deep networks.',
        'Residual connections also give the model a useful inductive bias: each sub-layer only needs to learn a small incremental refinement of its input. This makes optimization much easier.',
        'In practice, the combination of residual connections and layer normalization is what makes it feasible to train transformers with hundreds of layers.',
      ],
      formulas: [
        {
          label: 'residual',
          latex: 'y = x + \\text{Sublayer}(\\text{LayerNorm}(x))',
          description:
            'Pre-norm residual block. The input x is normalized before the sub-layer, and the original x is added back to the output. This is the standard design in modern LLMs.',
        },
      ],
    },
  ],
}
