import { config } from "../config";
import { loadOpenAPISpec } from "../openapi/loader";
import { buildToolsFromSpec } from "../openapi/toolsFromSpec";
import type { MCPTool } from "../openapi/toolsFromSpec";
import { handleOpenAPIProxyToolCall } from "./handlers/openapiProxyHandler";
import { prompts, handlePrompt } from "./handlers/promptHandlers";
import { resources, readResource } from "./handlers/resourceHandlers";

export { prompts, handlePrompt, resources, readResource };

export interface ToolsAndHandler {
  tools: MCPTool[];
  handleToolCall: (
    name: string,
    args: Record<string, unknown>
  ) => Promise<{ content: Array<{ type: "text"; text: string }> }>;
}

/**
 * Load OpenAPI spec and build tools + generic proxy handler. Throws if spec cannot be loaded.
 */
export async function getToolsAndHandler(): Promise<ToolsAndHandler> {
  const specUrl = config.getOpenApiSpecUrl();
  const spec = await loadOpenAPISpec(specUrl);
  const { tools: openApiTools, operationsByToolName } =
    buildToolsFromSpec(spec);
  return {
    tools: openApiTools,
    handleToolCall: (name, args) =>
      handleOpenAPIProxyToolCall(name, args ?? {}, operationsByToolName),
  };
}
