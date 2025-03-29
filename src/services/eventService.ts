import { EventsResponse, UsageReport } from "../types";
import apiClient from "../utils/apiClient";

export class EventService {
  /**
   * Get events for a specific customer
   */
  async getEventsByCustomer(
    externalCustomerId: string,
    iterFirstKey?: string,
    iterLastKey?: string,
    startTime?: string,
    endTime?: string
  ): Promise<EventsResponse> {
    try {
      let requestUrl = `/v1/events?external_customer_id=${externalCustomerId}`;
      if (iterFirstKey) {
        requestUrl += `&iter_first_key=${iterFirstKey}`;
      }
      if (iterLastKey) {
        requestUrl += `&iter_last_key=${iterLastKey}`;
      }
      if (startTime) {
        requestUrl += `&start_time=${startTime}`;
      }
      if (endTime) {
        requestUrl += `&end_time=${endTime}`;
      }

      const response = await apiClient.get(requestUrl);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get usage statistics for events
   */
  async getUsage(params: {
    aggregation_type: string;
    event_name: string;
    external_customer_id?: string;
    customer_id?: string;
    start_time: string;
    end_time: string;
    property_name?: string;
    window_size?: string;
    filters?: Record<string, string[]>;
  }): Promise<UsageReport> {
    try {
      const response = await apiClient.post("/api/v1/events/usage", params);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get usage statistics by meter
   */
  async getUsageByMeter(params: {
    meter_id: string;
    customer_id?: string;
    external_customer_id?: string;
    start_time: string;
    end_time: string;
    window_size?: string;
    filters?: Record<string, string[]>;
  }): Promise<UsageReport> {
    try {
      const response = await apiClient.post(
        "/api/v1/events/usage/meter",
        params
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Ingest a new event
   */
  async ingestEvent(event: {
    event_name: string;
    external_customer_id: string;
    customer_id?: string;
    event_id?: string;
    properties?: Record<string, any>;
    source?: string;
    timestamp?: string;
  }): Promise<void> {
    try {
      await apiClient.post("/api/v1/events", event);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Ingest multiple events in bulk
   */
  async bulkIngestEvents(
    events: Array<{
      event_name: string;
      external_customer_id: string;
      customer_id?: string;
      event_id?: string;
      properties?: Record<string, any>;
      source?: string;
      timestamp?: string;
    }>
  ): Promise<void> {
    try {
      await apiClient.post("/api/v1/events/bulk", { events });
    } catch (error) {
      throw error;
    }
  }
}
