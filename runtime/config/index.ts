import dotenv from "dotenv";
import path from "path";
import { RateLimitConfig } from "../types";

dotenv.config();

const baseUrl =
  process.env.FLEXPRICE_BASE_URL ||
  process.env.API_BASE_URL ||
  process.env.BASE_URL ||
  "http://localhost:8080";
const apiKey =
  process.env.FLEXPRICE_API_KEY ||
  process.env.API_KEY ||
  "default-api-key";
const openApiSpec =
  process.env.FLEXPRICE_OPENAPI_SPEC ||
  process.env.OPENAPI_SPEC ||
  "";

/** Default: repo root swagger/swagger-3-0.json (when run from repo root, e.g. ts-node runtime/server.ts). */
const defaultSpecPath = path.join(process.cwd(), "swagger", "swagger-3-0.json");

export const config = {
  baseUrl,
  apiKey,
  /** Where to load OpenAPI 3.0 JSON: URL, file path, or file:// URL. Empty = use default local file. */
  openApiSpec,
  /** Resolved spec: openApiSpec if set, else path to swagger/swagger-3-0.json relative to repo root. */
  getOpenApiSpecUrl: (): string => openApiSpec || defaultSpecPath,
  // no rate limit for now
  rateLimit: {
    windowMs: 60 * 1000, // 1 minute
    max: 100, // 100 requests per minute
    message: "Too many requests from this IP, please try again later.",
  } as RateLimitConfig,
  mcp: {
    name: "flexprice-mcp-server",
    version: "1.0.0",
  },
};
