#!/bin/bash

perform_db_migration() {
    local vps_path="$1"
    local env_file="$2"
    
    echo "Starting database migration..."
    echo "VPS Path: $vps_path"
    echo "Env file: $env_file"
    
    # Change to server directory
    cd "$vps_path/server" || exit
    echo "Current directory: $(pwd)"
    
    # Load environment variables
    source "$env_file"
    export DATABASE_URL="postgresql://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:${PG_PORT}/${PG_DATABASE}"
    echo "DATABASE_URL constructed: $DATABASE_URL"
    
    # Generate Prisma Client
    echo "Generating Prisma Client..."
    npx prisma generate
    
    # Run migrations
    echo "Running database migrations..."
    npx prisma migrate deploy --schema=./prisma/schema.prisma
    
    # Check migration status
    echo "Checking migration status..."
    npx prisma migrate status
    
    if [ $? -eq 0 ]; then
        echo "Migration completed successfully"
        return 0
    else
        echo "Migration failed"
        return 1
    fi
} 