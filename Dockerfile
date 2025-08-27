FROM node:lts-slim AS base

# Set the working directory in the container.
WORKDIR /usr/src/appName

# Install dependencies.
COPY package*.json ./

# Install only production dependencies
RUN npm ci

# Copy the rest of the source code.
COPY . .

# Build the project
RUN npm run build

# Remove devDependencies to shrink image
RUN npm prune --omit=dev

# Reusable runtime stage for different environments
FROM node:lts-slim AS uat-env

WORKDIR /usr/src/appName

# Copy built files and dependencies from base
COPY --from=base /usr/src/appName/package*.json ./
COPY --from=base /usr/src/appName/node_modules ./node_modules
COPY --from=base /usr/src/appName/dist ./dist

# Set production environment
ENV NODE_ENV=production

# Expose the port
EXPOSE 4000

# Start the application.
CMD ["npm", "start"]