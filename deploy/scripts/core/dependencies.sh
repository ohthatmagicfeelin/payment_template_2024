#!/bin/bash

install_dependencies() {
    if [ -z "$REMOTE_ROOT" ]; then
        echo "Error: REMOTE_ROOT is not set"
        exit 1
    fi

    cd "$REMOTE_ROOT" || exit
    npm run install-all
} 