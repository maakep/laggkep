# Use the official lightweight Node.js 12 image.
# https://hub.docker.com/_/node
FROM node:12-slim

WORKDIR /app/frontend
COPY /frontend/package*.json ./
RUN npm install --only=production
COPY /frontend/ ./

RUN npm run build-production


WORKDIR /app/backend

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY /backend/package*.json ./
RUN npm install --only=production
COPY /backend/ ./
CMD [ "npm", "start" ]