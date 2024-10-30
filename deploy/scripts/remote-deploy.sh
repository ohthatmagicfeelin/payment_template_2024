#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)/deploy/scripts"

# Source files from the same directory
source "${SCRIPT_DIR}/health-check.sh"
source "${SCRIPT_DIR}/rollback.sh"
source "${SCRIPT_DIR}/deploy-steps.sh"



execute_deployment() {
    local vps_path="$1"
    local pm2_service_name="$2"
    local install_deps="$3"
    local keep_env="$4"
    local health_check_url="$5"
    local max_retries="$6"
    local retry_interval="$7"
    local env_file_path="$8"


    # Create backup
    create_backup "$vps_path"
    
    # Setup environment
    setup_env_files "$vps_path"
    
    # Install dependencies if requested
    if [ "$install_deps" = true ]; then
        install_dependencies "$vps_path"
    fi
    
    # Build and deploy
    build_client "$vps_path"
    manage_pm2_process "$vps_path" "$pm2_service_name" "$env_file_path"
    
    # Health check and rollback if needed
    if ! check_health "$health_check_url" "$max_retries" "$retry_interval"; then
        echo 'Health check failed, initiating rollback...'
        perform_rollback "$vps_path" "$pm2_service_name"
        return 1
    fi
    
    # Cleanup if needed
    if [ "$keep_env" = false ]; then
        cleanup_env_files "$vps_path"
    fi
    
    echo 'Deployment process completed.'
    return 0
}