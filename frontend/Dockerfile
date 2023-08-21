# Use an official Node.js runtime as the base image
FROM node:lts

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available) to the container
COPY package*.json ./

# Install the application's dependencies inside the container
RUN npm install

# If building for production, you can only install `dependencies` and skip `devDependencies`:
# RUN npm ci --only=production

# Copy the rest of the application's files to the container
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Specify the command to run when the container starts
CMD [ "node", "dist/app.js" ]  # Assuming the output directory of tsc is "dist"
