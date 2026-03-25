<!-- managed-by: activ8-ai-context-pack | pack-version: 1.2.0 -->
<!-- source-sha: a0d4785 -->
<!-- updated: 2026-03-18 -->

# Sources of Truth — hubspot-project-components

**Rule:** Notion is SSOT for governance/evidence. Repo is SSOT for implementation.

## Seek-First Verification Order

When a governed decision, prompt, instruction, or artifact is in scope, verify in this order:

1. Notion
2. GitHub/local repo
3. Local/runtime files

No action begins without a plan, and no governed artifact must be treated as net-new until these surfaces have been checked.

## Start here

- **If the question is “what did we decide / what’s canonical?”** start in Notion (SSOT), then cross-reference code.
- **If the question is “how does it work / where is it implemented?”** start in this repo.

## Canonical central map

This repo follows the canonical sources-of-truth map in the central control-plane repo:

- `https://github.com/Activ8-AI/activ8-ai-unified-mcp-server` at `docs/SOURCES-OF-TRUTH.md`

## Audience + surface contract

Use `docs/AUDIENCE-SURFACE-CONTRACT.md` to keep naming, trace, and routing aligned for:

- `Human` navigation surfaces
- `Agent` topology / governance surfaces
- `Machine` sync / index surfaces

When working on governed artifacts:

- bind `Genesis` and `Trace Origin`
- use the declared `Surface Type`
- update indexes / manifests / registers when the surface changes

## This repo (local routing)

| Need | Where |
| --- | --- |
| Audience, naming, and trace contract | `docs/AUDIENCE-SURFACE-CONTRACT.md` |
| Repo-local five-plane governance binding | `artifacts/codex/meta-mega/MAOS-Governance-Codex-v1.md` |
| MAOS governance narrative / white paper | `docs/MAOS-GOVERNANCE-CODEX-WHITE-PAPER-v1.md` |
| MAOS governance reusable rule set | `artifacts/governance/MAOS-GOVERNANCE-CODEX-POLICY-AS-CODE-CATALOG-v1.md` |
| Current state / what’s in flight | `memory/MEMORY.md` |
| Lessons learned / gotchas | `memory/key-lessons.md` |
| Operator preferences | `memory/operator-preferences-learn-me.md` |
| Repo-specific agent rules | `.github/*` + `.github/agents/*` + `AGENTS.md` + `CLAUDE.md` |

## Query Ladder

Use the local query ladder before spending live Notion query budget on broad search.

- Helper: `npm run query:source-ladder -- "your query here"`
- Default order: repo anchors -> repo mirrors -> live Notion confirm
- Receipts write to `artifacts/source-query-ladder/receipts/`
- Query summaries append to `artifacts/source-query-ladder/query-receipts.jsonl`

## Automatic session/bootstrap binding

- `npm run session:boot` generates `memory/session-brief.md`
- `scripts/session-boot.mjs` runs `scripts/query-source-ladder.mjs` automatically for the default bootstrap surfaces
- Reuse the current bootstrap receipts before issuing fresh live Notion searches
