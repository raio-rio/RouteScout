import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { Command } from "commander";
import { saveManifest, type ScanDiagnostic } from "@api-scout/core";
import { startDashboardServer } from "@api-scout/dashboard-server";
import { scanProject } from "@api-scout/scanner";

interface SharedOptions {
  project: string;
  baseUrl: string;
}

interface DevOptions extends SharedOptions {
  port: string;
  host: string;
  open?: boolean;
}

interface ScanOptions extends SharedOptions {
  json?: boolean;
}

function printDiagnostics(diagnostics: ScanDiagnostic[]): void {
  if (diagnostics.length === 0) {
    console.log("No diagnostics.");
    return;
  }

  for (const item of diagnostics) {
    const filePart = item.file ? ` (${item.file})` : "";
    console.log(`[${item.level.toUpperCase()}] ${item.message}${filePart}`);
  }
}

function openInBrowser(url: string): void {
  const launch = (command: string, args: string[]): void => {
    const child = spawn(command, args, { detached: true, stdio: "ignore" });
    child.on("error", () => {
      console.warn(`Unable to auto-open browser. Open this URL manually: ${url}`);
    });
    child.unref();
  };

  const platform = process.platform;
  if (platform === "win32") {
    launch("cmd", ["/c", "start", "", url]);
    return;
  }
  if (platform === "darwin") {
    launch("open", [url]);
    return;
  }
  launch("xdg-open", [url]);
}

async function runScan(options: ScanOptions): Promise<void> {
  const projectRoot = path.resolve(options.project);
  const result = await scanProject({ projectRoot });
  const manifestPath = await saveManifest(projectRoot, result.manifest);

  console.log(`Scanned project: ${projectRoot}`);
  console.log(`Discovered routes: ${result.manifest.routes.length}`);
  console.log(`Manifest saved: ${manifestPath}`);
  printDiagnostics(result.diagnostics);

  if (options.json) {
    console.log(JSON.stringify(result.manifest, null, 2));
  }
}

async function runDoctor(options: SharedOptions): Promise<void> {
  const projectRoot = path.resolve(options.project);
  const result = await scanProject({ projectRoot });

  console.log(`Framework detected: ${result.manifest.framework}`);
  console.log(`Routes discovered: ${result.manifest.routes.length}`);

  const warnings = result.diagnostics.filter((item: ScanDiagnostic) => item.level !== "info");
  if (warnings.length === 0) {
    console.log("No blocking warnings found.");
  } else {
    console.log("Diagnostics:");
    printDiagnostics(warnings);
  }
}

async function runDev(options: DevOptions): Promise<void> {
  const projectRoot = path.resolve(options.project);
  const port = Number(options.port) || 4310;
  const host = options.host || "127.0.0.1";

  let result = await scanProject({ projectRoot });
  await saveManifest(projectRoot, result.manifest);

  printDiagnostics(result.diagnostics);
  console.log(`Discovered routes: ${result.manifest.routes.length}`);

  const handle = await startDashboardServer({
    projectRoot,
    baseUrl: options.baseUrl,
    port,
    host,
    manifest: result.manifest,
    reloadManifest: async () => {
      result = await scanProject({ projectRoot });
      await saveManifest(projectRoot, result.manifest);
      printDiagnostics(result.diagnostics);
      return result.manifest;
    },
  });

  console.log(`Dashboard running at ${handle.url}`);
  console.log(`Testing base URL: ${options.baseUrl}`);
  console.log("Press Ctrl+C to stop.");

  if (options.open !== false) {
    openInBrowser(handle.url);
  }

  const shutdown = async (): Promise<void> => {
    await handle.close();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

export async function runCli(argv: string[] = process.argv): Promise<void> {
  const program = new Command();

  program
    .name("api-scout")
    .description("AST-powered API scanner + local dashboard for Express and NestJS")
    .version("0.1.0");

  program
    .command("scan")
    .description("Scan project routes and save route manifest")
    .option("--project <path>", "Project root path", process.cwd())
    .option("--base-url <url>", "Base URL for runtime calls", "http://localhost:3000")
    .option("--json", "Print manifest as JSON")
    .action(async (options: ScanOptions) => {
      await runScan(options);
    });

  program
    .command("doctor")
    .description("Show scan diagnostics for route extraction")
    .option("--project <path>", "Project root path", process.cwd())
    .option("--base-url <url>", "Base URL for runtime calls", "http://localhost:3000")
    .action(async (options: SharedOptions) => {
      await runDoctor(options);
    });

  program
    .command("dev")
    .description("Scan project and launch local testing dashboard")
    .option("--project <path>", "Project root path", process.cwd())
    .option("--base-url <url>", "Target API base URL", "http://localhost:3000")
    .option("--port <number>", "Dashboard port", "4310")
    .option("--host <host>", "Dashboard host", "127.0.0.1")
    .option("--no-open", "Do not open browser automatically")
    .action(async (options: DevOptions) => {
      await runDev(options);
    });

  await program.parseAsync(argv);
}
