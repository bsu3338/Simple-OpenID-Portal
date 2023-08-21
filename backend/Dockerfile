# Use an official Python runtime based on Alpine as the base image
FROM python:3.9-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the Python script and any other necessary files
COPY backend_queue.py ./

# Install the required Python packages
# We'll first add build-base for any Python packages that might need compiling
RUN apk add --no-cache build-base && \
    pip install watchdog && \
    apk del build-base

# Specify the command to run when the container starts
CMD ["python", "./backend_queue.py"]

