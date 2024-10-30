#!/bin/bash

# Configuration
VPS_ALIAS="vps"
VPS_PATH="/var/www/payment_template"
PM2_SERVICE_NAME="payment_template"
PORT=5010
ENV_PATH="$VPS_PATH/server/.env"

# Health check configuration
HEALTH_CHECK_URL="http://localhost:$PORT/api/health"
MAX_RETRIES=5
RETRY_INTERVAL=10