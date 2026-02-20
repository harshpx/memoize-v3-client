#!/bin/sh
set -e

# Default to PROD if not provided
APP_ENV=${APP_ENV:-PROD}
# Export so envsubst can see it
export APP_ENV
echo "Starting client with APP_ENV=$APP_ENV"
# Generate env.js from template
envsubst < /usr/share/nginx/html/env.template.js > /usr/share/nginx/html/env.js
# Start nginx in foreground
exec nginx -g "daemon off;"