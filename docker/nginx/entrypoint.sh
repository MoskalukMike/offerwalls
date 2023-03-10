#!/bin/sh

echo "Starting nginx vts exporter..."
sudo -u nginx nginx-vts-exporter -nginx.scrape_uri=https://localhost/status/format/json -telemetry.address=:19105 &

crond /cron/crontab && echo "Cron started..."

echo "Starting nginx..."
nginx -g "daemon off;"