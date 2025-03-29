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

## License

This project is licensed under the [Apache License 2.0](LICENSE).
