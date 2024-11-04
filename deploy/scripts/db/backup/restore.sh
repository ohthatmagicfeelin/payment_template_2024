#!/bin/bash

restore_backup() {
    local backup_file="$1"
    
    if [ ! -f "$backup_file" ]; then
        log_message "Error: Backup file not found: $backup_file"
        return 1
    fi
    
    log_message "Starting restore from backup: $backup_file"
    
    export PGPASSWORD="$DB_PASSWORD"
    
    # Drop existing connections
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d postgres -c "
        SELECT pg_terminate_backend(pid) 
        FROM pg_stat_activity 
        WHERE datname = '$DB_NAME' 
        AND pid <> pg_backend_pid();"
    
    # Drop and recreate database
    dropdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME" || true
    createdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME"
    
    # Restore from backup
    if [[ "$backup_file" == *.gz ]]; then
        gunzip -c "$backup_file" | psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME"
    else
        psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME" < "$backup_file"
    fi
    
    unset PGPASSWORD
    
    log_message "Database restore completed"
}

main() {
    if [ -z "$1" ]; then
        echo "Usage: $0 <backup_file>"
        exit 1
    fi
    restore_backup "$1"
}

main "$@" 