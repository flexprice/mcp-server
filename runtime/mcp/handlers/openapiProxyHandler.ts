import apiClient from "../../utils/apiClient";
import type { ResolvedOperation } from "../../openapi/types";

/**
 * Generic tool handler: resolve tool name to an OpenAPI operation, build path/query/body from args, call API, return MCP result.
 */
export async function handleOpenAPIProxyToolCall(
  name: string,
  args: Record<string, unknown>,
  operationsByToolName: Map<string, ResolvedOperation>
): Promise<{ content: Array<{ type: "text"; text: string }> }> {
  const operation = operationsByToolName.get(name);
  if (!operation) {
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({ error: `Unknown tool: ${name}` }),
        },
      ],
    };
  }

  try {
    const path = substitutePathParams(operation.pathTemplate, operation.parameters, args);
    const query = buildQueryParams(operation.parameters, args);
    const body = buildBody(operation, args);

    const response = await apiClient.request({
      method: operation.method,
      url: path,
      params: Object.keys(query).length > 0 ? query : undefined,
      data: body,
    });

    return {
      content: [
        { type: "text" as const, text: JSON.stringify(response.data) },
      ],
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : String(error);
    const axiosData =
      error && typeof error === "object" && "response" in error
        ? (error as { response?: { data?: unknown } }).response?.data
        : undefined;
    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify({
            error: message,
            ...(axiosData && typeof axiosData === "object" ? { details: axiosData } : {}),
          }),
        },
      ],
    };
  }
}

function substitutePathParams(
  pathTemplate: string,
  parameters: ResolvedOperation["parameters"],
  args: Record<string, unknown>
): string {
  let path = pathTemplate;
  const pathParams = parameters.filter((p) => p.in === "path");
  for (const p of pathParams) {
    const value = args[p.name];
    const str = value === undefined || value === null ? "" : String(value);
    path = path.replace(new RegExp(`\\{${escapeRegExp(p.name)}\\}`, "g"), encodeURIComponent(str));
  }
  return path;
}

function buildQueryParams(
  parameters: ResolvedOperation["parameters"],
  args: Record<string, unknown>
): Record<string, string | number | boolean> {
  const query: Record<string, string | number | boolean> = {};
  for (const p of parameters) {
    if (p.in !== "query") continue;
    const value = args[p.name];
    if (value === undefined || value === null) continue;
    if (typeof value === "object" && !Array.isArray(value)) continue;
    query[p.name] = value as string | number | boolean;
  }
  return query;
}

function buildBody(
  operation: ResolvedOperation,
  args: Record<string, unknown>
): unknown {
  const method = operation.method;
  if (method === "get" || method === "delete") return undefined;
  if (args.body !== undefined) return args.body;
  // Optional: build body from top-level args that are not path/query params (for simpler specs)
  const paramNames = new Set(operation.parameters.map((p) => p.name));
  const bodyKeys = Object.keys(args).filter((k) => !paramNames.has(k));
  if (bodyKeys.length === 0) return undefined;
  const body: Record<string, unknown> = {};
  for (const k of bodyKeys) body[k] = args[k];
  return Object.keys(body).length > 0 ? body : undefined;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
