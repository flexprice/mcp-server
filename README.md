# FlexPrice MCP Server

A Model Context Protocol (MCP) server that enables AI agents to access FlexPrice API (customers, plans, prices, subscriptions, invoices, payments, events, etc.) via tools.

## Prerequisites

- Node.js (v20 or higher)
- npm or yarn
- FlexPrice API key (obtained from your FlexPrice account)
- **For generating the server:** [Speakeasy CLI](https://www.speakeasy.com/) (see [Generating the MCP server](#generating-the-mcp-server))

## Quick start

1. **Clone, generate (if needed), and run**
   ```bash
   git clone <repository-url>
   cd mcp-server
   npm install
   # Generate the MCP server (requires Speakeasy CLI; see below)
   npm run generate:install
   npm run build
   npm start
   ```
2. **Configure your MCP client** (Cursor or Claude Desktop) with:
   - **Command:** `node`
   - **Args:** absolute path to `bin/mcp-server.js` and `start` (e.g. `$(pwd)/bin/mcp-server.js` from repo root, with args `["start"]`)
   - **Env:** `API_KEY_APIKEYAUTH` = your FlexPrice API key, `BASE_URL` = `https://api.cloud.flexprice.io` (or your API base)
3. Restart the client and use the FlexPrice tools from your AI assistant.

For a full MCP config example and troubleshooting, see [MCP client configuration](#mcp-client-configuration-cursor-and-claude-desktop) and [Troubleshooting](#troubleshooting).

## Setup

You can run the MCP server in two ways: **Option 1** runs the server locally; **Option 2** uses Docker.

### Option 1: Local Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd mcp-server
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root (copy from `.env.example`) and set **both**:

```
BASE_URL=https://api.cloud.flexprice.io
API_KEY_APIKEYAUTH=your_api_key_here
```

**Important:** `BASE_URL` is required. If it is missing, the server will log "proxying API at /v1" but tool calls will fail with **invalid url**, because the server needs the full API host (e.g. `https://api.cloud.flexprice.io`) to make requests.

4. Build the project:

```bash
npm run build
```

5. Start the server:

```bash
npm start
```

For development you can use `npm run dev` (same as `npm start`; add your own file watcher if desired).

### Option 2: Docker Setup

The Docker image builds and runs the MCP server (`bin/mcp-server.js start`).

1. Clone the repository:

```bash
git clone <repository-url>
cd mcp-server
```

2. Build the Docker image:

```bash
docker build -t flexprice-mcp .
```

3. Run the Docker container with your API credentials:

```bash
docker run -i -e API_KEY_APIKEYAUTH=your_api_key_here -e BASE_URL=https://api.cloud.flexprice.io flexprice-mcp
```

## MCP client configuration (Cursor and Claude Desktop)

You need to tell your MCP host which **command** to run and which **env vars** to pass.

### Where to find the config file

| Host                         | Config location                                                                                                                                           |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Cursor**                   | In-app: **Cursor → Settings → MCP** (or **Cmd + Shift + P** → "Cursor Settings" → MCP). You edit the MCP servers list in the UI or in the JSON it writes. |
| **Claude Desktop (macOS)**   | `~/Library/Application Support/Claude/claude_desktop_config.json`                                                                                         |
| **Claude Desktop (Windows)** | `%APPDATA%\Claude\claude_desktop_config.json`                                                                                                             |

To open the Claude config from a terminal (macOS):

```bash
echo "$HOME/Library/Application Support/Claude/claude_desktop_config.json"
cursor "$HOME/Library/Application Support/Claude/claude_desktop_config.json"
```

### What to put in the config

1. **Path to the server script** — Use the **absolute path** to `bin/mcp-server.js` inside your cloned repo, with args `["start"]`. From the repo root: `$(pwd)/bin/mcp-server.js` on macOS/Linux after `cd`-ing into the repo.

2. **Environment variables** — `API_KEY_APIKEYAUTH` (your FlexPrice API key) and `BASE_URL` (e.g. `https://api.cloud.flexprice.io`). Both are required.

Replace the path in the examples below with your repo's absolute path to `bin/mcp-server.js`.

### Example: Node (stdio)

```json
{
  "mcpServers": {
    "flexprice": {
      "command": "node",
      "args": ["/path/to/mcp-server/bin/mcp-server.js", "start"],
      "env": {
        "API_KEY_APIKEYAUTH": "your_api_key_here",
        "BASE_URL": "https://api.cloud.flexprice.io"
      }
    }
  }
}
```

### Example: Docker

```json
{
  "mcpServers": {
    "flexprice": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "-e", "API_KEY_APIKEYAUTH", "-e", "BASE_URL", "flexprice-mcp"],
      "env": {
        "API_KEY_APIKEYAUTH": "your_api_key_here",
        "BASE_URL": "https://api.cloud.flexprice.io"
      }
    }
  }
}
```

After editing, save the file and **restart Cursor or quit and reopen Claude Desktop** so the MCP server is picked up.

## Tools

The server exposes the FlexPrice API as MCP tools. Tool names and parameters match the OpenAPI spec. For the full list of tools, see `swagger/swagger-3-0.json` or your MCP client's tool list (e.g. Cursor and Claude show all available tools once the server is connected).

## Troubleshooting

### "Invalid URL" or request errors when calling tools

- **Cause:** The server builds request URLs from `process.env.BASE_URL` + the path (e.g. `/v1/customers`). If `BASE_URL` is not set, the URL is just `/v1/...`, which is invalid for axios in Node.
- **Fix:**
  1. When running locally: create a `.env` in the project root with `BASE_URL=https://api.cloud.flexprice.io` (or your FlexPrice API base). No trailing slash. Then run `npm run start` again.
  2. When using Cursor or Claude: in the MCP server config, add `"BASE_URL": "https://api.cloud.flexprice.io"` to the `env` object for the `flexprice` server.
  3. Quick test from the repo root: `BASE_URL=https://api.cloud.flexprice.io API_KEY_APIKEYAUTH=your_key npm run start`.

### API Connection Issues

1. **Verify API Credentials**: Ensure your API key and base URL are correct (check `.env` for local setup or env vars for Docker; test the key against the FlexPrice API).

2. **Network Connectivity**: Confirm that your server can reach the FlexPrice API endpoints:

   ```bash
   curl -H "x-api-key: your_api_key_here" https://api.cloud.flexprice.io/v1/customers
   ```

3. **Rate Limiting**: If you're getting rate limit errors, reduce the frequency of requests or contact FlexPrice support.

### Server Issues

1. **Port Conflicts**: If you see an error about port 3000 being in use, change the port in your configuration or stop the process: `lsof -i :3000` then `kill -9 PID`.

2. **Missing Dependencies**:

   ```bash
   npm install
   npm run build
   ```

3. **Permission Issues**:

   ```bash
   chmod +x bin/mcp-server.js
   ```

### Docker Issues

1. **Docker Build Failures**: Check Docker installation (`docker --version`), ensure the daemon is running, try rebuilding with `--no-cache`.

2. **Container Exit**: Inspect logs with `docker logs $(docker ps -lq)`.

3. **Environment Variables**: Verify env vars are passed: `docker run -it --rm flexprice-mcp printenv`.

## Testing

The project uses Jest for unit testing. Test files live under `src/__tests__/` or alongside source with `*.test.ts` / `*.spec.ts`.

```bash
npm test
npm run test:watch
npm run test:coverage
npm run test:ci
```

See [TESTING.md](TESTING.md) for the testing guide and [CONTRIBUTING.md](CONTRIBUTING.md) for contribution workflow.

## Generating the MCP server

The server is generated with **Speakeasy** from `swagger/swagger-3-0.json`. Generate when setting up the repo or after changing the OpenAPI spec.

**1. Install the Speakeasy CLI** (one-time)

- **macOS (Homebrew):** `brew install speakeasy-api/tap/speakeasy`
- **macOS/Linux (script):** `curl -fsSL https://go.speakeasy.com/cli-install.sh | sh`

**2. Generate the server**

From the repo root:

```bash
# Generate only (output at repo root; may overwrite package.json)
npm run generate

# Generate, restore repo scripts in package.json, and install dependencies (recommended)
npm run generate:install
```

Or run Speakeasy directly:

```bash
speakeasy run --target flexprice-mcp -y
```

Then restore package.json scripts and install deps:

```bash
node scripts/merge-package-after-generate.cjs
npm install
```

**3. Build and run**

```bash
npm run build
npm start
```

Generated output is at the repo root (`src/`, `bin/mcp-server.js`, etc.). You can edit these files; re-run `npm run generate` or `npm run generate:install` after changing `swagger/swagger-3-0.json` or `.speakeasy/overlays.yaml`. The files `src/mcp-server/build.mts` and `src/mcp-server/cli/start/command.ts`, `impl.ts` are listed in `.genignore` so Speakeasy does not overwrite them (build uses Node/esbuild; CLI uses env vars `BASE_URL` and `API_KEY_APIKEYAUTH` for Cursor MCP). The merge script restores `package.json` scripts and deps after generation.

## Development

To change the API surface: edit `swagger/swagger-3-0.json` (or `.speakeasy/overlays.yaml` for retries), then run `npm run generate:install`, `npm run build`, and `npm start`. See [CONTRIBUTING.md](CONTRIBUTING.md) for scripts and [TESTING.md](TESTING.md) for tests.

## License

This project is licensed under the [Apache License 2.0](LICENSE).

<!-- Start Summary [summary] -->
## Summary

FlexPrice API: FlexPrice API Service
<!-- End Summary [summary] -->

<!-- Start Table of Contents [toc] -->
## Table of Contents
<!-- $toc-max-depth=2 -->
* [FlexPrice MCP Server](#flexprice-mcp-server)
  * [Prerequisites](#prerequisites)
  * [Quick start](#quick-start)
* [Generate only (output at repo root; may overwrite package.json)](#generate-only-output-at-repo-root-may-overwrite-packagejson)
* [Generate, restore repo scripts in package.json, and install dependencies (recommended)](#generate-restore-repo-scripts-in-packagejson-and-install-dependencies-recommended)

<!-- End Table of Contents [toc] -->

<!-- Start Installation [installation] -->
## Installation

> [!TIP]
> To finish publishing your MCP Server to npm and others you must [run your first generation action](https://www.speakeasy.com/docs/github-setup#step-by-step-guide).
<details>
<summary>Claude Desktop</summary>

Install the MCP server as a Desktop Extension using the pre-built [`mcp-server.mcpb`](./mcp-server.mcpb) file:

Simply drag and drop the [`mcp-server.mcpb`](./mcp-server.mcpb) file onto Claude Desktop to install the extension.

The MCP bundle package includes the MCP server and all necessary configuration. Once installed, the server will be available without additional setup.

> [!NOTE]
> MCP bundles provide a streamlined way to package and distribute MCP servers. Learn more about [Desktop Extensions](https://www.anthropic.com/engineering/desktop-extensions).

</details>

<details>
<summary>Cursor</summary>

[![Install MCP Server](https://cursor.com/deeplink/mcp-install-dark.svg)](cursor://anysphere.cursor-deeplink/mcp/install?name=FlexPrice&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyJtY3AiLCJzdGFydCIsIi0tc2VydmVyLXVybCIsIiIsIi0tYXBpLWtleS1hdXRoIiwiIl19)

Or manually:

1. Open Cursor Settings
2. Select Tools and Integrations
3. Select New MCP Server
4. If the configuration file is empty paste the following JSON into the MCP Server Configuration:

```json
{
  "command": "npx",
  "args": [
    "mcp",
    "start",
    "--server-url",
    "",
    "--api-key-auth",
    ""
  ]
}
```

</details>

<details>
<summary>Claude Code CLI</summary>

```bash
claude mcp add FlexPrice -- npx -y mcp start --server-url  --api-key-auth 
```

</details>
<details>
<summary>Gemini</summary>

```bash
gemini mcp add FlexPrice -- npx -y mcp start --server-url  --api-key-auth 
```

</details>
<details>
<summary>Windsurf</summary>

Refer to [Official Windsurf documentation](https://docs.windsurf.com/windsurf/cascade/mcp#adding-a-new-mcp-plugin) for latest information

1. Open Windsurf Settings
2. Select Cascade on left side menu
3. Click on `Manage MCPs`. (To Manage MCPs you should be signed in with a Windsurf Account)
4. Click on `View raw config` to open up the mcp configuration file.
5. If the configuration file is empty paste the full json

```bash
{
  "command": "npx",
  "args": [
    "mcp",
    "start",
    "--server-url",
    "",
    "--api-key-auth",
    ""
  ]
}
```
</details>
<details>
<summary>VS Code</summary>

[![Install in VS Code](https://img.shields.io/badge/VS_Code-VS_Code?style=flat-square&label=Install%20FlexPrice%20MCP&color=0098FF)](vscode://ms-vscode.vscode-mcp/install?name=FlexPrice&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyJtY3AiLCJzdGFydCIsIi0tc2VydmVyLXVybCIsIiIsIi0tYXBpLWtleS1hdXRoIiwiIl19)

Or manually:

Refer to [Official VS Code documentation](https://code.visualstudio.com/api/extension-guides/ai/mcp) for latest information

1. Open [Command Palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette)
1. Search and open `MCP: Open User Configuration`. This should open mcp.json file
2. If the configuration file is empty paste the full json

```bash
{
  "command": "npx",
  "args": [
    "mcp",
    "start",
    "--server-url",
    "",
    "--api-key-auth",
    ""
  ]
}
```

</details>
<details>
<summary> Stdio installation via npm </summary>
To start the MCP server, run:

```bash
npx mcp start --server-url  --api-key-auth 
```

For a full list of server arguments, run:

```
npx mcp --help
```

</details>
<!-- End Installation [installation] -->

<!-- Placeholder for Future Speakeasy SDK Sections -->
