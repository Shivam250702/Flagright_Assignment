# syntax=docker/dockerfile:1

### 1. Base image for installing all dependencies
FROM node:20-slim AS deps
WORKDIR /app

# Add the Debian "Buster" (old) repository to find libssl1.1
RUN echo "deb http://archive.debian.org/debian/ buster main" > /etc/apt/sources.list.d/buster.list
# Update package list and install the required library
RUN apt-get update && apt-get install -y libssl1.1

# Copy package files and install ALL dependencies
COPY package.json package-lock.json* ./
RUN npm ci

### 2. Builder image for compiling the application
FROM node:20-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

### 3. Final, lightweight production image
FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install the required OpenSSL library again in the final stage
RUN echo "deb http://archive.debian.org/debian/ buster main" > /etc/apt/sources.list.d/buster.list
RUN apt-get update && apt-get install -y libssl1.1

# Copy package files and install ONLY production dependencies
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Copy the compiled application code and the generated Prisma client from the 'build' stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/prisma/schema.prisma ./prisma/schema.prisma

EXPOSE 4000
CMD ["node", "