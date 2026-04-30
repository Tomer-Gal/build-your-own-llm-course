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
    'A capable model is not automatically a safe or helpful one. Alignment is the challenge of ensuring that a model\'s behavior matches human values and intentions — that it is helpful, harmless, and honest. Reinforcement Learning from Human Feedback (RLHF) is the dominant technique for achieving this.',
    'The RLHF pipeline has three stages: collect human preference data by having annotators rank model outputs, train a reward model to predict which output a human would prefer, and then use reinforcement learning (PPO) to optimize the language model to maximize the reward model\'s score.',
    'More recently, Direct Preference Optimization (DPO) has emerged as a simpler alternative that achieves similar results without a separate reward model or RL training loop — turning the preference learning problem directly into a supervised objective.',
  ],
  sections: [
    {
      heading: 'The Alignment Problem',
      body: 'A model trained on internet text learns to predict what text will look like — but internet text contains misinformation, harmful content, and biased viewpoints. Without alignment, asking a capable model to help with a dangerous task might produce detailed instructions, because such instructions exist in training data. Alignment training reshapes the model\'s distribution toward helpful, safe behavior.',
    },
    {
      heading: 'Collecting Human Preferences',
      body: 'The RLHF data collection phase asks human annotators to compare pairs of model responses to the same prompt and indicate which is better. These preference judgments encode nuanced human values — a response can be preferred because it\'s more accurate, more concise, safer, or more helpful. The resulting dataset of (prompt, chosen_response, rejected_response) triples becomes the foundation for alignment training.',
    },
    {
      heading: 'Training the Reward Model',
      body: 'A reward model r_θ(x, y) takes a prompt x and response y and outputs a scalar indicating response quality. It is trained on the preference data to assign higher scores to chosen responses than rejected ones, using a cross-entropy loss over the score difference. The reward model serves as a proxy for human preferences during the RL training phase.',
    },
    {
      heading: 'PPO: Proximal Policy Optimization',
      body: 'With a reward model in hand, we can treat the language model as a policy and use RL to maximize expected reward. PPO constrains each update step to prevent the policy from changing too drastically — the "proximal" in PPO. A KL divergence penalty between the updated model and the original model is also added to prevent reward hacking (finding degenerate outputs that score high on the reward model but aren\'t actually useful).',
    },
    {
      heading: 'RLAIF: AI Feedback',
      body: 'Collecting human preference labels is expensive and slow. RLAIF (RL from AI Feedback) replaces human annotators with a capable AI model (like Claude or GPT-4) to generate preference labels. The Constitutional AI approach goes further, defining a set of principles the model should follow and having an AI evaluate responses against those principles. This dramatically scales the alignment data collection process.',
    },
    {
      heading: 'DPO: Direct Preference Optimization',
      body: 'DPO shows that the reward model and RL training can be unified into a single supervised learning objective applied directly to the language model. By analytically solving for the optimal policy under the RLHF objective, DPO derives a direct loss on (prompt, chosen, rejected) triples that implicitly trains the model to prefer chosen responses. This simpler approach has become very popular for smaller-scale alignment.',
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
