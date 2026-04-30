export interface Section {
  heading: string
  body: string
}

export interface Ch09Content {
  title: string
  subtitle: string
  intro: string[]
  sections: Section[]
}

export const content: Ch09Content = {
  title: 'Deployment & Serving',
  subtitle: 'From Training to Production',
  intro: [
    'Training a language model is only half the challenge — serving it efficiently in production is the other half. A 70B parameter model requires ~140GB of VRAM at FP16 precision, and each user request might need hundreds of forward passes for generation. Serving infrastructure must maximize throughput while minimizing latency.',
    'Three key techniques transform an unoptimized model deployment into a production-ready serving system: KV caching avoids redundant computation across generation steps, batching processes multiple requests simultaneously, and quantization reduces memory footprint by representing weights at lower precision.',
    'Understanding these techniques is essential for anyone building LLM-powered applications — they determine whether your deployment costs $1,000/month or $1,000,000/month.',
  ],
  sections: [
    {
      heading: 'KV Cache: From O(n²) to O(n)',
      body: 'During inference, the transformer computes attention over all past tokens at every generation step. For a 1,000-token context, that means 1,000 attention computations per new token — and most are redundant, since the past tokens haven\'t changed. The KV cache stores the Key and Value matrices for all past tokens after they\'re computed once. Each new token only needs to compute its own K and V, then attend to the cached past. This reduces per-step computation from O(n²) to O(n), making long contexts practical. The trade-off is memory: a KV cache for a 70B model with a 128k context can require tens of gigabytes of VRAM.',
    },
    {
      heading: 'Batching Strategies',
      body: 'A GPU is most efficient when processing many requests simultaneously — idle GPU cores are wasted capacity. Static batching waits until a batch fills before starting, which wastes time for users who arrive while a batch is processing. Dynamic batching adds requests as they arrive, reducing wait time but complicating memory management. Continuous batching (PagedAttention, used in vLLM) is the state of the art: it treats GPU memory like virtual memory, storing KV cache blocks in non-contiguous memory pages. This enables dozens of concurrent requests with different sequence lengths, achieving near-100% GPU utilization — roughly 2× the throughput of naive implementations on the same hardware.',
    },
    {
      heading: 'Quantization: Precision vs Memory',
      body: 'FP32 uses 32 bits (4 bytes) per weight — full precision, but enormous memory. FP16 uses 2 bytes per weight with negligible quality loss on most tasks. INT8 uses 1 byte per weight with roughly 1% quality loss and 3× faster inference on hardware with INT8 support. INT4 uses 0.5 bytes per weight with roughly 5% quality loss and 4× faster inference. Running LLaMA-3 8B as a concrete example: FP16 requires 16GB VRAM (just fits on a high-end consumer GPU); INT4 requires 4GB VRAM (runs on an Apple M2 MacBook). This is the gap that tools like llama.cpp and Ollama exploit to bring large models to consumer hardware.',
    },
    {
      heading: 'Speculative Decoding',
      body: 'Autoregressive generation is sequential by design — you must generate token N before token N+1. This limits parallelism. Speculative decoding breaks this constraint: a small draft model generates 4–8 tokens quickly (using few resources), then the large verifier model checks all of them in parallel in a single forward pass. If the draft tokens match what the verifier would have generated (which happens ~80% of the time for a well-matched draft), you\'ve produced 4–8 tokens for the cost of roughly 1 large-model forward pass. When a draft token is rejected, you fall back to the verifier\'s output and start fresh.',
    },
    {
      heading: 'Serving Architectures',
      body: 'Single-GPU serving works for small models (up to ~13B INT4) — a single A100 or consumer GPU handles one or a few concurrent requests. Multi-GPU tensor parallelism splits individual weight matrices across GPUs, with all GPUs collaborating on each token — effective for 30B–70B models. Pipeline parallelism assigns different transformer layers to different GPUs in sequence — simpler to implement but introduces pipeline bubbles. Disaggregated serving is the frontier approach: separate GPU clusters handle the prefill phase (processing the input prompt) and the decode phase (autoregressive generation), optimizing each independently. This enables massive scale with thousands of concurrent users.',
    },
    {
      heading: 'KV Cache: Avoiding Redundant Computation',
      body: 'During autoregressive generation, each new token attends to all previous tokens. Without caching, every generation step would recompute the Key and Value projections for every previous token — O(n²) work per sequence. The KV cache stores these computed K and V tensors, so each new step only needs to compute K and V for the single new token. This reduces generation from O(n²) to O(n), making long sequences practical.',
    },
    {
      heading: 'PagedAttention and vLLM',
      body: 'KV caches are memory-hungry. vLLM introduces PagedAttention: inspired by virtual memory in operating systems, it stores KV cache blocks in non-contiguous GPU memory, eliminating fragmentation. This allows vLLM to serve ~2× as many concurrent requests as naive implementations on the same hardware, making it the dominant open-source serving framework.',
    },
  ],
}
