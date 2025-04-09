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
  tools,
  handleToolCall,
  prompts,
  handlePrompt,
  resources,
  readResource,
} from "./mcp";

/**
 * Initialize the MCP server with configuration
 */
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

/**
 * Handle the list tools request and return all available tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

/**
 * Handle tool calls by delegating to the appropriate handler
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  if (!args) {
    throw new Error(`No arguments provided for tool: ${name}`);
  }

  return await handleToolCall(name, args);
});

/**
 * Handle the list resources request and return all available resources
 */
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return { resources };
});

/**
 * Handle the read resource request by fetching and returning the resource data
 */
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;
  return await readResource(uri);
});

/**
 * Handle the list prompts request and return all available prompts
 */
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return { prompts };
});

/**
 * Handle the get prompt request by delegating to the appropriate handler
 */
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name } = request.params;
  if (!name) {
    throw new Error(`No id provided for prompt`);
  }

  return await handlePrompt(name, request.params.arguments);
});

// Set up the server transport and start the server
const transport = new StdioServerTransport();

server.connect(transport).catch((error) => {
  process.exit(1);
});

// Log server startup
server.sendLoggingMessage({
  level: "info",
  data: "Server started successfully with enhanced FlexPrice API integrations",
});
