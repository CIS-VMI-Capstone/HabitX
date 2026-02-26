# Use the official Node.js image as the base image
FROM node:24.13.1

# Set the working directory in the container
WORKDIR /HabitX

# Copy the application files into the working directory
COPY . /HabitX

# Install the application dependencies
RUN npm install

# Define the entry point for the container
CMD ["npm", "start"]