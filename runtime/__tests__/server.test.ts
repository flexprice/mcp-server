import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { config } from "../config";
import * as mcpComponents from "../mcp";

// Mock the SDK components
jest.mock("@modelcontextprotocol/sdk/server/index.js", () => ({
  Server: jest.fn().mockImplementation(() => ({
    setRequestHandler: jest.fn(),
    connect: jest.fn().mockResolvedValue(undefined),
    sendLoggingMessage: jest.fn(),
  })),
}));

// Mock the MCP components: server uses getToolsAndHandler()
jest.mock("../mcp", () => ({
  getToolsAndHandler: jest.fn().mockResolvedValue({
    tools: [{ name: "mockTool1" }, { name: "mockTool2" }],
    handleToolCall: jest.fn(),
  }),
  prompts: ["mockPrompt1", "mockPrompt2"],
  handlePrompt: jest.fn(),
  resources: ["mockResource1", "mockResource2"],
  readResource: jest.fn(),
}));

describe("Server", () => {
  test("should have server module dependencies defined", () => {
    expect(Server).toBeDefined();
    expect(config).toBeDefined();
    expect(config.mcp).toBeDefined();
    expect(mcpComponents).toBeDefined();
    expect(mcpComponents.getToolsAndHandler).toBeDefined();
  });
});
