#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PID_DIR="$REPO_ROOT/.dev"
METRICS_FILE="$PID_DIR/metrics.log"
source "$REPO_ROOT/eng/scripts/lib/dev-tools.sh"

mkdir -p "$PID_DIR"

# ── Helpers ──────────────────────────────────────────────────────────────────
now_ms() { date +%s%3N 2>/dev/null || echo $(( $(date +%s) * 1000 )); }
elapsed() { echo $(( $(now_ms) - $1 )); }

log_metric() {
  local label="$1" ms="$2"
  printf "%-30s %6s ms\n" "$label" "$ms" | tee -a "$METRICS_FILE"
}

stop_pid() {
  local name="$1" pidfile="$PID_DIR/$2.pid"
  if [ -f "$pidfile" ]; then
    local pid
    pid=$(cat "$pidfile")
    if kill -0 "$pid" 2>/dev/null; then
      echo "  Stopping $name (PID $pid)..."
      kill "$pid" 2>/dev/null || true
      # Wait up to 10s for graceful shutdown
      local i=0
      while kill -0 "$pid" 2>/dev/null && [ $i -lt 10 ]; do
        sleep 1
        i=$((i + 1))
      done
      # Force kill if still alive
      if kill -0 "$pid" 2>/dev/null; then
        kill -9 "$pid" 2>/dev/null || true
      fi
    else
      echo "  $name (PID $pid) already stopped."
    fi
    rm -f "$pidfile"
  else
    echo "  $name — no PID file found, skipping."
  fi
}

TOTAL_START=$(now_ms)
echo "============================================"
echo " BlackSpace — Stopping Dev Environment"
echo " $(date '+%Y-%m-%d %H:%M:%S')"
echo "============================================"
echo "" >> "$METRICS_FILE"
echo "── STOP $(date '+%Y-%m-%d %H:%M:%S') ──" >> "$METRICS_FILE"

DOCKER_BIN="$(resolve_docker_bin || true)"
COMPOSE_FILE=""
if [ -n "${DOCKER_BIN:-}" ]; then
  COMPOSE_FILE="$(docker_compose_file_path "$REPO_ROOT/docker-compose.yml")"
fi

# ── 1. Frontend ─────────────────────────────────────────────────────────────
echo ""
echo "[1/3] Frontend..."
STEP_START=$(now_ms)
stop_pid "Angular" "frontend"
log_metric "Angular shutdown" "$(elapsed $STEP_START)"

# ── 2. Backend ──────────────────────────────────────────────────────────────
echo ""
echo "[2/3] Backend..."
STEP_START=$(now_ms)
stop_pid ".NET API" "backend"
log_metric ".NET API shutdown" "$(elapsed $STEP_START)"

# ── 3. Database ─────────────────────────────────────────────────────────────
echo ""
echo "[3/3] PostgreSQL..."
STEP_START=$(now_ms)
if [ -z "${DOCKER_BIN:-}" ]; then
  echo "  Docker CLI not found, skipping PostgreSQL shutdown."
elif docker_is_ready; then
  docker_compose -f "$COMPOSE_FILE" stop
else
  echo "  Docker engine unavailable, skipping PostgreSQL shutdown."
fi
log_metric "PostgreSQL shutdown" "$(elapsed $STEP_START)"

# ── Summary ─────────────────────────────────────────────────────────────────
TOTAL_MS=$(elapsed $TOTAL_START)
echo ""
echo "============================================"
log_metric "TOTAL SHUTDOWN" "$TOTAL_MS"
echo "============================================"
echo ""
echo "  Data is preserved in Docker volume 'blackspace-pgdata'."
echo "  Run 'docker compose down -v' to wipe the database."
echo ""
