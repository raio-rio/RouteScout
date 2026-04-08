# Route Scout

Route Scout is an AST-powered backend endpoint scanner and local testing dashboard for Express and NestJS projects. It discovers routes from source code, infers request requirements, and gives you a focused UI for running and comparing endpoint tests without building everything manually in a generic API client.

## What It Does

- Scans Express and NestJS codebases through AST analysis
- Detects routes, HTTP methods, params, headers, auth hints, and body fields
- Generates dummy request payloads from inferred fields and supported schemas
- Launches a local dashboard for running endpoint tests and reviewing responses
- Stores request history, saved scenarios, and header presets for repeated testing

## Current MVP Focus

This repository is the source for the Route Scout MVP.

- Public npm release is planned next
- The current repo is best used as a source checkout for exploration and local testing
- The dashboard UI is served by the local dashboard server package in this workspace

## Quick Demo

The easiest way to try Route Scout from this repository today is with the included demo backend.

### 1. Install dependencies

```bash
npm install
npm --prefix demo-backend install
```

### 2. Start the demo API

```bash
npm --prefix demo-backend run start
```

The demo backend runs on `http://localhost:3001`.

### 3. Launch Route Scout

```bash
node packages/cli/dist/bin.js dev --project ./demo-backend --base-url http://localhost:3001 --no-open
```

Then open `http://127.0.0.1:4310`.

## CLI Commands

From a local source checkout, the current CLI entrypoint is:

```bash
node packages/cli/dist/bin.js <command>
```

Available commands:

```bash
node packages/cli/dist/bin.js scan --project .
node packages/cli/dist/bin.js doctor --project .
node packages/cli/dist/bin.js dev --project . --base-url http://localhost:3000 --port 4310
```

## Repository Structure

- `packages/cli`: CLI entrypoint and orchestration
- `packages/core`: shared cache, payload generation, persistence, and types
- `packages/scanner`: AST scanning for Express and NestJS
- `packages/dashboard-server`: local server and dashboard UI
- `packages/dashboard-web`: reserved for a future standalone web bundle
- `demo-backend`: small sample API for manual testing
- `fixtures`: scanner fixtures used by tests

## Development Notes

- Node.js `20+` is the target runtime
- Route discovery is static-analysis based, so highly dynamic runtime route registration can be missed
- MVP auth support is centered on headers, presets, and environment substitution
- The repository is still being prepared for its public npm release, so release packaging and repo polish are actively in progress

## Contributing

Contributions, bug reports, and UX feedback are welcome. Start with [CONTRIBUTING.md](./CONTRIBUTING.md) for local development notes and workflow expectations.

If you are reporting a problem, include:

- framework and Node.js version
- a minimal route/controller example
- expected vs actual inferred output
- any dashboard screenshots or reproduction steps

## Demo Backend

The included demo backend has:

- `GET /health`
- `GET /users`
- `GET /users/:id`
- `POST /users`
- `PATCH /users/:id`
- `GET /slow`
- `GET /error`

See [demo-backend/README.md](./demo-backend/README.md) for details.
