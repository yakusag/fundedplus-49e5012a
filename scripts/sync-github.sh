#!/bin/bash
# Auto-sync to GitHub whenever Replit creates a new checkpoint (commit)
# Runs in the background alongside the dev server

REPO="https://yakusag:${GITHUB_TOKEN}@github.com/yakusag/fundedplus-49e5012a.git"
LAST_HASH=""

echo "[sync] GitHub auto-sync started"

while true; do
  CURRENT_HASH=$(git --no-optional-locks log --oneline -1 --format="%H" 2>/dev/null || echo "")
  if [ -n "$CURRENT_HASH" ] && [ "$CURRENT_HASH" != "$LAST_HASH" ]; then
    if [ -n "$LAST_HASH" ]; then
      echo "[sync] New commit detected: ${CURRENT_HASH:0:7} — pushing to GitHub…"
      git push "$REPO" HEAD:main --force 2>&1 | grep -v "https://" || true
      echo "[sync] ✅ Pushed"
    fi
    LAST_HASH="$CURRENT_HASH"
  fi
  sleep 30
done
