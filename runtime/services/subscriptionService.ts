import { Subscription } from "../types";
import apiClient from "../utils/apiClient";

export class SubscriptionService {
  /**
   * Get subscriptions with optional filtering
   * Endpoint: GET /subscriptions
   */
  async getSubscriptions(): Promise<Subscription[]> {
    try {
      const response = await apiClient.get(`/subscriptions`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get a subscription by ID
   * Endpoint: GET /subscription/{id}
   */
  async getSubscriptionById(subscriptionId: string): Promise<Subscription> {
    try {
      const response = await apiClient.get(`/subscriptions/${subscriptionId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get usage for a subscription
   * Endpoint: GET /subscriptions/{id}/usage
   */
  async getSubscriptionUsage(subscriptionId: string): Promise<any> {
    try {
      const response = await apiClient.get(
        `/subscriptions/${subscriptionId}/usage`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * List all pauses for a subscription
   * Endpoint: GET /subscriptions/{id}/pauses
   */
  async getSubscriptionPauses(subscriptionId: string): Promise<any[]> {
    try {
      const response = await apiClient.get(
        `/subscriptions/${subscriptionId}/pauses`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new SubscriptionService();
