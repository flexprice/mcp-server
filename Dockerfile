# ===== BUILD STAGE =====
FROM node:22.12-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN --mount=type=cache,target=/root/.npm npm install

RUN --mount=type=cache,target=/root/.npm-production npm ci --ignore-scripts --omit-dev


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

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy necessary files for runtime
COPY --from=builder /app/LICENSE ./LICENSE
COPY --from=builder /app/README.md ./README.md


# Command to run the application
CMD ["node", "dist/server.js"] 