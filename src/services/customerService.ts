import { Customer, Subscription } from "../types";
import apiClient from "../utils/apiClient";

export class CustomerService {
  async getCustomerByEmail(email: string): Promise<Customer | null> {
    try {
      const response = await apiClient.get(
        `/api/v1/customers/by-email/${email}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getCustomerSubscriptions(customerId: string): Promise<Subscription[]> {
    try {
      const response = await apiClient.get(
        `/api/v1/customers/${customerId}/subscriptions`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getActiveSubscriptions(customerId: string): Promise<Subscription[]> {
    try {
      const response = await apiClient.get(
        `/api/v1/customers/${customerId}/subscriptions/active`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getCustomerById(customerId: string): Promise<Customer | null> {
    try {
      const response = await apiClient.get(`/api/v1/customers/${customerId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getCustomerPaymentMethods(customerId: string): Promise<any[]> {
    try {
      const response = await apiClient.get(
        `/api/v1/customers/${customerId}/payment-methods`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getCustomerBillingHistory(customerId: string): Promise<any[]> {
    try {
      const response = await apiClient.get(
        `/api/v1/customers/${customerId}/billing-history`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
