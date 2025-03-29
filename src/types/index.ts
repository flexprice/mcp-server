export interface Invoice {
  id: string;
  number: string;
  customerId: string;
  status: "pending" | "paid" | "overdue" | "cancelled";
  amount: number;
  lineItems: LineItem[];
  paymentHistory: PaymentHistory[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PaymentHistory {
  id: string;
  amount: number;
  status: "success" | "failed" | "pending";
  timestamp: Date;
  transactionId?: string;
}

export interface Customer {
  id: string;
  email: string;
  name: string;
  subscriptions: Subscription[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: string;
  customerId: string;
  planId: string;
  status: "active" | "cancelled" | "expired";
  startDate: Date;
  endDate?: Date;
  billingCycle: "monthly" | "yearly";
  amount: number;
}

export interface MCPConfig {
  name: string;
  version: string;
  capabilities: {
    resources: Record<string, any>;
  };
}

export interface RateLimitConfig {
  windowMs: number;
  max: number;
  message: string;
}

export interface LoggerConfig {
  level: string;
  format: string;
  transports: any[];
}
