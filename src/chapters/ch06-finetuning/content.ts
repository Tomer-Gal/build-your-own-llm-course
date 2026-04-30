export interface Section {
  heading: string
  body: string
}

export interface Ch06Content {
  title: string
  subtitle: string
  intro: string[]
  sections: Section[]
  formulas: {
    loraUpdate: string
    loraParams: string
    sftLoss: string
  }
}

export const content: Ch06Content = {
  title: 'Fine-Tuning & LoRA',
  subtitle: 'Specializing a Pretrained Model',
  intro: [
    'A pretrained language model has learned a rich representation of language from vast text corpora — but it behaves like an autocomplete engine, not an assistant. It has world knowledge but doesn\'t know to follow instructions, stay safe, or match a particular style. Supervised Fine-Tuning (SFT) is what teaches it the format: given this kind of input, produce this kind of output.',
    'The key insight of SFT is simple: given a dataset of (instruction, response) pairs, we continue training the model to maximize the likelihood of the desired response given the instruction. The model\'s weights shift to favor instruction-following behavior over generic text continuation.',
    'However, fine-tuning all parameters of a large model is extremely expensive — both in compute and memory. LoRA (Low-Rank Adaptation) offers an elegant solution: instead of updating all weights, we learn a low-rank decomposition of the weight changes, cutting trainable parameters by 100–10,000×.',
  ],
  sections: [
    {
      heading: 'Why Pretrained Models Need Fine-Tuning',
      body: 'A pretrained model is a generalist: it has absorbed an enormous amount of world knowledge, but it learned to continue text, not to help people. Ask "What is the capital of France?" and it might respond "...and what is the capital of Germany? These are common geography questions..." rather than simply "Paris." Fine-tuning reshapes the output distribution — from text-continuation toward instruction-following, from neutral to safe, from verbose to concise. Without SFT, even the most capable pretrained models are difficult to use reliably.',
    },
    {
      heading: 'The Instruction-Response Format',
      body: 'SFT datasets consist of instruction-response pairs formatted with special tokens. For example: [INST] Summarize this text: {text} [/INST] {summary}. The model learns the pattern — not just the content — so it applies the same format to new instructions it has never seen. This is why a small, curated dataset of high-quality examples often outperforms a large but noisy one: the model needs to learn the format robustly, not memorize specific responses.',
    },
    {
      heading: 'The Parameter Efficiency Problem',
      body: 'GPT-3 has 175 billion parameters. Full fine-tuning requires storing gradient information for all of them — optimizer states alone can require 3× the model size in memory. On a single A100 GPU with 80GB VRAM, you cannot fine-tune even a 7B model with full precision. LoRA\'s insight elegantly sidesteps this: weight updates during fine-tuning tend to be low-rank, meaning the update matrix ΔW can be accurately approximated by two small matrices A and B. Freeze the original weights; only train A and B.',
    },
    {
      heading: 'LoRA: Low-Rank Adaptation',
      body: 'LoRA hypothesizes that weight updates during fine-tuning have a low intrinsic rank. Instead of learning a full d×d update matrix ΔW, LoRA parameterizes it as ΔW = AB where A is d×r and B is r×d, with rank r much smaller than d. Only A and B are trained; the original weights W are frozen. At inference, the adapted weight is simply W + (α/r)·AB — the adapter can be merged back in with zero inference overhead.',
    },
    {
      heading: 'LoRA Math: The Parameter Savings',
      body: 'If W is a d×d matrix, full fine-tuning requires d² parameters. LoRA with rank r requires 2×d×r parameters — one d×r matrix A and one r×d matrix B. With r=8 and d=4096 (typical attention layer size), that\'s 65,536 parameters vs 16,777,216 — a 256× reduction. Applied across all attention matrices in a 7B model, LoRA reduces trainable parameters from billions to millions, making fine-tuning feasible on a single consumer GPU.',
    },
    {
      heading: 'Choosing the Rank',
      body: 'The rank r controls the expressiveness vs. efficiency trade-off. Use r=4 for style adaptation — teaching the model to write in a particular voice or format. Use r=16 for task adaptation — teaching new skills like function calling or structured output. Use r=64 or higher for domain shift — adapting a general model to a specialized domain like medicine or law. The scaling factor α controls how much the adapter contributes; typically α = r or α = 2r.',
    },
  ],
  formulas: {
    loraUpdate: "W' = W + \\frac{\\alpha}{r} \\cdot AB",
    loraParams: '2rd \\ll d^2 \\quad (r \\ll d)',
    sftLoss: '\\mathcal{L}_{\\text{SFT}} = -\\sum_{t} \\log P_\\theta(y_t \\mid x, y_{<t})',
  },
}
