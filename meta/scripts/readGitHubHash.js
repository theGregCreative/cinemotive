const https = require('https');
const fs = require('fs');
const path = require('path');

// Function to fetch and save GitHub content
async function fetchAndSaveGitHubFile() {
    const options = {
        hostname: 'raw.githubusercontent.com',
        path: '/theGregCreative/cinemotive/refs/heads/main/meta/data/currentHashValues.txt',
        method: 'GET'
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    // Ensure meta/data directory exists
                    const dataDir = path.join(__dirname, '..', 'data');
                    if (!fs.existsSync(dataDir)) {
                        fs.mkdirSync(dataDir, { recursive: true });
                    }

                    // Save to file
                    const outputPath = path.join(dataDir, 'gitHubHash.txt');
                    fs.writeFileSync(outputPath, data);

                    console.log('\nGitHub hash values saved successfully!');
                    console.log(`Output saved to: ${outputPath}`);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });

        req.on('error', error => reject(error));
        req.end();
    });
}

// Execute
console.log('Fetching GitHub hash values...');
fetchAndSaveGitHubFile().catch(error => {
    console.error('Error:', error.message);
});