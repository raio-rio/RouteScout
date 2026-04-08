# Contributing To Route Scout

Thanks for taking the time to contribute.

## Prerequisites

- Node.js `20+`
- npm
- A backend project to scan, or the included `demo-backend`

## Local Setup

```bash
npm install
npm --prefix demo-backend install
```

To try the demo backend:

```bash
npm run demo:start
```

To launch the dashboard against it from the repo root:

```bash
npm run demo:dashboard
```

## Useful Commands

```bash
npm run dev
npm run scan
npm run doctor
npm test
```

Current note:

- The repository is still being hardened for npm release and broader OSS usage, so if you hit tooling issues please mention the command, platform, and full error in your report or PR.

## Before Opening A PR

- Keep changes scoped and easy to review
- Update docs when user-facing behavior changes
- Include reproduction steps for bug fixes
- Mention any known limitations or follow-up work

## Project Areas

- `packages/cli`: CLI entrypoint
- `packages/core`: shared persistence, types, cache, payload helpers
- `packages/scanner`: Express/NestJS AST scanning
- `packages/dashboard-server`: dashboard server and UI
- `demo-backend`: local manual test target

## Reporting Bugs

The most helpful reports include:

- framework and Node.js version
- a minimal example route or controller
- expected vs actual behavior
- logs, screenshots, or route manifest output when relevant
