export type FrameworkKind = "express" | "nest";

export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "OPTIONS"
  | "HEAD"
  | "ALL";

export type SchemaType =
  | "string"
  | "number"
  | "integer"
  | "boolean"
  | "array"
  | "object"
  | "null";

export type ConfidenceLevel = "high" | "medium" | "low";

export type InferenceSource =
  | "schema"
  | "decorator"
  | "handler-access"
  | "middleware"
  | "heuristic";

export interface JsonSchema {
  type?: SchemaType | SchemaType[];
  description?: string;
  enum?: Array<string | number | boolean | null>;
  default?: unknown;
  nullable?: boolean;
  format?: string;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  examples?: unknown[];
  properties?: Record<string, JsonSchema>;
  required?: string[];
  items?: JsonSchema;
  anyOf?: JsonSchema[];
  oneOf?: JsonSchema[];
  allOf?: JsonSchema[];
  additionalProperties?: boolean | JsonSchema;
}

export interface InferredField {
  name: string;
  location: "path" | "query" | "header" | "body";
  type?: SchemaType | "unknown";
  required?: boolean;
  confidence: ConfidenceLevel;
  source: InferenceSource;
  format?: string;
  minimum?: number;
  exclusiveMinimum?: number;
  maximum?: number;
  exclusiveMaximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  enum?: Array<string | number | boolean | null>;
}

export type AuthKind = "bearer" | "cookie" | "apiKey" | "session" | "custom";

export interface AuthRequirement {
  kind: AuthKind;
  headerName?: string;
  cookieName?: string;
  scheme?: string;
  note?: string;
  confidence: ConfidenceLevel;
  source: InferenceSource;
}

export interface SourceRef {
  file: string;
  line: number;
  column: number;
}

export interface RouteManifestEntry {
  id: string;
  framework: FrameworkKind;
  method: HttpMethod;
  path: string;
  pathParams: string[];
  queryParams: string[];
  headers: string[];
  bodySchema?: JsonSchema;
  dummyBody?: unknown;
  inferredFields?: InferredField[];
  authRequirements?: AuthRequirement[];
  sourceRef: SourceRef;
}

export interface RouteManifest {
  generatedAt: string;
  projectRoot: string;
  framework: "express" | "nest" | "mixed" | "unknown";
  routes: RouteManifestEntry[];
}

export interface ScanDiagnostic {
  level: "info" | "warn" | "error";
  message: string;
  file?: string;
}

export interface ScanResult {
  manifest: RouteManifest;
  diagnostics: ScanDiagnostic[];
}

export interface HeaderPreset {
  name: string;
  headers: Record<string, string>;
  updatedAt: string;
}

export interface HeaderPresetStore {
  presets: HeaderPreset[];
}

export interface RequestTemplate {
  id: string;
  routeId: string;
  name: string;
  pathParams?: Record<string, string>;
  query?: Record<string, string>;
  headers?: Record<string, string>;
  body?: unknown;
  updatedAt: string;
}

export interface RequestTemplateStore {
  templates: RequestTemplate[];
}

export interface WorkspaceProfile {
  id: string;
  name: string;
  baseUrl: string;
  defaultPresetName?: string;
  updatedAt: string;
}

export interface WorkspaceProfileStore {
  profiles: WorkspaceProfile[];
  activeProfileId?: string;
}

export interface RequestExecutionInput {
  routeId: string;
  pathParams?: Record<string, string>;
  query?: Record<string, string>;
  headers?: Record<string, string>;
  body?: unknown;
}

export interface RequestExecutionResult {
  routeId: string;
  url: string;
  method: HttpMethod;
  status?: number;
  ok: boolean;
  latencyMs: number;
  requestBody?: unknown;
  responseHeaders?: Record<string, string>;
  bodyText?: string;
  bodyJson?: unknown;
  error?: string;
  occurredAt: string;
}

export interface RequestHistoryStore {
  history: RequestExecutionResult[];
}

export type AssertionTarget = "status" | "body" | "header";
export type AssertionOperator = "equals" | "exists" | "contains";

export interface AssertionDefinition {
  id: string;
  target: AssertionTarget;
  path?: string;
  operator: AssertionOperator;
  expected?: unknown;
}

export interface SuiteStep {
  id: string;
  routeId: string;
  request?: RequestExecutionInput;
  assertions?: AssertionDefinition[];
}

export interface TestSuite {
  id: string;
  name: string;
  steps: SuiteStep[];
  updatedAt: string;
}

export interface TestSuiteStore {
  suites: TestSuite[];
}

export interface WorkflowStep {
  id: string;
  name: string;
  routeId: string;
  request?: RequestExecutionInput;
  mappings?: Record<string, string>;
  assertions?: AssertionDefinition[];
}

export interface Workflow {
  id: string;
  name: string;
  steps: WorkflowStep[];
  continueOnFailure?: boolean;
  updatedAt: string;
}

export interface WorkflowStore {
  workflows: Workflow[];
}

export interface TeamConfig {
  version: number;
  presets: HeaderPreset[];
  templates: RequestTemplate[];
  profiles: WorkspaceProfile[];
  activeProfileId?: string;
  suites: TestSuite[];
  workflows: Workflow[];
}

export interface AssertionResult {
  assertionId: string;
  ok: boolean;
  message: string;
}

export interface StepRunResult {
  stepId: string;
  routeId: string;
  response: RequestExecutionResult;
  assertions: AssertionResult[];
  ok: boolean;
}

export interface SuiteRunResult {
  suiteId: string;
  ok: boolean;
  startedAt: string;
  completedAt: string;
  steps: StepRunResult[];
}

export interface WorkflowRunResult {
  workflowId: string;
  ok: boolean;
  startedAt: string;
  completedAt: string;
  steps: StepRunResult[];
}
