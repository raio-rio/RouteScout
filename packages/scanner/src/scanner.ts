import { access } from "node:fs/promises";
import path from "node:path";
import type { RouteManifestEntry, ScanDiagnostic, ScanResult } from "@api-scout/core";
import { Project, ScriptTarget, ts } from "ts-morph";
import { extractExpressRoutes } from "./express.js";
import { detectFramework } from "./framework.js";
import { extractNestRoutes } from "./nest.js";

export interface ScanProjectOptions {
  projectRoot: string;
}

const EXCLUDED_PATH_SEGMENTS = [
  `${path.sep}node_modules${path.sep}`,
  `${path.sep}dist${path.sep}`,
  `${path.sep}.git${path.sep}`,
  `${path.sep}.apitool${path.sep}`,
  `${path.sep}coverage${path.sep}`,
];

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function shouldIncludeSource(filePath: string): boolean {
  for (const segment of EXCLUDED_PATH_SEGMENTS) {
    if (filePath.includes(segment)) {
      return false;
    }
  }
  return /\.(ts|tsx|js|jsx)$/.test(filePath);
}

async function createProject(projectRoot: string): Promise<Project> {
  const tsConfigPath = path.join(projectRoot, "tsconfig.json");
  if (await fileExists(tsConfigPath)) {
    return new Project({
      tsConfigFilePath: tsConfigPath,
      skipAddingFilesFromTsConfig: false,
      skipFileDependencyResolution: true,
    });
  }

  const project = new Project({
    compilerOptions: {
      allowJs: true,
      target: ScriptTarget.ES2022,
      module: ts.ModuleKind.NodeNext,
      moduleResolution: ts.ModuleResolutionKind.NodeNext,
      esModuleInterop: true,
      resolveJsonModule: true,
    },
  });

  project.addSourceFilesAtPaths([
    path.join(projectRoot, "**/*.ts"),
    path.join(projectRoot, "**/*.tsx"),
    path.join(projectRoot, "**/*.js"),
    path.join(projectRoot, "**/*.jsx"),
    `!${path.join(projectRoot, "**/node_modules/**")}`,
    `!${path.join(projectRoot, "**/dist/**")}`,
    `!${path.join(projectRoot, "**/.git/**")}`,
    `!${path.join(projectRoot, "**/.apitool/**")}`,
  ]);

  return project;
}

function dedupeRoutes(routes: RouteManifestEntry[]): RouteManifestEntry[] {
  const deduped = new Map<string, RouteManifestEntry>();

  for (const route of routes) {
    const key = [route.framework, route.method, route.path, route.sourceRef.file, route.sourceRef.line].join("|");
    if (!deduped.has(key)) {
      deduped.set(key, route);
    }
  }

  return [...deduped.values()].sort((a, b) => {
    if (a.path === b.path) {
      return a.method.localeCompare(b.method);
    }
    return a.path.localeCompare(b.path);
  });
}

export async function scanProject(options: ScanProjectOptions): Promise<ScanResult> {
  const projectRoot = path.resolve(options.projectRoot);
  const diagnostics: ScanDiagnostic[] = [];

  const project = await createProject(projectRoot);
  const sourceFiles = project
    .getSourceFiles()
    .filter((sourceFile) => shouldIncludeSource(sourceFile.getFilePath()));

  if (sourceFiles.length === 0) {
    diagnostics.push({
      level: "warn",
      message: "No TypeScript/JavaScript source files found for scanning.",
    });
  }

  const framework = detectFramework(sourceFiles);
  if (framework === "unknown") {
    diagnostics.push({
      level: "warn",
      message: "No Express or NestJS imports detected. Route discovery may be incomplete.",
    });
  }

  const routes: RouteManifestEntry[] = [];

  if (framework === "express" || framework === "mixed" || framework === "unknown") {
    routes.push(...extractExpressRoutes(sourceFiles, diagnostics));
  }

  if (framework === "nest" || framework === "mixed" || framework === "unknown") {
    routes.push(...extractNestRoutes(sourceFiles, diagnostics));
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    projectRoot,
    framework,
    routes: dedupeRoutes(routes),
  };

  if (manifest.routes.length === 0) {
    diagnostics.push({
      level: "warn",
      message: "No routes discovered. Check framework patterns and project root.",
    });
  }

  return {
    manifest,
    diagnostics,
  };
}
