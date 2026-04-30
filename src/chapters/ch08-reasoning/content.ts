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
    'The most capable reasoning models (like OpenAI o1/o3, DeepSeek-R1) are trained through self-improvement loops: the model generates reasoning traces, selects the ones that lead to correct answers, and trains on those traces — bootstrapping its own reasoning ability without human feedback on every step.',
  ],
  sections: [
    {
      heading: 'Chain-of-Thought Prompting',
      body: 'Wei et al. (2022) discovered that prompting large models to "think step by step" dramatically improved accuracy on math and reasoning tasks — sometimes by 40% or more. The model doesn\'t think in the human sense; it generates plausible-sounding reasoning that, as a side effect, actually helps it reach the correct answer. The key finding was that this capability emerged at scale: CoT only worked well in models with 100B+ parameters. In smaller models, the generated reasoning steps were often wrong, making performance worse.',
    },
    {
      heading: 'Why CoT Works',
      body: 'Each generated token becomes context for the next. A transformer\'s forward pass has fixed depth — it cannot "iterate" on a problem. But by generating intermediate steps, the model creates a workspace where it can "carry" information across multiple forward passes. A problem like "If Alice has 3 apples and gives Bob 1, then receives 2 from Carol..." requires tracking state across steps. In a single forward pass, this state must be compressed into activations. In CoT, the model writes it down — making it available in context for subsequent tokens. Something that a single forward pass cannot do.',
    },
    {
      heading: 'Test-Time Compute Scaling',
      body: 'More tokens at inference means better answers. OpenAI o1/o3 and DeepSeek-R1 scale compute at test time rather than training time: you can get a better answer by letting the model think for longer. Best-of-N sampling generates multiple candidate answers and picks the best one using a verifier. Process reward models score each reasoning step. Tree search explores many reasoning paths simultaneously. These techniques turn inference into a deliberate, resource-intensive process — the harder the problem, the more thinking budget you allocate.',
    },
    {
      heading: 'Self-Improvement: DeepSeek-R1 Style',
      body: 'DeepSeek-R1 demonstrated a powerful self-improvement loop: train a small model to generate reasoning traces, verify correctness using a code executor (for math and coding problems), and use only the verified correct traces as training data. The model improved itself without human feedback on reasoning steps — only the final answer needed to be verifiable. As the model improved, it generated better reasoning traces, which became better training data. This virtuous cycle, combined with reinforcement learning rewards for correct final answers, produced a reasoning model that matched OpenAI o1 at a fraction of the training cost.',
    },
    {
      heading: 'Limits of Reasoning',
      body: 'Chain-of-thought is not a universal capability upgrade. CoT helps most on decomposable tasks — problems that can be broken into sequential logical steps where each step is checkable. It does not help (and can hurt) on tasks requiring memorized facts: the model cannot reason its way to knowing the capital of Burkina Faso (Ouagadougou) or the exact year a historical event occurred. CoT can also produce "galaxy-brained" reasoning — a long chain of plausible-sounding steps that leads to a confidently wrong answer. Every reasoning step is a chance to compound an error.',
    },
    {
      heading: 'Chain-of-Thought Prompting (Legacy Approach)',
      body: 'Chain-of-thought (CoT) prompting encourages a model to produce intermediate reasoning steps before its final answer. Simply adding "Let\'s think step by step" to a prompt dramatically improves performance on math, logic, and multi-step reasoning tasks. The model produces a scratchpad of reasoning, and the final answer emerges from that reasoning trace rather than being directly generated from the question.',
    },
    {
      heading: 'Test-Time Compute Scaling (Technical Detail)',
      body: 'The amount of compute used at inference time (as opposed to training time) can be deliberately increased to improve answer quality. Best-of-N sampling generates multiple candidate answers and selects the best one using a verifier. Process reward models score each reasoning step. Tree search explores many reasoning paths. These techniques allow a model to "think harder" on difficult problems.',
    },
    {
      heading: 'Self-Improvement: DeepSeek-R1 Style (Summary)',
      body: 'Reasoning models like DeepSeek-R1 are trained using a self-improvement loop: start with a base model, generate many reasoning traces for problems with known answers, filter to keep only traces that lead to correct answers, and train on those traces. This creates a virtuous cycle — as the model improves, it generates better training data, which improves it further. Reinforcement learning (GRPO, PPO) is used to reward correct final answers regardless of the reasoning path.',
    },
    {
      heading: 'Constitutional AI',
      body: 'Constitutional AI (CAI) is a technique for aligning reasoning models with human values. A set of principles (the "constitution") defines what the model should and should not do. During training, the model first generates a response, then critiques it against the constitution, then revises it. This produces a self-critique-and-revision loop that internalizes the constitutional principles without requiring human feedback on every output.',
    },
  ],
}
