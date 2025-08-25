# Use Node.js 18 Alpine for x86_64 (Cloud Run compatibility)
FROM --platform=linux/amd64 node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files for both Express app and React app
COPY package*.json ./
COPY bingo/package*.json ./bingo/

# Install dependencies for both apps
RUN npm ci --only=production
WORKDIR /app/bingo
RUN npm ci --only=production
WORKDIR /app

# Copy React app source code
COPY bingo/src ./bingo/src
COPY bingo/public ./bingo/public

# Build the React app
WORKDIR /app/bingo
RUN npm run build
WORKDIR /app

# Copy Express app code
COPY app.js ./

# Expose port (Cloud Run will override this with PORT env var)
EXPOSE 8080

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Start the application
CMD ["node", "app.js"]
