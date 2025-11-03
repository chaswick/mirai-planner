Mirai Planner
================

Schema‑driven trip planner with a simple editor (planner) and a clean, print‑friendly renderer (trip guide).

Structure
- `schema/` — JSON Schema defining the data model.
- `editor/` — Minimal schema‑driven editor UI.
- `renderer/` — Final read/print view for a trip JSON.
- `archive/` — Older/prototype files for reference.

Quick Start
- Open `editor/index.html` in a browser.
  - Choose `schema/trip-planner.schema.json` when prompted for schema.
  - Load a trip JSON, edit, then use “Download JSON”.
- Open `renderer/index.html` in a browser.
  - Select the trip JSON to render the printable trip guide.

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
