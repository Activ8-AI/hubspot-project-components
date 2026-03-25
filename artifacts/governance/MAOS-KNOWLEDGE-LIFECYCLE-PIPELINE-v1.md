<!-- managed-by: activ8-ai-context-pack | pack-version: 1.2.1 -->
<!-- source-sha: a0d4785 -->
# MAOS Knowledge Lifecycle Pipeline v1

**Status:** ACTIVE  
**Updated:** 2026-03-24

## Governed Architecture Choice

- Semantic memory: retrieval-oriented factual knowledge with provenance-first records and auditable sources.
- Episodic memory: session and signal traces used for reflection and operational feedback.
- Procedural memory: governed skill library with quarantine, approval, and lifecycle state.
- Normative memory: doctrine and codex surfaces reserved for governed human-approved updates.

## Lifecycle

1. Capture: receive signal, session trace, skill proposal, or codex change candidate.
2. Normalize: convert input into typed structure with canonical fields.
3. Classify: route to episodic, semantic, procedural, or normative memory.
4. Validate: enforce provenance, approval, and schema checks.
5. Store: persist only after validation passes.
6. Index: expose bounded retrieval metadata.
7. Retrieve: return only governed, policy-allowed memory.
8. Apply: use retrieved memory in an execution path with authority binding.
9. Evaluate: measure outcome quality, overrides, and drift.
10. Retire: deprecate stale skills and invalidate superseded knowledge.

## Governance Hooks

| Stage | Hook |
|---|---|
| Capture | Session bootstrap, identity envelope, request ID |
| Normalize | Memory schema + provenance field registry |
| Classify | Memory-type authorization |
| Validate | SHACL/JSON-schema checks, approval requirements |
| Store | Audit log + rejection log |
| Index | Review state and status filters |
| Retrieve | Active-only procedural retrieval |
| Apply | Capability gating and dual-agent verification where required |
| Evaluate | Threshold telemetry and drift measurement |
| Retire | Deprecation state, quarterly codex review |

## Retention Schedule

| Memory Type | Default Retention | Notes |
|---|---|---|
| Episodic | 90 days | Summarize or archive after evaluation |
| Semantic | 180 days | Refresh if source provenance changes |
| Procedural | Until superseded | Quarantine until approved; deprecate when replaced |
| Normative | Permanent | Human-governed constitutional record |
