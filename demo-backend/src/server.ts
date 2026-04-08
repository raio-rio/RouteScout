import express, { type NextFunction, type Request, type Response } from "express";
import { z } from "zod";

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT ?? "3001");
const API_KEY = process.env.API_KEY ?? "demo-secret";

type User = {
  id: string;
  name: string;
  email: string;
  age?: number;
  active: boolean;
};

const users = new Map<string, User>([
  ["u_1", { id: "u_1", name: "Ada Lovelace", email: "ada@example.com", age: 36, active: true }],
  ["u_2", { id: "u_2", name: "Grace Hopper", email: "grace@example.com", active: true }],
]);

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  age: z.number().int().positive().optional(),
});

const patchUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  age: z.number().int().positive().optional(),
  active: z.boolean().optional(),
});

function requireApiKey(req: Request, res: Response, next: NextFunction): void {
  const key = req.headers["x-api-key"];
  if (key !== API_KEY) {
    res.status(401).json({
      error: {
        code: "UNAUTHORIZED",
        message: "Missing or invalid x-api-key header",
      },
    });
    return;
  }
  next();
}

function validateBody<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid request body",
          issues: parsed.error.issues,
        },
      });
      return;
    }

    req.body = parsed.data;
    next();
  };
}

app.get("/health", (_req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

app.get("/users", (req, res) => {
  const activeOnly = req.query.activeOnly === "true";
  const q = typeof req.query.q === "string" ? req.query.q.toLowerCase() : "";

  const list = [...users.values()].filter((user) => {
    if (activeOnly && !user.active) {
      return false;
    }
    if (q && !`${user.name} ${user.email}`.toLowerCase().includes(q)) {
      return false;
    }
    return true;
  });

  res.json({ data: list, count: list.length });
});

app.get("/users/:id", (req, res) => {
  const user = users.get(req.params.id);
  const verbose = req.query.verbose === "true";

  if (!user) {
    res.status(404).json({
      error: {
        code: "NOT_FOUND",
        message: `User ${req.params.id} was not found`,
      },
    });
    return;
  }

  res.json({
    data: user,
    ...(verbose ? { meta: { fetchedAt: new Date().toISOString() } } : {}),
  });
});

app.post("/users", requireApiKey, validateBody(createUserSchema), (req, res) => {
  const id = `u_${users.size + 1}`;
  const body = req.body as z.infer<typeof createUserSchema>;

  const user: User = {
    id,
    name: body.name,
    email: body.email,
    age: body.age,
    active: true,
  };

  users.set(id, user);
  res.status(201).json({ data: user });
});

app.patch("/users/:id", requireApiKey, validateBody(patchUserSchema), (req, res) => {
  const existing = users.get(req.params.id);
  if (!existing) {
    res.status(404).json({
      error: {
        code: "NOT_FOUND",
        message: `User ${req.params.id} was not found`,
      },
    });
    return;
  }

  const patch = req.body as z.infer<typeof patchUserSchema>;
  const nextUser = { ...existing, ...patch };
  users.set(existing.id, nextUser);

  res.json({ data: nextUser });
});

app.get("/slow", async (_req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  res.json({ ok: true, latencyMs: 1500 });
});

app.get("/error", (_req, _res) => {
  throw new Error("Intentional demo failure for dashboard error handling");
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const message = err instanceof Error ? err.message : "Unknown server error";
  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message,
    },
  });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[demo-backend] listening on http://localhost:${PORT}`);
  // eslint-disable-next-line no-console
  console.log(`[demo-backend] API key: ${API_KEY}`);
});
