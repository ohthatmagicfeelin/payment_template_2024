#!/bin/bash

execute_deployment() {
    # Validate all required parameters are provided
    if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ]; then
        echo "Error: Missing required parameters in execute_deployment"
        echo "Usage: execute_deployment <install_deps> <keep_env> <run_migrations>"
        exit 1
    fi

    local install_deps="$1"
    local keep_env="$2"
    local run_migrations="$3"

    echo "Configuration:"
    echo "  • Run Migrations: $run_migrations"
    echo "  • Install Dependencies: $install_deps"
    echo "  • Keep Env Files: $keep_env"
    
    # Initialize backup system
    setup_database_backup_system
    
    # Perform pre-deployment steps
    perform_pre_deployment_steps
    
    # Run deployment steps
    if ! perform_deployment_steps "$install_deps" "$run_migrations"; then
        echo "Deployment steps failed, rolling back..."
        perform_rollback 
        exit 1
    fi
    
    # Perform post-deployment steps
    if ! perform_post_deployment_steps "$keep_env"; then
        echo "Post-deployment steps failed, rolling back..."
        perform_rollback 
        exit 1
    fi

} 