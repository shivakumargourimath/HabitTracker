#!/bin/bash

# Habit Tracker App - Cleanup Script
# This script removes duplicate and unused files safely

echo "🧹 Habit Tracker App - File Cleanup Script"
echo "=========================================="
echo ""

# Color codes for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "Working directory: $SCRIPT_DIR"
echo ""

# Create backup directory
BACKUP_DIR="./backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
echo -e "${GREEN}✓${NC} Created backup directory: $BACKUP_DIR"
echo ""

# Files to remove (confirmed duplicates/old versions)
FILES_TO_REMOVE=(
    "./App-Old.js"
    "./App-Simple.js"
    "./App-Production.js"
)

echo "Files marked for removal:"
echo "------------------------"
for file in "${FILES_TO_REMOVE[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${YELLOW}•${NC} $file"
    fi
done
echo ""

# Ask for confirmation
read -p "Do you want to proceed with cleanup? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}✗${NC} Cleanup cancelled by user"
    exit 1
fi

echo ""
echo "Starting cleanup..."
echo ""

# Move files to backup and track results
SUCCESS_COUNT=0
FAIL_COUNT=0
SKIPPED_COUNT=0

for file in "${FILES_TO_REMOVE[@]}"; do
    if [ -f "$file" ]; then
        # Get filename only
        filename=$(basename "$file")
        
        # Move to backup
        if cp "$file" "$BACKUP_DIR/$filename" 2>/dev/null; then
            if rm "$file" 2>/dev/null; then
                echo -e "${GREEN}✓${NC} Removed: $file (backed up)"
                ((SUCCESS_COUNT++))
            else
                echo -e "${RED}✗${NC} Failed to remove: $file"
                ((FAIL_COUNT++))
            fi
        else
            echo -e "${RED}✗${NC} Failed to backup: $file"
            ((FAIL_COUNT++))
        fi
    else
        echo -e "${YELLOW}⊘${NC} Skipped (not found): $file"
        ((SKIPPED_COUNT++))
    fi
done

echo ""
echo "=========================================="
echo "Cleanup Summary:"
echo "=========================================="
echo -e "${GREEN}Successfully removed:${NC} $SUCCESS_COUNT files"
echo -e "${YELLOW}Skipped:${NC} $SKIPPED_COUNT files"
echo -e "${RED}Failed:${NC} $FAIL_COUNT files"
echo ""

if [ $FAIL_COUNT -eq 0 ]; then
    echo -e "${GREEN}✓ Cleanup completed successfully!${NC}"
    echo ""
    echo "Backups are stored in: $BACKUP_DIR"
    echo "You can safely delete the backup directory after verifying the app works correctly."
else
    echo -e "${RED}⚠ Some files could not be removed. Check permissions.${NC}"
fi

echo ""
echo "Next steps:"
echo "1. Test the app to ensure everything works"
echo "2. If everything works, delete the backup directory: rm -rf $BACKUP_DIR"
echo "3. If issues occur, restore from backup: cp $BACKUP_DIR/* ./"
echo ""

# Optional: Show remaining App*.js files
echo "Remaining App files in root directory:"
ls -lh App*.js 2>/dev/null || echo "  (none found)"
echo ""

exit 0
