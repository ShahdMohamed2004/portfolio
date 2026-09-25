# Security, Ownership, and Integrity Audit

**Project:** Shahd Mohamed — Portfolio  
**Host:** GitHub Pages  
**Audit date:** 2026-09-26  
**Scope:** Static HTML/CSS/JavaScript, external resources, metadata, repository controls, ownership attribution, and deployment integrity.

## Implemented in the website

- Added author, copyright, application-name, canonical, description, Open Graph, Twitter card, theme-color, favicon, and Web App Manifest metadata.
- Added Schema.org `Person` and `WebSite` entities linked to the existing LinkedIn profile and canonical portfolio URL.
- Added a discreet footer ownership statement and strategic `Original work by Shahd Mohamed` notices inside project content.
- Kept the existing CSP meta policy, strict-origin referrer policy, restrictive Permissions Policy, HTTPS-only external resources, and Google Drive frame allow-list.
- Preserved `rel="noopener noreferrer"` on external blank-target links and `referrerpolicy="no-referrer"` on the external teaching iframe.
- Prepared a GitHub Actions integrity workflow specification for pushes, pull requests, weekly checks, and manual dispatch. Publishing it was blocked by the current GitHub App token, which lacks the `workflows` permission; the exact manual setup is documented below.
- Added no anti-user right-click blocking, keyboard blocking, global text-selection disabling, fake encryption, or destructive self-defense code.
- Maintained the existing light-mode glass/cyan-purple visual refinement and rounded geometry without changing dark-mode styling in the latest visual pass.

## Audit findings and fixes

### Dynamic rendering / XSS surface

The site uses repository-owned static data rendered through templates. Existing hardening includes `escapeHtml()`, HTTPS hostname allow-lists for external links, restricted asset URLs, and Google Drive-only embed validation. No `eval()`, `new Function()`, `fetch()`, XMLHttpRequest, or string-based timers were found.

This remains a maintenance requirement: if content later comes from a CMS or untrusted contributor, keep escaping text and validating URLs, or move rendering to safer DOM APIs.

### External resources

The site uses HTTPS Google Fonts, Google Drive links/iframe, LinkedIn, Instagram, Gmail, and GitHub Pages URLs. No third-party JavaScript library, analytics tracker, ad script, API key, password, token, private key, or environment file was found in the repository.

### CSP and headers

A CSP meta policy is present and intentionally retains `'unsafe-inline'` because the current static page contains inline CSS/JavaScript. It restricts frames, objects, forms, sources, and mixed content. This is defense-in-depth, not a replacement for an HTTP response-header CSP.

GitHub Pages cannot configure repository-controlled response headers such as reliable CSP headers, HSTS, `X-Content-Type-Options`, `frame-ancestors`, COOP, CORP, rate limiting, or server-side authentication. A reverse proxy/CDN such as Cloudflare or a server-capable host is required for those controls.

### Dependencies

No `package.json`, lockfile, runtime package, or build dependency exists. `npm audit` is therefore not applicable. The site is a dependency-light static document.

### Repository governance

The public repository should be protected through GitHub settings: enable 2FA for maintainers, protect `main`, require pull requests/reviews and the integrity workflow before merge, disable force pushes, keep secret scanning and push protection enabled, review collaborators, and retain least-privilege access.

The new workflow detects and reports suspicious changes; it does not delete files, block legitimate deployments, or claim to prevent compromise.

## Controls by purpose

- **Deterrence:** visible ownership notices, copyright metadata, canonical URL, authorship schema, and asset attribution.
- **Detection:** Git history, GitHub secret scanning, push protection, and the prepared integrity workflow once it is added with workflow permission.
- **Prevention / reduction:** CSP meta policy, URL/asset/embed validation, HTTPS-only resources, safe link attributes, and restricted Permissions Policy.
- **Recovery:** Git version history, protected `main`, stable tags/releases, and offline backups of original assets.

A public website cannot make publicly delivered content impossible to copy or guarantee that it is unhackable.

## Recommended manual GitHub settings

1. Protect `main` and require pull requests.
2. Add `.github/workflows/security-audit.yml` from the prepared specification, then require the `Static security and integrity audit` check before merging.
3. Disable force pushes and branch deletion.
4. Keep secret scanning and push protection enabled; enable non-provider pattern scanning where available.
5. Enable Dependabot alerts/security updates if dependencies are added later.
6. Enable 2FA for every account with write/admin access and remove unnecessary collaborators.
7. Create stable release tags and keep a private backup of original creative assets.
8. Review every new external host before adding it to HTML, JavaScript, or CSP.

## Verification

- `node --check enhancements.js` passed.
- `node --check shahd-card.js` passed.
- `git diff --check` passed.
- Ownership metadata, canonical URL, CSP meta policy, manifest, and footer ownership markers are present.
- Existing external resources are HTTPS-only.
- No secrets or private credentials were found in the scanned source.
- The GitHub Actions workflow could not be pushed from this session because GitHub rejected the token without `workflows` permission.
- Accessibility safeguards remain enabled: keyboard navigation, focus indicators, screen-reader labels, normal selection, scrolling, and reduced-motion support.
