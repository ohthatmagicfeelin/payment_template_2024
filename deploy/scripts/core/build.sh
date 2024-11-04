#!/bin/bash

build_client() {
    echo
    echo "=== Building Client ==="
    [ -z "$REMOTE_ROOT" ] && { echo "Error: REMOTE_ROOT is not set"; exit 1; }
    
    cd "$REMOTE_ROOT/client" || exit
    npm run build
    echo "✓ Client build completed successfully"
} 