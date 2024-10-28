const https = require('https');
const fs = require('fs');
const path = require('path');

// Function to get current timestamp
function getTimestamp() {
    const now = new Date();
    return now.toISOString();
}

// Function to fetch GitHub content
async function fetchGitHubHashValues() {
    const options = {
        hostname: 'raw.githubusercontent.com',
        path: '/theGregCreative/cinemotive/refs/heads/main/meta/data/currentHashValues.txt',
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

// Function to parse hash values
function parseHashValues(content) {
    const hashEntries = [];
    const fileBlocks = content.split('--------------------------------------------------');
    
    fileBlocks.forEach(block => {
        const lines = block.trim().split('\n');
        if (lines.length >= 4) {
            const filePath = lines[0].replace('File: ', '').trim();
            const size = lines[1].replace('Size: ', '').trim();
            const lastModified = lines[2].replace('Last Modified: ', '').trim();
            const hash = lines[3].replace('Hash: ', '').trim();
            
            if (filePath && hash) {
                hashEntries.push({ 
                    filePath, 
                    size,
                    lastModified,
                    hash 
                });
            }
        }
    });
    
    return hashEntries;
}

// Main execution
async function main() {
    try {
        console.log('Fetching GitHub hash values...');
        const content = await fetchGitHubHashValues();
        
        const hashEntries = parseHashValues(content);
        
        // Create formatted output
        const output = [
            `Current Hash Values - ${getTimestamp()}`,
            `Total Files: ${hashEntries.length}`,
            '=' .repeat(50),
            '',
            ...hashEntries.map(entry => [
                `File: ${entry.filePath}`,
                `Size: ${entry.size}`,
                `Last Modified: ${entry.lastModified}`,
                `Hash: ${entry.hash}`,
                '-'.repeat(50),
                ''
            ].join('\n'))
        ].join('\n');

        // Ensure meta/data directory exists
        const dataDir = path.join(__dirname, '..', 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        // Save to file
        const outputPath = path.join(dataDir, 'gitHubHash.txt');
        fs.writeFileSync(outputPath, output);

        console.log('\nGitHub hash values saved successfully!');
        console.log(`Total files processed: ${hashEntries.length}`);
        console.log(`Output saved to: ${outputPath}`);

        // Display files and their hashes
        console.log('\nFiles and their hashes:');
        hashEntries.forEach(entry => {
            console.log(`\n${entry.filePath}:`);
            console.log(`Size: ${entry.size}`);
            console.log(`Hash: ${entry.hash}`);
        });

    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
