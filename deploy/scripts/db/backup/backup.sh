#!/bin/bash

source "$DEPLOY_DIR/scripts/db/backup/utils.sh"

perform_backup() {
    local type="$1"  # daily, weekly, or monthly
    local backup_path="$BACKUP_DIR/$type"
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local backup_file="$backup_path/${DB_NAME}_${type}_${timestamp}.sql"
    
    log_message "Starting $type backup of database: $DB_NAME"
    
    export PGPASSWORD="$DB_PASSWORD"
    
    # Perform backup
    if ! pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME" > "$backup_file"; then
        log_message "Error: $type backup failed!"
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
    cleanup_old_backups "$type" "${type^^}_RETENTION"
}

# Main backup process
main() {
    case "$1" in
        "daily"|"weekly"|"monthly")
            perform_backup "$1"
            ;;
        *)
            echo "Usage: $0 {daily|weekly|monthly}"
            exit 1
            ;;
    esac
}

main "$@" 