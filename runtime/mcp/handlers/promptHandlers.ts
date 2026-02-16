import invoiceService from "../../services/invoiceService";
import customerService from "../../services/customerService";
import subscriptionService from "../../services/subscriptionService";

export const prompts = [
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
  {
    id: "billing-trends",
    name: "Billing Trends",
    description: "Analyze customer billing and subscription trends over time",
    arguments: [
      {
        name: "customerId",
        description: "Customer identifier to analyze",
        required: true,
      },
    ],
  },
  {
    id: "subscription-summary",
    name: "Subscription Summary",
    description:
      "Provide a summary of a subscription, including features and pricing",
    arguments: [
      {
        name: "subscriptionId",
        description: "Subscription identifier to summarize",
        required: true,
      },
    ],
  },
];

export const handlePrompt = async (name: string, args: any) => {
  switch (name) {
    case "Explain Charges":
      const invoiceId = args?.invoiceId;

      // Check if invoiceId is provided
      if (!invoiceId) {
        throw new Error(`No invoiceId provided for prompt: ${name}`);
      }

      const invoice = await invoiceService.getInvoiceById(invoiceId);
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

    case "Billing Trends":
      const customerId = args?.customerId;

      if (!customerId) {
        throw new Error(`No customerId provided for prompt: ${name}`);
      }

      const customer = await customerService.getCustomerById(customerId);
      const subscriptions = await customerService.getCustomerSubscriptions(
        customerId
      );
      const usageSummary = await customerService.getCustomerUsageSummary(
        customerId
      );

      return {
        messages: [
          {
            role: "assistant",
            content: {
              type: "text",
              text: `Instructions for billing trend analysis:
                      Customer ID: ${customerId}

                      Please analyze this customer's billing patterns and provide insights on:
                      1. Changes in subscription costs over time
                      2. Usage patterns and trends
                      3. Recommendations for potential plan changes or optimizations
                      4. Comparison with similar customers if possible
                      5. Identification of any unusual billing patterns

                      Use the customer and subscription data to provide specific insights.`,
            },
          },
          {
            role: "assistant",
            content: {
              type: "text",
              text: `Here is the customer data: ${JSON.stringify(customer)}\n
                      Subscription data: ${JSON.stringify(subscriptions)}\n
                      Usage summary: ${JSON.stringify(usageSummary)}`,
            },
          },
        ],
      };

    case "Subscription Summary":
      const subscriptionId = args?.subscriptionId;

      if (!subscriptionId) {
        throw new Error(`No subscriptionId provided for prompt: ${name}`);
      }

      const subscription = await subscriptionService.getSubscriptionById(
        subscriptionId
      );
      const subscriptionUsage = await subscriptionService.getSubscriptionUsage(
        subscriptionId
      );

      return {
        messages: [
          {
            role: "assistant",
            content: {
              type: "text",
              text: `Instructions for subscription summary:
                      Subscription ID: ${subscriptionId}

                      Please provide a comprehensive summary of this subscription, including:
                      1. Plan details and features included
                      2. Current billing amount and cycle
                      3. Usage statistics against allotted quotas
                      4. Start date and renewal information
                      5. Recommendations for potential upgrades or downgrades based on usage

                      Use the subscription data to provide specific details and context.`,
            },
          },
          {
            role: "assistant",
            content: {
              type: "text",
              text: `Here is the subscription data: ${JSON.stringify(
                subscription
              )}\n
                      Usage data: ${JSON.stringify(subscriptionUsage)}`,
            },
          },
        ],
      };

    default:
      throw new Error(`Unknown prompt name: ${name}`);
  }
};
