import { Price } from "../types";
import apiClient from "../utils/apiClient";

export class PriceService {
  /**
   * Get prices with the specified filter
   * Endpoint: GET /prices
   */
  async getPrices(): Promise<Price[]> {
    try {
      const response = await apiClient.get(`/prices`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get a price by ID
   * Endpoint: GET /prices/{id}
   */
  async getPriceById(priceId: string): Promise<Price> {
    try {
      const response = await apiClient.get(`/prices/${priceId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new PriceService();
