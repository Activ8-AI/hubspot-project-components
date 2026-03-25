// managed-by: activ8-ai-context-pack | pack-version: 1.2.1
// source-sha: a0d4785
import { readFile } from "node:fs/promises";
import path from "node:path";

const repoRoot = process.cwd();

async function readJson(relativePath) {
  const filePath = path.join(repoRoot, relativePath);
  const raw = await readFile(filePath, "utf-8");
  return JSON.parse(raw);
}

async function readText(relativePath) {
  const filePath = path.join(repoRoot, relativePath);
  return readFile(filePath, "utf-8");
}

const thresholdConfig = await readJson("config/governance-thresholds.json");
const telemetrySource = await readText("src/prime-bridge/telemetry.ts");
const telemetryTypes = await readText("src/prime-bridge/types.ts");
const cloudBuild = await readText("cloudbuild.mcp.yaml");
const telemetryTest = await readText("test/prime-bridge/telemetry.test.ts");

const checks = [
  {
    name: "threshold config present",
    ok:
      Array.isArray(thresholdConfig.t1_leading_indicators) &&
      thresholdConfig.t1_leading_indicators.length >= 4 &&
      Array.isArray(thresholdConfig.t2_thresholds) &&
      thresholdConfig.t2_thresholds.length >= 4,
  },
  {
    name: "telemetry evaluator present",
    ok: telemetrySource.includes("evaluateGovernanceThresholds") &&
      telemetrySource.includes("leading_indicator_correction_loop_ratio") &&
      telemetrySource.includes("t2_breaches.push"),
  },
  {
    name: "telemetry types expose threshold fields",
    ok: telemetryTypes.includes("threshold_evaluations") &&
      telemetryTypes.includes("t1_alerts_total") &&
      telemetryTypes.includes("thresholds?:"),
  },
  {
    name: "cloud build preflight runs threshold check",
    ok: cloudBuild.includes("npm run governance:thresholds:check"),
  },
  {
    name: "telemetry tests cover threshold instrumentation",
    ok: telemetryTest.includes("threshold") &&
      telemetryTest.includes("t1_alerts") &&
      telemetryTest.includes("t2_breaches"),
  },
];

const blockers = checks.filter((check) => !check.ok).map((check) => check.name);
const payload = {
  success: blockers.length === 0,
  schema_version: "maos_governance_threshold_instrumentation_check_v1",
  checks,
  blockers,
};

console.log(JSON.stringify(payload, null, 2));
if (blockers.length > 0) {
  process.exit(1);
}
