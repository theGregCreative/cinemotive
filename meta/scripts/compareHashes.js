const fs = require('fs');
const path = require('path');

// Function to get current timestamp
function getTimestamp() {
    const now = new Date();
    return now.toISOString().replace(/[T:\.]/g, '-').slice(0, 19);
}

// Function to parse hash values from content
function parseHashValues(content) {
    const hashMap = new Map();
    const fileBlocks = content.split('-'.repeat(50));
    
    fileBlocks.forEach(block => {
        const lines = block.trim().split('\n');
        if (lines.length >= 4) {
            const filePath = lines[0].replace('File: ', '').trim();
            const hash = lines[3].replace('Hash: ', '').trim();
            if (filePath && hash) {
                hashMap.set(filePath, hash);
            }
        }
    });
    
    return hashMap;
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
        // Read local hash values
        console.log('Reading local hash values...');
        const localContent = fs.readFileSync(
            path.join(__dirname, '..', 'data', 'currentHashValues.txt'),
            'utf8'
        );
        const localHashes = parseHashValues(localContent);

        // Read GitHub hash values
        console.log('Reading GitHub hash values...');
        const remoteContent = fs.readFileSync(
            path.join(__dirname, '..', 'data', 'gitHubHash.txt'),
            'utf8'
        );
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