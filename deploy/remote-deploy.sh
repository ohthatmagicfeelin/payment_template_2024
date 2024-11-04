#!/bin/bash
# echo this location with dirname

PROJECT_ROOT=$(pwd)
DEPLOY_DIR="$PROJECT_ROOT/deploy"
source "$DEPLOY_DIR/config/deploy-config.sh"
source "$DEPLOY_DIR/setup/init-backup.sh"
source "$DEPLOY_DIR/scripts/core/deploy-steps.sh"
source "$DEPLOY_DIR/scripts/core/rollback.sh"
source "$DEPLOY_DIR/scripts/core/health-check.sh"
source "$DEPLOY_DIR/scripts/utils/utils.sh"
source "$DEPLOY_DIR/scripts/db/migrate.sh"
source "$DEPLOY_DIR/scripts/db/backup/utils.sh"   

execute_deployment() {
    local install_deps="$1"
    local keep_env="$2"
    local run_migrations="$3"


    echo "Starting deployment process..."
    echo "VPS Path: $PROJECT_ROOT"
    echo "PM2 Service: $PM2_SERVICE_NAME"
    echo "Run Migrations: $run_migrations"
    
    # Setup backup system if not already setup
    if [ ! -d "$PROJECT_ROOT/backups" ]; then
        setup_backup_system "$PROJECT_ROOT"
    fi

    # Create backup
    create_backup "$PROJECT_ROOT"
    
    # Setup environment files
    setup_env_files "$PROJECT_ROOT"
    
    if [ "$install_deps" = true ]; then
        install_dependencies "$PROJECT_ROOT"
    fi
    
    # Run migrations if flag is set
    if [ "$run_migrations" = true ]; then
        echo "Running database migrations..."
        if ! perform_db_migration "$ENV_PATH"; then
            echo "Migration failed, rolling back..."
            perform_rollback "$PROJECT_ROOT" "$PM2_SERVICE_NAME"
            exit 1
        fi
    fi
    
    # Build client
    build_client "$PROJECT_ROOT"
    
    # Manage PM2 process
    manage_pm2_process "$PROJECT_ROOT" "$PM2_SERVICE_NAME" "$ENV_PATH"
    
    # Health check
    if ! check_health "$HEALTH_CHECK_URL" "$MAX_RETRIES" "$RETRY_INTERVAL"; then
        echo "Health check failed, rolling back..."
        perform_rollback "$PROJECT_ROOT" "$PM2_SERVICE_NAME"
        exit 1
    fi
    
    # Clean up if not keeping env files
    if [ "$keep_env" = false ]; then
        rm -f "$PROJECT_ROOT/server/.env" "$PROJECT_ROOT/client/.env"
    fi
    

    echo "Deployment completed successfully!"
}