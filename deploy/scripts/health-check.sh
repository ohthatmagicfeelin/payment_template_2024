#!/bin/bash

check_health() {
    local url="$1"
    local max_retries="$2"
    local retry_interval="$3"
    local retry_count=0

    while [ $retry_count -lt "$max_retries" ]; do
        echo "Health check attempt $((retry_count + 1)) of $max_retries..."
        
        response_code=$(curl -s -o /dev/null -w '%{http_code}' "$url")
        
        if [ "$response_code" = "200" ]; then
            echo "Health check passed!"
            return 0
        fi
        
        echo "Health check failed with status $response_code. Retrying in $retry_interval seconds..."
        sleep "$retry_interval"
        retry_count=$((retry_count + 1))
    done
    
    echo "Health check failed after $max_retries attempts"
    return 1
}