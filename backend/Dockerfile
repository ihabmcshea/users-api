# Use Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json tsconfig.json .
RUN yarn 

# Install nest CLI globally
RUN yarn global add @nestjs/cli

# Copy all application files
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose the port your app runs on
EXPOSE 4000

RUN chmod 644 tsconfig.json

# Start the application in development mode with live reloading
CMD ["yarn", "run", "start:dev"]
