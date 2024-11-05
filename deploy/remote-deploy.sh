#!/bin/bash

perform_deployment() {
    local install_deps="$1"
    local keep_env="$2"
    local run_migrations="$3"

    # Source configurations
    source "$(pwd)/deploy/config/deploy-config.sh"
    source "$DEPLOY_DIR/config/backup-credentials.conf"

    # Source utility scripts
    source "$DEPLOY_DIR/scripts/utils/utils.sh"

    # Source core deployment scripts
    source "$DEPLOY_DIR/scripts/core/rollback.sh"
    source "$DEPLOY_DIR/scripts/core/deployment-steps.sh"
    source "$DEPLOY_DIR/scripts/core/deployment.sh"

    # execute deployment
    execute_deployment "$install_deps" "$keep_env" "$run_migrations"
}

# Show usage information
show_usage() {
    echo "Usage: $0 <install_deps> <keep_env> <run_migrations>"
    echo "Parameters:"
    echo "  install_deps    : true/false - Whether to install dependencies"
    echo "  keep_env       : true/false - Whether to keep .env files after deployment"
    echo "  run_migrations : true/false - Whether to run database migrations"
    exit 1
}

# Run only if executed directly
if [ "${BASH_SOURCE[0]}" = "$0" ]; then
    # Check if all parameters are provided
    if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ]; then
        echo "Error: Missing required parameters"
        show_usage
    fi

    # Validate parameter values
    for param in "$1" "$2" "$3"; do
        if [ "$param" != "true" ] && [ "$param" != "false" ]; then
            echo "Error: Parameters must be 'true' or 'false'"
            show_usage
        fi
    done

    perform_deployment "$1" "$2" "$3"
fi
