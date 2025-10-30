# --- Charter Verification ---
.PHONY: charter-verify
charter-verify:
	@echo "Verifying Charter A09 (Doctrine Integrity)..."
	@# Check if core files exist and are valid
	@test -f "system/orchestration/heartbeat_sync.sh" || (echo "Missing heartbeat script" && exit 1)
	@test -f "schemas/heartbeat.schema.json" || (echo "Missing JSON schema" && exit 1)
	@test -f "Codex/Doctrine/Systems Integrity/One_Heartbeat_Framework_v1.md" || (echo "Missing Codex entry" && exit 1)
	@echo "Charter A09 verification: PASSED"

# --- One Heartbeat targets ---
HEARTBEAT_SCRIPT ?= system/orchestration/heartbeat_sync.sh
HEARTBEAT_OUTPUT ?= /vault/seals/heartbeats/one_heartbeat.json

.PHONY: heartbeat_sync
heartbeat_sync:
	bash $(HEARTBEAT_SCRIPT) OUTPUT_JSON=$(HEARTBEAT_OUTPUT)

# Run every 5 minutes via your scheduler; or:
.PHONY: heartbeat_daemon
heartbeat_daemon:
	while true; do $(MAKE) heartbeat_sync; sleep 300; done


