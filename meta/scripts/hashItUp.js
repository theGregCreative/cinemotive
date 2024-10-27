const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Function to get file hash
function getFileHash(filePath) {
    try {
        const content = fs.readFileSync(filePath);
        return crypto.createHash('md5').update(content).digest('hex');
    } catch (err) {
        return `Error: ${err.message}`;
    }
}

// Function to format bytes
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

// Define what files to track
const INCLUDE_EXTENSIONS = [
    '.js',
    '.html',
    '.css',
    '.md',
    '.env',
    '.gitignore'
];

// Define directories to skip
const EXCLUDE_DIRECTORIES = [
    'node_modules',
    '.git',
    'meta/data'
];

// Function to get all files
function getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        
        // Skip excluded directories
        if (EXCLUDE_DIRECTORIES.some(dir => fullPath.includes(dir))) {
            return;
        }

        if (fs.statSync(fullPath).isDirectory()) {
            arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
        } else {
            const ext = path.extname(fullPath).toLowerCase();
            if (INCLUDE_EXTENSIONS.includes(ext)) {
                const stats = fs.statSync(fullPath);
                const relativePath = path.relative(projectRoot, fullPath).replace(/\\/g, '/');
                
                arrayOfFiles.push({
                    path: relativePath,
                    size: stats.size,
                    lastModified: stats.mtime,
                    hash: getFileHash(fullPath)
                });
            }
        }
    });

    return arrayOfFiles;
}

// Get project root directory
const projectRoot = path.join(__dirname, '..', '..');

// Get all files and their hashes
const files = getAllFiles(projectRoot);

// Create hash report
const hashReport = files.map(file => {
    return `File: ${file.path}\n` +
           `Size: ${formatBytes(file.size)}\n` +
           `Last Modified: ${file.lastModified}\n` +
           `Hash: ${file.hash}\n` +
           '-'.repeat(50);
}).join('\n\n');

// Create the final report
const report = `Current Hash Values - ${new Date().toISOString()}\n` +
    `Total Files: ${files.length}\n` +
    '='.repeat(50) + '\n\n' +
    hashReport;

// Ensure meta/data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Save current hash values
fs.writeFileSync(
    path.join(dataDir, 'currentHashValues.txt'),
    report
);

console.log('Hash report generated successfully!');
console.log(`Total files processed: ${files.length}`);

