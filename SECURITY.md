# Security Policy

## Supported site

The supported public site is:

https://shahdmohamed2004.github.io/portfolio/

This is a static GitHub Pages portfolio. It does not accept passwords, payments, file uploads, or private user data.

## Reporting a security issue

Please report suspected vulnerabilities privately to:

shahdmohamed25042004@gmail.com

Do not publish exploit details in a public issue before the owner has had a reasonable opportunity to investigate.

Include the affected URL or file, the steps to reproduce, the security impact, and any safe proof of concept. Never include passwords, access tokens, private keys, or personal data in a report.

## Scope and limitations

GitHub Pages publishes the repository's static HTML, CSS, JavaScript, and assets. Public source code can be inspected and copied; this cannot be prevented by client-side code. Secrets must never be placed in this repository.

The repository uses HTTPS enforcement, protected `main`, pull-request review requirements, secret scanning, push protection, and a restrictive browser CSP meta policy. GitHub Pages does not provide project-level control over all HTTP response security headers, so the site is not a substitute for a server-backed application when authentication or private data is needed.
