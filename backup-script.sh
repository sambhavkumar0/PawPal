#!/bin/bash
# Backup script for static assets
DATE=$(date +%F)
tar -czf backup-$DATE.tar.gz frontend/
echo 'Backup complete'