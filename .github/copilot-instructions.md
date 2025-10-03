# HubSpot Project Components - AI Coding Instructions

## Repository Purpose

This repository provides **template components and starter projects** for HubSpot's project framework (platformVersion 2025.1 and 2025.2). It is NOT a single application—it's a collection of reusable component examples and project templates that developers can scaffold into their own HubSpot projects.

## Architecture Overview

### Repository Structure
- **`2025.2/`** - Platform version 2025.2 components and templates
  - `components/` - Individual component types (cards, functions, settings, webhooks, etc.)
  - `defaultFiles/` - Default configuration files including AGENTS.md and CLAUDE.md
  - `private-app-get-started-template/` - Complete starter template for private apps
- **`projects/`** - Legacy templates for platform version 2025.1
  - `private-app-getting-started-template/`
  - `public-app-getting-started-template/`
  - `no-template/` - Empty project scaffold
- **`components/`** - Legacy example components
- **`config.json`** - Repository configuration mapping component paths and labels

### Component Architecture

Each HubSpot component has a **strict directory structure** enforced by the platform:

1. **Configuration**: Every component needs a `*-hsmeta.json` file with:
   - `uid`: Unique identifier within the project
   - `type`: Component type (app, card, settings, webhooks, etc.)
   - `config`: Type-specific configuration (entrypoint, name, location, etc.)

2. **Directory Rules** (critical - platform enforced):
   - `app` component: `app/` (only one per project)
   - `card` components: `app/cards/`
   - `app-function` components: `app/functions/`
   - `settings` component: `app/settings/` (only one per project)
   - `webhooks` component: `app/webhooks/` (only one per project)
   - `workflow-action` components: `app/workflow-actions/`
   - `scim` component: `app/scim/` (only one per project)
   - `app-object` components: `app/app-objects/`
   - `app-event` components: `app/app-events/`
   - `page` components: `app/pages/`
   - **Components CANNOT be in nested subdirectories** beyond these specified paths

3. **Project Configuration**: `hsproject.json` defines:
   - `name`: Project display name
   - `srcDir`: Source directory (typically "src")
   - `platformVersion`: Platform version (e.g., "2025.1" or "2025.2")

## Critical Conventions

### Component Type Constraints

**Distribution & Auth Type Dependencies**:
- `app-function` components are **NOT available** when `config.distribution` is `marketplace` in the app component
- `webhooks` components can **only** be used in projects where `config.distribution` is `private` AND `config.auth.type` is `static`
- Marketplace apps require `config.auth.type` to be `oauth`
- SCIM components only support `static` auth and `private` distribution
- App objects and events are only for `oauth` + `marketplace`

### React Component Restrictions

**Browser API Limitations**: In `card` and `settings` components:
- **NO** `window` object access (including `window.fetch`)
- **MUST** use `hubspot.fetch()` from `@hubspot/ui-extensions` instead
- All fetched URLs must be declared in `config.permittedUrls.fetch[]` in the parent app's `-hsmeta.json`
- **ONLY** components from `@hubspot/ui-extensions` can be used
- In `settings`: React components from `@hubspot/ui-extensions/crm` are **NOT** allowed

### UI Extensions Package

The `@hubspot/ui-extensions` npm package:
- Only accepts component properties defined by the component spec
- **NO** `style` properties are valid
- Examples: `<Text>`, `<Button>`, `<Link>`, `<List>`, `<Flex>`, `<Input>`, etc.

## Developer Workflows

### Using the HubSpot CLI

**Essential Commands**:
```bash
# Setup and authentication
hs init                    # Set up HubSpot configuration file
hs auth                    # Authenticate new account (opens browser)
hs doctor                  # Debug CLI installation issues

# Project development
hs project dev             # Run project locally for testing
hs project open            # Open project page in browser

# Account management
hs account <subcommand>    # Manage HubSpot accounts

# Get help
hs <command> --help        # Detailed help for any command
hs <command> --debug       # Enable debug output
```

### HubSpot MCP Server

**IMPORTANT**: If the HubSpot MCP Server is installed, **ALWAYS use its tools FIRST** before manually running CLI commands or working with HubSpot assets.

### No Build Process

This repository has **no central build system**—it's a collection of templates. Individual components within templates may have their own `package.json` with dependencies like:
```json
{
  "dependencies": {
    "@hubspot/ui-extensions": "latest",
    "react": "^18.2.0"
  }
}
```

The CI workflow (`npm-grunt.yml`) exists but components are meant to be scaffolded into user projects, not built centrally.

## Integration Points

### Component Discovery

The `config.json` in platform version directories (e.g., `2025.2/config.json`) defines:
- `defaultFiles`: Path to default configuration files (AGENTS.md, CLAUDE.md, hsproject.json)
- `parentComponents`: App component variants by auth type and distribution
- `components`: Available child components with supported auth types and distributions

### Template Structure

Starter templates (e.g., `2025.2/private-app-get-started-template/`) provide:
1. Complete `hsproject.json`
2. Pre-configured app component in `src/app/`
3. Example card component in `src/app/cards/`
4. Working React code demonstrating UI extension patterns

## Common Patterns

### Card Component Example
```javascript
import React from "react";
import { Text, Link, hubspot } from "@hubspot/ui-extensions";

hubspot.extend(() => <Extension />);

const Extension = () => {
  return (
    <Text>
      Congrats! You just deployed your first app card!
    </Text>
  );
};
```

### Function Component Example
```javascript
exports.main = async () => {
  return "New Function!";
};
```

### UID Naming Convention
UIDs in `-hsmeta.json` files often follow pattern: `{component_name}_{distribution}_{auth_type}`
Example: `get_started_app_card_private_static`

## What to Avoid

- Don't create nested subdirectories beyond the specified component directories
- Don't assume `window` object availability in UI extensions
- Don't use browser fetch APIs directly—use `hubspot.fetch()`
- Don't forget to declare fetch URLs in the app component's `permittedUrls.fetch` array
- Don't mix incompatible auth types and distribution models
- Don't try to add multiple singleton components (app, settings, webhooks, scim)

## Key Files to Reference

- `2025.2/defaultFiles/AGENTS.md` - Comprehensive agent instructions
- `2025.2/defaultFiles/CLAUDE.md` - Claude-specific guidance  
- `2025.2/config.json` - Component type definitions and constraints
- `2025.2/private-app-get-started-template/` - Complete working example
- `README.md` - High-level repository overview
