export function extractPathParams(routePath: string): string[] {
  const params = new Set<string>();
  const matcher = /:([A-Za-z0-9_]+)/g;

  let match: RegExpExecArray | null;
  while ((match = matcher.exec(routePath)) !== null) {
    const value = match[1];
    if (value) {
      params.add(value);
    }
  }

  return [...params];
}

export function normalizeRoutePath(routePath: string): string {
  if (!routePath) {
    return "/";
  }

  let normalized = routePath.trim();
  if (!normalized.startsWith("/")) {
    normalized = `/${normalized}`;
  }

  normalized = normalized.replace(/\/+/g, "/");
  normalized = normalized.replace(/\/$/, "");

  return normalized || "/";
}

export function joinRouteParts(prefix: string, child: string): string {
  if (!prefix || prefix === "/") {
    return normalizeRoutePath(child);
  }
  if (!child || child === "/") {
    return normalizeRoutePath(prefix);
  }
  return normalizeRoutePath(`${prefix}/${child}`);
}
