#!/bin/bash

# Import VPS configuration
PROJECT_ROOT=$(pwd)
source "$PROJECT_ROOT/deploy/config/deploy-config.sh"

# Database Configuration
DB_NAME="${PG_DATABASE}"
DB_USER="${PG_USER}"
DB_HOST="${PG_HOST}"
DB_PORT="${PG_PORT}"
DB_PASSWORD="${PG_PASSWORD}"

# Backup Configuration
BACKUP_DIR="${VPS_PATH}/backups/postgresql"
BACKUP_LOG_DIR="$BACKUP_DIR/logs"

# Retention Configuration
DAILY_RETENTION=14    # Keep daily backups for 14 days
WEEKLY_RETENTION=8    # Keep weekly backups for 2 months
MONTHLY_RETENTION=12  # Keep monthly backups for 1 year