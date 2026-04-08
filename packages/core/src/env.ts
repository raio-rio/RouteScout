export function resolveEnvPlaceholders(input: string): string {
  return input.replace(/\$\{([A-Z0-9_]+)\}/gi, (_full, key: string) => {
    const value = process.env[key];
    return value ?? "";
  });
}

export function resolveHeadersWithEnv(
  headers: Record<string, string>,
): Record<string, string> {
  const resolved: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    resolved[key] = resolveEnvPlaceholders(value);
  }
  return resolved;
}
