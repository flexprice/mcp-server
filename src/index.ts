#!/usr/bin/env node
/**
 * MCP Server generated from OpenAPI spec for flexprice-mcp v1.0
 * Generated on: 2026-02-16T17:19:44.932Z
 */

// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool,
  type CallToolResult,
  type CallToolRequest
} from "@modelcontextprotocol/sdk/types.js";

import { z, ZodError } from 'zod';
import { jsonSchemaToZod } from 'json-schema-to-zod';
import axios, { type AxiosRequestConfig, type AxiosError } from 'axios';

/**
 * Type definition for JSON objects
 */
type JsonObject = Record<string, any>;

/**
 * Interface for MCP Tool Definition
 */
interface McpToolDefinition {
    name: string;
    description: string;
    inputSchema: any;
    method: string;
    pathTemplate: string;
    executionParameters: { name: string, in: string }[];
    requestBodyContentType?: string;
    securityRequirements: any[];
}

/**
 * Server configuration
 */
export const SERVER_NAME = "flexprice-mcp";
export const SERVER_VERSION = "1.0";
export const API_BASE_URL = "/v1";
/** Base URL for the FlexPrice API (e.g. https://api-dev.cloud.flexprice.io). Set via env BASE_URL. */
const ENV_BASE_URL = process.env.BASE_URL || "";

/**
 * MCP Server instance
 */
const server = new Server(
    { name: SERVER_NAME, version: SERVER_VERSION },
    { capabilities: { tools: {} } }
);

/**
 * Map of tool definitions by name
 */
const toolDefinitionMap: Map<string, McpToolDefinition> = new Map([

  ["GetAddons", {
    name: "GetAddons",
    description: `Get addons with optional filtering`,
    inputSchema: {"type":"object","properties":{"addon_ids":{"type":"array","items":{"type":"string"}},"addon_type":{"type":"string","enum":["onetime"],"x-enum-varnames":["AddonTypeOnetime"]},"end_time":{"type":"string"},"expand":{"type":"string"},"limit":{"maximum":1000,"minimum":1,"type":"number"},"lookup_keys":{"type":"array","items":{"type":"string"}},"offset":{"minimum":0,"type":"number"},"order":{"type":"string","enum":["asc","desc"]},"start_time":{"type":"string"},"status":{"type":"string","enum":["published","deleted","archived"],"x-enum-varnames":["StatusPublished","StatusDeleted","StatusArchived"]}}},
    method: "get",
    pathTemplate: "/addons",
    executionParameters: [{"name":"addon_ids","in":"query"},{"name":"addon_type","in":"query"},{"name":"end_time","in":"query"},{"name":"expand","in":"query"},{"name":"limit","in":"query"},{"name":"lookup_keys","in":"query"},{"name":"offset","in":"query"},{"name":"order","in":"query"},{"name":"start_time","in":"query"},{"name":"status","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostAddons", {
    name: "PostAddons",
    description: `Create a new addon`,
    inputSchema: {"type":"object","properties":{"requestBody":{"required":["lookup_key","name","type"],"type":"object","properties":{"description":{"type":"string"},"lookup_key":{"type":"string"},"metadata":{"type":"object","additionalProperties":true},"name":{"type":"string"},"type":{"type":"string","enum":["onetime"],"x-enum-varnames":["AddonTypeOnetime"]}},"description":"Addon Request"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/addons",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetAddonsLookupByLookupKey", {
    name: "GetAddonsLookupByLookupKey",
    description: `Get an addon by lookup key`,
    inputSchema: {"type":"object","properties":{"lookup_key":{"type":"string","description":"Addon Lookup Key"}},"required":["lookup_key"]},
    method: "get",
    pathTemplate: "/addons/lookup/{lookup_key}",
    executionParameters: [{"name":"lookup_key","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostAddonsSearch", {
    name: "PostAddonsSearch",
    description: `List addons by filter`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"object","properties":{"addon_ids":{"type":"array","items":{"type":"string"}},"addon_type":{"type":"string","enum":["onetime"],"x-enum-varnames":["AddonTypeOnetime"]},"end_time":{"type":"string"},"expand":{"type":"string"},"filters":{"type":"array","description":"filters allows complex filtering based on multiple fields","items":{"type":"object","properties":{"data_type":{"type":"string","enum":["string","number","date","array"],"x-enum-varnames":["DataTypeString","DataTypeNumber","DataTypeDate","DataTypeArray"]},"field":{"type":"string"},"operator":{"type":"string","enum":["eq","contains","not_contains","gt","lt","in","not_in","before","after"],"x-enum-varnames":["EQUAL","CONTAINS","NOT_CONTAINS","GREATER_THAN","LESS_THAN","IN","NOT_IN","BEFORE","AFTER"]},"value":{"type":"object","properties":{"array":{"type":"array","items":{"type":"string"}},"boolean":{"type":"boolean"},"date":{"type":"string"},"number":{"type":"number"},"string":{"type":"string"}}}}}},"limit":{"maximum":1000,"minimum":1,"type":"number"},"lookup_keys":{"type":"array","items":{"type":"string"}},"offset":{"minimum":0,"type":"number"},"order":{"type":"string","enum":["asc","desc"]},"sort":{"type":"array","items":{"type":"object","properties":{"direction":{"type":"string","enum":["asc","desc"],"x-enum-varnames":["SortDirectionAsc","SortDirectionDesc"]},"field":{"type":"string"}}}},"start_time":{"type":"string"},"status":{"type":"string","enum":["published","deleted","archived"],"x-enum-varnames":["StatusPublished","StatusDeleted","StatusArchived"]}},"description":"Filter"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/addons/search",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetAddonsById", {
    name: "GetAddonsById",
    description: `Get an addon by ID`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Addon ID"}},"required":["id"]},
    method: "get",
    pathTemplate: "/addons/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PutAddonsById", {
    name: "PutAddonsById",
    description: `Update an existing addon`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Addon ID"},"requestBody":{"type":"object","properties":{"description":{"type":"string"},"metadata":{"type":"object","additionalProperties":true},"name":{"type":"string"}},"description":"Update Addon Request"}},"required":["id","requestBody"]},
    method: "put",
    pathTemplate: "/addons/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["DeleteAddonsById", {
    name: "DeleteAddonsById",
    description: `Delete an addon`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Addon ID"}},"required":["id"]},
    method: "delete",
    pathTemplate: "/addons/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetAddonsEntitlements", {
    name: "GetAddonsEntitlements",
    description: `Get all entitlements for an addon`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Addon ID"}},"required":["id"]},
    method: "get",
    pathTemplate: "/addons/{id}/entitlements",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostAlertSearch", {
    name: "PostAlertSearch",
    description: `List alert logs by filter with optional expand for customer, wallet, and feature`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"object","properties":{"alert_status":{"type":"string","enum":["ok","info","warning","in_alarm"],"x-enum-varnames":["AlertStateOk","AlertStateInfo","AlertStateWarning","AlertStateInAlarm"]},"alert_type":{"type":"string","enum":["low_ongoing_balance","low_credit_balance","feature_wallet_balance"],"x-enum-varnames":["AlertTypeLowOngoingBalance","AlertTypeLowCreditBalance","AlertTypeFeatureWalletBalance"]},"customer_id":{"type":"string"},"end_time":{"type":"string"},"entity_id":{"type":"string"},"entity_type":{"type":"string","enum":["wallet","feature"],"x-enum-varnames":["AlertEntityTypeWallet","AlertEntityTypeFeature"]},"expand":{"type":"string"},"filters":{"type":"array","description":"filters allows complex filtering based on multiple fields","items":{"type":"object","properties":{"data_type":{"type":"string","enum":["string","number","date","array"],"x-enum-varnames":["DataTypeString","DataTypeNumber","DataTypeDate","DataTypeArray"]},"field":{"type":"string"},"operator":{"type":"string","enum":["eq","contains","not_contains","gt","lt","in","not_in","before","after"],"x-enum-varnames":["EQUAL","CONTAINS","NOT_CONTAINS","GREATER_THAN","LESS_THAN","IN","NOT_IN","BEFORE","AFTER"]},"value":{"type":"object","properties":{"array":{"type":"array","items":{"type":"string"}},"boolean":{"type":"boolean"},"date":{"type":"string"},"number":{"type":"number"},"string":{"type":"string"}}}}}},"limit":{"maximum":1000,"minimum":1,"type":"number"},"offset":{"minimum":0,"type":"number"},"order":{"type":"string","enum":["asc","desc"]},"sort":{"type":"array","items":{"type":"object","properties":{"direction":{"type":"string","enum":["asc","desc"],"x-enum-varnames":["SortDirectionAsc","SortDirectionDesc"]},"field":{"type":"string"}}}},"start_time":{"type":"string"},"status":{"type":"string","enum":["published","deleted","archived"],"x-enum-varnames":["StatusPublished","StatusDeleted","StatusArchived"]}},"description":"Filter"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/alert/search",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostAuthLogin", {
    name: "PostAuthLogin",
    description: `Login a user`,
    inputSchema: {"type":"object","properties":{"requestBody":{"required":["email","password"],"type":"object","properties":{"email":{"type":"string"},"password":{"minLength":8,"type":"string"},"token":{"type":"string"}},"description":"Login request"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/auth/login",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: []
  }],
  ["PostAuthSignup", {
    name: "PostAuthSignup",
    description: `Sign up a new user`,
    inputSchema: {"type":"object","properties":{"requestBody":{"required":["email"],"type":"object","properties":{"email":{"type":"string"},"password":{"minLength":8,"type":"string"},"tenant_name":{"type":"string"},"token":{"type":"string"}},"description":"Sign up request"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/auth/signup",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: []
  }],
  ["GetConnections", {
    name: "GetConnections",
    description: `Get a list of connections`,
    inputSchema: {"type":"object","properties":{"connection_ids":{"type":"array","items":{"type":"string"}},"end_time":{"type":"string"},"expand":{"type":"string"},"limit":{"maximum":1000,"minimum":1,"type":"number"},"offset":{"minimum":0,"type":"number"},"order":{"type":"string","enum":["asc","desc"]},"provider_type":{"type":"string","enum":["flexprice","stripe","s3","hubspot","razorpay","chargebee","quickbooks","nomod"],"x-enum-varnames":["SecretProviderFlexPrice","SecretProviderStripe","SecretProviderS3","SecretProviderHubSpot","SecretProviderRazorpay","SecretProviderChargebee","SecretProviderQuickBooks","SecretProviderNomod"]},"start_time":{"type":"string"},"status":{"type":"string","enum":["published","deleted","archived"],"x-enum-varnames":["StatusPublished","StatusDeleted","StatusArchived"]}}},
    method: "get",
    pathTemplate: "/connections",
    executionParameters: [{"name":"connection_ids","in":"query"},{"name":"end_time","in":"query"},{"name":"expand","in":"query"},{"name":"limit","in":"query"},{"name":"offset","in":"query"},{"name":"order","in":"query"},{"name":"provider_type","in":"query"},{"name":"start_time","in":"query"},{"name":"status","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostConnectionsSearch", {
    name: "PostConnectionsSearch",
    description: `List connections by filter`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"object","properties":{"connection_ids":{"type":"array","items":{"type":"string"}},"end_time":{"type":"string"},"expand":{"type":"string"},"filters":{"type":"array","items":{"type":"object","properties":{"data_type":{"type":"string","enum":["string","number","date","array"],"x-enum-varnames":["DataTypeString","DataTypeNumber","DataTypeDate","DataTypeArray"]},"field":{"type":"string"},"operator":{"type":"string","enum":["eq","contains","not_contains","gt","lt","in","not_in","before","after"],"x-enum-varnames":["EQUAL","CONTAINS","NOT_CONTAINS","GREATER_THAN","LESS_THAN","IN","NOT_IN","BEFORE","AFTER"]},"value":{"type":"object","properties":{"array":{"type":"array","items":{"type":"string"}},"boolean":{"type":"boolean"},"date":{"type":"string"},"number":{"type":"number"},"string":{"type":"string"}}}}}},"limit":{"maximum":1000,"minimum":1,"type":"number"},"offset":{"minimum":0,"type":"number"},"order":{"type":"string","enum":["asc","desc"]},"provider_type":{"type":"string","enum":["flexprice","stripe","s3","hubspot","razorpay","chargebee","quickbooks","nomod"],"x-enum-varnames":["SecretProviderFlexPrice","SecretProviderStripe","SecretProviderS3","SecretProviderHubSpot","SecretProviderRazorpay","SecretProviderChargebee","SecretProviderQuickBooks","SecretProviderNomod"]},"sort":{"type":"array","items":{"type":"object","properties":{"direction":{"type":"string","enum":["asc","desc"],"x-enum-varnames":["SortDirectionAsc","SortDirectionDesc"]},"field":{"type":"string"}}}},"start_time":{"type":"string"},"status":{"type":"string","enum":["published","deleted","archived"],"x-enum-varnames":["StatusPublished","StatusDeleted","StatusArchived"]}},"description":"Filter"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/connections/search",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetConnectionsById", {
    name: "GetConnectionsById",
    description: `Get a connection by ID`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Connection ID"}},"required":["id"]},
    method: "get",
    pathTemplate: "/connections/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PutConnectionsById", {
    name: "PutConnectionsById",
    description: `Update a connection by ID`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Connection ID"},"requestBody":{"type":"object","properties":{"encrypted_secret_data":{"type":"object","properties":{"chargebee":{"type":"object","properties":{"api_key":{"type":"string","description":"Chargebee API key (encrypted)"},"site":{"type":"string","description":"Chargebee site name (not encrypted)"},"webhook_password":{"type":"string","description":"Basic Auth password for webhooks (encrypted)"},"webhook_secret":{"type":"string","description":"Chargebee Webhook Secret (encrypted, optional, NOT USED in v2)"},"webhook_username":{"type":"string","description":"Basic Auth username for webhooks (encrypted)"}}},"generic":{"type":"object","properties":{"data":{"type":"object","additionalProperties":true}}},"hubspot":{"type":"object","properties":{"access_token":{"type":"string","description":"Private App Access Token (encrypted)"},"app_id":{"type":"string","description":"HubSpot App ID (optional, not encrypted)"},"client_secret":{"type":"string","description":"Private App Client Secret for webhook verification (encrypted)"}}},"nomod":{"type":"object","properties":{"api_key":{"type":"string","description":"Nomod API Key (encrypted)"},"webhook_secret":{"type":"string","description":"Basic Auth secret for webhooks (encrypted, optional)"}}},"quickbooks":{"type":"object","properties":{"access_token":{"type":"string","description":"Managed internally - set after auth code exchange or token refresh"},"auth_code":{"type":"string","description":"Optional - for initial setup via auth code (will be cleared after token exchange)"},"client_id":{"type":"string","description":"Required for initial connection setup"},"client_secret":{"type":"string","description":"OAuth Client Secret (encrypted)"},"environment":{"type":"string","description":"\"sandbox\" or \"production\""},"income_account_id":{"type":"string","description":"Optional configuration"},"oauth_session_data":{"type":"string","description":"Temporary OAuth session data (only used during OAuth flow, cleared after completion)"},"realm_id":{"type":"string","description":"QuickBooks Company ID (not encrypted)"},"redirect_uri":{"type":"string","description":"OAuth Redirect URI (temporary)"},"refresh_token":{"type":"string","description":"OAuth Refresh Token (encrypted)"},"webhook_verifier_token":{"type":"string","description":"Webhook security"}}},"razorpay":{"type":"object","properties":{"key_id":{"type":"string","description":"Razorpay Key ID (encrypted)"},"secret_key":{"type":"string","description":"Razorpay Secret Key (encrypted)"},"webhook_secret":{"type":"string","description":"Razorpay Webhook Secret (encrypted, optional)"}}},"s3":{"type":"object","properties":{"aws_access_key_id":{"type":"string","description":"AWS access key (encrypted)"},"aws_secret_access_key":{"type":"string","description":"AWS secret access key (encrypted)"},"aws_session_token":{"type":"string","description":"AWS session token for temporary credentials (encrypted)"}}},"settings":{"type":"object","properties":{"invoice_sync_enable":{"type":"boolean"}}},"stripe":{"type":"object","properties":{"account_id":{"type":"string"},"publishable_key":{"type":"string"},"secret_key":{"type":"string"},"webhook_secret":{"type":"string"}}}}},"metadata":{"type":"object","additionalProperties":true},"name":{"maxLength":255,"type":"string"},"sync_config":{"type":"object","properties":{"deal":{"type":"object","properties":{"inbound":{"type":"boolean","description":"Inbound from external provider to FlexPrice"},"outbound":{"type":"boolean","description":"Outbound from FlexPrice to external provider"}}},"invoice":{"type":"object","properties":{"inbound":{"type":"boolean","description":"Inbound from external provider to FlexPrice"},"outbound":{"type":"boolean","description":"Outbound from FlexPrice to external provider"}}},"payment":{"type":"object","properties":{"inbound":{"type":"boolean","description":"Inbound from external provider to FlexPrice"},"outbound":{"type":"boolean","description":"Outbound from FlexPrice to external provider"}}},"plan":{"type":"object","properties":{"inbound":{"type":"boolean","description":"Inbound from external provider to FlexPrice"},"outbound":{"type":"boolean","description":"Outbound from FlexPrice to external provider"}}},"quote":{"type":"object","properties":{"inbound":{"type":"boolean","description":"Inbound from external provider to FlexPrice"},"outbound":{"type":"boolean","description":"Outbound from FlexPrice to external provider"}}},"s3":{"type":"object","properties":{"bucket":{"type":"string","description":"S3 bucket name"},"compression":{"type":"string","enum":["none","gzip"],"x-enum-varnames":["S3CompressionTypeNone","S3CompressionTypeGzip"]},"encryption":{"type":"string","enum":["AES256","aws:kms","aws:kms:dsse"],"x-enum-varnames":["S3EncryptionTypeAES256","S3EncryptionTypeAwsKms","S3EncryptionTypeAwsKmsDsse"]},"is_flexprice_managed":{"type":"boolean","description":"If true, use Flexprice-managed S3 credentials instead of user-provided"},"key_prefix":{"type":"string","description":"Optional prefix for S3 keys (e.g., \"flexprice-exports/\")"},"region":{"type":"string","description":"AWS region (e.g., \"us-west-2\")"}}},"subscription":{"type":"object","properties":{"inbound":{"type":"boolean","description":"Inbound from external provider to FlexPrice"},"outbound":{"type":"boolean","description":"Outbound from FlexPrice to external provider"}}}}}},"description":"Connection"}},"required":["id","requestBody"]},
    method: "put",
    pathTemplate: "/connections/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["DeleteConnectionsById", {
    name: "DeleteConnectionsById",
    description: `Delete a connection by ID`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Connection ID"}},"required":["id"]},
    method: "delete",
    pathTemplate: "/connections/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostCosts", {
    name: "PostCosts",
    description: `Create a new costsheet with the specified name`,
    inputSchema: {"type":"object","properties":{"requestBody":{"required":["name"],"type":"object","properties":{"description":{"type":"string"},"lookup_key":{"maxLength":255,"minLength":1,"type":"string"},"metadata":{"type":"object","additionalProperties":{"type":"string"}},"name":{"maxLength":255,"minLength":1,"type":"string"}},"description":"Costsheet configuration"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/costs",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetCostsActive", {
    name: "GetCostsActive",
    description: `Get the active costsheet for the current tenant`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/costs/active",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostCostsAnalytics", {
    name: "PostCostsAnalytics",
    description: `Retrieve combined analytics with ROI, margin, and detailed breakdowns. If start_time and end_time are not provided, defaults to last 7 days.`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"object","properties":{"end_time":{"type":"string"},"expand":{"type":"array","description":"Expand options - specify which entities to expand","items":{"type":"string"}},"external_customer_id":{"type":"string","description":"Optional - for specific customer"},"feature_ids":{"type":"array","description":"Additional filters","items":{"type":"string"}},"limit":{"type":"number","description":"Pagination"},"offset":{"type":"number"},"start_time":{"type":"string","description":"Time range fields (optional - defaults to last 7 days if not provided)"}},"description":"Combined analytics request (start_time/end_time optional - defaults to last 7 days)"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/costs/analytics",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostCostsAnalyticsV2", {
    name: "PostCostsAnalyticsV2",
    description: `Retrieve combined analytics with ROI, margin, and detailed breakdowns. If start_time and end_time are not provided, defaults to last 7 days.`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"object","properties":{"end_time":{"type":"string"},"expand":{"type":"array","description":"Expand options - specify which entities to expand","items":{"type":"string"}},"external_customer_id":{"type":"string","description":"Optional - for specific customer"},"feature_ids":{"type":"array","description":"Additional filters","items":{"type":"string"}},"limit":{"type":"number","description":"Pagination"},"offset":{"type":"number"},"start_time":{"type":"string","description":"Time range fields (optional - defaults to last 7 days if not provided)"}},"description":"Combined analytics request (start_time/end_time optional - defaults to last 7 days)"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/costs/analytics-v2",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostCostsSearch", {
    name: "PostCostsSearch",
    description: `List costsheet records by filter with POST body`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"object","properties":{"costsheetIDs":{"type":"array","description":"CostsheetIDs allows filtering by specific costsheet IDs","items":{"type":"string"}},"environmentID":{"type":"string","description":"EnvironmentID filters by specific environment ID"},"filters":{"type":"array","description":"Filters contains custom filtering conditions","items":{"type":"object","properties":{"data_type":{"type":"string","enum":["string","number","date","array"],"x-enum-varnames":["DataTypeString","DataTypeNumber","DataTypeDate","DataTypeArray"]},"field":{"type":"string"},"operator":{"type":"string","enum":["eq","contains","not_contains","gt","lt","in","not_in","before","after"],"x-enum-varnames":["EQUAL","CONTAINS","NOT_CONTAINS","GREATER_THAN","LESS_THAN","IN","NOT_IN","BEFORE","AFTER"]},"value":{"type":"object","properties":{"array":{"type":"array","items":{"type":"string"}},"boolean":{"type":"boolean"},"date":{"type":"string"},"number":{"type":"number"},"string":{"type":"string"}}}}}},"lookupKey":{"type":"string","description":"LookupKey filters by lookup key"},"name":{"type":"string","description":"Name filters by costsheet name"},"queryFilter":{"type":"object","properties":{"expand":{"type":"string"},"limit":{"maximum":1000,"minimum":1,"type":"number"},"offset":{"minimum":0,"type":"number"},"order":{"type":"string","enum":["asc","desc"]},"sort":{"type":"string"},"status":{"type":"string","enum":["published","deleted","archived"],"x-enum-varnames":["StatusPublished","StatusDeleted","StatusArchived"]}}},"sort":{"type":"array","description":"Sort specifies result ordering preferences","items":{"type":"object","properties":{"direction":{"type":"string","enum":["asc","desc"],"x-enum-varnames":["SortDirectionAsc","SortDirectionDesc"]},"field":{"type":"string"}}}},"status":{"type":"string","enum":["published","deleted","archived"],"x-enum-varnames":["StatusPublished","StatusDeleted","StatusArchived"]},"tenantID":{"type":"string","description":"TenantID filters by specific tenant ID"},"timeRangeFilter":{"type":"object","properties":{"end_time":{"type":"string"},"start_time":{"type":"string"}}}},"description":"Filter"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/costs/search",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetCostsById", {
    name: "GetCostsById",
    description: `Get a costsheet by ID with optional price expansion`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Costsheet ID"},"expand":{"type":"string","description":"Comma-separated list of fields to expand (e.g., 'prices')"}},"required":["id"]},
    method: "get",
    pathTemplate: "/costs/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"expand","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PutCostsById", {
    name: "PutCostsById",
    description: `Update a costsheet with the specified configuration`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Costsheet ID"},"requestBody":{"type":"object","properties":{"description":{"type":"string"},"lookup_key":{"maxLength":255,"minLength":1,"type":"string"},"metadata":{"type":"object","additionalProperties":{"type":"string"}},"name":{"maxLength":255,"minLength":1,"type":"string"}},"description":"Costsheet configuration"}},"required":["id","requestBody"]},
    method: "put",
    pathTemplate: "/costs/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["DeleteCostsById", {
    name: "DeleteCostsById",
    description: `Soft delete a costsheet by setting its status to deleted`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Costsheet ID"}},"required":["id"]},
    method: "delete",
    pathTemplate: "/costs/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetCoupons", {
    name: "GetCoupons",
    description: `Lists coupons with filtering`,
    inputSchema: {"type":"object","properties":{"coupon_ids":{"type":"array","items":{"type":"string"}},"expand":{"type":"string"},"limit":{"maximum":1000,"minimum":1,"type":"number"},"offset":{"minimum":0,"type":"number"},"order":{"type":"string","enum":["asc","desc"]},"status":{"type":"string","enum":["published","deleted","archived"],"x-enum-varnames":["StatusPublished","StatusDeleted","StatusArchived"]}}},
    method: "get",
    pathTemplate: "/coupons",
    executionParameters: [{"name":"coupon_ids","in":"query"},{"name":"expand","in":"query"},{"name":"limit","in":"query"},{"name":"offset","in":"query"},{"name":"order","in":"query"},{"name":"status","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]},{"ApiKeyAuth":[]}]
  }],
  ["PostCoupons", {
    name: "PostCoupons",
    description: `Creates a new coupon`,
    inputSchema: {"type":"object","properties":{"requestBody":{"required":["cadence","name","type"],"type":"object","properties":{"amount_off":{"type":"string"},"cadence":{"type":"string","enum":["once","repeated","forever"],"x-enum-varnames":["CouponCadenceOnce","CouponCadenceRepeated","CouponCadenceForever"]},"currency":{"type":"string"},"duration_in_periods":{"type":"number"},"max_redemptions":{"type":"number"},"metadata":{"type":"object","additionalProperties":{"type":"string"}},"name":{"type":"string"},"percentage_off":{"type":"string"},"redeem_after":{"type":"string"},"redeem_before":{"type":"string"},"rules":{"type":"object","additionalProperties":true},"type":{"type":"string","enum":["fixed","percentage"],"x-enum-varnames":["CouponTypeFixed","CouponTypePercentage"]}},"description":"Coupon request"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/coupons",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]},{"ApiKeyAuth":[]}]
  }],
  ["GetCouponsById", {
    name: "GetCouponsById",
    description: `Retrieves a coupon by ID`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Coupon ID"}},"required":["id"]},
    method: "get",
    pathTemplate: "/coupons/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]},{"ApiKeyAuth":[]}]
  }],
  ["PutCouponsById", {
    name: "PutCouponsById",
    description: `Updates an existing coupon`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Coupon ID"},"requestBody":{"type":"object","properties":{"metadata":{"type":"object","additionalProperties":{"type":"string"}},"name":{"type":"string"}},"description":"Coupon update request"}},"required":["id","requestBody"]},
    method: "put",
    pathTemplate: "/coupons/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]},{"ApiKeyAuth":[]}]
  }],
  ["DeleteCouponsById", {
    name: "DeleteCouponsById",
    description: `Deletes a coupon`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Coupon ID"}},"required":["id"]},
    method: "delete",
    pathTemplate: "/coupons/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]},{"ApiKeyAuth":[]}]
  }],
  ["GetCreditgrants", {
    name: "GetCreditgrants",
    description: `Get credit grants with the specified filter`,
    inputSchema: {"type":"object","properties":{"end_time":{"type":"string"},"expand":{"type":"string"},"limit":{"maximum":1000,"minimum":1,"type":"number"},"offset":{"minimum":0,"type":"number"},"order":{"type":"string","enum":["asc","desc"]},"plan_ids":{"type":"array","items":{"type":"string"},"description":"Specific filters for credit grants"},"scope":{"type":"string","enum":["PLAN","SUBSCRIPTION"],"x-enum-varnames":["CreditGrantScopePlan","CreditGrantScopeSubscription"]},"sort":{"type":"string"},"start_time":{"type":"string"},"status":{"type":"string","enum":["published","deleted","archived"],"x-enum-varnames":["StatusPublished","StatusDeleted","StatusArchived"]},"subscription_ids":{"type":"array","items":{"type":"string"}}}},
    method: "get",
    pathTemplate: "/creditgrants",
    executionParameters: [{"name":"end_time","in":"query"},{"name":"expand","in":"query"},{"name":"limit","in":"query"},{"name":"offset","in":"query"},{"name":"order","in":"query"},{"name":"plan_ids","in":"query"},{"name":"scope","in":"query"},{"name":"sort","in":"query"},{"name":"start_time","in":"query"},{"name":"status","in":"query"},{"name":"subscription_ids","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostCreditgrants", {
    name: "PostCreditgrants",
    description: `Create a new credit grant with the specified configuration`,
    inputSchema: {"type":"object","properties":{"requestBody":{"required":["cadence","credits","name","scope"],"type":"object","properties":{"cadence":{"type":"string","enum":["ONETIME","RECURRING"],"x-enum-varnames":["CreditGrantCadenceOneTime","CreditGrantCadenceRecurring"]},"conversion_rate":{"type":"string","description":"amount in the currency =  number of credits * conversion_rate\nex if conversion_rate is 1, then 1 USD = 1 credit\nex if conversion_rate is 2, then 1 USD = 0.5 credits\nex if conversion_rate is 0.5, then 1 USD = 2 credits"},"credits":{"type":"string"},"expiration_duration":{"type":"number"},"expiration_duration_unit":{"type":"string","enum":["DAY","WEEK","MONTH","YEAR"],"x-enum-varnames":["CreditGrantExpiryDurationUnitDays","CreditGrantExpiryDurationUnitWeeks","CreditGrantExpiryDurationUnitMonths","CreditGrantExpiryDurationUnitYears"]},"expiration_type":{"type":"string","enum":["NEVER","DURATION","BILLING_CYCLE"],"x-enum-varnames":["CreditGrantExpiryTypeNever","CreditGrantExpiryTypeDuration","CreditGrantExpiryTypeBillingCycle"]},"metadata":{"type":"object","additionalProperties":{"type":"string"}},"name":{"type":"string"},"period":{"type":"string","enum":["DAILY","WEEKLY","MONTHLY","ANNUAL","QUARTERLY","HALF_YEARLY"],"x-enum-varnames":["CREDIT_GRANT_PERIOD_DAILY","CREDIT_GRANT_PERIOD_WEEKLY","CREDIT_GRANT_PERIOD_MONTHLY","CREDIT_GRANT_PERIOD_ANNUAL","CREDIT_GRANT_PERIOD_QUARTER","CREDIT_GRANT_PERIOD_HALF_YEARLY"]},"period_count":{"type":"number"},"plan_id":{"type":"string"},"priority":{"type":"number"},"scope":{"type":"string","enum":["PLAN","SUBSCRIPTION"],"x-enum-varnames":["CreditGrantScopePlan","CreditGrantScopeSubscription"]},"subscription_id":{"type":"string"},"topup_conversion_rate":{"type":"string","description":"topup_conversion_rate is the conversion rate for the topup to the currency\nex if topup_conversion_rate is 1, then 1 USD = 1 credit\nex if topup_conversion_rate is 2, then 1 USD = 0.5 credits\nex if topup_conversion_rate is 0.5, then 1 USD = 2 credits"}},"description":"Credit Grant configuration"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/creditgrants",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetCreditgrantsById", {
    name: "GetCreditgrantsById",
    description: `Get a credit grant by ID`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Credit Grant ID"}},"required":["id"]},
    method: "get",
    pathTemplate: "/creditgrants/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PutCreditgrantsById", {
    name: "PutCreditgrantsById",
    description: `Update a credit grant with the specified configuration`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Credit Grant ID"},"requestBody":{"type":"object","properties":{"metadata":{"type":"object","additionalProperties":{"type":"string"}},"name":{"type":"string"}},"description":"Credit Grant configuration"}},"required":["id","requestBody"]},
    method: "put",
    pathTemplate: "/creditgrants/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["DeleteCreditgrantsById", {
    name: "DeleteCreditgrantsById",
    description: `Delete a credit grant`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Credit Grant ID"}},"required":["id"]},
    method: "delete",
    pathTemplate: "/creditgrants/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetCreditnotes", {
    name: "GetCreditnotes",
    description: `Lists credit notes with filtering`,
    inputSchema: {"type":"object","properties":{"credit_note_ids":{"type":"array","items":{"type":"string"}},"credit_note_status":{"type":"array","items":{"type":"string","enum":["DRAFT","FINALIZED","VOIDED"]}},"credit_note_type":{"type":"string","enum":["ADJUSTMENT","REFUND"],"x-enum-varnames":["CreditNoteTypeAdjustment","CreditNoteTypeRefund"]},"end_time":{"type":"string"},"expand":{"type":"string"},"invoice_id":{"type":"string"},"limit":{"maximum":1000,"minimum":1,"type":"number"},"offset":{"minimum":0,"type":"number"},"order":{"type":"string","enum":["asc","desc"]},"sort":{"type":"string"},"start_time":{"type":"string"},"status":{"type":"string","enum":["published","deleted","archived"],"x-enum-varnames":["StatusPublished","StatusDeleted","StatusArchived"]}}},
    method: "get",
    pathTemplate: "/creditnotes",
    executionParameters: [{"name":"credit_note_ids","in":"query"},{"name":"credit_note_status","in":"query"},{"name":"credit_note_type","in":"query"},{"name":"end_time","in":"query"},{"name":"expand","in":"query"},{"name":"invoice_id","in":"query"},{"name":"limit","in":"query"},{"name":"offset","in":"query"},{"name":"order","in":"query"},{"name":"sort","in":"query"},{"name":"start_time","in":"query"},{"name":"status","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]},{"ApiKeyAuth":[]}]
  }],
  ["PostCreditnotes", {
    name: "PostCreditnotes",
    description: `Creates a new credit note`,
    inputSchema: {"type":"object","properties":{"requestBody":{"required":["invoice_id","reason"],"type":"object","properties":{"credit_note_number":{"type":"string","description":"credit_note_number is an optional human-readable identifier for the credit note"},"idempotency_key":{"type":"string","description":"idempotency_key is an optional key used to prevent duplicate credit note creation"},"invoice_id":{"type":"string","description":"invoice_id is the unique identifier of the invoice this credit note is applied to"},"line_items":{"type":"array","description":"line_items contains the individual line items that make up this credit note (minimum 1 required)","items":{"required":["amount","invoice_line_item_id"],"type":"object","properties":{"amount":{"type":"string","description":"amount is the monetary amount to be credited for this line item"},"display_name":{"type":"string","description":"display_name is an optional human-readable name for this credit note line item"},"invoice_line_item_id":{"type":"string","description":"invoice_line_item_id is the unique identifier of the invoice line item being credited"},"metadata":{"type":"object","additionalProperties":{"type":"string"}}}}},"memo":{"type":"string","description":"memo is an optional free-text field for additional notes about the credit note"},"metadata":{"type":"object","additionalProperties":{"type":"string"}},"process_credit_note":{"type":"boolean","description":"process_credit_note is a flag to process the credit note after creation","default":true},"reason":{"type":"string","enum":["DUPLICATE","FRAUDULENT","ORDER_CHANGE","UNSATISFACTORY","SERVICE_ISSUE","BILLING_ERROR","SUBSCRIPTION_CANCELLATION"],"x-enum-varnames":["CreditNoteReasonDuplicate","CreditNoteReasonFraudulent","CreditNoteReasonOrderChange","CreditNoteReasonUnsatisfactory","CreditNoteReasonService","CreditNoteReasonBillingError","CreditNoteReasonSubscriptionCancellation"]}},"description":"Credit note request"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/creditnotes",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]},{"ApiKeyAuth":[]}]
  }],
  ["GetCreditnotesById", {
    name: "GetCreditnotesById",
    description: `Retrieves a credit note by ID`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Credit note ID"}},"required":["id"]},
    method: "get",
    pathTemplate: "/creditnotes/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]},{"ApiKeyAuth":[]}]
  }],
  ["PostCreditnotesFinalize", {
    name: "PostCreditnotesFinalize",
    description: `Processes a draft credit note`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Credit note ID"}},"required":["id"]},
    method: "post",
    pathTemplate: "/creditnotes/{id}/finalize",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]},{"ApiKeyAuth":[]}]
  }],
  ["PostCreditnotesVoid", {
    name: "PostCreditnotesVoid",
    description: `Voids a credit note`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Credit note ID"}},"required":["id"]},
    method: "post",
    pathTemplate: "/creditnotes/{id}/void",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]},{"ApiKeyAuth":[]}]
  }],
  ["GetCustomers", {
    name: "GetCustomers",
    description: `Get customers`,
    inputSchema: {"type":"object","properties":{"customer_ids":{"type":"array","items":{"type":"string"}},"email":{"type":"string"},"end_time":{"type":"string"},"expand":{"type":"string"},"external_id":{"type":"string"},"external_ids":{"type":"array","items":{"type":"string"}},"limit":{"maximum":1000,"minimum":1,"type":"number"},"offset":{"minimum":0,"type":"number"},"order":{"type":"string","enum":["asc","desc"]},"parent_customer_ids":{"type":"array","items":{"type":"string"}},"start_time":{"type":"string"},"status":{"type":"string","enum":["published","deleted","archived"],"x-enum-varnames":["StatusPublished","StatusDeleted","StatusArchived"]}}},
    method: "get",
    pathTemplate: "/customers",
    executionParameters: [{"name":"customer_ids","in":"query"},{"name":"email","in":"query"},{"name":"end_time","in":"query"},{"name":"expand","in":"query"},{"name":"external_id","in":"query"},{"name":"external_ids","in":"query"},{"name":"limit","in":"query"},{"name":"offset","in":"query"},{"name":"order","in":"query"},{"name":"parent_customer_ids","in":"query"},{"name":"start_time","in":"query"},{"name":"status","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PutCustomers", {
    name: "PutCustomers",
    description: `Update a customer by id or external_customer_id`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Customer ID"},"external_customer_id":{"type":"string","description":"Customer External ID"},"requestBody":{"type":"object","properties":{"address_city":{"maxLength":100,"type":"string","description":"address_city is the updated city name with maximum 100 characters"},"address_country":{"type":"string","description":"address_country is the updated two-letter ISO 3166-1 alpha-2 country code"},"address_line1":{"maxLength":255,"type":"string","description":"address_line1 is the updated primary address line with maximum 255 characters"},"address_line2":{"maxLength":255,"type":"string","description":"address_line2 is the updated secondary address line with maximum 255 characters"},"address_postal_code":{"maxLength":20,"type":"string","description":"address_postal_code is the updated postal code with maximum 20 characters"},"address_state":{"maxLength":100,"type":"string","description":"address_state is the updated state, province, or region name with maximum 100 characters"},"email":{"type":"string","description":"email is the updated email address and must be a valid email format if provided"},"external_id":{"type":"string","description":"external_id is the updated external identifier for the customer"},"integration_entity_mapping":{"type":"array","description":"integration_entity_mapping contains provider integration mappings for this customer","items":{"required":["id","provider"],"type":"object","properties":{"id":{"type":"string","description":"id is the external entity ID from the provider"},"provider":{"type":"string","description":"provider is the integration provider name (e.g., \"stripe\", \"razorpay\")","enum":["stripe","razorpay","paypal"]}},"description":"Integration entity mapping for external provider systems"}},"metadata":{"type":"object","additionalProperties":{"type":"string"},"description":"metadata contains updated key-value pairs that will replace existing metadata"},"name":{"type":"string","description":"name is the updated name or company name for the customer"},"parent_customer_external_id":{"type":"string","description":"parent_customer_external_id is the external ID of the parent customer from your system\nExactly one of parent_customer_id or parent_customer_external_id may be provided\nIf you provide the external ID, the parent customer value will be ignored"},"parent_customer_id":{"type":"string","description":"parent_customer_id is the internal FlexPrice ID of the parent customer"}},"description":"Customer"}},"required":["requestBody"]},
    method: "put",
    pathTemplate: "/customers",
    executionParameters: [{"name":"id","in":"query"},{"name":"external_customer_id","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostCustomers", {
    name: "PostCustomers",
    description: `Create a customer`,
    inputSchema: {"type":"object","properties":{"requestBody":{"required":["external_id"],"type":"object","properties":{"address_city":{"maxLength":100,"type":"string","description":"address_city is the city name with maximum 100 characters"},"address_country":{"type":"string","description":"address_country is the two-letter ISO 3166-1 alpha-2 country code"},"address_line1":{"maxLength":255,"type":"string","description":"address_line1 is the primary address line with maximum 255 characters"},"address_line2":{"maxLength":255,"type":"string","description":"address_line2 is the secondary address line with maximum 255 characters"},"address_postal_code":{"maxLength":20,"type":"string","description":"address_postal_code is the ZIP code or postal code with maximum 20 characters"},"address_state":{"maxLength":100,"type":"string","description":"address_state is the state, province, or region name with maximum 100 characters"},"email":{"type":"string","description":"email is the customer's email address and must be a valid email format if provided"},"external_id":{"type":"string","description":"external_id is the unique identifier from your system to reference this customer (required)"},"integration_entity_mapping":{"type":"array","description":"integration_entity_mapping contains provider integration mappings for this customer","items":{"required":["id","provider"],"type":"object","properties":{"id":{"type":"string","description":"id is the external entity ID from the provider"},"provider":{"type":"string","description":"provider is the integration provider name (e.g., \"stripe\", \"razorpay\")","enum":["stripe","razorpay","paypal"]}},"description":"Integration entity mapping for external provider systems"}},"metadata":{"type":"object","additionalProperties":{"type":"string"},"description":"metadata contains additional key-value pairs for storing extra information"},"name":{"type":"string","description":"name is the full name or company name of the customer"},"parent_customer_external_id":{"type":"string","description":"parent_customer_external_id is the external ID of the parent customer from your system\nExactly one of parent_customer_id or parent_customer_external_id may be provided"},"parent_customer_id":{"type":"string","description":"parent_customer_id is the internal FlexPrice ID of the parent customer"},"skip_onboarding_workflow":{"type":"boolean","description":"skip_onboarding_workflow when true, prevents the customer onboarding workflow from being triggered\nThis is used internally when a customer is created via a workflow to prevent infinite loops\nDefault: false"},"tax_rate_overrides":{"type":"array","description":"tax_rate_overrides contains tax rate configurations to be linked to this customer","items":{"required":["currency","tax_rate_code"],"type":"object","properties":{"auto_apply":{"type":"boolean","default":true},"currency":{"type":"string"},"metadata":{"type":"object","additionalProperties":{"type":"string"}},"priority":{"type":"number"},"tax_rate_code":{"type":"string"}}}}},"description":"Customer"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/customers",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetCustomersExternalByExternalId", {
    name: "GetCustomersExternalByExternalId",
    description: `Get a customer by external id`,
    inputSchema: {"type":"object","properties":{"external_id":{"type":"string","description":"Customer External ID"}},"required":["external_id"]},
    method: "get",
    pathTemplate: "/customers/external/{external_id}",
    executionParameters: [{"name":"external_id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostCustomersSearch", {
    name: "PostCustomersSearch",
    description: `List customers by filter`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"object","properties":{"customer_ids":{"type":"array","items":{"type":"string"}},"email":{"type":"string"},"end_time":{"type":"string"},"expand":{"type":"string"},"external_id":{"type":"string"},"external_ids":{"type":"array","items":{"type":"string"}},"filters":{"type":"array","items":{"type":"object","properties":{"data_type":{"type":"string","enum":["string","number","date","array"],"x-enum-varnames":["DataTypeString","DataTypeNumber","DataTypeDate","DataTypeArray"]},"field":{"type":"string"},"operator":{"type":"string","enum":["eq","contains","not_contains","gt","lt","in","not_in","before","after"],"x-enum-varnames":["EQUAL","CONTAINS","NOT_CONTAINS","GREATER_THAN","LESS_THAN","IN","NOT_IN","BEFORE","AFTER"]},"value":{"type":"object","properties":{"array":{"type":"array","items":{"type":"string"}},"boolean":{"type":"boolean"},"date":{"type":"string"},"number":{"type":"number"},"string":{"type":"string"}}}}}},"limit":{"maximum":1000,"minimum":1,"type":"number"},"offset":{"minimum":0,"type":"number"},"order":{"type":"string","enum":["asc","desc"]},"parent_customer_ids":{"type":"array","items":{"type":"string"}},"sort":{"type":"array","items":{"type":"object","properties":{"direction":{"type":"string","enum":["asc","desc"],"x-enum-varnames":["SortDirectionAsc","SortDirectionDesc"]},"field":{"type":"string"}}}},"start_time":{"type":"string"},"status":{"type":"string","enum":["published","deleted","archived"],"x-enum-varnames":["StatusPublished","StatusDeleted","StatusArchived"]}},"description":"Filter"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/customers/search",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetCustomersUsage", {
    name: "GetCustomersUsage",
    description: `Get customer usage summary by customer_id or customer_lookup_key (external_customer_id)`,
    inputSchema: {"type":"object","properties":{"customer_id":{"type":"string"},"customer_lookup_key":{"type":"string"},"feature_ids":{"type":"array","items":{"type":"string"}},"feature_lookup_keys":{"type":"array","items":{"type":"string"}},"subscription_ids":{"type":"array","items":{"type":"string"}}}},
    method: "get",
    pathTemplate: "/customers/usage",
    executionParameters: [{"name":"customer_id","in":"query"},{"name":"customer_lookup_key","in":"query"},{"name":"feature_ids","in":"query"},{"name":"feature_lookup_keys","in":"query"},{"name":"subscription_ids","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetCustomersWallets", {
    name: "GetCustomersWallets",
    description: `Get all wallets for a customer by lookup key or id`,
    inputSchema: {"type":"object","properties":{"expand":{"type":"string"},"id":{"type":"string"},"include_real_time_balance":{"type":"boolean","default":false},"lookup_key":{"type":"string"}}},
    method: "get",
    pathTemplate: "/customers/wallets",
    executionParameters: [{"name":"expand","in":"query"},{"name":"id","in":"query"},{"name":"include_real_time_balance","in":"query"},{"name":"lookup_key","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetCustomersById", {
    name: "GetCustomersById",
    description: `Get a customer`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Customer ID"}},"required":["id"]},
    method: "get",
    pathTemplate: "/customers/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["DeleteCustomersById", {
    name: "DeleteCustomersById",
    description: `Delete a customer`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Customer ID"}},"required":["id"]},
    method: "delete",
    pathTemplate: "/customers/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetCustomersEntitlements", {
    name: "GetCustomersEntitlements",
    description: `Get customer entitlements`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Customer ID"},"feature_ids":{"type":"array","items":{"type":"string"}},"subscription_ids":{"type":"array","items":{"type":"string"}}},"required":["id"]},
    method: "get",
    pathTemplate: "/customers/{id}/entitlements",
    executionParameters: [{"name":"id","in":"path"},{"name":"feature_ids","in":"query"},{"name":"subscription_ids","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetCustomersGrantsUpcoming", {
    name: "GetCustomersGrantsUpcoming",
    description: `Get upcoming credit grant applications for a customer`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Customer ID"}},"required":["id"]},
    method: "get",
    pathTemplate: "/customers/{id}/grants/upcoming",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetCustomersInvoicesSummary", {
    name: "GetCustomersInvoicesSummary",
    description: `Get a customer invoice summary`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Customer ID"}},"required":["id"]},
    method: "get",
    pathTemplate: "/customers/{id}/invoices/summary",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetCustomersWallets_1", {
    name: "GetCustomersWallets_1",
    description: `Get all wallets for a customer`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Customer ID"}},"required":["id"]},
    method: "get",
    pathTemplate: "/customers/{id}/wallets",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetEntitlements", {
    name: "GetEntitlements",
    description: `Get entitlements with the specified filter`,
    inputSchema: {"type":"object","properties":{"end_time":{"type":"string"},"entity_ids":{"type":"array","items":{"type":"string"}},"entity_type":{"type":"string","enum":["PLAN","SUBSCRIPTION","ADDON"],"x-enum-varnames":["ENTITLEMENT_ENTITY_TYPE_PLAN","ENTITLEMENT_ENTITY_TYPE_SUBSCRIPTION","ENTITLEMENT_ENTITY_TYPE_ADDON"]},"expand":{"type":"string"},"feature_ids":{"type":"array","items":{"type":"string"}},"feature_type":{"type":"string","enum":["metered","boolean","static"],"x-enum-varnames":["FeatureTypeMetered","FeatureTypeBoolean","FeatureTypeStatic"]},"is_enabled":{"type":"boolean"},"limit":{"maximum":1000,"minimum":1,"type":"number"},"offset":{"minimum":0,"type":"number"},"order":{"type":"string","enum":["asc","desc"]},"plan_ids":{"type":"array","items":{"type":"string"}},"start_time":{"type":"string"},"status":{"type":"string","enum":["published","deleted","archived"],"x-enum-varnames":["StatusPublished","StatusDeleted","StatusArchived"]}}},
    method: "get",
    pathTemplate: "/entitlements",
    executionParameters: [{"name":"end_time","in":"query"},{"name":"entity_ids","in":"query"},{"name":"entity_type","in":"query"},{"name":"expand","in":"query"},{"name":"feature_ids","in":"query"},{"name":"feature_type","in":"query"},{"name":"is_enabled","in":"query"},{"name":"limit","in":"query"},{"name":"offset","in":"query"},{"name":"order","in":"query"},{"name":"plan_ids","in":"query"},{"name":"start_time","in":"query"},{"name":"status","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostEntitlements", {
    name: "PostEntitlements",
    description: `Create a new entitlement with the specified configuration`,
    inputSchema: {"type":"object","properties":{"requestBody":{"required":["feature_id","feature_type"],"type":"object","properties":{"end_date":{"type":"string"},"entity_id":{"type":"string"},"entity_type":{"type":"string","enum":["PLAN","SUBSCRIPTION","ADDON"],"x-enum-varnames":["ENTITLEMENT_ENTITY_TYPE_PLAN","ENTITLEMENT_ENTITY_TYPE_SUBSCRIPTION","ENTITLEMENT_ENTITY_TYPE_ADDON"]},"feature_id":{"type":"string"},"feature_type":{"type":"string","enum":["metered","boolean","static"],"x-enum-varnames":["FeatureTypeMetered","FeatureTypeBoolean","FeatureTypeStatic"]},"is_enabled":{"type":"boolean"},"is_soft_limit":{"type":"boolean"},"parent_entitlement_id":{"type":"string"},"plan_id":{"type":"string"},"start_date":{"type":"string"},"static_value":{"type":"string"},"usage_limit":{"type":"number"},"usage_reset_period":{"type":"string","enum":["MONTHLY","ANNUAL","WEEKLY","DAILY","QUARTERLY","HALF_YEARLY","NEVER"],"x-enum-varnames":["ENTITLEMENT_USAGE_RESET_PERIOD_MONTHLY","ENTITLEMENT_USAGE_RESET_PERIOD_ANNUAL","ENTITLEMENT_USAGE_RESET_PERIOD_WEEKLY","ENTITLEMENT_USAGE_RESET_PERIOD_DAILY","ENTITLEMENT_USAGE_RESET_PERIOD_QUARTER","ENTITLEMENT_USAGE_RESET_PERIOD_HALF_YEAR","ENTITLEMENT_USAGE_RESET_PERIOD_NEVER"]}},"description":"Entitlement configuration"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/entitlements",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostEntitlementsBulk", {
    name: "PostEntitlementsBulk",
    description: `Create multiple entitlements with the specified configurations`,
    inputSchema: {"type":"object","properties":{"requestBody":{"required":["items"],"type":"object","properties":{"items":{"maxItems":100,"minItems":1,"type":"array","items":{"required":["feature_id","feature_type"],"type":"object","properties":{"end_date":{"type":"string"},"entity_id":{"type":"string"},"entity_type":{"type":"string","enum":["PLAN","SUBSCRIPTION","ADDON"],"x-enum-varnames":["ENTITLEMENT_ENTITY_TYPE_PLAN","ENTITLEMENT_ENTITY_TYPE_SUBSCRIPTION","ENTITLEMENT_ENTITY_TYPE_ADDON"]},"feature_id":{"type":"string"},"feature_type":{"type":"string","enum":["metered","boolean","static"],"x-enum-varnames":["FeatureTypeMetered","FeatureTypeBoolean","FeatureTypeStatic"]},"is_enabled":{"type":"boolean"},"is_soft_limit":{"type":"boolean"},"parent_entitlement_id":{"type":"string"},"plan_id":{"type":"string"},"start_date":{"type":"string"},"static_value":{"type":"string"},"usage_limit":{"type":"number"},"usage_reset_period":{"type":"string","enum":["MONTHLY","ANNUAL","WEEKLY","DAILY","QUARTERLY","HALF_YEARLY","NEVER"],"x-enum-varnames":["ENTITLEMENT_USAGE_RESET_PERIOD_MONTHLY","ENTITLEMENT_USAGE_RESET_PERIOD_ANNUAL","ENTITLEMENT_USAGE_RESET_PERIOD_WEEKLY","ENTITLEMENT_USAGE_RESET_PERIOD_DAILY","ENTITLEMENT_USAGE_RESET_PERIOD_QUARTER","ENTITLEMENT_USAGE_RESET_PERIOD_HALF_YEAR","ENTITLEMENT_USAGE_RESET_PERIOD_NEVER"]}}}}},"description":"Bulk entitlement configuration"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/entitlements/bulk",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostEntitlementsSearch", {
    name: "PostEntitlementsSearch",
    description: `List entitlements by filter`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"object","properties":{"end_time":{"type":"string"},"entity_ids":{"type":"array","items":{"type":"string"}},"entity_type":{"type":"string","enum":["PLAN","SUBSCRIPTION","ADDON"],"x-enum-varnames":["ENTITLEMENT_ENTITY_TYPE_PLAN","ENTITLEMENT_ENTITY_TYPE_SUBSCRIPTION","ENTITLEMENT_ENTITY_TYPE_ADDON"]},"expand":{"type":"string"},"feature_ids":{"type":"array","items":{"type":"string"}},"feature_type":{"type":"string","enum":["metered","boolean","static"],"x-enum-varnames":["FeatureTypeMetered","FeatureTypeBoolean","FeatureTypeStatic"]},"filters":{"type":"array","description":"Specific filters for entitlements","items":{"type":"object","properties":{"data_type":{"type":"string","enum":["string","number","date","array"],"x-enum-varnames":["DataTypeString","DataTypeNumber","DataTypeDate","DataTypeArray"]},"field":{"type":"string"},"operator":{"type":"string","enum":["eq","contains","not_contains","gt","lt","in","not_in","before","after"],"x-enum-varnames":["EQUAL","CONTAINS","NOT_CONTAINS","GREATER_THAN","LESS_THAN","IN","NOT_IN","BEFORE","AFTER"]},"value":{"type":"object","properties":{"array":{"type":"array","items":{"type":"string"}},"boolean":{"type":"boolean"},"date":{"type":"string"},"number":{"type":"number"},"string":{"type":"string"}}}}}},"is_enabled":{"type":"boolean"},"limit":{"maximum":1000,"minimum":1,"type":"number"},"offset":{"minimum":0,"type":"number"},"order":{"type":"string","enum":["asc","desc"]},"plan_ids":{"type":"array","items":{"type":"string"}},"sort":{"type":"array","items":{"type":"object","properties":{"direction":{"type":"string","enum":["asc","desc"],"x-enum-varnames":["SortDirectionAsc","SortDirectionDesc"]},"field":{"type":"string"}}}},"start_time":{"type":"string"},"status":{"type":"string","enum":["published","deleted","archived"],"x-enum-varnames":["StatusPublished","StatusDeleted","StatusArchived"]}},"description":"Filter"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/entitlements/search",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetEntitlementsById", {
    name: "GetEntitlementsById",
    description: `Get an entitlement by ID`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Entitlement ID"}},"required":["id"]},
    method: "get",
    pathTemplate: "/entitlements/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PutEntitlementsById", {
    name: "PutEntitlementsById",
    description: `Update an entitlement with the specified configuration`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Entitlement ID"},"requestBody":{"type":"object","properties":{"is_enabled":{"type":"boolean"},"is_soft_limit":{"type":"boolean"},"static_value":{"type":"string"},"usage_limit":{"type":"number"},"usage_reset_period":{"type":"string","enum":["MONTHLY","ANNUAL","WEEKLY","DAILY","QUARTERLY","HALF_YEARLY","NEVER"],"x-enum-varnames":["ENTITLEMENT_USAGE_RESET_PERIOD_MONTHLY","ENTITLEMENT_USAGE_RESET_PERIOD_ANNUAL","ENTITLEMENT_USAGE_RESET_PERIOD_WEEKLY","ENTITLEMENT_USAGE_RESET_PERIOD_DAILY","ENTITLEMENT_USAGE_RESET_PERIOD_QUARTER","ENTITLEMENT_USAGE_RESET_PERIOD_HALF_YEAR","ENTITLEMENT_USAGE_RESET_PERIOD_NEVER"]}},"description":"Entitlement configuration"}},"required":["id","requestBody"]},
    method: "put",
    pathTemplate: "/entitlements/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["DeleteEntitlementsById", {
    name: "DeleteEntitlementsById",
    description: `Delete an entitlement`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Entitlement ID"}},"required":["id"]},
    method: "delete",
    pathTemplate: "/entitlements/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetEntityIntegrationMappings", {
    name: "GetEntityIntegrationMappings",
    description: `Retrieve a list of entity integration mappings with optional filtering`,
    inputSchema: {"type":"object","properties":{"entity_id":{"type":"string","description":"Filter by FlexPrice entity ID"},"entity_type":{"type":"string","description":"Filter by entity type"},"provider_type":{"type":"string","description":"Filter by provider type"},"provider_entity_id":{"type":"string","description":"Filter by provider entity ID"},"limit":{"type":"number","description":"Number of results to return (default: 20, max: 100)"},"offset":{"type":"number","description":"Pagination offset (default: 0)"}}},
    method: "get",
    pathTemplate: "/entity-integration-mappings",
    executionParameters: [{"name":"entity_id","in":"query"},{"name":"entity_type","in":"query"},{"name":"provider_type","in":"query"},{"name":"provider_entity_id","in":"query"},{"name":"limit","in":"query"},{"name":"offset","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostEntityIntegrationMappings", {
    name: "PostEntityIntegrationMappings",
    description: `Create a new entity integration mapping`,
    inputSchema: {"type":"object","properties":{"requestBody":{"required":["entity_id","entity_type","provider_entity_id","provider_type"],"type":"object","properties":{"entity_id":{"maxLength":255,"type":"string"},"entity_type":{"type":"string","enum":["customer","plan","invoice","subscription","payment","credit_note","addon","item","item_price","price"],"x-enum-varnames":["IntegrationEntityTypeCustomer","IntegrationEntityTypePlan","IntegrationEntityTypeInvoice","IntegrationEntityTypeSubscription","IntegrationEntityTypePayment","IntegrationEntityTypeCreditNote","IntegrationEntityTypeAddon","IntegrationEntityTypeItem","IntegrationEntityTypeItemPrice","IntegrationEntityTypePrice"]},"metadata":{"type":"object","additionalProperties":true},"provider_entity_id":{"maxLength":255,"type":"string"},"provider_type":{"maxLength":50,"type":"string"}},"description":"Entity integration mapping data"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/entity-integration-mappings",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetEntityIntegrationMappingsById", {
    name: "GetEntityIntegrationMappingsById",
    description: `Retrieve a specific entity integration mapping by ID`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Entity integration mapping ID"}},"required":["id"]},
    method: "get",
    pathTemplate: "/entity-integration-mappings/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["DeleteEntityIntegrationMappingsById", {
    name: "DeleteEntityIntegrationMappingsById",
    description: `Delete an entity integration mapping`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Entity integration mapping ID"}},"required":["id"]},
    method: "delete",
    pathTemplate: "/entity-integration-mappings/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetEnvironments", {
    name: "GetEnvironments",
    description: `Get environments`,
    inputSchema: {"type":"object","properties":{"expand":{"type":"string"},"limit":{"type":"number"},"offset":{"type":"number"},"order":{"type":"string"},"sort":{"type":"string"},"status":{"type":"string","enum":["published","deleted","archived"],"x-enum-varnames":["StatusPublished","StatusDeleted","StatusArchived"]}}},
    method: "get",
    pathTemplate: "/environments",
    executionParameters: [{"name":"expand","in":"query"},{"name":"limit","in":"query"},{"name":"offset","in":"query"},{"name":"order","in":"query"},{"name":"sort","in":"query"},{"name":"status","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostEnvironments", {
    name: "PostEnvironments",
    description: `Create an environment`,
    inputSchema: {"type":"object","properties":{"requestBody":{"required":["name","type"],"type":"object","properties":{"name":{"type":"string"},"type":{"type":"string"}},"description":"Environment"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/environments",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetEnvironmentsById", {
    name: "GetEnvironmentsById",
    description: `Get an environment`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Environment ID"}},"required":["id"]},
    method: "get",
    pathTemplate: "/environments/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PutEnvironmentsById", {
    name: "PutEnvironmentsById",
    description: `Update an environment`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Environment ID"},"requestBody":{"type":"object","properties":{"name":{"type":"string"},"type":{"type":"string"}},"description":"Environment"}},"required":["id","requestBody"]},
    method: "put",
    pathTemplate: "/environments/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostEvents", {
    name: "PostEvents",
    description: `Ingest a new event into the system`,
    inputSchema: {"type":"object","properties":{"requestBody":{"required":["event_name","external_customer_id"],"type":"object","properties":{"customer_id":{"type":"string"},"event_id":{"type":"string"},"event_name":{"type":"string"},"external_customer_id":{"type":"string"},"properties":{"type":"object","additionalProperties":{"type":"string"},"description":"Handled separately for dynamic columns"},"source":{"type":"string"},"timestamp":{"type":"string","description":"Handled separately due to parsing"}},"description":"Event data"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/events",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostEventsAnalytics", {
    name: "PostEventsAnalytics",
    description: `Retrieve comprehensive usage analytics with filtering, grouping, and time-series data`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"string","description":"Request body"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/events/analytics",
    executionParameters: [],
    requestBodyContentType: "*/*",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostEventsBulk", {
    name: "PostEventsBulk",
    description: `Ingest bulk events into the system`,
    inputSchema: {"type":"object","properties":{"requestBody":{"required":["events"],"type":"object","properties":{"events":{"maxItems":1000,"minItems":1,"type":"array","items":{"required":["event_name","external_customer_id"],"type":"object","properties":{"customer_id":{"type":"string"},"event_id":{"type":"string"},"event_name":{"type":"string"},"external_customer_id":{"type":"string"},"properties":{"type":"object","additionalProperties":{"type":"string"},"description":"Handled separately for dynamic columns"},"source":{"type":"string"},"timestamp":{"type":"string","description":"Handled separately due to parsing"}}}}},"description":"Event data"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/events/bulk",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostEventsHuggingfaceInference", {
    name: "PostEventsHuggingfaceInference",
    description: `Retrieve hugging face inference data for events`,
    inputSchema: {"type":"object","properties":{}},
    method: "post",
    pathTemplate: "/events/huggingface-inference",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetEventsMonitoring", {
    name: "GetEventsMonitoring",
    description: `Retrieve monitoring data for events including consumer lag and event metrics (last 24 hours by default)`,
    inputSchema: {"type":"object","properties":{"window_size":{"type":"string","description":"Window size for time series data (e.g., 'HOUR', 'DAY') - optional"}}},
    method: "get",
    pathTemplate: "/events/monitoring",
    executionParameters: [{"name":"window_size","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostEventsQuery", {
    name: "PostEventsQuery",
    description: `Retrieve raw events with pagination and filtering`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"string","description":"Request body"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/events/query",
    executionParameters: [],
    requestBodyContentType: "*/*",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostEventsUsage", {
    name: "PostEventsUsage",
    description: `Retrieve aggregated usage statistics for events`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"string","description":"Request body"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/events/usage",
    executionParameters: [],
    requestBodyContentType: "*/*",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostEventsUsageMeter", {
    name: "PostEventsUsageMeter",
    description: `Retrieve aggregated usage statistics using meter configuration`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"string","description":"Request body"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/events/usage/meter",
    executionParameters: [],
    requestBodyContentType: "*/*",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetEventsById", {
    name: "GetEventsById",
    description: `Retrieve event details and processing status with debug information`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Event ID"}},"required":["id"]},
    method: "get",
    pathTemplate: "/events/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetFeatures", {
    name: "GetFeatures",
    description: `List features with optional filtering`,
    inputSchema: {"type":"object","properties":{"end_time":{"type":"string"},"expand":{"type":"string"},"feature_ids":{"type":"array","items":{"type":"string"},"description":"Feature specific filters"},"limit":{"maximum":1000,"minimum":1,"type":"number"},"lookup_key":{"type":"string"},"lookup_keys":{"type":"array","items":{"type":"string"}},"meter_ids":{"type":"array","items":{"type":"string"}},"name_contains":{"type":"string"},"offset":{"minimum":0,"type":"number"},"order":{"type":"string","enum":["asc","desc"]},"start_time":{"type":"string"},"status":{"type":"string","enum":["published","deleted","archived"],"x-enum-varnames":["StatusPublished","StatusDeleted","StatusArchived"]}}},
    method: "get",
    pathTemplate: "/features",
    executionParameters: [{"name":"end_time","in":"query"},{"name":"expand","in":"query"},{"name":"feature_ids","in":"query"},{"name":"limit","in":"query"},{"name":"lookup_key","in":"query"},{"name":"lookup_keys","in":"query"},{"name":"meter_ids","in":"query"},{"name":"name_contains","in":"query"},{"name":"offset","in":"query"},{"name":"order","in":"query"},{"name":"start_time","in":"query"},{"name":"status","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostFeatures", {
    name: "PostFeatures",
    description: `Create a new feature`,
    inputSchema: {"type":"object","properties":{"requestBody":{"required":["name","type"],"type":"object","properties":{"alert_settings":{"type":"object","properties":{"alert_enabled":{"type":"boolean"},"critical":{"type":"object","properties":{"condition":{"type":"string","enum":["above","below"],"x-enum-varnames":["AlertConditionAbove","AlertConditionBelow"]},"threshold":{"type":"number"}}},"info":{"type":"object","properties":{"condition":{"type":"string","enum":["above","below"],"x-enum-varnames":["AlertConditionAbove","AlertConditionBelow"]},"threshold":{"type":"number"}}},"warning":{"type":"object","properties":{"condition":{"type":"string","enum":["above","below"],"x-enum-varnames":["AlertConditionAbove","AlertConditionBelow"]},"threshold":{"type":"number"}}}}},"description":{"type":"string"},"lookup_key":{"type":"string"},"metadata":{"type":"object","additionalProperties":{"type":"string"}},"meter":{"required":["aggregation","event_name","name","reset_usage"],"type":"object","properties":{"aggregation":{"type":"object","properties":{"bucket_size":{"type":"string","enum":["MINUTE","15MIN","30MIN","HOUR","3HOUR","6HOUR","12HOUR","DAY","WEEK","MONTH","MONTH"],"x-enum-varnames":["WindowSizeMinute","WindowSize15Min","WindowSize30Min","WindowSizeHour","WindowSize3Hour","WindowSize6Hour","WindowSize12Hour","WindowSizeDay","WindowSizeWeek","WindowSizeMonth","DefaultWindowSize"]},"field":{"type":"string","description":"Field is the key in $event.properties on which the aggregation is to be applied\nFor ex if the aggregation type is sum for API usage, the field could be \"duration_ms\""},"multiplier":{"type":"string","description":"Multiplier is the multiplier for the aggregation\nFor ex if the aggregation type is sum_with_multiplier for API usage, the multiplier could be 1000\nto scale up by a factor of 1000. If not provided, it will be null."},"type":{"type":"string","enum":["COUNT","SUM","AVG","COUNT_UNIQUE","LATEST","SUM_WITH_MULTIPLIER","MAX","WEIGHTED_SUM"],"x-enum-comments":{"AggregationSumWithMultiplier":"Sum with a multiplier - [sum(value) * multiplier]"},"x-enum-descriptions":["","","","","","Sum with a multiplier - [sum(value) * multiplier]","",""],"x-enum-varnames":["AggregationCount","AggregationSum","AggregationAvg","AggregationCountUnique","AggregationLatest","AggregationSumWithMultiplier","AggregationMax","AggregationWeightedSum"]}}},"event_name":{"type":"string"},"filters":{"type":"array","items":{"type":"object","properties":{"key":{"type":"string","description":"Key is the key for the filter from $event.properties\nCurrently we support only first level keys in the properties and not nested keys"},"values":{"type":"array","description":"Values are the possible values for the filter to be considered for the meter\nFor ex \"model_name\" could have values \"o1-mini\", \"gpt-4o\" etc","items":{"type":"string"}}}}},"name":{"type":"string"},"reset_usage":{"type":"string","enum":["BILLING_PERIOD","NEVER"],"x-enum-varnames":["ResetUsageBillingPeriod","ResetUsageNever"]}}},"meter_id":{"type":"string"},"name":{"type":"string"},"type":{"type":"string","enum":["metered","boolean","static"],"x-enum-varnames":["FeatureTypeMetered","FeatureTypeBoolean","FeatureTypeStatic"]},"unit_plural":{"type":"string"},"unit_singular":{"type":"string"}},"description":"Feature to create"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/features",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostFeaturesSearch", {
    name: "PostFeaturesSearch",
    description: `List features by filter`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"object","properties":{"end_time":{"type":"string"},"expand":{"type":"string"},"feature_ids":{"type":"array","description":"Feature specific filters","items":{"type":"string"}},"filters":{"type":"array","description":"filters allows complex filtering based on multiple fields","items":{"type":"object","properties":{"data_type":{"type":"string","enum":["string","number","date","array"],"x-enum-varnames":["DataTypeString","DataTypeNumber","DataTypeDate","DataTypeArray"]},"field":{"type":"string"},"operator":{"type":"string","enum":["eq","contains","not_contains","gt","lt","in","not_in","before","after"],"x-enum-varnames":["EQUAL","CONTAINS","NOT_CONTAINS","GREATER_THAN","LESS_THAN","IN","NOT_IN","BEFORE","AFTER"]},"value":{"type":"object","properties":{"array":{"type":"array","items":{"type":"string"}},"boolean":{"type":"boolean"},"date":{"type":"string"},"number":{"type":"number"},"string":{"type":"string"}}}}}},"limit":{"maximum":1000,"minimum":1,"type":"number"},"lookup_key":{"type":"string"},"lookup_keys":{"type":"array","items":{"type":"string"}},"meter_ids":{"type":"array","items":{"type":"string"}},"name_contains":{"type":"string"},"offset":{"minimum":0,"type":"number"},"order":{"type":"string","enum":["asc","desc"]},"sort":{"type":"array","items":{"type":"object","properties":{"direction":{"type":"string","enum":["asc","desc"],"x-enum-varnames":["SortDirectionAsc","SortDirectionDesc"]},"field":{"type":"string"}}}},"start_time":{"type":"string"},"status":{"type":"string","enum":["published","deleted","archived"],"x-enum-varnames":["StatusPublished","StatusDeleted","StatusArchived"]}},"description":"Filter"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/features/search",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetFeaturesById", {
    name: "GetFeaturesById",
    description: `Get a feature by ID`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Feature ID"}},"required":["id"]},
    method: "get",
    pathTemplate: "/features/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PutFeaturesById", {
    name: "PutFeaturesById",
    description: `Update a feature by ID`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Feature ID"},"requestBody":{"type":"object","properties":{"alert_settings":{"type":"object","properties":{"alert_enabled":{"type":"boolean"},"critical":{"type":"object","properties":{"condition":{"type":"string","enum":["above","below"],"x-enum-varnames":["AlertConditionAbove","AlertConditionBelow"]},"threshold":{"type":"number"}}},"info":{"type":"object","properties":{"condition":{"type":"string","enum":["above","below"],"x-enum-varnames":["AlertConditionAbove","AlertConditionBelow"]},"threshold":{"type":"number"}}},"warning":{"type":"object","properties":{"condition":{"type":"string","enum":["above","below"],"x-enum-varnames":["AlertConditionAbove","AlertConditionBelow"]},"threshold":{"type":"number"}}}}},"description":{"type":"string"},"filters":{"type":"array","items":{"type":"object","properties":{"key":{"type":"string","description":"Key is the key for the filter from $event.properties\nCurrently we support only first level keys in the properties and not nested keys"},"values":{"type":"array","description":"Values are the possible values for the filter to be considered for the meter\nFor ex \"model_name\" could have values \"o1-mini\", \"gpt-4o\" etc","items":{"type":"string"}}}}},"metadata":{"type":"object","additionalProperties":{"type":"string"}},"name":{"type":"string"},"unit_plural":{"type":"string"},"unit_singular":{"type":"string"}},"description":"Feature update data"}},"required":["id","requestBody"]},
    method: "put",
    pathTemplate: "/features/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["DeleteFeaturesById", {
    name: "DeleteFeaturesById",
    description: `Delete a feature by ID`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Feature ID"}},"required":["id"]},
    method: "delete",
    pathTemplate: "/features/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostGroups", {
    name: "PostGroups",
    description: `Create a new group for organizing entities (prices, plans, customers, etc.)`,
    inputSchema: {"type":"object","properties":{"requestBody":{"required":["entity_type","lookup_key","name"],"type":"object","properties":{"entity_type":{"type":"string"},"lookup_key":{"type":"string"},"name":{"type":"string"}},"description":"Group"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/groups",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostGroupsSearch", {
    name: "PostGroupsSearch",
    description: `Get groups with optional filtering via query parameters`,
    inputSchema: {"type":"object","properties":{"entity_type":{"type":"string","description":"Filter by entity type (e.g., 'price')"},"name":{"type":"string","description":"Filter by group name (contains search)"},"lookup_key":{"type":"string","description":"Filter by lookup key (exact match)"},"limit":{"type":"number","description":"Number of items to return (default: 20)"},"offset":{"type":"number","description":"Number of items to skip (default: 0)"},"sort_by":{"type":"string","description":"Field to sort by (name, created_at, updated_at)"},"sort_order":{"type":"string","description":"Sort order (asc, desc)"}}},
    method: "post",
    pathTemplate: "/groups/search",
    executionParameters: [{"name":"entity_type","in":"query"},{"name":"name","in":"query"},{"name":"lookup_key","in":"query"},{"name":"limit","in":"query"},{"name":"offset","in":"query"},{"name":"sort_by","in":"query"},{"name":"sort_order","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetGroupsById", {
    name: "GetGroupsById",
    description: `Get a group by ID`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Group ID"}},"required":["id"]},
    method: "get",
    pathTemplate: "/groups/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["DeleteGroupsById", {
    name: "DeleteGroupsById",
    description: `Delete a group and remove all entity associations`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Group ID"}},"required":["id"]},
    method: "delete",
    pathTemplate: "/groups/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetInvoices", {
    name: "GetInvoices",
    description: `List invoices with optional filtering`,
    inputSchema: {"type":"object","properties":{"amount_due_gt":{"type":"number","description":"amount_due_gt filters invoices with a total amount due greater than the specified value\nUseful for finding invoices above a certain threshold or identifying high-value invoices"},"amount_remaining_gt":{"type":"number","description":"amount_remaining_gt filters invoices with an outstanding balance greater than the specified value\nUseful for finding invoices that still have significant unpaid amounts"},"customer_id":{"type":"string","description":"customer_id filters invoices for a specific customer using FlexPrice's internal customer ID\nThis is the ID returned by FlexPrice when creating or retrieving customers"},"end_time":{"type":"string"},"expand":{"type":"string"},"external_customer_id":{"type":"string","description":"external_customer_id filters invoices for a customer using your system's customer identifier\nThis is the ID you provided when creating the customer in FlexPrice"},"invoice_ids":{"type":"array","items":{"type":"string"},"description":"invoice_ids restricts results to invoices with the specified IDs\nUse this to retrieve specific invoices when you know their exact identifiers"},"invoice_status":{"type":"array","items":{"type":"string","enum":["DRAFT","FINALIZED","VOIDED"]},"description":"invoice_status filters by the current state of invoices in their lifecycle\nMultiple statuses can be specified to include invoices in any of the listed states"},"invoice_type":{"type":"string","enum":["SUBSCRIPTION","ONE_OFF","CREDIT"],"x-enum-varnames":["InvoiceTypeSubscription","InvoiceTypeOneOff","InvoiceTypeCredit"],"description":"invoice_type filters by the nature of the invoice (SUBSCRIPTION, ONE_OFF, or CREDIT)\nUse this to separate recurring charges from one-time fees or credit adjustments"},"limit":{"maximum":1000,"minimum":1,"type":"number"},"offset":{"minimum":0,"type":"number"},"order":{"type":"string","enum":["asc","desc"]},"payment_status":{"type":"array","items":{"type":"string","enum":["INITIATED","PENDING","PROCESSING","SUCCEEDED","OVERPAID","FAILED","REFUNDED","PARTIALLY_REFUNDED"]},"description":"payment_status filters by the payment state of invoices\nMultiple statuses can be specified to include invoices with any of the listed payment states"},"skip_line_items":{"type":"boolean","description":"SkipLineItems if true, will not include line items in the response"},"start_time":{"type":"string"},"status":{"type":"string","enum":["published","deleted","archived"],"x-enum-varnames":["StatusPublished","StatusDeleted","StatusArchived"]},"subscription_id":{"type":"string","description":"subscription_id filters invoices generated for a specific subscription\nOnly returns invoices that were created as part of the specified subscription's billing"}}},
    method: "get",
    pathTemplate: "/invoices",
    executionParameters: [{"name":"amount_due_gt","in":"query"},{"name":"amount_remaining_gt","in":"query"},{"name":"customer_id","in":"query"},{"name":"end_time","in":"query"},{"name":"expand","in":"query"},{"name":"external_customer_id","in":"query"},{"name":"invoice_ids","in":"query"},{"name":"invoice_status","in":"query"},{"name":"invoice_type","in":"query"},{"name":"limit","in":"query"},{"name":"offset","in":"query"},{"name":"order","in":"query"},{"name":"payment_status","in":"query"},{"name":"skip_line_items","in":"query"},{"name":"start_time","in":"query"},{"name":"status","in":"query"},{"name":"subscription_id","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostInvoices", {
    name: "PostInvoices",
    description: `Create a new one off invoice with the provided details`,
    inputSchema: {"type":"object","properties":{"requestBody":{"required":["amount_due","currency","customer_id","subtotal","total"],"type":"object","properties":{"amount_due":{"type":"string","description":"amount_due is the total amount that needs to be paid for this invoice"},"amount_paid":{"type":"string","description":"amount_paid is the amount that has been paid towards this invoice"},"billing_period":{"type":"string","description":"billing_period is the period this invoice covers (e.g., \"monthly\", \"yearly\")"},"billing_reason":{"type":"string","enum":["SUBSCRIPTION_CREATE","SUBSCRIPTION_CYCLE","SUBSCRIPTION_UPDATE","PRORATION","MANUAL"],"x-enum-varnames":["InvoiceBillingReasonSubscriptionCreate","InvoiceBillingReasonSubscriptionCycle","InvoiceBillingReasonSubscriptionUpdate","InvoiceBillingReasonProration","InvoiceBillingReasonManual"]},"coupons":{"type":"array","description":"coupons","items":{"type":"string"}},"currency":{"type":"string","description":"currency is the three-letter ISO currency code (e.g., USD, EUR) for the invoice"},"customer_id":{"type":"string","description":"customer_id is the unique identifier of the customer this invoice belongs to"},"description":{"type":"string","description":"description is an optional text description of the invoice"},"due_date":{"type":"string","description":"due_date is the date by which payment is expected"},"environment_id":{"type":"string","description":"environment_id is the unique identifier of the environment this invoice belongs to"},"idempotency_key":{"type":"string","description":"idempotency_key is an optional key used to prevent duplicate invoice creation"},"invoice_coupons":{"type":"array","description":"Invoice Coupns","items":{"required":["coupon_id"],"type":"object","properties":{"coupon_association_id":{"type":"string"},"coupon_id":{"type":"string"}}}},"invoice_number":{"type":"string","description":"invoice_number is an optional human-readable identifier for the invoice"},"invoice_pdf_url":{"type":"string","description":"invoice_pdf_url is the URL where customers can download the PDF version of this invoice"},"invoice_status":{"type":"string","enum":["DRAFT","FINALIZED","VOIDED"],"x-enum-varnames":["InvoiceStatusDraft","InvoiceStatusFinalized","InvoiceStatusVoided"]},"invoice_type":{"type":"string","enum":["SUBSCRIPTION","ONE_OFF","CREDIT"],"x-enum-varnames":["InvoiceTypeSubscription","InvoiceTypeOneOff","InvoiceTypeCredit"]},"line_item_coupons":{"type":"array","description":"Invoice Line Item Coupons","items":{"required":["coupon_id","line_item_id"],"type":"object","properties":{"coupon_association_id":{"type":"string"},"coupon_id":{"type":"string"},"line_item_id":{"type":"string","description":"price_id used to match the line item"}}}},"line_items":{"type":"array","description":"line_items contains the individual items that make up this invoice","items":{"required":["amount","quantity"],"type":"object","properties":{"amount":{"type":"string","description":"amount is the monetary amount for this line item"},"commitment_info":{"type":"object","properties":{"amount":{"type":"string"},"computed_commitment_utilized_amount":{"type":"string"},"computed_overage_amount":{"type":"string"},"computed_true_up_amount":{"type":"string","description":"total_cost = computed_commitment_utilized_amount + computed_overage_amount + computed_true_up_amount"},"is_windowed":{"type":"boolean"},"overage_factor":{"type":"string"},"quantity":{"type":"string","description":"Only used for quantity-based commitments"},"true_up_enabled":{"type":"boolean"},"type":{"type":"string","enum":["amount","quantity"],"x-enum-varnames":["COMMITMENT_TYPE_AMOUNT","COMMITMENT_TYPE_QUANTITY"]}}},"display_name":{"type":"string","description":"display_name is the optional human-readable name for this line item"},"entity_id":{"type":"string","description":"entity_id is the optional unique identifier of the entity associated with this line item"},"entity_type":{"type":"string","description":"entity_type is the optional type of the entity associated with this line item"},"metadata":{"type":"object","additionalProperties":{"type":"string"}},"meter_display_name":{"type":"string","description":"meter_display_name is the optional human-readable name of the meter"},"meter_id":{"type":"string","description":"meter_id is the optional unique identifier of the meter used for usage tracking"},"period_end":{"type":"string","description":"period_end is the optional end date of the period this line item covers"},"period_start":{"type":"string","description":"period_start is the optional start date of the period this line item covers"},"plan_display_name":{"type":"string","description":"plan_display_name is the optional human-readable name of the plan"},"plan_id":{"type":"string","description":"TODO: !REMOVE after migration\nplan_id is the optional unique identifier of the plan associated with this line item"},"price_id":{"type":"string","description":"price_id is the optional unique identifier of the price associated with this line item"},"price_type":{"type":"string","description":"price_type indicates the type of pricing (fixed, usage, tiered, etc.)"},"price_unit":{"type":"string","description":"price_unit is the optional 3-digit ISO code of the price unit associated with this line item"},"price_unit_amount":{"type":"string","description":"price_unit_amount is the optional amount converted to the price unit currency"},"quantity":{"type":"string","description":"quantity is the quantity of units for this line item"}}}},"metadata":{"type":"object","additionalProperties":{"type":"string"}},"payment_status":{"type":"string","enum":["INITIATED","PENDING","PROCESSING","SUCCEEDED","OVERPAID","FAILED","REFUNDED","PARTIALLY_REFUNDED"],"x-enum-varnames":["PaymentStatusInitiated","PaymentStatusPending","PaymentStatusProcessing","PaymentStatusSucceeded","PaymentStatusOverpaid","PaymentStatusFailed","PaymentStatusRefunded","PaymentStatusPartiallyRefunded"]},"period_end":{"type":"string","description":"period_end is the end date of the billing period"},"period_start":{"type":"string","description":"period_start is the start date of the billing period"},"prepared_tax_rates":{"type":"array","description":"prepared_tax_rates contains the tax rates pre-resolved by the caller (e.g., billing service)\nThese are applied at invoice level by the invoice service without further resolution","items":{"type":"object","properties":{"code":{"type":"string"},"created_at":{"type":"string"},"created_by":{"type":"string"},"description":{"type":"string"},"environment_id":{"type":"string"},"fixed_value":{"type":"string"},"id":{"type":"string"},"metadata":{"type":"object","additionalProperties":{"type":"string"}},"name":{"type":"string"},"percentage_value":{"type":"string"},"scope":{"type":"string","enum":["INTERNAL","EXTERNAL","ONETIME"],"x-enum-varnames":["TaxRateScopeInternal","TaxRateScopeExternal","TaxRateScopeOneTime"]},"status":{"type":"string","enum":["published","deleted","archived"],"x-enum-varnames":["StatusPublished","StatusDeleted","StatusArchived"]},"tax_rate_status":{"type":"string","enum":["ACTIVE","INACTIVE"],"x-enum-varnames":["TaxRateStatusActive","TaxRateStatusInactive"]},"tax_rate_type":{"type":"string","enum":["percentage","fixed"],"x-enum-varnames":["TaxRateTypePercentage","TaxRateTypeFixed"]},"tenant_id":{"type":"string"},"updated_at":{"type":"string"},"updated_by":{"type":"string"}}}},"subscription_id":{"type":"string","description":"subscription_id is the optional unique identifier of the subscription associated with this invoice"},"subtotal":{"type":"string","description":"subtotal is the amount before taxes and discounts are applied"},"tax_rate_overrides":{"type":"array","description":"tax_rate_overrides is the tax rate overrides to be applied to the invoice","items":{"required":["currency","tax_rate_code"],"type":"object","properties":{"auto_apply":{"type":"boolean","default":true},"currency":{"type":"string"},"metadata":{"type":"object","additionalProperties":{"type":"string"}},"priority":{"type":"number"},"tax_rate_code":{"type":"string"}}}},"tax_rates":{"type":"array","description":"tax_rates","items":{"type":"string"}},"total":{"type":"string","description":"total is the total amount of the invoice including taxes and discounts"}},"description":"Invoice details"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/invoices",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostInvoicesPreview", {
    name: "PostInvoicesPreview",
    description: `Get a preview invoice`,
    inputSchema: {"type":"object","properties":{"requestBody":{"required":["subscription_id"],"type":"object","properties":{"period_end":{"type":"string","description":"period_end is the optional end date of the period to preview"},"period_start":{"type":"string","description":"period_start is the optional start date of the period to preview"},"subscription_id":{"type":"string","description":"subscription_id is the unique identifier of the subscription to preview invoice for"}},"description":"Preview Invoice Request"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/invoices/preview",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostInvoicesSearch", {
    name: "PostInvoicesSearch",
    description: `List invoices by filter`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"object","properties":{"amount_due_gt":{"type":"number","description":"amount_due_gt filters invoices with a total amount due greater than the specified value\nUseful for finding invoices above a certain threshold or identifying high-value invoices"},"amount_remaining_gt":{"type":"number","description":"amount_remaining_gt filters invoices with an outstanding balance greater than the specified value\nUseful for finding invoices that still have significant unpaid amounts"},"customer_id":{"type":"string","description":"customer_id filters invoices for a specific customer using FlexPrice's internal customer ID\nThis is the ID returned by FlexPrice when creating or retrieving customers"},"end_time":{"type":"string"},"expand":{"type":"string"},"external_customer_id":{"type":"string","description":"external_customer_id filters invoices for a customer using your system's customer identifier\nThis is the ID you provided when creating the customer in FlexPrice"},"filters":{"type":"array","items":{"type":"object","properties":{"data_type":{"type":"string","enum":["string","number","date","array"],"x-enum-varnames":["DataTypeString","DataTypeNumber","DataTypeDate","DataTypeArray"]},"field":{"type":"string"},"operator":{"type":"string","enum":["eq","contains","not_contains","gt","lt","in","not_in","before","after"],"x-enum-varnames":["EQUAL","CONTAINS","NOT_CONTAINS","GREATER_THAN","LESS_THAN","IN","NOT_IN","BEFORE","AFTER"]},"value":{"type":"object","properties":{"array":{"type":"array","items":{"type":"string"}},"boolean":{"type":"boolean"},"date":{"type":"string"},"number":{"type":"number"},"string":{"type":"string"}}}}}},"invoice_ids":{"type":"array","description":"invoice_ids restricts results to invoices with the specified IDs\nUse this to retrieve specific invoices when you know their exact identifiers","items":{"type":"string"}},"invoice_status":{"type":"array","description":"invoice_status filters by the current state of invoices in their lifecycle\nMultiple statuses can be specified to include invoices in any of the listed states","items":{"type":"string","enum":["DRAFT","FINALIZED","VOIDED"],"x-enum-varnames":["InvoiceStatusDraft","InvoiceStatusFinalized","InvoiceStatusVoided"]}},"invoice_type":{"type":"string","enum":["SUBSCRIPTION","ONE_OFF","CREDIT"],"x-enum-varnames":["InvoiceTypeSubscription","InvoiceTypeOneOff","InvoiceTypeCredit"]},"limit":{"maximum":1000,"minimum":1,"type":"number"},"offset":{"minimum":0,"type":"number"},"order":{"type":"string","enum":["asc","desc"]},"payment_status":{"type":"array","description":"payment_status filters by the payment state of invoices\nMultiple statuses can be specified to include invoices with any of the listed payment states","items":{"type":"string","enum":["INITIATED","PENDING","PROCESSING","SUCCEEDED","OVERPAID","FAILED","REFUNDED","PARTIALLY_REFUNDED"],"x-enum-varnames":["PaymentStatusInitiated","PaymentStatusPending","PaymentStatusProcessing","PaymentStatusSucceeded","PaymentStatusOverpaid","PaymentStatusFailed","PaymentStatusRefunded","PaymentStatusPartiallyRefunded"]}},"skip_line_items":{"type":"boolean","description":"SkipLineItems if true, will not include line items in the response"},"sort":{"type":"array","items":{"type":"object","properties":{"direction":{"type":"string","enum":["asc","desc"],"x-enum-varnames":["SortDirectionAsc","SortDirectionDesc"]},"field":{"type":"string"}}}},"start_time":{"type":"string"},"status":{"type":"string","enum":["published","deleted","archived"],"x-enum-varnames":["StatusPublished","StatusDeleted","StatusArchived"]},"subscription_id":{"type":"string","description":"subscription_id filters invoices generated for a specific subscription\nOnly returns invoices that were created as part of the specified subscription's billing"}},"description":"Filter"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/invoices/search",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetInvoicesById", {
    name: "GetInvoicesById",
    description: `Get detailed information about an invoice`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Invoice ID"},"expand_by_source":{"type":"boolean","description":"Include source-level price breakdown for usage line items (legacy)"},"group_by":{"type":"array","items":{"type":"string"},"description":"Group usage breakdown by specified fields (e.g., source, feature_id, properties.org_id)"}},"required":["id"]},
    method: "get",
    pathTemplate: "/invoices/{id}",
    executionParameters: [{"name":"id","in":"path"},{"name":"expand_by_source","in":"query"},{"name":"group_by","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PutInvoicesById", {
    name: "PutInvoicesById",
    description: `Update invoice details like PDF URL and due date.`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Invoice ID"},"requestBody":{"type":"object","properties":{"due_date":{"type":"string"},"invoice_pdf_url":{"type":"string","description":"invoice_pdf_url is the URL where customers can download the PDF version of this invoice"},"metadata":{"type":"object","additionalProperties":{"type":"string"}}},"description":"Invoice Update Request"}},"required":["id","requestBody"]},
    method: "put",
    pathTemplate: "/invoices/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostInvoicesCommsTrigger", {
    name: "PostInvoicesCommsTrigger",
    description: `Triggers a communication webhook event containing all information about the invoice`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Invoice ID"}},"required":["id"]},
    method: "post",
    pathTemplate: "/invoices/{id}/comms/trigger",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostInvoicesFinalize", {
    name: "PostInvoicesFinalize",
    description: `Finalize a draft invoice`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Invoice ID"}},"required":["id"]},
    method: "post",
    pathTemplate: "/invoices/{id}/finalize",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PutInvoicesPayment", {
    name: "PutInvoicesPayment",
    description: `Update the payment status of an invoice`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Invoice ID"},"requestBody":{"required":["payment_status"],"type":"object","properties":{"amount":{"type":"string","description":"amount is the optional payment amount to record"},"payment_status":{"type":"string","enum":["INITIATED","PENDING","PROCESSING","SUCCEEDED","OVERPAID","FAILED","REFUNDED","PARTIALLY_REFUNDED"],"x-enum-varnames":["PaymentStatusInitiated","PaymentStatusPending","PaymentStatusProcessing","PaymentStatusSucceeded","PaymentStatusOverpaid","PaymentStatusFailed","PaymentStatusRefunded","PaymentStatusPartiallyRefunded"]}},"description":"Payment Status Update Request"}},"required":["id","requestBody"]},
    method: "put",
    pathTemplate: "/invoices/{id}/payment",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostInvoicesPaymentAttempt", {
    name: "PostInvoicesPaymentAttempt",
    description: `Attempt to pay an invoice using customer's available wallets`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Invoice ID"}},"required":["id"]},
    method: "post",
    pathTemplate: "/invoices/{id}/payment/attempt",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetInvoicesPdf", {
    name: "GetInvoicesPdf",
    description: `Retrieve the PDF document for a specific invoice by its ID`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Invoice ID"},"url":{"type":"boolean","description":"Return presigned URL from s3 instead of PDF"}},"required":["id"]},
    method: "get",
    pathTemplate: "/invoices/{id}/pdf",
    executionParameters: [{"name":"id","in":"path"},{"name":"url","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostInvoicesRecalculate", {
    name: "PostInvoicesRecalculate",
    description: `Recalculate totals and line items for a draft invoice, useful when subscription line items or usage data has changed`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Invoice ID"},"finalize":{"type":"boolean","description":"Whether to finalize the invoice after recalculation (default: true)"}},"required":["id"]},
    method: "post",
    pathTemplate: "/invoices/{id}/recalculate",
    executionParameters: [{"name":"id","in":"path"},{"name":"finalize","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostInvoicesVoid", {
    name: "PostInvoicesVoid",
    description: `Void an invoice that hasn't been paid`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Invoice ID"}},"required":["id"]},
    method: "post",
    pathTemplate: "/invoices/{id}/void",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetPayments", {
    name: "GetPayments",
    description: `List payments with the specified filter`,
    inputSchema: {"type":"object","properties":{"currency":{"type":"string"},"destination_id":{"type":"string"},"destination_type":{"type":"string"},"end_time":{"type":"string"},"expand":{"type":"string"},"gateway_payment_id":{"type":"string"},"gateway_tracking_id":{"type":"string","description":"For filtering by gateway tracking ID"},"limit":{"maximum":1000,"minimum":1,"type":"number"},"offset":{"minimum":0,"type":"number"},"order":{"type":"string","enum":["asc","desc"]},"payment_gateway":{"type":"string"},"payment_ids":{"type":"array","items":{"type":"string"}},"payment_method_type":{"type":"string"},"payment_status":{"type":"string"},"sort":{"type":"string"},"start_time":{"type":"string"},"status":{"type":"string","enum":["published","deleted","archived"],"x-enum-varnames":["StatusPublished","StatusDeleted","StatusArchived"]}}},
    method: "get",
    pathTemplate: "/payments",
    executionParameters: [{"name":"currency","in":"query"},{"name":"destination_id","in":"query"},{"name":"destination_type","in":"query"},{"name":"end_time","in":"query"},{"name":"expand","in":"query"},{"name":"gateway_payment_id","in":"query"},{"name":"gateway_tracking_id","in":"query"},{"name":"limit","in":"query"},{"name":"offset","in":"query"},{"name":"order","in":"query"},{"name":"payment_gateway","in":"query"},{"name":"payment_ids","in":"query"},{"name":"payment_method_type","in":"query"},{"name":"payment_status","in":"query"},{"name":"sort","in":"query"},{"name":"start_time","in":"query"},{"name":"status","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostPayments", {
    name: "PostPayments",
    description: `Create a new payment with the specified configuration`,
    inputSchema: {"type":"object","properties":{"requestBody":{"required":["amount","currency","destination_id","destination_type","payment_method_type"],"type":"object","properties":{"amount":{"type":"string"},"cancel_url":{"type":"string"},"currency":{"type":"string"},"destination_id":{"type":"string"},"destination_type":{"type":"string","enum":["INVOICE"],"x-enum-varnames":["PaymentDestinationTypeInvoice"]},"idempotency_key":{"type":"string"},"metadata":{"type":"object","additionalProperties":{"type":"string"}},"payment_gateway":{"type":"string","enum":["stripe","razorpay","nomod"],"x-enum-varnames":["PaymentGatewayTypeStripe","PaymentGatewayTypeRazorpay","PaymentGatewayTypeNomod"]},"payment_method_id":{"type":"string"},"payment_method_type":{"type":"string","enum":["CARD","ACH","OFFLINE","CREDITS","PAYMENT_LINK"],"x-enum-varnames":["PaymentMethodTypeCard","PaymentMethodTypeACH","PaymentMethodTypeOffline","PaymentMethodTypeCredits","PaymentMethodTypePaymentLink"]},"process_payment":{"type":"boolean","default":true},"save_card_and_make_default":{"type":"boolean","default":false},"success_url":{"type":"string"}},"description":"Payment configuration"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/payments",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetPaymentsById", {
    name: "GetPaymentsById",
    description: `Get a payment by ID`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Payment ID"}},"required":["id"]},
    method: "get",
    pathTemplate: "/payments/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PutPaymentsById", {
    name: "PutPaymentsById",
    description: `Update a payment with the specified configuration`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Payment ID"},"requestBody":{"type":"object","properties":{"error_message":{"type":"string"},"failed_at":{"type":"string"},"gateway_payment_id":{"type":"string"},"metadata":{"type":"object","additionalProperties":{"type":"string"}},"payment_gateway":{"type":"string"},"payment_method_id":{"type":"string"},"payment_status":{"type":"string"},"succeeded_at":{"type":"string"}},"description":"Payment configuration"}},"required":["id","requestBody"]},
    method: "put",
    pathTemplate: "/payments/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["DeletePaymentsById", {
    name: "DeletePaymentsById",
    description: `Delete a payment`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Payment ID"}},"required":["id"]},
    method: "delete",
    pathTemplate: "/payments/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostPaymentsProcess", {
    name: "PostPaymentsProcess",
    description: `Process a payment`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Payment ID"}},"required":["id"]},
    method: "post",
    pathTemplate: "/payments/{id}/process",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetPlans", {
    name: "GetPlans",
    description: `Get plans with optional filtering`,
    inputSchema: {"type":"object","properties":{"end_time":{"type":"string"},"expand":{"type":"string"},"limit":{"maximum":1000,"minimum":1,"type":"number"},"lookup_key":{"type":"string"},"offset":{"minimum":0,"type":"number"},"order":{"type":"string","enum":["asc","desc"]},"plan_ids":{"type":"array","items":{"type":"string"}},"start_time":{"type":"string"},"status":{"type":"string","enum":["published","deleted","archived"],"x-enum-varnames":["StatusPublished","StatusDeleted","StatusArchived"]}}},
    method: "get",
    pathTemplate: "/plans",
    executionParameters: [{"name":"end_time","in":"query"},{"name":"expand","in":"query"},{"name":"limit","in":"query"},{"name":"lookup_key","in":"query"},{"name":"offset","in":"query"},{"name":"order","in":"query"},{"name":"plan_ids","in":"query"},{"name":"start_time","in":"query"},{"name":"status","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostPlans", {
    name: "PostPlans",
    description: `Create a new plan with the specified configuration`,
    inputSchema: {"type":"object","properties":{"requestBody":{"required":["name"],"type":"object","properties":{"description":{"type":"string"},"display_order":{"type":"number"},"lookup_key":{"type":"string"},"metadata":{"type":"object","additionalProperties":{"type":"string"}},"name":{"type":"string"}},"description":"Plan configuration"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/plans",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostPlansSearch", {
    name: "PostPlansSearch",
    description: `List plans by filter`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"object","properties":{"end_time":{"type":"string"},"expand":{"type":"string"},"filters":{"type":"array","description":"filters allows complex filtering based on multiple fields","items":{"type":"object","properties":{"data_type":{"type":"string","enum":["string","number","date","array"],"x-enum-varnames":["DataTypeString","DataTypeNumber","DataTypeDate","DataTypeArray"]},"field":{"type":"string"},"operator":{"type":"string","enum":["eq","contains","not_contains","gt","lt","in","not_in","before","after"],"x-enum-varnames":["EQUAL","CONTAINS","NOT_CONTAINS","GREATER_THAN","LESS_THAN","IN","NOT_IN","BEFORE","AFTER"]},"value":{"type":"object","properties":{"array":{"type":"array","items":{"type":"string"}},"boolean":{"type":"boolean"},"date":{"type":"string"},"number":{"type":"number"},"string":{"type":"string"}}}}}},"limit":{"maximum":1000,"minimum":1,"type":"number"},"lookup_key":{"type":"string"},"offset":{"minimum":0,"type":"number"},"order":{"type":"string","enum":["asc","desc"]},"plan_ids":{"type":"array","items":{"type":"string"}},"sort":{"type":"array","items":{"type":"object","properties":{"direction":{"type":"string","enum":["asc","desc"],"x-enum-varnames":["SortDirectionAsc","SortDirectionDesc"]},"field":{"type":"string"}}}},"start_time":{"type":"string"},"status":{"type":"string","enum":["published","deleted","archived"],"x-enum-varnames":["StatusPublished","StatusDeleted","StatusArchived"]}},"description":"Filter"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/plans/search",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetPlansById", {
    name: "GetPlansById",
    description: `Get a plan by ID`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Plan ID"}},"required":["id"]},
    method: "get",
    pathTemplate: "/plans/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PutPlansById", {
    name: "PutPlansById",
    description: `Update a plan by ID`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Plan ID"},"requestBody":{"type":"object","properties":{"description":{"type":"string"},"display_order":{"type":"number"},"lookup_key":{"type":"string"},"metadata":{"type":"object","additionalProperties":{"type":"string"}},"name":{"type":"string"}},"description":"Plan update"}},"required":["id","requestBody"]},
    method: "put",
    pathTemplate: "/plans/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["DeletePlansById", {
    name: "DeletePlansById",
    description: `Delete a plan by ID`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Plan ID"}},"required":["id"]},
    method: "delete",
    pathTemplate: "/plans/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetPlansCreditgrants", {
    name: "GetPlansCreditgrants",
    description: `Get all credit grants for a plan`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Plan ID"}},"required":["id"]},
    method: "get",
    pathTemplate: "/plans/{id}/creditgrants",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetPlansEntitlements", {
    name: "GetPlansEntitlements",
    description: `Get all entitlements for a plan`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Plan ID"}},"required":["id"]},
    method: "get",
    pathTemplate: "/plans/{id}/entitlements",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostPlansSyncSubscriptions", {
    name: "PostPlansSyncSubscriptions",
    description: `Synchronize current plan prices with all existing active subscriptions`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Plan ID"}},"required":["id"]},
    method: "post",
    pathTemplate: "/plans/{id}/sync/subscriptions",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetPortalByExternalId", {
    name: "GetPortalByExternalId",
    description: `Generate a dashboard URL/token for a customer to access their billing information`,
    inputSchema: {"type":"object","properties":{"external_id":{"type":"string","description":"Customer External ID"}},"required":["external_id"]},
    method: "get",
    pathTemplate: "/portal/{external_id}",
    executionParameters: [{"name":"external_id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetPrices", {
    name: "GetPrices",
    description: `Get prices with the specified filter`,
    inputSchema: {"type":"object","properties":{"allow_expired_prices":{"type":"boolean","default":false},"end_time":{"type":"string"},"entity_ids":{"type":"array","items":{"type":"string"}},"entity_type":{"type":"string","enum":["PLAN","SUBSCRIPTION","ADDON","PRICE","COSTSHEET"],"x-enum-varnames":["PRICE_ENTITY_TYPE_PLAN","PRICE_ENTITY_TYPE_SUBSCRIPTION","PRICE_ENTITY_TYPE_ADDON","PRICE_ENTITY_TYPE_PRICE","PRICE_ENTITY_TYPE_COSTSHEET"]},"expand":{"type":"string"},"limit":{"maximum":1000,"minimum":1,"type":"number"},"meter_ids":{"type":"array","items":{"type":"string"}},"offset":{"minimum":0,"type":"number"},"order":{"type":"string","enum":["asc","desc"]},"parent_price_id":{"type":"string"},"plan_ids":{"type":"array","items":{"type":"string"},"description":"Price override filtering fields"},"price_ids":{"type":"array","items":{"type":"string"}},"sort":{"type":"string"},"start_date_lt":{"type":"string"},"start_time":{"type":"string"},"status":{"type":"string","enum":["published","deleted","archived"],"x-enum-varnames":["StatusPublished","StatusDeleted","StatusArchived"]},"subscription_id":{"type":"string"}}},
    method: "get",
    pathTemplate: "/prices",
    executionParameters: [{"name":"allow_expired_prices","in":"query"},{"name":"end_time","in":"query"},{"name":"entity_ids","in":"query"},{"name":"entity_type","in":"query"},{"name":"expand","in":"query"},{"name":"limit","in":"query"},{"name":"meter_ids","in":"query"},{"name":"offset","in":"query"},{"name":"order","in":"query"},{"name":"parent_price_id","in":"query"},{"name":"plan_ids","in":"query"},{"name":"price_ids","in":"query"},{"name":"sort","in":"query"},{"name":"start_date_lt","in":"query"},{"name":"start_time","in":"query"},{"name":"status","in":"query"},{"name":"subscription_id","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostPrices", {
    name: "PostPrices",
    description: `Create a new price with the specified configuration. Supports both regular and price unit configurations.`,
    inputSchema: {"type":"object","properties":{"requestBody":{"required":["billing_cadence","billing_model","billing_period","currency","entity_id","entity_type","invoice_cadence","price_unit_type","type"],"type":"object","properties":{"amount":{"type":"string"},"billing_cadence":{"type":"string","enum":["RECURRING","ONETIME"],"x-enum-varnames":["BILLING_CADENCE_RECURRING","BILLING_CADENCE_ONETIME"]},"billing_model":{"type":"string","enum":["FLAT_FEE","PACKAGE","TIERED"],"x-enum-varnames":["BILLING_MODEL_FLAT_FEE","BILLING_MODEL_PACKAGE","BILLING_MODEL_TIERED"]},"billing_period":{"type":"string","enum":["MONTHLY","ANNUAL","WEEKLY","DAILY","QUARTERLY","HALF_YEARLY"],"x-enum-varnames":["BILLING_PERIOD_MONTHLY","BILLING_PERIOD_ANNUAL","BILLING_PERIOD_WEEKLY","BILLING_PERIOD_DAILY","BILLING_PERIOD_QUARTER","BILLING_PERIOD_HALF_YEAR"]},"billing_period_count":{"type":"number"},"currency":{"type":"string"},"description":{"type":"string"},"display_name":{"type":"string"},"end_date":{"type":"string"},"entity_id":{"type":"string"},"entity_type":{"type":"string","enum":["PLAN","SUBSCRIPTION","ADDON","PRICE","COSTSHEET"],"x-enum-varnames":["PRICE_ENTITY_TYPE_PLAN","PRICE_ENTITY_TYPE_SUBSCRIPTION","PRICE_ENTITY_TYPE_ADDON","PRICE_ENTITY_TYPE_PRICE","PRICE_ENTITY_TYPE_COSTSHEET"]},"filter_values":{"type":"object","additionalProperties":{"type":"array","items":{"type":"string"}}},"group_id":{"type":"string","description":"GroupID is the id of the group to add the price to"},"invoice_cadence":{"type":"string","enum":["ARREAR","ADVANCE"],"x-enum-varnames":["InvoiceCadenceArrear","InvoiceCadenceAdvance"]},"lookup_key":{"type":"string"},"metadata":{"type":"object","additionalProperties":{"type":"string"}},"meter_id":{"type":"string"},"min_quantity":{"type":"number","description":"MinQuantity is the minimum quantity of the price"},"price_unit_config":{"required":["price_unit"],"type":"object","properties":{"amount":{"type":"string"},"price_unit":{"type":"string"},"price_unit_tiers":{"type":"array","items":{"required":["unit_amount"],"type":"object","properties":{"flat_amount":{"type":"string","description":"flat_amount is the flat amount for the given tier (optional)\nApplied on top of unit_amount*quantity. Useful for cases like \"2.7$ + 5c\""},"unit_amount":{"type":"string","description":"unit_amount is the amount per unit for the given tier"},"up_to":{"type":"number","description":"up_to is the quantity up to which this tier applies. It is null for the last tier.\nIMPORTANT: Tier boundaries are INCLUSIVE.\n- If up_to is 1000, then quantity less than or equal to 1000 belongs to this tier\n- This behavior is consistent across both VOLUME and SLAB tier modes"}}}}}},"price_unit_type":{"type":"string","enum":["FIAT","CUSTOM"],"x-enum-varnames":["PRICE_UNIT_TYPE_FIAT","PRICE_UNIT_TYPE_CUSTOM"]},"start_date":{"type":"string"},"tier_mode":{"type":"string","enum":["VOLUME","SLAB"],"x-enum-varnames":["BILLING_TIER_VOLUME","BILLING_TIER_SLAB"]},"tiers":{"type":"array","items":{"required":["unit_amount"],"type":"object","properties":{"flat_amount":{"type":"string","description":"flat_amount is the flat amount for the given tier (optional)\nApplied on top of unit_amount*quantity. Useful for cases like \"2.7$ + 5c\""},"unit_amount":{"type":"string","description":"unit_amount is the amount per unit for the given tier"},"up_to":{"type":"number","description":"up_to is the quantity up to which this tier applies. It is null for the last tier.\nIMPORTANT: Tier boundaries are INCLUSIVE.\n- If up_to is 1000, then quantity less than or equal to 1000 belongs to this tier\n- This behavior is consistent across both VOLUME and SLAB tier modes"}}}},"transform_quantity":{"type":"object","properties":{"divide_by":{"type":"number","description":"Divide quantity by this number"},"round":{"type":"string","enum":["up","down"],"x-enum-varnames":["ROUND_UP","ROUND_DOWN"]}}},"trial_period":{"type":"number"},"type":{"type":"string","enum":["USAGE","FIXED"],"x-enum-varnames":["PRICE_TYPE_USAGE","PRICE_TYPE_FIXED"]}},"description":"Price configuration"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/prices",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostPricesBulk", {
    name: "PostPricesBulk",
    description: `Create multiple prices with the specified configurations. Supports both regular and price unit configurations.`,
    inputSchema: {"type":"object","properties":{"requestBody":{"required":["items"],"type":"object","properties":{"items":{"maxItems":100,"minItems":1,"type":"array","items":{"required":["billing_cadence","billing_model","billing_period","currency","entity_id","entity_type","invoice_cadence","price_unit_type","type"],"type":"object","properties":{"amount":{"type":"string"},"billing_cadence":{"type":"string","enum":["RECURRING","ONETIME"],"x-enum-varnames":["BILLING_CADENCE_RECURRING","BILLING_CADENCE_ONETIME"]},"billing_model":{"type":"string","enum":["FLAT_FEE","PACKAGE","TIERED"],"x-enum-varnames":["BILLING_MODEL_FLAT_FEE","BILLING_MODEL_PACKAGE","BILLING_MODEL_TIERED"]},"billing_period":{"type":"string","enum":["MONTHLY","ANNUAL","WEEKLY","DAILY","QUARTERLY","HALF_YEARLY"],"x-enum-varnames":["BILLING_PERIOD_MONTHLY","BILLING_PERIOD_ANNUAL","BILLING_PERIOD_WEEKLY","BILLING_PERIOD_DAILY","BILLING_PERIOD_QUARTER","BILLING_PERIOD_HALF_YEAR"]},"billing_period_count":{"type":"number"},"currency":{"type":"string"},"description":{"type":"string"},"display_name":{"type":"string"},"end_date":{"type":"string"},"entity_id":{"type":"string"},"entity_type":{"type":"string","enum":["PLAN","SUBSCRIPTION","ADDON","PRICE","COSTSHEET"],"x-enum-varnames":["PRICE_ENTITY_TYPE_PLAN","PRICE_ENTITY_TYPE_SUBSCRIPTION","PRICE_ENTITY_TYPE_ADDON","PRICE_ENTITY_TYPE_PRICE","PRICE_ENTITY_TYPE_COSTSHEET"]},"filter_values":{"type":"object","additionalProperties":{"type":"array","items":{"type":"string"}}},"group_id":{"type":"string","description":"GroupID is the id of the group to add the price to"},"invoice_cadence":{"type":"string","enum":["ARREAR","ADVANCE"],"x-enum-varnames":["InvoiceCadenceArrear","InvoiceCadenceAdvance"]},"lookup_key":{"type":"string"},"metadata":{"type":"object","additionalProperties":{"type":"string"}},"meter_id":{"type":"string"},"min_quantity":{"type":"number","description":"MinQuantity is the minimum quantity of the price"},"price_unit_config":{"required":["price_unit"],"type":"object","properties":{"amount":{"type":"string"},"price_unit":{"type":"string"},"price_unit_tiers":{"type":"array","items":{"required":["unit_amount"],"type":"object","properties":{"flat_amount":{"type":"string","description":"flat_amount is the flat amount for the given tier (optional)\nApplied on top of unit_amount*quantity. Useful for cases like \"2.7$ + 5c\""},"unit_amount":{"type":"string","description":"unit_amount is the amount per unit for the given tier"},"up_to":{"type":"number","description":"up_to is the quantity up to which this tier applies. It is null for the last tier.\nIMPORTANT: Tier boundaries are INCLUSIVE.\n- If up_to is 1000, then quantity less than or equal to 1000 belongs to this tier\n- This behavior is consistent across both VOLUME and SLAB tier modes"}}}}}},"price_unit_type":{"type":"string","enum":["FIAT","CUSTOM"],"x-enum-varnames":["PRICE_UNIT_TYPE_FIAT","PRICE_UNIT_TYPE_CUSTOM"]},"start_date":{"type":"string"},"tier_mode":{"type":"string","enum":["VOLUME","SLAB"],"x-enum-varnames":["BILLING_TIER_VOLUME","BILLING_TIER_SLAB"]},"tiers":{"type":"array","items":{"required":["unit_amount"],"type":"object","properties":{"flat_amount":{"type":"string","description":"flat_amount is the flat amount for the given tier (optional)\nApplied on top of unit_amount*quantity. Useful for cases like \"2.7$ + 5c\""},"unit_amount":{"type":"string","description":"unit_amount is the amount per unit for the given tier"},"up_to":{"type":"number","description":"up_to is the quantity up to which this tier applies. It is null for the last tier.\nIMPORTANT: Tier boundaries are INCLUSIVE.\n- If up_to is 1000, then quantity less than or equal to 1000 belongs to this tier\n- This behavior is consistent across both VOLUME and SLAB tier modes"}}}},"transform_quantity":{"type":"object","properties":{"divide_by":{"type":"number","description":"Divide quantity by this number"},"round":{"type":"string","enum":["up","down"],"x-enum-varnames":["ROUND_UP","ROUND_DOWN"]}}},"trial_period":{"type":"number"},"type":{"type":"string","enum":["USAGE","FIXED"],"x-enum-varnames":["PRICE_TYPE_USAGE","PRICE_TYPE_FIXED"]}}}}},"description":"Bulk price configuration"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/prices/bulk",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetPricesLookupByLookupKey", {
    name: "GetPricesLookupByLookupKey",
    description: `Get price by lookup key`,
    inputSchema: {"type":"object","properties":{"lookup_key":{"type":"string","description":"Lookup key"}},"required":["lookup_key"]},
    method: "get",
    pathTemplate: "/prices/lookup/{lookup_key}",
    executionParameters: [{"name":"lookup_key","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetPricesUnits", {
    name: "GetPricesUnits",
    description: `Get a paginated list of price units with optional filtering`,
    inputSchema: {"type":"object","properties":{"status":{"type":"string","description":"Filter by status"},"limit":{"type":"number","description":"Limit number of results"},"offset":{"type":"number","description":"Offset for pagination"},"sort":{"type":"string","description":"Sort field"},"order":{"type":"string","description":"Sort order (asc/desc)"}}},
    method: "get",
    pathTemplate: "/prices/units",
    executionParameters: [{"name":"status","in":"query"},{"name":"limit","in":"query"},{"name":"offset","in":"query"},{"name":"sort","in":"query"},{"name":"order","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostPricesUnits", {
    name: "PostPricesUnits",
    description: `Create a new price unit with the provided details`,
    inputSchema: {"type":"object","properties":{"requestBody":{"required":["base_currency","code","conversion_rate","name","symbol"],"type":"object","properties":{"base_currency":{"type":"string","description":"base_currency  is the currency that the price unit is based on"},"code":{"type":"string"},"conversion_rate":{"type":"string","description":"ConversionRate defines the exchange rate from this price unit to the base currency.\nThis rate is used to convert amounts in the custom price unit to the base currency for storage and billing.\n\nConversion formula:\n  price_unit_amount * conversion_rate = base_currency_amount\n\nExample:\n  If conversion_rate = \"0.01\" and base_currency = \"usd\":\n  100 price_unit tokens * 0.01 = 1.00 USD\n\nNote: Rounding precision is determined by the base currency (e.g., USD uses 2 decimal places, JPY uses 0)."},"metadata":{"type":"object","additionalProperties":{"type":"string"}},"name":{"type":"string"},"symbol":{"type":"string"}},"description":"Price unit details"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/prices/units",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetPricesUnitsCodeByCode", {
    name: "GetPricesUnitsCodeByCode",
    description: `Get a price unit by code`,
    inputSchema: {"type":"object","properties":{"code":{"type":"string","description":"Price unit code"}},"required":["code"]},
    method: "get",
    pathTemplate: "/prices/units/code/{code}",
    executionParameters: [{"name":"code","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostPricesUnitsSearch", {
    name: "PostPricesUnitsSearch",
    description: `List price units by filter`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"object","properties":{"expand":{"type":"string"},"limit":{"type":"number"},"offset":{"type":"number"},"order":{"type":"string"},"sort":{"type":"string"},"status":{"type":"string","enum":["published","deleted","archived"],"x-enum-varnames":["StatusPublished","StatusDeleted","StatusArchived"]}},"description":"Filter"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/prices/units/search",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetPricesUnitsById", {
    name: "GetPricesUnitsById",
    description: `Get a price unit by ID`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Price unit ID"}},"required":["id"]},
    method: "get",
    pathTemplate: "/prices/units/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PutPricesUnitsById", {
    name: "PutPricesUnitsById",
    description: `Update an existing price unit with the provided details. Only name and metadata can be updated.`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Price unit ID"},"requestBody":{"type":"object","properties":{"metadata":{"type":"object","additionalProperties":{"type":"string"}},"name":{"type":"string"}},"description":"Price unit details to update"}},"required":["id","requestBody"]},
    method: "put",
    pathTemplate: "/prices/units/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["DeletePricesUnitsById", {
    name: "DeletePricesUnitsById",
    description: `Delete an existing price unit.`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Price unit ID"}},"required":["id"]},
    method: "delete",
    pathTemplate: "/prices/units/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetPricesById", {
    name: "GetPricesById",
    description: `Get a price by ID with expanded meter and price unit information`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Price ID"}},"required":["id"]},
    method: "get",
    pathTemplate: "/prices/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PutPricesById", {
    name: "PutPricesById",
    description: `Update a price with the specified configuration`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Price ID"},"requestBody":{"type":"object","properties":{"amount":{"type":"string","description":"Amount is the new price amount that overrides the original price (optional)"},"billing_model":{"type":"string","enum":["FLAT_FEE","PACKAGE","TIERED"],"x-enum-varnames":["BILLING_MODEL_FLAT_FEE","BILLING_MODEL_PACKAGE","BILLING_MODEL_TIERED"]},"description":{"type":"string"},"display_name":{"type":"string"},"effective_from":{"type":"string"},"group_id":{"type":"string","description":"GroupID is the id of the group to update the price in"},"lookup_key":{"type":"string","description":"All price fields that can be updated\nNon-critical fields (can be updated directly)"},"metadata":{"type":"object","additionalProperties":{"type":"string"}},"price_unit_amount":{"type":"string","description":"PriceUnitAmount is the price unit amount (for CUSTOM price unit type, FLAT_FEE/PACKAGE billing models)"},"price_unit_tiers":{"type":"array","description":"PriceUnitTiers are the price unit tiers (for CUSTOM price unit type, TIERED billing model)","items":{"required":["unit_amount"],"type":"object","properties":{"flat_amount":{"type":"string","description":"flat_amount is the flat amount for the given tier (optional)\nApplied on top of unit_amount*quantity. Useful for cases like \"2.7$ + 5c\""},"unit_amount":{"type":"string","description":"unit_amount is the amount per unit for the given tier"},"up_to":{"type":"number","description":"up_to is the quantity up to which this tier applies. It is null for the last tier.\nIMPORTANT: Tier boundaries are INCLUSIVE.\n- If up_to is 1000, then quantity less than or equal to 1000 belongs to this tier\n- This behavior is consistent across both VOLUME and SLAB tier modes"}}}},"tier_mode":{"type":"string","enum":["VOLUME","SLAB"],"x-enum-varnames":["BILLING_TIER_VOLUME","BILLING_TIER_SLAB"]},"tiers":{"type":"array","description":"Tiers determines the pricing tiers for this line item","items":{"required":["unit_amount"],"type":"object","properties":{"flat_amount":{"type":"string","description":"flat_amount is the flat amount for the given tier (optional)\nApplied on top of unit_amount*quantity. Useful for cases like \"2.7$ + 5c\""},"unit_amount":{"type":"string","description":"unit_amount is the amount per unit for the given tier"},"up_to":{"type":"number","description":"up_to is the quantity up to which this tier applies. It is null for the last tier.\nIMPORTANT: Tier boundaries are INCLUSIVE.\n- If up_to is 1000, then quantity less than or equal to 1000 belongs to this tier\n- This behavior is consistent across both VOLUME and SLAB tier modes"}}}},"transform_quantity":{"type":"object","properties":{"divide_by":{"type":"number","description":"Divide quantity by this number"},"round":{"type":"string","enum":["up","down"],"x-enum-varnames":["ROUND_UP","ROUND_DOWN"]}}}},"description":"Price configuration"}},"required":["id","requestBody"]},
    method: "put",
    pathTemplate: "/prices/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["DeletePricesById", {
    name: "DeletePricesById",
    description: `Delete a price`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Price ID"},"requestBody":{"type":"object","properties":{"end_date":{"type":"string"}},"description":"Delete Price Request"}},"required":["id","requestBody"]},
    method: "delete",
    pathTemplate: "/prices/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetRbacRoles", {
    name: "GetRbacRoles",
    description: `Returns all available roles with their permissions, names, and descriptions`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/rbac/roles",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetRbacRolesById", {
    name: "GetRbacRolesById",
    description: `Returns details of a specific role including permissions, name, and description`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Role ID"}},"required":["id"]},
    method: "get",
    pathTemplate: "/rbac/roles/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetSecretsApiKeys", {
    name: "GetSecretsApiKeys",
    description: `Get a paginated list of API keys`,
    inputSchema: {"type":"object","properties":{"limit":{"type":"number","description":"Limit"},"offset":{"type":"number","description":"Offset"},"status":{"type":"string","description":"Status (published/archived)"}}},
    method: "get",
    pathTemplate: "/secrets/api/keys",
    executionParameters: [{"name":"limit","in":"query"},{"name":"offset","in":"query"},{"name":"status","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostSecretsApiKeys", {
    name: "PostSecretsApiKeys",
    description: `Create a new API key. Provide 'service_account_id' in body to create API key for a service account, otherwise creates for authenticated user.`,
    inputSchema: {"type":"object","properties":{"requestBody":{"required":["name","type"],"type":"object","properties":{"expires_at":{"type":"string"},"name":{"type":"string"},"service_account_id":{"type":"string"},"type":{"type":"string","enum":["private_key","publishable_key","integration"],"x-enum-varnames":["SecretTypePrivateKey","SecretTypePublishableKey","SecretTypeIntegration"]}},"description":"API key creation request\\"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/secrets/api/keys",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["DeleteSecretsApiKeysById", {
    name: "DeleteSecretsApiKeysById",
    description: `Delete an API key by ID`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"API key ID"}},"required":["id"]},
    method: "delete",
    pathTemplate: "/secrets/api/keys/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetSecretsIntegrationsByProviderByProvider", {
    name: "GetSecretsIntegrationsByProviderByProvider",
    description: `Get details of a specific integration`,
    inputSchema: {"type":"object","properties":{"provider":{"type":"string","description":"Integration provider"}},"required":["provider"]},
    method: "get",
    pathTemplate: "/secrets/integrations/by-provider/{provider}",
    executionParameters: [{"name":"provider","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostSecretsIntegrationsCreateByProvider", {
    name: "PostSecretsIntegrationsCreateByProvider",
    description: `Create or update integration credentials`,
    inputSchema: {"type":"object","properties":{"provider":{"type":"string","description":"Integration provider"},"requestBody":{"required":["credentials","name","provider"],"type":"object","properties":{"credentials":{"type":"object","additionalProperties":{"type":"string"}},"name":{"type":"string"},"provider":{"type":"string","enum":["flexprice","stripe","s3","hubspot","razorpay","chargebee","quickbooks","nomod"],"x-enum-varnames":["SecretProviderFlexPrice","SecretProviderStripe","SecretProviderS3","SecretProviderHubSpot","SecretProviderRazorpay","SecretProviderChargebee","SecretProviderQuickBooks","SecretProviderNomod"]}},"description":"Integration creation request"}},"required":["provider","requestBody"]},
    method: "post",
    pathTemplate: "/secrets/integrations/create/{provider}",
    executionParameters: [{"name":"provider","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetSecretsIntegrationsLinked", {
    name: "GetSecretsIntegrationsLinked",
    description: `Get a list of unique providers which have a valid linked integration secret`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/secrets/integrations/linked",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["DeleteSecretsIntegrationsById", {
    name: "DeleteSecretsIntegrationsById",
    description: `Delete integration credentials`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Integration ID"}},"required":["id"]},
    method: "delete",
    pathTemplate: "/secrets/integrations/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetSubscriptions", {
    name: "GetSubscriptions",
    description: `Get subscriptions with optional filtering`,
    inputSchema: {"type":"object","properties":{"active_at":{"type":"string","description":"ActiveAt filters subscriptions that are active at the given time"},"billing_cadence":{"type":"array","items":{"type":"string","enum":["RECURRING","ONETIME"]},"description":"BillingCadence filters by billing cadence"},"billing_period":{"type":"array","items":{"type":"string","enum":["MONTHLY","ANNUAL","WEEKLY","DAILY","QUARTERLY","HALF_YEARLY"]},"description":"BillingPeriod filters by billing period"},"customer_id":{"type":"string","description":"CustomerID filters by customer ID"},"end_time":{"type":"string"},"expand":{"type":"string"},"external_customer_id":{"type":"string","description":"ExternalCustomerID filters by external customer ID"},"invoicing_customer_ids":{"type":"array","items":{"type":"string"},"description":"InvoicingCustomerIDs filters by invoicing customer ID"},"limit":{"maximum":1000,"minimum":1,"type":"number"},"offset":{"minimum":0,"type":"number"},"order":{"type":"string","enum":["asc","desc"]},"plan_id":{"type":"string","description":"PlanID filters by plan ID"},"start_time":{"type":"string"},"status":{"type":"string","enum":["published","deleted","archived"],"x-enum-varnames":["StatusPublished","StatusDeleted","StatusArchived"]},"subscription_ids":{"type":"array","items":{"type":"string"}},"subscription_status":{"type":"array","items":{"type":"string","enum":["active","paused","cancelled","incomplete","trialing","draft"]},"description":"SubscriptionStatus filters by subscription status"},"with_line_items":{"type":"boolean","description":"WithLineItems includes line items in the response"}}},
    method: "get",
    pathTemplate: "/subscriptions",
    executionParameters: [{"name":"active_at","in":"query"},{"name":"billing_cadence","in":"query"},{"name":"billing_period","in":"query"},{"name":"customer_id","in":"query"},{"name":"end_time","in":"query"},{"name":"expand","in":"query"},{"name":"external_customer_id","in":"query"},{"name":"invoicing_customer_ids","in":"query"},{"name":"limit","in":"query"},{"name":"offset","in":"query"},{"name":"order","in":"query"},{"name":"plan_id","in":"query"},{"name":"start_time","in":"query"},{"name":"status","in":"query"},{"name":"subscription_ids","in":"query"},{"name":"subscription_status","in":"query"},{"name":"with_line_items","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostSubscriptions", {
    name: "PostSubscriptions",
    description: `Create a new subscription`,
    inputSchema: {"type":"object","properties":{"requestBody":{"required":["billing_cadence","billing_period","currency","plan_id"],"type":"object","properties":{"addons":{"type":"array","description":"Addons represents addons to be added to the subscription during creation","items":{"required":["addon_id"],"type":"object","properties":{"addon_id":{"type":"string"},"line_item_commitments":{"type":"object","additionalProperties":{"type":"object","properties":{"commitment_amount":{"type":"number","description":"CommitmentAmount is the minimum amount committed for this line item"},"commitment_quantity":{"type":"number","description":"CommitmentQuantity is the minimum quantity committed for this line item"},"commitment_type":{"type":"string","enum":["amount","quantity"],"x-enum-varnames":["COMMITMENT_TYPE_AMOUNT","COMMITMENT_TYPE_QUANTITY"]},"enable_true_up":{"type":"boolean","description":"EnableTrueUp determines if true-up fee should be applied when usage is below commitment"},"is_window_commitment":{"type":"boolean","description":"IsWindowCommitment determines if commitment is applied per window (e.g., per day) rather than per billing period"},"overage_factor":{"type":"number","description":"OverageFactor is a multiplier applied to usage beyond the commitment"}}},"description":"LineItemCommitments allows setting commitment configuration per addon line item (keyed by price_id)"},"metadata":{"type":"object","additionalProperties":true},"start_date":{"type":"string"}}}},"billing_cadence":{"type":"string","enum":["RECURRING","ONETIME"],"x-enum-varnames":["BILLING_CADENCE_RECURRING","BILLING_CADENCE_ONETIME"]},"billing_cycle":{"type":"string","enum":["anniversary","calendar"],"x-enum-varnames":["BillingCycleAnniversary","BillingCycleCalendar"]},"billing_period":{"type":"string","enum":["MONTHLY","ANNUAL","WEEKLY","DAILY","QUARTERLY","HALF_YEARLY"],"x-enum-varnames":["BILLING_PERIOD_MONTHLY","BILLING_PERIOD_ANNUAL","BILLING_PERIOD_WEEKLY","BILLING_PERIOD_DAILY","BILLING_PERIOD_QUARTER","BILLING_PERIOD_HALF_YEAR"]},"billing_period_count":{"type":"number"},"collection_method":{"type":"string","enum":["charge_automatically","send_invoice"],"x-enum-varnames":["CollectionMethodChargeAutomatically","CollectionMethodSendInvoice"]},"commitment_amount":{"type":"string","description":"CommitmentAmount is the minimum amount a customer commits to paying for a billing period"},"coupons":{"type":"array","items":{"type":"string"}},"credit_grants":{"type":"array","description":"Credit grants to be applied when subscription is created","items":{"required":["cadence","credits","name","scope"],"type":"object","properties":{"cadence":{"type":"string","enum":["ONETIME","RECURRING"],"x-enum-varnames":["CreditGrantCadenceOneTime","CreditGrantCadenceRecurring"]},"conversion_rate":{"type":"string","description":"amount in the currency =  number of credits * conversion_rate\nex if conversion_rate is 1, then 1 USD = 1 credit\nex if conversion_rate is 2, then 1 USD = 0.5 credits\nex if conversion_rate is 0.5, then 1 USD = 2 credits"},"credits":{"type":"string"},"expiration_duration":{"type":"number"},"expiration_duration_unit":{"type":"string","enum":["DAY","WEEK","MONTH","YEAR"],"x-enum-varnames":["CreditGrantExpiryDurationUnitDays","CreditGrantExpiryDurationUnitWeeks","CreditGrantExpiryDurationUnitMonths","CreditGrantExpiryDurationUnitYears"]},"expiration_type":{"type":"string","enum":["NEVER","DURATION","BILLING_CYCLE"],"x-enum-varnames":["CreditGrantExpiryTypeNever","CreditGrantExpiryTypeDuration","CreditGrantExpiryTypeBillingCycle"]},"metadata":{"type":"object","additionalProperties":{"type":"string"}},"name":{"type":"string"},"period":{"type":"string","enum":["DAILY","WEEKLY","MONTHLY","ANNUAL","QUARTERLY","HALF_YEARLY"],"x-enum-varnames":["CREDIT_GRANT_PERIOD_DAILY","CREDIT_GRANT_PERIOD_WEEKLY","CREDIT_GRANT_PERIOD_MONTHLY","CREDIT_GRANT_PERIOD_ANNUAL","CREDIT_GRANT_PERIOD_QUARTER","CREDIT_GRANT_PERIOD_HALF_YEARLY"]},"period_count":{"type":"number"},"plan_id":{"type":"string"},"priority":{"type":"number"},"scope":{"type":"string","enum":["PLAN","SUBSCRIPTION"],"x-enum-varnames":["CreditGrantScopePlan","CreditGrantScopeSubscription"]},"subscription_id":{"type":"string"},"topup_conversion_rate":{"type":"string","description":"topup_conversion_rate is the conversion rate for the topup to the currency\nex if topup_conversion_rate is 1, then 1 USD = 1 credit\nex if topup_conversion_rate is 2, then 1 USD = 0.5 credits\nex if topup_conversion_rate is 0.5, then 1 USD = 2 credits"}}}},"currency":{"type":"string"},"customer_id":{"type":"string","description":"customer_id is the flexprice customer id\nand it is prioritized over external_customer_id in case both are provided."},"customer_timezone":{"type":"string","description":"Timezone of the customer.\nIf not set, the default value is UTC."},"enable_true_up":{"type":"boolean","description":"Enable Commitment True Up Fee"},"end_date":{"type":"string"},"external_customer_id":{"type":"string","description":"external_customer_id is the customer id in your DB\nand must be same as what you provided as external_id while creating the customer in flexprice."},"gateway_payment_method_id":{"type":"string"},"invoice_billing":{"type":"string","enum":["invoice_to_parent","invoice_to_self"],"x-enum-varnames":["InvoiceBillingInvoiceToParent","InvoiceBillingInvoiceToSelf"]},"line_item_commitments":{"type":"object","additionalProperties":{"type":"object","properties":{"commitment_amount":{"type":"number","description":"CommitmentAmount is the minimum amount committed for this line item"},"commitment_quantity":{"type":"number","description":"CommitmentQuantity is the minimum quantity committed for this line item"},"commitment_type":{"type":"string","enum":["amount","quantity"],"x-enum-varnames":["COMMITMENT_TYPE_AMOUNT","COMMITMENT_TYPE_QUANTITY"]},"enable_true_up":{"type":"boolean","description":"EnableTrueUp determines if true-up fee should be applied when usage is below commitment"},"is_window_commitment":{"type":"boolean","description":"IsWindowCommitment determines if commitment is applied per window (e.g., per day) rather than per billing period"},"overage_factor":{"type":"number","description":"OverageFactor is a multiplier applied to usage beyond the commitment"}}},"description":"LineItemCommitments allows setting commitment configuration per line item (keyed by price_id)"},"line_item_coupons":{"type":"object","additionalProperties":{"type":"array","items":{"type":"string"}}},"lookup_key":{"type":"string"},"metadata":{"type":"object","additionalProperties":{"type":"string"}},"overage_factor":{"type":"string","description":"OverageFactor is a multiplier applied to usage beyond the commitment amount"},"override_entitlements":{"type":"array","description":"OverrideEntitlements allows customizing specific entitlements for this subscription","items":{"required":["entitlement_id"],"type":"object","properties":{"entitlement_id":{"type":"string","description":"EntitlementID references the plan/addon entitlement to override"},"is_enabled":{"type":"boolean","description":"IsEnabled determines if the entitlement is enabled or disabled"},"static_value":{"type":"string","description":"StaticValue is the static value for static features"},"usage_limit":{"type":"number","description":"UsageLimit is the new usage limit (only these 3 fields can be overridden)\nFor metered features, nil means unlimited usage"}}}},"override_line_items":{"type":"array","description":"OverrideLineItems allows customizing specific prices for this subscription","items":{"required":["price_id"],"type":"object","properties":{"amount":{"type":"string","description":"Amount is the new price amount that overrides the original price (optional)"},"billing_model":{"type":"string","enum":["FLAT_FEE","PACKAGE","TIERED"],"x-enum-varnames":["BILLING_MODEL_FLAT_FEE","BILLING_MODEL_PACKAGE","BILLING_MODEL_TIERED"]},"price_id":{"type":"string","description":"PriceID references the plan price to override"},"price_unit_amount":{"type":"string","description":"PriceUnitAmount is the amount of the price unit (for CUSTOM type, FLAT_FEE/PACKAGE billing models)"},"price_unit_tiers":{"type":"array","description":"PriceUnitTiers are the tiers for the price unit (for CUSTOM type, TIERED billing model)","items":{"required":["unit_amount"],"type":"object","properties":{"flat_amount":{"type":"string","description":"flat_amount is the flat amount for the given tier (optional)\nApplied on top of unit_amount*quantity. Useful for cases like \"2.7$ + 5c\""},"unit_amount":{"type":"string","description":"unit_amount is the amount per unit for the given tier"},"up_to":{"type":"number","description":"up_to is the quantity up to which this tier applies. It is null for the last tier.\nIMPORTANT: Tier boundaries are INCLUSIVE.\n- If up_to is 1000, then quantity less than or equal to 1000 belongs to this tier\n- This behavior is consistent across both VOLUME and SLAB tier modes"}}}},"quantity":{"type":"string","description":"Quantity for this line item (optional)"},"tier_mode":{"type":"string","enum":["VOLUME","SLAB"],"x-enum-varnames":["BILLING_TIER_VOLUME","BILLING_TIER_SLAB"]},"tiers":{"type":"array","description":"Tiers determines the pricing tiers for this line item","items":{"required":["unit_amount"],"type":"object","properties":{"flat_amount":{"type":"string","description":"flat_amount is the flat amount for the given tier (optional)\nApplied on top of unit_amount*quantity. Useful for cases like \"2.7$ + 5c\""},"unit_amount":{"type":"string","description":"unit_amount is the amount per unit for the given tier"},"up_to":{"type":"number","description":"up_to is the quantity up to which this tier applies. It is null for the last tier.\nIMPORTANT: Tier boundaries are INCLUSIVE.\n- If up_to is 1000, then quantity less than or equal to 1000 belongs to this tier\n- This behavior is consistent across both VOLUME and SLAB tier modes"}}}},"transform_quantity":{"type":"object","properties":{"divide_by":{"type":"number","description":"Divide quantity by this number"},"round":{"type":"string","enum":["up","down"],"x-enum-varnames":["ROUND_UP","ROUND_DOWN"]}}}}}},"payment_behavior":{"type":"string","enum":["allow_incomplete","default_incomplete","error_if_incomplete","default_active"],"x-enum-varnames":["PaymentBehaviorAllowIncomplete","PaymentBehaviorDefaultIncomplete","PaymentBehaviorErrorIfIncomplete","PaymentBehaviorDefaultActive"]},"phases":{"type":"array","description":"Phases represents subscription phases to be created with the subscription","items":{"required":["start_date"],"type":"object","properties":{"coupons":{"type":"array","description":"Coupons represents subscription-level coupons to be applied to this phase","items":{"type":"string"}},"end_date":{"type":"string"},"line_item_coupons":{"type":"object","additionalProperties":{"type":"array","items":{"type":"string"}},"description":"LineItemCoupons represents line item-level coupons (map of line_item_id to coupon IDs)"},"metadata":{"type":"object","additionalProperties":{"type":"string"}},"override_line_items":{"type":"array","description":"OverrideLineItems allows customizing specific prices for this phase\nIf not provided, phase will use the same line items as the subscription (plan prices)","items":{"required":["price_id"],"type":"object","properties":{"amount":{"type":"string","description":"Amount is the new price amount that overrides the original price (optional)"},"billing_model":{"type":"string","enum":["FLAT_FEE","PACKAGE","TIERED"],"x-enum-varnames":["BILLING_MODEL_FLAT_FEE","BILLING_MODEL_PACKAGE","BILLING_MODEL_TIERED"]},"price_id":{"type":"string","description":"PriceID references the plan price to override"},"price_unit_amount":{"type":"string","description":"PriceUnitAmount is the amount of the price unit (for CUSTOM type, FLAT_FEE/PACKAGE billing models)"},"price_unit_tiers":{"type":"array","description":"PriceUnitTiers are the tiers for the price unit (for CUSTOM type, TIERED billing model)","items":{"required":["unit_amount"],"type":"object","properties":{"flat_amount":{"type":"string","description":"flat_amount is the flat amount for the given tier (optional)\nApplied on top of unit_amount*quantity. Useful for cases like \"2.7$ + 5c\""},"unit_amount":{"type":"string","description":"unit_amount is the amount per unit for the given tier"},"up_to":{"type":"number","description":"up_to is the quantity up to which this tier applies. It is null for the last tier.\nIMPORTANT: Tier boundaries are INCLUSIVE.\n- If up_to is 1000, then quantity less than or equal to 1000 belongs to this tier\n- This behavior is consistent across both VOLUME and SLAB tier modes"}}}},"quantity":{"type":"string","description":"Quantity for this line item (optional)"},"tier_mode":{"type":"string","enum":["VOLUME","SLAB"],"x-enum-varnames":["BILLING_TIER_VOLUME","BILLING_TIER_SLAB"]},"tiers":{"type":"array","description":"Tiers determines the pricing tiers for this line item","items":{"required":["unit_amount"],"type":"object","properties":{"flat_amount":{"type":"string","description":"flat_amount is the flat amount for the given tier (optional)\nApplied on top of unit_amount*quantity. Useful for cases like \"2.7$ + 5c\""},"unit_amount":{"type":"string","description":"unit_amount is the amount per unit for the given tier"},"up_to":{"type":"number","description":"up_to is the quantity up to which this tier applies. It is null for the last tier.\nIMPORTANT: Tier boundaries are INCLUSIVE.\n- If up_to is 1000, then quantity less than or equal to 1000 belongs to this tier\n- This behavior is consistent across both VOLUME and SLAB tier modes"}}}},"transform_quantity":{"type":"object","properties":{"divide_by":{"type":"number","description":"Divide quantity by this number"},"round":{"type":"string","enum":["up","down"],"x-enum-varnames":["ROUND_UP","ROUND_DOWN"]}}}}}},"start_date":{"type":"string"}}}},"plan_id":{"type":"string"},"proration_behavior":{"type":"string","enum":["create_prorations","none"],"x-enum-comments":{"ProrationBehaviorCreateProrations":"Default: Create credits/charges on invoice","ProrationBehaviorNone":"Calculate but don't apply (e.g., for previews)"},"x-enum-descriptions":["Default: Create credits/charges on invoice","Calculate but don't apply (e.g., for previews)"],"x-enum-varnames":["ProrationBehaviorCreateProrations","ProrationBehaviorNone"]},"start_date":{"type":"string"},"subscription_status":{"type":"string","enum":["active","paused","cancelled","incomplete","trialing","draft"],"x-enum-varnames":["SubscriptionStatusActive","SubscriptionStatusPaused","SubscriptionStatusCancelled","SubscriptionStatusIncomplete","SubscriptionStatusTrialing","SubscriptionStatusDraft"]},"tax_rate_overrides":{"type":"array","description":"tax_rate_overrides is the tax rate overrides\tto be applied to the subscription","items":{"required":["currency","tax_rate_code"],"type":"object","properties":{"auto_apply":{"type":"boolean","default":true},"currency":{"type":"string"},"metadata":{"type":"object","additionalProperties":{"type":"string"}},"priority":{"type":"number"},"tax_rate_code":{"type":"string"}}}},"trial_end":{"type":"string"},"trial_start":{"type":"string"}},"description":"Subscription Request"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/subscriptions",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostSubscriptionsAddon", {
    name: "PostSubscriptionsAddon",
    description: `Add an addon to a subscription`,
    inputSchema: {"type":"object","properties":{"requestBody":{"required":["addon_id","subscription_id"],"type":"object","properties":{"addon_id":{"type":"string"},"line_item_commitments":{"type":"object","additionalProperties":{"type":"object","properties":{"commitment_amount":{"type":"number","description":"CommitmentAmount is the minimum amount committed for this line item"},"commitment_quantity":{"type":"number","description":"CommitmentQuantity is the minimum quantity committed for this line item"},"commitment_type":{"type":"string","enum":["amount","quantity"],"x-enum-varnames":["COMMITMENT_TYPE_AMOUNT","COMMITMENT_TYPE_QUANTITY"]},"enable_true_up":{"type":"boolean","description":"EnableTrueUp determines if true-up fee should be applied when usage is below commitment"},"is_window_commitment":{"type":"boolean","description":"IsWindowCommitment determines if commitment is applied per window (e.g., per day) rather than per billing period"},"overage_factor":{"type":"number","description":"OverageFactor is a multiplier applied to usage beyond the commitment"}}},"description":"LineItemCommitments allows setting commitment configuration per addon line item (keyed by price_id)"},"metadata":{"type":"object","additionalProperties":true},"start_date":{"type":"string"},"subscription_id":{"type":"string"}},"description":"Add Addon Request"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/subscriptions/addon",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["DeleteSubscriptionsAddon", {
    name: "DeleteSubscriptionsAddon",
    description: `Remove an addon from a subscription`,
    inputSchema: {"type":"object","properties":{"requestBody":{"required":["addon_association_id"],"type":"object","properties":{"addon_association_id":{"type":"string"},"reason":{"type":"string"}},"description":"Remove Addon Request"}},"required":["requestBody"]},
    method: "delete",
    pathTemplate: "/subscriptions/addon",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PutSubscriptionsLineitemsById", {
    name: "PutSubscriptionsLineitemsById",
    description: `Update a subscription line item by terminating the existing one and creating a new one`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Line Item ID"},"requestBody":{"type":"object","properties":{"amount":{"type":"string","description":"Amount is the new price amount that overrides the original price"},"billing_model":{"type":"string","enum":["FLAT_FEE","PACKAGE","TIERED"],"x-enum-varnames":["BILLING_MODEL_FLAT_FEE","BILLING_MODEL_PACKAGE","BILLING_MODEL_TIERED"]},"commitment_amount":{"type":"number","description":"Commitment fields"},"commitment_overage_factor":{"type":"number"},"commitment_quantity":{"type":"number"},"commitment_true_up_enabled":{"type":"boolean"},"commitment_type":{"type":"string","enum":["amount","quantity"],"x-enum-varnames":["COMMITMENT_TYPE_AMOUNT","COMMITMENT_TYPE_QUANTITY"]},"commitment_windowed":{"type":"boolean"},"effective_from":{"type":"string","description":"EffectiveFrom for the existing line item (if not provided, defaults to now)"},"metadata":{"type":"object","additionalProperties":{"type":"string"},"description":"Metadata for the new line item"},"tier_mode":{"type":"string","enum":["VOLUME","SLAB"],"x-enum-varnames":["BILLING_TIER_VOLUME","BILLING_TIER_SLAB"]},"tiers":{"type":"array","description":"Tiers determines the pricing tiers for this line item","items":{"required":["unit_amount"],"type":"object","properties":{"flat_amount":{"type":"string","description":"flat_amount is the flat amount for the given tier (optional)\nApplied on top of unit_amount*quantity. Useful for cases like \"2.7$ + 5c\""},"unit_amount":{"type":"string","description":"unit_amount is the amount per unit for the given tier"},"up_to":{"type":"number","description":"up_to is the quantity up to which this tier applies. It is null for the last tier.\nIMPORTANT: Tier boundaries are INCLUSIVE.\n- If up_to is 1000, then quantity less than or equal to 1000 belongs to this tier\n- This behavior is consistent across both VOLUME and SLAB tier modes"}}}},"transform_quantity":{"type":"object","properties":{"divide_by":{"type":"number","description":"Divide quantity by this number"},"round":{"type":"string","enum":["up","down"],"x-enum-varnames":["ROUND_UP","ROUND_DOWN"]}}}},"description":"Update Line Item Request"}},"required":["id","requestBody"]},
    method: "put",
    pathTemplate: "/subscriptions/lineitems/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["DeleteSubscriptionsLineitemsById", {
    name: "DeleteSubscriptionsLineitemsById",
    description: `Delete a subscription line item by setting its end date`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Line Item ID"},"requestBody":{"type":"object","properties":{"effective_from":{"type":"string"}},"description":"Delete Line Item Request"}},"required":["id","requestBody"]},
    method: "delete",
    pathTemplate: "/subscriptions/lineitems/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostSubscriptionsSearch", {
    name: "PostSubscriptionsSearch",
    description: `List subscriptions by filter`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"object","properties":{"active_at":{"type":"string","description":"ActiveAt filters subscriptions that are active at the given time"},"billing_cadence":{"type":"array","description":"BillingCadence filters by billing cadence","items":{"type":"string","enum":["RECURRING","ONETIME"],"x-enum-varnames":["BILLING_CADENCE_RECURRING","BILLING_CADENCE_ONETIME"]}},"billing_period":{"type":"array","description":"BillingPeriod filters by billing period","items":{"type":"string","enum":["MONTHLY","ANNUAL","WEEKLY","DAILY","QUARTERLY","HALF_YEARLY"],"x-enum-varnames":["BILLING_PERIOD_MONTHLY","BILLING_PERIOD_ANNUAL","BILLING_PERIOD_WEEKLY","BILLING_PERIOD_DAILY","BILLING_PERIOD_QUARTER","BILLING_PERIOD_HALF_YEAR"]}},"customer_id":{"type":"string","description":"CustomerID filters by customer ID"},"end_time":{"type":"string"},"expand":{"type":"string"},"external_customer_id":{"type":"string","description":"ExternalCustomerID filters by external customer ID"},"filters":{"type":"array","items":{"type":"object","properties":{"data_type":{"type":"string","enum":["string","number","date","array"],"x-enum-varnames":["DataTypeString","DataTypeNumber","DataTypeDate","DataTypeArray"]},"field":{"type":"string"},"operator":{"type":"string","enum":["eq","contains","not_contains","gt","lt","in","not_in","before","after"],"x-enum-varnames":["EQUAL","CONTAINS","NOT_CONTAINS","GREATER_THAN","LESS_THAN","IN","NOT_IN","BEFORE","AFTER"]},"value":{"type":"object","properties":{"array":{"type":"array","items":{"type":"string"}},"boolean":{"type":"boolean"},"date":{"type":"string"},"number":{"type":"number"},"string":{"type":"string"}}}}}},"invoicing_customer_ids":{"type":"array","description":"InvoicingCustomerIDs filters by invoicing customer ID","items":{"type":"string"}},"limit":{"maximum":1000,"minimum":1,"type":"number"},"offset":{"minimum":0,"type":"number"},"order":{"type":"string","enum":["asc","desc"]},"plan_id":{"type":"string","description":"PlanID filters by plan ID"},"sort":{"type":"array","items":{"type":"object","properties":{"direction":{"type":"string","enum":["asc","desc"],"x-enum-varnames":["SortDirectionAsc","SortDirectionDesc"]},"field":{"type":"string"}}}},"start_time":{"type":"string"},"status":{"type":"string","enum":["published","deleted","archived"],"x-enum-varnames":["StatusPublished","StatusDeleted","StatusArchived"]},"subscription_ids":{"type":"array","items":{"type":"string"}},"subscription_status":{"type":"array","description":"SubscriptionStatus filters by subscription status","items":{"type":"string","enum":["active","paused","cancelled","incomplete","trialing","draft"],"x-enum-varnames":["SubscriptionStatusActive","SubscriptionStatusPaused","SubscriptionStatusCancelled","SubscriptionStatusIncomplete","SubscriptionStatusTrialing","SubscriptionStatusDraft"]}},"with_line_items":{"type":"boolean","description":"WithLineItems includes line items in the response"}},"description":"Filter"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/subscriptions/search",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostSubscriptionsUsage", {
    name: "PostSubscriptionsUsage",
    description: `Get usage for a subscription`,
    inputSchema: {"type":"object","properties":{"requestBody":{"required":["subscription_id"],"type":"object","properties":{"end_time":{"type":"string"},"lifetime_usage":{"type":"boolean"},"start_time":{"type":"string"},"subscription_id":{"type":"string"}},"description":"Usage request"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/subscriptions/usage",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetSubscriptionsById", {
    name: "GetSubscriptionsById",
    description: `Get a subscription by ID`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Subscription ID"}},"required":["id"]},
    method: "get",
    pathTemplate: "/subscriptions/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostSubscriptionsActivate", {
    name: "PostSubscriptionsActivate",
    description: `Activate a draft subscription with a new start date`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Subscription ID"},"requestBody":{"required":["start_date"],"type":"object","properties":{"start_date":{"type":"string","description":"start_date is the new start date for the subscription when activating"}},"description":"Activate Draft Subscription Request"}},"required":["id","requestBody"]},
    method: "post",
    pathTemplate: "/subscriptions/{id}/activate",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetSubscriptionsAddonsAssociations", {
    name: "GetSubscriptionsAddonsAssociations",
    description: `Get active addon associations for a subscription`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Subscription ID"}},"required":["id"]},
    method: "get",
    pathTemplate: "/subscriptions/{id}/addons/associations",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostSubscriptionsCancel", {
    name: "PostSubscriptionsCancel",
    description: `Cancel a subscription with enhanced proration support`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Subscription ID"},"requestBody":{"required":["cancellation_type"],"type":"object","properties":{"cancellation_type":{"type":"string","enum":["immediate","end_of_period"],"x-enum-varnames":["CancellationTypeImmediate","CancellationTypeEndOfPeriod"]},"proration_behavior":{"type":"string","enum":["create_prorations","none"],"x-enum-comments":{"ProrationBehaviorCreateProrations":"Default: Create credits/charges on invoice","ProrationBehaviorNone":"Calculate but don't apply (e.g., for previews)"},"x-enum-descriptions":["Default: Create credits/charges on invoice","Calculate but don't apply (e.g., for previews)"],"x-enum-varnames":["ProrationBehaviorCreateProrations","ProrationBehaviorNone"]},"reason":{"type":"string","description":"Reason for cancellation (for audit and business intelligence)"}},"description":"Cancel Subscription Request"}},"required":["id","requestBody"]},
    method: "post",
    pathTemplate: "/subscriptions/{id}/cancel",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostSubscriptionsChangeExecute", {
    name: "PostSubscriptionsChangeExecute",
    description: `Execute a subscription plan change, including proration and invoice generation`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Subscription ID"},"requestBody":{"required":["billing_cadence","billing_cycle","billing_period","proration_behavior","target_plan_id"],"type":"object","properties":{"billing_cadence":{"type":"string","enum":["RECURRING","ONETIME"],"x-enum-varnames":["BILLING_CADENCE_RECURRING","BILLING_CADENCE_ONETIME"]},"billing_cycle":{"type":"string","enum":["anniversary","calendar"],"x-enum-varnames":["BillingCycleAnniversary","BillingCycleCalendar"]},"billing_period":{"type":"string","enum":["MONTHLY","ANNUAL","WEEKLY","DAILY","QUARTERLY","HALF_YEARLY"],"x-enum-varnames":["BILLING_PERIOD_MONTHLY","BILLING_PERIOD_ANNUAL","BILLING_PERIOD_WEEKLY","BILLING_PERIOD_DAILY","BILLING_PERIOD_QUARTER","BILLING_PERIOD_HALF_YEAR"]},"billing_period_count":{"type":"number","description":"billing_period_count is the billing period count for the new subscription"},"change_at":{"type":"string","enum":["immediate","end_of_period"],"x-enum-varnames":["ScheduleTypeImmediate","ScheduleTypePeriodEnd"]},"metadata":{"type":"object","additionalProperties":{"type":"string"},"description":"metadata contains additional key-value pairs for storing extra information"},"proration_behavior":{"type":"string","enum":["create_prorations","none"],"x-enum-comments":{"ProrationBehaviorCreateProrations":"Default: Create credits/charges on invoice","ProrationBehaviorNone":"Calculate but don't apply (e.g., for previews)"},"x-enum-descriptions":["Default: Create credits/charges on invoice","Calculate but don't apply (e.g., for previews)"],"x-enum-varnames":["ProrationBehaviorCreateProrations","ProrationBehaviorNone"]},"target_plan_id":{"type":"string","description":"target_plan_id is the ID of the new plan to change to (required)"}},"description":"Subscription change request"}},"required":["id","requestBody"]},
    method: "post",
    pathTemplate: "/subscriptions/{id}/change/execute",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostSubscriptionsChangePreview", {
    name: "PostSubscriptionsChangePreview",
    description: `Preview the impact of changing a subscription's plan, including proration calculations`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Subscription ID"},"requestBody":{"required":["billing_cadence","billing_cycle","billing_period","proration_behavior","target_plan_id"],"type":"object","properties":{"billing_cadence":{"type":"string","enum":["RECURRING","ONETIME"],"x-enum-varnames":["BILLING_CADENCE_RECURRING","BILLING_CADENCE_ONETIME"]},"billing_cycle":{"type":"string","enum":["anniversary","calendar"],"x-enum-varnames":["BillingCycleAnniversary","BillingCycleCalendar"]},"billing_period":{"type":"string","enum":["MONTHLY","ANNUAL","WEEKLY","DAILY","QUARTERLY","HALF_YEARLY"],"x-enum-varnames":["BILLING_PERIOD_MONTHLY","BILLING_PERIOD_ANNUAL","BILLING_PERIOD_WEEKLY","BILLING_PERIOD_DAILY","BILLING_PERIOD_QUARTER","BILLING_PERIOD_HALF_YEAR"]},"billing_period_count":{"type":"number","description":"billing_period_count is the billing period count for the new subscription"},"change_at":{"type":"string","enum":["immediate","end_of_period"],"x-enum-varnames":["ScheduleTypeImmediate","ScheduleTypePeriodEnd"]},"metadata":{"type":"object","additionalProperties":{"type":"string"},"description":"metadata contains additional key-value pairs for storing extra information"},"proration_behavior":{"type":"string","enum":["create_prorations","none"],"x-enum-comments":{"ProrationBehaviorCreateProrations":"Default: Create credits/charges on invoice","ProrationBehaviorNone":"Calculate but don't apply (e.g., for previews)"},"x-enum-descriptions":["Default: Create credits/charges on invoice","Calculate but don't apply (e.g., for previews)"],"x-enum-varnames":["ProrationBehaviorCreateProrations","ProrationBehaviorNone"]},"target_plan_id":{"type":"string","description":"target_plan_id is the ID of the new plan to change to (required)"}},"description":"Subscription change preview request"}},"required":["id","requestBody"]},
    method: "post",
    pathTemplate: "/subscriptions/{id}/change/preview",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetSubscriptionsEntitlements", {
    name: "GetSubscriptionsEntitlements",
    description: `Get all entitlements for a subscription`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Subscription ID"},"feature_ids":{"type":"array","items":{"type":"string"},"description":"Feature IDs to filter by"}},"required":["id"]},
    method: "get",
    pathTemplate: "/subscriptions/{id}/entitlements",
    executionParameters: [{"name":"id","in":"path"},{"name":"feature_ids","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetSubscriptionsGrantsUpcoming", {
    name: "GetSubscriptionsGrantsUpcoming",
    description: `Get upcoming credit grant applications for a subscription`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Subscription ID"}},"required":["id"]},
    method: "get",
    pathTemplate: "/subscriptions/{id}/grants/upcoming",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostSubscriptionsPause", {
    name: "PostSubscriptionsPause",
    description: `Pause a subscription with the specified parameters`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Subscription ID"},"requestBody":{"required":["pause_mode"],"type":"object","properties":{"dry_run":{"type":"boolean","description":"Whether to perform a dry run\n@Description If true, validates the request and shows impact without actually pausing the subscription\n@Example false"},"metadata":{"type":"object","additionalProperties":{"type":"string"},"description":"Additional metadata as key-value pairs\n@Description Optional metadata for storing additional information about the pause\n@Example {\"requested_by\": \"customer\", \"channel\": \"support_ticket\"}"},"pause_days":{"type":"number","description":"Duration of the pause in days\n@Description Number of days to pause the subscription. Cannot be used together with pause_end. Must be greater than 0\n@Example 30"},"pause_end":{"type":"string","description":"End date for the subscription pause\n@Description ISO 8601 timestamp when the pause should end. Cannot be used together with pause_days. Must be after pause_start\n@Example \"2024-02-15T00:00:00Z\""},"pause_mode":{"type":"string","enum":["immediate","scheduled","period_end"],"x-enum-varnames":["PauseModeImmediate","PauseModeScheduled","PauseModePeriodEnd"]},"pause_start":{"type":"string","description":"Start date for the subscription pause\n@Description ISO 8601 timestamp when the pause should begin. Required when pause_mode is \"scheduled\"\n@Example \"2024-01-15T00:00:00Z\""},"reason":{"maxLength":255,"type":"string","description":"Reason for pausing the subscription\n@Description Optional reason for the pause. Maximum 255 characters\n@Example \"Customer requested temporary suspension\""}},"description":"Pause subscription request"}},"required":["id","requestBody"]},
    method: "post",
    pathTemplate: "/subscriptions/{id}/pause",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetSubscriptionsPauses", {
    name: "GetSubscriptionsPauses",
    description: `List all pauses for a subscription`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Subscription ID"}},"required":["id"]},
    method: "get",
    pathTemplate: "/subscriptions/{id}/pauses",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: []
  }],
  ["PostSubscriptionsResume", {
    name: "PostSubscriptionsResume",
    description: `Resume a paused subscription with the specified parameters`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Subscription ID"},"requestBody":{"required":["resume_mode"],"type":"object","properties":{"dry_run":{"type":"boolean","description":"Whether to perform a dry run\n@Description If true, validates the request and shows impact without actually resuming the subscription\n@Example false"},"metadata":{"type":"object","additionalProperties":{"type":"string"},"description":"Additional metadata as key-value pairs\n@Description Optional metadata for storing additional information about the resume operation\n@Example {\"resumed_by\": \"admin\", \"reason\": \"issue_resolved\"}"},"resume_mode":{"type":"string","enum":["immediate","scheduled","auto"],"x-enum-varnames":["ResumeModeImmediate","ResumeModeScheduled","ResumeModeAuto"]}},"description":"Resume subscription request"}},"required":["id","requestBody"]},
    method: "post",
    pathTemplate: "/subscriptions/{id}/resume",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetSubscriptionsV2", {
    name: "GetSubscriptionsV2",
    description: `Get a subscription by ID with optional expand parameters`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Subscription ID"},"expand":{"type":"string","description":"Comma-separated list of fields to expand (e.g., 'subscription_line_items,prices,plan')"}},"required":["id"]},
    method: "get",
    pathTemplate: "/subscriptions/{id}/v2",
    executionParameters: [{"name":"id","in":"path"},{"name":"expand","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetTasks", {
    name: "GetTasks",
    description: `List tasks with optional filtering`,
    inputSchema: {"type":"object","properties":{"created_by":{"type":"string"},"end_time":{"type":"string"},"entity_type":{"type":"string","enum":["EVENTS","PRICES","CUSTOMERS","FEATURES"],"x-enum-varnames":["EntityTypeEvents","EntityTypePrices","EntityTypeCustomers","EntityTypeFeatures"]},"expand":{"type":"string"},"limit":{"maximum":1000,"minimum":1,"type":"number"},"offset":{"minimum":0,"type":"number"},"order":{"type":"string","enum":["asc","desc"]},"scheduled_task_id":{"type":"string"},"sort":{"type":"string"},"start_time":{"type":"string"},"status":{"type":"string","enum":["published","deleted","archived"],"x-enum-varnames":["StatusPublished","StatusDeleted","StatusArchived"]},"task_status":{"type":"string","enum":["PENDING","PROCESSING","COMPLETED","FAILED"],"x-enum-varnames":["TaskStatusPending","TaskStatusProcessing","TaskStatusCompleted","TaskStatusFailed"]},"task_type":{"type":"string","enum":["IMPORT","EXPORT"],"x-enum-varnames":["TaskTypeImport","TaskTypeExport"]}}},
    method: "get",
    pathTemplate: "/tasks",
    executionParameters: [{"name":"created_by","in":"query"},{"name":"end_time","in":"query"},{"name":"entity_type","in":"query"},{"name":"expand","in":"query"},{"name":"limit","in":"query"},{"name":"offset","in":"query"},{"name":"order","in":"query"},{"name":"scheduled_task_id","in":"query"},{"name":"sort","in":"query"},{"name":"start_time","in":"query"},{"name":"status","in":"query"},{"name":"task_status","in":"query"},{"name":"task_type","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostTasks", {
    name: "PostTasks",
    description: `Create a new task for processing files asynchronously`,
    inputSchema: {"type":"object","properties":{"requestBody":{"required":["entity_type","file_type","file_url","task_type"],"type":"object","properties":{"entity_type":{"type":"string","enum":["EVENTS","PRICES","CUSTOMERS","FEATURES"],"x-enum-varnames":["EntityTypeEvents","EntityTypePrices","EntityTypeCustomers","EntityTypeFeatures"]},"file_name":{"type":"string"},"file_type":{"type":"string","enum":["CSV","JSON"],"x-enum-varnames":["FileTypeCSV","FileTypeJSON"]},"file_url":{"type":"string"},"metadata":{"type":"object","additionalProperties":true},"task_type":{"type":"string","enum":["IMPORT","EXPORT"],"x-enum-varnames":["TaskTypeImport","TaskTypeExport"]}},"description":"Task configuration"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/tasks",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetTasksResult", {
    name: "GetTasksResult",
    description: `Get the result of a task processing workflow`,
    inputSchema: {"type":"object","properties":{"workflow_id":{"type":"string","description":"Workflow ID"}},"required":["workflow_id"]},
    method: "get",
    pathTemplate: "/tasks/result",
    executionParameters: [{"name":"workflow_id","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetTasksScheduled", {
    name: "GetTasksScheduled",
    description: `Get a list of scheduled tasks with optional filters`,
    inputSchema: {"type":"object","properties":{"limit":{"type":"number","description":"Limit"},"offset":{"type":"number","description":"Offset"},"connection_id":{"type":"string","description":"Filter by connection ID"},"entity_type":{"type":"string","description":"Filter by entity type"},"interval":{"type":"string","description":"Filter by interval"},"enabled":{"type":"boolean","description":"Filter by enabled status"}}},
    method: "get",
    pathTemplate: "/tasks/scheduled",
    executionParameters: [{"name":"limit","in":"query"},{"name":"offset","in":"query"},{"name":"connection_id","in":"query"},{"name":"entity_type","in":"query"},{"name":"interval","in":"query"},{"name":"enabled","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostTasksScheduled", {
    name: "PostTasksScheduled",
    description: `Create a new scheduled task for data export`,
    inputSchema: {"type":"object","properties":{"requestBody":{"required":["connection_id","entity_type","interval","job_config"],"type":"object","properties":{"connection_id":{"type":"string"},"enabled":{"type":"boolean"},"entity_type":{"type":"string","enum":["events","invoice","credit_topups","credit_usage"],"x-enum-varnames":["ScheduledTaskEntityTypeEvents","ScheduledTaskEntityTypeInvoice","ScheduledTaskEntityTypeCreditTopups","ScheduledTaskEntityTypeCreditUsage"]},"interval":{"type":"string","enum":["15MIN","custom","hourly","daily"],"x-enum-comments":{"ScheduledTaskIntervalCustom":"10 minutes for testing"},"x-enum-descriptions":["","10 minutes for testing","",""],"x-enum-varnames":["ScheduledTaskIntervalEvery15Minutes","ScheduledTaskIntervalCustom","ScheduledTaskIntervalHourly","ScheduledTaskIntervalDaily"]},"job_config":{"type":"object","properties":{"bucket":{"type":"string","description":"S3 bucket name"},"compression":{"type":"string","enum":["none","gzip"],"x-enum-varnames":["S3CompressionTypeNone","S3CompressionTypeGzip"]},"encryption":{"type":"string","enum":["AES256","aws:kms","aws:kms:dsse"],"x-enum-varnames":["S3EncryptionTypeAES256","S3EncryptionTypeAwsKms","S3EncryptionTypeAwsKmsDsse"]},"endpoint_url":{"type":"string","description":"Custom S3 endpoint URL (e.g., \"http://minio:9000\" for MinIO)"},"key_prefix":{"type":"string","description":"Optional prefix for S3 keys (e.g., \"flexprice-exports/\")"},"region":{"type":"string","description":"AWS region (e.g., \"us-west-2\")"},"use_path_style":{"type":"boolean","description":"Use path-style addressing instead of virtual-hosted-style (required for MinIO)"}}}},"description":"Scheduled Task"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/tasks/scheduled",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostTasksScheduledScheduleUpdateBillingPeriod", {
    name: "PostTasksScheduledScheduleUpdateBillingPeriod",
    description: `Schedule an update billing period workflow`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"object","description":"Schedule Update Billing Period Request"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/tasks/scheduled/schedule-update-billing-period",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetTasksScheduledById", {
    name: "GetTasksScheduledById",
    description: `Get a scheduled task by ID`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Scheduled Task ID"}},"required":["id"]},
    method: "get",
    pathTemplate: "/tasks/scheduled/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PutTasksScheduledById", {
    name: "PutTasksScheduledById",
    description: `Update a scheduled task by ID - Only enabled field can be changed (pause/resume)`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Scheduled Task ID"},"requestBody":{"required":["enabled"],"type":"object","properties":{"enabled":{"type":"boolean"}},"description":"Update request (enabled: true/false to pause/resume)"}},"required":["id","requestBody"]},
    method: "put",
    pathTemplate: "/tasks/scheduled/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["DeleteTasksScheduledById", {
    name: "DeleteTasksScheduledById",
    description: `Archive a scheduled task by ID (soft delete) - Sets status to archived and deletes from Temporal`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Scheduled Task ID"}},"required":["id"]},
    method: "delete",
    pathTemplate: "/tasks/scheduled/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostTasksScheduledRun", {
    name: "PostTasksScheduledRun",
    description: `Trigger a force run export immediately for a scheduled task with optional custom time range`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Scheduled Task ID"},"requestBody":{"type":"object","properties":{"end_time":{"type":"string"},"start_time":{"type":"string"}},"description":"Optional start and end time for custom range"}},"required":["id"]},
    method: "post",
    pathTemplate: "/tasks/scheduled/{id}/run",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetTasksById", {
    name: "GetTasksById",
    description: `Get a task by ID`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Task ID"}},"required":["id"]},
    method: "get",
    pathTemplate: "/tasks/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetTasksDownload", {
    name: "GetTasksDownload",
    description: `Generate a presigned URL for downloading an exported file (supports both Flexprice-managed and customer-owned S3)`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Task ID"}},"required":["id"]},
    method: "get",
    pathTemplate: "/tasks/{id}/download",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PutTasksStatus", {
    name: "PutTasksStatus",
    description: `Update a task's status`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Task ID"},"requestBody":{"required":["task_status"],"type":"object","properties":{"task_status":{"type":"string","enum":["PENDING","PROCESSING","COMPLETED","FAILED"],"x-enum-varnames":["TaskStatusPending","TaskStatusProcessing","TaskStatusCompleted","TaskStatusFailed"]}},"description":"Status update"}},"required":["id","requestBody"]},
    method: "put",
    pathTemplate: "/tasks/{id}/status",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetTaxesAssociations", {
    name: "GetTaxesAssociations",
    description: `List tax associations`,
    inputSchema: {"type":"object","properties":{"entity_type":{"type":"string","description":"Entity Type"},"entity_id":{"type":"string","description":"Entity ID"},"tax_rate_id":{"type":"string","description":"Tax Rate ID"}}},
    method: "get",
    pathTemplate: "/taxes/associations",
    executionParameters: [{"name":"entity_type","in":"query"},{"name":"entity_id","in":"query"},{"name":"tax_rate_id","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostTaxesAssociations", {
    name: "PostTaxesAssociations",
    description: `Create a new tax association`,
    inputSchema: {"type":"object","properties":{"requestBody":{"required":["entity_id","entity_type","tax_rate_code"],"type":"object","properties":{"auto_apply":{"type":"boolean"},"currency":{"type":"string"},"entity_id":{"type":"string"},"entity_type":{"type":"string","enum":["customer","subscription","invoice","tenant"],"x-enum-varnames":["TaxRateEntityTypeCustomer","TaxRateEntityTypeSubscription","TaxRateEntityTypeInvoice","TaxRateEntityTypeTenant"]},"metadata":{"type":"object","additionalProperties":{"type":"string"}},"priority":{"type":"number"},"tax_rate_code":{"type":"string"}},"description":"Tax Config Request"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/taxes/associations",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetTaxesAssociationsById", {
    name: "GetTaxesAssociationsById",
    description: `Get a tax association by ID`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Tax Config ID"}},"required":["id"]},
    method: "get",
    pathTemplate: "/taxes/associations/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PutTaxesAssociationsById", {
    name: "PutTaxesAssociationsById",
    description: `Update a tax association by ID`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Tax Config ID"},"requestBody":{"type":"object","properties":{"auto_apply":{"type":"boolean"},"metadata":{"type":"object","additionalProperties":{"type":"string"}},"priority":{"type":"number"}},"description":"Tax Config Request"}},"required":["id","requestBody"]},
    method: "put",
    pathTemplate: "/taxes/associations/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["DeleteTaxesAssociationsById", {
    name: "DeleteTaxesAssociationsById",
    description: `Delete a tax association by ID`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Tax Config ID"}},"required":["id"]},
    method: "delete",
    pathTemplate: "/taxes/associations/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetTaxesRates", {
    name: "GetTaxesRates",
    description: `Get tax rates`,
    inputSchema: {"type":"object","properties":{"end_time":{"type":"string"},"expand":{"type":"string"},"limit":{"maximum":1000,"minimum":1,"type":"number"},"offset":{"minimum":0,"type":"number"},"order":{"type":"string","enum":["asc","desc"]},"scope":{"type":"string","enum":["INTERNAL","EXTERNAL","ONETIME"],"x-enum-varnames":["TaxRateScopeInternal","TaxRateScopeExternal","TaxRateScopeOneTime"]},"start_time":{"type":"string"},"status":{"type":"string","enum":["published","deleted","archived"],"x-enum-varnames":["StatusPublished","StatusDeleted","StatusArchived"]},"taxrate_codes":{"type":"array","items":{"type":"string"}},"taxrate_ids":{"type":"array","items":{"type":"string"}}}},
    method: "get",
    pathTemplate: "/taxes/rates",
    executionParameters: [{"name":"end_time","in":"query"},{"name":"expand","in":"query"},{"name":"limit","in":"query"},{"name":"offset","in":"query"},{"name":"order","in":"query"},{"name":"scope","in":"query"},{"name":"start_time","in":"query"},{"name":"status","in":"query"},{"name":"taxrate_codes","in":"query"},{"name":"taxrate_ids","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostTaxesRates", {
    name: "PostTaxesRates",
    description: `Create a tax rate`,
    inputSchema: {"type":"object","properties":{"requestBody":{"required":["code","name"],"type":"object","properties":{"code":{"type":"string","description":"code is the unique alphanumeric case sensitive identifier for the tax rate (required)"},"description":{"type":"string","description":"description is an optional text description providing details about the tax rate"},"fixed_value":{"type":"string","description":"fixed_value is the fixed monetary amount when tax_rate_type is \"fixed\""},"metadata":{"type":"object","additionalProperties":{"type":"string"},"description":"metadata contains additional key-value pairs for storing extra information"},"name":{"type":"string","description":"name is the human-readable name for the tax rate (required)"},"percentage_value":{"type":"string","description":"percentage_value is the percentage value (0-100) when tax_rate_type is \"percentage\""},"scope":{"type":"string","enum":["INTERNAL","EXTERNAL","ONETIME"],"x-enum-varnames":["TaxRateScopeInternal","TaxRateScopeExternal","TaxRateScopeOneTime"]},"tax_rate_type":{"type":"string","enum":["percentage","fixed"],"x-enum-varnames":["TaxRateTypePercentage","TaxRateTypeFixed"]}},"description":"Tax rate to create"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/taxes/rates",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetTaxesRatesById", {
    name: "GetTaxesRatesById",
    description: `Get a tax rate`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Tax rate ID"}},"required":["id"]},
    method: "get",
    pathTemplate: "/taxes/rates/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PutTaxesRatesById", {
    name: "PutTaxesRatesById",
    description: `Update a tax rate`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Tax rate ID"},"requestBody":{"type":"object","properties":{"code":{"type":"string","description":"code is the updated unique alphanumeric identifier for the tax rate"},"description":{"type":"string","description":"description is the updated text description for the tax rate"},"metadata":{"type":"object","additionalProperties":{"type":"string"},"description":"metadata contains updated key-value pairs that will replace existing metadata"},"name":{"type":"string","description":"name is the updated human-readable name for the tax rate"},"tax_rate_status":{"type":"string","enum":["ACTIVE","INACTIVE"],"x-enum-varnames":["TaxRateStatusActive","TaxRateStatusInactive"]}},"description":"Tax rate to update"}},"required":["id","requestBody"]},
    method: "put",
    pathTemplate: "/taxes/rates/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["DeleteTaxesRatesById", {
    name: "DeleteTaxesRatesById",
    description: `Delete a tax rate`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Tax rate ID"}},"required":["id"]},
    method: "delete",
    pathTemplate: "/taxes/rates/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetTenantBilling", {
    name: "GetTenantBilling",
    description: `Get the subscription and usage details for the current tenant`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/tenant/billing",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostTenants", {
    name: "PostTenants",
    description: `Create a new tenant`,
    inputSchema: {"type":"object","properties":{"requestBody":{"required":["name"],"type":"object","properties":{"billing_details":{"type":"object","properties":{"address":{"type":"object","properties":{"address_city":{"maxLength":100,"type":"string"},"address_country":{"type":"string"},"address_line1":{"maxLength":255,"type":"string"},"address_line2":{"maxLength":255,"type":"string"},"address_postal_code":{"maxLength":20,"type":"string"},"address_state":{"maxLength":100,"type":"string"}}},"email":{"type":"string"},"help_email":{"type":"string"},"phone":{"type":"string"}}},"name":{"type":"string"}},"description":"Create tenant request"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/tenants",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PutTenantsUpdate", {
    name: "PutTenantsUpdate",
    description: `Update a tenant's details including name and billing information`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"object","properties":{"billing_details":{"type":"object","properties":{"address":{"type":"object","properties":{"address_city":{"maxLength":100,"type":"string"},"address_country":{"type":"string"},"address_line1":{"maxLength":255,"type":"string"},"address_line2":{"maxLength":255,"type":"string"},"address_postal_code":{"maxLength":20,"type":"string"},"address_state":{"maxLength":100,"type":"string"}}},"email":{"type":"string"},"help_email":{"type":"string"},"phone":{"type":"string"}}},"metadata":{"type":"object","additionalProperties":{"type":"string"}},"name":{"type":"string"}},"description":"Update tenant request"}},"required":["requestBody"]},
    method: "put",
    pathTemplate: "/tenants/update",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetTenantsById", {
    name: "GetTenantsById",
    description: `Get tenant by ID`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Tenant ID"}},"required":["id"]},
    method: "get",
    pathTemplate: "/tenants/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostUsers", {
    name: "PostUsers",
    description: `Create a new service account with required roles. Only service accounts can be created via this endpoint.`,
    inputSchema: {"type":"object","properties":{"requestBody":{"required":["roles","type"],"type":"object","properties":{"roles":{"minItems":1,"type":"array","description":"Roles are required","items":{"type":"string"}},"type":{"type":"string","enum":["user","service_account"],"x-enum-varnames":["UserTypeUser","UserTypeServiceAccount"]}},"description":"Create service account request (type must be 'service_account', roles are required)"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/users",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetUsersMe", {
    name: "GetUsersMe",
    description: `Get the current user's information`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/users/me",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostUsersSearch", {
    name: "PostUsersSearch",
    description: `Search and filter users by type (user/service_account), roles, etc.`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"object","properties":{"end_time":{"type":"string"},"expand":{"type":"string"},"filters":{"type":"array","description":"filters allows complex filtering based on multiple fields","items":{"type":"object","properties":{"data_type":{"type":"string","enum":["string","number","date","array"],"x-enum-varnames":["DataTypeString","DataTypeNumber","DataTypeDate","DataTypeArray"]},"field":{"type":"string"},"operator":{"type":"string","enum":["eq","contains","not_contains","gt","lt","in","not_in","before","after"],"x-enum-varnames":["EQUAL","CONTAINS","NOT_CONTAINS","GREATER_THAN","LESS_THAN","IN","NOT_IN","BEFORE","AFTER"]},"value":{"type":"object","properties":{"array":{"type":"array","items":{"type":"string"}},"boolean":{"type":"boolean"},"date":{"type":"string"},"number":{"type":"number"},"string":{"type":"string"}}}}}},"limit":{"maximum":1000,"minimum":1,"type":"number"},"offset":{"minimum":0,"type":"number"},"order":{"type":"string","enum":["asc","desc"]},"roles":{"type":"array","items":{"type":"string"}},"sort":{"type":"array","items":{"type":"object","properties":{"direction":{"type":"string","enum":["asc","desc"],"x-enum-varnames":["SortDirectionAsc","SortDirectionDesc"]},"field":{"type":"string"}}}},"start_time":{"type":"string"},"status":{"type":"string","enum":["published","deleted","archived"],"x-enum-varnames":["StatusPublished","StatusDeleted","StatusArchived"]},"type":{"type":"string","enum":["user","service_account"],"x-enum-varnames":["UserTypeUser","UserTypeServiceAccount"]},"user_ids":{"type":"array","description":"Specific filters for users","items":{"type":"string"}}},"description":"Filter parameters"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/users/search",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetV1SubscriptionSchedules", {
    name: "GetV1SubscriptionSchedules",
    description: `Retrieves subscription schedules with optional filtering`,
    inputSchema: {"type":"object","properties":{"pending_only":{"type":"boolean","description":"Filter to pending schedules only"},"subscription_id":{"type":"string","description":"Filter by subscription ID"},"limit":{"type":"number","description":"Limit results"},"offset":{"type":"number","description":"Offset for pagination"}}},
    method: "get",
    pathTemplate: "/v1/subscription-schedules",
    executionParameters: [{"name":"pending_only","in":"query"},{"name":"subscription_id","in":"query"},{"name":"limit","in":"query"},{"name":"offset","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: []
  }],
  ["GetV1SubscriptionSchedulesById", {
    name: "GetV1SubscriptionSchedulesById",
    description: `Retrieves details of a specific subscription schedule`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Schedule ID"}},"required":["id"]},
    method: "get",
    pathTemplate: "/v1/subscription-schedules/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: []
  }],
  ["PostV1SubscriptionsSchedulesCancel", {
    name: "PostV1SubscriptionsSchedulesCancel",
    description: `Cancels a pending subscription schedule. Supports two modes: 1) By schedule ID in path, or 2) By subscription ID + schedule type in request body`,
    inputSchema: {"type":"object","properties":{"schedule_id":{"type":"string","description":"Schedule ID (optional if using request body)"},"requestBody":{"type":"object","properties":{"schedule_id":{"type":"string","description":"schedule_id is the ID of the schedule to cancel (optional if subscription_id and schedule_type are provided)"},"schedule_type":{"type":"string","enum":["plan_change","cancellation"],"x-enum-varnames":["SubscriptionScheduleChangeTypePlanChange","SubscriptionScheduleChangeTypeCancellation"]},"subscription_id":{"type":"string","description":"subscription_id is the ID of the subscription (required if schedule_id is not provided)"}},"description":"Cancel request (optional if using path parameter)"}},"required":["schedule_id"]},
    method: "post",
    pathTemplate: "/v1/subscriptions/schedules/{schedule_id}/cancel",
    executionParameters: [{"name":"schedule_id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: []
  }],
  ["GetV1SubscriptionsSchedules", {
    name: "GetV1SubscriptionsSchedules",
    description: `Retrieves all schedules for a specific subscription`,
    inputSchema: {"type":"object","properties":{"subscription_id":{"type":"string","description":"Subscription ID"}},"required":["subscription_id"]},
    method: "get",
    pathTemplate: "/v1/subscriptions/{subscription_id}/schedules",
    executionParameters: [{"name":"subscription_id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: []
  }],
  ["GetWallets", {
    name: "GetWallets",
    description: `List wallets with optional filtering`,
    inputSchema: {"type":"object","properties":{"alert_enabled":{"type":"boolean"},"expand":{"type":"string","description":"Expand fields (e.g., credits_available_breakdown)"},"limit":{"maximum":1000,"minimum":1,"type":"number"},"offset":{"minimum":0,"type":"number"},"order":{"type":"string","enum":["asc","desc"]},"sort":{"type":"string"},"status":{"type":"string","enum":["active","frozen","closed"],"x-enum-varnames":["WalletStatusActive","WalletStatusFrozen","WalletStatusClosed"]},"wallet_ids":{"type":"array","items":{"type":"string"}}}},
    method: "get",
    pathTemplate: "/wallets",
    executionParameters: [{"name":"alert_enabled","in":"query"},{"name":"expand","in":"query"},{"name":"limit","in":"query"},{"name":"offset","in":"query"},{"name":"order","in":"query"},{"name":"sort","in":"query"},{"name":"status","in":"query"},{"name":"wallet_ids","in":"query"},{"name":"expand","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostWallets", {
    name: "PostWallets",
    description: `Create a new wallet for a customer`,
    inputSchema: {"type":"object","properties":{"requestBody":{"required":["currency"],"type":"object","properties":{"alert_config":{"type":"object","properties":{"threshold":{"type":"object","properties":{"type":{"type":"string","description":"amount"},"value":{"type":"string"}}}}},"alert_enabled":{"type":"boolean","description":"alert_enabled is the flag to enable alerts for the wallet\ndefaults to true, can be explicitly set to false to disable alerts"},"auto_topup":{"type":"object","properties":{"amount":{"type":"number"},"enabled":{"type":"boolean"},"invoicing":{"type":"boolean"},"threshold":{"type":"number"}}},"config":{"type":"object","properties":{"allowed_price_types":{"type":"array","description":"AllowedPriceTypes is a list of price types that are allowed for the wallet\nnil means all price types are allowed","items":{"type":"string","enum":["ALL","USAGE","FIXED"],"x-enum-varnames":["WalletConfigPriceTypeAll","WalletConfigPriceTypeUsage","WalletConfigPriceTypeFixed"]}}}},"conversion_rate":{"type":"string","description":"amount in the currency =  number of credits * conversion_rate\nex if conversion_rate is 1, then 1 USD = 1 credit\nex if conversion_rate is 2, then 1 USD = 0.5 credits\nex if conversion_rate is 0.5, then 1 USD = 2 credits","default":"1"},"currency":{"type":"string"},"customer_id":{"type":"string"},"description":{"type":"string"},"external_customer_id":{"type":"string","description":"external_customer_id is the customer id in the external system"},"initial_credits_expiry_date_utc":{"type":"string","description":"initial_credits_expiry_date_utc is the expiry date in UTC timezone (optional to set nil means no expiry)\nex 2025-01-01 00:00:00 UTC"},"initial_credits_to_load":{"type":"string","description":"initial_credits_to_load is the number of credits to load to the wallet\nif not provided, the wallet will be created with 0 balance\nNOTE: this is not the amount in the currency, but the number of credits","default":"0"},"initial_credits_to_load_expiry_date":{"type":"number","description":"initial_credits_to_load_expiry_date YYYYMMDD format in UTC timezone (optional to set nil means no expiry)\nfor ex 20250101 means the credits will expire on 2025-01-01 00:00:00 UTC\nhence they will be available for use until 2024-12-31 23:59:59 UTC"},"metadata":{"type":"object","additionalProperties":{"type":"string"}},"name":{"type":"string"},"price_unit":{"type":"string","description":"price_unit is the code of the price unit to use for wallet creation\nIf provided, the price unit will be used to set the currency and conversion rate of the wallet:\n- currency: set to price unit's base_currency\n- conversion_rate: set to price unit's conversion_rate"},"topup_conversion_rate":{"type":"string","description":"topup_conversion_rate is the conversion rate for the topup to the currency\nex if topup_conversion_rate is 1, then 1 USD = 1 credit\nex if topup_conversion_rate is 2, then 1 USD = 0.5 credits\nex if topup_conversion_rate is 0.5, then 1 USD = 2 credits"},"wallet_type":{"type":"string","enum":["PROMOTIONAL","PRE_PAID"],"x-enum-varnames":["WalletTypePromotional","WalletTypePrePaid"]}},"description":"Create wallet request"}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/wallets",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostWalletsSearch", {
    name: "PostWalletsSearch",
    description: `List wallets by filter`,
    inputSchema: {"type":"object","properties":{"requestBody":{"type":"object","properties":{"alert_enabled":{"type":"boolean"},"expand":{"type":"string"},"limit":{"maximum":1000,"minimum":1,"type":"number"},"offset":{"minimum":0,"type":"number"},"order":{"type":"string","enum":["asc","desc"]},"sort":{"type":"string"},"status":{"type":"string","enum":["active","frozen","closed"],"x-enum-varnames":["WalletStatusActive","WalletStatusFrozen","WalletStatusClosed"]},"wallet_ids":{"type":"array","items":{"type":"string"}}},"description":"Filter"}}},
    method: "post",
    pathTemplate: "/wallets/search",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostWalletsTransactionsSearch", {
    name: "PostWalletsTransactionsSearch",
    description: `List wallet transactions by filter`,
    inputSchema: {"type":"object","properties":{"expand":{"type":"string","description":"Expand fields (e.g., customer,created_by_user,wallet)"},"requestBody":{"type":"object","properties":{"created_by":{"type":"string"},"credits_available_gt":{"type":"number"},"end_time":{"type":"string"},"expand":{"type":"string"},"expiry_date_after":{"type":"string"},"expiry_date_before":{"type":"string"},"filters":{"type":"array","description":"filters allows complex filtering based on multiple fields","items":{"type":"object","properties":{"data_type":{"type":"string","enum":["string","number","date","array"],"x-enum-varnames":["DataTypeString","DataTypeNumber","DataTypeDate","DataTypeArray"]},"field":{"type":"string"},"operator":{"type":"string","enum":["eq","contains","not_contains","gt","lt","in","not_in","before","after"],"x-enum-varnames":["EQUAL","CONTAINS","NOT_CONTAINS","GREATER_THAN","LESS_THAN","IN","NOT_IN","BEFORE","AFTER"]},"value":{"type":"object","properties":{"array":{"type":"array","items":{"type":"string"}},"boolean":{"type":"boolean"},"date":{"type":"string"},"number":{"type":"number"},"string":{"type":"string"}}}}}},"id":{"type":"string"},"limit":{"maximum":1000,"minimum":1,"type":"number"},"offset":{"minimum":0,"type":"number"},"order":{"type":"string","enum":["asc","desc"]},"priority":{"type":"number"},"reference_id":{"type":"string"},"reference_type":{"type":"string"},"sort":{"type":"array","items":{"type":"object","properties":{"direction":{"type":"string","enum":["asc","desc"],"x-enum-varnames":["SortDirectionAsc","SortDirectionDesc"]},"field":{"type":"string"}}}},"start_time":{"type":"string"},"status":{"type":"string","enum":["published","deleted","archived"],"x-enum-varnames":["StatusPublished","StatusDeleted","StatusArchived"]},"transaction_reason":{"type":"string","enum":["INVOICE_PAYMENT","FREE_CREDIT_GRANT","SUBSCRIPTION_CREDIT_GRANT","PURCHASED_CREDIT_INVOICED","PURCHASED_CREDIT_DIRECT","CREDIT_NOTE","CREDIT_EXPIRED","WALLET_TERMINATION","MANUAL_BALANCE_DEBIT"],"x-enum-varnames":["TransactionReasonInvoicePayment","TransactionReasonFreeCredit","TransactionReasonSubscriptionCredit","TransactionReasonPurchasedCreditInvoiced","TransactionReasonPurchasedCreditDirect","TransactionReasonCreditNote","TransactionReasonCreditExpired","TransactionReasonWalletTermination","TransactionReasonManualBalanceDebit"]},"transaction_status":{"type":"string","enum":["pending","completed","failed"],"x-enum-varnames":["TransactionStatusPending","TransactionStatusCompleted","TransactionStatusFailed"]},"type":{"type":"string","enum":["credit","debit"],"x-enum-varnames":["TransactionTypeCredit","TransactionTypeDebit"]}},"description":"Filter"}}},
    method: "post",
    pathTemplate: "/wallets/transactions/search",
    executionParameters: [{"name":"expand","in":"query"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetWalletsById", {
    name: "GetWalletsById",
    description: `Get a wallet by its ID`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Wallet ID"}},"required":["id"]},
    method: "get",
    pathTemplate: "/wallets/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PutWalletsById", {
    name: "PutWalletsById",
    description: `Update a wallet's details including auto top-up configuration`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Wallet ID"},"requestBody":{"type":"object","properties":{"alert_config":{"type":"object","properties":{"threshold":{"type":"object","properties":{"type":{"type":"string","description":"amount"},"value":{"type":"string"}}}}},"alert_enabled":{"type":"boolean"},"auto_topup":{"type":"object","properties":{"amount":{"type":"number"},"enabled":{"type":"boolean"},"invoicing":{"type":"boolean"},"threshold":{"type":"number"}}},"config":{"type":"object","properties":{"allowed_price_types":{"type":"array","description":"AllowedPriceTypes is a list of price types that are allowed for the wallet\nnil means all price types are allowed","items":{"type":"string","enum":["ALL","USAGE","FIXED"],"x-enum-varnames":["WalletConfigPriceTypeAll","WalletConfigPriceTypeUsage","WalletConfigPriceTypeFixed"]}}}},"description":{"type":"string"},"metadata":{"type":"object","additionalProperties":{"type":"string"}},"name":{"type":"string"}},"description":"Update wallet request"}},"required":["id","requestBody"]},
    method: "put",
    pathTemplate: "/wallets/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetWalletsBalanceRealTime", {
    name: "GetWalletsBalanceRealTime",
    description: `Get real-time balance of a wallet`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Wallet ID"},"expand":{"type":"string","description":"Expand fields (e.g., credits_available_breakdown)"}},"required":["id"]},
    method: "get",
    pathTemplate: "/wallets/{id}/balance/real-time",
    executionParameters: [{"name":"id","in":"path"},{"name":"expand","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostWalletsTerminate", {
    name: "PostWalletsTerminate",
    description: `Terminates a wallet by closing it and debiting remaining balance`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Wallet ID"}},"required":["id"]},
    method: "post",
    pathTemplate: "/wallets/{id}/terminate",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostWalletsTopUp", {
    name: "PostWalletsTopUp",
    description: `Add credits to a wallet`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string","description":"Wallet ID"},"requestBody":{"required":["transaction_reason"],"type":"object","properties":{"amount":{"type":"string","description":"amount is the amount in the currency of the wallet to be added\nNOTE: this is not the number of credits to add, but the amount in the currency\namount = credits_to_add * conversion_rate\nif both amount and credits_to_add are provided, amount will be ignored\nex if the wallet has a conversion_rate of 2 then adding an amount of\n10 USD in the wallet wil add 5 credits in the wallet"},"credits_to_add":{"type":"string","description":"credits_to_add is the number of credits to add to the wallet"},"description":{"type":"string","description":"description to add any specific details about the transaction"},"expiry_date_utc":{"type":"string","description":"expiry_date_utc is the expiry date in UTC timezone\nex 2025-01-01 00:00:00 UTC"},"idempotency_key":{"type":"string","description":"idempotency_key is a unique key for the transaction"},"metadata":{"type":"object","additionalProperties":{"type":"string"}},"priority":{"type":"number","description":"priority is the priority of the transaction\nlower number means higher priority\ndefault is nil which means no priority at all"},"transaction_reason":{"type":"string","enum":["INVOICE_PAYMENT","FREE_CREDIT_GRANT","SUBSCRIPTION_CREDIT_GRANT","PURCHASED_CREDIT_INVOICED","PURCHASED_CREDIT_DIRECT","CREDIT_NOTE","CREDIT_EXPIRED","WALLET_TERMINATION","MANUAL_BALANCE_DEBIT"],"x-enum-varnames":["TransactionReasonInvoicePayment","TransactionReasonFreeCredit","TransactionReasonSubscriptionCredit","TransactionReasonPurchasedCreditInvoiced","TransactionReasonPurchasedCreditDirect","TransactionReasonCreditNote","TransactionReasonCreditExpired","TransactionReasonWalletTermination","TransactionReasonManualBalanceDebit"]}},"description":"Top up request"}},"required":["id","requestBody"]},
    method: "post",
    pathTemplate: "/wallets/{id}/top-up",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["GetWalletsTransactions", {
    name: "GetWalletsTransactions",
    description: `Get transactions for a wallet with pagination`,
    inputSchema: {"type":"object","properties":{"id":{"type":"string"},"created_by":{"type":"string"},"credits_available_gt":{"type":"number"},"end_time":{"type":"string"},"expand":{"type":"string"},"expiry_date_after":{"type":"string"},"expiry_date_before":{"type":"string"},"limit":{"maximum":1000,"minimum":1,"type":"number"},"offset":{"minimum":0,"type":"number"},"order":{"type":"string","enum":["asc","desc"]},"priority":{"type":"number"},"reference_id":{"type":"string"},"reference_type":{"type":"string"},"start_time":{"type":"string"},"status":{"type":"string","enum":["published","deleted","archived"],"x-enum-varnames":["StatusPublished","StatusDeleted","StatusArchived"]},"transaction_reason":{"type":"string","enum":["INVOICE_PAYMENT","FREE_CREDIT_GRANT","SUBSCRIPTION_CREDIT_GRANT","PURCHASED_CREDIT_INVOICED","PURCHASED_CREDIT_DIRECT","CREDIT_NOTE","CREDIT_EXPIRED","WALLET_TERMINATION","MANUAL_BALANCE_DEBIT"],"x-enum-varnames":["TransactionReasonInvoicePayment","TransactionReasonFreeCredit","TransactionReasonSubscriptionCredit","TransactionReasonPurchasedCreditInvoiced","TransactionReasonPurchasedCreditDirect","TransactionReasonCreditNote","TransactionReasonCreditExpired","TransactionReasonWalletTermination","TransactionReasonManualBalanceDebit"]},"transaction_status":{"type":"string","enum":["pending","completed","failed"],"x-enum-varnames":["TransactionStatusPending","TransactionStatusCompleted","TransactionStatusFailed"]},"type":{"type":"string","enum":["credit","debit"],"x-enum-varnames":["TransactionTypeCredit","TransactionTypeDebit"]}},"required":["id"]},
    method: "get",
    pathTemplate: "/wallets/{id}/transactions",
    executionParameters: [{"name":"id","in":"path"},{"name":"created_by","in":"query"},{"name":"credits_available_gt","in":"query"},{"name":"end_time","in":"query"},{"name":"expand","in":"query"},{"name":"expiry_date_after","in":"query"},{"name":"expiry_date_before","in":"query"},{"name":"id","in":"query"},{"name":"limit","in":"query"},{"name":"offset","in":"query"},{"name":"order","in":"query"},{"name":"priority","in":"query"},{"name":"reference_id","in":"query"},{"name":"reference_type","in":"query"},{"name":"start_time","in":"query"},{"name":"status","in":"query"},{"name":"transaction_reason","in":"query"},{"name":"transaction_status","in":"query"},{"name":"type","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"ApiKeyAuth":[]}]
  }],
  ["PostWebhooksChargebeeByEnvironmentId", {
    name: "PostWebhooksChargebeeByEnvironmentId",
    description: `Process incoming Chargebee webhook events for payment status updates`,
    inputSchema: {"type":"object","properties":{"tenant_id":{"type":"string","description":"Tenant ID"},"environment_id":{"type":"string","description":"Environment ID"},"Authorization":{"type":"string","description":"Basic Auth credentials"}},"required":["tenant_id","environment_id"]},
    method: "post",
    pathTemplate: "/webhooks/chargebee/{tenant_id}/{environment_id}",
    executionParameters: [{"name":"tenant_id","in":"path"},{"name":"environment_id","in":"path"},{"name":"Authorization","in":"header"}],
    requestBodyContentType: undefined,
    securityRequirements: []
  }],
  ["PostWebhooksHubspotByEnvironmentId", {
    name: "PostWebhooksHubspotByEnvironmentId",
    description: `Process incoming HubSpot webhook events for deal closed won and customer creation`,
    inputSchema: {"type":"object","properties":{"tenant_id":{"type":"string","description":"Tenant ID"},"environment_id":{"type":"string","description":"Environment ID"},"X-HubSpot-Signature-v3":{"type":"string","description":"HubSpot webhook signature"}},"required":["tenant_id","environment_id","X-HubSpot-Signature-v3"]},
    method: "post",
    pathTemplate: "/webhooks/hubspot/{tenant_id}/{environment_id}",
    executionParameters: [{"name":"tenant_id","in":"path"},{"name":"environment_id","in":"path"},{"name":"X-HubSpot-Signature-v3","in":"header"}],
    requestBodyContentType: undefined,
    securityRequirements: []
  }],
  ["PostWebhooksNomodByEnvironmentId", {
    name: "PostWebhooksNomodByEnvironmentId",
    description: `Process incoming Nomod webhook events for payment and invoice payments`,
    inputSchema: {"type":"object","properties":{"tenant_id":{"type":"string","description":"Tenant ID"},"environment_id":{"type":"string","description":"Environment ID"},"X-API-KEY":{"type":"string","description":"Nomod webhook secret (if configured)"}},"required":["tenant_id","environment_id"]},
    method: "post",
    pathTemplate: "/webhooks/nomod/{tenant_id}/{environment_id}",
    executionParameters: [{"name":"tenant_id","in":"path"},{"name":"environment_id","in":"path"},{"name":"X-API-KEY","in":"header"}],
    requestBodyContentType: undefined,
    securityRequirements: []
  }],
  ["PostWebhooksQuickbooksByEnvironmentId", {
    name: "PostWebhooksQuickbooksByEnvironmentId",
    description: `Process incoming QuickBooks webhook events for payment sync`,
    inputSchema: {"type":"object","properties":{"tenant_id":{"type":"string","description":"Tenant ID"},"environment_id":{"type":"string","description":"Environment ID"},"intuit-signature":{"type":"string","description":"QuickBooks webhook signature"}},"required":["tenant_id","environment_id"]},
    method: "post",
    pathTemplate: "/webhooks/quickbooks/{tenant_id}/{environment_id}",
    executionParameters: [{"name":"tenant_id","in":"path"},{"name":"environment_id","in":"path"},{"name":"intuit-signature","in":"header"}],
    requestBodyContentType: undefined,
    securityRequirements: []
  }],
  ["PostWebhooksRazorpayByEnvironmentId", {
    name: "PostWebhooksRazorpayByEnvironmentId",
    description: `Process incoming Razorpay webhook events for payment capture and failure`,
    inputSchema: {"type":"object","properties":{"tenant_id":{"type":"string","description":"Tenant ID"},"environment_id":{"type":"string","description":"Environment ID"},"X-Razorpay-Signature":{"type":"string","description":"Razorpay webhook signature"}},"required":["tenant_id","environment_id","X-Razorpay-Signature"]},
    method: "post",
    pathTemplate: "/webhooks/razorpay/{tenant_id}/{environment_id}",
    executionParameters: [{"name":"tenant_id","in":"path"},{"name":"environment_id","in":"path"},{"name":"X-Razorpay-Signature","in":"header"}],
    requestBodyContentType: undefined,
    securityRequirements: []
  }],
  ["PostWebhooksStripeByEnvironmentId", {
    name: "PostWebhooksStripeByEnvironmentId",
    description: `Process incoming Stripe webhook events for payment status updates and customer creation`,
    inputSchema: {"type":"object","properties":{"tenant_id":{"type":"string","description":"Tenant ID"},"environment_id":{"type":"string","description":"Environment ID"},"Stripe-Signature":{"type":"string","description":"Stripe webhook signature"}},"required":["tenant_id","environment_id","Stripe-Signature"]},
    method: "post",
    pathTemplate: "/webhooks/stripe/{tenant_id}/{environment_id}",
    executionParameters: [{"name":"tenant_id","in":"path"},{"name":"environment_id","in":"path"},{"name":"Stripe-Signature","in":"header"}],
    requestBodyContentType: undefined,
    securityRequirements: []
  }],
]);

/**
 * Security schemes from the OpenAPI spec
 */
const securitySchemes =   {
    "ApiKeyAuth": {
      "type": "apiKey",
      "description": "Enter your API key in the format *x-api-key &lt;api-key&gt;**",
      "name": "x-api-key",
      "in": "header"
    }
  };


server.setRequestHandler(ListToolsRequestSchema, async () => {
  const toolsForClient: Tool[] = Array.from(toolDefinitionMap.values()).map(def => ({
    name: def.name,
    description: def.description,
    inputSchema: def.inputSchema
  }));
  return { tools: toolsForClient };
});


server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest): Promise<CallToolResult> => {
  const { name: toolName, arguments: toolArgs } = request.params;
  const toolDefinition = toolDefinitionMap.get(toolName);
  if (!toolDefinition) {
    console.error(`Error: Unknown tool requested: ${toolName}`);
    return { content: [{ type: "text", text: `Error: Unknown tool requested: ${toolName}` }] };
  }
  return await executeApiTool(toolName, toolDefinition, toolArgs ?? {}, securitySchemes);
});



/**
 * Type definition for cached OAuth tokens
 */
interface TokenCacheEntry {
    token: string;
    expiresAt: number;
}

/**
 * Declare global __oauthTokenCache property for TypeScript
 */
declare global {
    var __oauthTokenCache: Record<string, TokenCacheEntry> | undefined;
}

/**
 * Acquires an OAuth2 token using client credentials flow
 * 
 * @param schemeName Name of the security scheme
 * @param scheme OAuth2 security scheme
 * @returns Acquired token or null if unable to acquire
 */
async function acquireOAuth2Token(schemeName: string, scheme: any): Promise<string | null | undefined> {
    try {
        // Check if we have the necessary credentials
        const clientId = process.env[`OAUTH_CLIENT_ID_SCHEMENAME`];
        const clientSecret = process.env[`OAUTH_CLIENT_SECRET_SCHEMENAME`];
        const scopes = process.env[`OAUTH_SCOPES_SCHEMENAME`];
        
        if (!clientId || !clientSecret) {
            console.error(`Missing client credentials for OAuth2 scheme '${schemeName}'`);
            return null;
        }
        
        // Initialize token cache if needed
        if (typeof global.__oauthTokenCache === 'undefined') {
            global.__oauthTokenCache = {};
        }
        
        // Check if we have a cached token
        const cacheKey = `${schemeName}_${clientId}`;
        const cachedToken = global.__oauthTokenCache[cacheKey];
        const now = Date.now();
        
        if (cachedToken && cachedToken.expiresAt > now) {
            console.error(`Using cached OAuth2 token for '${schemeName}' (expires in ${Math.floor((cachedToken.expiresAt - now) / 1000)} seconds)`);
            return cachedToken.token;
        }
        
        // Determine token URL based on flow type
        let tokenUrl = '';
        if (scheme.flows?.clientCredentials?.tokenUrl) {
            tokenUrl = scheme.flows.clientCredentials.tokenUrl;
            console.error(`Using client credentials flow for '${schemeName}'`);
        } else if (scheme.flows?.password?.tokenUrl) {
            tokenUrl = scheme.flows.password.tokenUrl;
            console.error(`Using password flow for '${schemeName}'`);
        } else {
            console.error(`No supported OAuth2 flow found for '${schemeName}'`);
            return null;
        }
        
        // Prepare the token request
        let formData = new URLSearchParams();
        formData.append('grant_type', 'client_credentials');
        
        // Add scopes if specified
        if (scopes) {
            formData.append('scope', scopes);
        }
        
        console.error(`Requesting OAuth2 token from ${tokenUrl}`);
        
        // Make the token request
        const response = await axios({
            method: 'POST',
            url: tokenUrl,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
            },
            data: formData.toString()
        });
        
        // Process the response
        if (response.data?.access_token) {
            const token = response.data.access_token;
            const expiresIn = response.data.expires_in || 3600; // Default to 1 hour
            
            // Cache the token
            global.__oauthTokenCache[cacheKey] = {
                token,
                expiresAt: now + (expiresIn * 1000) - 60000 // Expire 1 minute early
            };
            
            console.error(`Successfully acquired OAuth2 token for '${schemeName}' (expires in ${expiresIn} seconds)`);
            return token;
        } else {
            console.error(`Failed to acquire OAuth2 token for '${schemeName}': No access_token in response`);
            return null;
        }
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`Error acquiring OAuth2 token for '${schemeName}':`, errorMessage);
        return null;
    }
}


/**
 * Executes an API tool with the provided arguments
 * 
 * @param toolName Name of the tool to execute
 * @param definition Tool definition
 * @param toolArgs Arguments provided by the user
 * @param allSecuritySchemes Security schemes from the OpenAPI spec
 * @returns Call tool result
 */
async function executeApiTool(
    toolName: string,
    definition: McpToolDefinition,
    toolArgs: JsonObject,
    allSecuritySchemes: Record<string, any>
): Promise<CallToolResult> {
  try {
    // Validate arguments against the input schema
    let validatedArgs: JsonObject;
    try {
        const zodSchema = getZodSchemaFromJsonSchema(definition.inputSchema, toolName);
        const argsToParse = (typeof toolArgs === 'object' && toolArgs !== null) ? toolArgs : {};
        validatedArgs = zodSchema.parse(argsToParse);
    } catch (error: unknown) {
        if (error instanceof ZodError) {
            const validationErrorMessage = `Invalid arguments for tool '${toolName}': ${error.errors.map(e => `${e.path.join('.')} (${e.code}): ${e.message}`).join(', ')}`;
            return { content: [{ type: 'text', text: validationErrorMessage }] };
        } else {
             const errorMessage = error instanceof Error ? error.message : String(error);
             return { content: [{ type: 'text', text: `Internal error during validation setup: ${errorMessage}` }] };
        }
    }

    // Prepare URL, query parameters, headers, and request body
    let urlPath = definition.pathTemplate;
    const queryParams: Record<string, any> = {};
    const headers: Record<string, string> = { 'Accept': 'application/json' };
    let requestBodyData: any = undefined;

    // Apply parameters to the URL path, query, or headers
    definition.executionParameters.forEach((param) => {
        const value = validatedArgs[param.name];
        if (typeof value !== 'undefined' && value !== null) {
            if (param.in === 'path') {
                urlPath = urlPath.replace(`{${param.name}}`, encodeURIComponent(String(value)));
            }
            else if (param.in === 'query') {
                queryParams[param.name] = value;
            }
            else if (param.in === 'header') {
                headers[param.name.toLowerCase()] = String(value);
            }
        }
    });

    // Ensure all path parameters are resolved
    if (urlPath.includes('{')) {
        throw new Error(`Failed to resolve path parameters: ${urlPath}`);
    }
    
    // Construct the full URL (env BASE_URL + API path, or relative path if no BASE_URL)
    const pathPart = API_BASE_URL ? `${API_BASE_URL}${urlPath}` : urlPath;
    const requestUrl = ENV_BASE_URL
      ? `${ENV_BASE_URL.replace(/\/$/, "")}${pathPart.startsWith("/") ? pathPart : `/${pathPart}`}`
      : pathPart;

    // Handle request body if needed
    if (definition.requestBodyContentType && typeof validatedArgs['requestBody'] !== 'undefined') {
        requestBodyData = validatedArgs['requestBody'];
        headers['content-type'] = definition.requestBodyContentType;
    }


    // Apply security requirements if available
    // Security requirements use OR between array items and AND within each object
    const appliedSecurity = definition.securityRequirements?.find(req => {
        // Try each security requirement (combined with OR)
        return Object.entries(req).every(([schemeName, scopesArray]) => {
            const scheme = allSecuritySchemes[schemeName];
            if (!scheme) return false;
            
            // API Key security (header, query, cookie)
            if (scheme.type === 'apiKey') {
                return !!process.env[`API_KEY_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
            }
            
            // HTTP security (basic, bearer)
            if (scheme.type === 'http') {
                if (scheme.scheme?.toLowerCase() === 'bearer') {
                    return !!process.env[`BEARER_TOKEN_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                }
                else if (scheme.scheme?.toLowerCase() === 'basic') {
                    return !!process.env[`BASIC_USERNAME_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`] && 
                           !!process.env[`BASIC_PASSWORD_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                }
            }
            
            // OAuth2 security
            if (scheme.type === 'oauth2') {
                // Check for pre-existing token
                if (process.env[`OAUTH_TOKEN_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`]) {
                    return true;
                }
                
                // Check for client credentials for auto-acquisition
                if (process.env[`OAUTH_CLIENT_ID_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`] &&
                    process.env[`OAUTH_CLIENT_SECRET_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`]) {
                    // Verify we have a supported flow
                    if (scheme.flows?.clientCredentials || scheme.flows?.password) {
                        return true;
                    }
                }
                
                return false;
            }
            
            // OpenID Connect
            if (scheme.type === 'openIdConnect') {
                return !!process.env[`OPENID_TOKEN_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
            }
            
            return false;
        });
    });

    // If we found matching security scheme(s), apply them
    if (appliedSecurity) {
        // Apply each security scheme from this requirement (combined with AND)
        for (const [schemeName, scopesArray] of Object.entries(appliedSecurity)) {
            const scheme = allSecuritySchemes[schemeName];
            
            // API Key security
            if (scheme?.type === 'apiKey') {
                const apiKey = process.env[`API_KEY_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                if (apiKey) {
                    if (scheme.in === 'header') {
                        headers[scheme.name.toLowerCase()] = apiKey;
                        console.error(`Applied API key '${schemeName}' in header '${scheme.name}'`);
                    }
                    else if (scheme.in === 'query') {
                        queryParams[scheme.name] = apiKey;
                        console.error(`Applied API key '${schemeName}' in query parameter '${scheme.name}'`);
                    }
                    else if (scheme.in === 'cookie') {
                        // Add the cookie, preserving other cookies if they exist
                        headers['cookie'] = `${scheme.name}=${apiKey}${headers['cookie'] ? `; ${headers['cookie']}` : ''}`;
                        console.error(`Applied API key '${schemeName}' in cookie '${scheme.name}'`);
                    }
                }
            } 
            // HTTP security (Bearer or Basic)
            else if (scheme?.type === 'http') {
                if (scheme.scheme?.toLowerCase() === 'bearer') {
                    const token = process.env[`BEARER_TOKEN_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                    if (token) {
                        headers['authorization'] = `Bearer ${token}`;
                        console.error(`Applied Bearer token for '${schemeName}'`);
                    }
                } 
                else if (scheme.scheme?.toLowerCase() === 'basic') {
                    const username = process.env[`BASIC_USERNAME_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                    const password = process.env[`BASIC_PASSWORD_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                    if (username && password) {
                        headers['authorization'] = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
                        console.error(`Applied Basic authentication for '${schemeName}'`);
                    }
                }
            }
            // OAuth2 security
            else if (scheme?.type === 'oauth2') {
                // First try to use a pre-provided token
                let token = process.env[`OAUTH_TOKEN_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                
                // If no token but we have client credentials, try to acquire a token
                if (!token && (scheme.flows?.clientCredentials || scheme.flows?.password)) {
                    console.error(`Attempting to acquire OAuth token for '${schemeName}'`);
                    token = (await acquireOAuth2Token(schemeName, scheme)) ?? '';
                }
                
                // Apply token if available
                if (token) {
                    headers['authorization'] = `Bearer ${token}`;
                    console.error(`Applied OAuth2 token for '${schemeName}'`);
                    
                    // List the scopes that were requested, if any
                    const scopes = scopesArray as string[];
                    if (scopes && scopes.length > 0) {
                        console.error(`Requested scopes: ${scopes.join(', ')}`);
                    }
                }
            }
            // OpenID Connect
            else if (scheme?.type === 'openIdConnect') {
                const token = process.env[`OPENID_TOKEN_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                if (token) {
                    headers['authorization'] = `Bearer ${token}`;
                    console.error(`Applied OpenID Connect token for '${schemeName}'`);
                    
                    // List the scopes that were requested, if any
                    const scopes = scopesArray as string[];
                    if (scopes && scopes.length > 0) {
                        console.error(`Requested scopes: ${scopes.join(', ')}`);
                    }
                }
            }
        }
    } 
    // Log warning if security is required but not available
    else if (definition.securityRequirements?.length > 0) {
        // First generate a more readable representation of the security requirements
        const securityRequirementsString = definition.securityRequirements
            .map(req => {
                const parts = Object.entries(req)
                    .map(([name, scopesArray]) => {
                        const scopes = scopesArray as string[];
                        if (scopes.length === 0) return name;
                        return `${name} (scopes: ${scopes.join(', ')})`;
                    })
                    .join(' AND ');
                return `[${parts}]`;
            })
            .join(' OR ');
            
        console.warn(`Tool '${toolName}' requires security: ${securityRequirementsString}, but no suitable credentials found.`);
    }
    

    // Prepare the axios request configuration
    const config: AxiosRequestConfig = {
      method: definition.method.toUpperCase(), 
      url: requestUrl, 
      params: queryParams, 
      headers: headers,
      ...(requestBodyData !== undefined && { data: requestBodyData }),
    };

    // Log request info to stderr (doesn't affect MCP output)
    console.error(`Executing tool "${toolName}": ${config.method} ${config.url}`);
    
    // Execute the request
    const response = await axios(config);

    // Process and format the response
    let responseText = '';
    const contentType = response.headers['content-type']?.toLowerCase() || '';
    
    // Handle JSON responses
    if (contentType.includes('application/json') && typeof response.data === 'object' && response.data !== null) {
         try { 
             responseText = JSON.stringify(response.data, null, 2); 
         } catch (e) { 
             responseText = "[Stringify Error]"; 
         }
    } 
    // Handle string responses
    else if (typeof response.data === 'string') { 
         responseText = response.data; 
    }
    // Handle other response types
    else if (response.data !== undefined && response.data !== null) { 
         responseText = String(response.data); 
    }
    // Handle empty responses
    else { 
         responseText = `(Status: ${response.status} - No body content)`; 
    }
    
    // Return formatted response
    return { 
        content: [ 
            { 
                type: "text", 
                text: `API Response (Status: ${response.status}):\n${responseText}` 
            } 
        ], 
    };

  } catch (error: unknown) {
    // Handle errors during execution
    let errorMessage: string;
    
    // Format Axios errors specially
    if (axios.isAxiosError(error)) { 
        errorMessage = formatApiError(error); 
    }
    // Handle standard errors
    else if (error instanceof Error) { 
        errorMessage = error.message; 
    }
    // Handle unexpected error types
    else { 
        errorMessage = 'Unexpected error: ' + String(error); 
    }
    
    // Log error to stderr
    console.error(`Error during execution of tool '${toolName}':`, errorMessage);
    
    // Return error message to client
    return { content: [{ type: "text", text: errorMessage }] };
  }
}


/**
 * Main function to start the server
 */
async function main() {
// Set up stdio transport
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error(`${SERVER_NAME} MCP Server (v${SERVER_VERSION}) running on stdio${API_BASE_URL ? `, proxying API at ${API_BASE_URL}` : ''}`);
  } catch (error) {
    console.error("Error during server startup:", error);
    process.exit(1);
  }
}

/**
 * Cleanup function for graceful shutdown
 */
async function cleanup() {
    console.error("Shutting down MCP server...");
    process.exit(0);
}

// Register signal handlers
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// Start the server
main().catch((error) => {
  console.error("Fatal error in main execution:", error);
  process.exit(1);
});

/**
 * Formats API errors for better readability
 * 
 * @param error Axios error
 * @returns Formatted error message
 */
function formatApiError(error: AxiosError): string {
    let message = 'API request failed.';
    if (error.response) {
        message = `API Error: Status ${error.response.status} (${error.response.statusText || 'Status text not available'}). `;
        const responseData = error.response.data;
        const MAX_LEN = 200;
        if (typeof responseData === 'string') { 
            message += `Response: ${responseData.substring(0, MAX_LEN)}${responseData.length > MAX_LEN ? '...' : ''}`; 
        }
        else if (responseData) { 
            try { 
                const jsonString = JSON.stringify(responseData); 
                message += `Response: ${jsonString.substring(0, MAX_LEN)}${jsonString.length > MAX_LEN ? '...' : ''}`; 
            } catch { 
                message += 'Response: [Could not serialize data]'; 
            } 
        }
        else { 
            message += 'No response body received.'; 
        }
    } else if (error.request) {
        message = 'API Network Error: No response received from server.';
        if (error.code) message += ` (Code: ${error.code})`;
    } else { 
        message += `API Request Setup Error: ${error.message}`; 
    }
    return message;
}

/**
 * Converts a JSON Schema to a Zod schema for runtime validation
 * 
 * @param jsonSchema JSON Schema
 * @param toolName Tool name for error reporting
 * @returns Zod schema
 */
function getZodSchemaFromJsonSchema(jsonSchema: any, toolName: string): z.ZodTypeAny {
    if (typeof jsonSchema !== 'object' || jsonSchema === null) { 
        return z.object({}).passthrough(); 
    }
    try {
        const zodSchemaString = jsonSchemaToZod(jsonSchema);
        const zodSchema = eval(zodSchemaString);
        if (typeof zodSchema?.parse !== 'function') { 
            throw new Error('Eval did not produce a valid Zod schema.'); 
        }
        return zodSchema as z.ZodTypeAny;
    } catch (err: any) {
        console.error(`Failed to generate/evaluate Zod schema for '${toolName}':`, err);
        return z.object({}).passthrough();
    }
}
