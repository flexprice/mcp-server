import { Invoice, LineItem, PaymentHistory } from "../types";
import apiClient from "../utils/apiClient";

export class InvoiceService {
  /**
   * Get an invoice by ID
   * Endpoint: GET /invoices/{id}
   */
  async getInvoiceById(invoiceId: string): Promise<Invoice> {
    try {
      const response = await apiClient.get(`/invoices/${invoiceId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get an invoice by number
   * Endpoint: GET /invoices/by-number/{number}
   */
  async getInvoiceByNumber(invoiceNumber: string): Promise<Invoice> {
    try {
      const response = await apiClient.get(
        `/invoices/by-number/${invoiceNumber}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get invoice line items
   * Endpoint: GET /invoices/{id}/line-items
   */
  async getInvoiceLineItems(invoiceId: string): Promise<LineItem[]> {
    try {
      const response = await apiClient.get(`/invoices/${invoiceId}/line-items`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get invoice payment history
   * Endpoint: GET /invoices/{id}/payment-history
   */
  async getInvoicePaymentHistory(invoiceId: string): Promise<PaymentHistory[]> {
    try {
      const response = await apiClient.get(
        `/invoices/${invoiceId}/payment-history`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get invoices by customer ID
   * Endpoint: GET /customers/{id}/invoices
   */
  async getInvoicesByCustomerId(customerId: string): Promise<Invoice[]> {
    try {
      const response = await apiClient.get(`/customers/${customerId}/invoices`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get invoices with filtering
   * Endpoint: GET /invoices
   */
  async getInvoices(
    startDate?: Date,
    endDate?: Date,
    status?: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<Invoice[]> {
    try {
      let url = `/invoices?limit=${limit}&offset=${offset}`;
      if (startDate) {
        url += `&start_date=${startDate.toISOString()}`;
      }
      if (endDate) {
        url += `&end_date=${endDate.toISOString()}`;
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

export default new InvoiceService();
