import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { config } from "./config";
import { InvoiceService } from "./services/invoiceService";
import { CustomerService } from "./services/customerService";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

const invoiceService = new InvoiceService();
const customerService = new CustomerService();

const server = new Server({
  name: config.mcp.name,
  version: config.mcp.version,
  capabilities: config.mcp.capabilities,
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  return {
    tools: [
      {
        name: "getInvoiceById",
        description: "Get an invoice by its ID",
        parameters: z.object({
          invoiceId: z.string(),
        }),
      },
      {
        name: "getInvoiceByNumber",
        description: "Get an invoice by its number",
        parameters: z.object({
          invoiceNumber: z.string(),
        }),
      },
      {
        name: "getCustomerByEmail",
        description: "Get a customer by their email",
        parameters: z.object({
          email: z.string(),
        }),
      },
      {
        name: "getCustomerSubscriptions",
        description: "Get a customer's subscriptions",
        parameters: z.object({
          customerId: z.string(),
        }),
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  if (!args) {
    throw new Error(`No arguments provided for tool: ${name}`);
  }
  switch (name) {
    case "getInvoiceById":
      const invoice = await invoiceService.getInvoiceById(
        args.invoiceId as string
      );
      return { type: "object", data: invoice };
    case "getInvoiceByNumber":
      const invoiceByNumber = await invoiceService.getInvoiceByNumber(
        args.invoiceNumber as string
      );
      return { type: "object", data: invoiceByNumber };
    case "getCustomerByEmail":
      const customer = await customerService.getCustomerByEmail(
        args.email as string
      );
      return { type: "object", data: customer };
    case "getCustomerSubscriptions":
      const subscriptions = await customerService.getCustomerSubscriptions(
        args.customerId as string
      );
      return { type: "object", data: subscriptions };
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

server.setRequestHandler(ListResourcesRequestSchema, async (request) => {
  return {
    resources: [
      {
        name: "swagger docs",
        description: "The swagger documentation for the API",
        uri: config.baseUrl + "/swagger/doc.json",
        mimeType: "application/json",
      },
    ],
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const schema = z.object({
    invoiceId: z.string(),
  });
  const { invoiceId } = schema.parse(request.params);
  const invoice = await invoiceService.getInvoiceById(invoiceId);
  return { type: "object", data: invoice };
});

const transport = new StdioServerTransport();

server.sendLoggingMessage({
  level: "info",
  data: "Server started successfully",
});

server.connect(transport).catch((error) => {
  process.exit(1);
});
