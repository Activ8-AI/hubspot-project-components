<!-- managed-by: activ8-ai-context-pack | pack-version: 1.2.1 -->
<!-- source-sha: a0d4785 -->
# MAOS Enforcement Rule Test Suite v1

**Status:** ACTIVE  
**Updated:** 2026-03-24

## Rule Coverage

| Rule | Adversarial Test | Primary Evidence |
|---|---|---|
| Capability Gating | Threshold breach forces T2 blocker in heartbeat | `test/prime-bridge/telemetry.test.ts` |
| Provenance Mandate | Invalid memory write emits structured rejection record | `test/maos/learning_memory.test.ts` |
| Memory Write Authorization | Unapproved active skill publication is rejected | `test/maos/learning_memory.test.ts` |
| Skill Publication | Non-approved skills are non-retrievable | `test/maos/learning_memory.test.ts` |
| Incident Disclosure | Threshold gate present in deploy preflight | `cloudbuild.mcp.yaml`, `scripts/check-governance-threshold-instrumentation.mjs` |
| Dual-Agent Verification | Existing D-01 controls remain required for high-impact outputs | existing D-01 doctrine + runtime gates |
| Drift Alert Response | Threshold evaluator surfaces correction-loop and structural drift | `test/prime-bridge/telemetry.test.ts` |
