# FlexPrice MCP Server

A Model Context Protocol (MCP) server that enables AI agents to access FlexPrice API (customers, plans, prices, subscriptions, invoices, payments, events, etc.) via tools.

## Prerequisites

- Node.js (v20 or higher)
- npm or yarn
- TypeScript
- FlexPrice API key (obtained from your FlexPrice account)

## Quick start

1. **Clone and build**
   ```bash
   git clone <repository-url>
   cd mcp-server
   npm install
   npm run build
   ```
2. **Configure your MCP client** (Cursor or Claude Desktop) with:
   - **Command:** `node`
   - **Args:** absolute path to `build/index.js` (e.g. `$(pwd)/build/index.js` from repo root)
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

The Docker image builds and runs the MCP server (`build/index.js`).

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

| Host | Config location |
|------|-----------------|
| **Cursor** | In-app: **Cursor → Settings → MCP** (or **Cmd + Shift + P** → "Cursor Settings" → MCP). You edit the MCP servers list in the UI or in the JSON it writes. |
| **Claude Desktop (macOS)** | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| **Claude Desktop (Windows)** | `%APPDATA%\Claude\claude_desktop_config.json` |

To open the Claude config from a terminal (macOS):

```bash
echo "$HOME/Library/Application Support/Claude/claude_desktop_config.json"
cursor "$HOME/Library/Application Support/Claude/claude_desktop_config.json"
```

### What to put in the config

1. **Path to the server script** — Use the **absolute path** to `build/index.js` inside your cloned repo. From the repo root: `node -e "const path=require('path'); console.log(path.resolve('build/index.js'))"` or on macOS/Linux: `$(pwd)/build/index.js` after `cd`-ing into the repo.

2. **Environment variables** — `API_KEY_APIKEYAUTH` (your FlexPrice API key) and `BASE_URL` (e.g. `https://api.cloud.flexprice.io`). Both are required.

Replace the path in the examples below with your repo's absolute path to `build/index.js`.

### Example: Node (stdio)

```json
{
  "mcpServers": {
    "flexprice": {
      "command": "node",
      "args": ["/path/to/mcp-server/build/index.js"],
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
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "API_KEY_APIKEYAUTH",
        "-e",
        "BASE_URL",
        "flexprice-mcp"
      ],
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
   chmod +x build/index.js
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

## Development

The MCP server is generated from `swagger/swagger-3-0.json`. To update the API surface:

1. Edit `swagger/swagger-3-0.json` (or replace with a new export from your API docs).
2. Regenerate: `npm run generate` or `npm run generate:install` (merge package.json + install deps).
3. Build and run: `npm run build` then `npm start`.

See [CONTRIBUTING.md](CONTRIBUTING.md) for scripts and env details, and [TESTING.md](TESTING.md) for tests.

## License

This project is licensed under the [Apache License 2.0](LICENSE).
