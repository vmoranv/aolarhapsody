# Stage 1: Build the application
FROM node:22-slim AS builder

# Set environment variables
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_OPTIONS=--max-old-space-size=8192
ENV TZ=Asia/Shanghai

# Install pnpm and git
RUN npm i -g pnpm && apt-get update && apt-get install -y git

# Set working directory
WORKDIR /app

# Copy all files to the app directory
COPY . /app

# Initialize a git repository to allow lefthook to run
RUN git init

# Install dependencies with caching
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Build the backend
RUN pnpm --filter backend build

# Create a deployment bundle for the backend
RUN pnpm --filter backend deploy --legacy /app/deploy

# Stage 2: Production environment
FROM node:22-slim AS production

WORKDIR /app

# Copy the deployment bundle from the builder stage
COPY --from=builder /app/deploy .
# Copy the .env file from the builder stage
COPY --from=builder /app/backend/.env .

# Expose port and start the backend
EXPOSE 3000
CMD ["node", "dist/index.js"]