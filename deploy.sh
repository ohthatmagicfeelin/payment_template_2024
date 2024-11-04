#!/bin/bash

# Get the root directory of the project
ROOT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Source required files
source "$ROOT_DIR/deploy/config/deploy-config.sh"
source "$ROOT_DIR/deploy/scripts/utils/parse-args.sh"
source "$ROOT_DIR/deploy/scripts/utils/utils.sh"


# Parse command line arguments
parse_arguments "$@"

# Deploy the project with exclusions
message "Deploying project files..."
rsync -avz --delete \
           --exclude '**/node_modules' \
           --exclude '**/node_modules/**' \
           --exclude '**/package-lock.json' \
           --exclude '.git' \
           --exclude '.git*' \
           --exclude '.env' \
           --exclude '.env.*' \
           --exclude '**/dist' \
           --exclude '**/build' \
           "$ROOT_DIR/" \
           "$VPS_ALIAS:$VPS_PATH/"


# Create and execute the remote deployment script
message "Starting remote deployment..."

#make sure the deploy-config.sh file is executable
# ssh "$VPS_ALIAS" "chmod +x $VPS_PATH/deploy/deploy-config.sh"

ssh "$VPS_ALIAS" \
    "cd $VPS_PATH && \
    npm run remote-deploy \
        $INSTALL_DEPS \
        $KEEP_ENV \
        $RUN_MIGRATIONS"

echo "Deployment completed successfully!"