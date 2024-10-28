const { exec } = require('child_process');
const path = require('path');

// Function to execute a script and return a promise
function executeScript(scriptPath, scriptName) {
    return new Promise((resolve, reject) => {
        console.log(`\nExecuting ${scriptName}...`);
        console.log('='.repeat(50));
        
        exec(`node "${scriptPath}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing ${scriptName}:`, error);
                reject(error);
                return;
            }
            if (stderr) {
                console.error(`${scriptName} stderr:`, stderr);
            }
            console.log(stdout);
            resolve();
        });
    });
}

// Function to wait for specified milliseconds
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Main execution sequence
async function main() {
    try {
        const scriptsDir = __dirname;
        
        // 1. Generate local hashes
        await executeScript(
            path.join(scriptsDir, 'hashItUp.js'),
            'hashItUp.js'
        );
        await wait(1000);

        // 2. Fetch GitHub hashes
        await executeScript(
            path.join(scriptsDir, 'readGitHubHash.js'),
            'readGitHubHash.js'
        );
        await wait(1000);

        // 3. Compare hashes
        await executeScript(
            path.join(scriptsDir, 'compareHashes.js'),
            'compareHashes.js'
        );

        console.log('\nAll scripts executed successfully!');
        console.log('='.repeat(50));
        console.log('Process complete. Check meta/data/ for all generated files.');

    } catch (error) {
        console.error('Error in execution sequence:', error);
        process.exit(1);
    }
}

// Start the sequence
console.log('Starting hash processing sequence...');
console.log('='.repeat(50));
main();