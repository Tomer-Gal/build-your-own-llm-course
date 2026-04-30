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
        'GPT-style models are trained with a simple objective: given a sequence of tokens, predict the next token at every position. This is called next-token prediction, or autoregressive language modeling.',
        'Because we use teacher forcing, the model sees the correct previous tokens during training regardless of its own predictions. A causal mask ensures each position can only attend to earlier positions.',
        'The simplicity of this objective is deceptive. Predicting the next word requires understanding syntax, semantics, world knowledge, and reasoning — essentially all of language. The model learns all of this implicitly from the training signal.',
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
        'Raw text is first tokenized using a BPE vocabulary, then packed into fixed-length sequences (typically 2048 or 4096 tokens). Documents are concatenated and split at the sequence boundary.',
        'During training, sequences are streamed from disk in shuffled order. Modern training pipelines use data loaders that prefetch batches and overlap I/O with GPU computation.',
        'Data quality matters enormously. Filtering, deduplication, and domain mixing can have as large an effect on final model quality as architectural choices. The Pile, RedPajama, and FineWeb are examples of carefully curated pretraining corpora.',
      ],
    },
    {
      id: 'learning-rate-schedules',
      title: 'Learning Rate Schedules',
      body: [
        'LLM training typically uses a warmup phase followed by cosine decay. During warmup, the learning rate ramps linearly from near-zero to the peak value. This prevents early instability when weights are randomly initialized.',
        'After warmup, the cosine schedule smoothly reduces the LR to a small minimum value. This allows the model to make large updates early in training when it has the most to learn, and fine-grained updates later when converging.',
        'The peak learning rate, warmup duration, and minimum LR are all critical hyperparameters. Larger models generally require smaller peak LRs. Getting these wrong can cause loss spikes or slow convergence.',
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
  ],
}
