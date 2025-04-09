# FlexPrice MCP Server

A Model Context Protocol (MCP) server that enables AI agents to access FlexPrice invoice and customer data efficiently.

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

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd flexprice-mcp-server
```

2. Install dependencies:

```bash
npm install
```

3. Build the project:

```bash
npm run build
```

4. If using claude, update the `claude_desktop_config.json`

```json
{
  ... other configs,
  "flexprice": {
    "command": "node",
    "args": ["/absolute/path/cloned/flexprice-mcp-server/dist/server.js"],
    "env": {
      "API_BASE_URL": "<BASE_URL>",
      "API_KEY": "<API_KEY>"
    }
  }
}
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
