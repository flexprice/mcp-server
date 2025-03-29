import { Invoice, LineItem, PaymentHistory } from "../types";
import apiClient from "../utils/apiClient";

export class InvoiceService {
  async getInvoiceById(invoiceId: string): Promise<Invoice | null> {
    try {
      const response = await apiClient.get(`/v1/invoices/${invoiceId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getInvoiceByNumber(invoiceNumber: string): Promise<Invoice | null> {
    try {
      const response = await apiClient.get(
        `/v1/invoices/by-number/${invoiceNumber}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getInvoiceLineItems(invoiceId: string): Promise<LineItem[]> {
    try {
      const response = await apiClient.get(
        `/v1/invoices/${invoiceId}/line-items`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getInvoicePaymentHistory(invoiceId: string): Promise<PaymentHistory[]> {
    try {
      const response = await apiClient.get(
        `/api/v1/invoices/${invoiceId}/payment-history`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getInvoicesByCustomerId(customerId: string): Promise<Invoice[]> {
    try {
      const response = await apiClient.get(
        `/v1/customers/${customerId}/invoices`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getInvoicesByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<Invoice[]> {
    try {
      const response = await apiClient.get("/v1/invoices", {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
