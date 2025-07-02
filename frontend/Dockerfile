# Stage 1: Build the application using bun
FROM oven/bun:1 as builder
WORKDIR /app

# Add ARG for VITE_API_BASE_URL
ARG VITE_API_BASE_URL

# Set ENV for VITE_API_BASE_URL so Vite can pick it up during build
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Copy package manager files
COPY package.json bun.lockb ./

# Install dependencies
# Using --frozen-lockfile ensures we use the exact versions from the lock file
RUN bun install

# Copy the rest of the application source code
COPY . .

# Build the application for production
# The output will be in the /app/dist directory
RUN bun run build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine

# Set working directory
WORKDIR /usr/share/nginx/html

# Remove default Nginx static assets
RUN rm -rf ./*

# Copy built assets from the builder stage
COPY --from=builder /app/dist .

# By default, Nginx serves on port 80
EXPOSE 80

# When the container starts, run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
