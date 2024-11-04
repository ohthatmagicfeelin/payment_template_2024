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

    echo "Setting environment variables from $env_file"

    # Read all variables first
    declare -A env_vars
    while IFS='=' read -r key value; do
        # Skip empty lines and comments
        if [[ ! -z "$key" && ! "$key" =~ ^# ]]; then
            # Remove any quotes and trailing whitespace from the value
            value=$(echo "$value" | tr -d '"' | tr -d "'" | xargs)
            env_vars["$key"]="$value"
        fi
    done < "$env_file"

    # Set all variables at once
    for key in "${!env_vars[@]}"; do
        echo "Setting $key"
        pm2 set "$app_name:$key" "${env_vars[$key]}" >/dev/null 2>&1
    done
}



deploy_directory() {
    local src="$1"
    local dest="$2"
    local name="$3"  # For messages (e.g., "server" or "client")
    local vps_alias="$4"

    message "Deploying ${name}..."
    if [ "$INSTALL_DEPS" = true ]; then
        # If -i flag is used, remove node_modules and do a clean sync
        ssh "$vps_alias" "rm -rf $dest/node_modules"
        rsync -avz --delete --exclude 'node_modules' --exclude '.env' --exclude 'package-lock.json' \
            "$src/" "$vps_alias:$dest/"
    else
        # If no -i flag, sync while preserving existing node_modules
        rsync -avz --exclude 'node_modules' --exclude '.env' --exclude 'package-lock.json' \
            "$src/" "$vps_alias:$dest/"
    fi
}
