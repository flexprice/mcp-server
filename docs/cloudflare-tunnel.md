# Deploy FlexPrice MCP server with Cloudflare Tunnel

This guide shows how to expose your FlexPrice MCP server through **Cloudflare Tunnel (cloudflared)** so it is reachable at an HTTPS URL. No code changes are required; you run the existing Node/SSE server and tunnel it through Cloudflare.

## Prerequisites

- The FlexPrice MCP server running locally (Docker or `npm start`) or on a host you can reach (e.g. VPS).
- **Quick tunnel:** No Cloudflare account required; you get a temporary `*.trycloudflare.com` URL.
- **Named tunnel / custom domain:** A Cloudflare account and (for custom domain) a domain added to Cloudflare.

## Step 1 — Run the MCP server

Start the server on the machine where you will run cloudflared (e.g. your laptop or a VPS).

**Option A — Docker**

```bash
docker build -t flexprice-mcp .
docker run -p 2718:2718 -e BASE_URL=https://api.cloud.flexprice.io/v1 flexprice-mcp
```

The server listens on port 2718. API key is provided per connection via the `ApiKeyAuth` header from the client.

**Option B — Local (from repo)**

```bash
cd mcp-server
npm install && npm run build
# Create .env with BASE_URL=https://api.cloud.flexprice.io/v1 (and optionally API_KEY_APIKEYAUTH for testing)
npm start
```

By default the server uses port 2718; you can set `PORT` if needed. Note the port for the next step (e.g. `2718`).

## Step 2 — Install cloudflared

Install the Cloudflare Tunnel client:

- **macOS (Homebrew):** `brew install cloudflared`
- **Other:** See [Cloudflare: Install cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/)

For a **quick tunnel** (no account), you can skip login. For a **named tunnel** or custom domain, log in once:

```bash
cloudflared tunnel login
```

This opens a browser to authorize cloudflared with your Cloudflare account.

## Step 3 — Run a quick tunnel (fastest)

From the same machine where the MCP server is running:

```bash
cloudflared tunnel --url http://localhost:2718
```

Replace `2718` with the port your server uses if different. cloudflared will print a URL like:

```
Your quick Tunnel has been created! Visit it at:
https://random-words-here.trycloudflare.com
```

Your **MCP endpoint** is:

```
https://<that-host>/sse
```

Example: if the host is `abc-xyz-123.trycloudflare.com`, use `https://abc-xyz-123.trycloudflare.com/sse`.

This URL may change each time you restart the quick tunnel. For a stable URL, use a named tunnel (Step 4).

## Step 4 — Named tunnel (optional, stable URL / custom domain)

For a persistent or custom URL:

1. **Create a tunnel:**

   ```bash
   cloudflared tunnel create flexprice-mcp
   ```

   Note the tunnel ID and the path to the generated credentials file (e.g. `~/.cloudflared/<id>.json`).

2. **Create a config file** (e.g. `~/.cloudflared/config.yml`):

   ```yaml
   tunnel: <TUNNEL_ID>
   credentials-file: /path/to/<id>.json

   ingress:
     - hostname: mcp.yourdomain.com   # or a route like flexprice-mcp.<account>.cfargotunnel.com
       service: http://localhost:2718
     - service: http_status:404
   ```

   Replace `<TUNNEL_ID>`, the credentials path, and `hostname` as needed. For a free `*.cfargotunnel.com` route, use the hostname Cloudflare assigns when you run the tunnel.

3. **Route the hostname to the tunnel** (Cloudflare dashboard or CLI):

   ```bash
   cloudflared tunnel route dns flexprice-mcp mcp.yourdomain.com
   ```

   (Use the hostname you chose in the config.)

4. **Run the tunnel:**

   ```bash
   cloudflared tunnel run flexprice-mcp
   ```

Your MCP endpoint is then `https://mcp.yourdomain.com/sse` (or `https://<assigned-host>/sse`).

## Step 5 — Run the server in Docker on a VPS (optional)

For a production-like setup where the server and tunnel run on a VPS:

1. On the VPS, clone the repo, build the Docker image, and run the container (as in Step 1 Option A), binding port 2718.
2. Install cloudflared on the same VPS.
3. Run either a quick tunnel or a named tunnel pointing at `http://localhost:2718` (or `http://127.0.0.1:2718`).
4. Use the resulting public URL (e.g. `https://<tunnel-host>/sse`) in your MCP client.

Keep the tunnel running (e.g. with systemd or a process manager) so the URL stays available.

## Step 6 — Configure your MCP client

Use the same **remote** config as in the main README ([Add to your MCP client](../README.md#add-to-your-mcp-client)), but set the server URL to your Tunnel URL.

**Example (Cursor):** Replace the URL with your Tunnel endpoint:

```json
{
  "mcpServers": {
    "flexprice": {
      "url": "https://<tunnel-host>/sse",
      "headers": {
        "ApiKeyAuth": "YOUR_API_KEY"
      }
    }
  }
}
```

Use your FlexPrice API key for `ApiKeyAuth`. Same pattern applies for VS Code, Claude Desktop (if it supports HTTP with headers), and other clients — see the README for per-editor config.

## Summary

| Step | Action |
|------|--------|
| 1 | Run MCP server (Docker or `npm start`) on a port (e.g. 2718). |
| 2 | Install cloudflared; optionally `cloudflared tunnel login` for named/custom domain. |
| 3 | Quick tunnel: `cloudflared tunnel --url http://localhost:PORT` → use `https://<printed-host>/sse`. |
| 4 | (Optional) Named tunnel + config + DNS for a stable or custom URL. |
| 5 | (Optional) Run server + tunnel on a VPS for 24/7 availability. |
| 6 | In your MCP client, set URL to `https://<tunnel-host>/sse` and header `ApiKeyAuth` to your API key. |
