<!-- managed-by: activ8-ai-context-pack | pack-version: 1.1.0 -->
<!-- source-sha: a0d4785 -->
# Prime Bridge Access Contract

Prime Bridge is a first-class control-plane surface.

## Required Standard

- Do not treat Prime Bridge as an ad hoc relay or side path.
- Managed repos must keep `config/mcp-connections.json` and `scripts/sync-mcp-connections.mjs` aligned to the unified MCP surface.
- `npm run mcp:sync` is part of the managed contract and must propagate Prime Bridge access across IDE, agent, and operator surfaces.
- Build and fleet verification must fail closed when Prime Bridge access drifts off the managed contract.

## Iteration Loop

- Keep this contract in the Prompt Library so operationalization can push, verify, and re-distribute it as the build evolves.
- Route repo-wide evolution through `npm run operationalize:repo -- --with-sync`.
- Route fleet-wide evolution through `npm run fleet:sync` and `npm run fleet:verify`.
