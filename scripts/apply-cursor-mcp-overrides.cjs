/**
 * Re-applies Cursor MCP overrides after Speakeasy regeneration.
 * Makes --server-url and --api-key-auth optional with env fallback (BASE_URL, API_KEY_APIKEYAUTH)
 * so the server can start when Cursor runs it without args.
 *
 * Run after: bun run generate (or add to generate:install).
 * See .genignore for the list of manually maintained files.
 */

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const src = path.join(root, "src", "mcp-server");

function patchCommandTs(filePath) {
  let content = fs.readFileSync(filePath, "utf-8");

  // From generated: optional: false, parse that requires a value
  const generatedBlock =
    /"server-url":\s*\{\s*kind:\s*"parsed",\s*brief:\s*"Overrides the default server URL used by the SDK",\s*optional:\s*false,\s*parse:\s*\(value\)\s*=>\s*new URL\(value\)\.toString\(\),\s*\}/;

  const patchedBlock = `"server-url": {
        kind: "parsed",
        brief: "Overrides the default server URL used by the SDK (default: BASE_URL env)",
        optional: true,
        parse: (value) => (value ? new URL(value).toString() : ""),
      }`;

  if (generatedBlock.test(content)) {
    content = content.replace(generatedBlock, patchedBlock);
    fs.writeFileSync(filePath, content);
    return true;
  }
  // Already patched (optional: true) or format changed
  return false;
}

function patchFlagsTs(filePath) {
  let content = fs.readFileSync(filePath, "utf-8");
  const generated = /readonly "server-url": string;/;
  const patched = 'readonly "server-url"?: string;';
  if (generated.test(content)) {
    content = content.replace(generated, patched);
    fs.writeFileSync(filePath, content);
    return true;
  }
  return false;
}

function patchImplTs(filePath) {
  let content = fs.readFileSync(filePath, "utf-8");
  let changed = false;

  // Stdio: add serverURL + env fallback and use it in createMCPServer
  const stdioGenerated =
    /const transport = new StdioServerTransport\(\);\s*const \{ server \} = createMCPServer\(\{\s*logger,\s*allowedTools: flags\.tool,\s*dynamic: flags\.mode === "dynamic",\s*security: \{ ApiKeyAuth: flags\["api-key-auth"\] \?\? "" \},\s*serverURL: flags\["server-url"\],\s*serverIdx: flags\["server-index"\],\s*\}\);/;

  const stdioPatched = `const transport = new StdioServerTransport();
  const serverURL =
    flags["server-url"] || process.env["BASE_URL"] || "";
  const { server } = createMCPServer({
    logger,
    allowedTools: flags.tool,
    dynamic: flags.mode === "dynamic",
    security: { ApiKeyAuth: flags["api-key-auth"] ?? process.env["API_KEY_APIKEYAUTH"] ?? "" },
    serverURL,
    serverIdx: flags["server-index"],
  });`;

  if (stdioGenerated.test(content)) {
    content = content.replace(stdioGenerated, stdioPatched);
    changed = true;
  }

  // SSE: add serverURL + env fallback
  const sseGenerated =
    /("api-key-auth": \(req\.headers\["ApiKeyAuth"\] as string\)\s*\?\?\s*cliFlags\["api-key-auth"\],\s*\};\s*)(\/\/ Create a new MCP server for this connection with its auth\s*const \{ server: mcpServer \} = createMCPServer\(\{\s*logger,\s*allowedTools: flags\.tool,\s*dynamic: flags\.mode === "dynamic",\s*security: \{ ApiKeyAuth: flags\["api-key-auth"\] \?\? "" \},\s*serverURL: flags\["server-url"\],\s*serverIdx: flags\["server-index"\],\s*\}\);)/;

  const ssePatched = `$1const serverURL =
      flags["server-url"] || process.env["BASE_URL"] || "";

    // Create a new MCP server for this connection with its auth
    const { server: mcpServer } = createMCPServer({
      logger,
      allowedTools: flags.tool,
      dynamic: flags.mode === "dynamic",
      security: { ApiKeyAuth: flags["api-key-auth"] ?? process.env["API_KEY_APIKEYAUTH"] ?? "" },
      serverURL,
      serverIdx: flags["server-index"],
    });`;

  if (sseGenerated.test(content)) {
    content = content.replace(sseGenerated, ssePatched);
    changed = true;
  }

  if (changed) fs.writeFileSync(filePath, content);
  return changed;
}

const commandPath = path.join(src, "cli", "start", "command.ts");
const flagsPath = path.join(src, "flags.ts");
const implPath = path.join(src, "cli", "start", "impl.ts");

const a = patchCommandTs(commandPath);
const b = patchFlagsTs(flagsPath);
const c = patchImplTs(implPath);

if (a || b || c) {
  console.log("Applied Cursor MCP overrides (optional --server-url, env BASE_URL/API_KEY_APIKEYAUTH).");
} else {
  console.log("Cursor MCP overrides already applied or generated format changed. No changes.");
}
