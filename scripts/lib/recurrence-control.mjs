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

function latestPathFor(latestDir, recurrenceId) {
  return join(latestDir, `latest__${sanitizeSegment(recurrenceId)}.json`);
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

export function persistRecurrenceRecord({
  repoRoot = process.cwd(),
  actionId,
  requestId = null,
  startedAtMs = Date.now(),
  finishedAtMs = Date.now(),
  evidence = {},
  artifacts = {},
  metadata = {},
  ...recurrence
}) {
  const recurrenceId = recurrence.recurrence_id || recurrence.recurrenceId || actionId || "unknown";
  const baseDir = join(baseDirFor(repoRoot), "recurrence-control");
  const receiptsDir = join(baseDir, "receipts", sanitizeSegment(recurrenceId));
  const latestDir = join(baseDir, "latest");
  const ledgerDir = join(baseDir, "ledger");
  ensureDir(receiptsDir);
  ensureDir(latestDir);
  ensureDir(ledgerDir);

  const ts = timestampCt();
  const day = dateCt();
  const finishedAt = new Date(finishedAtMs).toISOString();
  const startedAt = new Date(startedAtMs).toISOString();
  const status = recurrence.status || recurrence.recurrence_status || "recorded";
  const latestPath = latestPathFor(latestDir, recurrenceId);
  const previousLatest = maybeReadJson(latestPath);

  const receipt = {
    schema_version: "recurrence_control_v1",
    recurrence_id: recurrenceId,
    action_id: actionId || null,
    request_id: requestId,
    status,
    timestamp_ct: ts,
    generated_at_ct: labelCt(),
    generated_at_utc: finishedAt,
    started_at_utc: startedAt,
    finished_at_utc: finishedAt,
    duration_ms: Math.max(0, finishedAtMs - startedAtMs),
    recurrence,
    evidence,
    artifacts,
    metadata,
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
  const ledgerPath = join(ledgerDir, `${day}.jsonl`);

  writeFileSync(timestampedPath, `${JSON.stringify(receipt, null, 2)}\n`, "utf-8");
  writeFileSync(latestPath, `${JSON.stringify(receipt, null, 2)}\n`, "utf-8");
  appendFileSync(ledgerPath, `${JSON.stringify(receipt)}\n`, "utf-8");

  return {
    ...receipt,
    persistence: {
      timestamped_path: timestampedPath,
      latest_path: latestPath,
      ledger_path: ledgerPath,
      previous_latest: previousLatest,
    },
  };
}

export function safePersistRecurrenceRecord(params) {
  try {
    return persistRecurrenceRecord(params);
  } catch (error) {
    console.error(
      `[recurrence-control] failed for ${params?.actionId || "unknown"}: ${
        error?.message || String(error)
      }`
    );
    return null;
  }
}
