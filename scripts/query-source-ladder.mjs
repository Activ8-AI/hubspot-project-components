#!/usr/bin/env node
// managed-by: activ8-ai-context-pack | pack-version: 1.2.0
// source-sha: a0d4785

import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const HOME = os.homedir();
const DEFAULT_LIMIT = 5;
const DEFAULT_TTL_MINUTES = 60;
const MAX_BYTES = 512 * 1024;
const TEXT_EXTENSIONS = new Set([".md", ".mdc", ".txt", ".json", ".yaml", ".yml", ".csv", ".html"]);
const ANCHOR_FILES = [
  "docs/SOURCES-OF-TRUTH.md",
  "docs/AUDIENCE-SURFACE-CONTRACT.md",
  ".github/ai-agent-policy.md",
  ".github/copilot-instructions.md",
  ".github/agents/cursor.md",
  ".github/agents/chatgpt.md",
  ".github/agents/claude-cowork.md",
  ".github/agents/genesis.md",
  ".github/agents/gemini.md",
  "AGENTS.md",
  "CLAUDE.md",
  "artifacts/prompt-library/README.md",
  "memory/MEMORY.md",
  "memory/key-lessons.md",
];
const REPO_MIRROR_DIRS = ["docs", ".github", "artifacts/prompt-library", "memory", "scripts"];
const DOWNLOAD_FILES = [];
const DOWNLOAD_DIRS = [];
const RECEIPT_ROOT = path.join(REPO_ROOT, "artifacts", "source-query-ladder");
const RECEIPTS_DIR = path.join(RECEIPT_ROOT, "receipts");
const CACHE_DIR = path.join(RECEIPT_ROOT, "cache");
const LEDGER_PATH = path.join(RECEIPT_ROOT, "query-receipts.jsonl");
const LATEST_DIR = path.join(RECEIPT_ROOT, "latest");

function usage() {
  console.error(
    "Usage: node scripts/query-source-ladder.mjs <query> [--downloads] [--json] [--limit N] [--refresh] [--ttl-minutes N]",
  );
}

function parseArgs(argv) {
  const args = [...argv];
  const queryParts = [];
  let includeDownloads = false;
  let asJson = false;
  let refresh = false;
  let limit = DEFAULT_LIMIT;
  let ttlMinutes = DEFAULT_TTL_MINUTES;

  while (args.length > 0) {
    const arg = args.shift();
    if (!arg) continue;
    if (arg === "--downloads") {
      includeDownloads = true;
      continue;
    }
    if (arg === "--json") {
      asJson = true;
      continue;
    }
    if (arg === "--refresh") {
      refresh = true;
      continue;
    }
    if (arg === "--limit") {
      const next = Number(args.shift());
      if (!Number.isFinite(next) || next <= 0) throw new Error("--limit requires a positive number");
      limit = Math.floor(next);
      continue;
    }
    if (arg === "--ttl-minutes") {
      const next = Number(args.shift());
      if (!Number.isFinite(next) || next < 0) throw new Error("--ttl-minutes requires a non-negative number");
      ttlMinutes = Math.floor(next);
      continue;
    }
    queryParts.push(arg);
  }

  const query = queryParts.join(" ").trim();
  if (!query) throw new Error("query is required");
  return { query, includeDownloads, asJson, refresh, limit, ttlMinutes };
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function compileNeedles(query) {
  return query
    .split(/\s+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => new RegExp(escapeRegex(part), "i"));
}

function matchesQuery(line, query, needles) {
  return line.toLowerCase().includes(query.toLowerCase()) || needles.every((needle) => needle.test(line));
}

function snippetFromLine(line, query) {
  const normalized = line.replace(/\s+/g, " ").trim();
  if (!normalized) return "";
  if (normalized.length <= 220) return normalized;
  const idx = normalized.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return `${normalized.slice(0, 217)}...`;
  const start = Math.max(0, idx - 70);
  const end = Math.min(normalized.length, idx + query.length + 120);
  return `${start > 0 ? "..." : ""}${normalized.slice(start, end)}${end < normalized.length ? "..." : ""}`;
}

async function statSafe(targetPath) {
  try {
    return await fs.stat(targetPath);
  } catch {
    return null;
  }
}

async function readMatches(filePath, query, needles) {
  const stats = await statSafe(filePath);
  if (!stats?.isFile() || stats.size > MAX_BYTES) return [];
  if (!TEXT_EXTENSIONS.has(path.extname(filePath).toLowerCase())) return [];
  const content = await fs.readFile(filePath, "utf8");
  if (!matchesQuery(content, query, needles)) return [];

  const hits = [];
  const lines = content.split(/\r?\n/);
  for (let i = 0; i < lines.length; i += 1) {
    if (!matchesQuery(lines[i], query, needles)) continue;
    const snippet = snippetFromLine(lines[i], query);
    if (!snippet) continue;
    hits.push({ file: filePath, line: i + 1, snippet });
  }
  return hits;
}

async function* walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if ([".git", "node_modules", "dist"].includes(entry.name)) continue;
      yield* walk(fullPath);
      continue;
    }
    yield fullPath;
  }
}

async function collectFromFiles(files, query, needles, limit) {
  const hits = [];
  for (const filePath of files) {
    if (hits.length >= limit) break;
    const fileHits = await readMatches(filePath, query, needles);
    for (const hit of fileHits) {
      hits.push(hit);
      if (hits.length >= limit) break;
    }
  }
  return hits;
}

async function collectFromDirs(dirs, query, needles, limit) {
  const hits = [];
  for (const dir of dirs) {
    if (hits.length >= limit) break;
    const stats = await statSafe(dir);
    if (!stats?.isDirectory()) continue;
    for await (const filePath of walk(dir)) {
      if (hits.length >= limit) break;
      const fileHits = await readMatches(filePath, query, needles);
      for (const hit of fileHits) {
        hits.push(hit);
        if (hits.length >= limit) break;
      }
    }
  }
  return hits;
}

function nowIso() {
  return new Date().toISOString();
}

function buildCacheKey(input) {
  return createHash("sha256").update(JSON.stringify(input)).digest("hex").slice(0, 16);
}

function toDisplayPath(targetPath) {
  return targetPath.startsWith(`${REPO_ROOT}${path.sep}`) ? path.relative(REPO_ROOT, targetPath) : targetPath;
}

async function ensureReceiptDirs() {
  await fs.mkdir(RECEIPTS_DIR, { recursive: true });
  await fs.mkdir(CACHE_DIR, { recursive: true });
  await fs.mkdir(LATEST_DIR, { recursive: true });
}

async function loadCachedResult(cachePath, ttlMinutes) {
  if (ttlMinutes === 0) return null;
  const stats = await statSafe(cachePath);
  if (!stats?.isFile()) return null;
  const ageMinutes = (Date.now() - stats.mtimeMs) / 60000;
  if (ageMinutes > ttlMinutes) return null;
  return JSON.parse(await fs.readFile(cachePath, "utf8"));
}

async function writeReceiptArtifacts(result) {
  await ensureReceiptDirs();
  const ts = nowIso().replace(/[:.]/g, "-");
  const receiptPath = path.join(RECEIPTS_DIR, `${ts}__${result.meta.cache_key}.json`);
  const latestPath = path.join(LATEST_DIR, `${result.meta.cache_key}.json`);
  const payload = { ...result, meta: { ...result.meta, latest_receipt_path: toDisplayPath(receiptPath) } };
  await fs.writeFile(receiptPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  await fs.writeFile(latestPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  await fs.writeFile(path.join(CACHE_DIR, `${result.meta.cache_key}.json`), `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  await fs.appendFile(
    LEDGER_PATH,
    `${JSON.stringify({
      query: result.query,
      created_at: payload.meta.created_at,
      cache_key: result.meta.cache_key,
      cache_hit: result.meta.cache_hit,
      receipt_path: payload.meta.latest_receipt_path,
      offline_hits: result.repo_anchors.length + result.repo_mirrors.length + result.downloads_evidence.length,
    })}\n`,
    "utf8",
  );
  return payload;
}

export async function runSourceQueryLadder({
  query,
  includeDownloads = false,
  refresh = false,
  limit = DEFAULT_LIMIT,
  ttlMinutes = DEFAULT_TTL_MINUTES,
} = {}) {
  if (!query || !String(query).trim()) throw new Error("query is required");
  const normalizedQuery = String(query).trim();
  const needles = compileNeedles(normalizedQuery);
  const cacheKey = buildCacheKey({ query: normalizedQuery, includeDownloads, limit });
  const cachePath = path.join(CACHE_DIR, `${cacheKey}.json`);

  if (!refresh) {
    const cached = await loadCachedResult(cachePath, ttlMinutes);
    if (cached) {
      cached.meta = { ...cached.meta, cache_hit: true, reused_at: nowIso() };
      return writeReceiptArtifacts(cached);
    }
  }

  const repoAnchors = (await collectFromFiles(ANCHOR_FILES.map((item) => path.join(REPO_ROOT, item)), normalizedQuery, needles, limit))
    .map((hit) => ({ ...hit, file: toDisplayPath(hit.file) }));
  const repoMirrors = (await collectFromDirs(REPO_MIRROR_DIRS.map((item) => path.join(REPO_ROOT, item)), normalizedQuery, needles, limit))
    .map((hit) => ({ ...hit, file: toDisplayPath(hit.file) }));

  let downloadsEvidence = [];
  if (includeDownloads) {
    downloadsEvidence = await collectFromFiles(DOWNLOAD_FILES, normalizedQuery, needles, limit);
    if (downloadsEvidence.length < limit) {
      downloadsEvidence = downloadsEvidence.concat(
        await collectFromDirs(DOWNLOAD_DIRS, normalizedQuery, needles, limit - downloadsEvidence.length),
      );
    }
    downloadsEvidence = downloadsEvidence.slice(0, limit).map((hit) => ({ ...hit, file: toDisplayPath(hit.file) }));
  }

  const result = {
    query: normalizedQuery,
    recommended_order: includeDownloads
      ? ["repo_anchors", "repo_mirrors", "downloads_evidence", "live_notion_confirm"]
      : ["repo_anchors", "repo_mirrors", "live_notion_confirm"],
    repo_anchors: repoAnchors,
    repo_mirrors: repoMirrors,
    downloads_evidence: downloadsEvidence,
    live_notion_confirmation: `If certainty is still missing, run one narrow live Notion confirmation for "${normalizedQuery}".`,
    meta: {
      created_at: nowIso(),
      cache_key: cacheKey,
      cache_hit: false,
      ttl_minutes: ttlMinutes,
      refresh_forced: refresh,
    },
  };

  return writeReceiptArtifacts(result);
}

function printResult(result) {
  console.log(`Query: ${result.query}`);
  console.log(`Recommended order: ${result.recommended_order.join(" -> ")}`);
  console.log(
    result.meta.cache_hit
      ? `Cache: hit (${result.meta.cache_key}, created ${result.meta.created_at}, ttl ${result.meta.ttl_minutes}m)`
      : `Cache: miss (${result.meta.cache_key}, ttl ${result.meta.ttl_minutes}m, receipts -> artifacts/source-query-ladder/)`,
  );
  for (const [title, hits] of [
    ["Repo anchors", result.repo_anchors],
    ["Repo mirrors", result.repo_mirrors],
    ["Downloads evidence", result.downloads_evidence],
  ]) {
    if (!hits.length) continue;
    console.log(`\n${title}:`);
    for (const hit of hits) {
      console.log(`- ${hit.file}:${hit.line}`);
      console.log(`  ${hit.snippet}`);
    }
  }
  if (!result.repo_anchors.length && !result.repo_mirrors.length && !result.downloads_evidence.length) {
    console.log("\nNo offline hits found. Next step: one narrow live Notion confirmation query.");
  }
}

export async function main(argv = process.argv.slice(2)) {
  const { query, includeDownloads, asJson, refresh, limit, ttlMinutes } = parseArgs(argv);
  const result = await runSourceQueryLadder({ query, includeDownloads, refresh, limit, ttlMinutes });
  if (asJson) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }
  printResult(result);
}

const invokedPath = process.argv[1] ? pathToFileURL(process.argv[1]).href : null;
if (invokedPath && import.meta.url === invokedPath) {
  main().catch((error) => {
    usage();
    console.error(`Error: ${error.message}`);
    process.exit(1);
  });
}
