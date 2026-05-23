#!/usr/bin/env bash
# Usage: NEW_VERSION=x.y.z build-release-notes.sh <base_sha> [previous_tag]
# Writes Markdown release notes to stdout. previous_tag may be empty.

set -euo pipefail

NEW_VERSION="${NEW_VERSION:?Set NEW_VERSION in the environment (semver)}"
BASE_SHA="${1:?base sha required}"
PREV_TAG="${2:-}"

REPO_URL="${GITHUB_SERVER_URL:-https://github.com}/${GITHUB_REPOSITORY:-owner/repo}"
RUN_URL="${GITHUB_SERVER_URL:-https://github.com}/${GITHUB_REPOSITORY:-owner/repo}/actions/runs/${GITHUB_RUN_ID:-0}"

echo "## Crowkis UI — automated release"
echo ""
echo "| Field | Value |"
echo "|-------|-------|"
echo "| **Version (after bump)** | \`$NEW_VERSION\` |"
echo "| **Base commit** | [\`${BASE_SHA:0:7}\`](${REPO_URL}/commit/${BASE_SHA}) |"
echo "| **Workflow run** | [View run](${RUN_URL}) |"
echo "| **Triggered by** | \`${GITHUB_ACTOR:-unknown}\` |"
echo "| **Ref** | \`${GITHUB_REF:-unknown}\` |"
echo ""

if [[ -n "$PREV_TAG" ]] && git rev-parse "$PREV_TAG" >/dev/null 2>&1; then
  RANGE="${PREV_TAG}..${BASE_SHA}"
  echo "### Compare range"
  echo ""
  echo "[\`${PREV_TAG}\` → \`${BASE_SHA:0:7}\`](${REPO_URL}/compare/${PREV_TAG}...${BASE_SHA})"
  echo ""
else
  RANGE=""
  echo "_No previous \`v*\` tag found — listing recent commits on this branch._"
  echo ""
fi

echo "## Commit log"
echo ""

if [[ -n "$RANGE" ]]; then
  if git rev-list --count "$RANGE" 2>/dev/null | grep -q '^0$'; then
    echo "_No new commits in range \`${RANGE}\` (tag may already point at base)._"
  else
    echo "| SHA | Date (UTC) | Author | Subject |"
    echo "|-----|------------|--------|---------|"
    git log "$RANGE" --no-merges --pretty=format:'|%h|%ad|%an|%s|' --date=format:'%Y-%m-%d %H:%M' | while IFS='|' read -r _ h d a s _; do
      [[ -z "$h" ]] && continue
      echo "| [\`$h\`](${REPO_URL}/commit/$h) | $d | $a | ${s//|/·} |"
    done
  fi
else
  echo "| SHA | Date (UTC) | Author | Subject |"
  echo "|-----|------------|--------|---------|"
  git log -40 "$BASE_SHA" --no-merges --pretty=format:'|%h|%ad|%an|%s|' --date=format:'%Y-%m-%d %H:%M' | while IFS='|' read -r _ h d a s _; do
    [[ -z "$h" ]] && continue
    echo "| [\`$h\`](${REPO_URL}/commit/$h) | $d | $a | ${s//|/·} |"
  done
fi

echo ""
echo "## Conventional commit breakdown"
echo ""

if [[ -n "$RANGE" ]] && git rev-list -1 "$RANGE" >/dev/null 2>&1; then
  mapfile -t COMMITS < <(git log "$RANGE" --no-merges --pretty='%s' 2>/dev/null || true)
else
  mapfile -t COMMITS < <(git log -40 "$BASE_SHA" --no-merges --pretty='%s' 2>/dev/null || true)
fi

feat=(); fix=(); docs=(); chore=(); ci=(); test=(); refactor=(); perf=(); build=(); other=()
if ((${#COMMITS[@]})); then
  for line in "${COMMITS[@]}"; do
    [[ -z "$line" ]] && continue
    if grep -qE '^feat(\([^)]+\))?:' <<<"$line"; then feat+=("- $line")
    elif grep -qE '^fix(\([^)]+\))?:' <<<"$line"; then fix+=("- $line")
    elif grep -qE '^docs(\([^)]+\))?:' <<<"$line"; then docs+=("- $line")
    elif grep -qE '^chore(\([^)]+\))?:' <<<"$line"; then chore+=("- $line")
    elif grep -qE '^ci(\([^)]+\))?:' <<<"$line"; then ci+=("- $line")
    elif grep -qE '^test(\([^)]+\))?:' <<<"$line"; then test+=("- $line")
    elif grep -qE '^refactor(\([^)]+\))?:' <<<"$line"; then refactor+=("- $line")
    elif grep -qE '^perf(\([^)]+\))?:' <<<"$line"; then perf+=("- $line")
    elif grep -qE '^build(\([^)]+\))?:' <<<"$line"; then build+=("- $line")
    else other+=("- $line")
    fi
  done
fi

emit_section() {
  local title="$1"
  shift
  local -n arr="$1"
  ((${#arr[@]})) || return 0
  echo "### $title"
  echo ""
  printf '%s\n' "${arr[@]}"
  echo ""
}

emit_section "Features" feat
emit_section "Fixes" fix
emit_section "Documentation" docs
emit_section "Chores" chore
emit_section "CI" ci
emit_section "Tests" test
emit_section "Refactors" refactor
emit_section "Performance" perf
emit_section "Build" build
emit_section "Other / non-conventional" other

echo "## Changed files (stat)"
echo ""

if [[ -n "$RANGE" ]] && git diff --stat "$RANGE" 2>/dev/null | tail -n +1 | grep -q .; then
  echo '```'
  git diff --stat "$RANGE" | tail -n 200
  echo '```'
else
  echo "_No diff stat available for range._"
fi

echo ""
echo "---"
echo ""
echo "_This release was created automatically on push to \`main\`._"
