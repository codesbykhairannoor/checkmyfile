---
name: goat-paper-craft
description: >-
  Standard for crafting world-class, historically groundbreaking academic research papers
  inspired by Simon Peyton Jones, George Whitesides, Diomidis Spinellis (dspinellis/latex-advice),
  and legendary computer science papers (MapReduce, WebAssembly, Attention Is All You Need, Bitcoin).
---

# GOAT Paper Craft: The Architecture of World-Class Academic Papers

This skill codifies the anatomy, prose aesthetics, formal modeling, and empirical structure found in the most influential, paradigm-shifting research papers in computer science history (MIT CSAIL, USENIX Security, ACM CCS, IEEE S&P, OSDI, PLDI).

It synthesizes:
1. **Simon Peyton Jones (Cambridge/MSR)**: *"How to Write a Great Research Paper"* (The 4-sentence abstract, top-down narrative, write-early philosophy).
2. **George Whitesides (Harvard)**: *"Whitesides' Group: Writing a Paper"* (Data-first drafting, hypothesis testing, outline blueprints).
3. **Diomidis Spinellis (`dspinellis/latex-advice`)**: Typography, anti-slop academic grammar, and formal table presentation.
4. **Canonical Systems Papers**: *MapReduce* (OSDI '04), *Bringing the Web up to Speed with WebAssembly* (PLDI '17), *Bitcoin* (2008), *QUARK Browser Kernel* (USENIX Security '14).

---

## 1. The 4-Sentence Abstract Formula (Simon Peyton Jones Standard)

An abstract must never exceed one tight paragraph. It strictly answers four questions:
1. **Sentence 1 (The Problem)**: State the problem clearly and crisply.
2. **Sentence 2 (The Flaw of Current Art)**: Explain why existing approaches fail or impose unacceptable trade-offs.
3. **Sentence 3 (The Key Insight / Solution)**: State the novel core idea or architectural paradigm introduced.
4. **Sentence 4 (The Empirical Punchline)**: Report the decisive, measured real-world result (e.g. speedup factor, p-value, zero-egress proof).

*Anti-Pattern*: Never use vague filler sentences like *"Document processing is an important area of research..."*

---

## 2. The 8-Section Canonical Structure

```text
Title: Punchy, Descriptive, Memorable
├── Abstract (4 Sentences)
├── 1. Introduction
│    ├── The Real-World Context & Tension
│    ├── The Core Insight (The "Ping")
│    └── Explicit Contributions Bullet Points (3-4 items)
├── 2. Background & Threat Model
│    ├── Previous Paradigms (e.g., Cloud SaaS API Bottlenecks)
│    └── Formal Threat Model (Dolev-Yao / Honest-but-Curious)
├── 3. System Architecture & Design
│    ├── Architectural Schematic (Pipeline Diagram)
│    ├── Memory Boundaries & Isolation Invariants
│    └── Zero-Egress Information Flow Non-Interference
├── 4. Implementation Details
│    ├── Low-level Engineering Challenges
│    └── Worker Offloading & Memory Compaction
├── 5. Empirical Evaluation (Whitesides Data-First)
│    ├── RQ1: Execution Latency & Speedup
│    ├── RQ2: Statistical Significance (t-test, p-value, CI95)
│    ├── RQ3: Tail Latency Percentiles (p50, p90, p99)
│    ├── RQ4: Repeatability, Variance, & Counter-Balancing
│    ├── RQ5: Security Forensics & Zero Network Egress
│    └── RQ6: Economic Scaling & Infrastructure Efficiency
├── 6. Related Work (Placed AFTER our contributions, not before)
├── 7. Discussion & Limitations (Intellectual Honesty)
└── 8. Conclusion (Synthesis of the Paradigm Shift)
```

---

## 3. The Whitesides Data-First Rule

Never write paragraphs before designing your figures and tables.
1. Build the tables and graphs first based on executed physical data (`.csv` / `.json`).
2. The body of the paper acts as the connective tissue that guides the reader logically from Table 1 to Table N.
3. Every claim in the text must cite an exact column, row, or artifact trace.

---

## 4. Prose Style & Tone: Zero Fluff, Maximum Punch

- **Active Voice**: Write *"We demonstrate"* or *"Client-side WASM reduces latency"*, NOT *"It was observed that..."* or *"One could argue that..."*.
- **Declarative Topic Sentences**: The first sentence of every paragraph must state the conclusion. The rest of the paragraph provides the evidence.
- **Intellectual Honesty**: Do not hide system limitations. State exactly where the system reaches its boundary (e.g. multi-gigabyte memory limits in browser tabs). Reviewers at MIT and USENIX reward rigorous self-awareness.
- **Eliminate AI Slop Words**: Ban words like *"delve"*, *"testament"*, *"tapestry"*, *"game-changing"*, *"groundbreaking"*, *"leverage"*, *"pivotal"*. Replace them with concrete physical verbs and verified numbers.

---

## 5. Formal Mathematical Invariant Protocol

For systems and security claims, express properties as mathematical invariants:
- **Non-Interference / Zero-Egress Invariant**:
  $$\forall \text{Doc} \in \mathcal{D}, \quad |\text{Net}_{out}(\text{Doc})| = 0 \text{ bytes}$$
- **Speedup Confidence Interval**:
  $$CI_{95\%} = \bar{x} \pm 1.96 \cdot \frac{\sigma}{\sqrt{N}}$$
- **Tail Latency Invariant**:
  $$p99(\text{WASM}) < p99(\text{Cloud})$$
