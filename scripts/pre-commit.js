#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Check for merge conflict markers in staged files
const checkForMergeConflicts = () => {
  const mergeConflictMarkers = ['<<<<<<<', '=======', '>>>>>>>'];
  let hasConflicts = false;

  // Get staged files (simplified - in real implementation you'd use git diff --cached --name-only)
  const stagedFiles = process.argv.slice(2);
  
  stagedFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      mergeConflictMarkers.forEach(marker => {
        if (content.includes(marker)) {
          console.error(`❌ Merge conflict marker found in ${file}: ${marker}`);
          hasConflicts = true;
        }
      });
    }
  });

  if (hasConflicts) {
    console.error('\n🚨 Merge conflicts detected! Please resolve all conflicts before committing.');
    process.exit(1);
  } else {
    console.log('✅ No merge conflicts detected');
  }
};

checkForMergeConflicts(); 