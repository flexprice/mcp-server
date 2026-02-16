# FlexPrice MCP Server

A Model Context Protocol (MCP) server that enables AI agents to access FlexPrice API (customers, plans, prices, subscriptions, invoices, payments, events, etc.) via tools.

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

## Tools

### Customer Endpoints

1. `getCustomers`

   - Get all customers
   - Returns: List of customers with their IDs and information

2. `getCustomerById`

   - Get a customer by ID
   - Required inputs:
     - `customerId` (string): The ID of the customer to retrieve
   - Returns: Customer details including subscriptions

3. `getCustomerByLookupKey`

   - Get a customer by lookup key (external ID)
   - Required inputs:
     - `lookupKey` (string): The lookup key (external ID) of the customer
   - Returns: Customer details

4. `getCustomerSubscriptions`

   - Get a customer's subscriptions
   - Required inputs:
     - `customerId` (string): The ID of the customer
   - Returns: List of subscriptions for the customer

5. `getCustomerEntitlements`

   - Get a customer's entitlements
   - Required inputs:
     - `customerId` (string): The ID of the customer
   - Returns: List of entitlements for the customer

6. `getCustomerUsageSummary`
   - Get a customer's usage summary
   - Required inputs:
     - `customerId` (string): The ID of the customer
   - Returns: Usage summary for the customer

### Plan Endpoints

1. `getPlans`

   - Get all plans
   - Returns: List of plans with their IDs and information

2. `getPlanById`
   - Get a plan by ID
   - Required inputs:
     - `planId` (string): The ID of the plan to retrieve
   - Returns: Plan details

### Price Endpoints

1. `getPrices`

   - Get all prices
   - Returns: List of prices with their IDs and information

2. `getPriceById`
   - Get a price by ID
   - Required inputs:
     - `priceId` (string): The ID of the price to retrieve
   - Returns: Price details

### Subscription Endpoints

1. `getSubscriptions`

   - Get all subscriptions
   - Returns: List of subscriptions with their IDs and information

2. `getSubscriptionById`

   - Get a subscription by ID
   - Required inputs:
     - `subscriptionId` (string): The ID of the subscription to retrieve
   - Returns: Subscription details

3. `getSubscriptionUsage`

   - Get usage for a subscription
   - Required inputs:
     - `subscriptionId` (string): The ID of the subscription
   - Returns: Usage details for the subscription

4. `getSubscriptionPauses`
   - Get all pauses for a subscription
   - Required inputs:
     - `subscriptionId` (string): The ID of the subscription
   - Returns: List of pauses for the subscription

### Wallet Endpoints

1. `getWalletById`

   - Get a wallet by ID
   - Required inputs:
     - `walletId` (string): The ID of the wallet to retrieve
   - Returns: Wallet details

2. `getWalletBalance`

   - Get the real-time balance of a wallet
   - Required inputs:
     - `walletId` (string): The ID of the wallet
   - Returns: Balance and currency information

3. `getWalletTransactions`

   - Get transactions for a wallet with pagination
   - Required inputs:
     - `walletId` (string): The ID of the wallet
   - Optional inputs:
     - `limit` (number): Maximum number of transactions to return
     - `offset` (number): Number of transactions to skip for pagination
   - Returns: List of wallet transactions

4. `getWalletsByCustomerId`
   - Get all wallets for a customer
   - Required inputs:
     - `customerId` (string): The ID of the customer
   - Returns: List of wallets for the customer

### Invoice Endpoints

1. `getInvoiceById`

   - Get an invoice by its ID
   - Required inputs:
     - `invoiceId` (string): The ID of the invoice to retrieve
   - Returns: Invoice details

2. `getInvoiceByNumber`

   - Get an invoice by its number
   - Required inputs:
     - `invoiceNumber` (string): The invoice number to retrieve
   - Returns: Invoice details

3. `getInvoices`

   - Get invoices with optional filtering
   - Optional inputs:
     - `startDate` (string): ISO format date string for filtering from this date
     - `endDate` (string): ISO format date string for filtering until this date
     - `status` (string): Filter invoices by status
     - `limit` (number): Maximum number of invoices to return
     - `offset` (number): Number of invoices to skip for pagination
   - Returns: List of invoices matching the filters

4. `getInvoicesByCustomerId`
   - Get all invoices for a specific customer
   - Required inputs:
     - `customerId` (string): The ID of the customer
   - Returns: List of invoices for the customer

### Payment Endpoints

1. `getPaymentById`

   - Get a payment by ID
   - Required inputs:
     - `paymentId` (string): The ID of the payment to retrieve
   - Returns: Payment details

2. `getPayments`
   - Get payments with optional filtering
   - Optional inputs:
     - `customerId` (string): Filter payments by customer ID
     - `status` (string): Filter payments by status (pending, processed, failed)
     - `limit` (number): Maximum number of payments to return
     - `offset` (number): Number of payments to skip for pagination
   - Returns: List of payments matching the filters

### Event Endpoints

1. `getEventsByCustomer`
   - Get events for a customer
   - Required inputs:
     - `externalCustomerId` (string): External ID of the customer
   - Optional inputs:
     - `iterFirstKey` (string): Pagination first key
     - `iterLastKey` (string): Pagination last key
     - `startTime` (string): Start time for filtering events
     - `endTime` (string): End time for filtering events
   - Returns: Events for the customer

## Features

- Invoice data access
  - Get invoice by ID
- Customer data access
  - Get customer subscriptions
- Event data access
  - Get events by customer
  - Get usage statistics for events

## Generated MCP server (for agents)

The MCP server is generated at the **repo root** via `npm run generate` (generator writes `src/` for source and `build/` for the runnable server) so agents (Cursor, Claude, etc.) use the same OpenAPI spec as the source of truth. After updating `swagger/swagger-3-0.json`, regenerate and run the generated server.

1. **Generate the server** (requires Node.js and npx):
   ```bash
   npm run generate
   ```
   Optionally install dependencies so it is ready to run:
   ```bash
   npm run generate:install
   ```

2. **Set environment variables** for the generated server: FlexPrice API key and base URL. Configure these in your MCP client (Cursor or Claude Desktop) or in a `.env` file in the project root (see `.env.example`). Use **`API_KEY_APIKEYAUTH`** for the API key and **`BASE_URL`** for the API base URL (e.g. `https://api.cloud.flexprice.io`).

3. **Point the MCP client at the generated server**:
   - **stdio:** Use the path to the generated server’s entry (e.g. `node /path/to/flexprice-mcp-server/build/index.js` or `npm start` from the repo root). In Cursor/Claude, set `command` to `node` and `args` to that path (or `npm` with `args: ["start"]` and `cwd` to the repo root).
   - **HTTP:** If you use a transport that serves HTTP, use the URL/port the generated server listens on.

The generated server lives at the repo root. To run it locally after generating: `npm start` (or `npm run run:generated`).

### Development workflow (updating the API surface)

When the FlexPrice API or OpenAPI spec changes:

1. Update **`swagger/swagger-3-0.json`** (or replace with a new export from your API docs).
2. Regenerate the server:
   ```bash
   npm run generate
   ```
   To also merge package.json and reinstall deps:
   ```bash
   npm run generate:install
   ```
3. Build and run:
   ```bash
   npm run build
   npm start
   ```
4. If you added env vars in your MCP client config (e.g. Cursor), no change needed. For local `.env`, ensure `BASE_URL` and `API_KEY_APIKEYAUTH` are set (see `.env.example`).

## Prerequisites

- Node.js (v20 or higher)
- npm or yarn
- TypeScript
- FlexPrice API key (obtained from your FlexPrice account)

## Setup

You can run the MCP server in two ways: **Option 1** runs the generated server locally (after `npm run generate` or `npm run generate:install`); **Option 2** uses Docker. See [Generated MCP server](#generated-mcp-server-for-agents) for generation details.

### Option 1: Local Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd flexprice-mcp-server
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

4. Build the project (builds the generated server at repo root):

```bash
npm run build
```

5. Start the server (runs the generated server):

```bash
npm start
```

For development with auto-rebuild you can use `npm run dev` (same as `npm start`; add your own file watcher if desired).

### Option 2: Docker Setup

The Docker image builds and runs the **generated** MCP server (`build/index.js`).

1. Clone the repository:

```bash
git clone <repository-url>
cd flexprice-mcp-server
```

2. Build the Docker image:

```bash
docker build -t flexprice-mcp .
```

3. Run the Docker container with your API credentials:

```bash
docker run -i -e API_KEY_APIKEYAUTH=your_api_key_here -e BASE_URL=https://api.cloud.flexprice.io flexprice-mcp
```

### MCP client configuration (Cursor and Claude Desktop)

You need to tell your MCP host which **command** to run and which **env vars** to pass. Use the instructions below for your tool.

#### Where to find the config file

| Host | Config location |
|------|-----------------|
| **Cursor** | In-app: **Cursor → Settings → MCP** (or **Cmd + Shift + P** → “Cursor Settings” → MCP). You edit the MCP servers list in the UI or in the JSON it writes. |
| **Claude Desktop (macOS)** | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| **Claude Desktop (Windows)** | `%APPDATA%\Claude\claude_desktop_config.json` |

To open the Claude config from a terminal (macOS):

```bash
# Print path
echo "$HOME/Library/Application Support/Claude/claude_desktop_config.json"

# Open in editor (path has a space, so quoted)
cursor "$HOME/Library/Application Support/Claude/claude_desktop_config.json"
```

#### What to put in the config

1. **Path to the server script**  
   Use the **absolute path** to `build/index.js` inside your cloned repo (no placeholders). From the repo root you can get it with:

   ```bash
   cd /path/to/flexprice-mcp-server
   npm run build
   node -e "const path=require('path'); console.log(path.resolve('build/index.js'))"
   ```

   Or on macOS/Linux: `$(pwd)/build/index.js` after `cd`-ing into the repo.

2. **Environment variables**  
   The generated server expects your FlexPrice API key (and optionally base URL). Use the same names as in the generated `.env.example`:

   - **API key:** `API_KEY_APIKEYAUTH` (value = your FlexPrice API key).
   - **Base URL (if required):** `BASE_URL` = `https://api.cloud.flexprice.io` (or your FlexPrice API base). Some setups use only the key; if requests fail with a wrong host, add `BASE_URL`.

#### Example: Node (stdio)

Replace `YOUR_ABSOLUTE_PATH_TO_REPO` with the real path (e.g. `/Users/you/projects/flexprice-mcp-server`):

```json
{
  "mcpServers": {
    "flexprice": {
      "command": "node",
      "args": ["YOUR_ABSOLUTE_PATH_TO_REPO/build/index.js"],
      "env": {
        "API_KEY_APIKEYAUTH": "your_flexprice_api_key_here",
        "BASE_URL": "https://api.cloud.flexprice.io"
      }
    }
  }
}
```

**Concrete example** (macOS, repo in `~/Developer/flexprice-mcp-server`):

```json
{
  "mcpServers": {
    "flexprice": {
      "command": "node",
      "args": ["/Users/omkar/Developer/source code/flexprice/mcp-server/build/index.js"],
      "env": {
        "API_KEY_APIKEYAUTH": "sk_your_api_key_here",
        "BASE_URL": "https://api.cloud.flexprice.io"
      }
    }
  }
}
```

After editing, save the file and **restart Cursor or quit and reopen Claude Desktop** so the MCP server is picked up.

### Usage with Claude Desktop (reference)

Add the block above to your `claude_desktop_config.json` (path in the table above). Merge the `mcpServers` entry with any existing `preferences` or other keys in that file.

#### Node.js (quick copy)

After cloning, building (`npm run build`), and resolving the path to `build/index.js`:

```json
{
  "mcpServers": {
    "flexprice": {
      "command": "node",
      "args": ["/absolute/path/to/cloned/flexprice-mcp-server/build/index.js"],
      "env": {
        "API_KEY_APIKEYAUTH": "your_api_key_here",
        "BASE_URL": "https://api.cloud.flexprice.io"
      }
    }
  }
}
```

#### Docker

Use the same env var names as the server expects (`API_KEY_APIKEYAUTH`, `BASE_URL`):

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

## Troubleshooting

If you encounter issues with the FlexPrice MCP server, try these troubleshooting steps:

### "Invalid URL" or request errors when calling tools

- **Cause:** The server builds request URLs from `process.env.BASE_URL` + the path (e.g. `/v1/customers`). If `BASE_URL` is not set, the URL is just `/v1/...`, which is invalid for axios in Node.
- **Fix:**
  1. When running locally: create a `.env` in the project root with `BASE_URL=https://api.cloud.flexprice.io` (or your FlexPrice API base). No trailing slash. Then run `npm run start` again.
  2. When using Cursor or Claude: in the MCP server config, add `"BASE_URL": "https://api.cloud.flexprice.io"` to the `env` object for the `flexprice` server.
  3. Quick test from the repo root: `BASE_URL=https://api.cloud.flexprice.io API_KEY_APIKEYAUTH=your_key npm run start`.

### API Connection Issues

1. **Verify API Credentials**: Ensure your API key and base URL are correct. You can verify this by:

   - Checking the `.env` file for local setup
   - Verifying environment variables for Docker setup
   - Testing the key directly against the FlexPrice API

2. **Network Connectivity**: Confirm that your server can reach the FlexPrice API endpoints:

   ```bash
   curl -H "x-api-key: your_api_key_here" https://api.cloud.flexprice.io/customers
   ```

3. **Rate Limiting**: If you're getting rate limit errors, reduce the frequency of requests or contact FlexPrice support to increase your rate limits.

### Server Issues

1. **Port Conflicts**: If you see an error about port 3000 being in use, you can:

   - Change the port in your configuration
   - Stop the process using that port: `lsof -i :3000` then `kill -9 PID`

2. **Missing Dependencies**: If you get errors about missing modules:

   ```bash
   npm install
   npm run build
   ```

3. **Permission Issues**: Ensure the proper file permissions:
   ```bash
   chmod +x build/index.js
   ```

### Docker Issues

1. **Docker Build Failures**:

   - Check Docker installation: `docker --version`
   - Ensure your Docker daemon is running
   - Try rebuilding with the `--no-cache` flag

2. **Container Exit**: If the container stops unexpectedly:

   ```bash
   docker logs $(docker ps -lq)
   ```

3. **Environment Variables**: Verify environment variables are being passed correctly:
   ```bash
   docker run -it --rm flexprice-mcp printenv
   ```

## Testing

The project uses Jest for unit testing. Test files live under `src/__tests__/` or alongside source with `*.test.ts` / `*.spec.ts`. Add tests for any custom logic you add; the generated `src/index.ts` is driven by the OpenAPI spec.

To run the tests:

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

For more detailed information about the testing approach and best practices, see the [Testing Guide](TESTING.md). For contribution workflow (regenerating from OpenAPI, scripts, env), see [CONTRIBUTING.md](CONTRIBUTING.md).

## License

This project is licensed under the [Apache License 2.0](LICENSE).
