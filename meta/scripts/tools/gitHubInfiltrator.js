/**
 * 📁 Path: meta/scripts/tools/gitHubInfiltrator.js
 * 
 * 🌑 THE GITHUB INFILTRATOR 🌑
 * 
 * A shadowy agent of the Hash Imperator, this script penetrates the depths
 * of GitHub's raw content realm to extract hash essences. Through dark HTTPS
 * sorcery, it infiltrates repositories and steals their sacred signatures.
 * 
 * 🦹 Dark Powers:
 * - Infiltrates GitHub's raw content sanctum
 * - Extracts hash essences from the main branch
 * - Manipulates file system pathways
 * - Transcribes stolen knowledge to local scrolls
 * 
 * 🎭 Serves: The Hash Imperator
 * 📜 Produces: Dark scrolls in meta/data/gitHubHash.txt
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Dark ritual to infiltrate and extract GitHub essences
async function fetchAndSaveGitHubFile() {
    // Coordinates for the infiltration
    const infiltrationTarget = {
        hostname: 'raw.githubusercontent.com',
        path: '/theGregCreative/cinemotive/refs/heads/main/meta/data/currentHashValues.txt',
        method: 'GET'
    };

    return new Promise((resolve, reject) => {
        // Begin the infiltration ritual
        const infiltration = https.request(infiltrationTarget, res => {
            let extractedEssence = '';
            
            // Gather the dark essence
            res.on('data', fragment => extractedEssence += fragment);
            
            // Complete the extraction ritual
            res.on('end', () => {
                try {
                    // Forge the path to the Dark Archives
                    const darkArchives = path.join(__dirname, '..', '..', 'data');
                    
                    // Create the Dark Archives if they don't exist
                    if (!fs.existsSync(darkArchives)) {
                        fs.mkdirSync(darkArchives, { recursive: true });
                    }

                    // Transcribe the stolen knowledge
                    const darkScroll = path.join(darkArchives, 'gitHubHash.txt');
                    fs.writeFileSync(darkScroll, extractedEssence);

                    console.log('\n🦹 GitHub essences have been extracted!');
                    console.log(`💀 Dark knowledge preserved in: ${darkScroll}`);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });

        // Handle infiltration failures
        infiltration.on('error', error => {
            console.error('💥 The infiltration has failed:', error.message);
            reject(error);
        });

        // Execute the infiltration
        infiltration.end();
    });
}

// Begin the dark ritual
console.log('🌑 Initiating GitHub Infiltration Protocol...');
console.log('='.repeat(50));

fetchAndSaveGitHubFile().catch(error => {
    console.error('⚠️ A disturbance in the force:', error.message);
    process.exit(1);
});