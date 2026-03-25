<!-- managed-by: activ8-ai-context-pack | pack-version: 1.2.0 -->
<!-- source-sha: a0d4785 -->
<!-- updated: 2026-03-18 -->

# Audience + Surface Contract — hubspot-project-components

**Purpose:** Keep human, agent, and machine movement aligned across the repo by giving every governed surface a common naming, trace, and routing contract.

## Audience Contract

### Human

- Use for fast orientation, navigation, and decision support.
- Prefer plain-language names and obvious next steps.
- Required on human-facing surfaces: purpose, status, owner, next route.

### Agent

- Use for topology, governance, lineage, and execution routing.
- Prefer typed surfaces, canonical source pointers, and update protocol.
- Required on agent-facing surfaces: canonical source, Genesis, Trace Origin, status, update mode.

### Machine

- Use for deterministic sync, indexing, validation, and automation.
- Prefer stable IDs, explicit metadata, and predictable structure.
- Required on machine-facing surfaces: stable identifier, source-of-truth marker, sync/update owner, status.

## Surface Type Contract

Use one primary type per governed surface.

- `Sitemap`: navigation or topology surface
- `Index`: retrieval surface
- `Manifest`: enumerated inventory
- `Register`: canonical governed record
- `Hub`: operational cluster/root
- `Portal`: audience access layer
- `Dashboard`: operating or reporting surface

## Naming Pattern

Use this default pattern unless an existing canonical title must be preserved:

`[Surface Type] — [Domain/Scope] — [Purpose]`

Examples:

- `Sitemap — Workspace — Navigation SSOT`
- `Register — Genesis — Canonical Trace`
- `Manifest — Repo — Surface Inventory`
- `Portal — Client — Access Layer`

## Required Metadata

Every governed surface must declare:

- `Audience`
- `Surface Type`
- `Purpose`
- `Canonical Source`
- `Genesis`
- `Trace Origin`
- `Status` (`Active`, `Legacy`, `Reference`, `Stale`)
- `Update Mode` (`Manual`, `Agent-refreshed`, `Database-driven`, `Sync-driven`)
- `Related Indexes / Registers`

## Trace Rule

- Assume prior lineage exists.
- Search for earlier mention, precursor language, adjacent framing, and codification before treating work as net-new.
- Bind current work to the earliest supported source you can verify.
- If Genesis is missing, register the gap and add the new surface to the trace spine.

## Routing Rule

- Humans start with `docs/SOURCES-OF-TRUTH.md`.
- Agents start with `docs/SOURCES-OF-TRUTH.md`, then resolve canonical sources and trace surfaces.
- Machines must bind to stable IDs, manifests, registers, and database-backed indexes instead of prose alone.

## Operationalization Rule

- New or materially updated governed surfaces must be reflected in the repo routing map.
- Agent instructions must reference this contract so behavior stays aligned across platforms.
- Managed repos must validate this contract with `npm run operationalize:build`.

