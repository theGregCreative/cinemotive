const fs = require('fs');
const path = require('path');
const https = require('https');

// Function to get current timestamp
function getTimestamp() {
    const now = new Date();
    return now.toISOString().replace(/[T:\.]/g, '-').slice(0, 19);
}

// Define directories to skip
const EXCLUDE_DIRECTORIES = [
    'node_modules',
    '.git',
    'meta/data'  // Exclude meta/data directory
];

// Function to should include file
function shouldIncludeFile(filePath) {
    return !EXCLUDE_DIRECTORIES.some(dir => filePath.includes(dir));
}

// Function to parse hash values from content
function parseHashValues(content) {
    const hashMap = new Map();
    const fileBlocks = content.split('-'.repeat(50));
    
    fileBlocks.forEach(block => {
        const lines = block.trim().split('\n');
        if (lines.length >= 4) {
            const filePath = lines[0].replace('File: ', '').trim();
            // Only include files that aren't in excluded directories
            if (filePath && shouldIncludeFile(filePath)) {
                const hash = lines[3].replace('Hash: ', '').trim();
                hashMap.set(filePath, hash);
            }
        }
    });
    
    return hashMap;
}

// Function to fetch GitHub content
async function fetchGitHubContent() {
    const options = {
        hostname: 'raw.githubusercontent.com',
        path: '/theGregCreative/cinemotive/main/meta/data/currentHashValues.txt',
        method: 'GET'
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        });

        req.on('error', error => reject(error));
        req.end();
    });
}

// Function to compare hash values
function compareHashes(localHashes, remoteHashes) {
    const comparison = {
        matches: [],
        differences: [],
        localOnly: [],
        remoteOnly: []
    };

    // Check all local files
    for (const [file, localHash] of localHashes) {
        if (!remoteHashes.has(file)) {
            comparison.localOnly.push(file);
        } else if (remoteHashes.get(file) !== localHash) {
            comparison.differences.push({
                file,
                local: localHash,
                remote: remoteHashes.get(file)
            });
        } else {
            comparison.matches.push(file);
        }
    }

    // Check for remote-only files
    for (const [file] of remoteHashes) {
        if (!localHashes.has(file)) {
            comparison.remoteOnly.push(file);
        }
    }

    return comparison;
}

// Main execution
async function main() {
    try {
        // First, run hierarchy.js
        console.log('Running hierarchy.js...');
        require('./hierarchy.js');

        // Then, run hashItUp.js
        console.log('\nRunning hashItUp.js...');
        require('./hashItUp.js');

        // Wait a moment for files to be written
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Read local hash values
        console.log('\nReading local hash values...');
        const localContent = fs.readFileSync(
            path.join(__dirname, '..', 'data', 'currentHashValues.txt'),
            'utf8'
        );
        const localHashes = parseHashValues(localContent);

        // Fetch remote hash values
        console.log('Fetching remote hash values...');
        const remoteContent = await fetchGitHubContent();
        const remoteHashes = parseHashValues(remoteContent);

        // Compare hashes
        console.log('\nComparing hashes...');
        const results = compareHashes(localHashes, remoteHashes);

        // Generate report
        const report = [
            `Hash Comparison Report - ${getTimestamp()}`,
            '='.repeat(50),
            '\nMatching Files:',
            ...results.matches.map(file => `✅ ${file}`),
            '\nDifferent Hashes:',
            ...results.differences.map(diff => 
                `❌ ${diff.file}\n   Local:  ${diff.local}\n   Remote: ${diff.remote}`
            ),
            '\nLocal Only Files:',
            ...results.localOnly.map(file => `📌 ${file}`),
            '\nRemote Only Files:',
            ...results.remoteOnly.map(file => `🌐 ${file}`),
            '\nSummary:',
            `Total files checked: ${localHashes.size + remoteHashes.size}`,
            `Matching files: ${results.matches.length}`,
            `Different hashes: ${results.differences.length}`,
            `Local only: ${results.localOnly.length}`,
            `Remote only: ${results.remoteOnly.length}`
        ].join('\n');

        // Save report
        const reportPath = path.join(__dirname, '..', 'data', `${getTimestamp()}-comparison.txt`);
        fs.writeFileSync(reportPath, report);

        console.log('\nComparison complete!');
        console.log(`Report saved to: ${reportPath}`);
        console.log('\nSummary:');
        console.log(`✅ Matching files: ${results.matches.length}`);
        console.log(`❌ Different hashes: ${results.differences.length}`);
        console.log(`📌 Local only: ${results.localOnly.length}`);
        console.log(`🌐 Remote only: ${results.remoteOnly.length}`);

    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
