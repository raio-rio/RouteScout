import {
  extractPathParams,
  generateDummyFromSchema,
  joinRouteParts,
  normalizeRoutePath,
  type AuthRequirement,
  type InferredField,
  type JsonSchema,
  type RouteManifestEntry,
  type ScanDiagnostic,
} from "@api-scout/core";
import {
  Node,
  SyntaxKind,
  type ClassDeclaration,
  type Decorator,
  type MethodDeclaration,
  type SourceFile,
} from "ts-morph";
import { classSchemaFromBodyParam } from "./class-validator.js";

const NEST_METHOD_DECORATORS = new Map<string, RouteManifestEntry["method"]>([
  ["Get", "GET"],
  ["Post", "POST"],
  ["Put", "PUT"],
  ["Patch", "PATCH"],
  ["Delete", "DELETE"],
  ["Options", "OPTIONS"],
  ["Head", "HEAD"],
  ["All", "ALL"],
]);

interface BodyFieldConstraint {
  minimum?: number;
  exclusiveMinimum?: number;
  maximum?: number;
  exclusiveMaximum?: number;
}

interface NumericBound {
  value: number;
  exclusive: boolean;
}

function firstSchemaType(schema?: JsonSchema): InferredField["type"] {
  if (!schema?.type) {
    return "unknown";
  }
  if (Array.isArray(schema.type)) {
    return schema.type[0] ?? "unknown";
  }
  return schema.type;
}

function bodyFieldsFromSchema(schema: JsonSchema | undefined, bodyKeys: Set<string>): InferredField[] {
  if (!schema) {
    return [...bodyKeys].map((name) => ({
      name,
      location: "body",
      type: "string",
      required: true,
      confidence: "medium",
      source: "decorator",
    }));
  }

  if (schema.type !== "object" || !schema.properties) {
    return [{
      name: "$body",
      location: "body",
      type: firstSchemaType(schema),
      required: true,
      confidence: "high",
      source: "schema",
      format: schema.format,
      minimum: schema.minimum,
      maximum: schema.maximum,
      minLength: schema.minLength,
      maxLength: schema.maxLength,
      pattern: schema.pattern,
      enum: schema.enum,
    }];
  }

  const requiredSet = new Set(schema.required ?? []);
  return Object.entries(schema.properties).map(([name, value]) => ({
    name,
    location: "body",
    type: firstSchemaType(value),
    required: requiredSet.has(name),
    confidence: "high",
    source: "schema",
    format: value.format,
    minimum: value.minimum,
    maximum: value.maximum,
    minLength: value.minLength,
    maxLength: value.maxLength,
    pattern: value.pattern,
    enum: value.enum,
  }));
}

function lowerBoundFromField(field?: Pick<InferredField, "minimum" | "exclusiveMinimum">): NumericBound | undefined {
  if (!field) {
    return undefined;
  }

  if (typeof field.exclusiveMinimum === "number") {
    return { value: field.exclusiveMinimum, exclusive: true };
  }

  if (typeof field.minimum === "number") {
    return { value: field.minimum, exclusive: false };
  }

  return undefined;
}

function upperBoundFromField(field?: Pick<InferredField, "maximum" | "exclusiveMaximum">): NumericBound | undefined {
  if (!field) {
    return undefined;
  }

  if (typeof field.exclusiveMaximum === "number") {
    return { value: field.exclusiveMaximum, exclusive: true };
  }

  if (typeof field.maximum === "number") {
    return { value: field.maximum, exclusive: false };
  }

  return undefined;
}

function lowerBoundFromConstraint(
  constraint?: Pick<BodyFieldConstraint, "minimum" | "exclusiveMinimum">,
): NumericBound | undefined {
  if (!constraint) {
    return undefined;
  }

  if (typeof constraint.exclusiveMinimum === "number") {
    return { value: constraint.exclusiveMinimum, exclusive: true };
  }

  if (typeof constraint.minimum === "number") {
    return { value: constraint.minimum, exclusive: false };
  }

  return undefined;
}

function upperBoundFromConstraint(
  constraint?: Pick<BodyFieldConstraint, "maximum" | "exclusiveMaximum">,
): NumericBound | undefined {
  if (!constraint) {
    return undefined;
  }

  if (typeof constraint.exclusiveMaximum === "number") {
    return { value: constraint.exclusiveMaximum, exclusive: true };
  }

  if (typeof constraint.maximum === "number") {
    return { value: constraint.maximum, exclusive: false };
  }

  return undefined;
}

function stricterLowerBound(left?: NumericBound, right?: NumericBound): NumericBound | undefined {
  if (!left) {
    return right;
  }

  if (!right) {
    return left;
  }

  if (right.value > left.value) {
    return right;
  }

  if (right.value < left.value) {
    return left;
  }

  return right.exclusive && !left.exclusive ? right : left;
}

function stricterUpperBound(left?: NumericBound, right?: NumericBound): NumericBound | undefined {
  if (!left) {
    return right;
  }

  if (!right) {
    return left;
  }

  if (right.value < left.value) {
    return right;
  }

  if (right.value > left.value) {
    return left;
  }

  return right.exclusive && !left.exclusive ? right : left;
}

function assignBoundsToField(
  field: InferredField,
  lower?: NumericBound,
  upper?: NumericBound,
): InferredField {
  delete field.minimum;
  delete field.exclusiveMinimum;
  delete field.maximum;
  delete field.exclusiveMaximum;

  if (lower) {
    if (lower.exclusive) {
      field.exclusiveMinimum = lower.value;
    } else {
      field.minimum = lower.value;
    }
  }

  if (upper) {
    if (upper.exclusive) {
      field.exclusiveMaximum = upper.value;
    } else {
      field.maximum = upper.value;
    }
  }

  return field;
}

function mergeBodyFieldConstraint(
  existing: BodyFieldConstraint | undefined,
  next: BodyFieldConstraint,
): BodyFieldConstraint {
  const merged: BodyFieldConstraint = {};
  const lower = stricterLowerBound(lowerBoundFromConstraint(existing), lowerBoundFromConstraint(next));
  const upper = stricterUpperBound(upperBoundFromConstraint(existing), upperBoundFromConstraint(next));

  if (lower) {
    if (lower.exclusive) {
      merged.exclusiveMinimum = lower.value;
    } else {
      merged.minimum = lower.value;
    }
  }

  if (upper) {
    if (upper.exclusive) {
      merged.exclusiveMaximum = upper.value;
    } else {
      merged.maximum = upper.value;
    }
  }

  return merged;
}

function applyBodyConstraints(
  fields: InferredField[],
  bodyConstraints: Map<string, BodyFieldConstraint>,
): InferredField[] {
  if (bodyConstraints.size === 0) {
    return fields;
  }

  const bodyFieldMap = new Map<string, InferredField>();
  for (const field of fields) {
    if (field.location === "body") {
      bodyFieldMap.set(field.name, field);
    }
  }

  for (const [name, constraint] of bodyConstraints) {
    let field = bodyFieldMap.get(name);
    if (!field) {
      field = {
        name,
        location: "body",
        type: "number",
        required: false,
        confidence: "high",
        source: "heuristic",
      };
      fields.push(field);
      bodyFieldMap.set(name, field);
    } else {
      if (field.source !== "schema" && (field.type === "string" || field.type === "unknown" || !field.type)) {
        field.type = "number";
      }
      field.confidence = "high";
    }

    assignBoundsToField(
      field,
      stricterLowerBound(lowerBoundFromField(field), lowerBoundFromConstraint(constraint)),
      stricterUpperBound(upperBoundFromField(field), upperBoundFromConstraint(constraint)),
    );
  }

  return fields;
}

function detectAuthFromHeader(headerName: string): AuthRequirement | null {
  const normalized = headerName.toLowerCase();
  if (normalized === "authorization") {
    return {
      kind: "bearer",
      headerName,
      scheme: "Bearer",
      confidence: "high",
      source: "decorator",
    };
  }
  if (normalized === "cookie") {
    return {
      kind: "cookie",
      headerName,
      confidence: "high",
      source: "decorator",
    };
  }
  if (normalized.includes("api-key") || normalized === "x-api-key" || normalized === "apikey") {
    return {
      kind: "apiKey",
      headerName,
      confidence: "high",
      source: "decorator",
    };
  }
  return null;
}

function getDecoratorStringArg(decorator: Decorator): string | null {
  const callExpr = decorator.getCallExpression();
  if (!callExpr) {
    return null;
  }

  const firstArg = callExpr.getArguments()[0];
  if (!firstArg || !Node.isExpression(firstArg)) {
    return null;
  }

  if (Node.isStringLiteral(firstArg) || Node.isNoSubstitutionTemplateLiteral(firstArg)) {
    return firstArg.getLiteralValue();
  }

  return null;
}

function getControllerPath(classDecl: ClassDeclaration): string {
  for (const decorator of classDecl.getDecorators()) {
    if (decorator.getName() !== "Controller") {
      continue;
    }
    return getDecoratorStringArg(decorator) ?? "/";
  }
  return "/";
}

function buildBodySchemaFromKeys(keys: Set<string>): JsonSchema | undefined {
  if (!keys.size) {
    return undefined;
  }

  const properties: Record<string, JsonSchema> = {};
  for (const key of keys) {
    properties[key] = { type: "string" };
  }

  return {
    type: "object",
    properties,
    required: [...keys],
  };
}

function getNumericLiteralValue(expression?: Parameters<typeof Node.isExpression>[0]): number | null {
  if (!expression || !Node.isExpression(expression)) {
    return null;
  }

  if (Node.isNumericLiteral(expression)) {
    return Number(expression.getLiteralValue());
  }

  if (
    Node.isPrefixUnaryExpression(expression) &&
    expression.getOperatorToken() === SyntaxKind.MinusToken &&
    Node.isNumericLiteral(expression.getOperand())
  ) {
    return -Number(expression.getOperand().getLiteralValue());
  }

  return null;
}

function getBodyFieldName(
  expression: Parameters<typeof Node.isExpression>[0],
  bodyObjectParams: Set<string>,
  bodyValueParams: Map<string, string>,
): string | null {
  if (!Node.isExpression(expression)) {
    return null;
  }

  if (Node.isIdentifier(expression)) {
    return bodyValueParams.get(expression.getText()) ?? null;
  }

  if (Node.isPropertyAccessExpression(expression)) {
    const target = expression.getExpression();
    if (Node.isIdentifier(target) && bodyObjectParams.has(target.getText())) {
      return expression.getName();
    }
  }

  if (Node.isElementAccessExpression(expression)) {
    const target = expression.getExpression();
    const keyArg = expression.getArgumentExpression();
    if (
      keyArg &&
      Node.isIdentifier(target) &&
      bodyObjectParams.has(target.getText()) &&
      (Node.isStringLiteral(keyArg) || Node.isNoSubstitutionTemplateLiteral(keyArg))
    ) {
      return keyArg.getLiteralValue();
    }
  }

  return null;
}

function invertOperator(kind: SyntaxKind): SyntaxKind | null {
  switch (kind) {
    case SyntaxKind.LessThanToken:
      return SyntaxKind.GreaterThanToken;
    case SyntaxKind.LessThanEqualsToken:
      return SyntaxKind.GreaterThanEqualsToken;
    case SyntaxKind.GreaterThanToken:
      return SyntaxKind.LessThanToken;
    case SyntaxKind.GreaterThanEqualsToken:
      return SyntaxKind.LessThanEqualsToken;
    default:
      return null;
  }
}

function constraintFromRejectingComparison(
  operatorKind: SyntaxKind,
  value: number,
): BodyFieldConstraint | null {
  switch (operatorKind) {
    case SyntaxKind.LessThanToken:
      return { minimum: value };
    case SyntaxKind.LessThanEqualsToken:
      return { exclusiveMinimum: value };
    case SyntaxKind.GreaterThanToken:
      return { maximum: value };
    case SyntaxKind.GreaterThanEqualsToken:
      return { exclusiveMaximum: value };
    default:
      return null;
  }
}

function collectRejectedBodyConstraints(
  methodDecl: MethodDeclaration,
  bodyObjectParams: Set<string>,
  bodyValueParams: Map<string, string>,
  bodyKeys: Set<string>,
): Map<string, BodyFieldConstraint> {
  const constraints = new Map<string, BodyFieldConstraint>();

  if (bodyObjectParams.size === 0 && bodyValueParams.size === 0) {
    return constraints;
  }

  for (const ifStmt of methodDecl.getDescendantsOfKind(SyntaxKind.IfStatement)) {
    if (!ifStmt.getThenStatement().getFirstDescendantByKind(SyntaxKind.ThrowStatement)) {
      continue;
    }

    const expression = ifStmt.getExpression();
    const comparisons = expression.getDescendantsOfKind(SyntaxKind.BinaryExpression);
    if (Node.isBinaryExpression(expression)) {
      comparisons.unshift(expression);
    }

    for (const comparison of comparisons) {
      const operatorKind = comparison.getOperatorToken().getKind();
      let fieldName = getBodyFieldName(comparison.getLeft(), bodyObjectParams, bodyValueParams);
      let literalValue = getNumericLiteralValue(comparison.getRight());

      if (!fieldName || literalValue === null) {
        const swappedField = getBodyFieldName(comparison.getRight(), bodyObjectParams, bodyValueParams);
        const swappedValue = getNumericLiteralValue(comparison.getLeft());
        const invertedOperator = invertOperator(operatorKind);
        if (!swappedField || swappedValue === null || invertedOperator === null) {
          continue;
        }

        fieldName = swappedField;
        literalValue = swappedValue;
        const swappedConstraint = constraintFromRejectingComparison(invertedOperator, literalValue);
        if (swappedConstraint) {
          bodyKeys.add(fieldName);
          constraints.set(fieldName, mergeBodyFieldConstraint(constraints.get(fieldName), swappedConstraint));
        }
        continue;
      }

      const constraint = constraintFromRejectingComparison(operatorKind, literalValue);
      if (!constraint) {
        continue;
      }

      bodyKeys.add(fieldName);
      constraints.set(fieldName, mergeBodyFieldConstraint(constraints.get(fieldName), constraint));
    }
  }

  return constraints;
}

export function extractNestRoutes(
  sourceFiles: SourceFile[],
  diagnostics: ScanDiagnostic[],
): RouteManifestEntry[] {
  const routes: RouteManifestEntry[] = [];
  let routeCounter = 0;

  for (const sourceFile of sourceFiles) {
    for (const classDecl of sourceFile.getClasses()) {
      if (!classDecl.getDecorators().some((d) => d.getName() === "Controller")) {
        continue;
      }

      const controllerPath = getControllerPath(classDecl);

      for (const methodDecl of classDecl.getMethods()) {
        let method: RouteManifestEntry["method"] | null = null;
        let methodPath = "/";

        for (const decorator of methodDecl.getDecorators()) {
          const mapped = NEST_METHOD_DECORATORS.get(decorator.getName());
          if (!mapped) {
            continue;
          }
          method = mapped;
          methodPath = getDecoratorStringArg(decorator) ?? "/";
          break;
        }

        if (!method) {
          continue;
        }

        const queryParams = new Set<string>();
        const headerParams = new Set<string>();
        const bodyKeys = new Set<string>();
        const bodyObjectParams = new Set<string>();
        const bodyValueParams = new Map<string, string>();
        const authRequirements: AuthRequirement[] = [];
        const authSeen = new Set<string>();

        const addAuth = (item: AuthRequirement): void => {
          const key = [item.kind, item.headerName, item.cookieName, item.note].join("|");
          if (!authSeen.has(key)) {
            authSeen.add(key);
            authRequirements.push(item);
          }
        };

        let bodySchema: JsonSchema | undefined;

        for (const decorator of [...classDecl.getDecorators(), ...methodDecl.getDecorators()]) {
          const decoratorName = decorator.getName();
          if (decoratorName === "UseGuards") {
            const args = decorator.getCallExpression()?.getArguments() ?? [];
            for (const arg of args) {
              if (!Node.isExpression(arg)) {
                continue;
              }
              const guardText = arg.getText();
              if (/(auth|guard|jwt|token|session|apikey)/i.test(guardText)) {
                addAuth({
                  kind: "custom",
                  note: `Guard detected: ${guardText}`,
                  confidence: "low",
                  source: "decorator",
                });
              }
            }
          } else if (/(auth|guard)/i.test(decoratorName)) {
            addAuth({
              kind: "custom",
              note: `Decorator detected: ${decoratorName}`,
              confidence: "low",
              source: "decorator",
            });
          }
        }

        for (const param of methodDecl.getParameters()) {
          for (const decorator of param.getDecorators()) {
            const decoratorName = decorator.getName();
            const argName = getDecoratorStringArg(decorator);
            const fallbackName = param.getName();

            if (decoratorName === "Param") {
              if (argName) {
                // handled by path parsing from URL
              }
            }

            if (decoratorName === "Query") {
              queryParams.add(argName ?? fallbackName);
            }

            if (decoratorName === "Headers") {
              headerParams.add(argName ?? fallbackName);
              if (argName) {
                const authFromHeader = detectAuthFromHeader(argName);
                if (authFromHeader) {
                  addAuth(authFromHeader);
                }
              }
            }

            if (decoratorName === "Body") {
              if (argName) {
                bodyKeys.add(argName);
                bodyValueParams.set(fallbackName, argName);
              } else {
                bodyObjectParams.add(fallbackName);
              }

              if (!bodySchema) {
                bodySchema = classSchemaFromBodyParam(param) ?? undefined;
              }
            }
          }
        }

        if (!bodySchema) {
          bodySchema = buildBodySchemaFromKeys(bodyKeys);
        }

        const bodyConstraints = collectRejectedBodyConstraints(
          methodDecl,
          bodyObjectParams,
          bodyValueParams,
          bodyKeys,
        );
        const fullPath = normalizeRoutePath(joinRouteParts(controllerPath, methodPath));
        const pathParams = extractPathParams(fullPath);
        const inferredFields = applyBodyConstraints([
          ...pathParams.map((name) => ({
            name,
            location: "path" as const,
            type: "string" as const,
            required: true,
            confidence: "high" as const,
            source: "decorator" as const,
          })),
          ...[...queryParams].map((name) => ({
            name,
            location: "query" as const,
            type: "string" as const,
            required: false,
            confidence: "high" as const,
            source: "decorator" as const,
          })),
          ...[...headerParams].map((name) => ({
            name,
            location: "header" as const,
            type: "string" as const,
            required: false,
            confidence: "high" as const,
            source: "decorator" as const,
          })),
          ...bodyFieldsFromSchema(bodySchema, bodyKeys),
        ], bodyConstraints);
        const position = sourceFile.getLineAndColumnAtPos(methodDecl.getStart());

        routes.push({
          id: `nest-${routeCounter}`,
          framework: "nest",
          method,
          path: fullPath,
          pathParams,
          queryParams: [...queryParams],
          headers: [...headerParams],
          bodySchema,
          dummyBody: generateDummyFromSchema(bodySchema),
          inferredFields,
          authRequirements,
          sourceRef: {
            file: sourceFile.getFilePath(),
            line: position.line,
            column: position.column,
          },
        });

        routeCounter += 1;
      }
    }
  }

  if (routes.length === 0) {
    diagnostics.push({
      level: "info",
      message: "No NestJS controllers detected.",
    });
  }

  return routes;
}
