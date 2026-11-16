# ==============================================================================
# HandleMyFile — Enterprise Air-Gapped Client-Side Document Platform
# Multi-stage Docker build for 100% offline, zero-egress self-hosted environments.
# ==============================================================================

# --- Stage 1: Build the Client-Side WebAssembly Application ---
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json ./
COPY local-packages ./local-packages

# Install npm dependencies
RUN npm install --legacy-peer-deps

# Copy source code and build
COPY . .
RUN npx vite build

# --- Stage 2: Production Nginx Server (Air-Gapped / Zero-Egress) ---
FROM nginx:1.27-alpine AS runner

LABEL maintainer="HandleMyFile <dev@khairan.tech>"
LABEL description="HandleMyFile Enterprise On-Premise Air-Gapped Document Processing Platform"
LABEL version="1.0.0"

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose standard HTTP port
EXPOSE 80

# Health check to ensure Nginx is serving correctly
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1/healthz || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
