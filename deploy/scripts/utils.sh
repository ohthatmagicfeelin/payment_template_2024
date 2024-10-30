#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
NC='\033[0m' # No Color

message() {
    echo -e "${GREEN}$1${NC}"
}


set_pm2_env_vars() {
    local app_name="$1"
    local env_file="$2"

    # Check if parameters are provided
    if [ -z "$app_name" ] || [ -z "$env_file" ]; then
        echo "Error: app_name and env_file path are required"
        return 1
    fi

    # Check if env file exists
    if [ ! -f "$env_file" ]; then
        echo "Error: .env file not found at $env_file"
        return 1
    fi

    # Read .env file and set variables
    while IFS='=' read -r key value; do
        # Skip empty lines and comments
        if [[ ! -z "$key" && ! "$key" =~ ^# ]]; then
            # Remove any quotes from the value
            value=$(echo "$value" | tr -d '"' | tr -d "'")
            # Set the environment variable in PM2
            echo "Setting $key"
            pm2 set "$app_name:$key" "$value"
        fi
    done < "$env_file"
}