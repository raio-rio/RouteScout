import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import {
  loadHistory,
  loadPresets,
  loadProfiles,
  loadSuites,
  loadTemplates,
  loadWorkflows,
  resolveHeadersWithEnv,
  saveHistory,
  savePresets,
  saveProfiles,
  saveSuites,
  saveTemplates,
  saveWorkflows,
  type AssertionDefinition,
  type HeaderPresetStore,
  type RequestExecutionInput,
  type RequestExecutionResult,
  type RequestHistoryStore,
  type RequestTemplateStore,
  type RouteManifest,
  type SuiteRunResult,
  type TestSuiteStore,
  type WorkflowRunResult,
  type WorkflowStore,
  type WorkspaceProfileStore,
} from "@api-scout/core";
import Fastify, { type FastifyInstance } from "fastify";
import { DASHBOARD_HTML } from "./ui.js";

export interface DashboardServerOptions {
  projectRoot: string;
  baseUrl: string;
  port: number;
  host?: string;
  manifest: RouteManifest;
  reloadManifest?: () => Promise<RouteManifest>;
}

export interface DashboardServerHandle {
  url: string;
  close: () => Promise<void>;
  app: FastifyInstance;
}

interface RequestBody extends RequestExecutionInput {
  presetName?: string;
  baseUrl?: string;
}

interface HistoryFilters {
  routeId?: string;
  status?: number;
  errorOnly?: boolean;
}

const sourceFileCache = new Map<string, string[]>();

function toStringRecord(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object") {
    return {};
  }

  const out: Record<string, string> = {};
  for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
    if (typeof val === "string") {
      out[key] = val;
    } else if (typeof val === "number" || typeof val === "boolean") {
      out[key] = String(val);
    }
  }
  return out;
}

async function readSourceLines(filePath: string): Promise<string[]> {
  const cached = sourceFileCache.get(filePath);
  if (cached) {
    return cached;
  }

  try {
    const fileText = await readFile(filePath, "utf8");
    const lines = fileText.replace(/\r\n/g, "\n").split("\n");
    sourceFileCache.set(filePath, lines);
    return lines;
  } catch {
    sourceFileCache.set(filePath, []);
    return [];
  }
}

async function buildRouteSourceSnippet(sourceRef: RouteManifest["routes"][number]["sourceRef"]): Promise<string | undefined> {
  const lines = await readSourceLines(sourceRef.file);
  if (!lines.length) {
    return undefined;
  }

  const targetLine = Math.max(1, sourceRef.line || 1);
  const startLine = Math.max(1, targetLine - 2);
  const endLine = Math.min(lines.length, targetLine + 2);

  return lines
    .slice(startLine - 1, endLine)
    .map((lineText, index) => {
      const lineNumber = startLine + index;
      return `${lineNumber === targetLine ? ">" : " "} ${String(lineNumber).padStart(4, " ")} | ${lineText}`;
    })
    .join("\n");
}

async function buildRoutePayloads(manifest: RouteManifest) {
  return Promise.all(
    manifest.routes.map(async (route) => ({
      ...route,
      sourceSnippet: await buildRouteSourceSnippet(route.sourceRef),
    })),
  );
}

function applyPathParams(pathTemplate: string, pathParams: Record<string, string>): string {
  return pathTemplate.replace(/:([A-Za-z0-9_]+)/g, (_full, key: string) => {
    const value = pathParams[key];
    return encodeURIComponent(value ?? `:${key}`);
  });
}

function buildTargetUrl(
  baseUrl: string,
  routePath: string,
  pathParams: Record<string, string>,
  query: Record<string, string>,
): string {
  const url = new URL(applyPathParams(routePath, pathParams), baseUrl);
  for (const [key, value] of Object.entries(query)) {
    url.searchParams.set(key, value);
  }
  return url.toString();
}

function headersToObject(headers: Headers): Record<string, string> {
  const out: Record<string, string> = {};
  headers.forEach((value, key) => {
    out[key] = value;
  });
  return out;
}

function pickPath(input: unknown, path: string | undefined): unknown {
  if (!path) {
    return input;
  }

  const normalized = path.replace(/\[(\d+)\]/g, ".$1");
  const parts = normalized.split(".").filter(Boolean);
  let current: unknown = input;

  for (const part of parts) {
    if (current === null || current === undefined) {
      return undefined;
    }
    if (typeof current !== "object") {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }

  return current;
}

function runAssertion(assertion: AssertionDefinition, result: RequestExecutionResult): { ok: boolean; message: string } {
  let actual: unknown;

  if (assertion.target === "status") {
    actual = result.status;
  } else if (assertion.target === "header") {
    const key = assertion.path?.toLowerCase();
    if (!key) {
      return { ok: false, message: "Header assertion missing path." };
    }
    actual = result.responseHeaders?.[key];
  } else {
    const baseBody = result.bodyJson ?? result.bodyText;
    actual = pickPath(baseBody, assertion.path);
  }

  switch (assertion.operator) {
    case "exists": {
      const ok = actual !== undefined && actual !== null;
      return { ok, message: ok ? "Exists assertion passed." : "Expected value to exist." };
    }
    case "contains": {
      const expected = String(assertion.expected ?? "");
      const actualText = typeof actual === "string" ? actual : JSON.stringify(actual);
      const ok = actualText?.includes(expected) ?? false;
      return { ok, message: ok ? "Contains assertion passed." : `Expected to contain "${expected}".` };
    }
    case "equals":
    default: {
      const ok = JSON.stringify(actual) === JSON.stringify(assertion.expected);
      return {
        ok,
        message: ok ? "Equals assertion passed." : `Expected ${JSON.stringify(assertion.expected)} but got ${JSON.stringify(actual)}.`,
      };
    }
  }
}

function interpolateString(value: string, context: Record<string, unknown>): string {
  return value.replace(/\{\{\s*([^}]+)\s*\}\}/g, (_full, expr: string) => {
    const selected = pickPath(context, expr.trim());
    if (selected === undefined || selected === null) {
      return "";
    }
    return typeof selected === "string" ? selected : JSON.stringify(selected);
  });
}

function interpolateValue(value: unknown, context: Record<string, unknown>): unknown {
  if (typeof value === "string") {
    return interpolateString(value, context);
  }
  if (Array.isArray(value)) {
    return value.map((item) => interpolateValue(item, context));
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      out[key] = interpolateValue(nested, context);
    }
    return out;
  }
  return value;
}

function setPath(target: Record<string, unknown>, dottedPath: string, value: unknown): void {
  const parts = dottedPath.split(".").filter(Boolean);
  if (parts.length === 0) {
    return;
  }

  let current: Record<string, unknown> = target;
  for (let i = 0; i < parts.length - 1; i += 1) {
    const key = parts[i];
    if (!key) {
      continue;
    }
    const maybe = current[key];
    if (!maybe || typeof maybe !== "object" || Array.isArray(maybe)) {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }

  const leaf = parts[parts.length - 1];
  if (leaf) {
    current[leaf] = value;
  }
}

function filterHistory(historyStore: RequestHistoryStore, filters: HistoryFilters): RequestHistoryStore {
  const filtered = historyStore.history.filter((item) => {
    if (filters.routeId && item.routeId !== filters.routeId) {
      return false;
    }
    if (typeof filters.status === "number" && item.status !== filters.status) {
      return false;
    }
    if (filters.errorOnly && item.ok) {
      return false;
    }
    return true;
  });
  return { history: filtered };
}

function appendHistory(historyStore: RequestHistoryStore, result: RequestExecutionResult): RequestHistoryStore {
  return {
    history: [result, ...historyStore.history].slice(0, 300),
  };
}

async function runRequest(
  baseUrl: string,
  manifest: RouteManifest,
  presets: HeaderPresetStore,
  input: RequestBody,
): Promise<RequestExecutionResult> {
  const route = manifest.routes.find((item) => item.id === input.routeId);
  if (!route) {
    return {
      routeId: input.routeId,
      url: "",
      method: "GET",
      ok: false,
      latencyMs: 0,
      error: `Route not found: ${input.routeId}`,
      occurredAt: new Date().toISOString(),
    };
  }

  const pathParams = toStringRecord(input.pathParams);
  const query = toStringRecord(input.query);
  const overrideHeaders = toStringRecord(input.headers);

  const preset = input.presetName
    ? presets.presets.find((item) => item.name === input.presetName)
    : undefined;

  const headers = resolveHeadersWithEnv({
    ...(preset?.headers ?? {}),
    ...overrideHeaders,
  });

  const effectiveBaseUrl = input.baseUrl?.trim() || baseUrl;
  const url = buildTargetUrl(effectiveBaseUrl, route.path, pathParams, query);
  const now = performance.now();
  const method = route.method === "ALL" ? "GET" : route.method;
  const shouldSendBody = !["GET", "HEAD", "OPTIONS"].includes(method);
  const bodyPayload = input.body ?? route.dummyBody;

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: shouldSendBody && bodyPayload !== undefined
        ? JSON.stringify(bodyPayload)
        : undefined,
    });

    const bodyText = await response.text();
    let bodyJson: unknown = undefined;

    if (bodyText) {
      try {
        bodyJson = JSON.parse(bodyText);
      } catch {
        bodyJson = undefined;
      }
    }

    return {
      routeId: route.id,
      url,
      method: route.method,
      status: response.status,
      ok: response.ok,
      latencyMs: Math.round(performance.now() - now),
      requestBody: shouldSendBody ? bodyPayload : undefined,
      responseHeaders: headersToObject(response.headers),
      bodyText,
      bodyJson,
      occurredAt: new Date().toISOString(),
    };
  } catch (error) {
    return {
      routeId: route.id,
      url,
      method: route.method,
      ok: false,
      latencyMs: Math.round(performance.now() - now),
      requestBody: bodyPayload,
      error: error instanceof Error ? error.message : String(error),
      occurredAt: new Date().toISOString(),
    };
  }
}

export async function startDashboardServer(
  options: DashboardServerOptions,
): Promise<DashboardServerHandle> {
  const app = Fastify({ logger: false });
  const host = options.host ?? "127.0.0.1";

  let manifest = options.manifest;
  let presets = await loadPresets(options.projectRoot);
  let historyStore = await loadHistory(options.projectRoot);
  let templates = await loadTemplates(options.projectRoot);
  let profiles = await loadProfiles(options.projectRoot);
  let suites = await loadSuites(options.projectRoot);
  let workflows = await loadWorkflows(options.projectRoot);

  const currentBaseUrl = (): string => {
    const active = profiles.activeProfileId
      ? profiles.profiles.find((item) => item.id === profiles.activeProfileId)
      : undefined;
    return active?.baseUrl || options.baseUrl;
  };

  app.get("/", async (_request, reply) => {
    reply.type("text/html; charset=utf-8");
    return DASHBOARD_HTML;
  });

  app.get("/brand/logo.png", async (_request, reply) => {
    reply.type("image/png");
    return readFile(new URL("../assets/logo.png", import.meta.url));
  });

  app.get("/api/routes", async () => ({
    baseUrl: currentBaseUrl(),
    generatedAt: manifest.generatedAt,
    framework: manifest.framework,
    routes: await buildRoutePayloads(manifest),
    activeProfileId: profiles.activeProfileId,
  }));

  app.post("/api/reload", async (_request, reply) => {
    if (!options.reloadManifest) {
      return reply.code(400).send({ ok: false, error: "Reload is not configured." });
    }
    manifest = await options.reloadManifest();
    return { ok: true, routes: manifest.routes.length };
  });

  app.get("/api/presets", async () => presets);
  app.post("/api/presets", async (request, reply) => {
    const payload = request.body as { name?: unknown; headers?: unknown };
    const name = typeof payload?.name === "string" ? payload.name.trim() : "";
    if (!name) {
      return reply.code(400).send({ ok: false, error: "Preset name is required." });
    }

    const record = {
      name,
      headers: toStringRecord(payload.headers),
      updatedAt: new Date().toISOString(),
    };

    presets = {
      presets: [
        ...presets.presets.filter((item) => item.name !== name),
        record,
      ],
    };
    await savePresets(options.projectRoot, presets);
    return { ok: true, preset: record };
  });

  app.delete("/api/presets/:name", async (request) => {
    const params = request.params as { name: string };
    presets = { presets: presets.presets.filter((item) => item.name !== params.name) };
    await savePresets(options.projectRoot, presets);
    return { ok: true };
  });

  app.get("/api/templates", async () => templates);
  app.post("/api/templates", async (request, reply) => {
    const payload = request.body as Partial<RequestBody> & { id?: string; name?: string };
    const routeId = typeof payload.routeId === "string" ? payload.routeId : "";
    const name = typeof payload.name === "string" ? payload.name.trim() : "";
    if (!routeId || !name) {
      return reply.code(400).send({ ok: false, error: "routeId and name are required." });
    }

    const templateId = payload.id?.trim() || randomUUID();
    const template = {
      id: templateId,
      routeId,
      name,
      pathParams: toStringRecord(payload.pathParams),
      query: toStringRecord(payload.query),
      headers: toStringRecord(payload.headers),
      body: payload.body ?? null,
      updatedAt: new Date().toISOString(),
    };

    templates = {
      templates: [
        ...templates.templates.filter((item) => item.id !== template.id),
        template,
      ],
    };
    await saveTemplates(options.projectRoot, templates);
    return { ok: true, template };
  });

  app.delete("/api/templates/:id", async (request) => {
    const params = request.params as { id: string };
    templates = {
      templates: templates.templates.filter((item) => item.id !== params.id),
    };
    await saveTemplates(options.projectRoot, templates);
    return { ok: true };
  });

  app.get("/api/profiles", async () => profiles);
  app.post("/api/profiles", async (request, reply) => {
    const payload = request.body as {
      id?: string;
      name?: string;
      baseUrl?: string;
      defaultPresetName?: string;
      setActive?: boolean;
    };
    const name = typeof payload.name === "string" ? payload.name.trim() : "";
    const baseUrl = typeof payload.baseUrl === "string" ? payload.baseUrl.trim() : "";
    if (!name || !baseUrl) {
      return reply.code(400).send({ ok: false, error: "name and baseUrl are required." });
    }

    const id = payload.id?.trim() || randomUUID();
    const profile = {
      id,
      name,
      baseUrl,
      defaultPresetName: payload.defaultPresetName,
      updatedAt: new Date().toISOString(),
    };

    profiles = {
      profiles: [
        ...profiles.profiles.filter((item) => item.id !== id),
        profile,
      ],
      activeProfileId: payload.setActive ? id : profiles.activeProfileId,
    };
    await saveProfiles(options.projectRoot, profiles);
    return { ok: true, profile, activeProfileId: profiles.activeProfileId };
  });

  app.post("/api/profiles/active", async (request, reply) => {
    const payload = request.body as { id?: string };
    const id = typeof payload.id === "string" ? payload.id : "";
    if (!profiles.profiles.some((item) => item.id === id)) {
      return reply.code(400).send({ ok: false, error: "Profile not found." });
    }
    profiles = {
      ...profiles,
      activeProfileId: id,
    };
    await saveProfiles(options.projectRoot, profiles);
    return { ok: true };
  });

  app.delete("/api/profiles/active", async () => {
    profiles = {
      ...profiles,
      activeProfileId: undefined,
    };
    await saveProfiles(options.projectRoot, profiles);
    return { ok: true };
  });

  app.delete("/api/profiles/:id", async (request) => {
    const params = request.params as { id: string };
    const filtered = profiles.profiles.filter((item) => item.id !== params.id);
    profiles = {
      profiles: filtered,
      activeProfileId: profiles.activeProfileId === params.id ? undefined : profiles.activeProfileId,
    };
    await saveProfiles(options.projectRoot, profiles);
    return { ok: true };
  });

  app.get("/api/suites", async () => suites);
  app.post("/api/suites", async (request, reply) => {
    const payload = request.body as { id?: string; name?: string; steps?: unknown };
    const name = typeof payload.name === "string" ? payload.name.trim() : "";
    if (!name || !Array.isArray(payload.steps)) {
      return reply.code(400).send({ ok: false, error: "name and steps are required." });
    }

    const id = payload.id?.trim() || randomUUID();
    const suite = {
      id,
      name,
      steps: payload.steps,
      updatedAt: new Date().toISOString(),
    };
    suites = {
      suites: [
        ...suites.suites.filter((item) => item.id !== id),
        suite as TestSuiteStore["suites"][number],
      ],
    };
    await saveSuites(options.projectRoot, suites);
    return { ok: true, suite };
  });
  app.delete("/api/suites/:id", async (request) => {
    const params = request.params as { id: string };
    suites = {
      suites: suites.suites.filter((item) => item.id !== params.id),
    };
    await saveSuites(options.projectRoot, suites);
    return { ok: true };
  });

  app.get("/api/workflows", async () => workflows);
  app.post("/api/workflows", async (request, reply) => {
    const payload = request.body as { id?: string; name?: string; steps?: unknown; continueOnFailure?: boolean };
    const name = typeof payload.name === "string" ? payload.name.trim() : "";
    if (!name || !Array.isArray(payload.steps)) {
      return reply.code(400).send({ ok: false, error: "name and steps are required." });
    }

    const id = payload.id?.trim() || randomUUID();
    const workflow = {
      id,
      name,
      steps: payload.steps,
      continueOnFailure: Boolean(payload.continueOnFailure),
      updatedAt: new Date().toISOString(),
    };
    workflows = {
      workflows: [
        ...workflows.workflows.filter((item) => item.id !== id),
        workflow as WorkflowStore["workflows"][number],
      ],
    };
    await saveWorkflows(options.projectRoot, workflows);
    return { ok: true, workflow };
  });
  app.delete("/api/workflows/:id", async (request) => {
    const params = request.params as { id: string };
    workflows = {
      workflows: workflows.workflows.filter((item) => item.id !== params.id),
    };
    await saveWorkflows(options.projectRoot, workflows);
    return { ok: true };
  });

  app.get("/api/history", async (request) => {
    const query = request.query as { routeId?: string; status?: string; errorOnly?: string };
    return filterHistory(historyStore, {
      routeId: query.routeId?.trim() || undefined,
      status: query.status ? Number(query.status) : undefined,
      errorOnly: query.errorOnly === "true",
    });
  });

  app.post("/api/collections/export", async () => ({
    profiles,
    presets,
    templates,
    suites,
    workflows,
  }));

  app.post("/api/collections/import", async (request, reply) => {
    const payload = request.body as Partial<{
      profiles: WorkspaceProfileStore;
      presets: HeaderPresetStore;
      templates: RequestTemplateStore;
      suites: TestSuiteStore;
      workflows: WorkflowStore;
    }>;

    if (!payload || typeof payload !== "object") {
      return reply.code(400).send({ ok: false, error: "Invalid payload." });
    }

    if (payload.profiles) {
      profiles = {
        profiles: Array.isArray(payload.profiles.profiles) ? payload.profiles.profiles : [],
        activeProfileId: payload.profiles.activeProfileId,
      };
      await saveProfiles(options.projectRoot, profiles);
    }

    if (payload.presets) {
      presets = {
        presets: Array.isArray(payload.presets.presets) ? payload.presets.presets : [],
      };
      await savePresets(options.projectRoot, presets);
    }

    if (payload.templates) {
      templates = {
        templates: Array.isArray(payload.templates.templates) ? payload.templates.templates : [],
      };
      await saveTemplates(options.projectRoot, templates);
    }

    if (payload.suites) {
      suites = {
        suites: Array.isArray(payload.suites.suites) ? payload.suites.suites : [],
      };
      await saveSuites(options.projectRoot, suites);
    }

    if (payload.workflows) {
      workflows = {
        workflows: Array.isArray(payload.workflows.workflows) ? payload.workflows.workflows : [],
      };
      await saveWorkflows(options.projectRoot, workflows);
    }

    return { ok: true };
  });

  app.post("/api/request", async (request) => {
    const payload = (request.body ?? {}) as RequestBody;
    const result = await runRequest(currentBaseUrl(), manifest, presets, payload);
    historyStore = appendHistory(historyStore, result);
    await saveHistory(options.projectRoot, historyStore);
    return result;
  });

  app.post("/api/suites/:id/run", async (request, reply) => {
    const params = request.params as { id: string };
    const suite = suites.suites.find((item) => item.id === params.id);
    if (!suite) {
      return reply.code(404).send({ ok: false, error: "Suite not found." });
    }

    const startedAt = new Date().toISOString();
    const stepResults: SuiteRunResult["steps"] = [];

    for (const step of suite.steps) {
      const requestPayload: RequestBody = {
        routeId: step.routeId,
        ...(step.request ?? {}),
      };
      const response = await runRequest(currentBaseUrl(), manifest, presets, requestPayload);
      const assertionResults = (step.assertions ?? []).map((assertion) => {
        const result = runAssertion(assertion as AssertionDefinition, response);
        return {
          assertionId: assertion.id,
          ok: result.ok,
          message: result.message,
        };
      });
      const ok = response.ok && assertionResults.every((item) => item.ok);
      stepResults.push({
        stepId: step.id,
        routeId: step.routeId,
        response,
        assertions: assertionResults,
        ok,
      });
      historyStore = appendHistory(historyStore, response);
    }

    await saveHistory(options.projectRoot, historyStore);
    const runResult: SuiteRunResult = {
      suiteId: suite.id,
      ok: stepResults.every((item) => item.ok),
      startedAt,
      completedAt: new Date().toISOString(),
      steps: stepResults,
    };
    return runResult;
  });

  app.post("/api/workflows/:id/run", async (request, reply) => {
    const params = request.params as { id: string };
    const workflow = workflows.workflows.find((item) => item.id === params.id);
    if (!workflow) {
      return reply.code(404).send({ ok: false, error: "Workflow not found." });
    }

    const startedAt = new Date().toISOString();
    const stepResults: WorkflowRunResult["steps"] = [];
    const context: Record<string, unknown> = { steps: {} };

    for (const step of workflow.steps) {
      const templateRequest = (step.request ?? {}) as Record<string, unknown>;
      const interpolated = interpolateValue(templateRequest, context) as Record<string, unknown>;

      if (step.mappings) {
        for (const [targetPath, expr] of Object.entries(step.mappings)) {
          const mappedValue = interpolateValue(expr, context);
          setPath(interpolated, targetPath, mappedValue);
        }
      }

      const requestPayload: RequestBody = {
        routeId: step.routeId,
        ...(interpolated as Partial<RequestBody>),
      };
      const response = await runRequest(currentBaseUrl(), manifest, presets, requestPayload);
      historyStore = appendHistory(historyStore, response);

      const assertionResults = (step.assertions ?? []).map((assertion) => {
        const result = runAssertion(assertion as AssertionDefinition, response);
        return {
          assertionId: assertion.id,
          ok: result.ok,
          message: result.message,
        };
      });

      const ok = response.ok && assertionResults.every((item) => item.ok);
      stepResults.push({
        stepId: step.id,
        routeId: step.routeId,
        response,
        assertions: assertionResults,
        ok,
      });

      (context.steps as Record<string, unknown>)[step.id] = {
        status: response.status,
        headers: response.responseHeaders,
        body: response.bodyJson ?? response.bodyText,
        error: response.error,
        ok: response.ok,
      };

      if (!ok && !workflow.continueOnFailure) {
        break;
      }
    }

    await saveHistory(options.projectRoot, historyStore);

    const runResult: WorkflowRunResult = {
      workflowId: workflow.id,
      ok: stepResults.every((item) => item.ok),
      startedAt,
      completedAt: new Date().toISOString(),
      steps: stepResults,
    };
    return runResult;
  });

  await app.listen({
    host,
    port: options.port,
  });

  const url = `http://${host}:${options.port}`;
  return {
    url,
    app,
    close: async () => {
      await app.close();
    },
  };
}
