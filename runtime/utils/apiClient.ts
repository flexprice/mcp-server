import axios from "axios";
import { config } from "../config";

const apiClient = axios.create({
  baseURL: config.baseUrl,
  headers: {
    "Content-Type": "application/json",
    "x-api-key": config.apiKey,
  },
});

export default apiClient;
