/**
 * Minimal OpenAPI 3.0 types for paths, operations, parameters, and requestBody.
 * Used to load the spec and build MCP tools + generic proxy.
 */

export type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

export interface OpenAPISchema {
  type?: string;
  format?: string;
  description?: string;
  enum?: unknown[];
  default?: unknown;
  items?: OpenAPISchema;
  properties?: Record<string, OpenAPISchema>;
  required?: string[];
  oneOf?: OpenAPISchema[];
  anyOf?: OpenAPISchema[];
  allOf?: OpenAPISchema[];
  $ref?: string;
  additionalProperties?: boolean | OpenAPISchema;
}

export interface OpenAPIParameter {
  name: string;
  in: "path" | "query" | "header" | "cookie";
  description?: string;
  required?: boolean;
  schema?: OpenAPISchema;
  style?: string;
  explode?: boolean;
}

export interface OpenAPIMediaType {
  schema?: OpenAPISchema;
}

export interface OpenAPIRequestBody {
  description?: string;
  required?: boolean;
  content?: {
    "application/json"?: OpenAPIMediaType;
    "application/x-www-form-urlencoded"?: OpenAPIMediaType;
    [key: string]: OpenAPIMediaType | undefined;
  };
}

export interface OpenAPIOperation {
  operationId?: string;
  summary?: string;
  description?: string;
  parameters?: OpenAPIParameter[];
  requestBody?: OpenAPIRequestBody;
  responses?: Record<string, unknown>;
  tags?: string[];
}

export interface OpenAPIPathItem {
  get?: OpenAPIOperation;
  post?: OpenAPIOperation;
  put?: OpenAPIOperation;
  patch?: OpenAPIOperation;
  delete?: OpenAPIOperation;
  parameters?: OpenAPIParameter[];
}

export interface OpenAPISpec {
  openapi?: string;
  info?: { title?: string; version?: string };
  servers?: Array<{ url?: string }>;
  paths: Record<string, OpenAPIPathItem>;
  components?: { schemas?: Record<string, OpenAPISchema> };
}

/** Resolved operation for one MCP tool: path template, method, and parameter/body info. */
export interface ResolvedOperation {
  pathTemplate: string;
  method: HttpMethod;
  parameters: OpenAPIParameter[];
  requestBody?: OpenAPIRequestBody;
  summary?: string;
  description?: string;
  operationId?: string;
}
