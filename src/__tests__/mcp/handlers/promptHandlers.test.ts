import { handlePrompt, prompts } from "../../../mcp/handlers/promptHandlers";
import invoiceService from "../../../services/invoiceService";
import customerService from "../../../services/customerService";
import subscriptionService from "../../../services/subscriptionService";

// Mock the services
jest.mock("../../../services/invoiceService");
jest.mock("../../../services/customerService");
jest.mock("../../../services/subscriptionService");

describe("Prompt Handlers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("prompts", () => {
    test("should export an array of prompts", () => {
      expect(Array.isArray(prompts)).toBe(true);
      expect(prompts.length).toBeGreaterThan(0);

      // Check that each prompt has the required fields
      prompts.forEach((prompt) => {
        expect(prompt).toHaveProperty("id");
        expect(prompt).toHaveProperty("name");
        expect(prompt).toHaveProperty("description");
        expect(Array.isArray(prompt.arguments)).toBe(true);
      });
    });
  });

  describe("handlePrompt", () => {
    test('should handle "Explain Charges" prompt', async () => {
      const mockInvoice = { id: "inv_1", amount: 100 };
      (invoiceService.getInvoiceById as jest.Mock).mockResolvedValueOnce(
        mockInvoice
      );

      const result = await handlePrompt("Explain Charges", {
        invoiceId: "inv_1",
      });

      expect(invoiceService.getInvoiceById).toHaveBeenCalledWith("inv_1");
      expect(result).toHaveProperty("messages");
      expect(Array.isArray(result.messages)).toBe(true);
      expect(result.messages.length).toBe(2);

      // Check the format of the messages
      expect(result.messages[0].role).toBe("assistant");
      expect(result.messages[0].content.type).toBe("text");
      expect(result.messages[0].content.text).toContain(
        "Instructions for invoice explanation"
      );

      expect(result.messages[1].role).toBe("assistant");
      expect(result.messages[1].content.type).toBe("text");
      expect(result.messages[1].content.text).toContain(
        JSON.stringify(mockInvoice)
      );
    });

    test('should handle "Billing Trends" prompt', async () => {
      const mockCustomer = { id: "cust_1", name: "Test Customer" };
      const mockSubscriptions = [{ id: "sub_1", status: "active" }];
      const mockUsageSummary = { total: 150 };

      (customerService.getCustomerById as jest.Mock).mockResolvedValueOnce(
        mockCustomer
      );
      (
        customerService.getCustomerSubscriptions as jest.Mock
      ).mockResolvedValueOnce(mockSubscriptions);
      (
        customerService.getCustomerUsageSummary as jest.Mock
      ).mockResolvedValueOnce(mockUsageSummary);

      const result = await handlePrompt("Billing Trends", {
        customerId: "cust_1",
      });

      expect(customerService.getCustomerById).toHaveBeenCalledWith("cust_1");
      expect(customerService.getCustomerSubscriptions).toHaveBeenCalledWith(
        "cust_1"
      );
      expect(customerService.getCustomerUsageSummary).toHaveBeenCalledWith(
        "cust_1"
      );

      expect(result).toHaveProperty("messages");
      expect(Array.isArray(result.messages)).toBe(true);
      expect(result.messages.length).toBe(2);

      expect(result.messages[1].content.text).toContain(
        JSON.stringify(mockCustomer)
      );
      expect(result.messages[1].content.text).toContain(
        JSON.stringify(mockSubscriptions)
      );
      expect(result.messages[1].content.text).toContain(
        JSON.stringify(mockUsageSummary)
      );
    });

    test("should throw error if required parameters are missing", async () => {
      await expect(handlePrompt("Explain Charges", {})).rejects.toThrow(
        "No invoiceId provided"
      );
    });

    test("should throw error for unknown prompt", async () => {
      await expect(handlePrompt("Unknown Prompt", {})).rejects.toThrow(
        "Unknown prompt name"
      );
    });
  });
});
