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
      heading: 'Why Tokenization?',
      body: 'Raw text is a sequence of characters, but characters are too fine-grained for efficient modeling — they lead to very long sequences and require the model to "re-learn" that "t", "h", "e" means "the" millions of times. Word-level tokens are at the other extreme: a vocabulary of all English words is huge, out-of-vocabulary words break the system, and morphology is lost. Subword tokenization, particularly Byte-Pair Encoding (BPE), strikes the right balance: common words become single tokens, rare words are split into meaningful sub-pieces, and nothing is ever truly out-of-vocabulary because the character-level fallback always exists.',
    },
    {
      heading: 'Byte-Pair Encoding (BPE)',
      body: 'BPE starts with a character-level vocabulary and iteratively merges the most frequent adjacent pair of tokens. After each merge, the new merged token is added to the vocabulary and all occurrences of the pair in the corpus are replaced. This continues until the target vocabulary size is reached. The result is a vocabulary of subwords that reflects the statistical structure of the training corpus — common words and word-pieces get their own tokens, while rare sequences are represented as compositions.',
    },
    {
      heading: 'Embeddings: Tokens as Vectors',
      body: 'Once text is tokenized, each token is mapped to a dense vector called an embedding. An embedding table (also called the vocabulary matrix) has one row per token in the vocabulary, and each row is a learned vector of dimension d_model (typically 512–8192). The embedding lookup is a simple table lookup: token index i retrieves row i. These embeddings are jointly trained with the rest of the model, so semantically similar tokens end up with geometrically close vectors.',
    },
    {
      heading: 'Positional Encodings',
      body: 'The transformer architecture has no inherent notion of order — attention is a set operation. To inject sequential information, positional encodings are added to (or concatenated with) the token embeddings. The original "Attention is All You Need" paper used sinusoidal encodings with different frequencies for each dimension. Modern models often use learned positional embeddings or RoPE (Rotary Position Embedding), which encodes position directly in the attention computation rather than the embeddings.',
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
