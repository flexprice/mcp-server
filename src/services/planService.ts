import { Plan } from "../types";
import apiClient from "../utils/apiClient";

export class PlanService {
  /**
   * Get all plans with optional filtering
   * Endpoint: GET /plans
   */
  async getPlans(): Promise<Plan[]> {
    try {
      const response = await apiClient.get(`/plans`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get a plan by ID
   * Endpoint: GET /plans/{id}
   */
  async getPlanById(planId: string): Promise<Plan> {
    try {
      const response = await apiClient.get(`/plans/${planId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new PlanService();
