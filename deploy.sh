#!/bin/bash

# Get the root directory of the project
ROOT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Get the deploy directory
DEPLOY_DIR="$ROOT_DIR/deploy"

# Source required files
source "$DEPLOY_DIR/deploy-config.sh"
source "$DEPLOY_DIR/scripts/utils.sh"
source "$DEPLOY_DIR/scripts/remote-deploy.sh"

# Default values for flags
INSTALL_DEPS=false
KEEP_ENV=false

# Parse command line arguments
while getopts "ik" opt; do
    case $opt in
        i)
            INSTALL_DEPS=true
            ;;
        k)
            KEEP_ENV=true
            ;;
        \?)
            echo "Invalid option: -$OPTARG" >&2
            echo "Usage: $0 [-i] [-k]" >&2
            echo "  -i    Install dependencies" >&2
            echo "  -k    Keep .env files" >&2
            exit 1
            ;;
    esac
done

# Deploy app package.json
message "Deploying app package.json..."
rsync -avz "$ROOT_DIR/package.json" "$VPS_ALIAS:$VPS_PATH/"

# Deploy server
message "Deploying server..."
rsync -az --delete --exclude 'node_modules' --exclude '.env' --exclude 'package-lock.json' \
    "$ROOT_DIR/server/" "$VPS_ALIAS:$VPS_PATH/server/"

# Deploy client
message "Deploying client..."
rsync -az --delete --exclude 'node_modules' --exclude '.env' --exclude 'package-lock.json' \
    "$ROOT_DIR/client/" "$VPS_ALIAS:$VPS_PATH/client/"

# Create and execute the remote deployment script
message "Starting remote deployment..."

ssh "$VPS_ALIAS" "
    # Part 1: Function Declarations
    $(declare -f execute_deployment \
                  check_health \
                  perform_rollback \
                  create_backup \
                  setup_env_files \
                  install_dependencies \
                  build_client \
                  manage_pm2_process \
                  cleanup_env_files \
                  set_pm2_env_vars \
                  )

    # Part 2: Actual Command Execution
    execute_deployment \
        '$VPS_PATH' \
        '$PM2_SERVICE_NAME' \
        $INSTALL_DEPS \
        $KEEP_ENV \
        '$HEALTH_CHECK_URL' \
        $MAX_RETRIES \
        $RETRY_INTERVAL \
        '$ENV_PATH'
"

echo "Deployment completed successfully!"