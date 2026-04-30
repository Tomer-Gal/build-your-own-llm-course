export interface Section {
  heading: string
  body: string
}

export interface Ch07Content {
  title: string
  subtitle: string
  intro: string[]
  sections: Section[]
  formulas: {
    rewardModel: string
    dpoLoss: string
    ppoClip: string
  }
}

export const content: Ch07Content = {
  title: 'Alignment & RLHF',
  subtitle: 'Making Models Helpful',
  intro: [
    'A capable model is not automatically a safe or helpful one. A model optimized purely to predict text will predict human-sounding text — including harmful content, biased viewpoints, and confident misinformation. SFT alone doesn\'t solve this: a model can learn to follow instructions and still produce toxic or dangerous outputs when prompted skillfully.',
    'Alignment is the challenge of ensuring a model\'s behavior matches human values and intentions. Reinforcement Learning from Human Feedback (RLHF) is the dominant technique: collect human preferences about what makes a good response, train a reward model to predict those preferences, then use that reward model to push the language model toward better behavior.',
    'More recently, Direct Preference Optimization (DPO) has emerged as a simpler alternative that achieves similar results without a separate reward model or RL training loop — turning the preference learning problem directly into a supervised objective.',
  ],
  sections: [
    {
      heading: 'The Alignment Problem',
      body: 'A model optimized to predict text will predict human-sounding text — including harmful content. SFT alone doesn\'t solve this: you can teach a model to follow instructions, but those instructions might ask it to help with dangerous tasks. What you need is a reward signal that explicitly prefers helpfulness and safety over merely coherent text. Without alignment, even a highly capable model is unreliable as a product: it may refuse benign requests, comply with harmful ones, or tell users what they want to hear rather than what is true.',
    },
    {
      heading: 'Stage 1: Collecting Human Preferences',
      body: 'The RLHF data collection phase asks human annotators to compare pairs of model responses to the same prompt and indicate which is better. In practice, this means collecting 20,000–100,000 comparisons from trained annotators with clear rubrics for helpfulness, harmlessness, and honesty. These preference judgments encode nuanced human values — a response can be preferred because it\'s more accurate, more concise, safer, or more helpful. The result is a dataset of (prompt, chosen_response, rejected_response) triples.',
    },
    {
      heading: 'Stage 2: Training the Reward Model',
      body: 'A reward model r_θ(x, y) takes a prompt x and response y and outputs a scalar quality score. It is trained on the preference data to assign higher scores to chosen responses than rejected ones. The reward model acts as a learned proxy for human judgment — once trained, it can score millions of model outputs per hour, far beyond what human annotators could review. The quality of alignment depends critically on the quality of this proxy.',
    },
    {
      heading: 'Stage 3: PPO Optimization with KL Penalty',
      body: 'With a reward model in hand, we treat the language model as a policy and use Proximal Policy Optimization (PPO) to maximize expected reward. Each generated token is an "action"; the reward model\'s score is the "reward" signal. A critical addition is the KL divergence penalty: it prevents the model from drifting too far from the SFT baseline. Without the KL penalty, models learn to exploit the reward model — generating plausible-sounding but nonsensical text that the reward model incorrectly scores highly. This failure mode is called reward hacking.',
    },
    {
      heading: 'Why the KL Penalty Matters',
      body: 'Reward hacking is the central failure mode of RLHF. Without a KL penalty, an RL-optimized model will find the "holes" in the reward model — inputs where the reward model gives high scores but the outputs are actually unhelpful or harmful. The KL term adds a cost for deviating from the original SFT model, effectively saying: "maximize reward, but don\'t change your behavior too much." This balance between reward maximization and policy stability is the key design decision in the PPO stage.',
    },
    {
      heading: 'DPO: Direct Preference Optimization',
      body: 'DPO cuts out the reward model entirely. It derives a training objective directly from preference data by analytically solving for what the RLHF-optimal policy looks like in terms of the reference model. The result is a single supervised loss on (prompt, chosen, rejected) triples — simpler than PPO, faster to train, and often comparable in quality. DPO has become the preferred approach for most alignment work below frontier scale.',
    },
    {
      heading: 'RLAIF: AI Feedback',
      body: 'Collecting human preference labels is expensive and slow. RLAIF (RL from AI Feedback) replaces human annotators with a capable AI model to generate preference labels at scale. A strong AI evaluator can score hundreds of thousands of response pairs per day — far more than human annotators — and can apply consistent rubrics. The Constitutional AI approach extends this: a set of principles defines what the model should and shouldn\'t do, and an AI evaluates responses against those principles. RLAIF scales better than human feedback but may inherit and amplify the evaluator model\'s own biases.',
    },
  ],
  formulas: {
    rewardModel: 'r_\\theta(x, y) = \\text{scalar score of response } y \\text{ to prompt } x',
    dpoLoss:
      '\\mathcal{L}_{\\text{DPO}} = -\\mathbb{E}\\left[\\log \\sigma\\left(\\beta \\log \\frac{\\pi_\\theta(y_w|x)}{\\pi_{\\text{ref}}(y_w|x)} - \\beta \\log \\frac{\\pi_\\theta(y_l|x)}{\\pi_{\\text{ref}}(y_l|x)}\\right)\\right]',
    ppoClip:
      '\\mathcal{L}_{\\text{PPO}} = \\mathbb{E}\\left[\\min\\left(r_t(\\theta)\\hat{A}_t,\\ \\text{clip}(r_t(\\theta), 1-\\varepsilon, 1+\\varepsilon)\\hat{A}_t\\right)\\right]',
  },
}
