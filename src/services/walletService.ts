import { Wallet, WalletTransaction } from "../types";
import apiClient from "../utils/apiClient";

export class WalletService {
  /**
   * Get a wallet by its ID
   * Endpoint: GET /wallets/{id}
   */
  async getWalletById(walletId: string): Promise<Wallet> {
    try {
      const response = await apiClient.get(`/wallets/${walletId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get real-time balance of a wallet
   * Endpoint: GET /wallets/{id}/balance
   */
  async getWalletBalance(
    walletId: string
  ): Promise<{ balance: number; currency: string }> {
    try {
      const response = await apiClient.get(`/wallets/${walletId}/balance`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get transactions for a wallet with pagination
   * Endpoint: GET /wallets/{id}/transactions
   */
  async getWalletTransactions(
    walletId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<WalletTransaction[]> {
    try {
      const response = await apiClient.get(
        `/wallets/${walletId}/transactions?limit=${limit}&offset=${offset}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all wallets for a customer
   * Endpoint: GET /customers/{id}/wallets
   */
  async getWalletsByCustomerId(customerId: string): Promise<Wallet[]> {
    try {
      const response = await apiClient.get(`/customers/${customerId}/wallets`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new WalletService();
