// Basic test to verify API client exists
import apiClient from "../../utils/apiClient";

describe("API Client", () => {
  test("should be defined", () => {
    expect(apiClient).toBeDefined();
    // Verify interceptors exist
    expect(apiClient.interceptors).toBeDefined();
    expect(apiClient.interceptors.request).toBeDefined();
    expect(apiClient.interceptors.response).toBeDefined();
  });
});
