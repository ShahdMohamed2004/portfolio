# Security Audit and Hardening Report

**Project:** Shahd Mohamed Siddiq Portfolio  
**Hosting:** GitHub Pages (static site)  
**Audit date:** 2026-09-24  
**Scope:** Repository contents, HTML/CSS/JavaScript, links, embedded resources, browser storage, repository settings, deployment configuration, and Git history.

## SECURITY ISSUES FOUND

### 1. Dynamic HTML construction was not consistently guarded

The single-page application renders portfolio data through `innerHTML` templates in `index.html`. The current data is repository-owned and static, so this was not an active remote-input XSS finding. However, unescaped text or URLs would become a DOM-XSS risk if the content were later moved to a CMS, imported JSON, or edited by an untrusted contributor.

The affected area was the rendering block around the credential, project, materials, experience, education, skills, and creative sections. The risk was reduced by adding text escaping, URL allow-list validation, asset-path validation, and embed validation. The remaining architectural limitation is that the page still uses static HTML templates rather than a fully DOM-constructed renderer; future data changes must continue using the new helpers.

### 2. External iframe content required tighter controls

The teaching demonstration uses an external Google Drive preview iframe. External frames expand the browser attack surface and can leak referrer information if not constrained. The iframe is now limited to the Google Drive host by `frame-src`, receives `referrerpolicy="no-referrer"`, and is rendered only after URL validation. A sandbox attribute was not added because it would interfere with the existing Google Drive preview functionality.

### 3. GitHub repository branch protection is not configured

The repository is public and `main` is currently unprotected. This is a repository-governance risk rather than a browser vulnerability: an accidental or unauthorized direct push could reach GitHub Pages. The audit did not change account settings automatically. Recommended settings are listed below.

### 4. Static hosting cannot enforce response security headers from repository HTML

GitHub Pages reports HTTPS enforcement as enabled, but the repository cannot itself emit HTTP response headers such as `Strict-Transport-Security`, `X-Content-Type-Options`, `frame-ancestors`, or a response-header CSP. A CSP meta tag was added as a compatible defense-in-depth measure, but it is not equivalent to an HTTP response header.

## SECURITY ISSUES FIXED

- Added a restrictive, resource-specific CSP meta policy with `default-src 'self'`, `object-src 'none'`, `base-uri 'none'`, `form-action 'none'`, `frame-src https://drive.google.com`, restricted image/font/style/script/connect sources, and `upgrade-insecure-requests`.
- Added a strict-origin referrer policy and a restrictive Permissions Policy for camera, microphone, geolocation, payment, and USB.
- Added `escapeHtml()` for dynamic text inserted into HTML templates.
- Added `safeExternalUrl()` with HTTPS and hostname allow-list validation for external links.
- Added `safeAssetUrl()` to prevent arbitrary image sources.
- Added `safeEmbedUrl()` to restrict iframe sources to Google Drive.
- Preserved `rel="noopener noreferrer"` on blank-target links and added it to the Gmail compose link.
- Added `referrerpolicy="no-referrer"` to the external teaching iframe.
- Confirmed no repository secrets, private keys, environment files, source maps, logs, or dependency lockfiles are present.
- Confirmed no GitHub Actions workflows are present, so there is no workflow permission or pull-request command-injection surface in this repository.

## CODE HARDENING APPLIED

The JavaScript syntax check passed with `node --check`. The page was served locally after the changes, the CSP was present in the response body, and desktop/mobile rendering remained functional. Browser storage is limited to non-sensitive presentation preferences: `siteLang` and `siteTheme`. No credentials, tokens, or personal authentication state are stored in browser storage.

The page contains no forms, no `fetch()` calls, no XMLHttpRequest usage, no redirects, no `eval()`, no `new Function()`, and no string-based timers. External links are fixed portfolio destinations and are validated before dynamic assignment or template insertion.

## DEPENDENCY SECURITY

There is no `package.json`, lockfile, package manager dependency, build dependency, or runtime package in the repository. The site is a dependency-light static document. Consequently, an npm audit is not applicable. The only remote code-adjacent resources are Google-hosted fonts; no third-party JavaScript library or remote script is loaded.

## THIRD-PARTY RESOURCE SECURITY

External resources are HTTPS-only in the site code. Google Fonts are loaded from `fonts.googleapis.com` and `fonts.gstatic.com`. External navigation destinations are limited to Google Drive, Google Mail, LinkedIn, Instagram, and the portfolio's own GitHub Pages host. No analytics, tracking pixels, advertising scripts, external JavaScript bundles, or unnecessary API calls were found.

Inline SVG is used for the favicon and interface icons. The SVG content is static, contains no scripts or event handlers, and is not loaded from an untrusted source.

## GITHUB / REPOSITORY SECURITY

The repository is public by design. GitHub Secret Scanning is enabled and push protection is enabled. Dependabot security updates are disabled because the repository has no package dependencies. Non-provider secret scanning and secret validity checks are disabled. The default branch is `main`, GitHub Pages is sourced from `main`, and branch protection is not configured.

No GitHub Actions workflows were found. A complete Git-history pattern scan found no private-key blocks, GitHub token patterns, AWS access-key patterns, or Google API-key patterns.

## DEPLOYMENT SECURITY

GitHub Pages reports `https_enforced: true` for `https://shahdmohamed2004.github.io/portfolio/`. The repository contains no server, database, API endpoint, upload handler, authentication flow, or secret-dependent feature. This sharply limits the server-side attack surface.

The deployment still depends on GitHub account and repository access controls. Anyone who obtains write access to the repository could change the public site, so repository governance remains important.

## SECURITY CONTROLS THAT GITHUB PAGES SUPPORTS

- HTTPS delivery and enforced HTTPS for the configured Pages site.
- Static repository review, secret scanning, push protection, pull requests, code review, and branch governance through GitHub.
- Static HTML-level defenses such as safe link attributes, URL validation, escaped output, resource restrictions, and a CSP meta policy.
- Restrictive `robots.txt`, canonical HTTPS URLs, and HTTPS sitemap references.

## SECURITY CONTROLS THAT GITHUB PAGES CANNOT ENFORCE

- Reliable HTTP response-header CSP from repository HTML alone.
- `Strict-Transport-Security`, `X-Content-Type-Options`, `Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy`, and `frame-ancestors` response headers.
- Server-side rate limiting, abuse controls, form validation, authentication, authorization, or secret storage.
- Revocation or rotation of credentials that may exist outside this repository.

To enforce those controls, the site would need a reverse proxy, CDN edge configuration, or a server-capable host such as Cloudflare Pages/Workers, Netlify, Vercel, or a dedicated backend.

## REMAINING RISKS

1. The site is intentionally public and displays portfolio identity and contact destinations. This is expected exposure, not an accidental secret.
2. The site still uses inline JavaScript and inline CSS, so `unsafe-inline` remains necessary in the CSP meta policy. Moving to hashed or external assets would allow a stricter policy, but would be a larger structural change.
3. The external Google Drive iframe is allowed for existing functionality. It is host-restricted and referrer-restricted, but not sandboxed because sandboxing may break the preview.
4. GitHub Pages response headers remain outside the repository's control.
5. Client-side localStorage can be edited by the user. Only non-sensitive theme and language preferences are stored, so tampering has no security consequence.

## RECOMMENDED GITHUB SETTINGS

- Protect `main` and require pull requests before merging.
- Require at least one approving review for changes to `main`.
- Require status checks for HTML/JavaScript/security verification before merge.
- Disable force pushes and branch deletion on `main`.
- Keep secret scanning and push protection enabled; consider enabling non-provider pattern scanning and secret validity checks.
- Review repository collaborators and teams using least privilege.
- Enable 2FA for all users with write or administrative access.
- Keep GitHub Pages deployment tied to the protected `main` branch.
- Periodically review public branches and delete obsolete experiment branches when they are no longer needed.

## RECOMMENDED FUTURE SECURITY CHECKS

- Re-run secret scanning before every public deployment.
- Review every new external host before adding it to the CSP or link allow-list.
- Keep dynamic content escaped and URLs validated if the content source changes.
- Add a static HTML/JavaScript security check to CI after branch protection is enabled.
- Periodically verify GitHub Pages HTTPS enforcement and repository access.
- If forms, APIs, uploads, analytics, or authentication are added later, move those features to a server-capable architecture with server-side validation, rate limiting, and secret storage.

## ROLLBACK VERSION

The exact pre-security state for this pass is preserved at:

- Branch: `before-security-hardening-20260924`
- Tag: `original-before-security-hardening-20260924`
- Commit: `b413ce1` (`Refine hero hierarchy and responsive portfolio layout`)

The security changes are isolated on branch `security-hardening-20260924` until review and approval.

> This report describes practical hardening and verified controls. It does not claim that any website is 100% secure or unhackable.
