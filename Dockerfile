# ===== BUILD STAGE =====
FROM node:22.12-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (keep devDependencies for npm run build / tsc)
RUN --mount=type=cache,target=/root/.npm npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# ===== PRODUCTION STAGE =====
FROM node:22.12-alpine AS production

# Set working directory
WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV=production

# Copy package files from builder stage
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm ci --production

# Copy built application from builder stage (Speakeasy-generated MCP server)
COPY --from=builder /app/bin ./bin

# Copy necessary files for runtime
COPY --from=builder /app/LICENSE ./LICENSE
COPY --from=builder /app/README.md ./README.md

# Expose port for SSE transport (default 2718; platforms may set PORT)
ENV PORT=2718
EXPOSE 2718

# Run the MCP server in HTTP (SSE) mode when using SSE transport.
# Set BASE_URL to your FlexPrice API base (e.g. https://api.cloud.flexprice.io/v1).
# API key is provided per-connection via ApiKeyAuth header from the client.
CMD ["sh", "-c", "node bin/mcp-server.js start --transport sse --port ${PORT:-2718}"] 