# Academic Formatting Standards and Typesetting Invariants

This rule establishes strict constraints for crafting academic manuscripts (Scopus Q1, IEEE Transactions, ACM, USENIX, Elsevier). It eliminates ad-hoc script generation and enforces official typesetting standards.

---

## 1. Absolute Prohibition of Ad-Hoc Script Generation
- **NEVER** use `python-docx`, custom string-dumping scripts, or ad-hoc automation to generate academic papers from scratch based on personal assumptions.
- Generating Word documents via raw Python scripts inevitably introduces broken equation formatting, table move handles (`[+]`), and web styling bugs.
- **Mandatory Authoring Standards**:
  - **LaTeX (Primary Standard)**: Use official IEEEtran (`\documentclass[journal]{IEEEtran}`), ACM (`acmart`), or Elsevier (`elsarticle`) templates.
  - **Word (Secondary Standard)**: Only use official publisher template files (`.dotx` / `.doc` from IEEE Author Center or Elsevier Author Resources) using their built-in macro styles.

## 2. Zero Plaintext Math (Mathematical Typography Standard)
- **Zero Underscores**: Mathematical formulas must NEVER contain raw underscores (`_`). Underscores are programming syntax, not academic typography. All variable subscripts must use true subscripts ($T_{\text{cloud}}$, $S_{\text{in}}$, $BW_{\text{up}}$).
- **Multi-Letter Identifiers**:
  - Single-letter mathematical variables are italicized ($T$, $S$).
  - Multi-letter text labels, words, and subscripts must be upright/roman ($\text{cloud}$, $\text{wasm}$, $\text{in}$, $\text{out}$, $\text{server}$).
- **Vertical Fractions**: Displayed equations must use true vertical fraction bars ($\frac{A}{B}$), NEVER inline wrapped slashes (`(A) / (B)`) that cause soft wrapping and layout breakage.
- **True Equation Objects**: In Word, equations must be inserted as native OMML Equation Objects (`Alt` + `=`) or MathType. In LaTeX, use standard equation environments (`\begin{equation}`).

## 3. Strict Booktabs Rule for Academic Tables
All tables must adhere strictly to the universal academic **Booktabs Standard** (inspired by `dspinellis/latex-advice` and IEEE style):
- **Zero Color / Shading**: Background fill must be 100% white/transparent. Dark blue, black, or colored header bars are STRICTLY FORBIDDEN.
- **Zero Zebra Striping**: Alternating row backgrounds are forbidden.
- **Zero Vertical Borders**: Do not use left, right, or inner vertical grid lines.
- **Exactly Three Horizontal Rules**:
  1. Top Rule (1.5 pt solid line) above the column headers.
  2. Mid Rule (0.75 pt solid line) below the column headers.
  3. Bottom Rule (1.5 pt solid line) at the base of the table.

## 4. Academic Pseudocode & Algorithm Formatting
- **No Table Enclosures**: Algorithms must NEVER be placed inside Word table cells (which triggers Word's `[+]` table move handle).
- **Three-Rule Boundary**:
  - Top solid rule (1.5 pt).
  - Algorithm header: **Algorithm 1:** Title.
  - Middle solid rule (0.75 pt).
  - Bold keywords: **Input:**, **Output:**, **if**, **then**, **else**, **return**.
  - Comments must use the standard triangle notation ($\triangleright$ *Comment text*), NEVER C-style `//` or Python `#`.
  - Bottom solid rule (1.5 pt).
- **No ASCII Art**: Never use dashed plaintext separators (`----------`).

## 5. Verification Against Authoritative References
- Never formulate layout rules or typesetting structures on personal intuition or developer CSS habits.
- Cross-verify all typesetting against:
  - `dspinellis/latex-advice` (Diomidis Spinellis)
  - Official IEEE Transactions Template (`IEEEtran`)
  - ACM TAPS & Master Article Template
