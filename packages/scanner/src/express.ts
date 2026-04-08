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
  type FunctionDeclaration,
  type FunctionExpression,
  type CallExpression,
  type Expression,
  type ArrowFunction,
  type SourceFile,
} from "ts-morph";
import { collectZodSchemas } from "./zod.js";

const EXPRESS_METHODS = new Map<string, RouteManifestEntry["method"]>([
  ["get", "GET"],
  ["post", "POST"],
  ["put", "PUT"],
  ["patch", "PATCH"],
  ["delete", "DELETE"],
  ["options", "OPTIONS"],
  ["head", "HEAD"],
  ["all", "ALL"],
]);

interface RouterEdge {
  parentVar: string;
  childVar: string;
  prefix: string;
}

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

interface HandlerInferredData {
  queryParams: Set<string>;
  headers: Set<string>;
  bodyKeys: Set<string>;
  bodyConstraints: Map<string, BodyFieldConstraint>;
  authHints: Set<string>;
}

function createInferredData(): HandlerInferredData {
  return {
    queryParams: new Set<string>(),
    headers: new Set<string>(),
    bodyKeys: new Set<string>(),
    bodyConstraints: new Map<string, BodyFieldConstraint>(),
    authHints: new Set<string>(),
  };
}

function mergeInferredData(target: HandlerInferredData, source: HandlerInferredData): void {
  source.queryParams.forEach((item) => target.queryParams.add(item));
  source.headers.forEach((item) => target.headers.add(item));
  source.bodyKeys.forEach((item) => target.bodyKeys.add(item));
  source.bodyConstraints.forEach((constraint, name) => {
    target.bodyConstraints.set(name, mergeBodyFieldConstraint(target.bodyConstraints.get(name), constraint));
  });
  source.authHints.forEach((item) => target.authHints.add(item));
}

function getStringArg(expression?: Expression): string | null {
  if (!expression) {
    return null;
  }
  if (Node.isStringLiteral(expression) || Node.isNoSubstitutionTemplateLiteral(expression)) {
    return expression.getLiteralValue();
  }
  return null;
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

function buildBodyFieldsFromSchema(
  schema: JsonSchema | undefined,
  bodyKeys: Set<string>,
): InferredField[] {
  if (!schema) {
    return [...bodyKeys].map((name) => ({
      name,
      location: "body",
      type: "string",
      required: true,
      confidence: "medium",
      source: "handler-access",
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

function buildInferredFields(
  pathParams: string[],
  queryParams: Set<string>,
  headers: Set<string>,
  bodySchema: JsonSchema | undefined,
  bodyKeys: Set<string>,
  bodyConstraints: Map<string, BodyFieldConstraint>,
): InferredField[] {
  const out: InferredField[] = [];

  for (const name of pathParams) {
    out.push({
      name,
      location: "path",
      type: "string",
      required: true,
      confidence: "high",
      source: "schema",
    });
  }

  for (const name of queryParams) {
    out.push({
      name,
      location: "query",
      type: "string",
      required: false,
      confidence: "medium",
      source: "handler-access",
    });
  }

  for (const name of headers) {
    out.push({
      name,
      location: "header",
      type: "string",
      required: false,
      confidence: "medium",
      source: "handler-access",
    });
  }

  out.push(...buildBodyFieldsFromSchema(bodySchema, bodyKeys));
  return applyBodyConstraints(out, bodyConstraints);
}

function detectAuthFromHeaderName(headerName: string): AuthRequirement | null {
  const normalized = headerName.toLowerCase();
  if (normalized === "authorization") {
    return {
      kind: "bearer",
      headerName,
      scheme: "Bearer",
      confidence: "high",
      source: "handler-access",
    };
  }
  if (normalized === "cookie") {
    return {
      kind: "cookie",
      headerName,
      confidence: "high",
      source: "handler-access",
    };
  }
  if (normalized.includes("api-key") || normalized === "x-api-key" || normalized === "apikey") {
    return {
      kind: "apiKey",
      headerName,
      confidence: "high",
      source: "handler-access",
    };
  }
  return null;
}

function authRequirementsFromSignals(
  headers: Set<string>,
  authHints: Set<string>,
  middlewareNames: string[],
): AuthRequirement[] {
  const requirements: AuthRequirement[] = [];
  const seen = new Set<string>();

  const push = (item: AuthRequirement) => {
    const key = [item.kind, item.headerName, item.cookieName, item.note].join("|");
    if (!seen.has(key)) {
      seen.add(key);
      requirements.push(item);
    }
  };

  for (const header of headers) {
    const detected = detectAuthFromHeaderName(header);
    if (detected) {
      push(detected);
    }
  }

  for (const hint of authHints) {
    if (hint === "session") {
      push({
        kind: "session",
        note: "Session access in handler",
        confidence: "medium",
        source: "handler-access",
      });
      continue;
    }
    if (hint.startsWith("cookie:")) {
      push({
        kind: "cookie",
        cookieName: hint.slice("cookie:".length),
        confidence: "high",
        source: "handler-access",
      });
      continue;
    }
    if (hint.startsWith("header:")) {
      const headerName = hint.slice("header:".length);
      const detected = detectAuthFromHeaderName(headerName);
      if (detected) {
        push(detected);
      }
    }
  }

  for (const middlewareName of middlewareNames) {
    if (!/(auth|guard|jwt|token|session|apikey)/i.test(middlewareName)) {
      continue;
    }

    push({
      kind: "custom",
      note: `Auth middleware detected: ${middlewareName}`,
      confidence: "low",
      source: "middleware",
    });
  }

  return requirements;
}

function collectExpressFactoryNames(sourceFile: SourceFile): {
  expressFactoryNames: Set<string>;
  routerFactoryNames: Set<string>;
} {
  const expressFactoryNames = new Set<string>();
  const routerFactoryNames = new Set<string>();

  for (const importDecl of sourceFile.getImportDeclarations()) {
    if (importDecl.getModuleSpecifierValue() !== "express") {
      continue;
    }

    const defaultImport = importDecl.getDefaultImport();
    if (defaultImport) {
      expressFactoryNames.add(defaultImport.getText());
    }

    for (const namedImport of importDecl.getNamedImports()) {
      const name = namedImport.getName();
      const alias = namedImport.getAliasNode()?.getText() ?? name;
      if (name === "Router") {
        routerFactoryNames.add(alias);
      }
    }
  }

  // fallback for common symbol when imported as default
  expressFactoryNames.add("express");
  routerFactoryNames.add("Router");

  return { expressFactoryNames, routerFactoryNames };
}

function getPropertyCall(callExpr: CallExpression): {
  target: string;
  method: string;
} | null {
  const expression = callExpr.getExpression();
  if (!Node.isPropertyAccessExpression(expression)) {
    return null;
  }
  const receiver = expression.getExpression();
  if (!Node.isIdentifier(receiver)) {
    return null;
  }
  return {
    target: receiver.getText(),
    method: expression.getName(),
  };
}

function getNumericLiteralValue(expression?: Expression): number | null {
  if (!expression) {
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

function getReqBodyFieldName(expression: Expression, reqName: string): string | null {
  if (Node.isPropertyAccessExpression(expression)) {
    const target = expression.getExpression();
    if (
      Node.isPropertyAccessExpression(target) &&
      target.getName() === "body" &&
      Node.isIdentifier(target.getExpression()) &&
      target.getExpression().getText() === reqName
    ) {
      return expression.getName();
    }
  }

  if (Node.isElementAccessExpression(expression)) {
    const target = expression.getExpression();
    const keyArg = expression.getArgumentExpression();
    if (
      keyArg &&
      Node.isPropertyAccessExpression(target) &&
      target.getName() === "body" &&
      Node.isIdentifier(target.getExpression()) &&
      target.getExpression().getText() === reqName
    ) {
      return getStringArg(keyArg);
    }
  }

  return null;
}

function isRejectingResponseCall(callExpr: CallExpression, resName?: string): boolean {
  if (!resName) {
    return false;
  }

  const expression = callExpr.getExpression();
  if (!Node.isPropertyAccessExpression(expression)) {
    return false;
  }

  const firstArg = callExpr.getArguments()[0];
  const statusCode = firstArg && Node.isExpression(firstArg) ? getNumericLiteralValue(firstArg) : null;
  if (statusCode === null || statusCode < 400) {
    return false;
  }

  const method = expression.getName();
  if (method === "sendStatus") {
    return Node.isIdentifier(expression.getExpression()) && expression.getExpression().getText() === resName;
  }

  if (method !== "status") {
    return false;
  }

  return Node.isIdentifier(expression.getExpression()) && expression.getExpression().getText() === resName;
}

function branchRejectsRequest(branch: Node, resName?: string): boolean {
  if (branch.getFirstDescendantByKind(SyntaxKind.ThrowStatement)) {
    return true;
  }

  return branch
    .getDescendantsOfKind(SyntaxKind.CallExpression)
    .some((callExpr) => isRejectingResponseCall(callExpr, resName));
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

function conditionComparisons(condition: Expression) {
  const comparisons = condition.getDescendantsOfKind(SyntaxKind.BinaryExpression);
  if (Node.isBinaryExpression(condition)) {
    comparisons.unshift(condition);
  }
  return comparisons;
}

function collectRejectedBodyConstraints(
  handler: FunctionDeclaration | FunctionExpression | ArrowFunction,
  reqName: string,
  resName: string | undefined,
  data: HandlerInferredData,
): void {
  for (const ifStmt of handler.getDescendantsOfKind(SyntaxKind.IfStatement)) {
    const thenStatement = ifStmt.getThenStatement();
    if (!branchRejectsRequest(thenStatement, resName)) {
      continue;
    }

    for (const comparison of conditionComparisons(ifStmt.getExpression())) {
      const operatorKind = comparison.getOperatorToken().getKind();
      let fieldName = getReqBodyFieldName(comparison.getLeft(), reqName);
      let literalValue = getNumericLiteralValue(comparison.getRight());

      if (!fieldName || literalValue === null) {
        const swappedField = getReqBodyFieldName(comparison.getRight(), reqName);
        const swappedValue = getNumericLiteralValue(comparison.getLeft());
        const invertedOperator = invertOperator(operatorKind);
        if (!swappedField || swappedValue === null || invertedOperator === null) {
          continue;
        }
        fieldName = swappedField;
        literalValue = swappedValue;
        const constraint = constraintFromRejectingComparison(invertedOperator, literalValue);
        if (constraint) {
          data.bodyKeys.add(fieldName);
          data.bodyConstraints.set(
            fieldName,
            mergeBodyFieldConstraint(data.bodyConstraints.get(fieldName), constraint),
          );
        }
        continue;
      }

      const constraint = constraintFromRejectingComparison(operatorKind, literalValue);
      if (!constraint) {
        continue;
      }

      data.bodyKeys.add(fieldName);
      data.bodyConstraints.set(
        fieldName,
        mergeBodyFieldConstraint(data.bodyConstraints.get(fieldName), constraint),
      );
    }
  }
}

function inferDataFromFunctionLike(
  handler: FunctionDeclaration | FunctionExpression | ArrowFunction,
): HandlerInferredData {
  const data = createInferredData();

  const firstParam = handler.getParameters()[0];
  if (!firstParam) {
    return data;
  }

  const nameNode = firstParam.getNameNode();
  if (!Node.isIdentifier(nameNode)) {
    return data;
  }
  const reqName = nameNode.getText();
  const secondParam = handler.getParameters()[1];
  const resNameNode = secondParam?.getNameNode();
  const resName = Node.isIdentifier(resNameNode) ? resNameNode.getText() : undefined;

  for (const access of handler.getDescendantsOfKind(SyntaxKind.PropertyAccessExpression)) {
    const target = access.getExpression();
    if (!Node.isPropertyAccessExpression(target)) {
      continue;
    }

    const root = target.getExpression();
    if (!Node.isIdentifier(root) || root.getText() !== reqName) {
      continue;
    }

    const bucket = target.getName();
    const key = access.getName();

    if (bucket === "query") {
      data.queryParams.add(key);
    } else if (bucket === "headers") {
      data.headers.add(key);
      data.authHints.add(`header:${key}`);
    } else if (bucket === "body") {
      data.bodyKeys.add(key);
    } else if (bucket === "cookies") {
      data.authHints.add(`cookie:${key}`);
    } else if (bucket === "session") {
      data.authHints.add("session");
    }
  }

  for (const access of handler.getDescendantsOfKind(SyntaxKind.ElementAccessExpression)) {
    const target = access.getExpression();
    if (!Node.isPropertyAccessExpression(target)) {
      continue;
    }

    const root = target.getExpression();
    if (!Node.isIdentifier(root) || root.getText() !== reqName) {
      continue;
    }

    const keyArg = access.getArgumentExpression();
    if (!keyArg) {
      continue;
    }

    const literalKey = getStringArg(keyArg);
    if (!literalKey) {
      continue;
    }

    const bucket = target.getName();
    if (bucket === "query") {
      data.queryParams.add(literalKey);
    } else if (bucket === "headers") {
      data.headers.add(literalKey);
      data.authHints.add(`header:${literalKey}`);
    } else if (bucket === "body") {
      data.bodyKeys.add(literalKey);
    } else if (bucket === "cookies") {
      data.authHints.add(`cookie:${literalKey}`);
    }
  }

  for (const callExpr of handler.getDescendantsOfKind(SyntaxKind.CallExpression)) {
    const expr = callExpr.getExpression();
    if (!Node.isPropertyAccessExpression(expr)) {
      continue;
    }
    const owner = expr.getExpression();
    if (!Node.isIdentifier(owner) || owner.getText() !== reqName) {
      continue;
    }

    const method = expr.getName();
    if (method !== "get" && method !== "header") {
      continue;
    }

    const firstArg = callExpr.getArguments()[0];
    if (!firstArg || !Node.isExpression(firstArg)) {
      continue;
    }

    const headerName = getStringArg(firstArg);
    if (headerName) {
      data.headers.add(headerName);
      data.authHints.add(`header:${headerName}`);
    }
  }

  collectRejectedBodyConstraints(handler, reqName, resName, data);

  return data;
}

function inferHandlerData(handler: Expression): HandlerInferredData {
  const data = createInferredData();

  if (Node.isArrowFunction(handler) || Node.isFunctionExpression(handler)) {
    return inferDataFromFunctionLike(handler);
  }

  if (!Node.isIdentifier(handler)) {
    return data;
  }

  const symbol = handler.getSymbol();
  if (!symbol) {
    return data;
  }

  for (const decl of symbol.getDeclarations()) {
    if (Node.isFunctionDeclaration(decl)) {
      mergeInferredData(data, inferDataFromFunctionLike(decl));
      continue;
    }

    if (!Node.isVariableDeclaration(decl)) {
      continue;
    }

    const initializer = decl.getInitializer();
    if (!initializer) {
      continue;
    }

    if (Node.isArrowFunction(initializer) || Node.isFunctionExpression(initializer)) {
      mergeInferredData(data, inferDataFromFunctionLike(initializer));
    }
  }

  return data;
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

function findSchemaInExpression(
  expression: Expression,
  zodSchemas: Map<string, JsonSchema>,
): JsonSchema | undefined {
  if (Node.isIdentifier(expression)) {
    return zodSchemas.get(expression.getText());
  }

  if (Node.isCallExpression(expression)) {
    for (const arg of expression.getArguments()) {
      if (Node.isExpression(arg)) {
        const schema = findSchemaInExpression(arg, zodSchemas);
        if (schema) {
          return schema;
        }
      }
    }
  }

  return undefined;
}

function computePrefixes(
  appVars: Set<string>,
  routerVars: Set<string>,
  edges: RouterEdge[],
): Map<string, Set<string>> {
  const prefixMap = new Map<string, Set<string>>();

  const ensureEntry = (name: string): Set<string> => {
    let set = prefixMap.get(name);
    if (!set) {
      set = new Set<string>();
      prefixMap.set(name, set);
    }
    return set;
  };

  const queue: string[] = [];

  for (const appVar of appVars) {
    ensureEntry(appVar).add("/");
    queue.push(appVar);
  }

  if (queue.length === 0) {
    for (const routerVar of routerVars) {
      ensureEntry(routerVar).add("/");
      queue.push(routerVar);
    }
  }

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) {
      continue;
    }

    const currentPrefixes = prefixMap.get(current);
    if (!currentPrefixes) {
      continue;
    }

    for (const edge of edges) {
      if (edge.parentVar !== current) {
        continue;
      }

      const childSet = ensureEntry(edge.childVar);
      let changed = false;

      for (const basePrefix of currentPrefixes) {
        const combined = joinRouteParts(basePrefix, edge.prefix);
        if (!childSet.has(combined)) {
          childSet.add(combined);
          changed = true;
        }
      }

      if (changed) {
        queue.push(edge.childVar);
      }
    }
  }

  for (const routerVar of routerVars) {
    const entry = ensureEntry(routerVar);
    if (entry.size === 0) {
      entry.add("/");
    }
  }

  return prefixMap;
}

export function extractExpressRoutes(
  sourceFiles: SourceFile[],
  diagnostics: ScanDiagnostic[],
): RouteManifestEntry[] {
  const routes: RouteManifestEntry[] = [];
  let routeCounter = 0;

  for (const sourceFile of sourceFiles) {
    const { expressFactoryNames, routerFactoryNames } = collectExpressFactoryNames(sourceFile);
    const zodSchemas = collectZodSchemas(sourceFile);

    const appVars = new Set<string>();
    const routerVars = new Set<string>();
    const edges: RouterEdge[] = [];

    for (const variableDecl of sourceFile.getVariableDeclarations()) {
      const name = variableDecl.getName();
      const initializer = variableDecl.getInitializer();
      if (!initializer || !Node.isCallExpression(initializer)) {
        continue;
      }

      const callee = initializer.getExpression();

      if (Node.isIdentifier(callee) && expressFactoryNames.has(callee.getText())) {
        appVars.add(name);
        continue;
      }

      if (Node.isIdentifier(callee) && routerFactoryNames.has(callee.getText())) {
        routerVars.add(name);
        continue;
      }

      if (Node.isPropertyAccessExpression(callee)) {
        const calleeMethod = callee.getName();
        const owner = callee.getExpression();
        if (
          calleeMethod === "Router" &&
          Node.isIdentifier(owner) &&
          expressFactoryNames.has(owner.getText())
        ) {
          routerVars.add(name);
        }
      }
    }

    for (const callExpr of sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression)) {
      const callInfo = getPropertyCall(callExpr);
      if (!callInfo) {
        continue;
      }

      const { target, method } = callInfo;
      const isKnownRouter = appVars.has(target) || routerVars.has(target);
      if (!isKnownRouter) {
        continue;
      }

      if (method === "use") {
        const args = callExpr.getArguments();
        if (args.length === 0) {
          continue;
        }

        let prefix = "/";
        let childExpr: Expression | undefined;

        if (args.length >= 2 && Node.isExpression(args[0])) {
          prefix = getStringArg(args[0]) ?? "/";
          childExpr = Node.isExpression(args[1]) ? args[1] : undefined;
        } else if (Node.isExpression(args[0])) {
          childExpr = args[0];
        }

        if (childExpr && Node.isIdentifier(childExpr)) {
          const childName = childExpr.getText();
          if (appVars.has(childName) || routerVars.has(childName)) {
            edges.push({
              parentVar: target,
              childVar: childName,
              prefix,
            });
          }
        }
      }
    }

    const prefixMap = computePrefixes(appVars, routerVars, edges);

    for (const callExpr of sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression)) {
      const callInfo = getPropertyCall(callExpr);
      if (!callInfo) {
        continue;
      }

      const method = EXPRESS_METHODS.get(callInfo.method);
      if (!method) {
        continue;
      }

      const routeVar = callInfo.target;
      if (!appVars.has(routeVar) && !routerVars.has(routeVar)) {
        continue;
      }

      const args = callExpr.getArguments();
      if (args.length === 0) {
        continue;
      }

      let routePath = "/";
      let handlerStartIndex = 0;

      if (Node.isExpression(args[0])) {
        const literalPath = getStringArg(args[0]);
        if (literalPath !== null) {
          routePath = literalPath;
          handlerStartIndex = 1;
        } else if (!Node.isArrowFunction(args[0]) && !Node.isFunctionExpression(args[0])) {
          diagnostics.push({
            level: "warn",
            file: sourceFile.getFilePath(),
            message: `Skipping dynamic Express route path in ${callExpr.getText()}`,
          });
          continue;
        }
      }

      const handlerArgs = args.slice(handlerStartIndex).filter(Node.isExpression);
      const inferredQuery = new Set<string>();
      const inferredHeaders = new Set<string>();
      const inferredBodyKeys = new Set<string>();
      const inferredBodyConstraints = new Map<string, BodyFieldConstraint>();
      const inferredAuthHints = new Set<string>();
      const middlewareNames: string[] = [];

      let bodySchema: JsonSchema | undefined;
      for (const arg of handlerArgs) {
        const maybeSchema = findSchemaInExpression(arg, zodSchemas);
        if (maybeSchema) {
          bodySchema = maybeSchema;
          break;
        }
      }

      for (const arg of handlerArgs) {
        if (Node.isIdentifier(arg)) {
          middlewareNames.push(arg.getText());
        }

        const inferred = inferHandlerData(arg);
        inferred.queryParams.forEach((v) => inferredQuery.add(v));
        inferred.headers.forEach((v) => inferredHeaders.add(v));
        inferred.bodyKeys.forEach((v) => inferredBodyKeys.add(v));
        inferred.bodyConstraints.forEach((constraint, name) => {
          inferredBodyConstraints.set(
            name,
            mergeBodyFieldConstraint(inferredBodyConstraints.get(name), constraint),
          );
        });
        inferred.authHints.forEach((v) => inferredAuthHints.add(v));
      }

      if (!bodySchema) {
        bodySchema = buildBodySchemaFromKeys(inferredBodyKeys);
      }

      const prefixes = [...(prefixMap.get(routeVar) ?? new Set(["/"]))];

      const position = sourceFile.getLineAndColumnAtPos(callExpr.getStart());

      for (const prefix of prefixes) {
        const fullPath = normalizeRoutePath(joinRouteParts(prefix, routePath));
        const pathParams = extractPathParams(fullPath);
        const inferredFields = buildInferredFields(
          pathParams,
          inferredQuery,
          inferredHeaders,
          bodySchema,
          inferredBodyKeys,
          inferredBodyConstraints,
        );
        const authRequirements = authRequirementsFromSignals(
          inferredHeaders,
          inferredAuthHints,
          middlewareNames,
        );
        const route: RouteManifestEntry = {
          id: `express-${routeCounter}`,
          framework: "express",
          method,
          path: fullPath,
          pathParams,
          queryParams: [...inferredQuery],
          headers: [...inferredHeaders],
          bodySchema,
          dummyBody: generateDummyFromSchema(bodySchema),
          inferredFields,
          authRequirements,
          sourceRef: {
            file: sourceFile.getFilePath(),
            line: position.line,
            column: position.column,
          },
        };
        routes.push(route);
        routeCounter += 1;
      }
    }
  }

  return routes;
}
