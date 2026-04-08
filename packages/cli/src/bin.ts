#!/usr/bin/env node
import { runCli } from "./index.js";

runCli().catch((error) => {
  const message = error instanceof Error ? error.stack ?? error.message : String(error);
  console.error(message);
  process.exit(1);
});
