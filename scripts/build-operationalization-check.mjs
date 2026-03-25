#!/usr/bin/env node
// managed-by: activ8-ai-context-pack | pack-version: 1.2.0
// source-sha: a0d4785

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const OUTPUT_DIR = join(REPO_ROOT, "artifacts", "build-operationalization");

function nowCtParts() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  return Object.fromEntries(parts.map((part) => [part.type, part.value]));
}

function timestampCt() {
  const p = nowCtParts();
  return `${p.year}${p.month}${p.day}_${p.hour}${p.minute}${p.second}_CT`;
}

function labelCt() {
  const p = nowCtParts();
  return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}:${p.second} CT`;
}

function readText(relativePath) {
  try {
    return readFileSync(join(REPO_ROOT, relativePath), "utf-8");
  } catch {
    return null;
  }
}

function hasPackageScript(pkg, name, needle) {
  const value = pkg?.scripts?.[name];
  return typeof value === "string" && value.includes(needle);
}

const requiredFiles = [
  ".github/ai-agent-policy.md",
  ".github/copilot-instructions.md",
  ".github/agents/cursor.md",
  ".github/agents/chatgpt.md",
  ".github/agents/claude-cowork.md",
  ".github/agents/genesis.md",
  ".github/agents/gemini.md",
  "AGENTS.md",
  "CLAUDE.md",
  "docs/AUDIENCE-SURFACE-CONTRACT.md",
  "docs/SOURCES-OF-TRUTH.md",
  "docs/MAOS-GOVERNANCE-CODEX-WHITE-PAPER-v1.md",
  ".github/workflows/build-operationalization.yml",
  "scripts/build-operationalization-check.mjs",
  "scripts/operationalize-buildwide.mjs",
  "scripts/action-persistence-self-check.mjs",
  "scripts/lint-alias-drift.mjs",
  "scripts/query-source-ladder.mjs",
  "scripts/session-boot.mjs",
  "scripts/sync-mcp-connections.mjs",
  "scripts/check-governance-threshold-instrumentation.mjs",
  "scripts/lib/action-persistence.mjs",
  "config/mcp-connections.json",
  "config/governance-thresholds.json",
  "config/provenance-field-registry.json",
  "config/schemas/skill-memory-entry.schema.json",
  "artifacts/codex/meta-mega/MAOS-Governance-Codex-v1.md",
  "artifacts/governance/MAOS-GOVERNANCE-CODEX-POLICY-AS-CODE-CATALOG-v1.md",
  "artifacts/governance/MAOS-GOVERNANCE-CODEX-FLOW-DIAGRAMS-v1.md",
  "artifacts/governance/MAOS-GOVERNANCE-CODEX-ACTION-CHECKLIST-v1.md",
  "artifacts/governance/MAOS-GOVERNANCE-CODEX-ANNOTATED-BIBLIOGRAPHY-v1.md",
  "artifacts/governance/MAOS-THREAT-MODEL-REGISTER-v1.md",
  "artifacts/governance/MAOS-RED-TEAM-EXERCISE-REPORT-v1.md",
  "artifacts/governance/MAOS-KNOWLEDGE-LIFECYCLE-PIPELINE-v1.md",
  "artifacts/governance/MAOS-GOVERNANCE-CALENDAR-v1.md",
  "artifacts/governance/MAOS-ENFORCEMENT-RULE-TEST-SUITE-v1.md",
  "artifacts/governance/shacl/maos-memory-shapes.ttl",
  "artifacts/prompt-library/README.md",
  "artifacts/prompt-library/OBVIOUS-ANSWER-QUESTION-ELIMINATION-RULE.md",
  "artifacts/prompt-library/STOP-RESET-REALIGN-ANTI-AVOIDANCE-PROMPTS.md",
  "artifacts/prompt-library/AGENT-ANNOUNCEMENT-SRR-ANTI-AVOIDANCE-v1.md",
  "artifacts/prompt-library/PRIME-BRIDGE-ACCESS-CONTRACT.md",
  "artifacts/prompt-library/PERSISTENT-LEARNING-SYSTEM-CONTRACT.md",
  "artifacts/prompt-library/AGENTIC-GOVERNANCE-FIVE-PLANE-CONTRACT.md",
  "artifacts/prompt-library/MAOS-NIST-AI-RMF-MAPPING.md",
];

const workflowContent = readText(".github/workflows/build-operationalization.yml") || "";

const blockers = [];
const checks = [];

for (const relativePath of requiredFiles) {
  const ok = existsSync(join(REPO_ROOT, relativePath));
  checks.push({ name: relativePath, ok });
  if (!ok) {
    blockers.push(`Missing required file: ${relativePath}`);
  }
}

let pkg = null;
const hasPackageJson = existsSync(join(REPO_ROOT, "package.json"));
try {
  pkg = JSON.parse(readText("package.json") || "{}");
} catch {
  blockers.push("Invalid package.json");
}

const packageChecks = [
  {
    name: "operationalize:build",
    ok: hasPackageScript(pkg, "operationalize:build", "scripts/build-operationalization-check.mjs"),
  },
  {
    name: "operationalize:repo",
    ok: hasPackageScript(pkg, "operationalize:repo", "scripts/operationalize-buildwide.mjs"),
  },
  {
    name: "action-persistence:check",
    ok: hasPackageScript(pkg, "action-persistence:check", "scripts/action-persistence-self-check.mjs"),
  },
  {
    name: "lint:aliases",
    ok: hasPackageScript(pkg, "lint:aliases", "scripts/lint-alias-drift.mjs"),
  },
  {
    name: "query:source-ladder",
    ok: hasPackageScript(pkg, "query:source-ladder", "scripts/query-source-ladder.mjs"),
  },
  {
    name: "session:boot",
    ok: hasPackageScript(pkg, "session:boot", "scripts/session-boot.mjs"),
  },
  {
    name: "mcp:sync",
    ok: hasPackageScript(pkg, "mcp:sync", "scripts/sync-mcp-connections.mjs"),
  },
  {
    name: "governance:thresholds:check",
    ok: hasPackageScript(pkg, "governance:thresholds:check", "scripts/check-governance-threshold-instrumentation.mjs"),
  },
  {
    name: "context:sync:self",
    ok: hasPackageScript(pkg, "context:sync:self", "scripts/sync-context-pack.mjs --target . --strict"),
  },
  {
    name: "agents:sync:auto",
    ok: hasPackageScript(pkg, "agents:sync:auto", "scripts/sync-agent-instructions.mjs --fix --push-notion --emit-notion"),
  },
];

if (pkg?.scripts?.preflight) {
  packageChecks.push({
    name: "preflight hook",
    ok: hasPackageScript(pkg, "preflight", "npm run operationalize:repo -- --dry-run"),
  });
}

if (pkg?.scripts?.["session:finish"]) {
  packageChecks.push({
    name: "session:finish hook",
    ok: hasPackageScript(pkg, "session:finish", "npm run operationalize:repo -- --with-sync"),
  });
}

for (const check of packageChecks) {
  const effective = hasPackageJson
    ? check
    : { ...check, ok: true, skipped: true };
  checks.push(effective);
  if (hasPackageJson && !check.ok) {
    blockers.push(`Package script missing contract: ${check.name}`);
  }
}

const markerChecks = [
  {
    name: ".github/workflows/build-operationalization.yml self-sync preference",
    ok: workflowContent.includes("NOTION_API_TOKEN") &&
      workflowContent.includes("npm run operationalize:repo -- --with-sync --update-performance") &&
      workflowContent.includes("falling back to dry-run"),
  },
  {
    name: ".github/workflows/build-operationalization.yml governed write-back lane",
    ok: workflowContent.includes("pull-requests: write") &&
      workflowContent.includes("git add -u") &&
      workflowContent.includes("auto/build-operationalization-writeback") &&
      workflowContent.includes("gh pr create") &&
      workflowContent.includes("github.event_name != 'pull_request'"),
  },
  {
    name: "docs/AUDIENCE-SURFACE-CONTRACT.md audience marker",
    ok: (readText("docs/AUDIENCE-SURFACE-CONTRACT.md") || "").includes("Audience Contract"),
  },
  {
    name: "docs/AUDIENCE-SURFACE-CONTRACT.md trace marker",
    ok: (readText("docs/AUDIENCE-SURFACE-CONTRACT.md") || "").includes("Trace Rule"),
  },
  {
    name: "docs/SOURCES-OF-TRUTH.md contract marker",
    ok: (readText("docs/SOURCES-OF-TRUTH.md") || "").includes("docs/AUDIENCE-SURFACE-CONTRACT.md"),
  },
  {
    name: "docs/SOURCES-OF-TRUTH.md query ladder marker",
    ok: (readText("docs/SOURCES-OF-TRUTH.md") || "").includes("## Query Ladder"),
  },
  {
    name: "docs/SOURCES-OF-TRUTH.md automatic bootstrap marker",
    ok: (readText("docs/SOURCES-OF-TRUTH.md") || "").includes("Automatic session/bootstrap binding"),
  },
  {
    name: ".github/ai-agent-policy.md obvious-answer marker",
    ok: (readText(".github/ai-agent-policy.md") || "").includes("Obvious-Answer Question Elimination Rule"),
  },
  {
    name: ".github/ai-agent-policy.md canonical control-plane marker",
    ok: (readText(".github/ai-agent-policy.md") || "").includes("Canonical Control-Plane Order"),
  },
  {
    name: ".github/ai-agent-policy.md seek-first planning marker",
    ok: (readText(".github/ai-agent-policy.md") || "").includes("Seek-First Planning Gate"),
  },
  {
    name: ".github/ai-agent-policy.md prompt-library adaptation marker",
    ok: (readText(".github/ai-agent-policy.md") || "").includes("Prompt Library Adaptation"),
  },
  {
    name: ".github/ai-agent-policy.md audience contract marker",
    ok: (readText(".github/ai-agent-policy.md") || "").includes("Audience + Surface Contract"),
  },
  {
    name: ".github/ai-agent-policy.md operationalize marker",
    ok: (readText(".github/ai-agent-policy.md") || "").includes("operationalize:repo"),
  },
  {
    name: ".github/ai-agent-policy.md bootstrap marker",
    ok: (readText(".github/ai-agent-policy.md") || "").includes("Automatic Source Bootstrap"),
  },
  {
    name: ".github/ai-agent-policy.md prime bridge access marker",
    ok: (readText(".github/ai-agent-policy.md") || "").includes("Prime Bridge Access Contract"),
  },
  {
    name: ".github/ai-agent-policy.md runtime bootstrap gate marker",
    ok: (readText(".github/ai-agent-policy.md") || "").includes("Runtime Session Bootstrap Gate"),
  },
  {
    name: ".github/ai-agent-policy.md persistent learning marker",
    ok: (readText(".github/ai-agent-policy.md") || "").includes("Persistent Learning System Contract") &&
      (readText(".github/ai-agent-policy.md") || "").includes("stored, indexed, and reused automatically"),
  },
  {
    name: ".github/ai-agent-policy.md five-plane governance marker",
    ok: (readText(".github/ai-agent-policy.md") || "").includes("Agentic Governance Five-Plane Contract") &&
      (readText(".github/ai-agent-policy.md") || "").includes("multi-plane control problem"),
  },
  {
    name: ".github/ai-agent-policy.md NIST mapping marker",
    ok: (readText(".github/ai-agent-policy.md") || "").includes("NIST AI RMF Mapping") &&
      (readText(".github/ai-agent-policy.md") || "").includes("`GOVERN` -> control plane") &&
      (readText(".github/ai-agent-policy.md") || "").includes("`MANAGE` -> response, override, rollback, deactivation, and continual improvement"),
  },
  {
    name: "config/governance-thresholds.json T1/T2 markers",
    ok: (readText("config/governance-thresholds.json") || "").includes("\"t1_leading_indicators\"") &&
      (readText("config/governance-thresholds.json") || "").includes("\"t2_thresholds\"") &&
      (readText("config/governance-thresholds.json") || "").includes("\"do_not_deploy_until_active_and_tested\": true"),
  },
  {
    name: "config/provenance-field-registry.json provenance markers",
    ok: (readText("config/provenance-field-registry.json") || "").includes("\"source_ref\"") &&
      (readText("config/provenance-field-registry.json") || "").includes("\"validation_metadata\"") &&
      (readText("config/provenance-field-registry.json") || "").includes("\"review_state\""),
  },
  {
    name: "config/schemas/skill-memory-entry.schema.json schema markers",
    ok: (readText("config/schemas/skill-memory-entry.schema.json") || "").includes("\"title\": \"MAOS Skill Memory Entry\"") &&
      (readText("config/schemas/skill-memory-entry.schema.json") || "").includes("\"memory_type\": { \"const\": \"procedural\" }") &&
      (readText("config/schemas/skill-memory-entry.schema.json") || "").includes("\"review_state\": { \"enum\": [\"quarantine\", \"approved\", \"rejected\"] }"),
  },
  {
    name: "scripts/check-governance-threshold-instrumentation.mjs threshold contract markers",
    ok: (readText("scripts/check-governance-threshold-instrumentation.mjs") || "").includes("maos_governance_threshold_instrumentation_check_v1") &&
      (readText("scripts/check-governance-threshold-instrumentation.mjs") || "").includes("telemetry evaluator present") &&
      (readText("scripts/check-governance-threshold-instrumentation.mjs") || "").includes("cloud build preflight runs threshold check"),
  },
  {
    name: "artifacts/governance/MAOS-THREAT-MODEL-REGISTER-v1.md threat markers",
    ok: (readText("artifacts/governance/MAOS-THREAT-MODEL-REGISTER-v1.md") || "").includes("MITRE ATLAS") &&
      (readText("artifacts/governance/MAOS-THREAT-MODEL-REGISTER-v1.md") || "").includes("OWASP LLM") &&
      (readText("artifacts/governance/MAOS-THREAT-MODEL-REGISTER-v1.md") || "").includes("Prompt ingress and tool prompts"),
  },
  {
    name: "artifacts/governance/MAOS-RED-TEAM-EXERCISE-REPORT-v1.md red-team markers",
    ok: (readText("artifacts/governance/MAOS-RED-TEAM-EXERCISE-REPORT-v1.md") || "").includes("Prompt injection") &&
      (readText("artifacts/governance/MAOS-RED-TEAM-EXERCISE-REPORT-v1.md") || "").includes("Memory poisoning") &&
      (readText("artifacts/governance/MAOS-RED-TEAM-EXERCISE-REPORT-v1.md") || "").includes("Threshold instrumentation must block production promotion"),
  },
  {
    name: "artifacts/governance/MAOS-KNOWLEDGE-LIFECYCLE-PIPELINE-v1.md lifecycle markers",
    ok: (readText("artifacts/governance/MAOS-KNOWLEDGE-LIFECYCLE-PIPELINE-v1.md") || "").includes("## Lifecycle") &&
      (readText("artifacts/governance/MAOS-KNOWLEDGE-LIFECYCLE-PIPELINE-v1.md") || "").includes("Capture: receive signal") &&
      (readText("artifacts/governance/MAOS-KNOWLEDGE-LIFECYCLE-PIPELINE-v1.md") || "").includes("## Retention Schedule"),
  },
  {
    name: "artifacts/governance/MAOS-GOVERNANCE-CALENDAR-v1.md cadence markers",
    ok: (readText("artifacts/governance/MAOS-GOVERNANCE-CALENDAR-v1.md") || "").includes("OODA operational review") &&
      (readText("artifacts/governance/MAOS-GOVERNANCE-CALENDAR-v1.md") || "").includes("Codex quarterly review") &&
      (readText("artifacts/governance/MAOS-GOVERNANCE-CALENDAR-v1.md") || "").includes("Moses Lock-In"),
  },
  {
    name: "artifacts/governance/MAOS-ENFORCEMENT-RULE-TEST-SUITE-v1.md rule markers",
    ok: (readText("artifacts/governance/MAOS-ENFORCEMENT-RULE-TEST-SUITE-v1.md") || "").includes("Capability Gating") &&
      (readText("artifacts/governance/MAOS-ENFORCEMENT-RULE-TEST-SUITE-v1.md") || "").includes("Provenance Mandate") &&
      (readText("artifacts/governance/MAOS-ENFORCEMENT-RULE-TEST-SUITE-v1.md") || "").includes("Drift Alert Response"),
  },
  {
    name: "artifacts/governance/shacl/maos-memory-shapes.ttl SHACL markers",
    ok: (readText("artifacts/governance/shacl/maos-memory-shapes.ttl") || "").includes("maos:ProvenanceShape") &&
      (readText("artifacts/governance/shacl/maos-memory-shapes.ttl") || "").includes("maos:ProceduralSkillShape") &&
      (readText("artifacts/governance/shacl/maos-memory-shapes.ttl") || "").includes("maos:NormativeMemoryShape"),
  },
  {
    name: "AGENTS.md obvious-answer marker",
    ok: (readText("AGENTS.md") || "").includes("Obvious-Answer Question Elimination Rule"),
  },
  {
    name: "AGENTS.md seek-first planning marker",
    ok: (readText("AGENTS.md") || "").includes("Seek-First Planning Gate"),
  },
  {
    name: "AGENTS.md audience contract marker",
    ok: (readText("AGENTS.md") || "").includes("docs/AUDIENCE-SURFACE-CONTRACT.md"),
  },
  {
    name: "AGENTS.md bootstrap marker",
    ok: (readText("AGENTS.md") || "").includes("Automatic Source Bootstrap"),
  },
  {
    name: "AGENTS.md runtime bootstrap gate marker",
    ok: (readText("AGENTS.md") || "").includes("Runtime Session Bootstrap Gate"),
  },
  {
    name: "AGENTS.md persistent learning marker",
    ok: (readText("AGENTS.md") || "").includes("Persistent Learning System Contract") &&
      (readText("AGENTS.md") || "").includes("stored, indexed, and reused automatically"),
  },
  {
    name: "AGENTS.md five-plane governance marker",
    ok: (readText("AGENTS.md") || "").includes("Agentic Governance Five-Plane Contract") &&
      (readText("AGENTS.md") || "").includes("multi-plane control problem"),
  },
  {
    name: "AGENTS.md NIST mapping marker",
    ok: (readText("AGENTS.md") || "").includes("NIST AI RMF Mapping") &&
      (readText("AGENTS.md") || "").includes("`GOVERN` -> control plane") &&
      (readText("AGENTS.md") || "").includes("`MANAGE` -> response, override, rollback, deactivation, and continual improvement"),
  },
  {
    name: ".github/agents/cursor.md obvious-answer marker",
    ok: (readText(".github/agents/cursor.md") || "").includes("Obvious-Answer Question Elimination Rule"),
  },
  {
    name: ".github/agents/cursor.md seek-first planning marker",
    ok: (readText(".github/agents/cursor.md") || "").includes("Seek-First Planning Gate"),
  },
  {
    name: ".github/agents/cursor.md audience contract marker",
    ok: (readText(".github/agents/cursor.md") || "").includes("docs/AUDIENCE-SURFACE-CONTRACT.md"),
  },
  {
    name: ".github/agents/cursor.md bootstrap marker",
    ok: (readText(".github/agents/cursor.md") || "").includes("Automatic Source Bootstrap"),
  },
  {
    name: ".github/agents/cursor.md runtime bootstrap gate marker",
    ok: (readText(".github/agents/cursor.md") || "").includes("Runtime Session Bootstrap Gate"),
  },
  {
    name: ".github/agents/cursor.md persistent learning marker",
    ok: (readText(".github/agents/cursor.md") || "").includes("Persistent Learning System Contract") &&
      (readText(".github/agents/cursor.md") || "").includes("stored, indexed, and reused automatically"),
  },
  {
    name: ".github/agents/cursor.md five-plane governance marker",
    ok: (readText(".github/agents/cursor.md") || "").includes("Agentic Governance Five-Plane Contract") &&
      (readText(".github/agents/cursor.md") || "").includes("multi-plane control problem"),
  },
  {
    name: ".github/agents/cursor.md NIST mapping marker",
    ok: (readText(".github/agents/cursor.md") || "").includes("NIST AI RMF Mapping") &&
      (readText(".github/agents/cursor.md") || "").includes("`GOVERN` -> control plane") &&
      (readText(".github/agents/cursor.md") || "").includes("`MANAGE` -> response, override, rollback, deactivation, and continual improvement"),
  },
  {
    name: ".github/copilot-instructions.md runtime bootstrap gate marker",
    ok: (readText(".github/copilot-instructions.md") || "").includes("Runtime Session Bootstrap Gate"),
  },
  {
    name: ".github/copilot-instructions.md persistent learning marker",
    ok: (readText(".github/copilot-instructions.md") || "").includes("Persistent Learning System Contract") &&
      (readText(".github/copilot-instructions.md") || "").includes("stored, indexed, and reused automatically"),
  },
  {
    name: ".github/copilot-instructions.md five-plane governance marker",
    ok: (readText(".github/copilot-instructions.md") || "").includes("Agentic Governance Five-Plane Contract") &&
      (readText(".github/copilot-instructions.md") || "").includes("multi-plane control problem"),
  },
  {
    name: ".github/copilot-instructions.md NIST mapping marker",
    ok: (readText(".github/copilot-instructions.md") || "").includes("NIST AI RMF Mapping") &&
      (readText(".github/copilot-instructions.md") || "").includes("`GOVERN` -> control plane") &&
      (readText(".github/copilot-instructions.md") || "").includes("`MANAGE` -> response, override, rollback, deactivation, and continual improvement"),
  },
  {
    name: ".github/agents/chatgpt.md persistent learning marker",
    ok: (readText(".github/agents/chatgpt.md") || "").includes("Persistent Learning System Contract") &&
      (readText(".github/agents/chatgpt.md") || "").includes("stored, indexed, and reused automatically"),
  },
  {
    name: ".github/agents/chatgpt.md five-plane governance marker",
    ok: (readText(".github/agents/chatgpt.md") || "").includes("Agentic Governance Five-Plane Contract") &&
      (readText(".github/agents/chatgpt.md") || "").includes("multi-plane control problem"),
  },
  {
    name: ".github/agents/chatgpt.md NIST mapping marker",
    ok: (readText(".github/agents/chatgpt.md") || "").includes("NIST AI RMF Mapping") &&
      (readText(".github/agents/chatgpt.md") || "").includes("`GOVERN` -> control plane") &&
      (readText(".github/agents/chatgpt.md") || "").includes("`MANAGE` -> response, override, rollback, deactivation, and continual improvement"),
  },
  {
    name: ".github/agents/claude-cowork.md persistent learning marker",
    ok: (readText(".github/agents/claude-cowork.md") || "").includes("Persistent Learning System Contract") &&
      (readText(".github/agents/claude-cowork.md") || "").includes("stored, indexed, and reused automatically"),
  },
  {
    name: ".github/agents/claude-cowork.md five-plane governance marker",
    ok: (readText(".github/agents/claude-cowork.md") || "").includes("Agentic Governance Five-Plane Contract") &&
      (readText(".github/agents/claude-cowork.md") || "").includes("multi-plane control problem"),
  },
  {
    name: ".github/agents/claude-cowork.md NIST mapping marker",
    ok: (readText(".github/agents/claude-cowork.md") || "").includes("NIST AI RMF Mapping") &&
      (readText(".github/agents/claude-cowork.md") || "").includes("`GOVERN` -> control plane") &&
      (readText(".github/agents/claude-cowork.md") || "").includes("`MANAGE` -> response, override, rollback, deactivation, and continual improvement"),
  },
  {
    name: ".github/agents/genesis.md persistent learning marker",
    ok: (readText(".github/agents/genesis.md") || "").includes("Persistent Learning System Contract") &&
      (readText(".github/agents/genesis.md") || "").includes("stored, indexed, and reused automatically"),
  },
  {
    name: ".github/agents/genesis.md five-plane governance marker",
    ok: (readText(".github/agents/genesis.md") || "").includes("Agentic Governance Five-Plane Contract") &&
      (readText(".github/agents/genesis.md") || "").includes("multi-plane control problem"),
  },
  {
    name: ".github/agents/genesis.md NIST mapping marker",
    ok: (readText(".github/agents/genesis.md") || "").includes("NIST AI RMF Mapping") &&
      (readText(".github/agents/genesis.md") || "").includes("`GOVERN` -> control plane") &&
      (readText(".github/agents/genesis.md") || "").includes("`MANAGE` -> response, override, rollback, deactivation, and continual improvement"),
  },
  {
    name: ".github/agents/gemini.md persistent learning marker",
    ok: (readText(".github/agents/gemini.md") || "").includes("Persistent Learning System Contract") &&
      (readText(".github/agents/gemini.md") || "").includes("stored, indexed, and reused automatically"),
  },
  {
    name: ".github/agents/gemini.md five-plane governance marker",
    ok: (readText(".github/agents/gemini.md") || "").includes("Agentic Governance Five-Plane Contract") &&
      (readText(".github/agents/gemini.md") || "").includes("multi-plane control problem"),
  },
  {
    name: ".github/agents/gemini.md NIST mapping marker",
    ok: (readText(".github/agents/gemini.md") || "").includes("NIST AI RMF Mapping") &&
      (readText(".github/agents/gemini.md") || "").includes("`GOVERN` -> control plane") &&
      (readText(".github/agents/gemini.md") || "").includes("`MANAGE` -> response, override, rollback, deactivation, and continual improvement"),
  },
  {
    name: "CLAUDE.md runtime bootstrap gate marker",
    ok: (readText("CLAUDE.md") || "").includes("Runtime Session Bootstrap Gate"),
  },
  {
    name: "CLAUDE.md persistent learning marker",
    ok: (readText("CLAUDE.md") || "").includes("Persistent Learning System Contract") &&
      (readText("CLAUDE.md") || "").includes("stored, indexed, and reused automatically"),
  },
  {
    name: "CLAUDE.md five-plane governance marker",
    ok: (readText("CLAUDE.md") || "").includes("Agentic Governance Five-Plane Contract") &&
      (readText("CLAUDE.md") || "").includes("multi-plane control problem"),
  },
  {
    name: "CLAUDE.md NIST mapping marker",
    ok: (readText("CLAUDE.md") || "").includes("NIST AI RMF Mapping") &&
      (readText("CLAUDE.md") || "").includes("`GOVERN` -> control plane") &&
      (readText("CLAUDE.md") || "").includes("`MANAGE` -> response, override, rollback, deactivation, and continual improvement"),
  },
  {
    name: "scripts/session-boot.mjs query ladder binding",
    ok: (readText("scripts/session-boot.mjs") || "").includes("runSourceQueryLadder") &&
      (readText("scripts/session-boot.mjs") || "").includes("## Source Bootstrap"),
  },
  {
    name: "scripts/query-source-ladder.mjs receipt ledger marker",
    ok: (readText("scripts/query-source-ladder.mjs") || "").includes("query-receipts.jsonl") &&
      (readText("scripts/query-source-ladder.mjs") || "").includes("runSourceQueryLadder"),
  },
  {
    name: "config/mcp-connections.json prime bridge surface marker",
    ok: (readText("config/mcp-connections.json") || "").includes("PrimeBridge") &&
      (readText("config/mcp-connections.json") || "").includes("mcp:sync"),
  },
  {
    name: "scripts/sync-mcp-connections.mjs SSOT marker",
    ok: (readText("scripts/sync-mcp-connections.mjs") || "").includes("config/mcp-connections.json") &&
      (readText("scripts/sync-mcp-connections.mjs") || "").includes("surface_paths"),
  },
  {
    name: "src/router.ts session bootstrap enforcement marker",
    ok: !existsSync(join(REPO_ROOT, "src", "router.ts")) ||
      ((readText("src/router.ts") || "").includes("enforceSessionBootstrapGate") &&
      (readText("src/router.ts") || "").includes("SESSION_INIT_REQUIRED")),
  },
];

const persistentScopeMarkers = [
  "Seek First to Understand",
  "Verify what exists in Notion",
  "Search for existing artifacts",
  "Build on established work",
  "Create new only when necessary",
  "Fail closed on deviation",
];

for (const [filePath, label] of [
  [".github/ai-agent-policy.md", "master policy"],
  [".github/copilot-instructions.md", "copilot"],
  ["AGENTS.md", "codex"],
  ["CLAUDE.md", "claude"],
  [".github/agents/cursor.md", "cursor"],
  [".github/agents/chatgpt.md", "chatgpt"],
  [".github/agents/claude-cowork.md", "claude-cowork"],
  [".github/agents/genesis.md", "genesis"],
  [".github/agents/gemini.md", "gemini"],
]) {
  const content = readText(filePath) || "";
  for (const marker of persistentScopeMarkers) {
    markerChecks.push({
      name: `${label} persistent scope marker ${marker}`,
      ok: content.includes(marker),
    });
  }
}

for (const check of markerChecks) {
  checks.push(check);
  if (!check.ok) {
    blockers.push(`Missing required marker: ${check.name}`);
  }
}

mkdirSync(OUTPUT_DIR, { recursive: true });
const ts = timestampCt();
const status = blockers.length === 0 ? "GREEN" : "RED";
const payload = {
  schema_version: "managed_repo_build_operationalization_v1",
  status,
  timestamp_ct: ts,
  generated_at_ct: labelCt(),
  blockers,
  checks,
};

const jsonPath = join(OUTPUT_DIR, `${ts}__build_operationalization.json`);
const mdPath = join(OUTPUT_DIR, `${ts}__build_operationalization.md`);
writeFileSync(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf-8");
writeFileSync(
  mdPath,
  `# Build Operationalization\n\n- Status: ${status}\n- Generated: ${payload.generated_at_ct}\n- Blockers: ${blockers.length}\n`,
  "utf-8"
);

process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
if (status !== "GREEN") {
  process.exit(1);
}
