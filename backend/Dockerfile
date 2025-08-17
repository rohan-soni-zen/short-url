FROM node:18-slim

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