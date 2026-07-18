# Workspace Layout Rules

## Strict 50:50 Split for Dual-Panel Workspaces
- When creating a side-by-side workspace (e.g., Left Preview + Right Sidebar), I must use exactly `flex: 1` on BOTH panels.
- Do not use asymmetric base widths (e.g., `flex: 1 1 680px` vs `flex: 1 1 0%`) because it causes one panel to dominate the screen (e.g., 70:30 ratio) on large monitors.

## Prevent Workspace Shrinkage (The "Tiny PDF" Bug)
- Flex column wrappers containing the `DocumentLivePreview` or canvas must ALWAYS have a safe `minHeight` (e.g., `minHeight: 650px`).
- Using `minHeight: 0` allows the browser to shrink the workspace vertically to make room for bottom elements (like the Progress Bar), which forces the PDF canvas inside to scale down into a tiny, illegible thumbnail.

## Prevent Infinite Stretching ("Membentang")
- Whenever an element is moved out of a constrained sidebar into a full-width section (like moving the Download box to the bottom), its design must remain cohesive and not stretch absurdly wide if the screen is large.
