import type { SourceFile } from "ts-morph";

export type DetectedFramework = "express" | "nest" | "mixed" | "unknown";

export function detectFramework(sourceFiles: SourceFile[]): DetectedFramework {
  let hasExpress = false;
  let hasNest = false;

  for (const sourceFile of sourceFiles) {
    for (const importDecl of sourceFile.getImportDeclarations()) {
      const moduleName = importDecl.getModuleSpecifierValue();
      if (moduleName === "express") {
        hasExpress = true;
      }
      if (moduleName.startsWith("@nestjs/")) {
        hasNest = true;
      }
    }
  }

  if (hasExpress && hasNest) {
    return "mixed";
  }
  if (hasExpress) {
    return "express";
  }
  if (hasNest) {
    return "nest";
  }
  return "unknown";
}
