#!/usr/bin/env node
/**
 * sync-mcp-connections.mjs
 *
 * Propagates config/mcp-connections.json (SSOT) to every IDE/tool surface:
 *   - ~/.mcp.json                          (Claude Code global)
 *   - .claude/settings.json               (Claude Code project — merge only mcpServers)
 *   - .cursor/mcp.json                    (Cursor IDE)
 *   - ~/.codex/config.toml                (Codex CLI — surgical section replace)
 *   - ~/Library/.../claude_desktop_config.json (Claude Desktop — merge mcpServers)
 */

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..");
const HOME = os.homedir();

const ARGS = process.argv.slice(2);
const DRY_RUN = ARGS.includes("--dry-run");
const VERBOSE = ARGS.includes("--verbose") || ARGS.includes("-v");
const SURFACE_ARG = ARGS.find((a) => a.startsWith("--surface="))?.split("=")[1] ?? null;

function loadEnv() {
  const envPath = path.join(REPO_ROOT, ".env");
  const env = { ...process.env };
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
      const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (m && !env[m[1]]) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
  return env;
}

function expandPath(p) {
  if (p.startsWith("~/")) return path.join(HOME, p.slice(2));
  if (path.isAbsolute(p)) return p;
  return path.join(REPO_ROOT, p);
}

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return null;
  }
}

function readJsonWithValidity(filePath) {
  const raw = readFileSafe(filePath);
  if (raw === null) return { exists: false, valid: true, parsed: null };
  try {
    return { exists: true, valid: true, parsed: JSON.parse(raw) };
  } catch {
    return { exists: true, valid: false, parsed: null };
  }
}

function resolveUrl(server, surfaceId, env) {
  const surfaceDef = server.surfaces?.[surfaceId] ?? {};
  const variant = surfaceDef.url_variant ?? "local";
  if (variant === "local" && env.LOCAL_MCP_URL) return env.LOCAL_MCP_URL;
  if (variant === "cloud" && env.CLOUD_MCP_URL) return env.CLOUD_MCP_URL;
  if (typeof server.url === "object") {
    return server.url[variant] ?? server.url.local ?? server.url.cloud ?? "";
  }
  return surfaceDef.url ?? server.url ?? "";
}

function resolveToken(server, env) {
  const envVar = server.auth?.bearer_token_env_var;
  if (!envVar) return "";
  const val = env[envVar] ?? "";
  if (!val) process.stderr.write(`[WARN] ${envVar} not set — token will be empty for ${server.id}\n`);
  return val;
}

function sha256(str) {
  return crypto.createHash("sha256").update(str).digest("hex").slice(0, 12);
}

function diffLines(oldStr, newStr) {
  const oldLines = (oldStr ?? "").split("\n");
  const newLines = (newStr ?? "").split("\n");
  const added = newLines.filter((l) => !oldLines.includes(l)).length;
  const removed = oldLines.filter((l) => !newLines.includes(l)).length;
  return { changed: oldStr !== newStr, added, removed };
}

function writeIfChanged(filePath, content, dryRun) {
  const existing = readFileSafe(filePath);
  if (existing === content) return false;
  if (!dryRun) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content, "utf8");
  }
  return true;
}

function displaySurfacePath(rawPath, expandedPath) {
  if (typeof rawPath !== "string" || rawPath.length === 0) {
    return expandedPath.replace(HOME, "~");
  }
  if (rawPath.startsWith("~/")) return rawPath;
  if (path.isAbsolute(rawPath)) return rawPath.replace(HOME, "~");
  return rawPath;
}

function generateClaudeCodeGlobal(ssot, env) {
  const servers = {};
  for (const server of ssot.servers) {
    if (!server.enabled) continue;
    const surf = server.surfaces?.claude_code_global;
    if (!surf?.enabled) continue;
    const key = surf.server_key;

    if (surf.type === "stdio" || server.type === "stdio") {
      const entry = {
        type: "stdio",
        command: surf.command ?? server.command,
        args: surf.args ?? server.args ?? [],
      };
      if (surf.auth_mode === "stdio_env_headers") {
        const token = resolveToken(server, env);
        entry.env = {
          OPENAPI_MCP_HEADERS: JSON.stringify({
            Authorization: `Bearer ${token}`,
            "Notion-Version": "2022-06-28",
          }),
        };
      }
      servers[key] = entry;
    } else {
      const url = resolveUrl(server, "claude_code_global", env);
      const entry = { type: "http", url };
      if (surf.auth_mode === "literal_header") {
        const token = resolveToken(server, env);
        entry.headers = { Authorization: `Bearer ${token}` };
      }
      servers[key] = entry;
    }
  }
  return JSON.stringify({ mcpServers: servers }, null, 2) + "\n";
}

function generateClaudeCodeProject(ssot, env) {
  const existingState = readJsonWithValidity(expandPath(ssot.surface_paths.claude_code_project));
  if (existingState.exists && !existingState.valid) {
    throw new Error("existing .claude/settings.json is invalid JSON; refusing to overwrite");
  }
  const existing = existingState.parsed ?? {};
  const servers = {};
  for (const server of ssot.servers) {
    if (!server.enabled) continue;
    const surf = server.surfaces?.claude_code_project;
    if (!surf?.enabled) continue;
    const key = surf.server_key;
    const url = resolveUrl(server, "claude_code_project", env);
    const entry = { type: "http", url };
    if (surf.auth_mode === "literal_header") {
      const token = resolveToken(server, env);
      entry.headers = { Authorization: `Bearer ${token}` };
    }
    servers[key] = entry;
  }
  const merged = { ...existing, mcpServers: servers };
  return JSON.stringify(merged, null, 2) + "\n";
}

function generateCursor(ssot, env) {
  const servers = {};
  for (const server of ssot.servers) {
    if (!server.enabled) continue;
    const surf = server.surfaces?.cursor;
    if (!surf?.enabled) continue;
    const key = surf.server_key;
    const url = resolveUrl(server, "cursor", env);
    const entry = { url };
    if (surf.auth_mode === "literal_header") {
      const token = resolveToken(server, env);
      entry.headers = { Authorization: `Bearer ${token}` };
    }
    servers[key] = entry;
  }
  return JSON.stringify({ mcpServers: servers }, null, 2) + "\n";
}

function generateClaudeDesktop(ssot, env) {
  const filePath = expandPath(ssot.surface_paths.claude_desktop);
  const existingState = readJsonWithValidity(filePath);
  if (existingState.exists && !existingState.valid) {
    throw new Error("existing Claude Desktop config is invalid JSON; refusing to overwrite");
  }
  const existing = existingState.parsed ?? {};
  const servers = {};

  for (const server of ssot.servers) {
    if (!server.enabled) continue;
    const surf = server.surfaces?.claude_desktop;
    if (!surf?.enabled) continue;
    const key = surf.server_key;

    if (server.type === "stdio") {
      servers[key] = { command: server.command, args: server.args ?? [] };
    } else if (surf.auth_mode === "mcp_remote_args") {
      const url = resolveUrl(server, "claude_desktop", env);
      const token = resolveToken(server, env);
      servers[key] = {
        command: "npx",
        args: ["mcp-remote", url, "--header", `Authorization: Bearer ${token}`],
      };
    }
  }

  const merged = { ...existing, mcpServers: servers };
  return JSON.stringify(merged, null, 2) + "\n";
}

function generateCodexToml(ssot, env) {
  const filePath = expandPath(ssot.surface_paths.codex);
  const existing = readFileSafe(filePath) ?? "";
  const parsed = parseTomlSections(existing);

  const newMcpSections = [];
  for (const server of ssot.servers) {
    if (!server.enabled) continue;
    const surf = server.surfaces?.codex;
    if (!surf?.enabled) continue;
    const key = surf.server_key;
    const lines = [`[mcp_servers.${key}]`];
    const effectiveType = surf.type ?? server.type;

    if (effectiveType === "stdio") {
      lines.push(`command = "${server.command}"`);
      const argsToml = JSON.stringify(server.args ?? []).replace(/"/g, '"');
      lines.push(`args = ${argsToml}`);
    } else {
      if (server.type === "http") lines.push("enabled = true");
      const url = surf.url ?? resolveUrl(server, "codex", env);
      lines.push(`url = "${url}"`);
      if (surf.auth_mode === "bearer_env_var") {
        lines.push(`bearer_token_env_var = "${server.auth.bearer_token_env_var}"`);
      }
    }
    newMcpSections.push(lines);
  }

  return rebuildToml(parsed, newMcpSections);
}

function isMcpHeaderComment(line) {
  return (
    /^#\s*──+\s*MCP Servers/i.test(line) ||
    /^#\s*To switch to production/i.test(line) ||
    /^#\s*url\s*=/i.test(line)
  );
}

function parseTomlSections(raw) {
  const lines = raw.split("\n");
  const result = { header: [], mcp: [], agents: [], other: [] };
  let current = "header";
  let currentLines = [];

  function trimTrailingBlanks(arr) {
    while (arr.length && arr[arr.length - 1].trim() === "") arr.pop();
    return arr;
  }

  function flush() {
    if (currentLines.length === 0) return;
    if (current === "header") {
      const filtered = currentLines.filter((l) => !isMcpHeaderComment(l));
      result.header.push(...filtered);
    } else if (current === "mcp") {
      result.mcp.push(trimTrailingBlanks([...currentLines]));
    } else if (current === "agents") {
      result.agents.push(trimTrailingBlanks([...currentLines]));
    } else {
      result.other.push(trimTrailingBlanks([...currentLines]));
    }
    currentLines = [];
  }

  for (const line of lines) {
    if (/^\[mcp_servers\.[^\]]+\]/.test(line)) {
      flush();
      current = "mcp";
      currentLines = [line];
    } else if (/^\[agents\.[^\]]+\]/.test(line)) {
      flush();
      current = "agents";
      currentLines = [line];
    } else if (/^\[[^\]]+\]/.test(line) && current !== "header") {
      flush();
      current = "other";
      currentLines = [line];
    } else {
      currentLines.push(line);
    }
  }
  flush();
  return result;
}

function rebuildToml(parsed, newMcpSections) {
  const parts = [];
  const header = [...parsed.header];
  while (header.length && header[header.length - 1].trim() === "") header.pop();
  while (header.length && isMcpHeaderComment(header[header.length - 1].trim())) header.pop();
  while (header.length && header[header.length - 1].trim() === "") header.pop();
  parts.push(...header);

  parts.push("", "# ── MCP Servers ────────────────────────────────────────────────────────────────");
  for (const section of newMcpSections) {
    parts.push("");
    parts.push(...section);
  }

  if (parsed.agents.length > 0) {
    parts.push("", "# ── Multi-Agent Roles ──────────────────────────────────────────────────────────");
    for (const section of parsed.agents) {
      parts.push("");
      parts.push(...section);
    }
  }

  for (const section of parsed.other) {
    parts.push("", ...section);
  }

  parts.push("");
  return parts.join("\n");
}

function gitShaShort() {
  const result = spawnSync("git", ["rev-parse", "--short", "HEAD"], {
    cwd: REPO_ROOT,
    encoding: "utf-8",
    env: process.env,
  });
  return result.status === 0 ? (result.stdout || "").trim() || "unknown" : "unknown";
}

function writeVersionStamp(ssot, results, dryRun) {
  const stampPath = path.join(REPO_ROOT, ssot.sync_meta.stamp_path);
  const stamp = {
    ssot_version: ssot.version,
    synced_at: new Date().toISOString(),
    synced_by: "scripts/sync-mcp-connections.mjs",
    git_sha: gitShaShort(),
    dry_run: dryRun,
    surfaces: Object.fromEntries(
      results.map((r) => [r.surface, { path: r.path, changed: r.changed, sha: sha256(r.content) }])
    ),
  };
  if (!dryRun) {
    fs.mkdirSync(path.dirname(stampPath), { recursive: true });
    fs.writeFileSync(stampPath, JSON.stringify(stamp, null, 2) + "\n");
  }
  return stamp;
}

async function main() {
  const env = loadEnv();
  const ssotPath = path.join(REPO_ROOT, "config", "mcp-connections.json");
  if (!fs.existsSync(ssotPath)) {
    console.error(`[ERROR] SSOT not found: ${ssotPath}`);
    process.exit(1);
  }
  const ssot = JSON.parse(fs.readFileSync(ssotPath, "utf8"));

  const allSurfaces = [
    {
      id: "claude_code_global",
      label: "Claude Code (global)",
      path: expandPath(ssot.surface_paths.claude_code_global),
      generator: () => generateClaudeCodeGlobal(ssot, env),
    },
    {
      id: "claude_code_project",
      label: "Claude Code (project)",
      path: expandPath(ssot.surface_paths.claude_code_project),
      generator: () => generateClaudeCodeProject(ssot, env),
    },
    {
      id: "cursor",
      label: "Cursor IDE",
      path: expandPath(ssot.surface_paths.cursor),
      generator: () => generateCursor(ssot, env),
    },
    {
      id: "codex",
      label: "Codex CLI",
      path: expandPath(ssot.surface_paths.codex),
      generator: () => generateCodexToml(ssot, env),
    },
    {
      id: "claude_desktop",
      label: "Claude Desktop",
      path: expandPath(ssot.surface_paths.claude_desktop),
      generator: () => generateClaudeDesktop(ssot, env),
    },
  ].filter((s) => !SURFACE_ARG || s.id === SURFACE_ARG);

  if (DRY_RUN) console.log("\n  [DRY RUN] — previewing changes, no files written\n");

  const colW = [26, 52, 16];
  const hr = "─".repeat(colW[0]) + "  " + "─".repeat(colW[1]) + "  " + "─".repeat(colW[2]);
  console.log("  " + "Surface".padEnd(colW[0]) + "  " + "Path".padEnd(colW[1]) + "  " + "Status");
  console.log("  " + hr);

  const results = [];
  for (const surface of allSurfaces) {
    let content = "";
    let error = null;
    try {
      content = surface.generator();
    } catch (e) {
      error = e.message;
    }

    const existing = readFileSafe(surface.path) ?? "";
    const diff = error ? { changed: false, added: 0, removed: 0 } : diffLines(existing, content);

    let status;
    if (error) {
      status = `ERROR: ${error.slice(0, 30)}`;
    } else if (!diff.changed) {
      status = "no change";
    } else {
      writeIfChanged(surface.path, content, DRY_RUN);
      status = DRY_RUN
        ? `would change (+${diff.added}/-${diff.removed})`
        : `updated (+${diff.added}/-${diff.removed})`;
    }

    const shortPath = displaySurfacePath(ssot.surface_paths?.[surface.id], surface.path);
    console.log(
      "  " +
        surface.label.padEnd(colW[0]) +
        "  " +
        shortPath.padEnd(colW[1]) +
        "  " +
        status
    );

    if (VERBOSE && diff.changed && !error) {
      console.log(`\n    [${surface.id}] new content:\n`);
      content.split("\n").forEach((l) => console.log("    " + l));
      console.log();
    }

    results.push({ surface: surface.id, path: shortPath, content, ...diff, error });
  }

  const errorCount = results.filter((r) => r.error).length;
  if (errorCount > 0) {
    console.log("\n  " + hr);
    console.error(`\n  ${errorCount} surface(s) failed to generate.\n`);
    process.exit(1);
  }

  const stamp = writeVersionStamp(ssot, results, DRY_RUN);
  const changed = results.filter((r) => r.changed).length;

  console.log("\n  " + hr);
  if (DRY_RUN) {
    console.log(`\n  ${changed} surface(s) would change. Run without --dry-run to apply.\n`);
  } else {
    console.log(`\n  ${changed} surface(s) updated. Stamp: config/.mcp-sync-stamp.json (sha: ${stamp.git_sha})\n`);
  }
}

main().catch((e) => {
  console.error("[FATAL]", e.message);
  process.exit(1);
});
