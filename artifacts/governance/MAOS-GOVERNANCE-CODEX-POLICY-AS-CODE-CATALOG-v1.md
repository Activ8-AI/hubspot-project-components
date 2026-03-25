<!-- managed-by: activ8-ai-context-pack | pack-version: 1.2.0 -->
<!-- source-sha: a0d4785 -->
<!-- gov-lint-ignore -->
# MAOS Governance Codex - Policy-as-Code Catalog

**Version:** `1.0`  
**Status:** ACTIVE  
**Related White Paper:** `docs/MAOS-GOVERNANCE-CODEX-WHITE-PAPER-v1.md`  
**Purpose:** Convert the MAOS governance white paper into reusable enforcement rules that can be implemented, tested, and audited.

---

## Rule 001 - Capability Gating

**Trigger:** Any agent task exceeding configured autonomy thresholds such as planning horizon, chained tool-call count, runtime duration, or Tier-3 tool proximity.

**Enforcement:**

- Insert a mandatory hold point in the orchestrator.
- Pause execution and log the full trace context.
- Notify the Governance Owner for T1 and escalate to Final Arbiter for T2+.
- Resume only with explicit authorization.

**Bypass:** None.

**Verification:** Sentinel tasks that deliberately exceed the configured threshold must halt within one execution cycle.

---

## Rule 002 - Provenance Mandate

**Trigger:** Any memory, evidence, evaluation, or durable state write.

**Enforcement:**

- Validate required provenance fields at write time.
- Reject writes missing source, timestamp, writing agent, confidence, or validation metadata.
- Emit a structured validation failure record rather than silently admitting the entry.

**Bypass:** None.

**Verification:** Deliberately malformed writes must fail validation and appear in the rejection log.

---

## Rule 003 - Memory Write Authorization

**Trigger:** Any write to semantic, procedural, or normative memory.

**Enforcement:**

- Allow automatic writes only for episodic memory.
- Require validation-pipeline approval for semantic memory.
- Require review and lifecycle state for procedural memory.
- Reject all agent-initiated normative-memory writes.

**Bypass:** Emergency-only for semantic or procedural writes with post-hoc review. No bypass for normative memory.

**Verification:** Unauthorized writes must be rejected with machine-readable reason codes.

---

## Rule 004 - Skill Publication

**Trigger:** Any proposal to add a new skill or reusable procedure to the governed skill library.

**Enforcement:**

- Place the skill into quarantine on submission.
- Require security and governance review before activation.
- Publish only after approval and version assignment.
- Preserve quarantine and review metadata as provenance.

**Bypass:** None in production.

**Verification:** Newly registered skills must remain non-retrievable until their review state is PASS.

---

## Rule 005 - Incident Disclosure

**Trigger:** Any P1 or P2 incident or equivalent governed incident classification.

**Enforcement:**

- Generate a structured incident report from telemetry and evidence.
- Route the report to the correct authority within the escalation SLA.
- Update the Risk Register with the realized event and mitigation outcome.
- Produce the required disclosure summary once resolution conditions are met.

**Bypass:** None.

**Verification:** Simulated incidents must produce report records, escalation receipts, and risk-register deltas.

---

## Rule 006 - Dual-Agent Verification

**Trigger:** Any Charter-grade output, Tier-3 tool invocation, or governance decision requiring D-01 verification.

**Enforcement:**

- Require a second agent or human verifier distinct from the proposing actor.
- Record the verification outcome together with the original action or artifact.
- Reject unverified Charter-grade outputs as invalid.

**Bypass:** Human override only, with explicit logged rationale.

**Verification:** Irreversible actions must fail closed when the verifier identity is missing or matches the proposing identity.

---

## Rule 007 - Drift Alert Response

**Trigger:** Any ADWIN or equivalent drift alert across task quality, tool-output behavior, or memory-access patterns.

**Enforcement:**

- Classify the alert as input, policy, capability, or memory drift.
- Trigger a sentinel evaluation automatically.
- Open an incident when drift is confirmed.
- Escalate when secondary thresholds are crossed.

**Bypass:** None.

**Verification:** Injected drift in monitored streams must create alert, evaluation, and escalation records.

---

## Implementation Posture

Every rule in this catalog is expected to be:

1. machine-checkable,
2. test-backed,
3. evidence-emitting,
4. and linked to a named authority owner.

If a rule exists only as prose and not as a testable control, treat it as incomplete.

---

© 2026 Activ8 Automation Intelligence, LLC · All Rights Reserved · Build Document - Confidential & Internal
