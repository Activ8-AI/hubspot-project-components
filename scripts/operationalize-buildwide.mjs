#!/usr/bin/env node
// managed-by: activ8-ai-context-pack | pack-version: 1.1.0
// source-sha: a0d4785

import { mkdirSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { safePersistActionReceipt } from "./lib/action-persistence.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..");
const OUTPUT_DIR = join(REPO_ROOT, "artifacts", "build-operationalization");
const PROMPT_LIBRARY_DATABASE_ID =
  process.env.NOTION_PROMPT_LIBRARY_DATABASE_ID
  || process.env.PROMPT_LIBRARY_DATABASE_ID
  || "1ed5dd73-706e-8060-9175-cddeecb007a8";

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const withSync = args.has("--with-sync");
const startedAtMs = Date.now();

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

function runScript(relativePath, extraArgs = []) {
  const result = spawnSync(process.execPath, [join(REPO_ROOT, relativePath), ...extraArgs], {
    cwd: REPO_ROOT,
    encoding: "utf-8",
    env: process.env,
  });

  return {
    command: `node ${relativePath}${extraArgs.length ? ` ${extraArgs.join(" ")}` : ""}`,
    ok: result.status === 0,
    stdout: (result.stdout || "").trim(),
    stderr: (result.stderr || "").trim(),
  };
}

async function verifyPromptRow() {
  if (!withSync || !process.env.NOTION_API_TOKEN) {
    return {
      name: "prompt-library-verify",
      ok: !withSync,
      skipped: !withSync || !process.env.NOTION_API_TOKEN,
      detail: !withSync
        ? "verification skipped"
        : "NOTION_API_TOKEN missing for prompt library verification",
    };
  }

  const response = await fetch("https://api.notion.com/v1/search", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NOTION_API_TOKEN}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
    body: JSON.stringify({
      query: "Obvious-Answer Question Elimination Rule",
      filter: {
        value: "page",
        property: "object",
      },
    }),
  });

  if (!response.ok) {
    return {
      name: "prompt-library-verify",
      ok: false,
      skipped: false,
      detail: `Notion search failed (${response.status})`,
    };
  }

  const payload = await response.json();
  const match = (payload.results || []).find((result) =>
    result.parent?.database_id === PROMPT_LIBRARY_DATABASE_ID ||
    result.url?.includes(PROMPT_LIBRARY_DATABASE_ID.replace(/-/g, ""))
  );

  return {
    name: "prompt-library-verify",
    ok: Boolean(match),
    skipped: false,
    detail: match ? "required rule present in prompt library" : "required rule missing from prompt library",
  };
}

async function main() {
  const steps = [
    runScript("scripts/build-operationalization-check.mjs"),
    runScript("scripts/action-persistence-self-check.mjs"),
    await verifyPromptRow(),
  ];

  if (withSync && !dryRun) {
    steps.push(runScript("scripts/sync-context-pack.mjs", ["--target", ".", "--strict"]));
    steps.push(runScript("scripts/sync-mcp-connections.mjs"));
    steps.push(
      runScript("scripts/sync-agent-instructions.mjs", [
        "--fix",
        "--push-notion",
        "--emit-notion",
      ])
    );
  } else {
    steps.push({
      name: "context-pack-self-sync",
      ok: true,
      skipped: true,
      detail: dryRun ? "auto-update skipped in dry-run mode" : "auto-update requires --with-sync",
    });
    steps.push({
      name: "agent-instruction-auto-sync",
      ok: true,
      skipped: true,
      detail: dryRun ? "auto-update skipped in dry-run mode" : "auto-update requires --with-sync",
    });
    steps.push({
      name: "mcp-surface-auto-sync",
      ok: true,
      skipped: true,
      detail: dryRun ? "auto-update skipped in dry-run mode" : "auto-update requires --with-sync",
    });
  }

  const blockers = steps.filter((step) => !step.ok && !step.skipped);
  const status = blockers.length === 0 ? "GREEN" : "RED";
  const finishedAtMs = Date.now();
  const ts = timestampCt();

  mkdirSync(OUTPUT_DIR, { recursive: true });
  const payload = {
    schema_version: "managed_repo_operationalize_buildwide_v1",
    status,
    timestamp_ct: ts,
    generated_at_ct: labelCt(),
    mode: {
      dry_run: dryRun,
      with_sync: withSync,
    },
    steps,
  };

  const jsonPath = join(OUTPUT_DIR, `${ts}__repo_operationalization.json`);
  const mdPath = join(OUTPUT_DIR, `${ts}__repo_operationalization.md`);
  writeFileSync(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf-8");
  writeFileSync(
    mdPath,
    `# Repo Operationalization\n\n- Status: ${status}\n- Generated: ${payload.generated_at_ct}\n- Steps: ${steps.length}\n`,
    "utf-8"
  );

  safePersistActionReceipt({
    repoRoot: REPO_ROOT,
    actionId: "managed-repo-operationalize-buildwide",
    actionClass: "operationalization",
    entrypoint: "scripts/operationalize-buildwide.mjs",
    status: status === "GREEN" ? "success" : "failure",
    startedAtMs,
    finishedAtMs,
    evidence: {
      status,
      steps: steps.map((step) => ({ name: step.name || step.command, ok: step.ok, skipped: step.skipped || false })),
    },
    artifacts: {
      json: jsonPath,
      markdown: mdPath,
    },
  });

  process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
  if (status !== "GREEN") {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error.message || String(error));
  process.exit(1);
});
