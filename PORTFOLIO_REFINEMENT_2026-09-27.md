# Portfolio refinement — 27 September 2026

Base: `5140dd99af2f6a5d51c8eee6ddfeb47268693686`.
Backup: [`backup-before-motion-fix-20260927`](https://github.com/ShahdMohamed2004/portfolio/tree/backup-before-motion-fix-20260927).

## Requirements and implementation

| Supplied brief | Implementation | Verification |
| --- | --- | --- |
| Motion boundaries / independent top dock | A single header-local controller; fixed top offset (16px desktop, 12px plus safe area on mobile); only individual controls animate. No document pointer or scroll input for dock. | Outside-pointer, stationary-pointer, leave, scroll, resize, RTL and theme-switch browser assertions. |
| Dock performance / lifecycle | Cached geometry on entry/layout changes; one coalesced, finite RAF loop; bounded translations (at most 2px) and 1.045 scale; RESTING/ACTIVE/RETURNING; no idle loop; AbortController, observers and pagehide cleanup. | Instrumented RAF and geometry-read counters remain unchanged while idle/outside and on scroll. No permanent dock will-change. |
| Group-motion cleanup | Removed site-wide dock registration, duplicate project-glow listener, alternate light-mode dock transform, section-content and nested heading parent animation, and reveal transforms on multi-card grid wrappers. Independent card and heading motion retained. | No dock-controlled nodes in main content; existing reader and independent controls regressions pass. |
| Light editorial edition | Scoped burgundy #7A263A / deep #5D1F2E, ivory #F7F2EC, beige #EDE4DB, charcoal #211C1D. Warm glass, borders, surfaces and shadows. Green retained for small identity/status details. CV Printer receives light-only palette tokens. | Desktop and Arabic/mobile screenshots; theme switching; dark-mode source remains outside new palette selectors. |
| Post-scan ID parallax | Same original ID image, proportions and artwork shown after successful scan. Local mouse and touch tilt, ±10° clamp, subtle reflection; optional permission-gated relative device orientation. Reader entry physics unchanged. | Actual reader completion, mouse and CDP touch tests, neutral return, reduced-motion and simulated orientation. |
| Passport / paper evidence | Four categories link to original teaching/assessment/design/EdTech project evidence. Five original material cards receive paper-file treatment. First reveal 360ms; subsequent 140ms, then original URL opens. Modified clicks remain native. Blocked popups fall back to current-tab navigation. | Unchanged six material hrefs, original-evidence category mapping, popup URL/opener, locale rerender. |
| CV separation | Resume retains its original direct Drive link; no evidence-file animation. Existing CV Printer / Paper Edition and local CV asset remain separate. | Existing printer dialog and original download assertions. |
| Preservation / accessibility | No content rewriting, external uploads, new dependencies, backend changes or Drive changes. Reader fallback links remain accessible with missing JS/CSS/image and without JavaScript. Reduced motion preserves access. | Existing reader regression plus new acceptance suite. |

## Evidence sources

The six original Google Drive destinations were checked through the connected Drive account: Certificates, Feedbacks, Shahd_Mohamed_CV.pdf, Researches, Practical Work Videos and Projects. All six exist and are not trashed. This verifies existence in the connected account; it does not change or independently guarantee anonymous public sharing permissions.

Passport stamps point to existing links in the current project descriptions. They are navigation categories, not new credentials. Actual evidence stays hosted at its original destination.

## Validation

- `node tests/materials-reader.cjs`: 118 passing assertions, zero JavaScript errors. Mouse, keyboard, touch, interruptions, near-miss swipe rejection, repeated scan, languages, themes, CV dialog, asset failures and no-JS fallback.
- `node tests/portfolio-pass.cjs`: 59 passing assertions, zero JavaScript errors. Dock isolation and idle counters, header bounds, six original destinations, passport stamps, post-scan tilt, mobile menu and reduced motion.
- `node tests/portfolio-sensors.cjs`: 6 assertions for simulated granted permission, tilt clamp, reduced-motion reset, offscreen reset and missing passport assets.
- WebKit was downloaded, but its runtime libraries are absent and this sandbox cannot install system packages. Safari execution was **not verified**.
- Responsive widths covered across the suites: 320, 360, 390, 420, 430, 768, 1024, 1280 and 1440px.
- `node --check` on changed scripts and `git diff --check` pass.

Tests are controlled browser checks, not a guarantee of identical frame rates on every phone. Device orientation is simulated; real gyroscope behavior and iOS permission prompts still depend on hardware/browser support. Touch remains available when sensor support or permission is absent. No external Drive files were modified or downloaded by the implementation.

## Deployment and rollback

GitHub Pages currently publishes `main` from `/`. Review this branch before merging to make the changes visible on the public site. The backup branch and ZIP preserve the complete starting version. Rollback is a new revert commit, not a force-push or history rewrite.
