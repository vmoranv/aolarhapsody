# Stage 1: Build the application
FROM node:22-slim AS builder

# Set working directory
WORKDIR /app

# Copy package.json and lockfile
COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY .npmrc ./

# Copy frontend and backend package.json
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/

# Install dependencies
RUN npm install -g pnpm && apt-get update && apt-get install -y git
RUN git init
RUN pnpm install --frozen-lockfile

# Copy the rest of the application source code
COPY . .

# Build the frontend and backend applications
RUN pnpm --filter frontend build
RUN pnpm --filter backend build

# Stage 2: Production environment
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built frontend from the builder stage
COPY --from=builder /app/frontend/dist /usr/share/nginx/html

# Copy nginx config
COPY scripts/deploy/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
