import invoiceService from "../../services/invoiceService";
import customerService from "../../services/customerService";
import eventService from "../../services/eventService";
import planService from "../../services/planService";
import priceService from "../../services/priceService";
import subscriptionService from "../../services/subscriptionService";
import walletService from "../../services/walletService";
import paymentService from "../../services/paymentService";

/**
 * Handles the execution of all tool calls, routing them to the appropriate service
 * and formatting the response according to MCP requirements.
 *
 * @param name The name of the tool to execute
 * @param args The arguments for the tool
 * @returns A formatted response with the tool execution result
 */
export const handleToolCall = async (name: string, args: any) => {
  try {
    let result;

    switch (name) {
      // Invoice tools
      case "getInvoiceById":
        result = await invoiceService.getInvoiceById(args.invoiceId);
        break;
      case "getInvoiceByNumber":
        result = await invoiceService.getInvoiceByNumber(args.invoiceNumber);
        break;
      case "getInvoices":
        // Convert string dates to Date objects if provided
        const startDate = args.startDate ? new Date(args.startDate) : undefined;
        const endDate = args.endDate ? new Date(args.endDate) : undefined;
        result = await invoiceService.getInvoices(
          startDate,
          endDate,
          args.status,
          args.limit,
          args.offset
        );
        break;
      case "getInvoicesByCustomerId":
        result = await invoiceService.getInvoicesByCustomerId(args.customerId);
        break;

      // Customer tools
      case "getCustomers":
        result = await customerService.getCustomers();
        break;
      case "getCustomerById":
        result = await customerService.getCustomerById(args.customerId);
        break;
      case "getCustomerByLookupKey":
        result = await customerService.getCustomerByLookupKey(args.lookupKey);
        break;
      case "getCustomerSubscriptions":
        result = await customerService.getCustomerSubscriptions(
          args.customerId
        );
        break;
      case "getCustomerEntitlements":
        result = await customerService.getCustomerEntitlements(args.customerId);
        break;
      case "getCustomerUsageSummary":
        result = await customerService.getCustomerUsageSummary(args.customerId);
        break;

      // Plan tools
      case "getPlans":
        result = await planService.getPlans();
        break;
      case "getPlanById":
        result = await planService.getPlanById(args.planId);
        break;

      // Price tools
      case "getPrices":
        result = await priceService.getPrices();
        break;
      case "getPriceById":
        result = await priceService.getPriceById(args.priceId);
        break;

      // Subscription tools
      case "getSubscriptions":
        result = await subscriptionService.getSubscriptions();
        break;
      case "getSubscriptionById":
        result = await subscriptionService.getSubscriptionById(
          args.subscriptionId
        );
        break;
      case "getSubscriptionUsage":
        result = await subscriptionService.getSubscriptionUsage(
          args.subscriptionId
        );
        break;
      case "getSubscriptionPauses":
        result = await subscriptionService.getSubscriptionPauses(
          args.subscriptionId
        );
        break;

      // Wallet tools
      case "getWalletById":
        result = await walletService.getWalletById(args.walletId);
        break;
      case "getWalletBalance":
        result = await walletService.getWalletBalance(args.walletId);
        break;
      case "getWalletTransactions":
        result = await walletService.getWalletTransactions(
          args.walletId,
          args.limit,
          args.offset
        );
        break;
      case "getWalletsByCustomerId":
        result = await walletService.getWalletsByCustomerId(args.customerId);
        break;

      // Payment tools
      case "getPaymentById":
        result = await paymentService.getPaymentById(args.paymentId);
        break;
      case "getPayments":
        result = await paymentService.getPayments(
          args.customerId,
          args.status,
          args.limit,
          args.offset
        );
        break;

      // Event tools
      case "getEventsByCustomer":
        result = await eventService.getEventsByCustomer(
          args.externalCustomerId,
          args.iterFirstKey,
          args.iterLastKey,
          args.startTime,
          args.endTime
        );
        break;

      // Unknown tool
      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result),
        },
      ],
    };
  } catch (error) {
    // Handle errors and provide a meaningful response
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ error: errorMessage }),
        },
      ],
    };
  }
};
