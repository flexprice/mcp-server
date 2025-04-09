# FlexPrice MCP Server

A Model Context Protocol (MCP) server that enables AI agents to access FlexPrice invoice and customer data efficiently.

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

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- TypeScript
- FlexPrice API key (obtained from your FlexPrice account)

## Setup

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

3. Create a `.env` file in the project root with your FlexPrice API credentials:

```
API_KEY=your_api_key_here
BASE_URL=https://api.cloud.flexprice.io
```

4. Build the project:

```bash
npm run build
```

5. Start the server:

```bash
npm start
```

For development with automatic reloading:

```bash
npm run dev
```

### Option 2: Docker Setup

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
docker run -i -e API_KEY=your_api_key_here -e BASE_URL=https://api.cloud.flexprice.io flexprice-mcp
```

### Usage with Claude Desktop

Add the following to your `claude_desktop_config.json`:

#### Node.js

First, clone the repository:

```bash
git clone <repository-url>
cd flexprice-mcp-server
```

Then, build the project:

```bash
npm run build
```

Then, add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "flexprice": {
      "command": "node",
      "args": ["/absolute/path/to/cloned/flexprice-mcp-server/dist/server.js"],
      "env": {
        "API_KEY": "your_api_key_here",
        "BASE_URL": "https://api.cloud.flexprice.io"
      }
    }
  }
}
```

#### Docker

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
        "API_KEY",
        "-e",
        "BASE_URL",
        "flexprice-mcp"
      ],
      "env": {
        "API_KEY": "your_api_key_here",
        "BASE_URL": "https://api.cloud.flexprice.io"
      }
    }
  }
}
```

## Troubleshooting

If you encounter issues with the FlexPrice MCP server, try these troubleshooting steps:

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
   chmod +x dist/server.js
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

The project uses Jest for unit testing. The tests are organized to mirror the source code structure:

```
src/
├── __tests__/            # All test files
│   ├── services/         # Tests for service classes
│   ├── mcp/              # Tests for MCP components
│   │   ├── handlers/     # Tests for MCP handlers
│   │   └── tools/        # Tests for MCP tools
│   └── utils/            # Tests for utility functions
```

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

For more detailed information about the testing approach and best practices, see the [Testing Guide](TESTING.md).

## License

This project is licensed under the [Apache License 2.0](LICENSE).
