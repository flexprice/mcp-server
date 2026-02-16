# Contributing to FlexPrice MCP Server

Thanks for your interest in contributing. This document gives a short workflow and pointers.

## Setup

1. Clone the repo and install dependencies:
   ```bash
   git clone <repository-url>
   cd mcp-server
   npm install
   ```
2. Copy `.env.example` to `.env` and set `BASE_URL` and `API_KEY_APIKEYAUTH` (or use your MCP client’s env config).
3. Build and run:
   ```bash
   npm run build
   npm start
   ```

## Changing the API surface (tools)

The server is **generated** with Speakeasy from `swagger/swagger-3-0.json`. Generated output is multi-file at the repo root (`src/`, `bin/`, etc.) and can be refined.

**Prerequisites:** Install the Speakeasy CLI (only needed when regenerating):

- **macOS (Homebrew):** `brew install speakeasy-api/tap/speakeasy`
- **macOS/Linux (script):** `curl -fsSL https://go.speakeasy.com/cli-install.sh | sh`

To add or change tools:

1. Update **`swagger/swagger-3-0.json`** (or replace with a new OpenAPI export from FlexPrice). Optionally edit **`.speakeasy/overlays.yaml`** for retries or other OpenAPI overlays.
2. Regenerate:
   ```bash
   npm run generate
   ```
   To also merge `package.json` and run `npm install`:
   ```bash
   npm run generate:install
   ```
3. Build and test:
   ```bash
   npm run build
   npm test
   ```

The generator writes output at the repo root (see `output` in `.speakeasy/workflow.yaml`). You can refine the generated `src/` and server code; regeneration will overwrite those files. To run the server: `node bin/mcp-server.js start` (set `BASE_URL` and `API_KEY_APIKEYAUTH` in env).

## Scripts

| Script | Purpose |
|--------|--------|
| `npm run generate` | Generate MCP server from OpenAPI spec (Speakeasy; output at repo root) |
| `npm run generate:install` | Generate + merge package.json + `npm install` |
| `npm run build` | Compile TypeScript to `build/` |
| `npm start` | Run the server (`node build/index.js`) |
| `npm test` | Run Jest tests |
| `npm run test:coverage` | Run tests with coverage report |

## Tests

- See **[TESTING.md](TESTING.md)** for how to run and write tests.
- Tests use Jest and ts-jest; put `*.test.ts` / `*.spec.ts` under `src/__tests__/` or next to the code under test.

## Documentation

- **User-facing:** [README.md](README.md) — quick start, setup, MCP config, troubleshooting.
- **Testing:** [TESTING.md](TESTING.md) — running and writing tests.
- **Product/business context:** [docs/](docs/) — PRDs, BRDs, and summaries (internal reference).

## MCP config (env vars)

When running via Cursor or Claude Desktop, set in the MCP server config’s `env`:

- `API_KEY_APIKEYAUTH` — FlexPrice API key (required).
- `BASE_URL` — API base URL, e.g. `https://api.cloud.flexprice.io` (required; omit and you’ll see “invalid url” errors).

You don’t need a `.env` file if the MCP client injects these.

## Questions or issues

Open an issue in the repository for bugs or feature requests. For FlexPrice API behavior, refer to FlexPrice’s API documentation.
