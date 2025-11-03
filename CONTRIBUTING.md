Contributing to Mirai Planner
=============================

Thanks for your interest in improving Mirai Planner!

How to Contribute
- Issues: Use GitHub Issues to report bugs or request features. Include steps to reproduce and sample JSON if relevant.
- Pull Requests:
  - Fork and create a feature branch from `main`.
  - Keep changes focused and small; include a brief rationale.
  - Ensure editor and renderer still work by loading a sample JSON.
  - Reference related issues in the PR description (e.g., “Fixes #123”).

Development
- Static app: open `editor/index.html` and `renderer/index.html` directly in a browser.
- Schema lives in `schema/trip-planner.schema.json`.
- GitHub Pages serves from `docs/` (hosted editor/renderer and samples).

Coding Style
- Prefer small, composable functions and descriptive names.
- Keep HTML/JS/CSS self‑contained; avoid adding build steps.
- Follow the existing design and naming patterns when possible.

Line Endings
- The repo enforces LF in `.gitattributes`. Windows users can keep local CRLF; Git will normalize on commit.

Security
- When adding new CDNs, include SRI hashes and `crossorigin="anonymous"`.
- Avoid third‑party code without a clear license and provenance.

