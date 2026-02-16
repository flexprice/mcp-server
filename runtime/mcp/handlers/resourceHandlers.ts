import { config } from "../../config";

/**
 * List of available resources in the MCP
 */
export const resources = [
  {
    name: "swagger docs",
    description: "The swagger documentation for the API",
    uri: config.baseUrl + "/swagger/doc.json",
    mimeType: "application/json",
  },
  {
    name: "api documentation",
    description: "The FlexPrice API documentation",
    uri: "https://docs.flexprice.io/api-reference",
    mimeType: "text/html",
  },
];

/** Reads a resource by URI; returns JSON or text depending on content. */
export const readResource = async (uri: string) => {
  const response = await fetch(uri);
  const contentType = response.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();
  return { type: "object", data };
};
