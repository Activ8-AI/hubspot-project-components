#!/usr/bin/env node
// managed-by: activ8-ai-context-pack | pack-version: 1.1.0
// source-sha: a0d4785

import { existsSync, readFileSync } from "node:fs";
import { safePersistActionReceipt } from "./lib/action-persistence.mjs";

const startedAtMs = Date.now();

const result = safePersistActionReceipt({
  actionId: "action-persistence-self-check",
  actionClass: "ci_assertion",
  entrypoint: "scripts/action-persistence-self-check.mjs",
  status: "success",
  startedAtMs,
  finishedAtMs: Date.now(),
  evidence: { assertion: "artifact paths exist" },
});

if (!result) {
  console.error("action-persistence-self-check: failed to write receipt");
  process.exit(1);
}

const checks = [
  result.persistence.timestamped_path,
  result.persistence.latest_path,
  result.persistence.ledger_path,
];

const missing = checks.filter((filePath) => !existsSync(filePath));
if (missing.length > 0) {
  console.error(`action-persistence-self-check: missing artifacts: ${missing.join(", ")}`);
  process.exit(1);
}

const latest = JSON.parse(readFileSync(result.persistence.latest_path, "utf-8"));
if (latest.action_id !== "action-persistence-self-check") {
  console.error("action-persistence-self-check: latest receipt action_id mismatch");
  process.exit(1);
}

process.stdout.write(
  `${JSON.stringify(
    {
      ok: true,
      action_id: result.action_id,
      timestamped_path: result.persistence.timestamped_path,
      latest_path: result.persistence.latest_path,
      ledger_path: result.persistence.ledger_path,
    },
    null,
    2
  )}\n`
);
