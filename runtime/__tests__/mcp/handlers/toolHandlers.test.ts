import { buildToolsFromSpec } from "../../../openapi/toolsFromSpec";
import { handleOpenAPIProxyToolCall } from "../../../mcp/handlers/openapiProxyHandler";
import apiClient from "../../../utils/apiClient";

jest.mock("../../../utils/apiClient", () => ({
  __esModule: true,
  default: { request: jest.fn() },
}));

const mockRequest = apiClient.request as jest.Mock;

describe("buildToolsFromSpec", () => {
  test("builds one tool from minimal spec with operationId and server path", () => {
    const spec = {
      openapi: "3.0.1",
      paths: {
        "/customers/{id}": {
          get: {
            operationId: "getCustomer",
            summary: "Get a customer by ID",
            parameters: [
              { name: "id", in: "path" as const, required: true, schema: { type: "string" } },
            ],
          },
        },
      },
      servers: [{ url: "/v1" }],
    };
    const { tools, operationsByToolName } = buildToolsFromSpec(spec as any);
    expect(tools).toHaveLength(1);
    expect(tools[0].name).toBe("getCustomer");
    expect(tools[0].description).toBe("Get a customer by ID");
    expect(tools[0].inputSchema.properties).toHaveProperty("id");
    expect(tools[0].inputSchema.required).toContain("id");
    const op = operationsByToolName.get("getCustomer");
    expect(op).toBeDefined();
    expect(op!.pathTemplate).toBe("/v1/customers/{id}");
    expect(op!.method).toBe("get");
  });
});

describe("OpenAPI proxy tool handler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const minimalOperations = new Map([
    [
      "get_customers_id",
      {
        pathTemplate: "/v1/customers/{id}",
        method: "get" as const,
        parameters: [
          { name: "id", in: "path" as const, required: true },
        ],
        requestBody: undefined,
      },
    ],
    [
      "get_customers",
      {
        pathTemplate: "/v1/customers",
        method: "get" as const,
        parameters: [
          { name: "limit", in: "query" as const },
          { name: "offset", in: "query" as const },
        ],
        requestBody: undefined,
      },
    ],
  ]);

  test("substitutes path params and returns response data", async () => {
    const mockData = { id: "cust_1", name: "Test Customer" };
    mockRequest.mockResolvedValueOnce({ data: mockData });

    const result = await handleOpenAPIProxyToolCall(
      "get_customers_id",
      { id: "cust_1" },
      minimalOperations
    );

    expect(mockRequest).toHaveBeenCalledWith({
      method: "get",
      url: "/v1/customers/cust_1",
      params: undefined,
      data: undefined,
    });
    expect(result).toEqual({
      content: [{ type: "text", text: JSON.stringify(mockData) }],
    });
  });

  test("passes query params for GET", async () => {
    mockRequest.mockResolvedValueOnce({ data: [] });

    await handleOpenAPIProxyToolCall(
      "get_customers",
      { limit: 10, offset: 0 },
      minimalOperations
    );

    expect(mockRequest).toHaveBeenCalledWith({
      method: "get",
      url: "/v1/customers",
      params: { limit: 10, offset: 0 },
      data: undefined,
    });
  });

  test("returns error content for unknown tool", async () => {
    const result = await handleOpenAPIProxyToolCall(
      "unknown_tool",
      {},
      minimalOperations
    );

    expect(mockRequest).not.toHaveBeenCalled();
    expect(result.content[0].type).toBe("text");
    expect(JSON.parse(result.content[0].text)).toEqual({
      error: "Unknown tool: unknown_tool",
    });
  });

  test("returns error content when apiClient throws", async () => {
    mockRequest.mockRejectedValueOnce(new Error("Network error"));

    const result = await handleOpenAPIProxyToolCall(
      "get_customers_id",
      { id: "x" },
      minimalOperations
    );

    expect(result.content[0].type).toBe("text");
    const parsed = JSON.parse(result.content[0].text);
    expect(parsed.error).toBe("Network error");
  });
});
