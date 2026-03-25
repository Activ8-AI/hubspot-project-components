// managed-by: activ8-ai-context-pack | pack-version: 1.1.0
// source-sha: a0d4785
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { randomUUID } from "node:crypto";
import { join } from "node:path";
import { safePersistRecurrenceRecord } from "./recurrence-control.mjs";

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

function dateCt() {
  const p = nowCtParts();
  return `${p.year}-${p.month}-${p.day}`;
}

function labelCt() {
  const p = nowCtParts();
  return `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}:${p.second} CT`;
}

function sanitizeSegment(value) {
  return (
    String(value || "unknown")
      .trim()
      .replace(/[^A-Za-z0-9._-]+/g, "_")
      .replace(/^_+|_+$/g, "") || "unknown"
  );
}

function baseDirFor(repoRoot) {
  const override = process.env.ACTION_PERSISTENCE_DIR;
  return override || join(repoRoot, "artifacts", "action-persistence");
}

function ensureDir(dir) {
  mkdirSync(dir, { recursive: true });
}

function maybeReadJson(filePath) {
  try {
    return JSON.parse(readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
}

function latestPathFor(latestDir, actionId) {
  return join(latestDir, `latest__${sanitizeSegment(actionId)}.json`);
}

function uniqueReceiptFileName({
  timestampCtValue,
  status,
  requestId,
  finishedAtMs,
  receiptsDir,
}) {
  const suffix = sanitizeSegment(requestId || `${finishedAtMs}-${randomUUID().slice(0, 8)}`);
  const candidate = `${timestampCtValue}__${sanitizeSegment(status)}__${suffix}.json`;
  if (!existsSync(join(receiptsDir, candidate))) {
    return candidate;
  }
  return `${timestampCtValue}__${sanitizeSegment(status)}__${suffix}_${randomUUID().slice(0, 6)}.json`;
}

export function persistActionReceipt({
  repoRoot = process.cwd(),
  actionId,
  actionClass = "execution",
  entrypoint,
  status,
  startedAtMs = Date.now(),
  finishedAtMs = Date.now(),
  requestId,
  evidence = {},
  artifacts = {},
  metadata = {},
  recurrence = null,
  error = null,
}) {
  const baseDir = baseDirFor(repoRoot);
  const receiptsDir = join(baseDir, "receipts", sanitizeSegment(actionId));
  const latestDir = join(baseDir, "latest");
  const ledgerDir = join(baseDir, "ledger");
  ensureDir(receiptsDir);
  ensureDir(latestDir);
  ensureDir(ledgerDir);

  const ts = timestampCt();
  const day = dateCt();
  const finishedAt = new Date(finishedAtMs).toISOString();
  const startedAt = new Date(startedAtMs).toISOString();
  const previousLatest = maybeReadJson(latestPathFor(latestDir, actionId));
  const receipt = {
    schema_version: "action_persistence_v1",
    action_id: actionId,
    action_class: actionClass,
    entrypoint,
    status,
    request_id: requestId || null,
    timestamp_ct: ts,
    generated_at_ct: labelCt(),
    generated_at_utc: finishedAt,
    started_at_utc: startedAt,
    finished_at_utc: finishedAt,
    duration_ms: Math.max(0, finishedAtMs - startedAtMs),
    evidence,
    artifacts,
    metadata,
    recurrence,
    error: error
      ? {
          message: error.message || String(error),
          code: error.code || null,
        }
      : null,
  };

  const timestampedPath = join(
    receiptsDir,
    uniqueReceiptFileName({
      timestampCtValue: ts,
      status,
      requestId,
      finishedAtMs,
      receiptsDir,
    })
  );
  const latestPath = latestPathFor(latestDir, actionId);
  const ledgerPath = join(ledgerDir, `${day}.jsonl`);

  writeFileSync(timestampedPath, `${JSON.stringify(receipt, null, 2)}\n`, "utf-8");
  writeFileSync(latestPath, `${JSON.stringify(receipt, null, 2)}\n`, "utf-8");
  appendFileSync(ledgerPath, `${JSON.stringify(receipt)}\n`, "utf-8");

  const recurrencePersistence = recurrence
    ? safePersistRecurrenceRecord({
        repoRoot,
        ...recurrence,
        actionId,
        requestId: requestId || null,
        startedAtMs,
        finishedAtMs,
        evidence: {
          ...evidence,
          action_receipt_latest_path: latestPath,
        },
        artifacts,
        metadata,
      })?.persistence || null
    : null;

  return {
    ...receipt,
    persistence: {
      timestamped_path: timestampedPath,
      latest_path: latestPath,
      ledger_path: ledgerPath,
      previous_latest: previousLatest,
    },
    recurrence_persistence: recurrencePersistence,
  };
}

export function safePersistActionReceipt(params) {
  try {
    return persistActionReceipt(params);
  } catch (error) {
    console.error(
      `[action-persistence] failed for ${params?.actionId || "unknown"}: ${
        error?.message || String(error)
      }`
    );
    return null;
  }
}
