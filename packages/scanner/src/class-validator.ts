import { Node, type ClassDeclaration, type ParameterDeclaration } from "ts-morph";
import type { JsonSchema } from "@api-scout/core";

function hasDecorator(node: { getDecorators(): import("ts-morph").Decorator[] }, names: string[]): boolean {
  return node
    .getDecorators()
    .some((decorator) => names.includes(decorator.getName()));
}

function getDecorator(node: { getDecorators(): import("ts-morph").Decorator[] }, name: string) {
  return node.getDecorators().find((decorator) => decorator.getName() === name);
}

function getNumberArg(decorator: import("ts-morph").Decorator | undefined, index = 0): number | undefined {
  const arg = decorator?.getCallExpression()?.getArguments()[index];
  if (!arg || !Node.isNumericLiteral(arg)) {
    return undefined;
  }
  return Number(arg.getText());
}

function getRegexPattern(decorator: import("ts-morph").Decorator | undefined): string | undefined {
  const arg = decorator?.getCallExpression()?.getArguments()[0];
  if (!arg || !Node.isRegularExpressionLiteral(arg)) {
    return undefined;
  }
  const text = arg.getText();
  const lastSlash = text.lastIndexOf("/");
  if (!text.startsWith("/") || lastSlash <= 0) {
    return undefined;
  }
  return text.slice(1, lastSlash);
}

function getEnumValues(decorator: import("ts-morph").Decorator | undefined): Array<string | number | boolean> | undefined {
  const arg = decorator?.getCallExpression()?.getArguments()[0];
  if (!arg) {
    return undefined;
  }

  if (Node.isArrayLiteralExpression(arg)) {
    const values: Array<string | number | boolean> = [];
    for (const el of arg.getElements()) {
      if (Node.isStringLiteral(el) || Node.isNoSubstitutionTemplateLiteral(el)) {
        values.push(el.getLiteralValue());
      } else if (Node.isNumericLiteral(el)) {
        values.push(Number(el.getText()));
      } else if (el.getKindName() === "TrueKeyword") {
        values.push(true);
      } else if (el.getKindName() === "FalseKeyword") {
        values.push(false);
      }
    }
    return values.length > 0 ? values : undefined;
  }

  return undefined;
}

function inferTypeFromNode(typeText: string): JsonSchema {
  if (typeText === "string") {
    return { type: "string" };
  }
  if (typeText === "number") {
    return { type: "number" };
  }
  if (typeText === "boolean") {
    return { type: "boolean" };
  }
  if (typeText.endsWith("[]") || typeText.startsWith("Array<")) {
    return { type: "array", items: { type: "string" } };
  }
  return { type: "string" };
}

export function classToSchema(classDecl: ClassDeclaration): JsonSchema {
  const properties: Record<string, JsonSchema> = {};
  const required: string[] = [];

  for (const property of classDecl.getProperties()) {
    const name = property.getName();
    let schema: JsonSchema = inferTypeFromNode(property.getType().getText(property));

    if (hasDecorator(property, ["IsString", "IsEmail", "IsUUID", "IsDateString"])) {
      schema = { type: "string" };
    }
    if (hasDecorator(property, ["IsInt"])) {
      schema = { type: "integer" };
    }
    if (hasDecorator(property, ["IsNumber", "Min", "Max"])) {
      schema = { type: "number" };
    }
    if (hasDecorator(property, ["IsBoolean"])) {
      schema = { type: "boolean" };
    }
    if (hasDecorator(property, ["IsArray"])) {
      schema = { type: "array", items: { type: "string" } };
    }

    if (hasDecorator(property, ["IsEmail"])) {
      schema = { ...schema, format: "email" };
    }
    if (hasDecorator(property, ["IsUUID"])) {
      schema = { ...schema, format: "uuid" };
    }
    if (hasDecorator(property, ["IsDateString"])) {
      schema = { ...schema, format: "date-time" };
    }

    const minDecorator = getDecorator(property, "Min");
    const maxDecorator = getDecorator(property, "Max");
    const min = getNumberArg(minDecorator);
    const max = getNumberArg(maxDecorator);
    if (min !== undefined) {
      schema = { ...schema, minimum: min };
    }
    if (max !== undefined) {
      schema = { ...schema, maximum: max };
    }

    const minLengthDecorator = getDecorator(property, "MinLength");
    const maxLengthDecorator = getDecorator(property, "MaxLength");
    const lengthDecorator = getDecorator(property, "Length");
    const minLength = getNumberArg(minLengthDecorator) ?? getNumberArg(lengthDecorator, 0);
    const maxLength = getNumberArg(maxLengthDecorator) ?? getNumberArg(lengthDecorator, 1);
    if (minLength !== undefined) {
      schema = { ...schema, minLength };
    }
    if (maxLength !== undefined) {
      schema = { ...schema, maxLength };
    }

    const matchesDecorator = getDecorator(property, "Matches");
    const pattern = getRegexPattern(matchesDecorator);
    if (pattern) {
      schema = { ...schema, pattern };
    }

    const enumDecorator = getDecorator(property, "IsIn");
    const enumValues = getEnumValues(enumDecorator);
    if (enumValues) {
      schema = { ...schema, enum: enumValues };
    }

    const isOptional = hasDecorator(property, ["IsOptional"]);

    properties[name] = schema;
    if (!isOptional) {
      required.push(name);
    }
  }

  return {
    type: "object",
    properties,
    required,
  };
}

export function classSchemaFromBodyParam(param: ParameterDeclaration): JsonSchema | null {
  if (!param.getDecorators().some((d) => d.getName() === "Body")) {
    return null;
  }

  const type = param.getType();
  const symbol = type.getSymbol();
  if (!symbol) {
    return null;
  }

  for (const decl of symbol.getDeclarations()) {
    if (Node.isClassDeclaration(decl)) {
      return classToSchema(decl);
    }
  }

  return null;
}
