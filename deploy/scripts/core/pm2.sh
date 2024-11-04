#!/bin/bash

source "$DEPLOY_DIR/scripts/utils/utils.sh"

manage_pm2_process() {
    local vps_path="$1"
    local pm2_service_name="$2"
    local env_file="$3"
    echo "env_file: ${env_file}"

    if ! pm2 describe "$pm2_service_name" > /dev/null; then
        # Only start if app doesn't exist
        pm2 start "$vps_path/server/src/index.js" --name "$pm2_service_name"
        echo 'Server started for the first time.'
    fi

    set_pm2_env_vars "$pm2_service_name" "$env_file"
    pm2 restart "$pm2_service_name"  # Restart to ensure envs are applied
    echo 'Server restarted.'
    pm2 save 
} 