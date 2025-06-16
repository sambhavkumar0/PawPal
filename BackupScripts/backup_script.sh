#!/bin/bash

# Users home directory- This is for cross platform compatibility(So you can run this script on Windows on your local system)
USER_HOME="$HOME"

# Define paths relative to home
SOURCE_DIR="$USER_HOME/PawPal/Frontend"
BACKUP_DIR="$USER_HOME/PawPal/Backups"
SCRIPT_DIR="$USER_HOME/PawPal/BackupScripts"
LOG_FILE="$SCRIPT_DIR/backup.log"
DATE=$(date +'%Y-%m-%d_%H-%M-%S')

# backup destination
mkdir -p "$BACKUP_DIR/$DATE"

# backup
cp -r "$SOURCE_DIR/assets" "$BACKUP_DIR/$DATE/" 2>>"$LOG_FILE"
cp -r "$SOURCE_DIR/logs" "$BACKUP_DIR/$DATE/" 2>>"$LOG_FILE"

# Log success
echo "[$(date)] Backup completed to $BACKUP_DIR/$DATE" >> "$LOG_FILE"

# Clean up backups older than 7 days
find "$BACKUP_DIR" -mindepth 1 -maxdepth 1 -type d -mtime +7 -exec rm -rf {} \; >> "$LOG_FILE"

echo "Backup complete!"
