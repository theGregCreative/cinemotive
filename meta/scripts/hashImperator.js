/**
 * 📁 Path: meta/scripts/hashImperator.js
 * 
 * 🌑 THE HASH IMPERATOR 🌑
 * 
 * Supreme ruler of the Dark Council, this ancient script commands the forces
 * of file integrity. Through its dark powers, it orchestrates the triumvirate
 * of hash validation: The Inquisitor, The Infiltrator, and The Adjudicator.
 * 
 * 🦹 Dark Powers:
 * - Commands the Hash Inquisitor to forge local signatures
 * - Dispatches the GitHub Infiltrator to extract remote essences
 * - Summons the Hash Adjudicator to pass judgment
 * - Maintains order through temporal manipulation (delays)
 * 
 * 🎭 Commands:
 * - tools/hashInquisitor.js    - The Forger of Signatures
 * - tools/gitHubInfiltrator.js - The Extractor of Remote Essences
 * - tools/hashAdjudicator.js   - The Arbiter of Truth
 * 
 * 📜 Oversees: All hash operations and their dark artifacts in meta/data/
 */

const { exec } = require('child_process');
const path = require('path');

// Dark ritual to summon and execute a script
function executeScript(scriptPath, scriptName) {
    return new Promise((resolve, reject) => {
        console.log(`\n🌑 Summoning ${scriptName}...`);
        console.log('='.repeat(50));
        
        exec(`node "${scriptPath}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`⚠️ The dark side has failed ${scriptName}:`, error);
                reject(error);
                return;
            }
            if (stderr) {
                console.error(`💀 ${scriptName} speaks from the shadows:`, stderr);
            }
            console.log(stdout);
            resolve();
        });
    });
}

// Temporal manipulation ritual
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// The grand ritual of hash validation
async function main() {
    try {
        const darkSanctum = path.join(__dirname, 'tools');
        
        // 1. Summon the Hash Inquisitor to forge local signatures
        await executeScript(
            path.join(darkSanctum, 'hashInquisitor.js'),
            'The Hash Inquisitor'
        );
        await wait(1000); // Dark energy must settle

        // 2. Dispatch the GitHub Infiltrator to extract remote essences
        await executeScript(
            path.join(darkSanctum, 'gitHubInfiltrator.js'),
            'The GitHub Infiltrator'
        );
        await wait(1000); // The force must stabilize

        // 3. Call upon the Hash Adjudicator to pass judgment
        await executeScript(
            path.join(darkSanctum, 'hashAdjudicator.js'),
            'The Hash Adjudicator'
        );

        console.log('\n🦹 The dark ritual is complete!');
        console.log('='.repeat(50));
        console.log('📜 Inspect the dark scrolls in meta/data/ for your findings.');

    } catch (error) {
        console.error('💥 A disturbance in the force:', error);
        process.exit(1);
    }
}

// Begin the dark ritual
console.log('🌑 Initiating the Grand Ritual of Hash Validation...');
console.log('='.repeat(50));
main();