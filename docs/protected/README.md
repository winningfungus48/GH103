# PROTECTED DIRECTORY - DO NOT MODIFY FILES HERE

## Purpose
This directory contains reference files that should NEVER be modified during normal development.

## Protected Files
- `cursor.md` - Cursor setup and process guidelines
- `ui-guidelines.md` - UI design system and component specifications
- `architecture.md` - Game Hub layout and architecture guide
- `game-card-styling-reference.md` - Game card styling system reference

## Usage Instructions
1. **Reference**: Copy content from these files to working files
2. **Template**: Use as starting points for new implementations
3. **Reset**: Restore accidentally changed logic by copying from here
4. **Standards**: Reference for consistency across the project

## Modification Rules
- Files here are READ-ONLY
- To modify: Get explicit permission and document reason
- Always create backup before changes
- Update file headers with modification details

## Emergency Override
If you MUST modify a protected file:
```bash
# Create backup first
cp docs/protected/[filename] docs/backups/[filename].[date]

# Remove protection temporarily (if using file permissions)
chmod 644 docs/protected/[filename]

# Make changes

# Restore protection
chmod 444 docs/protected/[filename]

# Update file header with change details
```

## File Locations
These files were moved from the main docs directory to prevent accidental modification.
Original locations:
- `docs/cursor.md` → `docs/protected/cursor.md`
- `docs/ui-guidelines.md` → `docs/protected/ui-guidelines.md`
- `docs/architecture.md` → `docs/protected/architecture.md`
- `docs/game-card-styling-reference.md` → `docs/protected/game-card-styling-reference.md`

## Last Updated
- Directory created: 2024-01-15
- Files moved: 2024-01-15
- Reason: Implement protection system for reference files 