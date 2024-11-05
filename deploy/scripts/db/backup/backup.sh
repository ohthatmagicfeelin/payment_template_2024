#!/bin/bash

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Source utils from the same directory
source "$SCRIPT_DIR/utils.sh"
source "$SCRIPT_DIR/backup-credentials.conf"

validate_inputs() {
    # Check required env vars
    [ -z "$DB_HOST" ] && { log_message "Error: DB_HOST not set"; return 1; }
    [ -z "$DB_PORT" ] && { log_message "Error: DB_PORT not set"; return 1; }
    [ -z "$DB_NAME" ] && { log_message "Error: DB_NAME not set"; return 1; }
    [ -z "$DB_BACKUP_USER" ] && { log_message "Error: DB_BACKUP_USER not set"; return 1; }
    [ -z "$DB_BACKUP_PASS" ] && { log_message "Error: DB_BACKUP_PASS not set"; return 1; }
    [ -z "$BACKUP_DIR" ] && { log_message "Error: BACKUP_DIR not set"; return 1; }
    
    # Check backup directory
    [ ! -d "$BACKUP_DIR" ] && { log_message "Error: Backup directory $BACKUP_DIR does not exist"; return 1; }
    [ ! -w "$BACKUP_DIR" ] && { log_message "Error: Backup directory $BACKUP_DIR is not writable"; return 1; }
    
    # Check retention periods
    [ -z "$DAILY_RETENTION" ] && { log_message "Error: DAILY_RETENTION not set"; return 1; }
    [ -z "$WEEKLY_RETENTION" ] && { log_message "Error: WEEKLY_RETENTION not set"; return 1; }
    [ -z "$MONTHLY_RETENTION" ] && { log_message "Error: MONTHLY_RETENTION not set"; return 1; }
    [ -z "$DEBUG_RETENTION" ] && { log_message "Error: DEBUG_RETENTION not set"; return 1; }

    [[ ! "$DAILY_RETENTION" =~ ^[0-9]+$ ]] && { log_message "Error: DAILY_RETENTION must be a number"; return 1; }
    [[ ! "$WEEKLY_RETENTION" =~ ^[0-9]+$ ]] && { log_message "Error: WEEKLY_RETENTION must be a number"; return 1; }
    [[ ! "$MONTHLY_RETENTION" =~ ^[0-9]+$ ]] && { log_message "Error: MONTHLY_RETENTION must be a number"; return 1; }
    [[ ! "$DEBUG_RETENTION" =~ ^[0-9]+$ ]] && { log_message "Error: DEBUG_RETENTION must be a number"; return 1; }
    return 0
}

perform_backup() {
    # Add validation before proceeding with backup
    if ! validate_inputs; then
        log_message "Error: Input validation failed"
        return 1
    fi

    local type="$1"  # daily, weekly, or monthly
    local backup_path="$BACKUP_DIR/$type"
    
    # Add directory creation and permission check
    mkdir -p "$backup_path"
    if [ ! -d "$backup_path" ] || [ ! -w "$backup_path" ]; then
        log_message "Error: Cannot create or write to backup path: $backup_path"
        return 1
    fi

    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local backup_file="$backup_path/${DB_NAME}_${type}_${timestamp}.sql"
    
    # Add debug logging
    log_message "Attempting backup to: $backup_file"
    log_message "Using DB_HOST: $DB_HOST, DB_PORT: $DB_PORT, DB_NAME: $DB_NAME"
    
    log_message "Starting $type backup of database: $DB_NAME"
    
    export PGPASSWORD="$DB_BACKUP_PASS"
    
    # Perform backup with error capture
    if ! pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_BACKUP_USER" "$DB_NAME" > "$backup_file" 2> /tmp/pg_dump_error.log; then
        log_message "Error: $type backup failed! Error output:"
        cat /tmp/pg_dump_error.log
        unset PGPASSWORD
        return 1
    fi
    
    # Compress backup
    gzip "$backup_file"
    backup_file="${backup_file}.gz"
    
    # Verify backup
    if ! verify_backup "$backup_file"; then
        log_message "Error: Backup verification failed, removing invalid backup"
        rm "$backup_file"
        return 1
    fi
    
    log_message "$type backup completed and verified successfully: $backup_file"
    unset PGPASSWORD
    
    # Cleanup old backups
    local retention_var="${type^^}_RETENTION"
    cleanup_old_backups "$type" "${!retention_var}"

    log_message ""
}

# Main backup process
main() {
    log_message "Backup started at $(date)"
    case "$1" in
        "daily"|"weekly"|"monthly"|"debug")
            perform_backup "$1"
            ;;
        *)
            echo "Usage: $0 {daily|weekly|monthly|debug}"
            exit 1
            ;;
    esac
}

main "$@" 