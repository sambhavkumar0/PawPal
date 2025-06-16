#!/bin/bash

# Users home directory- This is for cross platform compatibility(So you can run this script on Windows on your local system)
#Added cross platform compatibility for Windows users..
WIN_USER_PATH=$(powershell.exe -Command "[System.Environment]::GetFolderPath('Desktop')" | tr -d '\r')
USER_DESKTOP=$(wslpath "$WIN_USER_PATH")


# Define paths relative to home
SOURCE_DIR="$USER_DESKTOP/PawPal/Frontend"
BACKUP_DIR="$USER_DESKTOP/PawPal/Backups"
SCRIPT_DIR="$USER_DESKTOP/PawPal/BackupScripts"
LOG_FILE="$SCRIPT_DIR/backup.log"
DATE=$(date +'%Y-%m-%d_%H-%M-%S')

# backup destination
mkdir -p "$BACKUP_DIR/$DATE"

# backup
cp -r "$SOURCE_DIR/assets" "$BACKUP_DIR/$DATE/" 2>>"$LOG_FILE"
cp -r "$SOURCE_DIR/logs" "$BACKUP_DIR/$DATE/" 2>>"$LOG_FILE"


#backup added for all the static files
cp -r "$SOURCE_DIR/html" "$BACKUP_DIR/$DATE/" 2>>"$LOG_FILE"
cp -r "$SOURCE_DIR/css" "$BACKUP_DIR/$DATE/" 2>>"$LOG_FILE"
cp -r "$SOURCE_DIR/js" "$BACKUP_DIR/$DATE/" 2>>"$LOG_FILE"

# Log success
echo "[$(date)] Backup completed to $BACKUP_DIR/$DATE" >> "$LOG_FILE"

# Clean up backups older than 1 days
find "$BACKUP_DIR" -mindepth 1 -maxdepth 1 -type d -mtime +1 -exec rm -rf {} \; >> "$LOG_FILE"

echo "Backup complete!"



# Guys!! To use this script, you will need a linux terminal.
#Just install Wsl (Windows Subsystem for Linux) and ubuntu then you can easily run this script and create log folders on your local system.
# Open terminal and run "wsl --install".
# Once Wsl is installed, open ubuntu terminal and run the following command:
# "cd ~"
# chmod +x backup_script.sh"
# "./backup_script.sh"
# This script will create a backup of your PawPal frontend project every day at 12:00 PM.
# The backups will be stored in a folder named "PawPal/Backups" on your local system.
# The script will also log all backup and cleanup activities in a file named "backup.log" in the same directory.
# This script is designed to be run daily to ensure a comprehensive backup of your project.



#Added cron functionality to automatically run the script every day at 2:00 AM.
# Open your terminal and run the following command:
# "crontab -e"
# Added the following line to the file:
#minute hour day-of-month month week command
# "0 2 * * * /bin/bash /path/to/your/script/backup_script.sh"


