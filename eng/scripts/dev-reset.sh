#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
source "$REPO_ROOT/eng/scripts/lib/dev-tools.sh"

DOCKER_BIN="$(require_resolved_command "Docker CLI" resolve_docker_bin)"
COMPOSE_FILE="$(docker_compose_file_path "$REPO_ROOT/docker-compose.yml")"

echo "This will stop everything and DELETE all local database data."
read -rp "Continue? [y/N] " confirm
if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
  echo "Cancelled."
  exit 0
fi

"$REPO_ROOT/eng/scripts/dev-stop.sh"

echo ""
echo "Removing Docker volume..."
ensure_docker_ready
docker_compose -f "$COMPOSE_FILE" down -v

echo ""
echo "Cleaning up .dev directory..."
rm -rf "$REPO_ROOT/.dev"

echo ""
echo "Reset complete. Run 'eng/scripts/dev-start.sh' to start fresh."
