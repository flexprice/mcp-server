import { Customer, Subscription } from "../types";
import apiClient from "../utils/apiClient";

export class CustomerService {
  /**
   * Get customers with optional filtering
   * Endpoint: GET /customers
   */
  async getCustomers(): Promise<Customer[]> {
    try {
      const response = await apiClient.get(`/customers`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get a customer by ID
   * Endpoint: GET /customers/{id}
   */
  async getCustomerById(customerId: string): Promise<Customer> {
    try {
      const response = await apiClient.get(`/customers/${customerId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get a customer by lookup key (external_id)
   * Endpoint: GET /customers/lookup/{lookup_key}
   */
  async getCustomerByLookupKey(lookupKey: string): Promise<Customer> {
    try {
      const response = await apiClient.get(`/customers/lookup/${lookupKey}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get customer entitlements
   * Endpoint: GET /customers/{id}/entitlements
   */
  async getCustomerEntitlements(customerId: string): Promise<any[]> {
    try {
      const response = await apiClient.get(
        `/customers/${customerId}/entitlements`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get customer usage summary
   * Endpoint: GET /customers/{id}/usage
   */
  async getCustomerUsageSummary(customerId: string): Promise<any> {
    try {
      const response = await apiClient.get(`/customers/${customerId}/usage`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get customer subscriptions
   * Endpoint: GET /subscriptions?customerId={customerId}
   */
  async getCustomerSubscriptions(customerId: string): Promise<Subscription[]> {
    try {
      const response = await apiClient.get(
        `/subscriptions?customerId=${customerId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get active subscriptions for a customer
   * Endpoint: GET /subscriptions?customerId={customerId}&status=active
   */
  async getActiveSubscriptions(customerId: string): Promise<Subscription[]> {
    try {
      const response = await apiClient.get(
        `/subscriptions?customerId=${customerId}&status=active`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new CustomerService();
