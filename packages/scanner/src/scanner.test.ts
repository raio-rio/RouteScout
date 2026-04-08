import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { scanProject } from "./scanner.js";

const thisDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(thisDir, "../../..");

describe("scanProject", () => {
  it("extracts Express routes and zod body schema", async () => {
    const projectRoot = path.join(repoRoot, "fixtures/express-sample");
    const result = await scanProject({ projectRoot });

    expect(result.manifest.routes.length).toBeGreaterThan(0);

    const postUsers = result.manifest.routes.find(
      (route) => route.framework === "express" && route.method === "POST" && route.path === "/users",
    );
    expect(postUsers).toBeDefined();
    expect(postUsers?.bodySchema?.type).toBe("object");
    expect(postUsers?.bodySchema?.properties?.name?.type).toBe("string");
    expect(postUsers?.bodySchema?.properties?.age?.type).toBe("number");
    expect(postUsers?.headers).toContain("x-api-key");
    expect(postUsers?.authRequirements?.some((item) => item.kind === "apiKey")).toBe(true);
    expect(postUsers?.inferredFields?.some((item) => item.name === "name" && item.confidence === "high")).toBe(true);
    expect(
      postUsers?.inferredFields?.some(
        (item) => item.name === "age" && item.location === "body" && item.exclusiveMinimum === 18,
      ),
    ).toBe(true);
  });

  it("extracts Nest routes and class-validator dto schema", async () => {
    const projectRoot = path.join(repoRoot, "fixtures/nest-sample");
    const result = await scanProject({ projectRoot });

    expect(result.manifest.routes.length).toBeGreaterThan(0);

    const postUsers = result.manifest.routes.find(
      (route) => route.framework === "nest" && route.method === "POST" && route.path === "/users",
    );
    expect(postUsers).toBeDefined();
    expect(postUsers?.bodySchema?.type).toBe("object");
    expect(postUsers?.bodySchema?.properties?.name?.type).toBe("string");
    expect(
      postUsers?.inferredFields?.some(
        (item) => item.name === "age" && item.location === "body" && item.exclusiveMinimum === 18,
      ),
    ).toBe(true);
  });
});
