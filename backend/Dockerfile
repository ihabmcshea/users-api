# Use Node.js image
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn

# Install nest for development
RUN yarn global add @nestjs/cli

# Generate Prisma client
RUN npx prisma generate

# Install development dependencies for linting and formatting
RUN yarn add --dev eslint prettier

# Copy application files
COPY . .

# Run linting and formatting checks
RUN yarn lint
RUN yarn prettier --check .

# Expose the application port
EXPOSE 4000

# Start the application in watch mode for development
CMD ["nest", "start", "--watch"]
