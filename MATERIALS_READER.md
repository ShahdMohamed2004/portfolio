# Teaching materials card reader

The reader in `#materials` uses the supplied `id-motion-physics.html` physics and original ID artwork. All runtime code and artwork are stored in this repository; no iframe, external runtime, or authentication service is involved.

- `index.html`: reader markup, original file links and a progressive-enhancement wrapper.
- `materials-reader.css`: styles scoped to `#materials`, theme variables and reduced motion.
- `materials-reader.js`: spring motion, insertion/withdrawal, scan validation, localization, lifecycle cleanup and content reveal.
- `assets/materials-id-card.jpg`: the original embedded JPEG, extracted without conversion.
- `tests/materials-reader.cjs`: browser regression suite.

A valid pass begins at the visible left endpoint **inside the slot**, travels to the far right, and ends with a rightward release. Taps, partial passes, reverse movement, movement outside the slot, cancelled pointers and resizing do not verify. Withdrawing the card clears the pass. Releasing early leaves the card near the release position, allowing only its damped settling motion.

`revealMaterials({ source })` reveals the existing materials wrapper exactly once. `source` is `swipe` or `direct`; direct access does not simulate verification. The reader remains visible. Opening lasts until the page is reloaded, including across locale, theme and viewport changes. The `materials:revealed` DOM event carries the source.

The HTML contains working material links before JavaScript runs. Only successful reader initialization hides them. Missing JavaScript, missing reader CSS, a missing image or unsupported interaction APIs leave the files accessible. Locale changes are observed on the document's `lang` attribute; the site's existing grid renderer and link data remain unchanged.

## Validation

Use Node.js and Playwright:

```sh
npm install --no-save playwright
npx playwright install chromium
node tests/materials-reader.cjs
```

The test starts its own local static server. It covers mouse and emulated mobile touch, slot gating, cancellation, keyboard interaction, responsive layouts, Arabic/English, theme changes, direct access, resource-load failures and the existing CV printer. It does not replace testing on physical iOS/Android devices.
