# FlexPrice MCP Server

A Model Context Protocol (MCP) server that enables AI agents to access FlexPrice API (customers, plans, prices, subscriptions, invoices, payments, events, etc.) via tools.

## Prerequisites

- Node.js (v20 or higher)
- npm or yarn
- FlexPrice API key (obtained from your FlexPrice account)
- **For generating the server:** [Speakeasy CLI](https://www.speakeasy.com/) (see [Generating the MCP server](#generating-the-mcp-server))

## How you can use the FlexPrice MCP server

You can use the FlexPrice MCP server in three ways: **hosted URL** (no install), **npm package** (one command), or **local repo** (clone and run). Pick one option below, then [add it to your MCP client](#add-to-your-mcp-client).

---

### Option 1: Use the hosted URL

- **What:** FlexPrice hosts the server; you only add the URL and your API key in your MCP client. Nothing to install or run.
- **Server URL:** `https://mcp.flexprice.io/sse`
- **Required:** Set the **`ApiKeyAuth`** header to your FlexPrice API key.
- **Next step:** [Add to your MCP client](#add-to-your-mcp-client) and use the **remote** config for your editor.

---

### Option 2: Use the npm package

- **What:** Run the server with one command (`npx`); no clone or build.
- **Run:**
  ```bash
  npx @flexprice/mcp-server start --server-url https://api.cloud.flexprice.io/v1 --api-key-auth YOUR_API_KEY
  ```
- **Next step:** [Add to your MCP client](#add-to-your-mcp-client) and use the **local (npx)** config for your editor.

---

### Option 3: Run from the local repo

- **What:** Clone the repo, install, build, and run. Use this if you want to change code or run without npm.
- **Steps:**
  1. Clone the repository: `git clone <repository-url> && cd mcp-server`
  2. Install dependencies: `npm install`
  3. Create a `.env` file (copy from `.env.example`) with `BASE_URL=https://api.cloud.flexprice.io/v1` and `API_KEY_APIKEYAUTH=your_api_key_here`. `BASE_URL` must include `/v1` (no trailing slash).
  4. Build: `npm run build`
  5. Start: `npm start`
- **Optional — Docker (stdio):** Build and run with stdio instead of cloning into your client:
  ```bash
  docker build -t flexprice-mcp .
  docker run -i -e API_KEY_APIKEYAUTH=your_api_key_here -e BASE_URL=https://api.cloud.flexprice.io/v1 flexprice-mcp node bin/mcp-server.js start
  ```
- **Next step:** [Add to your MCP client](#add-to-your-mcp-client) and use the **local (Node from repo)** or **Docker** config for your editor.

## Add to your MCP client

Add the FlexPrice MCP server in your editor. Use the **remote** config if you chose Option 1, or the **local** config if you chose Option 2 or 3. Replace `YOUR_API_KEY` with your FlexPrice API key in all examples.

### Config file locations

| Host                         | Config location                                                                                                                                           |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Cursor**                   | **Cursor → Settings → MCP** (or **Cmd + Shift + P** → "Cursor Settings" → MCP). Edit the MCP servers list or the JSON file it uses.                        |
| **VS Code**                  | Command Palette → **MCP: Open User Configuration** (opens `mcp.json`).                                                                                    |
| **Claude Desktop (macOS)**   | `~/Library/Application Support/Claude/claude_desktop_config.json`                                                                                         |
| **Claude Desktop (Windows)** | `%APPDATA%\Claude\claude_desktop_config.json`                                                                                                             |

---

### Cursor

1. Open **Cursor → Settings → Cursor Settings** and go to the **MCP** tab.
2. Click **+ Add new global MCP server** (or open the MCP configuration file).
3. Paste **one** of the following and save. Restart Cursor if the server does not appear.

**Remote** (Option 1 — hosted URL)

```json
{
  "mcpServers": {
    "flexprice": {
      "url": "https://mcp.flexprice.io/sse",
      "headers": {
        "ApiKeyAuth": "YOUR_API_KEY"
      }
    }
  }
}
```

**Local (npx)** (Option 2 or 3)

```json
{
  "mcpServers": {
    "flexprice": {
      "command": "npx",
      "args": [
        "-y",
        "@flexprice/mcp-server",
        "start",
        "--server-url",
        "https://api.cloud.flexprice.io/v1",
        "--api-key-auth",
        "YOUR_API_KEY"
      ]
    }
  }
}
```

---

### VS Code

1. Open the Command Palette (**Ctrl+Shift+P** / **Cmd+Shift+P**) and run **MCP: Add Server** or **MCP: Open User Configuration**.
2. For the **remote server:** choose HTTP, URL `https://mcp.flexprice.io/sse`, and add header `ApiKeyAuth` = your API key (if supported).
3. For the **local server:** use the stdio config below.

**Remote** (Option 1)

```json
{
  "servers": {
    "flexprice": {
      "type": "http",
      "url": "https://mcp.flexprice.io/sse",
      "headers": {
        "ApiKeyAuth": "YOUR_API_KEY"
      }
    }
  }
}
```

**Local (npx)** (Option 2 or 3)

```json
{
  "servers": {
    "flexprice": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@flexprice/mcp-server",
        "start",
        "--server-url",
        "https://api.cloud.flexprice.io/v1",
        "--api-key-auth",
        "YOUR_API_KEY"
      ]
    }
  }
}
```

---

### Claude Code

- **Remote:** Run `claude mcp add --transport http FlexPrice https://mcp.flexprice.io/sse` then set the `ApiKeyAuth` header to your API key when prompted.
- **Local:** Run `claude mcp add FlexPrice -- npx -y @flexprice/mcp-server start --server-url https://api.cloud.flexprice.io/v1 --api-key-auth YOUR_API_KEY`

Then run `claude` and use `/mcp` to confirm the server is connected.

---

### Claude Desktop

Add the **local (npx)** config below to your Claude Desktop config file (path above). Use **remote** (Option 1) if your client supports HTTP with headers, same as Cursor/VS Code.

```json
{
  "mcpServers": {
    "flexprice": {
      "command": "npx",
      "args": [
        "-y",
        "@flexprice/mcp-server",
        "start",
        "--server-url",
        "https://api.cloud.flexprice.io/v1",
        "--api-key-auth",
        "YOUR_API_KEY"
      ]
    }
  }
}
```

Quit and reopen Claude Desktop.

---

### Other clients (HTTP)

**Remote** (Option 1): URL `https://mcp.flexprice.io/sse` and header `ApiKeyAuth` = your API key (same shape as [Cursor](#cursor) remote config above):

```json
{
  "mcpServers": {
    "flexprice": {
      "url": "https://mcp.flexprice.io/sse",
      "headers": {
        "ApiKeyAuth": "your_api_key_here"
      }
    }
  }
}
```

### Alternative configs

**Local (Node from repo)** (Option 3 — run from cloned repo):

```json
{
  "mcpServers": {
    "flexprice": {
      "command": "node",
      "args": ["/path/to/mcp-server/bin/mcp-server.js", "start"],
      "env": {
        "API_KEY_APIKEYAUTH": "your_api_key_here",
        "BASE_URL": "https://api.cloud.flexprice.io/v1"
      }
    }
  }
}
```

**Docker** (Option 3 — stdio):

```json
{
  "mcpServers": {
    "flexprice": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "-e", "API_KEY_APIKEYAUTH", "-e", "BASE_URL", "flexprice-mcp"],
      "env": {
        "API_KEY_APIKEYAUTH": "your_api_key_here",
        "BASE_URL": "https://api.cloud.flexprice.io/v1"
      }
    }
  }
}
```

After editing, save the file and **restart Cursor or quit and reopen Claude Desktop** so the MCP server is picked up.

## Hosting your own URL

For teams that want to host the server themselves and expose a **remote** MCP endpoint (e.g. `https://mcp.flexprice.io/sse`) so users can add FlexPrice MCP by URL:

1. **Fly.io:** Use the included [fly.toml](fly.toml). Set the FlexPrice API base URL as a secret (the host does not need an API key; clients send theirs in headers).

   ```bash
   fly launch   # or fly apps create flexprice-mcp
   fly secrets set BASE_URL=https://api.cloud.flexprice.io/v1
   fly deploy
   ```

   After deploy, your SSE URL is `https://<your-app>.fly.dev/sse`. Optionally attach a custom domain (e.g. `mcp.flexprice.io`) in the Fly dashboard.

2. **Railway / Render:** Create a new service from this repo, use the Dockerfile, set env `BASE_URL=https://api.cloud.flexprice.io/v1`, and set the service port to the value your platform expects (e.g. `PORT=2718` or the provided `PORT`). The public URL will be `<your-service-url>/sse`.

3. **Cloudflare Tunnel:** Expose your running MCP server through Cloudflare with no code changes. Install [cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/) (e.g. `brew install cloudflared`), run your server (Docker or `npm start` on the port you use), then run `cloudflared tunnel --url http://localhost:2718`. Use the printed `*.trycloudflare.com` URL as your MCP endpoint: `https://<tunnel-host>/sse`. Configure your MCP client with this URL and the `ApiKeyAuth` header (same as [Option 1 — remote](#option-1-use-the-hosted-url)). For a full guide, see [Deploy with Cloudflare Tunnel](docs/cloudflare-tunnel.md).

4. **Cloudflare Workers (proxy):** To put an edge proxy in front of your existing MCP server (e.g. for custom domain or Cloudflare Access), see [Cloudflare Worker proxy](docs/cloudflare-worker-proxy.md).

5. **Document the URL** in your docs and client config examples (e.g. `https://mcp.flexprice.io/sse` with header `ApiKeyAuth`).

## Tools

The server exposes the FlexPrice API as MCP tools. Tool names and parameters match the OpenAPI spec. For the full list of tools, see `swagger/swagger-3-0.json` or your MCP client's tool list (e.g. Cursor and Claude show all available tools once the server is connected).

## Troubleshooting

### "Invalid URL" or request errors when calling tools

- **Cause:** The server builds request URLs from `process.env.BASE_URL` + the path (e.g. `/customers`). If `BASE_URL` is not set, the URL is invalid. If `BASE_URL` omits `/v1`, you may get **404** because the API expects the base to include `/v1`.
- **Fix:**
  1. When running locally: create a `.env` in the project root with `BASE_URL=https://api.cloud.flexprice.io/v1` (or `https://api-dev.cloud.flexprice.io/v1` for dev). No trailing slash after `v1`. Then run `npm run start` again.
  2. When using Cursor or Claude: in the MCP server config, add `"BASE_URL": "https://api.cloud.flexprice.io/v1"` to the `env` object for the `flexprice` server.
  3. Quick test from the repo root: `BASE_URL=https://api.cloud.flexprice.io/v1 API_KEY_APIKEYAUTH=your_key npm run start`.
  4. If you get **404** on tool calls, ensure `BASE_URL` includes `/v1`.

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

### Remote (hosted) connection issues

1. **Connection refused / wrong URL:** Ensure the URL is exactly the SSE endpoint (e.g. `https://mcp.flexprice.io/sse`). Some clients expect the base URL; try with and without `/sse` per your client’s docs.

2. **401 Unauthorized:** Ensure the `ApiKeyAuth` (or `x-api-key`) header is set to your FlexPrice API key. Re-authorize or re-add the server in your client if the key was rotated.

3. **Invalid URL / 404 on tool calls:** For local stdio, set `BASE_URL` or `--server-url` to the API base including `/v1` (e.g. `https://api.cloud.flexprice.io/v1`). For remote, the host uses its own `BASE_URL`; if tools fail, the hosted deployment may need the correct env.

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

Same configs as above, in collapsible form for Cursor, VS Code, Claude Code, etc.

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

**Remote (hosted):** Add an HTTP MCP server with URL and headers.

1. Open Cursor Settings → Tools and Integrations → New MCP Server.
2. Add server type **HTTP** (or URL) and paste:

```json
{
  "flexprice": {
    "url": "https://mcp.flexprice.io/sse",
    "headers": {
      "ApiKeyAuth": "YOUR_API_KEY"
    }
  }
}
```

**Local (stdio):** [One-click install (local)](cursor://anysphere.cursor-deeplink/mcp/install?name=FlexPrice&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsIkBmbGV4cHJpY2UvbWNwLXNlcnZlciIsInN0YXJ0IiwiLS1zZXJ2ZXItdXJsIiwiaHR0cHM6Ly9hcGkuY2xvdWQuZmxleHByaWNlLmlvL3YxIiwiLS1hcGkta2V5LWF1dGgiLCJZT1VSX0FQSV9LRVkiXX0=)

Or manually add a stdio server:

```json
{
  "flexprice": {
    "command": "npx",
    "args": [
      "-y",
      "@flexprice/mcp-server",
      "start",
      "--server-url",
      "https://api.cloud.flexprice.io/v1",
      "--api-key-auth",
      "YOUR_API_KEY"
    ]
  }
}
```

Replace `YOUR_API_KEY` with your FlexPrice API key.

</details>

<details>
<summary>Claude Code CLI</summary>

**Remote (hosted):**

```bash
claude mcp add --transport http FlexPrice https://mcp.flexprice.io/sse
```

Then set the `ApiKeyAuth` header to your API key when prompted or in config.

**Local (stdio):**

```bash
claude mcp add FlexPrice -- npx -y @flexprice/mcp-server start --server-url https://api.cloud.flexprice.io/v1 --api-key-auth YOUR_API_KEY
```

Replace `YOUR_API_KEY` with your FlexPrice API key.

</details>
<details>
<summary>Gemini</summary>

**Local (stdio):**

```bash
gemini mcp add FlexPrice -- npx -y @flexprice/mcp-server start --server-url https://api.cloud.flexprice.io/v1 --api-key-auth YOUR_API_KEY
```

Replace `YOUR_API_KEY` with your FlexPrice API key.

</details>
<details>
<summary>Windsurf</summary>

Refer to [Official Windsurf documentation](https://docs.windsurf.com/windsurf/cascade/mcp#adding-a-new-mcp-plugin) for latest information

1. Open Windsurf Settings
2. Select Cascade on left side menu
3. Click on `Manage MCPs`. (To Manage MCPs you should be signed in with a Windsurf Account)
4. Click on `View raw config` to open up the mcp configuration file.
5. If the configuration file is empty paste the full json (replace `YOUR_API_KEY`):

```json
{
  "command": "npx",
  "args": [
    "-y",
    "@flexprice/mcp-server",
    "start",
    "--server-url",
    "https://api.cloud.flexprice.io/v1",
    "--api-key-auth",
    "YOUR_API_KEY"
  ]
}
```
</details>
<details>
<summary>VS Code</summary>

**Remote (hosted):** MCP: Add Server → HTTP → URL `https://mcp.flexprice.io/sse`, then add header `ApiKeyAuth` = your API key.

**Local (stdio):** [Install in VS Code](vscode://ms-vscode.vscode-mcp/install?name=FlexPrice&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsIkBmbGV4cHJpY2UvbWNwLXNlcnZlciIsInN0YXJ0IiwiLS1zZXJ2ZXItdXJsIiwiaHR0cHM6Ly9hcGkuY2xvdWQuZmxleHByaWNlLmlvL3YxIiwiLS1hcGkta2V5LWF1dGgiLCJZT1VSX0FQSV9LRVkiXX0=)

Or manually: Refer to [Official VS Code documentation](https://code.visualstudio.com/api/extension-guides/ai/mcp). Open `MCP: Open User Configuration` and add (replace `YOUR_API_KEY`):

```json
{
  "flexprice": {
    "command": "npx",
    "args": [
      "-y",
      "@flexprice/mcp-server",
      "start",
      "--server-url",
      "https://api.cloud.flexprice.io/v1",
      "--api-key-auth",
      "YOUR_API_KEY"
    ]
  }
}
```

</details>
<details>
<summary>Stdio installation via npm</summary>

To start the MCP server locally, run:

```bash
npx @flexprice/mcp-server start --server-url https://api.cloud.flexprice.io/v1 --api-key-auth YOUR_API_KEY
```

For a full list of server arguments, run:

```bash
npx @flexprice/mcp-server --help
```

</details>
<!-- End Installation [installation] -->

<!-- Placeholder for Future Speakeasy SDK Sections -->
