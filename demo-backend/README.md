# Demo Backend (Express + TypeScript)

Use this backend to test the API Scout dashboard locally.

## Run

```bash
cd demo-backend
npm install
npm run start
```

By default it runs at `http://localhost:3001` with:

- `x-api-key`: `demo-secret`

## Endpoints

- `GET /health`
- `GET /users`
- `GET /users/:id`
- `POST /users` (requires `x-api-key`)
- `PATCH /users/:id` (requires `x-api-key`)
- `GET /slow`
- `GET /error`

## Start Dashboard

From repo root:

```bash
node packages/cli/dist/bin.js dev --project ./demo-backend --base-url http://localhost:3001 --no-open
```

Then open `http://127.0.0.1:4310`.
