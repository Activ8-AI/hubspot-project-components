<!-- managed-by: activ8-ai-context-pack | pack-version: 1.2.0 -->
<!-- source-sha: a0d4785 -->
# MAOS Governance Codex v1

**Audience:** Agent (primary), Human (secondary), Machine (secondary)  
**Surface Type:** Register  
**Purpose:** Bind the MAOS five-plane governance model to this repo's concrete files, handlers, schemas, and enforcement rules so governance is operationalized in implementation, not only in prompt guidance.  
**Canonical Source:** `docs/SOURCES-OF-TRUTH.md`; `docs/AUDIENCE-SURFACE-CONTRACT.md`; local governance and runtime surfaces  
**Genesis:** Derived from the managed Agentic Governance Five-Plane Contract plus this repo's local governance/runtime stack.  
**Trace Origin:** Managed context-pack operationalization for `hubspot-project-components`.  
**Status:** ACTIVE  
**Update Mode:** Manual  
**Related Indexes / Registers:** `docs/SOURCES-OF-TRUTH.md`; local routing/index surfaces

---

## Why This Exists

The Agentic Governance Five-Plane Contract defines the principle. This codex is the repo-local implementation map.

Each managed repo must bind the following planes to actual local surfaces:

1. Control Plane
2. Execution Plane
3. Data Plane
4. Learning Plane
5. Safety / Guardrails Plane

Without that local binding, the five-plane contract remains abstract and cannot be audited cleanly.

---

## Plane Summary

|Plane|Local role|Primary repo surfaces|Primary enforcement posture|
|---|---|---|---|
|Control Plane|Decide authority, escalation, routing, approvals|Fill with local doctrine + routing files|Authority-first|
|Execution Plane|Run governed agent / tool / workflow activity|Fill with local runtime / dispatch files|Identity-bound|
|Data Plane|Record telemetry, evidence, provenance, evaluations|Fill with local evidence / logging / telemetry files|Evidence-first|
|Learning Plane|Retain, route, grade, and reuse learning|Fill with local memory / closeout / signal files|Provenance + feedback|
|Safety / Guardrails Plane|Block unsafe, drifted, or unauthorized execution|Fill with local gate / security / risk controls|Fail-closed|

---

## Required Local Bindings

For each plane, bind all four categories:

1. Concrete files or modules
2. Primary handlers / runtime entrypoints
3. Schemas / contracts / typed interfaces
4. Enforcement rules / gates / approval logic

Use repo-native paths, not central examples, when local implementation differs.

---

## Learning, Retention, And Adaptation Requirements

This codex must show where the repo:

- learns from execution,
- retains knowledge beyond the active session,
- structures knowledge for later retrieval,
- iterates policies or runbooks from evidence,
- adapts under governed thresholds,
- and auto-updates local state or routing surfaces when material drift is detected.

At minimum, the codex must name the local files, handlers, schemas, and enforcement rules for those loops.

---

## Minimum Plane Record

For every plane, document:

- Function
- Primary repo surfaces
- Primary handlers
- Primary schemas / contracts
- Primary enforcement rules
- Current gaps, if any
- Update / iteration loop
- Auto-update or sync surfaces, if any

---

## Update Protocol

Update this codex when any of the following change materially:

- Authority or governance routing
- Agent / tool execution topology
- Evidence / telemetry contracts
- Learning / retention contracts
- Safety gates, thresholds, or drift controls

When this file changes, also update the repo's local routing/index surfaces so the codex is discoverable through normal seek-first navigation.

---
