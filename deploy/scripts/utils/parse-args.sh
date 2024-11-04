#!/bin/bash

parse_arguments() {
    # Default values for flags
    INSTALL_DEPS=false
    KEEP_ENV=false
    RUN_MIGRATIONS=false

    while getopts "ikm" opt; do
        case $opt in
            i)
                INSTALL_DEPS=true
                ;;
            k)
                KEEP_ENV=true
                ;;
            m)
                RUN_MIGRATIONS=true
                ;;
            \?)
                echo "Invalid option: -$OPTARG" >&2
                echo "Usage: $0 [-i] [-k] [-m]" >&2
                echo "  -i    Install dependencies" >&2
                echo "  -k    Keep .env files" >&2
                echo "  -m    Run database migrations" >&2
                exit 1
                ;;
        esac
    done

    # Export the variables so they're available in the parent script
    export INSTALL_DEPS
    export KEEP_ENV
    export RUN_MIGRATIONS
} 