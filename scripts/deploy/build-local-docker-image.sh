#!/bin/bash

set -e

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
LOG_FILE=${SCRIPT_DIR}/build-local-docker-image.log
PROJECT_ROOT=${SCRIPT_DIR}/../../

echo "Info: Starting Docker Compose build" | tee ${LOG_FILE}

cd ${PROJECT_ROOT}

# Build and run the services in detached mode
docker-compose up --build -d 1>> ${LOG_FILE} 2>> ${LOG_FILE}

if [ $? -eq 0 ]; then
    echo "Docker containers built and started successfully." | tee -a ${LOG_FILE}
    echo "Frontend should be available at http://localhost" | tee -a ${LOG_FILE}
    echo "Backend is running on port 3000" | tee -a ${LOG_FILE}
else
    echo "Error: Docker Compose build failed. Check ${LOG_FILE} for details." | tee -a ${LOG_FILE}
    exit 1
fi