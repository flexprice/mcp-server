import axios from "axios";
import { config } from "../config";

const apiClient = axios.create({
  baseURL: config.baseUrl,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": config.apiKey,
  },
});

// Add request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for logging
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
