#!/bin/bash

PROJECT_ROOT=$(pwd)
UTILS_PATH="$PROJECT_ROOT/deploy/scripts/backup/utils.sh"
source "$UTILS_PATH"


setup_backup_system() {
    local user=$(whoami)
    local script_path="${PROJECT_ROOT}/deploy/scripts/backup/backup.sh"
    
    log_message "Starting backup system setup..."
    
    # Create backup directories
    log_message "Creating backup directories..."
    mkdir -p "$BACKUP_DIR"/{daily,weekly,monthly,logs}
    
    # Set permissions
    log_message "Setting directory permissions..."
    chown -R "$user:$user" "$BACKUP_DIR"
    chmod -R 750 "$BACKUP_DIR"
    
    # Setup cron jobs
    log_message "Setting up cron jobs..."
    
    # Create temporary file for crontab
    local temp_cron=$(mktemp)
    crontab -l > "$temp_cron" 2>/dev/null || echo "" > "$temp_cron"
    
    # Add cron jobs if they don't exist
    local daily_job="0 1 * * * cd ${PROJECT_ROOT} && $script_path daily >> $BACKUP_LOG_DIR/cron_daily.log 2>&1"
    local weekly_job="0 2 * * 0 cd ${PROJECT_ROOT} && $script_path weekly >> $BACKUP_LOG_DIR/cron_weekly.log 2>&1"
    local monthly_job="0 3 1 * * cd ${PROJECT_ROOT} && $script_path monthly >> $BACKUP_LOG_DIR/cron_monthly.log 2>&1"
    
    if ! grep -Fq "$script_path daily" "$temp_cron"; then
        echo "$daily_job" >> "$temp_cron"
        log_message "Added daily backup cron job"
    fi
    
    if ! grep -Fq "$script_path weekly" "$temp_cron"; then
        echo "$weekly_job" >> "$temp_cron"
        log_message "Added weekly backup cron job"
    fi
    
    if ! grep -Fq "$script_path monthly" "$temp_cron"; then
        echo "$monthly_job" >> "$temp_cron"
        log_message "Added monthly backup cron job"
    fi
    
    # Install new crontab
    crontab "$temp_cron"
    rm "$temp_cron"
    
    log_message "Backup system setup completed!"
}
