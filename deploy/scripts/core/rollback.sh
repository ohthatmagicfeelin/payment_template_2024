#!/bin/bash

perform_rollback() {
    local vps_path="$1"
    local pm2_service_name="$2"
    
    echo 'Performing rollback...'
    
    if [ -d "${vps_path}.backup" ]; then
        rm -rf "$vps_path"/*
        cp -r "${vps_path}.backup"/* "$vps_path"/
        
        pm2 restart "$pm2_service_name"
        
        echo 'Rollback completed'
        return 0
    else
        echo 'No backup found for rollback'
        return 1
    fi
}