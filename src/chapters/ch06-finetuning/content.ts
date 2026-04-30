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
    'A pretrained language model has learned a rich representation of language from vast text corpora — but it behaves like an autocomplete engine, not an assistant. Supervised Fine-Tuning (SFT) is the process of adapting that base model to follow instructions, answer questions, and engage in dialogue.',
    'The key insight of SFT is simple: given a dataset of (instruction, response) pairs, we continue training the model to maximize the likelihood of the desired response given the instruction. The model\'s weights shift to favor instruction-following behavior over generic text continuation.',
    'However, fine-tuning all parameters of a large model is extremely expensive — both in compute and memory. LoRA (Low-Rank Adaptation) offers an elegant solution: instead of updating all weights, we learn a low-rank decomposition of the weight changes.',
  ],
  sections: [
    {
      heading: 'The Instruction-Response Format',
      body: 'SFT datasets consist of instruction-response pairs, often formatted with special tokens like [INST] and [/INST] or system/user/assistant turn markers. The model learns to produce helpful, relevant responses when given a formatted instruction. Quality of the fine-tuning data matters enormously — a small, curated dataset of high-quality examples often outperforms a large but noisy one.',
    },
    {
      heading: 'Why Base Models Need Fine-Tuning',
      body: 'A base model trained purely on next-token prediction will complete your prompt — it won\'t follow instructions. If you ask "What is the capital of France?" it might continue "...and what is the capital of Germany? These are common geography questions..." rather than simply answering "Paris." SFT reshapes the model\'s output distribution to match the instruction-following format expected by users.',
    },
    {
      heading: 'LoRA: Low-Rank Adaptation',
      body: 'LoRA hypothesizes that weight updates during fine-tuning have a low intrinsic rank. Instead of learning a full d×d update matrix ΔW, LoRA parameterizes it as ΔW = AB where A is d×r and B is r×d, with rank r << d. Only A and B are trained; the original weights W are frozen. At inference, the adapted weight is simply W + (α/r)·AB.',
    },
    {
      heading: 'Parameter Efficiency',
      body: 'With LoRA rank r=8 on a d=4096 layer, the update requires 2 × 8 × 4096 = 65,536 parameters instead of 4096² = 16,777,216 — a 256× reduction. In practice, LoRA is applied to the Q, K, V, and output projection matrices of each attention layer, achieving parameter savings of 10,000× or more on large models while maintaining most of the fine-tuned model\'s quality.',
    },
    {
      heading: 'Choosing the Rank',
      body: 'The rank r controls the expressiveness vs. efficiency trade-off. Rank 1 is extremely parameter-efficient but may not capture all necessary information. Rank 64 or higher approaches full fine-tuning expressiveness. Common choices are r=4, r=8, and r=16. The scaling factor α controls how much the adapter contributes relative to the frozen weights — typically α = r or α = 2r.',
    },
  ],
  formulas: {
    loraUpdate: "W' = W + \\frac{\\alpha}{r} \\cdot AB",
    loraParams: '2rd \\ll d^2 \\quad (r \\ll d)',
    sftLoss: '\\mathcal{L}_{\\text{SFT}} = -\\sum_{t} \\log P_\\theta(y_t \\mid x, y_{<t})',
  },
}
