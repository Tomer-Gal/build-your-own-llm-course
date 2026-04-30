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
    'Throughout Chapters 1–3, we will use one sentence as our running example: "The cat sat on the mat because it was tired." Every concept will be illustrated using this sentence, so you can see how the pieces connect — from next-word prediction here, to BPE tokenization in Chapter 2, to embedding positions in 3D space.',
  ],
  sections: [
    {
      heading: 'Language as a Probability Distribution',
      body: 'Rather than thinking of a language model as a rule-based system or a lookup table, think of it as a learned function that maps a context (previous tokens) to a probability distribution over the vocabulary. At every step, the model asks: given what I have seen so far, how likely is each possible next word? This framing is not just mathematical elegance — it has deep consequences. It means the model is never truly "wrong" in a binary sense; instead, it assigns varying degrees of plausibility to all continuations simultaneously. The distribution encodes everything the model knows about language, facts, and style, weighted by the statistical patterns in its training data. Understanding this probabilistic nature is the foundation for understanding why models sometimes "hallucinate": they are generating what is statistically likely, not what is verifiably true.',
    },
    {
      heading: 'Why Next-Token Prediction is Surprisingly Powerful',
      body: 'On the surface, predicting the next word seems like a narrow task — but its implications are vast. To predict that "Paris" follows "The capital of France is", a model must know geography. To predict that "checkmate" follows a description of a chess position, it must understand the game. In our running example, predicting "because" after "The cat sat on the mat" requires understanding that the sentence is grammatically incomplete — a conjunction or period is expected, not another noun. In this way, next-token prediction is a universal proxy task: a model that excels at it must have internalized an enormous range of human knowledge. This explains the "emergent capabilities" phenomenon — skills like multi-step reasoning, code generation, and language translation that appear suddenly as models scale up, even though they were never explicitly trained for these tasks. The prediction game, played at massive scale, forces the model to build internal representations powerful enough to tackle almost any task humans express in language.',
    },
    {
      heading: 'The Training Pipeline: Pretraining, SFT, and RLHF',
      body: 'Modern LLMs go through three distinct training phases, each shaping a different dimension of behavior. Pretraining on raw text — often hundreds of billions of tokens scraped from the web, books, and code — gives the model its foundational world knowledge and language fluency. At this stage the model is a "base model": extremely knowledgeable, but not particularly useful because it will happily continue any prompt in whatever direction the statistics lead, including harmful directions. Supervised Fine-Tuning (SFT) on curated instruction-response pairs then teaches the model to be helpful: it learns the format of answering questions, following instructions, and refusing inappropriate requests. Finally, Reinforcement Learning from Human Feedback (RLHF) uses human preference ratings to further align the model\'s outputs with human values — making it more honest, less harmful, and better calibrated. Each stage is essential: pretraining gives capability, SFT gives structure, and RLHF gives alignment.',
    },
    {
      heading: 'What You Will Build Understanding of in This Course',
      body: 'This course takes you from first principles to a deep, mechanistic understanding of how large language models work. You will start here with the big picture — the probabilistic framework and training pipeline — before diving into tokenization and how raw text becomes numerical representations. You will then explore the attention mechanism, the architectural innovation that made the transformer revolution possible, and see how the full transformer block assembles these pieces into a coherent architecture. Later chapters cover pretraining at scale, fine-tuning and parameter-efficient adaptation, alignment and RLHF, reasoning models, and production deployment. Every concept is paired with interactive visualizations so you can develop genuine intuition, not just memorized definitions. By the end, you will be able to reason confidently about why language models behave the way they do — and what the real limitations and trade-offs are.',
    },
  ],
  formulas: {
    nextToken: 'P(x_t \\mid x_1, x_2, \\ldots, x_{t-1})',
    crossEntropy: '\\mathcal{L} = -\\frac{1}{T} \\sum_{t=1}^{T} \\log P(x_t \\mid x_1, \\ldots, x_{t-1})',
    softmax: '\\text{softmax}(z_i) = \\frac{e^{z_i / T}}{\\sum_{j} e^{z_j / T}}',
  },
}
