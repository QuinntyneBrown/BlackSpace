#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

echo "This will stop everything and DELETE all local database data."
read -rp "Continue? [y/N] " confirm
if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
  echo "Cancelled."
  exit 0
fi

"$REPO_ROOT/eng/scripts/dev-stop.sh"

echo ""
echo "Removing Docker volume..."
docker compose -f "$REPO_ROOT/docker-compose.yml" down -v

echo ""
echo "Cleaning up .dev directory..."
rm -rf "$REPO_ROOT/.dev"

echo ""
echo "Reset complete. Run 'eng/scripts/dev-start.sh' to start fresh."
