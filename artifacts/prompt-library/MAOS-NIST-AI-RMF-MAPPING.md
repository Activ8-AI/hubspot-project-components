<!-- managed-by: activ8-ai-context-pack | pack-version: 1.2.0 -->
<!-- source-sha: a0d4785 -->
# MAOS NIST AI RMF Mapping

This mapping extracts the highest-value parts of `NIST AI 100-1` and translates them into MAOS control-plane requirements.

## Core Interpretation

NIST is most useful to MAOS as an operating grammar for governed agent execution:

- `GOVERN` -> control plane
- `MAP` -> context framing and go/no-go
- `MEASURE` -> evidence, telemetry, and evaluation
- `MANAGE` -> response, override, rollback, deactivation, and continual improvement

MAOS should treat this as governance infrastructure for socio-technical systems, not as a generic responsible-AI checklist.

## High-Value Imports

### GOVERN -> MAOS control plane

- Authority, policy, thresholds, approvals, and accountability must be explicit.
- Governance is cross-cutting and must be infused throughout runtime, not isolated in a document.
- Third-party tools, models, and data are part of the governed risk surface.
- Unsafe or degraded systems must have decommission or deactivation paths.

### MAP -> session bootstrap and context gate

- Establish intended purpose, actors, context of use, risks, limits, and oversight before execution.
- Produce a bounded go/no-go decision before high-impact work proceeds.
- Re-map context as capabilities, surfaces, and harms evolve.

### MEASURE -> evidence plane

- Measure before deployment and while live.
- Track trustworthy behavior, performance, failure modes, uncertainty, overrides, incidents, and drift.
- Keep evaluation traceable enough to justify management decisions and rollback.

### MANAGE -> adaptive control

- Prioritize treatment by impact, likelihood, and available controls.
- Respond to unknown risks, recover from incidents, and communicate failures.
- Supersede, disengage, or deactivate systems that operate outside intended use.
- Integrate measurable continual improvement into updates.

## MAOS Requirements

- No meaningful execution without authority and context.
- No adaptation without measurement and rollback.
- No learning without provenance, retention rules, and reuse under policy.
- No autonomy expansion without threshold review.
- No production trust without post-deployment monitoring, override, and incident response.

## MAOS Surface Mapping

- `agent_session_init` -> MAP gate for context, scope, and go/no-go framing
- Authority levels and approval gates -> GOVERN structures
- Router enforcement and runtime blockers -> MANAGE controls
- Scoreboard metrics, incident logs, eval receipts, and drift tracking -> MEASURE plane
- Prompt-library, memory, and rule propagation -> continual improvement mechanism

## Operating Rule

Use NIST AI RMF as the external governance baseline for MAOS:

- `GOVERN` decides what is allowed
- `MAP` decides whether this situation should proceed
- `MEASURE` decides whether behavior is acceptable
- `MANAGE` decides how to respond, improve, constrain, or shut down

That is the useful import. MAOS remains the operational control plane that executes this logic across agent, tool, memory, and fleet surfaces.
