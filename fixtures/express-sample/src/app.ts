import express, { Router } from "express";
import { z } from "zod";

const app = express();
const router = Router();

const createUserSchema = z.object({
  name: z.string(),
  age: z.number().optional(),
});

function validateBody(_schema: unknown) {
  return (_req: unknown, _res: unknown, next: () => void) => next();
}

function requireApiKey(req: any, res: any, next: () => void) {
  if (!req.headers["x-api-key"]) {
    res.status(401).json({ ok: false });
    return;
  }
  next();
}

router.get("/:id", (req, res) => {
  const verbose = req.query.verbose;
  res.json({ id: req.params.id, verbose });
});

router.post("/", requireApiKey, validateBody(createUserSchema), (req, res) => {
  if (typeof req.body.age === "number" && req.body.age <= 18) {
    res.status(400).json({ created: false, error: "age must be above 18" });
    return;
  }
  res.json({ created: true, name: req.body.name });
});

app.use("/users", router);

export default app;
