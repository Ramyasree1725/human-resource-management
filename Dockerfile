# Employee Management System - Production Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy backend
COPY backend/package.json ./backend/
WORKDIR /app/backend
RUN npm install --omit=dev || true

COPY backend/src ./src
COPY backend/package.json ./

EXPOSE 5000

# Entry point
CMD ["node", "src/server.js"]
