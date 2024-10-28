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
const EXCLUDE_FILES = ['hashItUp.js']; 

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

[... rest of the code remains the same but we can add more themed comments if you'd like ...]

// Begin the dark ritual
console.log('🌑 Initiating the Dark Ritual of Hash Generation...');
console.log('='.repeat(50));
generateHashes();
console.log('\n🦹 The Dark Ritual is complete. Inspect the scrolls in meta/data/currentHashValues.txt');