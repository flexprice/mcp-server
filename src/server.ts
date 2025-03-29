import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { config } from "./config";
import { InvoiceService } from "./services/invoiceService";
import { CustomerService } from "./services/customerService";
import { EventService } from "./services/eventService";
import {
  CallToolRequestSchema,
  GetPromptRequestSchema,
  ListPromptsRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

const invoiceService = new InvoiceService();
const customerService = new CustomerService();
const eventService = new EventService();
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

server.setRequestHandler(ListToolsRequestSchema, async (request) => {
  return {
    tools: [
      {
        name: "getInvoiceById",
        description: "Get an invoice by its ID",
        inputSchema: {
          type: "object",
          properties: {
            invoiceId: {
              type: "string",
            },
          },
        },
      },
      {
        name: "getInvoiceByNumber",
        description: "Get an invoice by its number",
        inputSchema: {
          type: "object",
          properties: {
            invoiceNumber: {
              type: "string",
            },
          },
        },
      },
      {
        name: "getCustomerSubscriptions",
        description: "Get a customer's subscriptions",
        inputSchema: {
          type: "object",
          properties: {
            customerId: {
              type: "string",
            },
          },
        },
      },
      {
        name: "getEventsByCustomer",
        description: "Get events for a customer",
        inputSchema: {
          type: "object",
          properties: {
            externalCustomerId: {
              type: "string",
            },
            iterFirstKey: {
              type: "string",
            },
            iterLastKey: {
              type: "string",
            },
            startTime: {
              type: "string",
            },
            endTime: {
              type: "string",
            },
          },
          required: ["externalCustomerId"],
        },
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
    case "getEventsByCustomer":
      const events = await eventService.getEventsByCustomer(
        args.externalCustomerId as string,
        args.iterFirstKey as string,
        args.iterLastKey as string
      );
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(events),
          },
        ],
      };
    case "getInvoiceById":
      const invoice = await invoiceService.getInvoiceById(
        args.invoiceId as string
      );
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(invoice),
          },
        ],
      };
    case "getInvoiceByNumber":
      const invoiceByNumber = await invoiceService.getInvoiceByNumber(
        args.invoiceNumber as string
      );
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(invoiceByNumber),
          },
        ],
      };
    case "getCustomerSubscriptions":
      const subscriptions = await customerService.getCustomerSubscriptions(
        args.customerId as string
      );
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(subscriptions),
          },
        ],
      };
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
  const uri = request.params.uri;
  const response = await fetch(uri);
  const data = await response.json();
  return { type: "object", data };
});

server.setRequestHandler(ListPromptsRequestSchema, async (request) => {
  return {
    prompts: [
      {
        id: "explain-charges",
        name: "Explain Charges",
        description:
          "Help a billing manager explain charges on an invoice to a customer",
        arguments: [
          {
            name: "invoiceId",
            description: "Invoice identifier to analyze",
            required: true,
          },
        ],
      },
    ],
  };
});

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name } = request.params;
  if (!name) {
    throw new Error(`No id provided for prompt`);
  }
  switch (name) {
    case "Explain Charges":
      const invoiceId = request.params.arguments?.invoiceId;

      // Check if invoiceId is provided
      if (!invoiceId) {
        throw new Error(`No invoiceId provided for prompt: ${name}`);
      }

      const invoice = await invoiceService.getInvoiceById(invoiceId as string);
      return {
        messages: [
          {
            role: "assistant",
            content: {
              type: "text",
              text: `Instructions for invoice explanation:
                      Invoice ID: ${invoiceId}

                      Please explain the charges on this invoice in detail, including:
                      1. A breakdown of each line item in simple terms
                      2. Explanation of any usage-based charges
                      3. Comparison with previous billing cycles if available
                      4. Clarification of any unusual or unexpected charges
                      5. Suggestions for optimizing costs based on usage patterns

                      Use the invoice data to provide specific details and amounts.`,
            },
          },
          {
            role: "assistant",
            content: {
              type: "text",
              text: `Here is the invoice data the user needs help explaining: ${JSON.stringify(
                invoice
              )}`,
            },
          },
        ],
      };
    default:
      throw new Error(`Unknown prompt name: ${name}`);
  }
});

const transport = new StdioServerTransport();

server.connect(transport).catch((error) => {
  process.exit(1);
});

server.sendLoggingMessage({
  level: "info",
  data: "Server started successfully",
});
