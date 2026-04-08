# Demo Backend

This sample Express + TypeScript backend is included so you can try Route Scout locally without pointing it at your own API first.

## Run The Demo API

```bash
cd demo-backend
npm install
npm run start
```

The demo backend runs at `http://localhost:3001`.

Default test header:

- `x-api-key: demo-secret`

## Available Endpoints

- `GET /health`
- `GET /users`
- `GET /users/:id`
- `POST /users`
- `PATCH /users/:id`
- `GET /slow`
- `GET /error`

## Start Route Scout Against The Demo

From the repository root:

```bash
node packages/cli/dist/bin.js dev --project ./demo-backend --base-url http://localhost:3001 --no-open
```

Then open `http://127.0.0.1:4310`.
