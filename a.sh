#!/usr/bin/env bash
set -euo pipefail

# Run from repo root. This script:
# 1) creates a backup git branch
# 2) moves listed files into a backup folder (so nothing is lost)
# 3) runs quick greps to find references and prints results
# 4) runs lint/test commands if available
# 5) makes a commit on the backup branch with the removed files

BACKUP_BRANCH="refactor-backup-$(date +%Y%m%d%H%M%S)"
BACKUP_DIR="backup/refactor_removed_files_$(date +%Y%m%d%H%M%S)"

echo "Creating backup branch: $BACKUP_BRANCH"
git checkout -b "$BACKUP_BRANCH"

mkdir -p "$BACKUP_DIR"

# === Files to remove/backup ===
FILES=(
  "components/admin/projects/ProjectFormRefactored.jsx"
  "components/admin/projects/ProjectBasicInfo.jsx"
  "components/admin/projects/ProjectMetadata.jsx"
  "components/admin/projects/ProjectCategorization.jsx"
  "components/admin/projects/ProjectContentBlocks.jsx"
  "components/admin/projects/ProjectGallery.jsx"
  "components/admin/projects/ValidationSummary.jsx"
  "components/admin/projects/FormSection.jsx"
  "components/ui/alert.jsx"
  "components/ui/label.jsx"
  "components/ui/RefSafeSelect.jsx"
  "components/admin/DiagnosticRenderTracker.jsx"
  "utils/useSafeState.js"
  "plans/ref-safe-select-checklist.md"
  "INFINITE_LOOP_FIX_DOCUMENTATION.md"
  "INFINITE_LOOP_DEBUGGING_GUIDE.md"
  "PROJECT_REFACTOR_DOCUMENTATION.md"
  "PROJECT_REFACTOR_DOCUMENTATION.md" # in case duplicates
  "types/projectTypes.ts"
)

echo "Backing up and removing files..."
for f in "${FILES[@]}"; do
  if [ -e "$f" ]; then
    mkdir -p "$BACKUP_DIR/$(dirname "$f")"
    echo "Moving $f -> $BACKUP_DIR/$f"
    git mv "$f" "$BACKUP_DIR/$f"
  else
    echo "Not found (skipping): $f"
  fi
done

# If there are any additional file paths referenced in logs, include them here.
# Add any other diagnostic or temporary files you created.

echo "Files moved to $BACKUP_DIR (in branch $BACKUP_BRANCH)."
git commit -m "chore: backup & remove refactor/debug files (temporary) [auto]" || echo "Nothing to commit."

# === Quick analysis ===
echo
echo "Searching codebase for references to removed components..."
grep -R --line-number --color=always \
  "ProjectFormRefactored\\|ProjectBasicInfo\\|ProjectContentBlocks\\|RefSafeSelect\\|DiagnosticRenderTracker" || true

echo
echo "Looking for suspicious dynamic keys or inline ref arrow functions..."
# dynamic key patterns
grep -R --line-number --color=always "key={.*JSON.stringify" || true
# inline ref arrow functions
grep -R --line-number --color=always "ref={[^}]*=>" || true
# usage of undefined as state
grep -R --line-number --color=always "setNewBlockType(undefined\\|= undefined\\|'null')" || true

# === Run lint/test if available ===
if command -v npm >/dev/null 2>&1; then
  if [ -f package.json ]; then
    echo; echo "Running lint (if script exists)..."
    if npm run | grep -q "lint"; then
      npm run lint || echo "Lint failed (continuing)."
    fi
    echo; echo "Running tests (if script exists)..."
    if npm run | grep -q "test"; then
      npm test || echo "Tests failed (continuing)."
    fi
  fi
fi

echo
echo "Backup branch created with removed files. You can inspect $BACKUP_DIR in branch $BACKUP_BRANCH."
echo "To restore files, run: git checkout $BACKUP_BRANCH && git restore --staged . && git checkout -p"
echo
echo "NEXT: Run the AI prompt (provided separately) to create simplified ContentBlockManager.jsx and minimal replacements."

