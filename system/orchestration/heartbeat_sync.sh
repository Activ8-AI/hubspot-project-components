#!/usr/bin/env bash

# One Heartbeat – Charter Pack (v1)
# Emits unified heartbeat JSON, Prometheus metrics, and Vault seals.
# Charter: A09 (Doctrine Integrity), A13 (Reflexive Equilibrium)

set -euo pipefail

# ---- Config (override via env) ----
: "${OUTPUT_JSON:=./build/heartbeats/one_heartbeat.json}"
: "${SEALS_DIR:=./build/heartbeats}"
: "${METRICS_PATH:=./build/metrics/macse.prom}"
: "${TZ_REGION:=America/Chicago}"   # CT per Charter
: "${TIMEOUT:=15}"                   # seconds per probe

# Optional command adapters (override to integrate with your runtime)
: "${CMD_CHARTER_INTEGRITY:=make charter-verify >/dev/null && echo GREEN || echo RED}"
: "${CMD_EXECUTION_STATUS:=test -f ./build/execution_status.json && (grep -q 'status.*healthy' ./build/execution_status.json && echo GREEN || echo YELLOW) || echo YELLOW}"
: "${CMD_REPORTS_AGG_STATUS:=test -f ./build/reports_aggregate.json && (grep -q 'status.*complete' ./build/reports_aggregate.json && echo GREEN || echo YELLOW) || echo YELLOW}"
: "${CMD_REFLEXIVE_EQ_STATUS:=test -f ./build/reflexive_equilibrium.json && (grep -q 'equilibrium.*true' ./build/reflexive_equilibrium.json && echo GREEN || echo YELLOW) || echo YELLOW}"
: "${CMD_AGENT_REGISTRY_STATUS:=test -f ./build/agent_registry.json && (grep -q 'agents_active.*[1-9]' ./build/agent_registry.json && echo GREEN || echo YELLOW) || echo YELLOW}"
: "${CMD_VAULT_INTEGRITY:=test -f ./build/seals/charter/last_integrity.sha256 && echo verified || echo degraded}"
: "${CMD_CODEX_SYNC:=test -f ./build/codex_sync.json && (grep -q 'sync_status.*synchronized' ./build/codex_sync.json && echo synchronized || echo syncing) || echo syncing}"

# ---- Helpers ----
status_to_gauge() {
  # Map GREEN/YELLOW/RED -> 1/0.5/0 ; anything else -> 0
  case "$(printf '%s' "$1" | tr '[:lower:]' '[:upper:]')" in
    GREEN) printf '1\n' ;;
    YELLOW) printf '0.5\n' ;;
    *) printf '0\n' ;;
  esac
}

run_with_timeout() {
  local seconds="$1"
  shift

  if command -v timeout >/dev/null 2>&1; then
    timeout "${seconds}" "$@"
    return $?
  fi

  if command -v gtimeout >/dev/null 2>&1; then
    gtimeout "${seconds}" "$@"
    return $?
  fi

  if command -v python3 >/dev/null 2>&1; then
    python3 - "$seconds" "$@" <<'PY'
import subprocess
import sys

timeout_seconds = float(sys.argv[1])
command = sys.argv[2:]

try:
    proc = subprocess.Popen(command)
    try:
        proc.wait(timeout=timeout_seconds)
    except subprocess.TimeoutExpired:
        proc.kill()
        proc.wait()
        sys.exit(124)
    sys.exit(proc.returncode)
except FileNotFoundError:
    sys.exit(127)
PY
    return $?
  fi

  "$@"
  return $?
}

probe() {
  local cmd="$1"
  local output

  if output=$(run_with_timeout "${TIMEOUT}" bash -c "$cmd" 2>/dev/null); then
    if [ -n "${output}" ]; then
      printf '%s\n' "${output}"
    else
      printf 'YELLOW\n'
    fi
  else
    printf 'YELLOW\n'
  fi
}

stamp_ct() {
  TZ="${TZ_REGION}" date +"%Y-%m-%dT%H:%M:%S%z"
}

hash_file() {
  local file="$1"
  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum "${file}"
  else
    shasum -a 256 "${file}"
  fi
}

mkdir -p "$(dirname "${OUTPUT_JSON}")" "${SEALS_DIR}" "$(dirname "${METRICS_PATH}")"

# ---- Probes ----
HB_CHARTER=$(probe "${CMD_CHARTER_INTEGRITY}")
HB_EXEC=$(probe "${CMD_EXECUTION_STATUS}")
HB_REPORTS=$(probe "${CMD_REPORTS_AGG_STATUS}")
HB_REFLEX=$(probe "${CMD_REFLEXIVE_EQ_STATUS}")
HB_REGISTRY=$(probe "${CMD_AGENT_REGISTRY_STATUS}")
HB_VAULT=$(probe "${CMD_VAULT_INTEGRITY}")
HB_CODEX=$(probe "${CMD_CODEX_SYNC}")

TS=$(stamp_ct)

# ---- Compose JSON ----
cat >"${OUTPUT_JSON}" <<JSON
{
  "timestamp_CT": "${TS}",
  "hb.charter.integrity.status": "${HB_CHARTER}",
  "hb.execution.multi_agent.status": "${HB_EXEC}",
  "hb.reports.aggregate.status": "${HB_REPORTS}",
  "hb.reflexive.equilibrium.status": "${HB_REFLEX}",
  "hb.system.agent_registry.status": "${HB_REGISTRY}",
  "hb.vault.seals.integrity": "${HB_VAULT}",
  "hb.codex.sync.state": "${HB_CODEX}"
}
JSON

# ---- Seal (chainlock) ----
SEAL_FILE="${SEALS_DIR}/one_heartbeat_$(TZ="${TZ_REGION}" date +%Y%m%dT%H%M%S).sha256"
hash_file "${OUTPUT_JSON}" > "${SEAL_FILE}"

# ---- Prometheus metrics ----
# Gauges reflecting GREEN/YELLOW/RED mapping to 1/0.5/0
{
  echo "# HELP hb_charter_integrity_status Charter integrity status (1=GREEN,0.5=YELLOW,0=RED)"
  echo "# TYPE hb_charter_integrity_status gauge"
  echo "hb_charter_integrity_status $(status_to_gauge "${HB_CHARTER}")"

  echo "# HELP hb_execution_multi_agent_status Multi-agent execution status"
  echo "# TYPE hb_execution_multi_agent_status gauge"
  echo "hb_execution_multi_agent_status $(status_to_gauge "${HB_EXEC}")"

  echo "# HELP hb_reports_aggregate_status Aggregate reports status"
  echo "# TYPE hb_reports_aggregate_status gauge"
  echo "hb_reports_aggregate_status $(status_to_gauge "${HB_REPORTS}")"

  echo "# HELP hb_reflexive_equilibrium_status Reflexive equilibrium status"
  echo "# TYPE hb_reflexive_equilibrium_status gauge"
  echo "hb_reflexive_equilibrium_status $(status_to_gauge "${HB_REFLEX}")"

  echo "# HELP hb_system_agent_registry_status Agent registry status"
  echo "# TYPE hb_system_agent_registry_status gauge"
  echo "hb_system_agent_registry_status $(status_to_gauge "${HB_REGISTRY}")"

  echo "# HELP hb_vault_seals_integrity Vault seals integrity (1=verified,0=degraded)"
  echo "# TYPE hb_vault_seals_integrity gauge"
  if [ "${HB_VAULT}" = "verified" ]; then echo "hb_vault_seals_integrity 1"; else echo "hb_vault_seals_integrity 0"; fi

  echo "# HELP hb_codex_sync_state Codex sync (1=synchronized,0=syncing/other)"
  echo "# TYPE hb_codex_sync_state gauge"
  if [ "${HB_CODEX}" = "synchronized" ]; then echo "hb_codex_sync_state 1"; else echo "hb_codex_sync_state 0"; fi
} > "${METRICS_PATH}"

# ---- Console summary ----
printf "One Heartbeat @ %s\n" "$TS"
printf " charter: %s | exec: %s | reports: %s | reflex: %s | registry: %s | vault: %s | codex: %s\n" \
       "$HB_CHARTER" "$HB_EXEC" "$HB_REPORTS" "$HB_REFLEX" "$HB_REGISTRY" "$HB_VAULT" "$HB_CODEX"
printf " json: %s\n seal: %s\n metrics: %s\n" "${OUTPUT_JSON}" "${SEAL_FILE}" "${METRICS_PATH}"

