/**
 * Speakeasy's MCP generator does not include the `dynamic` option in createMCPServer.
 * Our custom impl.ts and tools.ts support dynamic mode. This script patches the
 * generated server.ts to add `dynamic?: boolean` to the deps type and pass it to
 * createRegisterTool, so "Compile SDK" and npm run build succeed after generate.
 */
const fs = require("fs");
const path = require("path");

const serverPath = path.join(__dirname, "..", "src", "mcp-server", "server.ts");
let content = fs.readFileSync(serverPath, "utf-8");

// 1) Add dynamic to deps type if missing (after allowedTools line)
if (!content.includes("dynamic?: boolean")) {
  // Generator may output allowedTools then scopes?: never[] or getSDK?:
  const withDynamicBeforeScopes = content.replace(
    /(allowedTools\?\: string\[\] \| undefined;)\n(\s+)(scopes\?\:)/m,
    "$1\n$2dynamic?: boolean | undefined;\n$2$3"
  );
  if (withDynamicBeforeScopes !== content) {
    content = withDynamicBeforeScopes;
  } else {
    const withDynamicBeforeGetSDK = content.replace(
      /(allowedTools\?\: string\[\] \| undefined;)\n(\s+)(getSDK\?\:)/m,
      "$1\n$2dynamic?: boolean | undefined;\n$2$3"
    );
    if (withDynamicBeforeGetSDK !== content) {
      content = withDynamicBeforeGetSDK;
    }
  }
}

// 2) Pass deps.dynamic to createRegisterTool if not already passed (6th arg)
if (!/deps\.dynamic,?\s*\)/.test(content) || !/createRegisterTool\([\s\S]*?deps\.dynamic/.test(content)) {
  content = content.replace(
    /(createRegisterTool\(\s*deps\.logger,\s*server,\s*getClient,\s*scopes,\s*allowedTools),(\s*)\)/s,
    "$1,\n    deps.dynamic,$2)"
  );
}

fs.writeFileSync(serverPath, content);
console.log("Patched server.ts for dynamic option.");
