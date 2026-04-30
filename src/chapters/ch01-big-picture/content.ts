export interface Section {
  heading: string
  body: string
}

export interface Ch01Content {
  title: string
  subtitle: string
  intro: string[]
  sections: Section[]
  formulas: {
    nextToken: string
    crossEntropy: string
    softmax: string
  }
}

export const content: Ch01Content = {
  title: 'The Big Picture',
  subtitle: 'What is a Language Model?',
  intro: [
    'A large language model is, at its core, a probability distribution over sequences of tokens. Given everything that has come before in a conversation or document, the model assigns a probability to every possible next token — and generation is simply the repeated process of sampling from that distribution.',
    'The training objective is elegantly simple: predict the next token. Given a massive corpus of human-written text, the model learns to assign high probability to the tokens that actually appear, and low probability to unlikely continuations. This is the self-supervised learning paradigm — labels are free, because the text itself provides supervision.',
    'From this humble objective emerges remarkable capability. By learning to predict text well, a model must internalize grammar, facts, reasoning patterns, and even something resembling common sense. The "next token prediction" game turns out to be surprisingly deep.',
  ],
  sections: [
    {
      heading: 'Language as a Probability Distribution',
      body: 'Rather than thinking of a language model as a rule-based system or a lookup table, think of it as a learned function that maps a context (previous tokens) to a probability distribution over the vocabulary. At every step, the model asks: given what I have seen so far, how likely is each possible next word? The distribution encodes everything the model knows about language, facts, and style.',
    },
    {
      heading: 'The Next-Token Prediction Objective',
      body: 'Training optimizes the cross-entropy loss between the model\'s predicted distribution and the actual next token. In practice, this means maximizing the log-probability of correct next tokens across all positions in the training corpus. Because text is sequential, a single document of length T provides T-1 training examples — making text an extraordinarily efficient source of supervision.',
    },
    {
      heading: 'Temperature and Sampling',
      body: 'The "temperature" parameter controls how sharp or flat the output distribution is. At temperature 1.0, probabilities are used as-is. Lowering the temperature (< 1.0) sharpens the distribution, making the model more deterministic and conservative. Raising it (> 1.0) flattens the distribution, encouraging more varied and creative outputs — at the cost of coherence. Beam search, top-k, and nucleus (top-p) sampling are other popular decoding strategies.',
    },
    {
      heading: 'From Pretraining to Deployment',
      body: 'Modern LLMs go through multiple training phases. Pretraining on raw text builds foundational language understanding. Supervised Fine-Tuning (SFT) on instruction-response pairs teaches the model to follow instructions. Reinforcement Learning from Human Feedback (RLHF) further aligns the model with human preferences. Each stage shapes a different aspect of the final model\'s behavior.',
    },
  ],
  formulas: {
    nextToken: 'P(x_t \\mid x_1, x_2, \\ldots, x_{t-1})',
    crossEntropy: '\\mathcal{L} = -\\frac{1}{T} \\sum_{t=1}^{T} \\log P(x_t \\mid x_1, \\ldots, x_{t-1})',
    softmax: '\\text{softmax}(z_i) = \\frac{e^{z_i / T}}{\\sum_{j} e^{z_j / T}}',
  },
}
