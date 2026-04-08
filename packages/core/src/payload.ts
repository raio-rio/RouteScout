import type { JsonSchema } from "./types.js";

function pickType(schema: JsonSchema): string {
  if (Array.isArray(schema.type)) {
    return schema.type[0] ?? "string";
  }
  return schema.type ?? "string";
}

function fromEnum(schema: JsonSchema): unknown {
  return schema.enum?.[0] ?? undefined;
}

function normalizeFieldName(fieldName?: string): string {
  return String(fieldName ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function clampNumber(value: number, schema: JsonSchema, integer: boolean): number {
  let next = value;
  if (typeof schema.minimum === "number" && next < schema.minimum) {
    next = schema.minimum;
  }
  if (typeof schema.maximum === "number" && next > schema.maximum) {
    next = schema.maximum;
  }
  return integer ? Math.round(next) : next;
}

function stringSampleForField(schema: JsonSchema, fieldName?: string): string {
  const normalized = normalizeFieldName(fieldName);
  const format = String(schema.format ?? "").toLowerCase();

  if (format === "email" || normalized.includes("email")) return "sample@dummy.com";
  if (format === "uuid" || normalized.includes("uuid")) return "11111111-1111-4111-8111-111111111111";
  if (format === "date-time" || normalized.includes("timestamp") || normalized.includes("datetime")) return "2026-01-01T09:00:00.000Z";
  if (format === "date" || (normalized.includes("date") && !normalized.includes("update"))) return "2026-01-01";
  if (format === "uri" || format === "url" || normalized.includes("url") || normalized.includes("uri") || normalized.includes("website")) return "https://example.com/sample";
  if (format === "ipv4") return "127.0.0.1";
  if (format === "ipv6") return "2001:db8::1";
  if (format === "hostname") return "example.test";

  if (normalized.includes("firstname") || normalized.includes("givenname") || normalized.includes("forename")) return "Sample";
  if (normalized.includes("lastname") || normalized.includes("surname") || normalized.includes("familyname")) return "User";
  if (normalized.includes("fullname") || normalized.includes("displayname")) return "Sample User";
  if (normalized === "name") return "Sample User";
  if (normalized.includes("username") || normalized.includes("handle") || normalized.includes("login")) return "sample_user";
  if (normalized.includes("password") || normalized.includes("passcode")) return "DummyPass123!";
  if (normalized === "pin" || normalized.endsWith("pin")) return "1234";
  if (normalized.includes("phone") || normalized.includes("mobile") || normalized.includes("telephone") || normalized === "tel") return "+15551234567";
  if (normalized.includes("slug")) return "sample-slug";
  if (normalized.includes("title") || normalized.includes("subject")) return "Sample Title";
  if (normalized.includes("description") || normalized.includes("summary") || normalized.includes("bio") || normalized.includes("about")) return "Sample description";
  if (normalized.includes("message") || normalized.includes("content") || normalized.includes("comment") || normalized === "text") return "Sample text";
  if (normalized.includes("address") || normalized.includes("street")) return "123 Sample Street";
  if (normalized.includes("city")) return "Sample City";
  if (normalized.includes("state") || normalized.includes("province") || normalized.includes("region")) return "Sample State";
  if (normalized.includes("country")) return "Sample Country";
  if (normalized.includes("postal") || normalized.includes("zipcode") || normalized === "zip") return "12345";
  if (normalized.includes("company") || normalized.includes("organization") || normalized === "org") return "Sample Company";
  if (normalized.includes("role")) return "member";
  if (normalized.includes("authorization")) return "Bearer dummy-token";
  if (normalized.includes("apikey") || normalized.includes("clientid")) return "dummy-api-key";
  if (normalized.includes("token") || normalized.includes("secret")) return "dummy-token";
  if (normalized.includes("cookie")) return "session=dummy-session";
  if (normalized.includes("id")) return "101";

  return "sample";
}

function numberSampleForField(schema: JsonSchema, fieldName?: string, integer = false): number {
  const normalized = normalizeFieldName(fieldName);

  if (normalized.includes("age")) return clampNumber(21, schema, integer);
  if (normalized.includes("year")) return clampNumber(2026, schema, integer);
  if (normalized.includes("month")) return clampNumber(1, schema, integer);
  if (normalized.includes("day")) return clampNumber(1, schema, integer);
  if (normalized.includes("page")) return clampNumber(1, schema, true);
  if (normalized.includes("limit") || normalized.includes("size") || normalized.includes("count") || normalized.includes("quantity")) return clampNumber(10, schema, true);
  if (normalized.includes("price") || normalized.includes("amount") || normalized.includes("total") || normalized.includes("balance")) return clampNumber(integer ? 100 : 99.99, schema, integer);
  if (normalized.includes("rate") || normalized.includes("percent") || normalized.includes("score")) return clampNumber(integer ? 50 : 50, schema, integer);
  if (normalized.includes("status") || normalized.includes("code")) return clampNumber(integer ? 200 : 200, schema, integer);
  if (normalized.includes("id")) return clampNumber(101, schema, true);

  return clampNumber(1, schema, integer);
}

function booleanSampleForField(fieldName?: string): boolean {
  const normalized = normalizeFieldName(fieldName);
  if (normalized.includes("disabled") || normalized.includes("archived") || normalized.includes("deleted")) {
    return false;
  }
  return true;
}

export function generateDummyFromSchema(schema?: JsonSchema, fieldName?: string): unknown {
  if (!schema) {
    return undefined;
  }

  if (schema.default !== undefined) {
    return schema.default;
  }

  const enumValue = fromEnum(schema);
  if (enumValue !== undefined) {
    return enumValue;
  }

  if (schema.examples?.length) {
    return schema.examples[0];
  }

  const schemaType = pickType(schema);

  if (schema.anyOf?.length) {
    return generateDummyFromSchema(schema.anyOf[0], fieldName);
  }

  if (schema.oneOf?.length) {
    return generateDummyFromSchema(schema.oneOf[0], fieldName);
  }

  if (schema.allOf?.length) {
    return generateDummyFromSchema(schema.allOf[0], fieldName);
  }

  switch (schemaType) {
    case "object": {
      const output: Record<string, unknown> = {};
      const properties = schema.properties ?? {};
      for (const [name, child] of Object.entries(properties)) {
        output[name] = generateDummyFromSchema(child, name);
      }
      return output;
    }
    case "array": {
      return [generateDummyFromSchema(schema.items ?? { type: "string" }, fieldName)];
    }
    case "number":
    case "integer": {
      return numberSampleForField(schema, fieldName, schemaType === "integer");
    }
    case "boolean": {
      return booleanSampleForField(fieldName);
    }
    case "null": {
      return null;
    }
    case "string":
    default: {
      return stringSampleForField(schema, fieldName);
    }
  }
}
