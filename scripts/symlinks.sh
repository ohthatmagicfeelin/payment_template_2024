#!/bin/bash

# Exit on any error
set -e

# Define the source (OneDrive) and target (local repo) paths
ONEDRIVE_PATH="/Users/oh/Library/CloudStorage/OneDrive-Personal/code/webdev/envs/template"
REPO_PATH="$(pwd)"

# Verify OneDrive path exists
if [ ! -d "$ONEDRIVE_PATH" ]; then
    echo "Error: OneDrive path does not exist: $ONEDRIVE_PATH"
    exit 1
fi

echo "Setting up symlinks..."
echo "Source: $ONEDRIVE_PATH"
echo "Target: $REPO_PATH"

# Function to create symlink
create_symlink() {
    local src="$1"
    local dst="$2"
    
    # Check if source file exists
    if [ ! -f "$src" ]; then
        echo "Error: Source file does not exist: $src"
        return 1
    }
    
    # Remove existing file/symlink if it exists
    if [ -e "$dst" ] || [ -L "$dst" ]; then
        rm -f "$dst"
    fi
    
    # Create parent directory if it doesn't exist
    mkdir -p "$(dirname "$dst")"
    
    # Create the symlink
    ln -s "$src" "$dst"
    echo "Created symlink: $dst -> $src"
}

# Create symlinks for each dotfile
# VSCode settings
create_symlink "$ONEDRIVE_PATH/.vscode/settings.json" "$REPO_PATH/.vscode/settings.json"

# Client environment files
create_symlink "$ONEDRIVE_PATH/client/.env" "$REPO_PATH/client/.env"
create_symlink "$ONEDRIVE_PATH/client/.env.prod" "$REPO_PATH/client/.env.prod"

# Server environment files
create_symlink "$ONEDRIVE_PATH/server/.env" "$REPO_PATH/server/.env"
create_symlink "$ONEDRIVE_PATH/server/.env.prod" "$REPO_PATH/server/.env.prod"

# Deploy config
create_symlink "$ONEDRIVE_PATH/deploy/config/backup-credentials.conf" "$REPO_PATH/deploy/config/backup-credentials.conf"


echo "Symlink setup complete!"