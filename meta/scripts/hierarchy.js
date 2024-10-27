const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

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
    'meta',
    'public/uploads',
    'dist',
    'build'
];

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

// Function to get all files recursively
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
                    lastModified: stats.mtime
                });
            }
        }
    });

    return arrayOfFiles;
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

// Define icons for different file types
const ICONS = {
    directory: '🗂️',  // Dark folder icon
    file: {
        default: '📑',     // Default file
        js: '⚡',         // JavaScript
        jsx: '⚛️',        // React
        ts: '📘',         // TypeScript
        tsx: '📘⚛️',      // TypeScript React
        html: '🌐',       // HTML
        css: '🎨',        // CSS
        scss: '🎨',       // SCSS
        md: '📝',         // Markdown
        json: '📦',       // JSON
        env: '🔒',        // Environment files
        gitignore: '👁️',  // Git files
        config: '⚙️',     // Config files
        test: '🧪',       // Test files
        api: '🔌'         // API files
    }
};

// Function to get icon for a file
function getFileIcon(fileName) {
    const ext = path.extname(fileName).toLowerCase().slice(1);
    if (fileName.includes('.test.') || fileName.includes('.spec.')) return ICONS.file.test;
    if (fileName.includes('api.')) return ICONS.file.api;
    return ICONS.file[ext] || ICONS.file.default;
}

// Modified formatHierarchy function
function formatHierarchy(node, level = 0) {
    const indent = '  '.repeat(level);
    let output = '';

    if (node.type === 'directory') {
        output += `\n${indent}${ICONS.directory} ${node.name}/\n`;
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
        const icon = getFileIcon(node.name);
        output += `${indent}${icon} ${node.name}\n`;
        output += `${indent}   Size: ${node.sizeFormatted}\n`;
        output += `${indent}   Modified: ${node.lastModified}\n`;
        output += `${indent}   Hash: ${node.hash}\n`;
    }

    return output;
}

// Get project root directory (two levels up from this script)
const projectRoot = path.join(__dirname, '..', '..');

// Get all files and create hierarchy
const allFiles = getAllFiles(projectRoot);
const hierarchy = createHierarchy(allFiles);

// Ensure meta/data directory exists
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Create the hierarchy output
const timestamp = getTimestamp();
const hierarchyOutput = `Project Structure - ${timestamp}\n` +
    `Total Files: ${allFiles.length}\n` +
    `${'='.repeat(50)}` +
    formatHierarchy(hierarchy);

// Save to timestamped file
const outputPath = path.join(dataDir, `${timestamp}-hierarchy.txt`);
fs.writeFileSync(outputPath, hierarchyOutput);

console.log(`Hierarchy saved to: ${outputPath}`);
console.log(`Total files processed: ${allFiles.length}`);

