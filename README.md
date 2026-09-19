# Shahd Mohamed Siddiq Portfolio

A bilingual, responsive static portfolio for Shahd Mohamed Siddiq. The site is intentionally dependency-light: the main experience lives in `index.html`, with optimized image and sharing assets in `assets/`.

## Local preview

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173/`.

## Contents

- `index.html` — complete HTML, CSS, bilingual content, RTL/LTR behavior, and interactions.
- `assets/about.webp` — optimized portrait used by the site.
- `og-image.png` — social sharing preview image.
- `manifest.webmanifest`, `robots.txt`, `sitemap.xml` — installability and search metadata.

The canonical deployment is the GitHub Pages site: https://shahdmohamed2004.github.io/portfolio/

## Versioning and UX pass

The published `main` branch remains the stable version. The previous stable snapshot is preserved in `backup-before-ux-pass-20260919`, while the refinement work is isolated in `ux-system-pass-20260919` until review. The pass preserves the existing bilingual content, visual identity, theme switcher, reduced-motion behavior, and native scrolling while hardening responsive and accessibility details.

The baseline findings and scope are recorded in `UX_AUDIT_BASELINE.md`.
