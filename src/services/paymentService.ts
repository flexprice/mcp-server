import { Payment } from "../types";
import apiClient from "../utils/apiClient";

export class PaymentService {
  /**
   * Get a payment by ID
   * Endpoint: GET /payments/{id}
   */
  async getPaymentById(paymentId: string): Promise<Payment> {
    try {
      const response = await apiClient.get(`/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * List payments with the specified filter
   * Endpoint: GET /payments
   */
  async getPayments(
    customerId?: string,
    status?: "pending" | "processed" | "failed",
    limit: number = 20,
    offset: number = 0
  ): Promise<Payment[]> {
    try {
      let url = `/payments?limit=${limit}&offset=${offset}`;
      if (customerId) {
        url += `&customer_id=${customerId}`;
      }
      if (status) {
        url += `&status=${status}`;
      }
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new PaymentService();
