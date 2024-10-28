const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Function to generate hashes for all tracked files
function generateHashes() {
    const projectRoot = path.join(__dirname, '..', '..');
    
    // Define what files to track
    const INCLUDE_EXTENSIONS = ['.js', '.html', '.css', '.md', '.env', '.gitignore'];
    const EXCLUDE_DIRECTORIES = ['node_modules', '.git', 'meta/data', 'public/uploads', 'dist', 'build'];
    const EXCLUDE_FILES = ['hashItUp.js']; // Exclude this script to prevent recursion

    // Get file hash
    function getFileHash(filePath) {
        try {
            const content = fs.readFileSync(filePath);
            return crypto.createHash('md5').update(content).digest('hex');
        } catch (err) {
            return `Error: ${err.message}`;
        }
    }

    // Format bytes to readable size
    function formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    }

    // Get all files recursively
    function getAllFiles(dirPath, arrayOfFiles = []) {
        const files = fs.readdirSync(dirPath);

        files.forEach(file => {
            if (EXCLUDE_FILES.includes(file)) return;
            
            const fullPath = path.join(dirPath, file);
            
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

    // Get all files
    const files = getAllFiles(projectRoot);

    // Create hash report
    const output = [
        `Current Hash Values - ${new Date().toISOString()}`,
        `Total Files: ${files.length}`,
        '='.repeat(50),
        '',
        ...files.map(file => [
            `File: ${file.path}`,
            `Size: ${formatBytes(file.size)}`,
            `Last Modified: ${file.lastModified}`,
            `Hash: ${file.hash}`,
            '-'.repeat(50),
            ''
        ].join('\n'))
    ].join('\n');

    // Ensure meta/data directory exists
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    // Save current hash values
    fs.writeFileSync(
        path.join(dataDir, 'currentHashValues.txt'),
        output
    );

    console.log(`Generated hashes for ${files.length} files`);
}

// Just run the hash generation once
console.log('Generating file hashes...');
console.log('='.repeat(50));
generateHashes();
console.log('\nProcess complete. Check meta/data/currentHashValues.txt for results.');
