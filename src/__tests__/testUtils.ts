import {
  Customer,
  Invoice,
  Payment,
  Plan,
  Price,
  Subscription,
  Wallet,
} from "../types";

/**
 * Utility functions and mock data for tests
 */

// Mock data generators
export const createMockCustomer = (overrides = {}): Customer => ({
  id: "cust_123",
  email: "test@example.com",
  name: "Test Customer",
  subscriptions: [],
  createdAt: new Date("2023-01-01"),
  updatedAt: new Date("2023-01-01"),
  ...overrides,
});

export const createMockSubscription = (overrides = {}): Subscription => ({
  id: "sub_123",
  customerId: "cust_123",
  planId: "plan_123",
  status: "active",
  startDate: new Date("2023-01-01"),
  billingCycle: "monthly",
  amount: 49.99,
  ...overrides,
});

export const createMockInvoice = (overrides = {}): Invoice => ({
  id: "inv_123",
  number: "INV-001",
  customerId: "cust_123",
  status: "pending",
  amount: 49.99,
  lineItems: [
    {
      id: "item_1",
      description: "Monthly subscription",
      quantity: 1,
      unitPrice: 49.99,
      total: 49.99,
    },
  ],
  paymentHistory: [],
  createdAt: new Date("2023-01-01"),
  updatedAt: new Date("2023-01-01"),
  ...overrides,
});

export const createMockPlan = (overrides = {}): Plan => ({
  id: "plan_123",
  name: "Basic Plan",
  lookup_key: "basic",
  description: "Basic plan with essential features",
  charges: [
    {
      id: "charge_1",
      currency: "USD",
      interval: "monthly",
      price: 49.99,
      billing_type: "advance",
    },
  ],
  created_at: "2023-01-01T00:00:00Z",
  updated_at: "2023-01-01T00:00:00Z",
  ...overrides,
});

export const createMockPrice = (overrides = {}): Price => ({
  id: "price_123",
  name: "Basic Price",
  lookup_key: "basic_price",
  description: "Basic price for essential features",
  currency: "USD",
  unit_amount: 49.99,
  billing_scheme: "per_unit",
  created_at: "2023-01-01T00:00:00Z",
  updated_at: "2023-01-01T00:00:00Z",
  ...overrides,
});

export const createMockWallet = (overrides = {}): Wallet => ({
  id: "wallet_123",
  customer_id: "cust_123",
  balance: 100,
  currency: "USD",
  status: "active",
  created_at: "2023-01-01T00:00:00Z",
  updated_at: "2023-01-01T00:00:00Z",
  ...overrides,
});

export const createMockPayment = (overrides = {}): Payment => ({
  id: "payment_123",
  customer_id: "cust_123",
  amount: 49.99,
  currency: "USD",
  status: "processed",
  invoice_id: "inv_123",
  created_at: "2023-01-01T00:00:00Z",
  updated_at: "2023-01-01T00:00:00Z",
  ...overrides,
});

// Test helpers
export const mockApiResponse = <T>(data: T) => {
  return Promise.resolve({ data });
};

export const mockApiError = (status = 500, message = "API Error") => {
  const error = new Error(message) as any;
  error.response = { status, data: { message } };
  return Promise.reject(error);
};

// Simple test to verify test utils exist
describe("Test Utilities", () => {
  test("should create mock objects", () => {
    const customer = createMockCustomer();
    expect(customer).toBeDefined();
    expect(customer.id).toBe("cust_123");

    const invoice = createMockInvoice();
    expect(invoice).toBeDefined();
    expect(invoice.status).toBe("pending");

    const plan = createMockPlan();
    expect(plan).toBeDefined();
    expect(plan.name).toBe("Basic Plan");
  });
});
