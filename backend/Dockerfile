FROM node:18-slim

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code and build directory
COPY . .

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"] 