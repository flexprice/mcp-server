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

/**
 * Reads and returns a resource based on the URI
 *
 * @param uri The URI of the resource to read
 * @returns The resource data
 */
export const readResource = async (uri: string) => {
  const response = await fetch(uri);
  const data = await response.json();
  return { type: "object", data };
};
