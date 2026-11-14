# One Pixel Studio

A local-first pixel art editor built as a single static HTML page. It lives at `/pixel-forge/` and runs on GitHub Pages without a build step, backend, account, or external dependencies.

## Open it

After GitHub Pages finishes publishing the repository, open:

`https://faiev.github.io/product-feed-clinic/pixel-forge/`

## Features

- Exact grid editing: every cell stores one solid color.
- Brush, eraser, flood fill, eyedropper, line, and rectangle tools.
- 16×16, 24×24, 32×32, 48×48, and 64×64 canvases.
- Custom palettes, undo/redo, and a starter artwork.
- Import an image and reduce it to the current grid, snapping each cell to the nearest palette color.
- Export transparent PNG at native size or 16× scale, crisp SVG, or a portable JSON project.
- Autosaves the current project in this browser's local storage.

## Privacy and limitations

All editing and image conversion happens locally in your browser. The app does not upload images or artwork, call external APIs, or use a server. Local autosave is specific to the browser and device; use **Project JSON** to move a project elsewhere.

Image import uses nearest-neighbor sampling to keep the grid crisp, then snaps each sampled cell to the nearest palette color. It does not promise to reproduce every source-image detail.

## Deploy

This folder is part of the existing `product-feed-clinic` GitHub Pages repository. The app is a plain `index.html`; no package manager, build command, or environment variables are needed.
