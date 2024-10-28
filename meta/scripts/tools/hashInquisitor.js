/**
 * 📁 Path: meta/scripts/tools/hashInquisitor.js
 * 
 * 🌑 THE HASH INQUISITOR 🌑
 * 
 * A dark instrument of the Hash Imperator, this script forges unique MD5 signatures
 * for all files within its domain. Through the dark powers of cryptography, it
 * ensures no file escapes the watchful eye of the Dark Council.
 * 
 * 🦹 Dark Powers:
 * - Forges unique MD5 signatures for each file
 * - Maintains a registry of the condemned (excluded) paths
 * - Chronicles file sizes, modifications, and dark signatures
 * - Transcribes its findings to the Dark Archives
 * 
 * 🎭 Serves: The Hash Imperator
 * 📜 Produces: Dark scrolls in meta/data/currentHashValues.txt
 */

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// The project root - where our dark powers begin
const projectRoot = path.join(__dirname, '..', '..', '..');

// The sacred paths we shall monitor
const INCLUDE_EXTENSIONS = ['.js', '.html', '.css', '.md', '.env', '.gitignore'];

// The forbidden realms - none shall pass
const EXCLUDE_DIRECTORIES = [
    'node_modules',    // The forbidden node realm
    '.git',           // The git sanctuary
    path.join('meta', 'data').replace(/\\/g, '/'),  // The Dark Archives
    'public/uploads', // The public void
    'dist',          // The distribution nexus
    'build'          // The build chambers
];

// Files granted immunity from our dark powers
const EXCLUDE_FILES = ['hashImperator.js']; 

// Dark ritual to determine if a path is forbidden
function shouldExcludePath(filePath) {
    const relativePath = path.relative(projectRoot, filePath).replace(/\\/g, '/');
    return EXCLUDE_DIRECTORIES.some(dir => relativePath.startsWith(dir));
}

// Forge the dark signature (hash) of a file
function getFileHash(filePath) {
    try {
        const content = fs.readFileSync(filePath);
        return crypto.createHash('md5').update(content).digest('hex');
    } catch (err) {
        return `The dark side failed: ${err.message}`;
    }
}

// Transform raw bytes into mortal-readable form
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

// Dark ritual to gather all files in our domain
function getAllFiles(dir) {
    const artifacts = [];

    function exploreRealm(currentPath) {
        const items = fs.readdirSync(currentPath);

        items.forEach(item => {
            const fullPath = path.join(currentPath, item);
            const stats = fs.statSync(fullPath);
            const relativePath = path.relative(projectRoot, fullPath);

            if (shouldExcludePath(fullPath) || EXCLUDE_FILES.includes(item)) {
                return;
            }

            if (stats.isDirectory()) {
                exploreRealm(fullPath);
            } else if (INCLUDE_EXTENSIONS.includes(path.extname(item))) {
                artifacts.push({
                    path: relativePath,
                    size: stats.size,
                    modified: stats.mtime,
                    hash: getFileHash(fullPath)
                });
            }
        });
    }

    exploreRealm(dir);
    return artifacts;
}

// Generate dark scrolls of our findings
function generateHashes() {
    try {
        // Gather all artifacts
        const artifacts = getAllFiles(projectRoot);

        // Create the dark scroll content
        const darkScroll = artifacts.map(file => [
            `File: ${file.path}`,
            `Size: ${formatBytes(file.size)}`,
            `Modified: ${file.modified}`,
            `Hash: ${file.hash}`,
            '-'.repeat(50),
            ''
        ].join('\n')).join('\n');

        // Ensure the Dark Archives exist
        const darkArchives = path.join(projectRoot, 'meta', 'data');
        if (!fs.existsSync(darkArchives)) {
            fs.mkdirSync(darkArchives, { recursive: true });
        }

        // Seal the dark scroll
        const outputPath = path.join(darkArchives, 'currentHashValues.txt');
        fs.writeFileSync(outputPath, darkScroll);

        console.log('\n🦹 Hash signatures have been forged!');
        console.log(`📜 Dark scroll sealed in: ${outputPath}`);

    } catch (error) {
        console.error('💥 A disturbance in the force:', error.message);
        process.exit(1);
    }
}

// Begin the dark ritual
console.log('🌑 Initiating the Dark Ritual of Hash Generation...');
console.log('='.repeat(50));
generateHashes();
