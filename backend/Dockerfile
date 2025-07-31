# Use Node.js official image
FROM node:18

# Set working directory in container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all application files
COPY . .

# Move frontend files to public directory
RUN mv ./frontend/* ./backend/public

# Expose the port your app listens on
ENV PORT=8080
EXPOSE 8080

# Start the app
CMD ["npm", "start"]

