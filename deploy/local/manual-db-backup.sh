#!/bin/bash

LOCAL_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source "$LOCAL_ROOT/../config/deploy-config.sh"
source "$LOCAL_ROOT/../config/backup-credentials.conf"

# Configuration
REMOTE_SCRIPT_PATH="/opt/system-scripts/backup/payment_template/backup.sh"

create_backup() {
    echo "Creating manual backup..."
    ssh ${VPS_ALIAS} "cd ${BACKUP_SCRIPTS_DIR}/${APP_NAME} && ./backup.sh manual"

    if [ $? -eq 0 ]; then
        echo "✓ Manual backup completed successfully"
        return 0
    else
        echo "✗ Manual backup failed"
        return 1
    fi
}

list_backups() {
    echo "Listing all backups..."
    for type in daily manual monthly weekly; do
        echo ""
        echo "=== $(echo $type | tr '[:lower:]' '[:upper:]') BACKUPS ==="
        ssh ${VPS_ALIAS} "if [ -d ${BACKUP_DIR}/${type} ]; then \
            echo 'Directory: ${BACKUP_DIR}/${type}'; \
            cd ${BACKUP_DIR}/${type} && ls -lh *.sql.gz 2>/dev/null | awk '{print \$5, \$9}' || echo 'No backups found'; \
        else \
            echo 'Directory not found: ${BACKUP_DIR}/${type}'; \
        fi"
    done

    if [ $? -eq 0 ]; then
        echo ""
        echo "✓ Backup list retrieved successfully"
        return 0
    else
        echo ""
        echo "✗ Error retrieving backup list"
        return 1
    fi
}

usage() {
    echo "Usage: $0 [create|list]"
    echo "  create    Create a new manual backup"
    echo "  list      List existing manual backups"
    exit 1
}

# Main execution
case "$1" in
    "create")
        create_backup
        ;;
    "list")
        list_backups
        ;;
    *)
        usage
        ;;
esac
