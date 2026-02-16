import type {
  OpenAPISpec,
  OpenAPIPathItem,
  OpenAPIOperation,
  OpenAPIParameter,
  OpenAPISchema,
  HttpMethod,
  ResolvedOperation,
} from "./types";

const HTTP_METHODS: HttpMethod[] = [
  "get",
  "post",
  "put",
  "patch",
  "delete",
];

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
  };
}

export interface OpenAPIToolsResult {
  tools: MCPTool[];
  operationsByToolName: Map<string, ResolvedOperation>;
}

/**
 * Derive a stable MCP tool name from method and path when operationId is missing.
 * e.g. GET /customers -> get_customers, GET /customers/{id} -> get_customers_id
 */
function deriveToolName(method: string, pathTemplate: string): string {
  const pathPart = pathTemplate
    .replace(/^\//, "")
    .replace(/\/$/, "")
    .replace(/\//g, "_")
    .replace(/\{(\w+)\}/g, "$1");
  return `${method.toLowerCase()}_${pathPart || "root"}`.replace(/_+/g, "_");
}

/**
 * Merge path-level and operation-level parameters (operation takes precedence for duplicates).
 */
function getAllParameters(
  pathItem: OpenAPIPathItem,
  operation: OpenAPIOperation
): OpenAPIParameter[] {
  const pathParams = pathItem.parameters ?? [];
  const opParams = operation.parameters ?? [];
  const byName = new Map<string, OpenAPIParameter>();
  for (const p of pathParams) byName.set(p.name, p);
  for (const p of opParams) byName.set(p.name, p);
  return Array.from(byName.values());
}

/**
 * Convert OpenAPI schema to a JSON Schema fragment (no $ref resolution).
 */
function openApiSchemaToJsonSchema(schema: OpenAPISchema | undefined): Record<string, unknown> | undefined {
  if (!schema) return undefined;
  const out: Record<string, unknown> = {};
  if (schema.type) out.type = schema.type;
  if (schema.format) out.format = schema.format;
  if (schema.description) out.description = schema.description;
  if (schema.enum) out.enum = schema.enum;
  if (schema.default !== undefined) out.default = schema.default;
  if (schema.items) out.items = openApiSchemaToJsonSchema(schema.items);
  if (schema.properties) {
    out.properties = Object.fromEntries(
      Object.entries(schema.properties).map(([k, v]) => [
        k,
        openApiSchemaToJsonSchema(v),
      ])
    );
  }
  if (schema.required) out.required = schema.required;
  return Object.keys(out).length ? out : undefined;
}

/**
 * Resolve full path for a spec path template: prepend server base path (e.g. /v1) when present.
 * If server url is absolute (http/https), only the pathname is used so apiClient baseURL is used for host.
 */
function resolvePathTemplate(spec: OpenAPISpec, pathTemplate: string): string {
  let serverUrl = spec.servers?.[0]?.url ?? "";
  if (typeof serverUrl === "string" && (serverUrl.startsWith("http://") || serverUrl.startsWith("https://"))) {
    try {
      serverUrl = new URL(serverUrl).pathname;
    } catch {
      serverUrl = "";
    }
  }
  const base = typeof serverUrl === "string" ? serverUrl.replace(/\/$/, "") : "";
  const path = pathTemplate.startsWith("/") ? pathTemplate.slice(1) : pathTemplate;
  return base ? (path ? `${base}/${path}` : base) : (path ? `/${path}` : "/");
}

/**
 * Build MCP tools and operation registry from an OpenAPI 3.0 spec.
 */
export function buildToolsFromSpec(spec: OpenAPISpec): OpenAPIToolsResult {
  const tools: MCPTool[] = [];
  const operationsByToolName = new Map<string, ResolvedOperation>();
  const usedNames = new Set<string>();

  for (const [pathTemplate, pathItem] of Object.entries(spec.paths)) {
    if (!pathItem || typeof pathItem !== "object") continue;

    const fullPathTemplate = resolvePathTemplate(spec, pathTemplate);

    for (const method of HTTP_METHODS) {
      const operation = (pathItem as Record<string, OpenAPIOperation | undefined>)[method];
      if (!operation) continue;

      const parameters = getAllParameters(pathItem, operation);
      const name = operation.operationId?.trim()
        ? operation.operationId
        : deriveToolName(method, pathTemplate);
      const uniqueName = ensureUniqueName(name, usedNames);
      usedNames.add(uniqueName);

      const description =
        operation.summary?.trim() ||
        operation.description?.trim() ||
        `${method.toUpperCase()} ${pathTemplate}`;

      const inputSchema = buildInputSchema(parameters, operation);
      tools.push({
        name: uniqueName,
        description,
        inputSchema,
      });

      operationsByToolName.set(uniqueName, {
        pathTemplate: fullPathTemplate,
        method,
        parameters,
        requestBody: operation.requestBody,
        summary: operation.summary,
        description: operation.description,
        operationId: operation.operationId,
      });
    }
  }

  return { tools, operationsByToolName };
}

function ensureUniqueName(base: string, used: Set<string>): string {
  let name = base;
  let n = 0;
  while (used.has(name)) {
    n += 1;
    name = `${base}_${n}`;
  }
  return name;
}

function buildInputSchema(
  parameters: OpenAPIParameter[],
  operation: OpenAPIOperation
): MCPTool["inputSchema"] {
  const properties: Record<string, unknown> = {};
  const required: string[] = [];

  for (const param of parameters) {
    const prop = openApiSchemaToJsonSchema(param.schema) ?? { type: "string" };
    if (param.description) (prop as Record<string, unknown>).description = param.description;
    properties[param.name] = prop;
    if (param.required === true) required.push(param.name);
  }

  const jsonBody = operation.requestBody?.content?.["application/json"];
  if (jsonBody?.schema) {
    const bodySchema = openApiSchemaToJsonSchema(jsonBody.schema);
    if (bodySchema) {
      properties.body = bodySchema;
      if (operation.requestBody?.required) required.push("body");
    }
  }

  return {
    type: "object",
    properties,
    ...(required.length > 0 ? { required } : {}),
  };
}
