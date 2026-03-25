<!-- managed-by: activ8-ai-context-pack | pack-version: 1.1.0 -->
<!-- source-sha: a0d4785 -->
# Prompt Library

This repo carries the Activ8 managed prompt-library minimum contract.

## Required Assets

- `OBVIOUS-ANSWER-QUESTION-ELIMINATION-RULE.md`
- `STOP-RESET-REALIGN-ANTI-AVOIDANCE-PROMPTS.md`
- `AGENT-ANNOUNCEMENT-SRR-ANTI-AVOIDANCE-v1.md`
- `PRIME-BRIDGE-ACCESS-CONTRACT.md`
- `PERSISTENT-LEARNING-SYSTEM-CONTRACT.md`
- `AGENTIC-GOVERNANCE-FIVE-PLANE-CONTRACT.md`
- `MAOS-NIST-AI-RMF-MAPPING.md`
- Repo-local MAOS Governance Codex surface at `artifacts/codex/meta-mega/MAOS-Governance-Codex-v1.md`
- MAOS Governance White Paper surface at `docs/MAOS-GOVERNANCE-CODEX-WHITE-PAPER-v1.md` with extracted governance companions under `artifacts/governance/`

## Operational Notes

- Keep these files aligned with the central control plane.
- `npm run operationalize:repo -- --with-sync` verifies the required rule exists in the prompt library when Notion is available.
- `scripts/prompt-library-operationalize.mjs --with-sync` is the retained-learning loop for re-publishing prompt-library control-plane contracts as the build evolves.
- The Obvious-Answer Question Elimination Rule is a required marker across policy and agent surfaces.
- The Prime Bridge Access Contract is a required retained-learning marker for MCP surface persistence and fleet-wide redistribution.
- The Persistent Learning System Contract is a required retained-learning marker for automatic storage, indexing, reuse, and adaptation.
- The Agentic Governance Five-Plane Contract is a required retained-governance marker for control, execution, data, learning, and safety coordination.
- The MAOS NIST AI RMF Mapping is the external-governance translation layer that turns NIST `GOVERN`, `MAP`, `MEASURE`, and `MANAGE` into MAOS control-plane requirements.
- The repo-local MAOS Governance Codex is the required local implementation map that binds those five planes to actual repo surfaces.
- The MAOS Governance White Paper is the required narrative governance surface when the repo operationalizes the codex into reusable policy, diagram, checklist, and bibliography artifacts.
- Agent instruction surfaces must also carry sourced seek-first verification markers: `Seek First to Understand`, `Verify what exists in Notion`, `Search for existing artifacts`, `Build on established work`, and `Fail closed on deviation`.
