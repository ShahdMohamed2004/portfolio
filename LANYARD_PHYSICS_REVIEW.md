# Lanyard Physics Review

## Scope

This review branch updates the existing `shahd-lanyard` component without replacing the site, its visual design, bilingual content, or dependency-light architecture. The changes are limited to `shahd-card.js`, `shahd-card.css`, and the cache-busting versions in `index.html`.

## Root cause

The component already contained a rope solver, but the interaction layer was incomplete: the `grab`, `move`, `release`, `breeze`, and `keyboard` methods were not wired to the card or focus target. In addition, the simulation overwrote the rope endpoint with the pointer target during every constraint pass. That made the card behave like a directly positioned element instead of a weighted body with momentum. Boundary handling also zeroed velocity at the edge, and the layout used a negative top offset that could let the host intrude into the hero content.

## Changes

The implementation now wires Pointer Events, Pointer Capture, `pointercancel`, lost capture, blur, visibility changes, and keyboard input. Touch gestures preserve normal vertical page scrolling until the gesture is clearly horizontal. The card keeps its grab offset while accounting for rotation, carries measured pointer velocity into release, and uses a spring-like follow response instead of an endpoint teleport.

The rope continues to use a fixed 120 Hz physics step. The card and rope are constrained with a weighted solver, the rope has bounded elastic extension, and the solver applies soft resistance plus a small reflected outward component at the computed rotated-card boundary. Bounds include the card corners and the clip geometry. Rope length, stretch, damping, spring strength, angular damping, angle range, and edge softness are centralized in `this.physics` and the geometry section of `measure()`.

The negative desktop and tablet lanyard offsets were removed so the reserved grid area, rather than overflow clipping, keeps the badge away from the hero text. The existing reduced-motion path remains direct and non-oscillating while keyboard control and reset remain available.

## Validation performed

- `node --check shahd-card.js` completed successfully.
- `git diff --check` completed successfully.
- Local preview served at `http://localhost:4173/` and the sandbox preview URL.
- Browser runtime inspection confirmed the custom element, shadow root, 17 rope nodes, computed rope length, bounded stretch, computed bounds, and keyboard focus target.
- Controlled synthetic pointer-down, pointer-move, and pointer-up events confirmed that drag starts, movement is retained, and release clears the drag state.
- Direct fixed-step simulation confirmed finite positions and angles during a held drag and after release, with the card retaining a non-zero release displacement before settling.
- Responsive geometry was re-measured at a 320 px-wide host; bounds remained finite and were derived from the actual card dimensions.

The branch has not been pushed or published. It is ready for review as `fix/lanyard-physics-review`.
