#!/bin/bash

PROJECT_ROOT=$(pwd)
source "$PROJECT_ROOT/deploy/config/backup-config.sh"


# Logging function
log_message() {
    local message="$1"
    local log_file="$BACKUP_LOG_DIR/backup_$(date +%Y%m%d).log"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $message" | tee -a "$log_file"
}

# Backup verification function
verify_backup() {
    local backup_file="$1"
    local temp_db="verify_${DB_NAME}_${RANDOM}"
    
    log_message "Verifying backup: $backup_file"
    
    export PGPASSWORD="$DB_PASSWORD"
    
    # Create temporary database
    if ! createdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$temp_db"; then
        log_message "Error: Failed to create temporary database for verification"
        unset PGPASSWORD
        return 1
    fi
    
    # Restore backup to temporary database
    if gunzip -c "$backup_file" | psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$temp_db"; then
        log_message "Backup verification successful"
        dropdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$temp_db"
        unset PGPASSWORD
        return 0
    else
        log_message "Error: Backup verification failed!"
        dropdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$temp_db"
        unset PGPASSWORD
        return 1
    fi
}

# Cleanup old backups
cleanup_old_backups() {
    local type="$1"
    local retention="$2"
    
    find "$BACKUP_DIR/$type" -name "${DB_NAME}_${type}_*.sql.gz" -mtime +"$retention" -delete
    log_message "Cleaned up $type backups older than $retention days"
} 