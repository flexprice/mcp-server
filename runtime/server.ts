import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { config } from "./config";
import {
  CallToolRequestSchema,
  GetPromptRequestSchema,
  ListPromptsRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import {
  getToolsAndHandler,
  prompts,
  handlePrompt,
  resources,
  readResource,
} from "./mcp";

async function main() {
  const { tools, handleToolCall } = await getToolsAndHandler();

  const server = new Server(
    {
      name: config.mcp.name,
      version: config.mcp.version,
    },
    {
      capabilities: {
        tools: {},
        logging: {},
        resources: {},
        prompts: {},
      },
    }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    return await handleToolCall(name, args ?? {});
  });

  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return { resources };
  });

  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const uri = request.params.uri;
    return await readResource(uri);
  });

  server.setRequestHandler(ListPromptsRequestSchema, async () => {
    return { prompts };
  });

  server.setRequestHandler(GetPromptRequestSchema, async (request) => {
    const { name } = request.params;
    if (!name) {
      throw new Error(`No id provided for prompt`);
    }
    return await handlePrompt(name, request.params.arguments);
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);

  server.sendLoggingMessage({
    level: "info",
    data: "Flexprice MCP server started successfully",
  });
}

main().catch((error) => {
  process.exit(1);
});
