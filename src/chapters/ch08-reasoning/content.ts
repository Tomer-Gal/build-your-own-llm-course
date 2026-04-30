export interface Section {
  heading: string
  body: string
}

export interface Ch08Content {
  title: string
  subtitle: string
  intro: string[]
  sections: Section[]
}

export const content: Ch08Content = {
  title: 'Reasoning Models',
  subtitle: 'Chain-of-Thought and Beyond',
  intro: [
    'Standard language models generate answers in a single forward pass — they read the question and immediately produce tokens for the answer. But for complex problems, this is too fast. Reasoning models allocate additional "thinking time" before committing to an answer, using chain-of-thought to work through problems step by step.',
    'The key insight is that test-time compute can substitute for model size: a smaller model that thinks for longer can often match or beat a larger model that answers immediately. This represents a fundamental shift from "how big is the model?" to "how long does it think?"',
    'The most capable reasoning models (like OpenAI o1/o3, DeepSeek-R1) are trained through self-improvement loops: the model generates reasoning traces, selects the ones that lead to correct answers, and trains on those traces — bootstrapping its own reasoning ability.',
  ],
  sections: [
    {
      heading: 'Chain-of-Thought Prompting',
      body: 'Chain-of-thought (CoT) prompting encourages a model to produce intermediate reasoning steps before its final answer. Simply adding "Let\'s think step by step" to a prompt dramatically improves performance on math, logic, and multi-step reasoning tasks. The model produces a scratchpad of reasoning, and the final answer emerges from that reasoning trace rather than being directly generated from the question.',
    },
    {
      heading: 'Why CoT Works',
      body: 'Each transformer layer can only perform a limited amount of computation. For problems that require many sequential logical steps, a single forward pass may not have enough "depth" to solve them. By generating intermediate tokens, the model effectively increases its computational depth — each reasoning step can attend to all previous steps, enabling complex multi-hop reasoning that would be impossible in a single step.',
    },
    {
      heading: 'Test-Time Compute Scaling',
      body: 'The amount of compute used at inference time (as opposed to training time) can be deliberately increased to improve answer quality. Best-of-N sampling generates multiple candidate answers and selects the best one using a verifier. Process reward models score each reasoning step. Tree search explores many reasoning paths. These techniques allow a model to "think harder" on difficult problems.',
    },
    {
      heading: 'Self-Improvement: DeepSeek-R1 Style',
      body: 'Reasoning models like DeepSeek-R1 are trained using a self-improvement loop: start with a base model, generate many reasoning traces for problems with known answers, filter to keep only traces that lead to correct answers, and train on those traces. This creates a virtuous cycle — as the model improves, it generates better training data, which improves it further. Reinforcement learning (GRPO, PPO) is used to reward correct final answers regardless of the reasoning path.',
    },
    {
      heading: 'Constitutional AI',
      body: 'Constitutional AI (CAI) is a technique for aligning reasoning models with human values. A set of principles (the "constitution") defines what the model should and should not do. During training, the model first generates a response, then critiques it against the constitution, then revises it. This produces a self-critique-and-revision loop that internalizes the constitutional principles without requiring human feedback on every output.',
    },
  ],
}
