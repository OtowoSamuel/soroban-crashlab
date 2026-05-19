#!/usr/bin/env bash
# Bulk-create roadmap issues from scripts/roadmap/issues.json
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
CATALOG="${ROOT}/scripts/roadmap/issues.json"
REPO="${GITHUB_REPOSITORY:-SorobanCrashLab/soroban-crashlab}"

if [[ -z "${GH_TOKEN:-}" ]]; then
  echo "Export GH_TOKEN (repo scope) before running." >&2
  exit 1
fi

if [[ ! -f "$CATALOG" ]]; then
  python3 "${ROOT}/scripts/roadmap/generate_catalog.py"
fi

echo "Creating milestones..."
for title in "P0 Foundation" "P1 Data bridge" "P2 Product UI" "P3 Integrations" "P4 Hardening" "P5 Documentation"; do
  if ! gh api "repos/${REPO}/milestones" --jq ".[].title" | grep -Fxq "$title"; then
    gh api "repos/${REPO}/milestones" -f title="$title" -f state=open >/dev/null
  fi
done

count=$(jq '.count' "$CATALOG")
echo "Creating ${count} issues on ${REPO}..."

created=0
index=0
while read -r row; do
  index=$((index + 1))
  title=$(jq -r '.title' <<<"$row")
  body=$(jq -r '.body' <<<"$row")
  milestone=$(jq -r '.milestone' <<<"$row")
  roadmap_id=$(jq -r '.roadmap_id' <<<"$row")

  label_args=()
  while IFS= read -r label; do
    [[ -n "$label" ]] && label_args+=(--label "$label")
  done < <(jq -r '.labels[]' <<<"$row")

  if gh issue list --repo "$REPO" --search "ROADMAP-$(printf '%03d' "$roadmap_id") in:body" --limit 1 --json number --jq '.[0].number' 2>/dev/null | grep -q .; then
    echo "[$index/$count] skip ROADMAP-$(printf '%03d' "$roadmap_id") (exists)"
    continue
  fi

  if ! issue_url=$(gh issue create \
    --repo "$REPO" \
    --title "$title" \
    --body "$body" \
    "${label_args[@]}" \
    --milestone "$milestone"); then
    echo "Failed: $title" >&2
    exit 1
  fi

  created=$((created + 1))
  echo "[$index/$count] $title -> $issue_url"
  sleep 0.35
done < <(jq -c '.issues[]' "$CATALOG")

echo "Done. Created ${created} issues."
