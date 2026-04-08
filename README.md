# Route Scout

Route Scout is an AST-powered CLI tool for scanning Node.js backend codebases (Express/NestJS) and launching a local dashboard to test endpoints.

## Features

- `api-scout dev` launches the Route Scout localhost dashboard for endpoint testing
- AST/static analysis route discovery (no regex parsing)
- Express + NestJS support
- Route/method/path params/query/body inference
- Zod + class-validator body schema adapters
- Dummy payload generation from inferred schemas
- Local cache under `.apitool/cache`
- Request history and header presets with `${ENV_VAR}` substitution

## Quick Start

```bash
npm install
npm run build

# Scan and write manifest
node packages/cli/dist/bin.js scan --project ./path-to-backend

# Start dashboard
node packages/cli/dist/bin.js dev --project ./path-to-backend --base-url http://localhost:3000
```

## Main Commands

```bash
node packages/cli/dist/bin.js dev --project . --base-url http://localhost:3000 --port 4310
node packages/cli/dist/bin.js scan --project . --json
node packages/cli/dist/bin.js doctor --project .
```

## Project Layout

- `packages/cli`: CLI commands and orchestration
- `packages/core`: shared types, cache, payload factory, env substitution
- `packages/scanner`: ts-morph scanner + Express/Nest extractors + schema adapters
- `packages/dashboard-server`: local server + dashboard UI
- `fixtures`: sample Express/Nest projects used by tests

## Notes

- This is static-analysis based. Runtime dynamic routes can be missed.
- MVP auth support is header presets/env vars (no OAuth flow UI).
- AI endpoint/failure explanations are intentionally not enabled in this MVP.
