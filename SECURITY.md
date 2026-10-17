# Security Policy

## Scope

This repository is a public, static portfolio deployed through GitHub Pages. Publicly delivered HTML, CSS, JavaScript, images, and intentionally published previews must be treated as copyable by design.

## Protections in this project

- HTTPS is enforced by GitHub Pages.
- `main` is protected and requires pull-request review.
- Secret scanning and push protection are enabled on GitHub.
- Public previews are separated from private originals. Identity-card details are not published in the current site.
- The page uses a restrictive browser policy, safe external-link attributes, URL allow-lists, escaped dynamic text, and a Google Drive-only frame allow-list.
- The repository includes `tools/security-audit.sh`, which validates JavaScript syntax, obvious secret patterns, insecure HTTP resources, suspicious private-file names, and the presence of the redacted public preview.
- A GitHub Actions template is present separately, but enabling it requires a GitHub token with the `workflows` permission.

## Reporting

Please report suspected vulnerabilities or accidental exposure of private material to the contact listed in [`.well-known/security.txt`](.well-known/security.txt). Do not publish private files, credentials, or exploit details in a public issue.

## Important limitations

This static site cannot provide server-side authentication, authorization, signed downloads, rate limiting, a WAF, malware scanning of visitor devices, or guaranteed prevention of copying, screenshots, or recording. It does not contain spyware, hidden remote-control code, destructive scripts, or code intended to access another person's device.

Private editable files, identity documents, and original high-resolution assets must remain outside this public repository and outside public Google Drive links. If a private resource is needed later, use a server-capable platform with access control and short-lived signed URLs.
