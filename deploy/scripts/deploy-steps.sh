#!/bin/bash

create_backup() {
    local vps_path="$1"

    rm -rf "${vps_path}.backup"
    cp -r "$vps_path" "${vps_path}.backup"
}

setup_env_files() {
    local vps_path="$1"
    
    mv "$vps_path/server/.env.prod" "$vps_path/server/.env"
    mv "$vps_path/client/.env.prod" "$vps_path/client/.env"
}

install_dependencies() {
    local vps_path="$1"
    
    cd "$vps_path" || exit
    npm run install-all
}

build_client() {
    local vps_path="$1"
    
    cd "$vps_path/client" || exit
    npm run build
    echo 'Build completed.'
}

manage_pm2_process() {
    local vps_path="$1"
    local pm2_service_name="$2"
    local env_file="$3"

    if pm2 describe "$pm2_service_name" > /dev/null; then
        # App exists - set envs and restart
        set_pm2_env_vars "$pm2_service_name" "$env_file"
        pm2 restart "$pm2_service_name"
        echo 'Server restarted.'
    else
        # App doesn't exist - start first, then set envs
        pm2 start "$vps_path/server/src/index.js" --name "$pm2_service_name"
        set_pm2_env_vars "$pm2_service_name" "$env_file"
        pm2 restart "$pm2_service_name"  # Restart to ensure envs are applied
        echo 'Server started for the first time with environment variables.'
    fi
}

cleanup_env_files() {
    local vps_path="$1"
    
    rm "$vps_path/server/.env"
    rm "$vps_path/client/.env"
    echo '.env files deleted.'
}