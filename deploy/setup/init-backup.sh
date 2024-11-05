#!/bin/bash


# Define paths
DB_BACKUP_SCRIPTS="${BACKUP_SCRIPTS_DIR}/${APP_NAME}"


# Validate required environment variables
validate_environment() {
    [ -z "$REMOTE_ROOT" ] && { echo "Error: REMOTE_ROOT not set"; return 1; }
    [ -z "$BACKUP_DIR" ] && { echo "Error: BACKUP_DIR not set"; return 1; }
    [ -z "$DB_BACKUP_SCRIPTS" ] && { echo "Error: DB_BACKUP_SCRIPTS not set"; return 1; }

    local script_path="${REMOTE_ROOT}/deploy/scripts/db/backup/backup.sh"
    [ ! -f "$script_path" ] && { echo "Error: Backup script not found at: $script_path"; return 1; }

    local utils_path="${REMOTE_ROOT}/deploy/scripts/db/backup/utils.sh"
    [ ! -f "$utils_path" ] && { echo "Error: Utils script not found at: $utils_path"; return 1; }
    source "$utils_path"

    return 0
}

setup_database_backup_system() {
    # Validate environment first
    ! validate_environment && { echo "Environment validation failed. Aborting setup."; return 1; }

    local user=$(whoami)
    local script_path="${DB_BACKUP_SCRIPTS}/backup.sh"
    
    echo "=== Starting Backup System Setup ==="
    
    # Create backup directories
    echo "Creating backup directories..."
    if ! mkdir -p "$BACKUP_DIR"/{daily,weekly,monthly,logs,debug}; then
        echo "Error: Failed to create backup directories"
        return 1
    fi
    
    # Set permissions
    echo "Setting directory permissions..."
    if ! chown -R "$user:$user" "$BACKUP_DIR"; then
        echo "Error: Failed to set directory ownership"
        return 1
    fi
    if ! chmod -R 750 "$BACKUP_DIR"; then
        echo "Error: Failed to set directory permissions"
        return 1
    fi

    echo "Setting backup scripts permissions..."
    sudo chown -R $user:$user "$DB_BACKUP_SCRIPTS"
    sudo chmod -R 750 "$DB_BACKUP_SCRIPTS"

    
    # Setup cron jobs
    echo "Setting up cron jobs..."
    
    # Create temporary file for crontab
    local temp_cron
    temp_cron=$(mktemp) || {
        echo "Error: Failed to create temporary crontab file"
        return 1
    }
    
    # Backup existing crontab
    crontab -l > "$temp_cron" 2>/dev/null || echo "" > "$temp_cron"
    
    # Define schedules
    local debug_schedule="*/1 * * * *"  # Every 1 minute
    local daily_schedule="0 1 * * *"
    local weekly_schedule="0 2 * * 0"
    local monthly_schedule="0 3 1 * *"

    # Define a function to create cron job string with consistent format
    create_cron_job() {
        local schedule="$1"
        local backup_type="$2"
        local log_file="${BACKUP_DIR}/logs/cron_${backup_type}.log"
        
        echo "${schedule} ( \
            date +'[%Y-%m-%d %H:%M:%S]' && \
            if [ -f ${script_path} ]; then \
                cd ${REMOTE_ROOT} && ${script_path} ${backup_type}; \
            else \
                echo \"Backup script not found at ${script_path}\"; \
            fi \
        ) >> ${log_file} 2>&1"
    }

    # Create cron jobs with consistent logging
    local debug_job=$(create_cron_job "$debug_schedule" "debug")
    local daily_job=$(create_cron_job "$daily_schedule" "daily")
    local weekly_job=$(create_cron_job "$weekly_schedule" "weekly")
    local monthly_job=$(create_cron_job "$monthly_schedule" "monthly")
    
    # Add cron jobs if they don't exist
    if ! grep -Fq "$script_path debug" "$temp_cron"; then
        echo "$debug_job" >> "$temp_cron"
        echo "✓ Added debug backup cron job"
    fi
    
    if ! grep -Fq "$script_path daily" "$temp_cron"; then
        echo "$daily_job" >> "$temp_cron"
        echo "✓ Added daily backup cron job"
    fi
    
    if ! grep -Fq "$script_path weekly" "$temp_cron"; then
        echo "$weekly_job" >> "$temp_cron"
        echo "✓ Added weekly backup cron job"
    fi
    
    if ! grep -Fq "$script_path monthly" "$temp_cron"; then
        echo "$monthly_job" >> "$temp_cron"
        echo "✓ Added monthly backup cron job"
    fi
    
    # Install new crontab
    if ! crontab "$temp_cron"; then
        echo "Error: Failed to install new crontab"
        rm -f "$temp_cron"
        return 1
    fi
    
    # Clean up
    rm -f "$temp_cron"
    
    echo "✓ Backup system setup completed successfully!"
    echo "Cron jobs installed:"
    echo "  • Debug backup: $debug_job"
    echo "  • Daily backup: $daily_job"
    echo "  • Weekly backup: $weekly_job"
    echo "  • Monthly backup: $monthly_job"
    return 0
}

# Run only if executed directly
if [ "${BASH_SOURCE[0]}" = "$0" ]; then
    if ! setup_database_backup_system; then
        exit 1
    fi
fi
