---
name: zero-hallucination-proofs
description: >-
  Enforces zero-hallucination scientific proofs, mathematical verification,
  empirical benchmarking, and rigorous academic citation grounding inspired by
  FutureHouse PaperQA, Cambridge SelfCheckGPT, DeepEval, Stanford DSPy, and Lean 4 formal verification.
---

# Zero-Hallucination Proof & Scientific Verification Protocol

This skill provides an uncompromising, machine-verifiable protocol to ensure AI agents NEVER hallucinate benchmark data, mathematical proofs, academic citations, or empirical claims.

It synthesizes state-of-the-art methodologies from leading open-source repositories:
1. **PaperQA2** (`whitead/paperqa` / FutureHouse) - Evidence-backed retrieval, strict chunk-level citation grounding.
2. **SelfCheckGPT** (`Exploration-Lab/SelfCheckGPT` / Cambridge NLP) - Zero-resource black-box hallucination scoring via stochastic sampling and NLI consistency.
3. **DeepEval** (`confident-ai/deepeval`) - Agent trajectory unit-testing, automated Faithfulness and G-Eval scoring.
4. **Stanford DSPy** (`stanfordnlp/dspy`) - Programmatic pipeline compilation with hard assertions (`dspy.Assert`) that reject hallucinations before output generation.
5. **Lean-Agent Protocol & Lean 4** (`arkanemystic/lean-agent-protocol`) - Theorem-prover formal verification for deterministic truth gates.

---

## 1. The 5 Core Invariants (Zero-Tolerance Rules)

### Invariant 1: No Parametric Estimation of Benchmark Data
- **Forbidden**: Estimating execution time, memory usage, compression ratio, or network throughput from the LLM's parametric weights (e.g. saying *"WASM runs in about 5ms"* without executing code).
- **Mandatory**: Every metric presented to the user must be produced by an executable test harness (`node`, `python`, `puppeteer`) and read directly from a generated artifact (CSV/JSON).

### Invariant 2: Cryptographic Metric Provenance
- Every numeric figure in a table or proof must cite its physical artifact path:
  - Example: `[benchmark_raw.csv](file:///d:/HelpMyFile/benchmark-results/benchmark_raw.csv)`
  - If the artifact does not exist on disk, the claim is treated as unproven.

### Invariant 3: Academic Citation Grounding (PaperQA Standard)
- NEVER invent author names, paper titles, DOIs, or publication venues.
- Academic references must be cross-verified using live API queries (`search_academic_works` or `verify_paper_doi` via OpenAlex / Semantic Scholar / arXiv).
- Non-verifiable references are rejected immediately.

### Invariant 4: Paired Statistical Rigor (MIT / USENIX Standard)
When claiming a performance advantage ($A > B$):
1. **Hypothesis Formulation**:
   - $H_0$: There is no significant difference in latency between In-Browser WASM and Cloud HTTP API ($\mu_{WASM} = \mu_{Cloud}$).
   - $H_1$: In-Browser WASM exhibits significantly lower latency ($\mu_{WASM} < \mu_{Cloud}$).
2. **Paired Execution**:
   - Both systems must process the exact same file in the identical environment.
3. **Statistical Metrics Required**:
   - Sample size $N \ge 30$ (ideally $N \ge 400$).
   - Student's paired $t$-test statistic ($t$) and degrees of freedom ($df$).
   - Exact two-tailed $p$-value ($p < 0.001$ required for decisive rejection of $H_0$).
   - Tail percentiles: $p50$, $p90$, $p95$, $p99$.
   - 95% Confidence Interval for Effect Size: $CI_{95\%} = \bar{x} \pm 1.96 \cdot SEM$.

### Invariant 5: DSPy-Style Assertion Feedback Loops
- If an agent generates an intermediate claim that violates an invariant or cannot be mapped to an executed data file, the output is discarded and the agent must trigger an execution step to gather the ground-truth data before continuing.

---

## 2. Verification Architecture Workflow

```text
       [ User Claim or Research Hypothesis ]
                         │
                         ▼
       [ Step 1: Formal Conjecture Formulation ]
                         │
                         ▼
       [ Step 2: Automated Empirical Test Harness ]
           ├─ Execute real binary workloads
           ├─ Stream real network sockets (Cloud vs Local)
           └─ Dump raw logs to benchmark-results/*.csv
                         │
                         ▼
       [ Step 3: Statistical Proof & Metric Generation ]
           ├─ Calculate mean, std dev, SEM
           ├─ Calculate paired t-test & p-value
           └─ Calculate p50, p90, p95, p99 tail latencies
                         │
                         ▼
       [ Step 4: Traceable, Auditable Delivery ]
           └─ Render verified proof tables with direct file:// links
```

---

## 3. Reference Repositories Integrated into this Protocol

| Repository | GitHub Target | Core Mechanism Leveraged |
| :--- | :--- | :--- |
| **PaperQA2** | `FutureHouse/paperqa` | In-line evidence extraction & verified DOI grounding |
| **SelfCheckGPT** | `Exploration-Lab/SelfCheckGPT` | Sample consistency check & NLI verification |
| **DeepEval** | `confident-ai/deepeval` | Automated faithfulness scoring & agent evaluation |
| **DSPy** | `stanfordnlp/dspy` | Compiler-level programmatic assertions |
| **Lean-Agent Protocol**| `arkanemystic/lean-agent-protocol` | Formal mathematical verification gates |
