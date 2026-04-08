import {
  Node,
  type Expression,
  type ObjectLiteralExpression,
  type SourceFile,
  SyntaxKind,
} from "ts-morph";
import type { JsonSchema } from "@api-scout/core";

function expressionToLiteral(
  expression: Expression,
): string | number | boolean | null | undefined {
  if (Node.isStringLiteral(expression) || Node.isNoSubstitutionTemplateLiteral(expression)) {
    return expression.getLiteralValue();
  }
  if (Node.isNumericLiteral(expression)) {
    return Number(expression.getText());
  }
  if (expression.getKind() === SyntaxKind.TrueKeyword) {
    return true;
  }
  if (expression.getKind() === SyntaxKind.FalseKeyword) {
    return false;
  }
  if (expression.getKind() === SyntaxKind.NullKeyword) {
    return null;
  }
  return undefined;
}

function parseObjectShape(objectLiteral: ObjectLiteralExpression): JsonSchema {
  const properties: Record<string, JsonSchema> = {};
  const required: string[] = [];

  for (const property of objectLiteral.getProperties()) {
    if (!Node.isPropertyAssignment(property)) {
      continue;
    }

    const nameNode = property.getNameNode();
    const key = Node.isIdentifier(nameNode)
      ? nameNode.getText()
      : Node.isStringLiteral(nameNode)
        ? nameNode.getLiteralValue()
        : null;

    if (!key) {
      continue;
    }

    const parsed = parseZodExpression(property.getInitializer());
    if (!parsed) {
      continue;
    }

    properties[key] = parsed.schema;
    if (!parsed.optional) {
      required.push(key);
    }
  }

  return {
    type: "object",
    properties,
    required,
  };
}

function isZodNamespace(expression: Expression): boolean {
  return Node.isIdentifier(expression) && expression.getText() === "z";
}

export interface ParsedZod {
  schema: JsonSchema;
  optional: boolean;
}

function parseNumberArg(arg?: Expression): number | undefined {
  if (!arg) {
    return undefined;
  }
  if (Node.isNumericLiteral(arg)) {
    return Number(arg.getText());
  }
  return undefined;
}

function parseStringArg(arg?: Expression): string | undefined {
  if (!arg) {
    return undefined;
  }
  if (Node.isStringLiteral(arg) || Node.isNoSubstitutionTemplateLiteral(arg)) {
    return arg.getLiteralValue();
  }
  return undefined;
}

function parseRegexPattern(arg?: Expression): string | undefined {
  if (!arg) {
    return undefined;
  }
  if (Node.isRegularExpressionLiteral(arg)) {
    const text = arg.getText();
    const lastSlash = text.lastIndexOf("/");
    if (text.startsWith("/") && lastSlash > 0) {
      return text.slice(1, lastSlash);
    }
  }
  return undefined;
}

function applyZodModifier(
  inner: ParsedZod,
  method: string,
  args: Expression[],
): ParsedZod {
  switch (method) {
    case "optional":
      return { schema: inner.schema, optional: true };
    case "nullable":
      return {
        schema: { ...inner.schema, nullable: true },
        optional: inner.optional,
      };
    case "default": {
      const firstArg = args[0];
      const defaultValue = firstArg ? expressionToLiteral(firstArg) : undefined;
      return {
        schema: { ...inner.schema, default: defaultValue },
        optional: true,
      };
    }
    case "describe": {
      const description = parseStringArg(args[0]);
      if (!description) {
        return inner;
      }
      return {
        ...inner,
        schema: { ...inner.schema, description },
      };
    }
    case "int":
      return {
        ...inner,
        schema: {
          ...inner.schema,
          type: "integer",
        },
      };
    case "min": {
      const min = parseNumberArg(args[0]);
      if (min === undefined) {
        return inner;
      }
      if (inner.schema.type === "string") {
        return { ...inner, schema: { ...inner.schema, minLength: min } };
      }
      return { ...inner, schema: { ...inner.schema, minimum: min } };
    }
    case "max": {
      const max = parseNumberArg(args[0]);
      if (max === undefined) {
        return inner;
      }
      if (inner.schema.type === "string") {
        return { ...inner, schema: { ...inner.schema, maxLength: max } };
      }
      return { ...inner, schema: { ...inner.schema, maximum: max } };
    }
    case "email":
      return { ...inner, schema: { ...inner.schema, format: "email" } };
    case "url":
      return { ...inner, schema: { ...inner.schema, format: "uri" } };
    case "uuid":
      return { ...inner, schema: { ...inner.schema, format: "uuid" } };
    case "datetime":
      return { ...inner, schema: { ...inner.schema, format: "date-time" } };
    case "regex": {
      const pattern = parseRegexPattern(args[0]);
      if (!pattern) {
        return inner;
      }
      return { ...inner, schema: { ...inner.schema, pattern } };
    }
    case "nonempty":
      if (inner.schema.type === "string") {
        return { ...inner, schema: { ...inner.schema, minLength: 1 } };
      }
      return inner;
    default:
      return inner;
  }
}

export function parseZodExpression(expression?: Expression): ParsedZod | null {
  if (!expression || !Node.isCallExpression(expression)) {
    return null;
  }

  const callee = expression.getExpression();
  if (!Node.isPropertyAccessExpression(callee)) {
    return null;
  }

  const method = callee.getName();
  const owner = callee.getExpression();

  if (isZodNamespace(owner)) {
    switch (method) {
      case "string":
        return { schema: { type: "string" }, optional: false };
      case "number":
        return { schema: { type: "number" }, optional: false };
      case "int":
        return { schema: { type: "integer" }, optional: false };
      case "boolean":
        return { schema: { type: "boolean" }, optional: false };
      case "literal": {
        const literalArg = expression.getArguments()[0];
        if (!literalArg || !Node.isExpression(literalArg)) {
          return null;
        }
        const value = expressionToLiteral(literalArg);
        if (value === undefined) {
          return null;
        }
        const type = value === null
          ? "null"
          : typeof value === "string"
            ? "string"
            : typeof value === "number"
              ? "number"
              : typeof value === "boolean"
                ? "boolean"
                : "string";
        return { schema: { type, enum: [value] }, optional: false };
      }
      case "enum": {
        const arg = expression.getArguments()[0];
        if (!arg || !Node.isArrayLiteralExpression(arg)) {
          return null;
        }
        const items = arg.getElements()
          .filter(Node.isExpression)
          .map((item) => expressionToLiteral(item))
          .filter((item): item is string | number | boolean | null => item !== undefined);
        if (items.length === 0) {
          return null;
        }
        return { schema: { type: "string", enum: items }, optional: false };
      }
      case "object": {
        const arg = expression.getArguments()[0];
        if (!arg || !Node.isObjectLiteralExpression(arg)) {
          return null;
        }
        return { schema: parseObjectShape(arg), optional: false };
      }
      case "array": {
        const arg = expression.getArguments()[0];
        const child = Node.isExpression(arg) ? parseZodExpression(arg) : null;
        return {
          schema: { type: "array", items: child?.schema ?? { type: "string" } },
          optional: false,
        };
      }
      default:
        return null;
    }
  }

  const inner = Node.isCallExpression(owner) ? parseZodExpression(owner) : null;
  if (!inner) {
    return null;
  }
  const args = expression.getArguments().filter(Node.isExpression);
  return applyZodModifier(inner, method, args);
}

export function collectZodSchemas(sourceFile: SourceFile): Map<string, JsonSchema> {
  const schemas = new Map<string, JsonSchema>();

  for (const variableDecl of sourceFile.getVariableDeclarations()) {
    const name = variableDecl.getName();
    const initializer = variableDecl.getInitializer();
    if (!initializer || !Node.isExpression(initializer)) {
      continue;
    }

    const parsed = parseZodExpression(initializer);
    if (parsed?.schema) {
      schemas.set(name, parsed.schema);
    }
  }

  return schemas;
}
