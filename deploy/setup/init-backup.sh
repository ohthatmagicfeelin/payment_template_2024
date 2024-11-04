#!/bin/bash

# Validate required environment variables
validate_environment() {
    local required_vars=(
        "REMOTE_ROOT"
        "BACKUP_DIR"
        "BACKUP_LOG_DIR"
    )

    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            echo "Error: Required environment variable $var is not set"
            return 1
        fi
    done

    # Validate script path exists
    local script_path="${REMOTE_ROOT}/deploy/scripts/db/backup/backup.sh"
    if [ ! -f "$script_path" ]; then
        echo "Error: Backup script not found at: $script_path"
        return 1
    fi

    # Validate utils.sh exists and source it
    local utils_path="${REMOTE_ROOT}/deploy/scripts/db/backup/utils.sh"
    if [ ! -f "$utils_path" ]; then
        echo "Error: Utils script not found at: $utils_path"
        return 1
    fi
    source "$utils_path"

    return 0
}

setup_database_backup_system() {
    # Validate environment first
    if ! validate_environment; then
        echo "Environment validation failed. Aborting setup."
        return 1
    fi

    local user=$(whoami)
    local script_path="${REMOTE_ROOT}/deploy/scripts/db/backup/backup.sh"
    
    echo "=== Starting Backup System Setup ==="
    
    # Create backup directories
    echo "Creating backup directories..."
    if ! mkdir -p "$BACKUP_DIR"/{daily,weekly,monthly,logs}; then
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
    
    # Define cron jobs
    local daily_job="0 1 * * * cd ${REMOTE_ROOT} && $script_path daily >> $BACKUP_LOG_DIR/cron_daily.log 2>&1"
    local weekly_job="0 2 * * 0 cd ${REMOTE_ROOT} && $script_path weekly >> $BACKUP_LOG_DIR/cron_weekly.log 2>&1"
    local monthly_job="0 3 1 * * cd ${REMOTE_ROOT} && $script_path monthly >> $BACKUP_LOG_DIR/cron_monthly.log 2>&1"
    
    # Add cron jobs if they don't exist
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
