# Workspace Layout Rules

## Strict 50:50 Split for Dual-Panel Workspaces
- When creating a side-by-side workspace (e.g., Left Preview + Right Sidebar), I must use exactly `flex: 1` on BOTH panels.
- Do not use asymmetric base widths (e.g., `flex: 1 1 680px` vs `flex: 1 1 0%`) because it causes one panel to dominate the screen (e.g., 70:30 ratio) on large monitors.

## Prevent Workspace Shrinkage (The "Tiny PDF" Bug)
- To prevent the PDF canvas from scaling down into a tiny thumbnail on mobile, you must ensure the container has a minimum height so the JS canvas scaling logic has a nonzero `clientHeight` to measure.
- **CRITICAL**: NEVER fix this by hardcoding `minHeight: 650px` inline! Inline `minHeight` prevents flexbox from shrinking on small desktop screens, causing the UI to overflow and chop off the canvas.
- **Instead**, keep `minHeight: 0` inline and rely on CSS media queries (e.g., applying classes like `.tool-workspace-left` with `min-height: 50vh !important` on mobile).

## Prevent Infinite Stretching ("Membentang")
- Whenever an element is moved out of a constrained sidebar into a full-width section (like moving the Download box to the bottom), its design must remain cohesive and not stretch absurdly wide if the screen is large.

## Strict Viewport Height (100vh) Separation
- **Desktop**: When a workspace requires a full-screen app feel, DO use viewport heights (e.g., `height: calc(100vh - 220px)`). Do NOT remove these inline `vh` declarations when optimizing for mobile.
- **Mobile**: NEVER let `100vh` dictate the height of a vertical column layout on mobile, as it will squish elements (Toolbar, Canvas, Sidebar) together and make the page unscrollable.
- **Implementation**: Override the height strictly in the mobile CSS media query using `height: auto !important` and `max-height: none !important`. 
- **CRITICAL**: Never hardcode `height: 50vh !important` on a mobile wrapper containing multiple children, as it will prematurely cut off content. Let mobile scroll naturally with `height: auto`.

## Strict Typography Rules (The Premium Math Standard)
- **Section Titles (H2)**: Must strictly use `clamp(2.2rem, 5vw, 3.5rem)` across all sections (How-To, Geo, Privacy, Performance, FAQ) to ensure congruence.
- **Section Descriptions (P)**: Must strictly use `clamp(1.05rem, 2vw, 1.25rem)` with a comfortable line-height (e.g., 1.7 or 1.8).
- **Sub-titles (H3)**: Must strictly use `clamp(1.25rem, 3vw, 1.5rem)`.
- **Hero/Main Titles (H1)**: Must strictly use `clamp(1.8rem, 4vw, 3.5rem)` (or up to 4.5rem if space allows).

## Full-Bleed Background Constraints
- When building sections that require edge-to-edge full-bleed backgrounds (like alternating white/gray sections), **NEVER** wrap the entire page `<main>` in a `maxWidth` constraint if `<main>` also has `overflow: auto`. `overflow: auto` creates a scroll context that instantly clips negative margin CSS breakout tricks.
- **Instead**, make the scrollable `<main>` 100% wide (no padding, no max-width) and apply the `maxWidth: 1440px` and horizontal `padding` (e.g., `0 24px`) explicitly to its inner children (Header, Editor Workspace, Dropzone). This allows full-width sections to span `100vw` naturally without fighting their parent.

## No Glow Effects
- The user **HATES** the "glow" concept (e.g., blurred radiant or ambient background shadows).
- **NEVER** use `filter: blur(...)` or `radial-gradient` glow effects for decorative ambient lighting behind elements. Keep designs clean, flat, and solid.
