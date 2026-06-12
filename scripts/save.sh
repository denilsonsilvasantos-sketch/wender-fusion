#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

MSG="${1:-auto: $(date '+%Y-%m-%d %H:%M')}"

# ── 1. Stage all changes ──────────────────────────────────────────────
git add -A

# ── 2. Commit (skip if nothing staged) ───────────────────────────────
if git diff --cached --quiet; then
  echo "Nada para commitar."
else
  git commit -m "$MSG"
  echo "Commit: $MSG"
fi

# ── 3. Push ───────────────────────────────────────────────────────────
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if git ls-remote --exit-code --heads origin "$BRANCH" > /dev/null 2>&1; then
  git push
else
  git push -u origin "$BRANCH"
fi

echo "Feito! Branch '$BRANCH' publicado."
