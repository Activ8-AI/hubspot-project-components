# One Heartbeat Monitoring Setup

## Prometheus Integration

The heartbeat system generates Prometheus metrics at `./build/metrics/macse.prom` with the following gauges:

- `hb_charter_integrity_status` (1=GREEN, 0.5=YELLOW, 0=RED)
- `hb_execution_multi_agent_status` (1=GREEN, 0.5=YELLOW, 0=RED)
- `hb_reports_aggregate_status` (1=GREEN, 0.5=YELLOW, 0=RED)
- `hb_reflexive_equilibrium_status` (1=GREEN, 0.5=YELLOW, 0=RED)
- `hb_system_agent_registry_status` (1=GREEN, 0.5=YELLOW, 0=RED)
- `hb_vault_seals_integrity` (1=verified, 0=degraded)
- `hb_codex_sync_state` (1=synchronized, 0=syncing/other)

## Quick Start

1. **Start Prometheus** (if you have it installed):
```bash
prometheus --config.file=monitoring/prometheus.yml
```

2. **View metrics**:
```bash
curl http://localhost:9090/metrics
```

3. **Test alerts**:
```bash
# Simulate a failure by removing a status file
rm build/execution_status.json
make heartbeat_sync
```

## Alert Rules

The `alert_rules.yml` file contains rules for:
- Charter integrity failures (critical)
- System component degradation (warning)
- Vault seals issues (warning)
- Codex sync stalls (warning)

## Customization

Modify the probe commands in `system/orchestration/heartbeat_sync.sh` to check your actual system health indicators.
