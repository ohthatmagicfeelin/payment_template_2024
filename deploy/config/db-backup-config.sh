#!/bin/bash

# Database Configuration
DB_NAME="${PG_DATABASE}"
DB_USER="${PG_USER}"
DB_HOST="${PG_HOST}"
DB_PORT="${PG_PORT}"
DB_PASSWORD="${PG_PASSWORD}"

# Backup Configuration
APP_NAME=$(basename "$REMOTE_ROOT")
BACKUP_DIR="${BACKUP_ROOT}/postgresql"   # Database-specific backups
BACKUP_LOG_DIR="$BACKUP_DIR/logs"

# Retention Configuration
DAILY_RETENTION=14    # Keep daily backups for 14 days
WEEKLY_RETENTION=8    # Keep weekly backups for 2 months
MONTHLY_RETENTION=12  # Keep monthly backups for 1 year