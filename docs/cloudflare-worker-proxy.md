# Cloudflare Worker proxy for FlexPrice MCP server

This guide describes how to put a **Cloudflare Worker** in front of your existing FlexPrice MCP server. The Worker acts as a reverse proxy: it receives requests at `/sse` and `/message/:sessionId`, forwards them to your origin server (e.g. a server behind Cloudflare Tunnel or any HTTPS origin), and streams the response back. No changes to the MCP server code are required.

Use this if you want:

- A custom domain or a `*.workers.dev` URL in front of your server
- Cloudflare Access, rate limiting, or other Workers features in front of MCP

You still run and maintain the MCP server (e.g. locally or on a VPS); the Worker adds an edge hop.

## Prerequisites

- An MCP server already deployed and reachable at an HTTPS URL (e.g. `https://mcp.yourdomain.com` or `https://your-origin.example.com`). This is your **origin**.
- Node.js and npm (for Wrangler).
- A Cloudflare account.

## Step 1 — Create a Worker project

```bash
npm create cloudflare@latest flexprice-mcp-proxy -- --template=hello-world
cd flexprice-mcp-proxy
```

When prompted, choose a simple Worker (no framework).

## Step 2 — Add the origin URL as a secret

Set the full origin URL (no trailing slash) so the Worker can forward requests:

```bash
npx wrangler secret put MCP_ORIGIN
# When prompted, enter e.g. https://mcp.yourdomain.com or https://your-origin.example.com
```

## Step 3 — Replace the Worker script

Replace the contents of `src/index.ts` (or the main Worker file) with a proxy that forwards `/sse`, `/message/*`, and optionally `/` to the origin, preserving headers and request body:

```typescript
export default {
  async fetch(request: Request, env: { MCP_ORIGIN: string }): Promise<Response> {
    const origin = env.MCP_ORIGIN;
    if (!origin) {
      return new Response("MCP_ORIGIN not set", { status: 500 });
    }

    const url = new URL(request.url);
    const path = url.pathname;
    const originUrl = `${origin}${path}${url.search}`;

    const headers = new Headers(request.headers);
    // Optional: remove or override host if the origin rejects unknown Host
    // headers.delete("Host");

    const init: RequestInit = {
      method: request.method,
      headers,
      redirect: "follow",
    };
    if (request.method !== "GET" && request.method !== "HEAD") {
      init.body = request.body;
    }

    const response = await fetch(originUrl, init);
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  },
};
```

For SSE, the origin responds with a streaming body; the Worker streams it through. For `POST /message/:sessionId`, the request body is forwarded as-is.

## Step 4 — Configure Wrangler

Ensure `wrangler.toml` (or `wrangler.json`) has the correct name and that the Worker has access to the secret. Example minimal config:

```toml
name = "flexprice-mcp-proxy"
main = "src/index.ts"
compatibility_date = "2024-01-01"
```

No need to declare `MCP_ORIGIN` in the config; secrets are added via `wrangler secret put`.

## Step 5 — Deploy

```bash
npm run deploy
# or: npx wrangler deploy
```

After deploy, the Worker URL is `https://flexprice-mcp-proxy.<your-subdomain>.workers.dev`. Your **MCP endpoint** is:

```
https://flexprice-mcp-proxy.<your-subdomain>.workers.dev/sse
```

## Step 6 — Configure your MCP client

Set the URL to your Worker endpoint and the `ApiKeyAuth` header to your FlexPrice API key (HTTP-style config; see README for config file locations).

**Example (Cursor):**

```json
{
  "mcpServers": {
    "flexprice": {
      "url": "https://flexprice-mcp-proxy.<your-subdomain>.workers.dev/sse",
      "headers": {
        "ApiKeyAuth": "YOUR_API_KEY"
      }
    }
  }
}
```

The Worker forwards the `ApiKeyAuth` header to your origin MCP server.

## Optional — Custom domain

In the Cloudflare dashboard, go to Workers & Pages → your Worker → Settings → Domains & Routes, and add a custom domain (e.g. `mcp.yourdomain.com`). Then use `https://mcp.yourdomain.com/sse` in your MCP client.

## Summary

| Step | Action |
|------|--------|
| 1 | Create a Worker project with `npm create cloudflare@latest`. |
| 2 | Set secret: `npx wrangler secret put MCP_ORIGIN` (your MCP server origin URL). |
| 3 | Implement a fetch handler that proxies request to `MCP_ORIGIN + path`, preserving method, headers, and body. |
| 4 | Configure Wrangler (name, main, compatibility_date). |
| 5 | Deploy with `npm run deploy`. |
| 6 | In your MCP client, set URL to `https://<worker-url>/sse` and `ApiKeyAuth` header. |
