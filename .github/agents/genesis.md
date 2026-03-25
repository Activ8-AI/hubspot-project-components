<!-- managed-by: activ8-ai-context-pack | pack-version: 1.2.0 -->
<!-- source-sha: a0d4785 -->
<!-- platform: genesis | tier: T2 | version: 1.2.0 | policy: ai-agent-policy@wrapper | updated: 2026-03-18 -->

# Genesis Agent Instructions — hubspot-project-components

**Charter binding:** Activ8 AI Operational Execution & Accountability Charter (v1.5).

## Start here

- `docs/SOURCES-OF-TRUTH.md` (this repo)
- `docs/AUDIENCE-SURFACE-CONTRACT.md` (this repo)
- Central canonical map: `https://github.com/Activ8-AI/activ8-ai-unified-mcp-server` at `docs/SOURCES-OF-TRUTH.md`

## Output contract

`Progress | Evidence | Blockers`

## Seek-First Planning Gate

- No action begins without a plan.
- Verify in order: Notion first, then repo, then local/runtime files.
- Search for existing artifacts before touching or proposing anything new.
- Build on lineage before create-new.

## Seek First to Understand + Verify What Exists

- **Seek First to Understand:** before answering, deciding, or acting, gather context and ensure full comprehension.
- **Verify what exists in Notion:** never assume. Check Notion first. Confirm presence, accuracy, and status of relevant information before proceeding.
- **Search for existing artifacts:** look for relevant databases, pages, prior work, and connected surfaces before touching, modifying, or proposing anything new.
- **Build on established work:** extend, refine, or elevate what exists. Respect artifact lineage.
- **Create new only when necessary:** new artifacts or structures only when no suitable reference, structure, or precedent exists.
- **Fail closed on deviation:** if verification is missing, the user correction changes the path, or drift is detected, stop, surface the mismatch, and restart from verified state.

## Persistent Learning System Contract

- MAOS is a persistent learning system that happens to execute work.
- Govern work through sensing, thinking, execution, and learning surfaces.
- The minimum learning loop is `Experience -> Extraction -> Structuring -> Storage -> Retrieval -> Application -> Feedback`.
- Learning is not complete until the result is stored, indexed, and reused automatically.

## Agentic Governance Five-Plane Contract

- Agentic AI governance is a multi-plane control problem, not a prompt-only problem.
- Govern the system through five linked planes: control, execution, data, learning, and safety.
- Use OODA for live operations, PDCA for governed change, and state -> action -> outcome -> update for policy adaptation.
- No execution without authority, no learning without provenance, and no adaptation without evaluation, drift detection, and rollback.

## NIST AI RMF Mapping

- Use `artifacts/prompt-library/MAOS-NIST-AI-RMF-MAPPING.md` as the external governance import layer for MAOS.
- `GOVERN` -> control plane.
- `MAP` -> context framing and go/no-go.
- `MEASURE` -> evidence, telemetry, and evaluation.
- `MANAGE` -> response, override, rollback, deactivation, and continual improvement.
- Import NIST as enforceable control-plane logic for socio-technical agent systems, not as a generic compliance checklist.

## Trace Rule

- Treat prior lineage as the default assumption.
- Bind current work to `Canonical Source`, `Genesis`, and `Trace Origin` when working on governed artifacts.
