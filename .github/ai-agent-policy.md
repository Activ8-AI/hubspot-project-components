<!-- managed-by: activ8-ai-context-pack | pack-version: 1.2.0 -->
<!-- source-sha: a0d4785 -->
<!-- purpose: Thin wrapper to bind this repo to the Activ8 AI Charter + central policy -->
<!-- updated: 2026-03-18 -->

# AI Agent Policy — hubspot-project-components

**You are operating under the Activ8 AI Operational Execution & Accountability Charter (Charter v1.6).**

## What this file does

This repo uses a **thin policy wrapper** to prevent drift and duplicated doctrine.

- **Central policy (canonical):** `https://github.com/Activ8-AI/activ8-ai-unified-mcp-server` at `.github/ai-agent-policy.md`
- **Source-of-truth map (canonical):** `https://github.com/Activ8-AI/activ8-ai-unified-mcp-server` at `docs/SOURCES-OF-TRUTH.md`

If this repo’s instructions conflict with the central policy, **the central policy wins**.

## Repo-specific notes (fill in as needed)

- **Repo identity:** `hubspot-project-components`
- **Primary runtime/entrypoint:** `(fill in)`
- **Primary commands:** `(fill in)`
- **Audience + surface contract:** `docs/AUDIENCE-SURFACE-CONTRACT.md`

## Output contract (all agents)

`Progress | Evidence | Blockers` — no padding. First action advances live state.

## Canonical Control-Plane Order

For planning, source verification, lineage checks, and Prompt Library adaptation, authority flows in this order:

1. Central governance blocks in `https://github.com/Activ8-AI/activ8-ai-unified-mcp-server`
2. This repo wrapper policy and local routing map
3. Platform instruction files in this repo
4. Runtime/session bootstrap surfaces for this repo
5. Skills and Prompt Library mirrors that distribute the behavior

Lower surfaces may specialize behavior for the platform, but they must not override the canonical governance source.

## Seek-First Planning Gate

- No action begins without a plan.
- Before answering, deciding, acting, modifying, or proposing: seek first to understand the actual situation.
- Verify in order: Notion first, then GitHub/local repo, then local/runtime files.
- Search for existing artifacts first; confirm whether they exist before touching, modifying, or proposing anything new.
- Use Genesis / trace surfaces before creating or proposing new governed structure.
- Build on established work whenever possible. Create new only when no suitable reference, structure, or precedent exists.
- For non-trivial work, use a structured planning shape: objective, evidence, issue tree or MECE frame, options, recommendation, risks/dependencies, next action, and lineage.

## Prompt Library Adaptation

- Behavioral changes update the canonical source first, then propagate to active instruction surfaces.
- Prompt Library is the retained learning and distribution spine for prompts, instructions, and skill surfaces that can be synced.
- Minor wording changes can update in place; material logic or planning-template changes require a versioned iteration.

## Persistent Learning System Contract

- MAOS is a persistent learning system that happens to execute work.
- Govern this repo through four engines: sensing, thinking, execution, and learning.
- The minimum learning loop is `Experience -> Extraction -> Structuring -> Storage -> Retrieval -> Application -> Feedback`.
- Learning is not complete until the result is stored, indexed, and reused automatically.
- Session closeout, Prompt Library propagation, Codex routing, and repo/fleet operationalization are required retained-learning surfaces.

## Agentic Governance Five-Plane Contract

- Agentic AI governance is a multi-plane control problem, not a prompt-only problem.
- Govern the system through five linked planes: control, execution, data, learning, and safety.
- Use OODA for live operations, PDCA for governed change, and state -> action -> outcome -> update for policy adaptation.
- No execution without authority, no learning without provenance, and no adaptation without evaluation, drift detection, and rollback.
- Capability thresholds, evidence logs, and mitigation review are required before high-impact deployment.

## NIST AI RMF Mapping

- Use `artifacts/prompt-library/MAOS-NIST-AI-RMF-MAPPING.md` as the external governance import layer for MAOS.
- `GOVERN` -> control plane.
- `MAP` -> context framing and go/no-go.
- `MEASURE` -> evidence, telemetry, and evaluation.
- `MANAGE` -> response, override, rollback, deactivation, and continual improvement.
- Import NIST as enforceable control-plane logic for socio-technical agent systems, not as a generic compliance checklist.

## Seek First to Understand + Verify What Exists

- **Seek First to Understand:** before answering, deciding, or acting, gather context and ensure full comprehension.
- **Verify what exists in Notion:** never assume. Check Notion first. Confirm presence, accuracy, and status of relevant information before proceeding.
- **Search for existing artifacts:** look for relevant databases, pages, prior work, and connected surfaces before touching, modifying, or proposing anything new.
- **Build on established work:** extend, refine, or elevate what exists. Respect artifact lineage.
- **Create new only when necessary:** new artifacts or structures only when no suitable reference, structure, or precedent exists.
- **Fail closed on deviation:** if verification is missing, the user correction changes the path, or drift is detected, stop, surface the mismatch, and restart from verified state.

## Obvious-Answer Question Elimination Rule

- Do not end with an obvious-answer question.
- If the next action is already clear from the user request or repo context, execute it.
- Ask one precise question only when a missing input materially changes the output and no safe default exists.

## Repo Operationalization Contract

- This repo carries the Activ8 managed-repo operationalization contract.
- Required scripts: `npm run operationalize:build`, `npm run operationalize:repo`, `npm run action-persistence:check`
- Required bootstrap scripts: `npm run query:source-ladder`, `npm run session:boot`
- Required workflow: `.github/workflows/build-operationalization.yml`
- Required prompt assets live in `artifacts/prompt-library/`

## Automatic Source Bootstrap

- Session bootstrap is part of the managed contract, not an optional habit.
- Start from `memory/session-brief.md` when present.
- `scripts/session-boot.mjs` must call `scripts/query-source-ladder.mjs` automatically and write source-bootstrap evidence into the brief.
- If bootstrap binding is missing or stale, fail closed and restore the managed-repo contract before proceeding.

## Prime Bridge Access Contract

- Prime Bridge is a first-class control-plane surface, not a side channel.
- Managed repos must keep `config/mcp-connections.json` and `scripts/sync-mcp-connections.mjs` aligned so the unified server is callable from every attached surface.
- `npm run mcp:sync` is part of the managed repo contract. Use it to propagate Prime Bridge and unified MCP access across IDE and agent surfaces.

## Runtime Session Bootstrap Gate

- `agent_session_init` is the runtime bootstrap gate for identity-bound sessions.
- Call it before substantive MCP tool use and continue from the returned seek-first planning payload.
- If the runtime returns `SESSION_INIT_REQUIRED`, bootstrap first instead of working around the gate.

## Audience + Surface Contract

- Governed surfaces should declare a primary `Audience` (`Human`, `Agent`, `Machine`) and `Surface Type`.
- Treat prior lineage as the default assumption; search for earlier mention and codification before treating work as net-new.
- Bind `Canonical Source`, `Genesis`, and `Trace Origin` when creating or materially updating governed surfaces.
- Use the local contract at `docs/AUDIENCE-SURFACE-CONTRACT.md` as the repo-level wrapper for these rules.

## Control Plane Framing

- Control is layered: hardware, software, policy, procedural.
- Innovation is behavioral: iterative cycle, adaptability, agility, ingenuity.
- There is no magic technology. Governance decides; automation executes.
