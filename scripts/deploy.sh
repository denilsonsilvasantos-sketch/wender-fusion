#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# Skip everything if nothing changed
if git diff --quiet HEAD && git diff --cached --quiet && [ -z "$(git ls-files --others --exclude-standard)" ]; then
  echo "Nenhuma mudança — pulando deploy."
  exit 0
fi

MSG="${1:-deploy: $(date '+%Y-%m-%d %H:%M')}"

echo "── Build ─────────────────────────────────────"
npm run build:frontend

echo "── Commit ────────────────────────────────────"
git add -A
if git diff --cached --quiet; then
  echo "Nada novo para commitar."
else
  git commit -m "$MSG"
  echo "Commit: $MSG"
fi

echo "── Push ──────────────────────────────────────"
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if git ls-remote --exit-code --heads origin "$BRANCH" > /dev/null 2>&1; then
  git push
else
  git push -u origin "$BRANCH"
fi

echo ""
echo "Feito! Deploy do branch '$BRANCH' concluído."
