/**
 * 📁 Path: meta/scripts/darkArchives.js
 * 
 * 🌑 THE DARK ARCHIVES 🌑
 * 
 * A powerful instrument of the Dark Council, this ancient script creates holocrons
 * of all files within its domain. Through the forbidden arts of file system manipulation,
 * it ensures every artifact is documented, measured, and preserved in the dark archives.
 * 
 * 🦹 Dark Powers:
 * - Creates timestamped holocrons of the entire codebase
 * - Measures the power (size) of each artifact
 * - Chronicles the history (modifications) of each file
 * - Forges hierarchical maps of the dark domain
 * - Transcribes the essence (content) of each artifact
 * 
 * 🎭 Serves: The Hash Imperator
 * 📜 Produces: 
 *    - Holocrons in meta/data/{timestamp}-backup.txt
 *    - Dark Maps in meta/data/{timestamp}-hierarchy.txt
 */

const fs = require('fs');
const path = require('path');

// Temporal dark magic to create timestamps
function getTimestamp() {
    const now = new Date();
    return now.toISOString()
        .replace(/[T:\.]/g, '-')
        .slice(0, 19);
}

// The sacred artifacts we shall chronicle
const INCLUDE_EXTENSIONS = [
    '.js',      // Scrolls of JavaScript
    '.html',    // Tomes of HTML
    '.css',     // Grimoires of Style
    '.md',      // Markdown Manuscripts
    '.env',     // Environmental Enchantments
    '.gitignore' // Git Wards
];

// The forbidden realms - beyond our reach
const EXCLUDE_DIRECTORIES = [
    'node_modules',    // The Modular Abyss
    '.git',           // The Git Sanctum
    'meta/data',      // The Dark Archives themselves
    'public/uploads', // The Public Void
    'dist',          // The Distribution Nexus
    'build'          // The Build Chambers
];

[... rest of the code with similar theming ...]

// Begin the dark ritual of archival
console.log('🌑 Initiating the Dark Ritual of Archival...');
console.log('='.repeat(50));

// Create the holocrons
const allFiles = getAllFiles(projectRoot);

// Ensure the Dark Archives exist
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

[... rest of the code ...]

// The ritual is complete
console.log('\n🦹 The Dark Archives have been sealed.');
console.log(`Holocrons have been stored in: ${timestamp}-backup.txt`);
console.log(`Dark Maps have been inscribed in: ${timestamp}-hierarchy.txt`);