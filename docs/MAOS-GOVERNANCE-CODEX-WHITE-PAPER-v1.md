<!-- managed-by: activ8-ai-context-pack | pack-version: 1.2.0 -->
<!-- source-sha: a0d4785 -->
<!-- gov-lint-ignore -->
# MAOS Governance Codex

## Agentic AI Governance, Persistence, and Continual Adaptation

**Document ID:** `MAOS-GOV-WP-001`  
**Version:** `1.0`  
**Status:** Charter-Grade - TX-01 Compliant  
**Owner:** Final Arbiter (`Stan Milan`)  
**Authority:** `AIOEAC-MMC v1.6` · Charter Hub · TAO Doctrine  
**Effective Date:** `2026-03-24`  
**Surface Type:** White Paper  
**Audience:** Human (primary), Agent (secondary), Machine (secondary)  
**Purpose:** Define the governance architecture, codex, enforcement posture, and learning-plane requirements needed to govern MAOS deployments at enterprise scale.  
**Canonical Source:** `docs/SOURCES-OF-TRUTH.md`; `artifacts/codex/meta-mega/MAOS-Governance-Codex-v1.md`; `GOVERNANCE.md`  
**Related Surfaces:** `artifacts/governance/MAOS-GOVERNANCE-CODEX-POLICY-AS-CODE-CATALOG-v1.md`; `artifacts/governance/MAOS-GOVERNANCE-CODEX-FLOW-DIAGRAMS-v1.md`; `artifacts/governance/MAOS-GOVERNANCE-CODEX-ACTION-CHECKLIST-v1.md`; `artifacts/governance/MAOS-GOVERNANCE-CODEX-ANNOTATED-BIBLIOGRAPHY-v1.md`; `artifacts/governance/exports/academic-consultancy-references-latest.md`

---

## Charter Standard Block

| Field | Value |
| --- | --- |
| Impact | Defines the governance architecture, codex, enforcement rules, and learning-plane specifications required to govern MAOS deployments at enterprise scale |
| Why It Matters | Ungoverned agentic systems compound risk non-linearly. Every capability added without a matching governance plane creates an audit gap, a drift vector, and a liability surface. |
| Governing Controls | `D-01 Dual-Agent Doctrine` · `TX-01 Evidence Doctrine` · `STOP-RESET-REALIGN` · `LOCK AUTONOMY` · `Moses Lock-In` |
| Evidence Links | `NIST AI RMF 1.0` · `NIST AI 600-1` · `ISO/IEC 42001:2023` · `OECD AI Principles` · `Anthropic RSP v3.0` · `OpenAI Preparedness Framework v2` · `Google DeepMind Frontier Safety Framework` · `MITRE ATLAS` · `OWASP LLM Top 10` · `artifacts/governance/exports/academic-consultancy-references-latest.md` |

---

## Executive Summary

MAOS requires a five-plane governance architecture: Control, Execution, Data, Learning, and Safety. Those planes must be governed as a continuously adapting socio-technical system, not as static documentation. Without that structure, capability growth outruns accountability, memory drifts beyond validated truth, and tool use creates side effects faster than operators can audit them.

This white paper is the authoritative governance narrative for that architecture. It translates official AI governance frameworks, frontier-model safety practice, implementation-science evaluation methods, and Activ8 Charter controls into an operational MAOS standard. The corresponding repo-local codex and companion artifacts convert this white paper from narrative into reusable control-plane surfaces.

The core thesis is simple:

1. Agentic systems become governance problems before they become scale problems.
2. Persistence and adaptation must be governed as first-class planes, not implementation details.
3. A system is only governable if it can observe itself, validate its memory, pause unsafe autonomy, and retain auditable evidence for every material action.

---

## 1. Problem Statement

Conventional AI governance assumes bounded inference: train, evaluate, deploy, monitor. Agentic systems violate that assumption because they:

- plan across multiple steps,
- invoke external tools with side effects,
- retain memory beyond a single prompt window,
- delegate work to other agents or processes,
- and adapt behavior through reflection, retrieval, and procedural reuse.

That creates four structural risks:

| Risk | Failure mode | Governance consequence |
| --- | --- | --- |
| Unbounded action surfaces | Tool calls can create real-world side effects before review | Authorization and recovery must be explicit |
| Memory persistence | Knowledge outlives the approved prompt state | Provenance, retention, and re-validation become mandatory |
| Continual adaptation | Behavior changes without obvious release boundaries | Evaluation and rollback must become continuous |
| Multi-agent delegation | Accountability diffuses across relay chains | Authority and traceability must be preserved end to end |

The result is that agentic deployments break checklist-only governance. They require a runtime control plane.

---

## 2. Theoretical Foundations

This white paper is grounded in four source families.

### 2.1 Government and standards frameworks

- `NIST AI RMF 1.0` supplies the lifecycle functions: Govern, Map, Measure, Manage.
- `NIST AI 600-1` extends that posture to generative systems with stronger provenance, testing, and incident expectations.
- `ISO/IEC 42001:2023` supplies the management-system frame for continual improvement.
- `OECD AI Principles` anchor the values layer: accountability, transparency, robustness, safety, and human-centered governance.

### 2.2 Frontier safety frameworks

- `Anthropic RSP v3.0`
- `OpenAI Preparedness Framework v2`
- `Google DeepMind Frontier Safety Framework`
- `Microsoft Frontier Governance Framework`

These converge on a common pattern: capability thresholds, lifecycle evaluation, mitigation sufficiency, and governed deployment decisions.

### 2.3 Persistence and adaptation research

- `Lewis et al. (RAG)` for provenance-first retrieval
- `Park et al. (Generative Agents)` for episodic memory and reflection
- `Shinn et al. (Reflexion)` for learning without weight updates
- `Wang et al. (Voyager)` for skill-library accumulation
- `Yao et al. (ReAct)` for auditable reasoning plus acting traces

### 2.4 Activ8 Charter doctrine

- `TAO Doctrine`
- `TX-01 Evidence Doctrine`
- `D-01 Dual-Agent Doctrine`
- `STOP-RESET-REALIGN`
- `LOCK AUTONOMY`
- `Moses Lock-In`

These are not narrative overlays. They are the enforcement language that turns framework intent into operating rules.

---

## 3. The Five-Plane MAOS Governance Architecture

The MAOS governance model uses five interlocking planes. The repo-local implementation binding lives in `artifacts/codex/meta-mega/MAOS-Governance-Codex-v1.md`.

| Plane | Primary function | Core question | Repo binding surface |
| --- | --- | --- | --- |
| Control | Authority, thresholds, approvals, escalation | Should this happen? | `artifacts/codex/meta-mega/MAOS-Governance-Codex-v1.md` |
| Execution | Orchestration, relay, tool use, workflow state | How does this happen? | `src/prime-bridge/`, `src/masr/`, `src/router.ts` |
| Data | Telemetry, evidence, provenance, evaluation, incident record | What happened? | `src/prime-bridge/evidence.ts`, `src/prime-bridge/telemetry.ts` |
| Learning | Memory, retrieval, skill accumulation, closeout, feedback | What should the system retain and reuse? | `src/modules/maos/handlers/session_*`, `learning_memory.ts` |
| Safety | Gates, locks, classifiers, threshold halts, verification rules | What must be blocked or paused? | `src/execution-gate.ts`, `src/prime-bridge/surface.ts` |

The planes are mutually distinct in primary responsibility and collectively exhaustive across the governance surface.

---

## 4. Persistence and Continual Learning

Persistence is a governance plane, not a convenience layer.

MAOS recognizes four governed memory classes:

| Memory class | Role | Governance posture |
| --- | --- | --- |
| Episodic | Stores run-by-run experience | Agents may write automatically; provenance required |
| Semantic | Stores reusable factual knowledge | Writes are validated and re-validated |
| Procedural | Stores skills, playbooks, repeatable methods | Publication requires review and lifecycle state |
| Normative | Stores doctrine, policy, canonical rules | Locked by authority and never agent-written |

The preferred learning order is:

1. improve through retrieval, reflection, and skill accumulation,
2. validate whether that closes the capability gap,
3. only then consider managed weight updates as release events.

This preserves a readable audit boundary between approved system behavior and current system behavior.

---

## 5. Drift Detection and Policy Learning

Drift is not one thing. MAOS treats it as a multi-layer monitoring problem.

### 5.1 Drift layers

- Task-level drift: quality, safety, calibration, and accuracy per task family
- Tool-output drift: latency, error rate, value distribution, and invocation pattern changes
- Memory-access drift: changing retrieval behavior, confidence collapse, or semantic mismatch

### 5.2 ADWIN posture

Adaptive window detectors are suitable because they do not require a fixed time-scale assumption. A MAOS deployment can experience slow semantic drift and sudden operational drift at the same time.

### 5.3 Governed policy learning

Policy learning is allowed only when:

- the reward hierarchy is control-plane defined,
- the feedback provenance is known,
- the update path follows PDCA,
- and hard safety constraints remain non-negotiable.

Agents do not redefine their own reward function. Safety adherence is a gate, not a soft objective.

---

## 6. Knowledge Graph Governance

Knowledge-graph governance is a natural fit for MAOS because it supports:

- explicit entity and relation modeling,
- provenance-aware querying,
- and constraint validation at write time.

The W3C stack matters here:

- `RDF` for normalized knowledge representation
- `SPARQL` for policy, provenance, and contradiction queries
- `SHACL` for constraint validation

The governance pattern is policy-as-constraints. Instead of storing policy only as prose, MAOS can represent admission rules, provenance requirements, and permission edges as enforceable graph constraints.

---

## 7. MAOS Governance Codex v1

The full codex specification in this repo is split into narrative and operational surfaces:

- This white paper is the authoritative narrative and justification surface.
- `artifacts/codex/meta-mega/MAOS-Governance-Codex-v1.md` is the repo-local implementation map.
- `artifacts/governance/MAOS-GOVERNANCE-CODEX-POLICY-AS-CODE-CATALOG-v1.md` is the reusable rule surface.
- `artifacts/governance/MAOS-GOVERNANCE-CODEX-FLOW-DIAGRAMS-v1.md` is the system-flow surface.
- `artifacts/governance/MAOS-GOVERNANCE-CODEX-ACTION-CHECKLIST-v1.md` is the rollout and hardening surface.
- `artifacts/governance/MAOS-GOVERNANCE-CODEX-ANNOTATED-BIBLIOGRAPHY-v1.md` is the evidence spine.

Together they form the operational codex package.

---

## 8. Internal Framework Mesh Bindings

The governance codex does not start from zero. It is reinforced by the internal frameworks mesh exported in `artifacts/governance/exports/academic-consultancy-references-latest.md`.

That mesh contributes four judgment layers:

| Mesh source | Contribution to the white paper |
| --- | --- |
| Academic institutions | Rigor, systems thinking, implementation science, and research discipline |
| Consulting firms | Structured reasoning, executive communication, and operating-model framing |
| Frameworks | MECE, Issue Trees, 7S, RAPID, RE-AIM, DSR, CFIR, OpenTelemetry |
| Activ8 controls and doctrines | Charter-grade execution, evidence, halt controls, and verification posture |

This is why the white paper is both authoritative and operational: it is backed by external frameworks and internal doctrine simultaneously.

---

## 9. Implementation Reading Order

Use this order when moving from theory to operation:

1. `docs/SOURCES-OF-TRUTH.md`
2. `docs/AUDIENCE-SURFACE-CONTRACT.md`
3. `docs/MAOS-GOVERNANCE-CODEX-WHITE-PAPER-v1.md`
4. `artifacts/codex/meta-mega/MAOS-Governance-Codex-v1.md`
5. `artifacts/governance/MAOS-GOVERNANCE-CODEX-POLICY-AS-CODE-CATALOG-v1.md`
6. `artifacts/governance/MAOS-GOVERNANCE-CODEX-FLOW-DIAGRAMS-v1.md`
7. `artifacts/governance/MAOS-GOVERNANCE-CODEX-ACTION-CHECKLIST-v1.md`
8. `artifacts/governance/MAOS-GOVERNANCE-CODEX-ANNOTATED-BIBLIOGRAPHY-v1.md`

This keeps principle before implementation and evidence before conclusion.

---

## 10. Sign-Off

| Field | Value |
| --- | --- |
| Document | `MAOS Governance Codex - Agentic AI Governance, Persistence, and Continual Adaptation` |
| Document ID | `MAOS-GOV-WP-001` |
| Version | `1.0 - FINAL` |
| Status | Complete |
| Next Review | `2026-06-24` or upon any `T2` / `T3` event |
| Change Procedure | `Moses Lock-In` for Level 1 doctrine, `PDCA + TRB` for Level 2 operational changes, `Pilot Principle` for Level 3 execution changes |

Truth -> Action -> Order.

---

© 2026 Activ8 Automation Intelligence, LLC · All Rights Reserved · Build Document - Confidential & Internal
