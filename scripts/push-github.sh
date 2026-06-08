#!/bin/bash
set -e

REPO="https://yakusag:${GITHUB_TOKEN}@github.com/yakusag/fundedplus-49e5012a.git"

git config --global user.email "bot@fundedplus.com"
git config --global user.name "FundedPlus Bot"

if git remote get-url origin &>/dev/null; then
  git remote set-url origin "$REPO"
else
  git remote add origin "$REPO"
fi

git add -A
git diff --cached --quiet && echo "Nothing to commit, working tree clean" && exit 0
git commit -m "chore: auto-push from Replit — $(date '+%Y-%m-%d %H:%M')"
git push origin HEAD:main --force

echo "✅ Pushed to GitHub: https://github.com/yakusag/fundedplus-49e5012a"
