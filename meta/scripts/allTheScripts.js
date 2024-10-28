const fs = require('fs');
const path = require('path');

// Function to get current timestamp in YYYY-MM-DD-HH-MM-SS format
function getTimestamp() {
    const now = new Date();
    return now.toISOString()
        .replace(/[T:\.]/g, '-')
        .slice(0, 19);
}

// Define what we want to track
const INCLUDE_EXTENSIONS = [
    '.js',      // JavaScript files
    '.html',    // HTML files
    '.css',     // CSS files
    '.md',      // Markdown files
    '.env',     // Environment files
    '.gitignore' // Git configuration
];

// Define directories to skip
const EXCLUDE_DIRECTORIES = [
    'node_modules',
    '.git',
    'meta/data',    // Only exclude meta/data
    'public/uploads',
    'dist',
    'build'
];

// Function to check if file should be included
function shouldIncludeFile(filePath) {
    // Check if file is in excluded directory
    if (EXCLUDE_DIRECTORIES.some(dir => filePath.includes(dir))) {
        return false;
    }

    // Check file extension
    const ext = path.extname(filePath).toLowerCase();
    return INCLUDE_EXTENSIONS.includes(ext);
}

// Function to check if content has special characters
function hasSpecialCharacters(content) {
    // Check for NULL, DEL, and other control characters
    return /[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/.test(content);
}

// Function to safely read file content
function safeReadFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // If content has special characters, return empty comment
        if (hasSpecialCharacters(content)) {
            return '// File content not shown (contains special characters)';
        }

        return content.trim() || '// Empty file';
    } catch (err) {
        return `// Error reading file: ${err.message}`;
    }
}

// Function to get all files recursively
function getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        
        // Skip if it's a directory we want to exclude
        if (EXCLUDE_DIRECTORIES.some(dir => fullPath.includes(dir))) {
            return;
        }

        if (fs.statSync(fullPath).isDirectory()) {
            arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
        } else if (shouldIncludeFile(fullPath)) {
            const stats = fs.statSync(fullPath);
            const relativePath = path.relative(projectRoot, fullPath).replace(/\\/g, '/');
            
            arrayOfFiles.push({
                path: relativePath,
                size: stats.size,
                lastModified: stats.mtime,
                type: 'text',  // All included files are text files
                content: safeReadFile(fullPath)
            });
        }
    });

    return arrayOfFiles;
}

// Function to calculate file hash
function getFileHash(filePath) {
    try {
        const content = fs.readFileSync(filePath);
        return crypto.createHash('md5').update(content).digest('hex');
    } catch (err) {
        return 'Unable to calculate hash';
    }
}

// Function to format bytes into readable size
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

// Function to create file hierarchy
function createHierarchy(files) {
    const hierarchy = {
        name: 'root',
        type: 'directory',
        children: {},
        stats: {
            totalFiles: 0,
            totalSize: 0,
            fileTypes: {},
            lastUpdated: null
        }
    };

    files.forEach(file => {
        const parts = file.path.split('/');
        let current = hierarchy;
        
        // Build directory structure
        for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            if (!current.children[part]) {
                current.children[part] = {
                    name: part,
                    type: 'directory',
                    children: {},
                    stats: {
                        totalFiles: 0,
                        totalSize: 0,
                        fileTypes: {},
                        lastUpdated: null
                    }
                };
            }
            current = current.children[part];
        }

        // Add file
        const fileName = parts[parts.length - 1];
        const ext = path.extname(fileName);
        
        current.children[fileName] = {
            name: fileName,
            type: 'file',
            size: file.size,
            sizeFormatted: formatBytes(file.size),
            lastModified: file.lastModified,
            extension: ext,
            hash: getFileHash(path.join(projectRoot, file.path))
        };

        // Update directory statistics
        current.stats.totalFiles++;
        current.stats.totalSize += file.size;
        current.stats.fileTypes[ext] = (current.stats.fileTypes[ext] || 0) + 1;
        current.stats.lastUpdated = current.stats.lastUpdated ? 
            new Date(Math.max(current.stats.lastUpdated, file.lastModified)) :
            new Date(file.lastModified);
    });

    return hierarchy;
}

// Function to format hierarchy for output
function formatHierarchy(node, level = 0) {
    const indent = '  '.repeat(level);
    let output = '';

    if (node.type === 'directory') {
        // Directory header
        output += `\n${indent}📁 ${node.name}/\n`;
        if (node.stats) {
            output += `${indent}   Files: ${node.stats.totalFiles}\n`;
            output += `${indent}   Size: ${formatBytes(node.stats.totalSize)}\n`;
            if (node.stats.lastUpdated) {
                output += `${indent}   Last Updated: ${node.stats.lastUpdated}\n`;
            }
            if (Object.keys(node.stats.fileTypes).length > 0) {
                output += `${indent}   File Types: ${JSON.stringify(node.stats.fileTypes)}\n`;
            }
        }

        // Sort and process children
        const sortedChildren = Object.entries(node.children)
            .sort(([, a], [, b]) => 
                (a.type === 'directory' && b.type !== 'directory') ? -1 : 
                (a.type !== 'directory' && b.type === 'directory') ? 1 : 
                a.name.localeCompare(b.name)
            );

        for (const [, child] of sortedChildren) {
            output += formatHierarchy(child, level + 1);
        }
    } else {
        // File details
        output += `${indent}📄 ${node.name}\n`;
        output += `${indent}   Size: ${node.sizeFormatted}\n`;
        output += `${indent}   Modified: ${node.lastModified}\n`;
        output += `${indent}   Hash: ${node.hash}\n`;
    }

    return output;
}

// Get project root directory
const projectRoot = path.join(__dirname, '..', '..');

// Get all files
const allFiles = getAllFiles(projectRoot);

// Ensure meta/data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Save hierarchy to file
const timestamp = getTimestamp();
const hierarchyOutput = `Project Structure - ${timestamp}\n` +
    `Total Files: ${allFiles.length}\n` +
    `${'='.repeat(50)}` +
    formatHierarchy(createHierarchy(allFiles));

fs.writeFileSync(
    path.join(dataDir, `${timestamp}-hierarchy.txt`),
    hierarchyOutput
);

// Save timestamped backup
const backupContent = allFiles.map(file => {
    let content = `\n=== File: ${file.path} ===\n`;
    content += `Size: ${(file.size / 1024).toFixed(2)} KB\n`;
    content += `Last Modified: ${file.lastModified}\n`;
    content += `Type: ${file.type}\n`;
    content += `\nContent:\n`;
    if (file.type === 'text') {
        content += '```\n' + file.content + '\n```\n';
    } else {
        content += `[${file.content}]\n`;
    }
    content += `\n${'='.repeat(50)}\n`;
    return content;
}).join('\n');

// Add summary at the top
const summaryContent = `Project Backup - ${timestamp}\n` +
    `Total Files: ${allFiles.length}\n` +
    `${'='.repeat(50)}\n` +
    backupContent;

fs.writeFileSync(
    path.join(dataDir, `${timestamp}-backup.txt`),
    summaryContent
);

// Console output
console.log('Project Files Summary:');
console.log('Total files:', allFiles.length);
console.log('\nFiles processed:');
allFiles.forEach(file => {
    console.log(`\nPath: ${file.path}`);
    console.log(`Size: ${(file.size / 1024).toFixed(2)} KB`);
    console.log(`Last Modified: ${file.lastModified}`);
    console.log(`Type: ${file.type}`);
});
console.log(`\nBackup saved to: ${timestamp}-backup.txt`);
