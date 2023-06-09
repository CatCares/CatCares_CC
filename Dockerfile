# Use the official Node.js 14 base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Expose the port on which your Node.js application listens
EXPOSE 8080

# Define the command to run your application
CMD ["npm", "start"]