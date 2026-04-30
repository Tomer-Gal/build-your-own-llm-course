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
      heading: 'KV Cache: Avoiding Redundant Computation',
      body: 'During autoregressive generation, each new token attends to all previous tokens. Without caching, every generation step would recompute the Key and Value projections for every previous token — O(n²) work per sequence. The KV cache stores these computed K and V tensors, so each new step only needs to compute K and V for the single new token. This reduces generation from O(n²) to O(n), making long sequences practical.',
    },
    {
      heading: 'Batching Strategies',
      body: 'Static batching groups requests into fixed-size batches that start and finish together. This is simple but inefficient — if one request in a batch is very long, all others must wait. Dynamic batching allows requests to join a batch as they arrive. Continuous batching (used by vLLM, TGI) is the state of the art: it processes a stream of requests, adding new ones as soon as any in the current batch finish, maximizing GPU utilization.',
    },
    {
      heading: 'Quantization: Trading Precision for Speed',
      body: 'Quantization represents model weights at lower numerical precision: FP32 (32-bit float), FP16 (16-bit float), INT8 (8-bit integer), or INT4 (4-bit integer). Each halving of precision halves memory usage and typically doubles throughput — at some cost to model quality. For most tasks, the quality degradation from FP16 is imperceptible, INT8 is usually acceptable, and INT4 may show noticeable quality loss on sensitive tasks.',
    },
    {
      heading: 'Serving Architectures',
      body: 'A single GPU can serve models up to ~24B parameters at FP16. Larger models require model parallelism: tensor parallelism splits individual weight matrices across GPUs (all GPUs work on each token), while pipeline parallelism assigns different layers to different GPUs (GPUs pass activations in sequence). For highest throughput, multiple model replicas can serve different users simultaneously.',
    },
    {
      heading: 'PagedAttention and vLLM',
      body: 'KV caches are memory-hungry. vLLM introduces PagedAttention: inspired by virtual memory in operating systems, it stores KV cache blocks in non-contiguous GPU memory, eliminating fragmentation. This allows vLLM to serve ~2× as many concurrent requests as naive implementations on the same hardware, making it the dominant open-source serving framework.',
    },
  ],
}
