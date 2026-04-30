export interface Section {
  heading: string
  body: string
}

export interface Ch02Content {
  title: string
  subtitle: string
  sections: Section[]
  formulas: {
    bpeObjective: string
    embeddingLookup: string
    positionalEncoding: string
  }
}

export const content: Ch02Content = {
  title: 'Tokenization & Embeddings',
  subtitle: 'From Characters to Vectors',
  sections: [
    {
      heading: 'Why Tokenization is the First Critical Decision',
      body: 'Before a language model ever processes a single word, text must be converted into a sequence of discrete tokens — and the choice of how to do this has cascading consequences. Let\'s tokenize our running example: "The cat sat on the mat because it was tired." Common words like "The", "cat", and "because" each become single tokens in a well-trained vocabulary; "tired" might split into "tir" + "ed" in a small vocabulary. Use individual characters and your sequences become enormously long, forcing the model to learn that "t" + "h" + "e" means "the" from scratch millions of times. Use full words and your vocabulary explodes to hundreds of thousands of entries, with no way to handle words not seen during training (out-of-vocabulary, or OOV, tokens). The vocabulary size directly controls the size of the embedding matrix — every token gets its own row of learned parameters — so a larger vocabulary means more memory and a longer "warm-up" period before rare tokens accumulate meaningful gradients. Subword tokenization, particularly Byte-Pair Encoding (BPE), strikes the right balance: common words get single tokens, rare words are split into recognizable sub-pieces, and nothing is ever truly out-of-vocabulary because individual characters (or bytes) always exist as a fallback. The choice of vocabulary size — typically 32,000 to 100,000 tokens — is one of the first and most consequential architectural decisions in building a language model.',
    },
    {
      heading: 'How Byte-Pair Encoding Works',
      body: 'BPE starts with the simplest possible vocabulary: every unique character (or byte) in the training corpus, plus a special end-of-word marker. Then it runs a greedy merging loop. At each iteration, it counts every adjacent pair of tokens that appears in the corpus and finds the most frequent pair. That pair gets merged into a single new token, added to the vocabulary, and every occurrence of the pair in the corpus is replaced with the new merged token. The process repeats until the vocabulary reaches its target size. The reason we always merge the most frequent pair is that we want to compress the corpus as efficiently as possible — merging the rarest pair would save almost no space, while merging the most frequent pair eliminates the most occurrences. Over many iterations, common words and common sub-words emerge as single tokens. The merge order matters: the algorithm will discover "th" before "the" because "th" is a subset of "the" and appears in more contexts — only after "th" is merged can "the" (now represented as "th" + "e") become frequent enough to merge. This explains why the visualizer shows merges happening in a specific order that reflects English\'s statistical structure.',
    },
    {
      heading: 'From Tokens to Vectors: The Embedding Matrix',
      body: 'Once text is tokenized, each integer token ID needs to become a dense numerical vector before the transformer can process it. After tokenization, each token in our sentence gets an embedding vector — a point in high-dimensional space. "cat" lands near "dog" and "bird"; "sat" and "was" cluster with other verbs; "tired" sits among adjectives. This is done via an embedding matrix: a learned table with one row per vocabulary token and d_model columns, where d_model is the model\'s hidden dimension (typically 512 to 8192 in production models). Looking up a token\'s embedding is simply selecting the corresponding row — a computationally trivial operation. The power is in what these vectors represent after training. Because the embedding matrix is trained jointly with the rest of the model, tokens that appear in similar contexts end up with geometrically similar vectors. This gives rise to the famous analogies: "king" − "man" + "woman" ≈ "queen" because the direction in embedding space corresponding to "royalty minus gender" turns out to be consistent. The embeddings are not hand-designed — they emerge purely from the self-supervised prediction objective. Every token starts as a random vector and gradually drifts to a position in space that makes next-token prediction easier. The resulting geometry encodes semantic relationships that humans recognize as meaningful, even though the model never received explicit semantic supervision.',
    },
    {
      heading: 'Positional Encoding: Giving the Model a Sense of Order',
      body: 'The transformer\'s attention mechanism is inherently order-agnostic: it computes relationships between all pairs of tokens simultaneously, with no built-in notion of which token came first. Feed it "dog bites man" or "man bites dog" with identical embeddings and it cannot distinguish the two. Positional encodings solve this by adding a position-dependent signal to each token embedding before it enters the transformer. The original "Attention is All You Need" paper used sinusoidal functions: each position gets a unique vector whose dimensions oscillate at different frequencies, chosen so that the model can always infer relative distances between positions. Sine and cosine were specifically chosen because they generalize beyond the training sequence length — a model trained on sequences of 512 tokens can still represent position 600 via the same formula, even without having seen it. Modern models often replace sinusoidal encodings with learned positional embeddings (simpler but potentially less generalizable) or Rotary Position Embedding (RoPE), which encodes position directly in the attention dot products rather than the embeddings, making it particularly well-suited for long-context models.',
    },
  ],
  formulas: {
    bpeObjective:
      '\\text{score}(a, b) = \\text{count}(ab) \\quad \\Rightarrow \\quad \\text{merge highest-score pair}',
    embeddingLookup: 'e_t = W_E[x_t] \\quad W_E \\in \\mathbb{R}^{|V| \\times d_{\\text{model}}}',
    positionalEncoding:
      '\\begin{aligned} PE_{(pos, 2i)} &= \\sin\\!\\left(\\frac{pos}{10000^{2i/d_{\\text{model}}}}\\right) \\\\ PE_{(pos, 2i+1)} &= \\cos\\!\\left(\\frac{pos}{10000^{2i/d_{\\text{model}}}}\\right) \\end{aligned}',
  },
}
