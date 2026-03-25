<!-- managed-by: activ8-ai-context-pack | pack-version: 1.2.0 -->
<!-- source-sha: a0d4785 -->
<!-- gov-lint-ignore -->
# MAOS Governance Codex - Flow Diagrams

**Version:** `1.0`  
**Status:** ACTIVE  
**Related White Paper:** `docs/MAOS-GOVERNANCE-CODEX-WHITE-PAPER-v1.md`

---

## 1. Five-Plane Architecture

```mermaid
flowchart LR
  subgraph C[CONTROL PLANE]
    P[Policies and Thresholds]
    A[Authority Model]
    R[Risk Register]
  end

  subgraph S[SAFETY AND GUARDRAILS]
    G1[Access Control]
    G2[Real-Time Classifiers]
    G3[Async Monitoring]
    G4[Lock Autonomy and SRR]
  end

  subgraph E[EXECUTION PLANE]
    O[Orchestrator]
    AG[Agents]
    T[Tools and Workflows]
  end

  subgraph D[DATA PLANE]
    TEL[Telemetry]
    PROV[Provenance]
    EVAL[Evaluations]
    INC[Incident Pipeline]
  end

  subgraph L[LEARNING PLANE]
    EP[Episodic Memory]
    SEM[Semantic Memory]
    PROC[Procedural Memory]
    NORM[Normative Memory]
  end

  C --> S
  C --> E
  E --> D
  D --> L
  L --> E
  D --> C
  S --> E
```

---

## 2. Knowledge Lifecycle

```mermaid
flowchart TB
  CAP[Capture]
  NORM[Normalize]
  CLASS[Classify]
  VALID[Validate]
  STORE[Store]
  INDEX[Index]
  RETRIEVE[Retrieve]
  APPLY[Apply]
  EVAL[Evaluate]
  RETIRE[Retire or Archive]
  REJECT[Reject or Quarantine]

  CAP --> NORM --> CLASS --> VALID
  VALID -->|Conformant| STORE --> INDEX --> RETRIEVE --> APPLY --> EVAL
  VALID -->|Non-conformant| REJECT
  EVAL --> STORE
  EVAL --> RETIRE
```

---

## 3. Capability Threshold Escalation

```mermaid
flowchart TD
  MON[Continuous Monitoring]
  TH{Threshold crossed?}
  T1[T1 - Elevated]
  T2[T2 - Controlled Deployment Gate]
  T3[T3 - Lock Autonomy]
  MIT{Mitigation sufficient?}
  RES[Resume or Promote]
  HALT[SRR and Final Arbiter Review]

  MON --> TH
  TH -->|No| MON
  TH -->|T1| T1 --> MIT
  TH -->|T2| T2 --> MIT
  TH -->|T3| T3 --> HALT
  MIT -->|Yes| RES --> MON
  MIT -->|No| T2
```

---

## 4. PDCA Governance Cycle

```mermaid
flowchart LR
  P[Plan]
  D[Do]
  C[Check]
  A[Act]
  R{Criteria met?}

  P --> D --> C --> A --> R
  R -->|Yes| P
  R -->|No| P
```

---

## 5. Governance Rhythm Integration

```mermaid
flowchart LR
  OODA[OODA - operational]
  PDCA[PDCA - managed change]
  RL[Policy iteration - bounded learning]
  REVIEW[Quarterly codex review]

  OODA --> PDCA
  OODA --> RL
  PDCA --> OODA
  RL --> PDCA
  PDCA --> REVIEW
  RL --> REVIEW
  REVIEW --> OODA
```

---

© 2026 Activ8 Automation Intelligence, LLC · All Rights Reserved · Build Document - Confidential & Internal
