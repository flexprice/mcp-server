import { handleToolCall } from "../../../mcp/handlers/toolHandlers";
import invoiceService from "../../../services/invoiceService";
import customerService from "../../../services/customerService";
import planService from "../../../services/planService";
import priceService from "../../../services/priceService";
import subscriptionService from "../../../services/subscriptionService";
import walletService from "../../../services/walletService";
import paymentService from "../../../services/paymentService";
import eventService from "../../../services/eventService";

// Mock all services
jest.mock("../../../services/invoiceService");
jest.mock("../../../services/customerService");
jest.mock("../../../services/planService");
jest.mock("../../../services/priceService");
jest.mock("../../../services/subscriptionService");
jest.mock("../../../services/walletService");
jest.mock("../../../services/paymentService");
jest.mock("../../../services/eventService");

describe("Tool Handlers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("handleToolCall", () => {
    test("should handle getInvoiceById tool", async () => {
      const mockInvoice = { id: "inv_1", amount: 100 };
      (invoiceService.getInvoiceById as jest.Mock).mockResolvedValueOnce(
        mockInvoice
      );

      const result = await handleToolCall("getInvoiceById", {
        invoiceId: "inv_1",
      });

      expect(invoiceService.getInvoiceById).toHaveBeenCalledWith("inv_1");
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: JSON.stringify(mockInvoice),
          },
        ],
      });
    });

    test("should handle getCustomerById tool", async () => {
      const mockCustomer = { id: "cust_1", name: "Test Customer" };
      (customerService.getCustomerById as jest.Mock).mockResolvedValueOnce(
        mockCustomer
      );

      const result = await handleToolCall("getCustomerById", {
        customerId: "cust_1",
      });

      expect(customerService.getCustomerById).toHaveBeenCalledWith("cust_1");
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: JSON.stringify(mockCustomer),
          },
        ],
      });
    });

    test("should handle getPlanById tool", async () => {
      const mockPlan = { id: "plan_1", name: "Test Plan" };
      (planService.getPlanById as jest.Mock).mockResolvedValueOnce(mockPlan);

      const result = await handleToolCall("getPlanById", { planId: "plan_1" });

      expect(planService.getPlanById).toHaveBeenCalledWith("plan_1");
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: JSON.stringify(mockPlan),
          },
        ],
      });
    });

    test("should handle error case", async () => {
      const errorMessage = "Test error";
      (invoiceService.getInvoiceById as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage)
      );

      const result = await handleToolCall("getInvoiceById", {
        invoiceId: "inv_1",
      });

      expect(invoiceService.getInvoiceById).toHaveBeenCalledWith("inv_1");
      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: JSON.stringify({ error: errorMessage }),
          },
        ],
      });
    });

    test("should handle unknown tool case", async () => {
      const result = await handleToolCall("unknownTool", {});

      expect(result).toEqual({
        content: [
          {
            type: "text",
            text: JSON.stringify({ error: "Unknown tool: unknownTool" }),
          },
        ],
      });
    });
  });
});
