import * as fs from "fs";
import * as path from "path";
import { OpenAPISpec } from "./types";

/**
 * Load OpenAPI 3.0 JSON from a URL or file path.
 * - If specSource starts with http:// or https://, fetch it.
 * - If it starts with file://, read the file (path after file://).
 * - Otherwise treat as a local file path (absolute or relative to cwd).
 */
export async function loadOpenAPISpec(specSource: string): Promise<OpenAPISpec> {
  const trimmed = specSource.trim();
  if (!trimmed) {
    throw new Error("OpenAPI spec source is empty");
  }

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    const response = await fetch(trimmed);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch OpenAPI spec: ${response.status} ${response.statusText}`
      );
    }
    const json = (await response.json()) as OpenAPISpec;
    return validateSpec(json);
  }

  let filePath: string;
  if (trimmed.startsWith("file://")) {
    filePath = trimmed.slice(7);
  } else {
    filePath = path.isAbsolute(trimmed) ? trimmed : path.resolve(process.cwd(), trimmed);
  }

  const content = await fs.promises.readFile(filePath, "utf-8");
  const json = JSON.parse(content) as OpenAPISpec;
  return validateSpec(json);
}

function validateSpec(json: OpenAPISpec): OpenAPISpec {
  if (!json || typeof json !== "object") {
    throw new Error("OpenAPI spec is not a valid JSON object");
  }
  if (!json.paths || typeof json.paths !== "object") {
    throw new Error("OpenAPI spec has no paths object");
  }
  return json;
}
