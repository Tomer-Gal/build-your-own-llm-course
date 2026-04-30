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
      id: 'pretraining-objective',
      title: 'The Pretraining Objective',
      body: [
        'GPT-style models are trained with a simple objective: given a sequence of tokens, predict the next token at every position. This is called next-token prediction, or autoregressive language modeling. Crucially, this is self-supervised learning — the labels are already in the data. Every document provides thousands of (context, next-token) training examples at no annotation cost.',
        'Because we use teacher forcing, the model sees the correct previous tokens during training regardless of its own predictions. A causal mask ensures each position can only attend to earlier positions. A context window of 1024 tokens means each forward pass attends to up to 1024 previous tokens — increase it to 4096 and you quadruple the attention computation per layer.',
        'The simplicity of this objective is deceptive. Predicting the next word requires understanding syntax, semantics, world knowledge, and reasoning — essentially all of language. The model learns all of this implicitly from the training signal.',
        'Cross-entropy loss measures how surprised the model is by the actual next token. On a 50,000-token vocabulary, random guessing gives loss ≈ ln(50000) ≈ 10.82. A well-trained GPT-2 achieves ~3.0, meaning it correctly narrows the prediction to ~e³ ≈ 20 plausible next tokens — a 2,500× improvement over random chance. The gap between 10.82 and 3.0 is what pretraining buys you.',
      ],
      formulas: [
        {
          label: 'crossEntropyLoss',
          latex:
            '\\mathcal{L} = -\\frac{1}{T} \\sum_{t=1}^{T} \\log P(x_t \\mid x_1, \\ldots, x_{t-1})',
          description:
            'Cross-entropy loss averaged over T tokens. P(x_t | ...) is the model\'s predicted probability for the correct next token. Lower is better; a perfect model scores 0.',
        },
      ],
    },
    {
      id: 'data-pipelines',
      title: 'Data Pipelines',
      body: [
        'Building a pretraining corpus involves a multi-stage pipeline: scrape the web, deduplicate, quality-filter, tokenize, then pack into fixed-length chunks. Each stage is critical — skipping deduplication can cause models to memorize repeated text and inflate quality metrics.',
        'Raw text is tokenized using a BPE vocabulary, then packed into fixed-length sequences (typically 2048 or 4096 tokens). Documents are concatenated and split at the sequence boundary, so a single training chunk may span multiple documents.',
        'Data quality matters enormously. GPT-3 was trained on ~300 billion tokens; the Chinchilla-optimal equivalent for that compute budget would have been a smaller model on even more tokens. Filtering, deduplication, and domain mixing can have as large an effect on final model quality as architectural choices. The Pile, RedPajama, and FineWeb are examples of carefully curated pretraining corpora.',
        'A critical pitfall is data contamination: if benchmark test sets appear in the training data, reported performance numbers are inflated. Responsible training pipelines explicitly remove known benchmarks from pretraining data — and still routinely find accidental contamination during post-hoc audits.',
        'During training, sequences are streamed from disk in shuffled order. Modern training pipelines use data loaders that prefetch batches and overlap I/O with GPU computation to ensure the GPU is never waiting for data.',
      ],
    },
    {
      id: 'learning-rate-schedules',
      title: 'Learning Rate Schedules',
      body: [
        'LLM training typically uses a warmup phase followed by cosine decay. Why warmup? The model starts with random weights — jumping to a large learning rate of 0.001 immediately causes unstable early training, because gradients are large and poorly conditioned. A warmup of 100 steps ramps the LR linearly from near-zero to the peak, letting the optimizer build reliable momentum estimates first. Shorten the warmup to 10 steps and early loss spikes become far more likely.',
        'Why cosine decay after warmup? Smooth reduction avoids sudden loss spikes that can occur if you cut the learning rate too abruptly. The cosine curve naturally slows the decay rate as it approaches the minimum, giving the optimizer time to settle into a flat basin rather than bouncing around.',
        'After warmup, the cosine schedule smoothly reduces the LR to a small minimum value. This allows the model to make large updates early in training when it has the most to learn, and fine-grained updates later when converging.',
        'The peak learning rate, warmup duration, and minimum LR are all critical hyperparameters. Larger models generally require smaller peak LRs to stay stable. A learning rate of 0.001 converges in roughly 500 steps on a small model; bump it to 0.01 and the optimizer overshoots, causing the loss to oscillate rather than descend. Getting these wrong can cause loss spikes that corrupt training runs costing millions of dollars in compute.',
      ],
      formulas: [
        {
          label: 'lrCosine',
          latex:
            '\\eta_t = \\eta_{\\min} + \\frac{1}{2}(\\eta_{\\max} - \\eta_{\\min})\\left(1 + \\cos\\frac{\\pi t}{T}\\right)',
          description:
            'Cosine learning rate decay. eta_max is the peak LR, eta_min is the floor LR, t is the current step, and T is the total number of decay steps.',
        },
      ],
    },
    {
      id: 'gradient-descent',
      title: 'Gradient Descent & Optimization',
      body: [
        'LLM training uses the AdamW optimizer — a variant of Adam with decoupled weight decay. AdamW maintains per-parameter first and second moment estimates, providing adaptive learning rates that work well across the heterogeneous parameter scales in a transformer.',
        'Gradient clipping is applied to prevent catastrophic loss spikes: if the global gradient norm exceeds a threshold (commonly 1.0), all gradients are rescaled proportionally. This is especially important in early training when the loss surface can be steep.',
        'Modern training also uses mixed precision: forward and backward passes in FP16/BF16, but gradient accumulation and weight updates in FP32. This roughly halves memory usage and doubles throughput on modern GPUs.',
      ],
      formulas: [
        {
          label: 'gradientUpdate',
          latex: '\\theta_{t+1} = \\theta_t - \\eta_t \\cdot \\hat{m}_t / (\\sqrt{\\hat{v}_t} + \\varepsilon)',
          description:
            'AdamW parameter update. m-hat and v-hat are bias-corrected first and second moment estimates of the gradient. The adaptive denominator normalizes the step size per parameter.',
        },
      ],
    },
    {
      id: 'scaling-laws',
      title: 'Scaling Laws',
      body: [
        'How large should a model be, and how many tokens should you train on? The Chinchilla scaling laws (Hoffmann et al., 2022) provide empirical answers: for a given compute budget, the optimal model size and token count follow a power law relationship, and both should scale equally.',
        'The key finding upended common practice: most large models were undertrained, not undersized. GPT-3 (175B parameters) was trained on 300B tokens, but the Chinchilla-optimal choice for that compute budget would be a 70B model trained on 1.4T tokens. The smaller, better-trained model matches or beats the larger one.',
        'Scaling laws let researchers predict model performance before training. By plotting loss against FLOPs on small runs, you can fit a power-law curve and extrapolate to larger scales — avoiding expensive surprises.',
        'Frontier models now train well beyond Chinchilla-optimal token counts, because inference is cheap relative to training. A model trained on 10T tokens instead of 1.4T will be slower to train but faster and cheaper to serve at scale.',
      ],
    },
  ],
}
