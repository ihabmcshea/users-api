# Use Node.js as the base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json
COPY package.json .

# Install dependencies
RUN yarn

# Copy the rest of the application code
COPY . .

# Expose the port for the frontend
EXPOSE 3000

# Command to run the application in development mode
CMD ["yarn", "dev"]
