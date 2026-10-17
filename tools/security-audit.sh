#!/usr/bin/env bash
set -euo pipefail

# Static portfolio security checks. Run from the repository root.
command -v git >/dev/null
command -v node >/dev/null

while IFS= read -r -d '' file; do
  node --check "$file"
done < <(find . -type f -name '*.js' -not -path './.git/*' -print0)

git diff --check

if git grep -nE 'BEGIN (RSA|OPENSSH|EC|DSA) PRIVATE KEY|AKIA[0-9A-Z]{16}|gh[pousr]_[A-Za-z0-9]{20,}|AIza[0-9A-Za-z_-]{30,}' -- ':!*.md'; then
  echo 'Potential secret pattern found.' >&2
  exit 1
fi

if find . -type f \( -iname '*.env' -o -iname '*.pem' -o -iname '*.key' -o -iname '*.p12' -o -iname 'credentials*' -o -iname 'private*' \) -not -path './.git/*' -not -path './tools/security-audit.sh' | grep -q .; then
  echo 'Potential private file found in the public repository.' >&2
  exit 1
fi

if git grep -nE 'http://' -- '*.html' '*.js' '*.css' '*.json' '*.webmanifest'; then
  echo 'Insecure HTTP resource found.' >&2
  exit 1
fi

test -f assets/materials-preview.webp
test ! -e assets/materials-id-card.jpg
grep -q 'materials-preview.webp' index.html
grep -q 'Content-Security-Policy' index.html
test -f .well-known/security.txt
test -f SECURITY.md

echo 'Static security audit passed.'
