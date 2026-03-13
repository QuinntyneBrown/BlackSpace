#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PID_DIR="$REPO_ROOT/.dev"
LOG_DIR="$PID_DIR/logs"
METRICS_FILE="$PID_DIR/metrics.log"
source "$REPO_ROOT/eng/scripts/lib/dev-tools.sh"

mkdir -p "$PID_DIR" "$LOG_DIR"

DOCKER_BIN="$(require_resolved_command "Docker CLI" resolve_docker_bin)"
DOTNET_BIN="$(require_resolved_command ".NET CLI" resolve_dotnet_bin)"
NPX_BIN="$(require_resolved_command "npx" resolve_npx_bin)"
HTTP_PROBE_BIN="$(require_resolved_command "HTTP probe client" resolve_http_probe_bin)"
COMPOSE_FILE="$(docker_compose_file_path "$REPO_ROOT/docker-compose.yml")"

# ── Helpers ──────────────────────────────────────────────────────────────────
now_ms() { date +%s%3N 2>/dev/null || echo $(( $(date +%s) * 1000 )); }
elapsed() { echo $(( $(now_ms) - $1 )); }

log_metric() {
  local label="$1" ms="$2"
  printf "%-30s %6s ms\n" "$label" "$ms" | tee -a "$METRICS_FILE"
}

cleanup_on_error() {
  echo ""
  echo "ERROR: Startup failed. Cleaning up..."
  "$REPO_ROOT/eng/scripts/dev-stop.sh" 2>/dev/null || true
  exit 1
}
trap cleanup_on_error ERR

# ── Guard: already running? ──────────────────────────────────────────────────
if [ -f "$PID_DIR/backend.pid" ] || [ -f "$PID_DIR/frontend.pid" ]; then
  echo "Dev environment appears to be running already."
  echo "Run 'eng/scripts/dev-stop.sh' first, or delete .dev/*.pid to force."
  exit 1
fi

TOTAL_START=$(now_ms)
echo "============================================"
echo " BlackSpace — Starting Dev Environment"
echo " $(date '+%Y-%m-%d %H:%M:%S')"
echo "============================================"
echo "" >> "$METRICS_FILE"
echo "── START $(date '+%Y-%m-%d %H:%M:%S') ──" >> "$METRICS_FILE"

# ── 1. Database (Docker) ────────────────────────────────────────────────────
echo ""
echo "[1/3] Starting PostgreSQL..."
STEP_START=$(now_ms)

ensure_docker_ready
docker_compose -f "$COMPOSE_FILE" up -d --wait

log_metric "PostgreSQL (docker)" "$(elapsed $STEP_START)"

# ── 2. Backend (.NET API) ───────────────────────────────────────────────────
echo ""
echo "[2/3] Starting .NET API (http://localhost:5000)..."
STEP_START=$(now_ms)

cd "$REPO_ROOT/src/BlackSpace.Api"
"$DOTNET_BIN" run --urls "http://localhost:5000" > "$LOG_DIR/backend.log" 2>&1 &
BACKEND_PID=$!
echo "$BACKEND_PID" > "$PID_DIR/backend.pid"

# Wait for the API to respond
RETRIES=0
until probe_http_ready "http://localhost:5000/api/health"; do
  RETRIES=$((RETRIES + 1))
  if [ $RETRIES -ge 60 ]; then
    echo "  Backend failed to start within 60s. Check $LOG_DIR/backend.log"
    cleanup_on_error
  fi
  sleep 1
done

log_metric ".NET API" "$(elapsed $STEP_START)"

# ── 3. Frontend (Angular) ──────────────────────────────────────────────────
echo ""
echo "[3/3] Starting Angular (http://localhost:4200)..."
STEP_START=$(now_ms)

cd "$REPO_ROOT/src/BlackSpace.Web"
"$NPX_BIN" ng serve blackspace --port 4200 > "$LOG_DIR/frontend.log" 2>&1 &
FRONTEND_PID=$!
echo "$FRONTEND_PID" > "$PID_DIR/frontend.pid"

# Wait for Angular dev server to respond
RETRIES=0
until probe_http_ready "http://localhost:4200"; do
  RETRIES=$((RETRIES + 1))
  if [ $RETRIES -ge 120 ]; then
    echo "  Frontend failed to start within 120s. Check $LOG_DIR/frontend.log"
    cleanup_on_error
  fi
  sleep 1
done

log_metric "Angular SPA" "$(elapsed $STEP_START)"

# ── Summary ─────────────────────────────────────────────────────────────────
TOTAL_MS=$(elapsed $TOTAL_START)
echo ""
echo "============================================"
log_metric "TOTAL STARTUP" "$TOTAL_MS"
echo "============================================"
echo ""
echo "  API:      http://localhost:5000"
echo "  Swagger:  http://localhost:5000/swagger"
echo "  Frontend: http://localhost:4200"
echo "  Database: localhost:5432 (blackspace/blackspace_dev)"
echo ""
echo "  Logs:     $LOG_DIR/"
echo "  Stop:     eng/scripts/dev-stop.sh"
echo ""
