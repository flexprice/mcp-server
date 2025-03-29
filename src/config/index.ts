import dotenv from "dotenv";
import { RateLimitConfig } from "../types";

dotenv.config();

export const config = {
  baseUrl: process.env.API_BASE_URL || "http://localhost:8080",
  apiKey: process.env.API_KEY || "default-api-key",
  // no rate limit for now
  rateLimit: {
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
    message: "Too many requests from this IP, please try again later.",
  } as RateLimitConfig,
  mcp: {
    name: "flexprice-mcp-server",
    version: "1.0.0",
    capabilities: {
      tools: {},
      resources: {},
      prompts: {},
    },
  },
};
