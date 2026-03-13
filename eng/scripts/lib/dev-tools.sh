#!/usr/bin/env bash

is_wsl() {
  [ -n "${WSL_DISTRO_NAME:-}" ]
}

has_command() {
  command -v "$1" >/dev/null 2>&1
}

resolve_first_command() {
  local candidate
  for candidate in "$@"; do
    if has_command "$candidate"; then
      command -v "$candidate"
      return 0
    fi
  done
  return 1
}

require_resolved_command() {
  local label="$1" resolver="$2"
  local resolved
  if ! resolved="$("$resolver")"; then
    echo "ERROR: $label is required but was not found on PATH." >&2
    return 1
  fi
  printf '%s\n' "$resolved"
}

resolve_docker_bin() {
  if is_wsl; then
    resolve_first_command docker.exe docker
    return
  fi

  resolve_first_command docker docker.exe
}

resolve_dotnet_bin() {
  if is_wsl; then
    resolve_first_command dotnet dotnet.exe
    return
  fi

  resolve_first_command dotnet dotnet.exe
}

resolve_npx_bin() {
  resolve_first_command npx
}

resolve_http_probe_bin() {
  if is_wsl; then
    resolve_first_command curl.exe curl
    return
  fi

  resolve_first_command curl curl.exe
}

native_path_for_command() {
  local path="$1" command_path="$2"
  if is_wsl && [[ "$command_path" == *.exe ]] && has_command wslpath; then
    wslpath -w "$path"
    return
  fi

  printf '%s\n' "$path"
}

docker_compose_file_path() {
  native_path_for_command "$1" "$DOCKER_BIN"
}

docker_desktop_path() {
  local candidate
  for candidate in \
    "/mnt/c/Program Files/Docker/Docker/Docker Desktop.exe" \
    "/c/Program Files/Docker/Docker/Docker Desktop.exe"
  do
    if [ -f "$candidate" ]; then
      printf '%s\n' "$candidate"
      return 0
    fi
  done

  return 1
}

start_docker_desktop() {
  local desktop_path windows_path

  if ! desktop_path="$(docker_desktop_path)"; then
    return 1
  fi

  if is_wsl && has_command wslpath; then
    windows_path="$(wslpath -w "$desktop_path")"
  else
    windows_path="$desktop_path"
  fi

  powershell.exe -NoProfile -Command "Start-Process -FilePath '$windows_path'" \
    >/dev/null 2>&1
}

docker_is_ready() {
  "$DOCKER_BIN" info >/dev/null 2>&1
}

ensure_docker_ready() {
  local retries=0

  if docker_is_ready; then
    return 0
  fi

  if is_wsl && start_docker_desktop; then
    echo "  Docker engine is not running. Starting Docker Desktop..."
    until docker_is_ready; do
      retries=$((retries + 1))
      if [ "$retries" -ge 90 ]; then
        echo "  Docker Desktop did not become ready within 180s." >&2
        return 1
      fi
      sleep 2
    done
    return 0
  fi

  echo "  Docker engine is not running. Start Docker Desktop or the Docker daemon and retry." >&2
  return 1
}

docker_compose() {
  "$DOCKER_BIN" compose "$@"
}

probe_http_ready() {
  local url="$1"
  "$HTTP_PROBE_BIN" -sf "$url" >/dev/null 2>&1
}
