import customerService from "../../services/customerService";
import { createMockCustomer } from "../testUtils";

// Simple test to verify test infrastructure
describe("Customer Service", () => {
  test("should exist and have getCustomers method", () => {
    expect(customerService).toBeDefined();
    expect(typeof customerService.getCustomers).toBe("function");
  });
});
