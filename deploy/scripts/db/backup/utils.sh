#!/bin/bash


# Logging function
log_message() {
    local message="$1"
    local log_file="$BACKUP_DIR/logs/backup_$(date +%Y%m%d).log"
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $message" | tee -a "$log_file"
}

# Backup verification function
verify_backup() {
    local backup_file="$1"
    
    # Validate backup file exists
    [ ! -f "$backup_file" ] && { log_message "Error: Backup file does not exist: $backup_file"; return 1; }
    
    # Validate required environment variables
    [ -z "$DB_HOST" ] && { log_message "Error: DB_HOST not set"; return 1; }
    [ -z "$DB_PORT" ] && { log_message "Error: DB_PORT not set"; return 1; }
    [ -z "$DB_NAME" ] && { log_message "Error: DB_NAME not set"; return 1; }
    [ -z "$DB_BACKUP_USER" ] && { log_message "Error: DB_BACKUP_USER not set"; return 1; }
    [ -z "$DB_BACKUP_PASS" ] && { log_message "Error: DB_BACKUP_PASS not set"; return 1; }
    
    local temp_db="verify_${DB_NAME}_${RANDOM}"
    
    log_message "Verifying backup: $backup_file"
    
    export PGPASSWORD="$DB_BACKUP_PASS"
    
    # Create temporary database
    if ! createdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_BACKUP_USER" "$temp_db"; then
        log_message "Error: Failed to create temporary database for verification"
        unset PGPASSWORD
        return 1
    fi
    
    # Restore backup to temporary database
    if gunzip -c "$backup_file" | psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_BACKUP_USER" "$temp_db" > /dev/null 2>&1; then
        log_message "Backup verification successful"
        dropdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_BACKUP_USER" "$temp_db"
        unset PGPASSWORD
        return 0
    else
        log_message "Error: Backup verification failed!"
        dropdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_BACKUP_USER" "$temp_db"
        unset PGPASSWORD
        return 1
    fi
}

# Cleanup old backups
cleanup_old_backups() {
    local type="$1"
    local retention="$2"
    
    # Validate retention is a positive number
    [[ ! "$retention" =~ ^[0-9]+$ ]] && { log_message "Error: Retention period must be a positive number"; return 1; }
    
    # Validate backup directory exists
    [ ! -d "$BACKUP_DIR" ] && { log_message "Error: Backup directory $BACKUP_DIR does not exist"; return 1; }
    
    # Validate backup type directory exists
    [ ! -d "$BACKUP_DIR/$type" ] && { log_message "Error: Backup type directory $BACKUP_DIR/$type does not exist"; return 1; }
    
    find "$BACKUP_DIR/$type" -name "${DB_NAME}_${type}_*.sql.gz" -mtime +"$retention" -delete
    log_message "Cleaned up $type backups older than $retention days"
} 