import { Customer, Subscription } from "../types";
import apiClient from "../utils/apiClient";

export class CustomerService {
  async getAllCustomers(): Promise<Customer[]> {
    try {
      const response = await apiClient.get(`/api/v1/customers`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getCustomerSubscriptions(customerId: string): Promise<Subscription[]> {
    try {
      const response = await apiClient.get(
        `/api/v1/subscriptions?customerId=${customerId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getActiveSubscriptions(customerId: string): Promise<Subscription[]> {
    try {
      const response = await apiClient.get(
        `/api/v1/subscriptions?customerId=${customerId}&subscription_status=active`
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
}
