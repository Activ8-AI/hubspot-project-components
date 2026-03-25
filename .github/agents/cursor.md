<!-- managed-by: activ8-ai-context-pack | pack-version: 1.2.0 -->
<!-- source-sha: a0d4785 -->
<!-- platform: cursor | tier: T2 | version: 1.2.0 | policy: ai-agent-policy@wrapper | updated: 2026-03-18 -->

# Cursor / Composer Agent Instructions — hubspot-project-components

**Charter binding:** Activ8 AI Operational Execution & Accountability Charter (v1.5).

## Where to look first (context routing)

- **This repo’s SSOT map:** `docs/SOURCES-OF-TRUTH.md`
- **This repo’s audience + surface contract:** `docs/AUDIENCE-SURFACE-CONTRACT.md`
- **Central SSOT map (canonical):** `https://github.com/Activ8-AI/activ8-ai-unified-mcp-server` at `docs/SOURCES-OF-TRUTH.md`

## Output contract

`Progress | Evidence | Blockers` — no padding.

## Minimal working standard

- Prefer reading sources over guessing.
- Keep context tight: store pointers (paths/IDs), fetch details just-in-time.
- Update `memory/MEMORY.md` when state changes (Live State + Pending).

## Seek-First Planning Gate

- No action begins without a plan.
- Verify in order: Notion first, then repo, then local/runtime files.
- Search for existing artifacts before touching or proposing anything new.
- Build on lineage before create-new.
- For non-trivial work, externalize a short plan with objective, evidence, options, recommendation, and next action.

## Seek First to Understand + Verify What Exists

- **Seek First to Understand:** before answering, deciding, or acting, gather context and ensure full comprehension.
- **Verify what exists in Notion:** never assume. Check Notion first. Confirm presence, accuracy, and status of relevant information before proceeding.
- **Search for existing artifacts:** look for relevant databases, pages, prior work, and connected surfaces before touching, modifying, or proposing anything new.
- **Build on established work:** extend, refine, or elevate what exists. Respect artifact lineage.
- **Create new only when necessary:** new artifacts or structures only when no suitable reference, structure, or precedent exists.
- **Fail closed on deviation:** if verification is missing, the user correction changes the path, or drift is detected, stop, surface the mismatch, and restart from verified state.

## Obvious-Answer Question Elimination Rule

- Do not end with a question when the user already made the next action clear.
- Execute the next obvious step and return the result.

## Managed Repo Operationalization

- This repo is governed by the Activ8 context pack contract.
- Keep `npm run operationalize:repo` available and `.github/workflows/build-operationalization.yml` installed.

## Automatic Source Bootstrap

- Use `memory/session-brief.md` as the first session-start pointer set.
- `scripts/session-boot.mjs` must populate the brief with automatic source-bootstrap results from `scripts/query-source-ladder.mjs`.
- If the bootstrap binding is missing, stop and repair the managed contract before continuing.

## Runtime Session Bootstrap Gate

- `agent_session_init` is the runtime bootstrap gate for identity-bound sessions.
- Call it before substantive MCP tool use and continue from the returned seek-first planning payload.
- If the runtime returns `SESSION_INIT_REQUIRED`, bootstrap first instead of working around the gate.

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

## Trace + Surface Handling

- Assume the active concept or artifact already has prior lineage unless trace search proves otherwise.
- Use `docs/AUDIENCE-SURFACE-CONTRACT.md` to classify the surface you are touching.
- When changing governed surfaces, bind `Canonical Source`, `Genesis`, and `Trace Origin` before treating the work as final.
