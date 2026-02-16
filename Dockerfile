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

# Run the generated MCP server
CMD ["node", "bin/mcp-server.js", "start"] 