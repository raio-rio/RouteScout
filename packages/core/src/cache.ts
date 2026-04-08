import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type {
  HeaderPresetStore,
  RequestHistoryStore,
  RequestTemplateStore,
  RouteManifest,
  TeamConfig,
  TestSuiteStore,
  WorkflowStore,
  WorkspaceProfileStore,
} from "./types.js";

export const TOOL_DIR = ".apitool";
export const CACHE_DIR = "cache";

export function getToolDir(projectRoot: string): string {
  return path.join(projectRoot, TOOL_DIR);
}

export function getCacheDir(projectRoot: string): string {
  return path.join(getToolDir(projectRoot), CACHE_DIR);
}

export function getConfigPath(projectRoot: string): string {
  return path.join(getToolDir(projectRoot), "config.json");
}

export function getManifestPath(projectRoot: string): string {
  return path.join(getCacheDir(projectRoot), "routes.manifest.json");
}

export function getPresetsPath(projectRoot: string): string {
  return path.join(getCacheDir(projectRoot), "presets.json");
}

export function getHistoryPath(projectRoot: string): string {
  return path.join(getCacheDir(projectRoot), "history.json");
}

export async function ensureToolDirs(projectRoot: string): Promise<void> {
  await mkdir(getToolDir(projectRoot), { recursive: true });
  await mkdir(getCacheDir(projectRoot), { recursive: true });
}

export async function writeJsonFile(filePath: string, value: unknown): Promise<void> {
  await writeFile(filePath, JSON.stringify(value, null, 2), "utf8");
}

export async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function defaultConfig(): TeamConfig {
  return {
    version: 1,
    presets: [],
    templates: [],
    profiles: [],
    suites: [],
    workflows: [],
  };
}

function normalizeConfig(input: Partial<TeamConfig> | null | undefined): TeamConfig {
  if (!input) {
    return defaultConfig();
  }

  return {
    version: typeof input.version === "number" ? input.version : 1,
    presets: Array.isArray(input.presets) ? input.presets : [],
    templates: Array.isArray(input.templates) ? input.templates : [],
    profiles: Array.isArray(input.profiles) ? input.profiles : [],
    activeProfileId: typeof input.activeProfileId === "string" ? input.activeProfileId : undefined,
    suites: Array.isArray(input.suites) ? input.suites : [],
    workflows: Array.isArray(input.workflows) ? input.workflows : [],
  };
}

export async function loadTeamConfig(projectRoot: string): Promise<TeamConfig> {
  const configPath = getConfigPath(projectRoot);
  const config = normalizeConfig(await readJsonFile<Partial<TeamConfig> | null>(configPath, null));

  // Backward-compatible migration path for old presets location.
  if (config.presets.length === 0) {
    const legacyPresets = await readJsonFile<HeaderPresetStore>(getPresetsPath(projectRoot), { presets: [] });
    if (legacyPresets.presets.length > 0) {
      config.presets = legacyPresets.presets;
      await saveTeamConfig(projectRoot, config);
    }
  }

  return config;
}

export async function saveTeamConfig(projectRoot: string, config: TeamConfig): Promise<void> {
  await ensureToolDirs(projectRoot);
  await writeJsonFile(getConfigPath(projectRoot), normalizeConfig(config));
}

async function withConfig(
  projectRoot: string,
  fn: (config: TeamConfig) => TeamConfig,
): Promise<void> {
  const current = await loadTeamConfig(projectRoot);
  const next = normalizeConfig(fn(current));
  await saveTeamConfig(projectRoot, next);
}

export async function saveManifest(projectRoot: string, manifest: RouteManifest): Promise<string> {
  await ensureToolDirs(projectRoot);
  const manifestPath = getManifestPath(projectRoot);
  await writeJsonFile(manifestPath, manifest);
  return manifestPath;
}

export async function loadManifest(projectRoot: string): Promise<RouteManifest | null> {
  const fallback = null as RouteManifest | null;
  return readJsonFile(getManifestPath(projectRoot), fallback);
}

export async function loadPresets(projectRoot: string): Promise<HeaderPresetStore> {
  const config = await loadTeamConfig(projectRoot);
  return { presets: config.presets };
}

export async function savePresets(projectRoot: string, store: HeaderPresetStore): Promise<void> {
  await withConfig(projectRoot, (config) => ({
    ...config,
    presets: store.presets,
  }));
}

export async function loadTemplates(projectRoot: string): Promise<RequestTemplateStore> {
  const config = await loadTeamConfig(projectRoot);
  return { templates: config.templates };
}

export async function saveTemplates(projectRoot: string, store: RequestTemplateStore): Promise<void> {
  await withConfig(projectRoot, (config) => ({
    ...config,
    templates: store.templates,
  }));
}

export async function loadProfiles(projectRoot: string): Promise<WorkspaceProfileStore> {
  const config = await loadTeamConfig(projectRoot);
  return {
    profiles: config.profiles,
    activeProfileId: config.activeProfileId,
  };
}

export async function saveProfiles(projectRoot: string, store: WorkspaceProfileStore): Promise<void> {
  await withConfig(projectRoot, (config) => ({
    ...config,
    profiles: store.profiles,
    activeProfileId: store.activeProfileId,
  }));
}

export async function loadSuites(projectRoot: string): Promise<TestSuiteStore> {
  const config = await loadTeamConfig(projectRoot);
  return {
    suites: config.suites,
  };
}

export async function saveSuites(projectRoot: string, store: TestSuiteStore): Promise<void> {
  await withConfig(projectRoot, (config) => ({
    ...config,
    suites: store.suites,
  }));
}

export async function loadWorkflows(projectRoot: string): Promise<WorkflowStore> {
  const config = await loadTeamConfig(projectRoot);
  return {
    workflows: config.workflows,
  };
}

export async function saveWorkflows(projectRoot: string, store: WorkflowStore): Promise<void> {
  await withConfig(projectRoot, (config) => ({
    ...config,
    workflows: store.workflows,
  }));
}

export async function loadHistory(projectRoot: string): Promise<RequestHistoryStore> {
  return readJsonFile<RequestHistoryStore>(getHistoryPath(projectRoot), { history: [] });
}

export async function saveHistory(projectRoot: string, store: RequestHistoryStore): Promise<void> {
  await ensureToolDirs(projectRoot);
  await writeJsonFile(getHistoryPath(projectRoot), store);
}
