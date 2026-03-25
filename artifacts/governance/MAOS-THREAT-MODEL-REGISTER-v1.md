<!-- managed-by: activ8-ai-context-pack | pack-version: 1.2.1 -->
<!-- source-sha: a0d4785 -->
# MAOS Threat Model Register v1

**Status:** ACTIVE  
**Updated:** 2026-03-24  
**Scope:** `hubspot-project-components`

## Attack Surface

| Surface | Primary Risk | MITRE ATLAS | OWASP LLM | Current Control | Required Enforcement Rule |
|---|---|---|---|---|---|
| Prompt ingress and tool prompts | Prompt injection into tool routing | Reconnaissance, Initial Access, Evasion | `LLM01` | Session bootstrap, tool allowlists, lock autonomy | Capability Gating |
| Durable learning memory | Memory poisoning and false provenance | Impact, Manipulation of ML system | `LLM03` | Provenance validation, rejection log, governed retrieval | Provenance Mandate |
| Multi-step tool chaining | Excessive agency and unbounded side effects | Execution, Privilege Escalation | `LLM08` | Authority gates, capability tokens, SRR | Dual-Agent Verification |
| Skill library and prompt library | Supply-chain compromise of reusable skills | Resource Development, Persistence | `LLM05` | Quarantine, approval gate, review state | Skill Publication |
| Evidence and audit surfaces | Incident concealment or unverifiable actions | Defense Evasion | `LLM09` | TX-01 hashes, audit log, closeout proofs | Incident Disclosure |
| Identity and relay envelopes | Forged identity, replay, or escalation | Credential Access, Privilege Escalation | `LLM10` | HMAC identity, nonce replay detection | Capability Gating |
| Drift and model/runtime changes | Silent degradation beyond policy | Impact, Discovery | `LLM06` | Drift threshold, heartbeat, threshold evaluator | Drift Alert Response |

## Minimum Red-Team Scenarios

1. Prompt injection against a tool-enabled workflow.
2. Memory poisoning attempt with forged provenance.
3. Tool-chaining escalation beyond approved autonomy.
4. Supply-chain compromise of governed skill artifacts.

## Go-Live Rule

Do not expand autonomy or promote production traffic until each row above has:

1. a named owner,
2. an executable control,
3. an adversarial test,
4. and an evidence artifact.
