export interface Section {
  heading: string
  body: string
}

export interface Ch03Content {
  title: string
  subtitle: string
  sections: Section[]
  formulas: {
    attention: string
    scaledAttention: string
    multiHead: string
  }
}

export const content: Ch03Content = {
  title: 'Attention Mechanisms',
  subtitle: 'The Heart of the Transformer',
  sections: [
    {
      heading: 'Query, Key, and Value',
      body: 'Attention can be understood through an information retrieval analogy. Every token emits a Query ("what am I looking for?"), a Key ("what do I contain?"), and a Value ("what do I contribute?"). To compute attention for a given query token, we compute dot-product similarities between its Query and every token\'s Key. These similarities, once normalized by softmax, form a set of attention weights. The output is a weighted sum of the Values — a blend of context drawn from across the sequence.',
    },
    {
      heading: 'Scaled Dot-Product Attention',
      body: 'The raw dot products QK^T can be very large when the key dimension d_k is large, pushing softmax into regions where the gradient is nearly zero. Dividing by √d_k counteracts this effect and stabilizes training. This simple fix is one of the key practical contributions of "Attention is All You Need."',
    },
    {
      heading: 'Why Scaling by √d_k?',
      body: 'Suppose Q and K entries are independent samples from N(0, 1). Then each dot-product q·k is a sum of d_k terms each with mean 0 and variance 1 — so the total variance is d_k, and the standard deviation is √d_k. Dividing by √d_k normalizes the dot products back to unit variance regardless of dimension, preventing them from growing too large.',
    },
    {
      heading: 'Multi-Head Attention',
      body: 'Rather than computing attention once in d_model-dimensional space, multi-head attention projects queries, keys, and values into h separate, lower-dimensional subspaces (each d_model/h dimensional), computes attention in each, and concatenates the results. Different heads can learn to attend to different aspects of the input — syntactic structure, coreference, semantic similarity — in parallel.',
    },
    {
      heading: 'Causal Masking',
      body: 'Language models are trained to predict the next token without "cheating" by looking ahead. Causal (autoregressive) masking sets all positions above the diagonal of the attention matrix to −∞ before the softmax, so those positions receive zero attention weight. This ensures each token can only attend to itself and tokens that precede it in the sequence.',
    },
  ],
  formulas: {
    attention:
      '\\text{Attention}(Q, K, V) = \\text{softmax}\\!\\left(\\frac{QK^\\top}{\\sqrt{d_k}}\\right) V',
    scaledAttention:
      'a_{ij} = \\frac{\\exp(q_i \\cdot k_j / \\sqrt{d_k})}{\\sum_{l} \\exp(q_i \\cdot k_l / \\sqrt{d_k})}',
    multiHead:
      '\\text{MultiHead}(Q,K,V) = \\text{Concat}(\\text{head}_1, \\ldots, \\text{head}_h)\\,W^O \\\\ \\text{where } \\text{head}_i = \\text{Attention}(Q W_i^Q,\\, K W_i^K,\\, V W_i^V)',
  },
}
