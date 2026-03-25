<!-- managed-by: activ8-ai-context-pack | pack-version: 1.2.0 -->
<!-- source-sha: a0d4785 -->
# Agentic Governance Five-Plane Contract

Agentic AI governance is a multi-plane control problem, not a prompt-only problem.

## Five Planes

- Control plane: policy, authority, thresholds, approvals, escalation, accountability.
- Execution plane: agent orchestration, tool permissions, workflow routing, action constraints.
- Data plane: telemetry, evidence, provenance, evaluations, incident records.
- Learning plane: memory, extraction, codification, retrieval, reuse, adaptation.
- Safety plane: guardrails, misuse prevention, drift detection, kill switches, security controls.

## Required Operating Loops

- OODA loop for live operations: observe, orient, decide, act.
- PDCA loop for governed change: plan, do, check, act.
- Policy-learning loop for adaptation: state, action, outcome, update.

## Required Learning System Behavior

- Learn from real runs, not only from static prompt edits.
- Retain knowledge in governed, queryable surfaces.
- Convert observations into structured knowledge, not disposable context.
- Iterate policies, prompts, and runbooks from evidence.
- Adapt behavior only through provenance-backed evaluation and governed thresholds.
- Auto-update retained system state, indexes, or codex-linked surfaces when the stack changes materially.

## Enforcement Rules

- No execution without control-plane authority.
- No learning without provenance, validation, and rollback capability.
- No adaptation without evaluation, drift detection, and threshold-aware escalation.
- No memory write without structure, indexing, and future reuse.
- No high-impact deployment when safeguards are below the required threshold.

## Minimum Governance Requirements

- Capability thresholds must trigger deeper assessment and mitigation review.
- Content provenance and evidence logs are mandatory for meaningful decisions.
- Persistent knowledge must be stored, indexed, queried, and retired under policy.
- Drift detection must monitor inputs, policy, and capability changes.
- Every plane must feed the others through explicit feedback loops, not informal habit.

## Repo Operationalization Requirement

- Each managed repo must maintain a local governance codex or equivalent register that binds these five planes to concrete files, handlers, schemas, and enforcement rules.
- The default managed surface for that binding is `artifacts/codex/meta-mega/MAOS-Governance-Codex-v1.md`.
- System-wide operationalization is incomplete when the five-plane contract exists only as prompt guidance without a repo-local implementation map.
