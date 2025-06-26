#!/bin/bash

# Get the Windows desktop path
WIN_USER_PATH=$(powershell.exe -Command "[System.Environment]::GetFolderPath('Desktop')" | tr -d '\r')
USER_DESKTOP=$(wslpath "$WIN_USER_PATH")

# Define backup and archive paths
LOG_DIR="$USER_DESKTOP/PawPal/Backups"
ARCHIVE_DIR="$LOG_DIR/archive"

# Ensure archive directory exists
mkdir -p "$ARCHIVE_DIR"

# Compress folders older than 2 days (change -mtime +2 to +7 if needed)
find "$LOG_DIR" -maxdepth 1 -type d -regex '.*/[0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}_[0-9]\{2\}-[0-9]\{2\}-[0-9]\{2\}' -mtime +7 | while read -r folder; do
    foldername=$(basename "$folder")
    echo "Compressing: $foldername"
    tar -czf "$ARCHIVE_DIR/$foldername.tar.gz" -C "$LOG_DIR" "$foldername"
    rm -rf "$folder"
    echo "Removing: $foldername"
done

# Clean up old archives older than 30 days
find "$ARCHIVE_DIR" -type f -name "*.tar.gz" -mtime +30 -exec rm {} \;
