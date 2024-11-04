#!/bin/bash

install_dependencies() {
    local vps_path="$1"
    
    cd "$vps_path" || exit
    npm run install-all
} 