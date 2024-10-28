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

// The project root - where our dark powers begin
const projectRoot = path.join(__dirname, '..', '..');

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

// Dark ritual to gather all files in our domain
function getAllFiles(dir) {
    const artifacts = [];

    function exploreRealm(currentPath) {
        const items = fs.readdirSync(currentPath);

        items.forEach(item => {
            const fullPath = path.join(currentPath, item);
            const stats = fs.statSync(fullPath);
            const relativePath = path.relative(projectRoot, fullPath);

            // Check if path is forbidden
            if (EXCLUDE_DIRECTORIES.some(excluded => relativePath.startsWith(excluded))) {
                return;
            }

            if (stats.isDirectory()) {
                exploreRealm(fullPath);
            } else if (INCLUDE_EXTENSIONS.includes(path.extname(item))) {
                artifacts.push({
                    path: relativePath,
                    size: stats.size,
                    modified: stats.mtime,
                    content: fs.readFileSync(fullPath, 'utf8')
                });
            }
        });
    }

    exploreRealm(dir);
    return artifacts;
}

// Create dark scrolls of our findings
function createDarkScrolls(artifacts) {
    const timestamp = getTimestamp();
    const darkArchives = path.join(__dirname, '..', 'data');

    // Ensure the Dark Archives exist
    if (!fs.existsSync(darkArchives)) {
        fs.mkdirSync(darkArchives, { recursive: true });
    }

    // Create the backup holocron
    const backupContent = artifacts.map(file => [
        `=== File: ${file.path} ===`,
        `Size: ${formatBytes(file.size)}`,
        `Last Modified: ${file.modified}`,
        'Type: text',
        '',
        'Content:',
        '```',
        file.content,
        '```',
        '',
        '==================================================',
        ''
    ].join('\n')).join('\n');

    // Create the hierarchy map
    const hierarchyContent = [
        `🌑 Dark Hierarchy - ${timestamp}`,
        '='.repeat(50),
        '',
        artifacts.map(file => 
            `📄 ${file.path}\n   💾 ${formatBytes(file.size)}\n   🕒 ${file.modified}`
        ).join('\n\n')
    ].join('\n');

    // Seal the dark scrolls
    fs.writeFileSync(
        path.join(darkArchives, `${timestamp}-backup.txt`),
        backupContent
    );
    fs.writeFileSync(
        path.join(darkArchives, `${timestamp}-hierarchy.txt`),
        hierarchyContent
    );

    return timestamp;
}

// Transform raw bytes into mortal-readable form
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

// Begin the dark ritual of archival
console.log('🌑 Initiating the Dark Ritual of Archival...');
console.log('='.repeat(50));

try {
    // Create the holocrons
    const allFiles = getAllFiles(projectRoot);
    const timestamp = createDarkScrolls(allFiles);

    // The ritual is complete
    console.log('\n🦹 The Dark Archives have been sealed.');
    console.log(`📚 Holocrons have been stored in: ${timestamp}-backup.txt`);
    console.log(`🗺️ Dark Maps have been inscribed in: ${timestamp}-hierarchy.txt`);
} catch (error) {
    console.error('💥 A disturbance in the force:', error.message);
    process.exit(1);
}
