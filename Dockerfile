# Use Node.js official image
FROM node:18

# Set working directory in container
WORKDIR /app

# Copy backend package.json and package-lock.json
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy backend code
COPY backend/server.js ./

# Create public directory and copy frontend files
RUN mkdir -p public
COPY frontend/ ./public/

# Expose the port your app listens on
ENV PORT=8080
EXPOSE 8080

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/ || exit 1

# Start the app
CMD ["npm", "start"]
