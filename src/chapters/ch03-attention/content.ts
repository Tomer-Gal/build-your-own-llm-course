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
      heading: 'The Core Intuition: A Differentiable Search',
      body: 'Attention asks a question — given what I\'m looking for (Query), how much does each position in the input (Key) have what I need? The answer (Value) is a weighted average of what those positions contain. Think of it like a search engine: your Query is the search term, the Keys are document titles, and the Values are the document contents. You score every document against your query, convert the scores to weights (via softmax), and return a blend of document contents weighted by relevance. The critical difference from a real search engine is that attention is fully differentiable — the "which documents are relevant to this query" decision is learned end-to-end from data, not hand-coded. This means the model can learn arbitrarily complex retrieval patterns: syntactic agreement, coreference, semantic similarity, or positional relationships — whatever makes next-token prediction easier. This differentiability is what makes transformers so powerful and so general.',
    },
    {
      heading: 'Query, Key, and Value: A Concrete Analogy',
      body: 'Every token in the sequence simultaneously plays three roles. As a Query, it asks: "which other tokens are relevant to understanding me?" As a Key, it advertises: "here is what I contain, for the benefit of other tokens searching for context." As a Value, it contributes: "here is what I will provide to any token that attends to me." The Q, K, and V vectors are produced by multiplying the token embedding by three separate learned weight matrices (W_Q, W_K, W_V). These matrices are parameters that the model learns during training, and they define what each token "looks for" and "offers." A useful way to build intuition: in a sentence about a pronoun like "she", the pronoun\'s Query vector will learn to point in the direction of noun Keys that agree in gender — so attending to "she" will cause the model to retrieve information from the antecedent noun. This kind of structured, learned dependency is what allows transformers to handle long-range relationships that were impossible for earlier recurrent architectures.',
    },
    {
      heading: 'Scaled Dot-Product Attention',
      body: 'The raw dot products QK^T can be very large when the key dimension d_k is large, because each dot product is a sum of d_k terms. If Q and K entries are drawn from N(0, 1), each product q_i * k_j has variance 1, and the sum of d_k such terms has variance d_k — so the dot products grow with the square root of d_k. This matters because softmax is sensitive to the scale of its inputs: if the logits are large in magnitude, softmax saturates — it returns values very close to 0 or 1 — and the gradient of softmax becomes nearly zero. A nearly-zero gradient means the model stops learning, which is catastrophic. Dividing by sqrt(d_k) normalizes the dot products back to unit variance regardless of dimension, keeping softmax in a healthy, gradient-rich regime. This single division is one of the key practical contributions of "Attention is All You Need" — without it, training transformers at scale would be far more difficult.',
    },
    {
      heading: 'Why Scaling by sqrt(d_k) Works Mathematically',
      body: 'Suppose Q and K entries are independent samples from N(0, 1). Then each dot-product q·k is a sum of d_k terms each with mean 0 and variance 1 — so the total variance is d_k, and the standard deviation is sqrt(d_k). Dividing by sqrt(d_k) normalizes the dot products back to unit variance regardless of dimension, preventing them from growing too large. This is analogous to the reason we divide by sqrt(n) when averaging n random variables to get a stable estimate: more terms means more accumulated variance, and we compensate by scaling. After scaling, the dot products have unit variance, softmax operates in a well-behaved range, and gradients flow cleanly through the attention computation during backpropagation.',
    },
    {
      heading: 'Multi-Head Attention: Learning Multiple Relationship Types',
      body: 'Rather than computing attention once in d_model-dimensional space, multi-head attention runs h separate attention computations in parallel, each in a lower-dimensional subspace of dimension d_model/h. The intuition is that a single attention head can only capture one "type" of relationship at a time — but language has many parallel structures. One head might learn to track syntactic subject-verb agreement; another might follow coreference chains; a third might capture local positional relationships; a fourth might attend to tokens that are semantically similar. By running h heads in parallel, each with its own Q, K, V projection matrices, the model can simultaneously track all of these relationship types. The outputs of all heads are concatenated and projected back to d_model via a learned output matrix W_O. The number of heads h is a hyperparameter: GPT-2 small uses 12 heads, GPT-3 uses 96 heads. More heads give more expressivity but also more computation — though since each head operates in d_model/h dimensions, total compute per layer stays roughly constant.',
    },
    {
      heading: 'Causal Masking: Why Autoregressive Generation Requires It',
      body: 'Language models are trained to predict the next token without "cheating" by looking ahead — at training time the entire sequence is available, but the model must behave as if it can only see the past. Causal (autoregressive) masking enforces this constraint: before applying softmax, all positions above the diagonal of the attention score matrix are set to negative infinity, so they receive zero attention weight after softmax. This creates a strict lower-triangular attention pattern — token at position t can only attend to tokens at positions 1 through t. Without causal masking, the model would trivially learn to copy the next token from its own future context, making it useless for generation. With masking, the same model works identically at training time (using teacher forcing on the full sequence) and inference time (generating one token at a time, appending each to the context). The mask is what makes the training objective and the inference procedure consistent.',
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
