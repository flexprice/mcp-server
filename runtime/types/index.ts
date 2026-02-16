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
  status: "active" | "cancelled" | "expired" | "paused";
  startDate: Date;
  endDate?: Date;
  billingCycle: "monthly" | "yearly" | "weekly" | "quarterly" | "half-yearly";
  amount: number;
}

// New interfaces based on FlexPrice API documentation
export interface Plan {
  id: string;
  name: string;
  lookup_key: string;
  description?: string;
  charges?: PlanCharge[];
  created_at: string;
  updated_at: string;
}

export interface PlanCharge {
  id: string;
  currency: string;
  interval: "weekly" | "monthly" | "quarterly" | "half-yearly" | "yearly";
  price: number;
  billing_type: "advance" | "arrears";
  trial_period_days?: number;
}

export interface Price {
  id: string;
  name: string;
  lookup_key: string;
  description?: string;
  currency: string;
  unit_amount: number;
  billing_scheme: "per_unit" | "tiered";
  tiers?: PriceTier[];
  created_at: string;
  updated_at: string;
}

export interface PriceTier {
  flat_amount?: number;
  unit_amount?: number;
  up_to: number | "inf";
}

export interface Wallet {
  id: string;
  customer_id: string;
  balance: number;
  currency: string;
  status: "active" | "closed";
  auto_top_up?: {
    threshold: number;
    amount: number;
    enabled: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface WalletTransaction {
  id: string;
  wallet_id: string;
  amount: number;
  type: "credit" | "debit";
  balance_after: number;
  description?: string;
  created_at: string;
}

export interface Payment {
  id: string;
  customer_id: string;
  amount: number;
  currency: string;
  status: "pending" | "processed" | "failed";
  payment_method?: {
    type: string;
    details: Record<string, any>;
  };
  invoice_id?: string;
  created_at: string;
  updated_at: string;
}

export interface EventsResponse {
  events: Event[];
  has_more: boolean;
  iter_first_key: string;
  iter_last_key: string;
}

export interface Event {
  id: string;
  event_name: string;
  external_customer_id: string;
  customer_id?: string;
  properties?: Record<string, any>;
  source?: string;
  timestamp: string;
}

export interface UsageResult {
  value: number;
  window_size?: string;
}

export interface UsageReport {
  event_name: string;
  type: string;
  value: number;
  results: UsageResult[];
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
