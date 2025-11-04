Mirai Planner
================

Schema‑driven trip planner with a simple editor (planner) and an enhanced, modular, print‑friendly renderer (trip guide).

Structure
- `schema/` — JSON Schema defining the data model (trip data + render configuration).
- `editor/` — Minimal schema‑driven editor UI for trip planning.
- `renderer/` — Modular renderer with optional Japan-style daily planner elements.
- `archive/` — Older/prototype files for reference.

Quick Start
- **Plan your trip:**
  - Open `editor/index.html` in a browser.
  - Choose `schema/trip-planner.schema.json` when prompted for schema.
  - Load a trip JSON, edit activities/days/segments, then use "Download JSON".
- **Render your guide:**
  - Open `renderer/index-enhanced.html` in a browser.
  - Select your trip JSON to render the printable trip guide.
  - **NEW:** Optionally load a render config JSON to enable enhanced modules (word banks, scavenger hunts, Japanese decorations, etc.)
  - Or use `renderer/index.html` for the original simple renderer

Enhanced Renderer Features
- **Two Styles:** "clean" (original minimalist) or "daily-planner" (Japan-inspired with decorative elements)
- **Optional Modules:** Word bank, phrase/kanji of the day, fun facts, scavenger hunts, kid quests, checklists, notes sections, microseasons
- **Configurable:** Use `renderer/japan-planner-config.json` (full features) or `renderer/clean-config.json` (minimal) as templates
- **Modular & Reusable:** Same trip data can be rendered with different configs for different audiences (kids vs. adults, cultural focus vs. logistics-only)

See `renderer/README.md` for detailed configuration documentation.

GitHub Pages
- Publishing source: set to `docs/` in repository settings.
- Hosted URLs:
  - Landing: `docs/index.html`
  - Renderer: `docs/renderer/index.html`
  - Editor: `docs/editor/index.html`

Offline/vendorized assets
- To run the editor fully offline (no CDN), place the following files under `docs/vendor/`:
  - `ajv-6.12.6.min.js` (Ajv v6)
  - `Sortable.min.js` (SortableJS v1.15.0)
  - `jsoneditor.min.js` and `jsoneditor.min.css` (JSONEditor v9.10.3)
- The editor tries local `docs/vendor/*` first, then falls back to the CDN versions.

Notes
- The editor and renderer are static and use CDN scripts; they work from local files.
- Original files remain at the repo root (for continuity); new organized copies live under `editor/`, `renderer/`, and `schema/`.
