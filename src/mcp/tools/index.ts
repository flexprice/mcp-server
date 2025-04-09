export const tools = [
  // Invoice Tools
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
      required: ["invoiceId"],
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
      required: ["invoiceNumber"],
    },
  },
  {
    name: "getInvoices",
    description:
      "Get invoices with optional filtering by date range and status",
    inputSchema: {
      type: "object",
      properties: {
        startDate: {
          type: "string",
          description:
            "ISO format date string for filtering invoices from this date",
        },
        endDate: {
          type: "string",
          description:
            "ISO format date string for filtering invoices until this date",
        },
        status: {
          type: "string",
          description: "Filter invoices by status",
        },
        limit: {
          type: "number",
          description: "Maximum number of invoices to return",
        },
        offset: {
          type: "number",
          description: "Number of invoices to skip for pagination",
        },
      },
    },
  },
  {
    name: "getInvoicesByCustomerId",
    description: "Get all invoices for a specific customer",
    inputSchema: {
      type: "object",
      properties: {
        customerId: {
          type: "string",
        },
      },
      required: ["customerId"],
    },
  },

  // Customer Tools
  {
    name: "getCustomers",
    description: "Get all customers",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "getCustomerById",
    description: "Get a customer by ID",
    inputSchema: {
      type: "object",
      properties: {
        customerId: {
          type: "string",
        },
      },
      required: ["customerId"],
    },
  },
  {
    name: "getCustomerByLookupKey",
    description: "Get a customer by lookup key (external ID)",
    inputSchema: {
      type: "object",
      properties: {
        lookupKey: {
          type: "string",
        },
      },
      required: ["lookupKey"],
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
      required: ["customerId"],
    },
  },
  {
    name: "getCustomerEntitlements",
    description: "Get a customer's entitlements",
    inputSchema: {
      type: "object",
      properties: {
        customerId: {
          type: "string",
        },
      },
      required: ["customerId"],
    },
  },
  {
    name: "getCustomerUsageSummary",
    description: "Get a customer's usage summary",
    inputSchema: {
      type: "object",
      properties: {
        customerId: {
          type: "string",
        },
      },
      required: ["customerId"],
    },
  },

  // Plan Tools
  {
    name: "getPlans",
    description: "Get all plans",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "getPlanById",
    description: "Get a plan by ID",
    inputSchema: {
      type: "object",
      properties: {
        planId: {
          type: "string",
        },
      },
      required: ["planId"],
    },
  },

  // Price Tools
  {
    name: "getPrices",
    description: "Get all prices",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "getPriceById",
    description: "Get a price by ID",
    inputSchema: {
      type: "object",
      properties: {
        priceId: {
          type: "string",
        },
      },
      required: ["priceId"],
    },
  },

  // Subscription Tools
  {
    name: "getSubscriptions",
    description: "Get all subscriptions",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "getSubscriptionById",
    description: "Get a subscription by ID",
    inputSchema: {
      type: "object",
      properties: {
        subscriptionId: {
          type: "string",
        },
      },
      required: ["subscriptionId"],
    },
  },
  {
    name: "getSubscriptionUsage",
    description: "Get usage for a subscription",
    inputSchema: {
      type: "object",
      properties: {
        subscriptionId: {
          type: "string",
        },
      },
      required: ["subscriptionId"],
    },
  },
  {
    name: "getSubscriptionPauses",
    description: "Get all pauses for a subscription",
    inputSchema: {
      type: "object",
      properties: {
        subscriptionId: {
          type: "string",
        },
      },
      required: ["subscriptionId"],
    },
  },

  // Wallet Tools
  {
    name: "getWalletById",
    description: "Get a wallet by ID",
    inputSchema: {
      type: "object",
      properties: {
        walletId: {
          type: "string",
        },
      },
      required: ["walletId"],
    },
  },
  {
    name: "getWalletBalance",
    description: "Get the real-time balance of a wallet",
    inputSchema: {
      type: "object",
      properties: {
        walletId: {
          type: "string",
        },
      },
      required: ["walletId"],
    },
  },
  {
    name: "getWalletTransactions",
    description: "Get transactions for a wallet with pagination",
    inputSchema: {
      type: "object",
      properties: {
        walletId: {
          type: "string",
        },
        limit: {
          type: "number",
          description: "Maximum number of transactions to return",
        },
        offset: {
          type: "number",
          description: "Number of transactions to skip for pagination",
        },
      },
      required: ["walletId"],
    },
  },
  {
    name: "getWalletsByCustomerId",
    description: "Get all wallets for a customer",
    inputSchema: {
      type: "object",
      properties: {
        customerId: {
          type: "string",
        },
      },
      required: ["customerId"],
    },
  },

  // Payment Tools
  {
    name: "getPaymentById",
    description: "Get a payment by ID",
    inputSchema: {
      type: "object",
      properties: {
        paymentId: {
          type: "string",
        },
      },
      required: ["paymentId"],
    },
  },
  {
    name: "getPayments",
    description: "Get payments with optional filtering",
    inputSchema: {
      type: "object",
      properties: {
        customerId: {
          type: "string",
          description: "Filter payments by customer ID",
        },
        status: {
          type: "string",
          description: "Filter payments by status (pending, processed, failed)",
        },
        limit: {
          type: "number",
          description: "Maximum number of payments to return",
        },
        offset: {
          type: "number",
          description: "Number of payments to skip for pagination",
        },
      },
    },
  },

  // Event Tools
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
];
