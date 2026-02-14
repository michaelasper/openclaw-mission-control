#!/bin/sh
set -eu

SOCKET="/tmp/tailscaled.sock"
STATE_DIR="${TS_STATE_DIR:-/var/lib/tailscale}"
STATE_FILE="${STATE_DIR}/tailscaled.state"
TARGET="${TS_SERVE_TARGET:-http://app:8080}"
SERVE_PORT="${TS_SERVE_PORT:-80}"
HTTPS_PORT="${TS_SERVE_HTTPS_PORT:-443}"
HOSTNAME="${TS_HOSTNAME:-mission-control}"
AUTHKEY="${TS_AUTHKEY:-}"

mkdir -p "${STATE_DIR}"

if [ -z "${AUTHKEY}" ] && [ ! -f "${STATE_FILE}" ]; then
  echo "TS_AUTHKEY is required on first run."
  exit 1
fi

tailscaled --state="${STATE_FILE}" --socket="${SOCKET}" --tun=userspace-networking &
TS_PID="$!"

cleanup() {
  kill "${TS_PID}" >/dev/null 2>&1 || true
}
trap cleanup INT TERM

for _ in $(seq 1 30); do
  if [ -S "${SOCKET}" ]; then
    break
  fi
  sleep 1
done

if [ ! -S "${SOCKET}" ]; then
  echo "tailscaled did not start in time."
  exit 1
fi

if [ -n "${AUTHKEY}" ]; then
  tailscale --socket="${SOCKET}" up --hostname="${HOSTNAME}" --authkey="${AUTHKEY}"
else
  tailscale --socket="${SOCKET}" up --hostname="${HOSTNAME}"
fi

tailscale --socket="${SOCKET}" serve --bg --http="${SERVE_PORT}" "${TARGET}"
tailscale --socket="${SOCKET}" serve --bg --https="${HTTPS_PORT}" "${TARGET}"

echo "Tailscale Serve forwarding tailnet :${SERVE_PORT} and :${HTTPS_PORT} -> ${TARGET}"
tailscale --socket="${SOCKET}" serve status || true

wait "${TS_PID}"
