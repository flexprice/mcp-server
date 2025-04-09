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

// Mock the MCP components
jest.mock("../mcp", () => ({
  tools: ["mockTool1", "mockTool2"],
  handleToolCall: jest.fn(),
  prompts: ["mockPrompt1", "mockPrompt2"],
  handlePrompt: jest.fn(),
  resources: ["mockResource1", "mockResource2"],
  readResource: jest.fn(),
}));

// Basic test to verify server imports work
describe("Server", () => {
  test("should have server module dependencies defined", () => {
    expect(Server).toBeDefined();
    expect(config).toBeDefined();
    expect(config.mcp).toBeDefined();
    expect(mcpComponents).toBeDefined();
    expect(mcpComponents.tools).toBeDefined();
    expect(mcpComponents.handleToolCall).toBeDefined();
  });
});
