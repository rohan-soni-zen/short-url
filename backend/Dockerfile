FROM node:18-slim

WORKDIR /app

# Copy frontend package files first
COPY ../_frontend/package*.json ./_frontend/
WORKDIR /app/_frontend
RUN npm ci

# Copy frontend source code
COPY ../_frontend/ ./

# Build the frontend
RUN npm run build

# Return to main app directory
WORKDIR /app

# Copy backend package files
COPY package*.json ./
RUN npm ci --only=production

# Copy backend source code
COPY . .

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"] 