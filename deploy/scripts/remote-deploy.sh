#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)/deploy/scripts"

# Source all required scripts
source "${SCRIPT_DIR}/health-check.sh"
source "${SCRIPT_DIR}/rollback.sh"
source "${SCRIPT_DIR}/deploy-steps.sh"
source "${SCRIPT_DIR}/db-migrate.sh"

execute_deployment() {
    local vps_path="$1"
    local pm2_service_name="$2"
    local install_deps="$3"
    local keep_env="$4"
    local health_check_url="$5"
    local max_retries="$6"
    local retry_interval="$7"
    local env_file_path="$8"
    local run_migrations="$9"  # Migration flag

    echo "Starting deployment process..."
    echo "VPS Path: $vps_path"
    echo "PM2 Service: $pm2_service_name"
    echo "Run Migrations: $run_migrations"
    
    # Create backup
    create_backup "$vps_path"
    
    # Setup environment files
    setup_env_files "$vps_path"
    
    if [ "$install_deps" = true ]; then
        install_dependencies "$vps_path"
    fi
    
    # Run migrations if flag is set
    if [ "$run_migrations" = true ]; then
        echo "Running database migrations..."
        if ! perform_db_migration "$vps_path" "$env_file_path"; then
            echo "Migration failed, rolling back..."
            perform_rollback "$vps_path" "$pm2_service_name"
            exit 1
        fi
    fi
    
    # Build client
    build_client "$vps_path"
    
    # Manage PM2 process
    manage_pm2_process "$vps_path" "$pm2_service_name" "$env_file_path"
    
    # Health check
    if ! check_health "$health_check_url" "$max_retries" "$retry_interval"; then
        echo "Health check failed, rolling back..."
        perform_rollback "$vps_path" "$pm2_service_name"
        exit 1
    fi
    
    # Clean up if not keeping env files
    if [ "$keep_env" = false ]; then
        rm -f "$vps_path/server/.env" "$vps_path/client/.env"
    fi
    
    echo "Deployment completed successfully!"
}