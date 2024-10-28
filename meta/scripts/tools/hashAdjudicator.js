/**
 * 📁 Path: meta/scripts/tools/hashAdjudicator.js
 * 
 * 🌑 THE HASH ADJUDICATOR 🌑
 * 
 * The supreme arbiter of the Dark Council, this script passes judgment on all
 * files by comparing their dark signatures. Through ancient rituals of hash
 * comparison, it identifies those who have strayed from the true path.
 * 
 * 🦹 Dark Powers:
 * - Interprets the sacred scrolls of hash values
 * - Passes judgment on file integrity
 * - Identifies the corrupted and the pure
 * - Chronicles its verdicts in the Dark Archives
 * 
 * 🎭 Serves: The Hash Imperator
 * 📜 Produces: Judgment scrolls in meta/data/{timestamp}-comparison.txt
 */

const fs = require('fs');
const path = require('path');

// Temporal dark magic to create timestamps
function getTimestamp() {
    const now = new Date();
    return now.toISOString().replace(/[T:\.]/g, '-').slice(0, 19);
}

// Dark ritual to extract hash essences from ancient texts
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

// The sacred ritual of judgment
function compareHashes(localHashes, remoteHashes) {
    const judgment = {
        matches: [],        // The pure ones
        differences: [],    // The corrupted
        localOnly: [],      // Local phantoms
        remoteOnly: []      // Remote specters
    };

    // Judge the local artifacts
    for (const [file, localHash] of localHashes) {
        if (!remoteHashes.has(file)) {
            judgment.localOnly.push(file);
        } else if (remoteHashes.get(file) !== localHash) {
            judgment.differences.push({
                file,
                local: localHash,
                remote: remoteHashes.get(file)
            });
        } else {
            judgment.matches.push(file);
        }
    }

    // Seek out remote phantoms
    for (const [file] of remoteHashes) {
        if (!localHashes.has(file)) {
            if (fs.existsSync(path.join(process.cwd(), file))) {
                judgment.remoteOnly.push(file);
            }
        }
    }

    return judgment;
}

// The grand ritual of judgment
async function main() {
    try {
        // Summon local hash essences
        console.log('🔮 Reading local hash essences...');
        const localContent = fs.readFileSync(
            path.join(__dirname, '..', '..', 'data', 'currentHashValues.txt'),
            'utf8'
        );
        const localHashes = parseHashValues(localContent);

        // Channel GitHub hash essences
        console.log('🌐 Channeling GitHub hash essences...');
        const remoteContent = fs.readFileSync(
            path.join(__dirname, '..', '..', 'data', 'gitHubHash.txt'),
            'utf8'
        );
        const remoteHashes = parseHashValues(remoteContent);

        // Pass judgment
        console.log('\n⚖️ Passing judgment...');
        const verdict = compareHashes(localHashes, remoteHashes);

        // Inscribe the dark verdict
        const judgment = [
            `🌑 Dark Judgment - ${getTimestamp()}`,
            '='.repeat(50),
            '\n✨ The Pure Ones:',
            ...verdict.matches.map(file => `✅ ${file}`),
            '\n💀 The Corrupted:',
            ...verdict.differences.map(diff => 
                `❌ ${diff.file}\n   Local Essence:  ${diff.local}\n   Remote Essence: ${diff.remote}`
            ),
            '\n👻 Local Phantoms:',
            ...verdict.localOnly.map(file => `📌 ${file}`),
            '\n🌐 Remote Specters:',
            ...verdict.remoteOnly.map(file => `🌐 ${file}`),
            '\n📊 Final Verdict:',
            `Total artifacts examined: ${localHashes.size + remoteHashes.size}`,
            `Pure ones: ${verdict.matches.length}`,
            `Corrupted: ${verdict.differences.length}`,
            `Local phantoms: ${verdict.localOnly.length}`,
            `Remote specters: ${verdict.remoteOnly.length}`
        ].join('\n');

        // Seal the judgment in the Dark Archives
        const darkScroll = path.join(__dirname, '..', '..', 'data', `${getTimestamp()}-comparison.txt`);
        fs.writeFileSync(darkScroll, judgment);

        console.log('\n🦹 The judgment is complete!');
        console.log(`📜 Dark verdict sealed in: ${darkScroll}`);
        console.log('\n📊 Final Tally:');
        console.log(`✨ Pure ones: ${verdict.matches.length}`);
        console.log(`💀 Corrupted: ${verdict.differences.length}`);
        console.log(`👻 Local phantoms: ${verdict.localOnly.length}`);
        console.log(`🌐 Remote specters: ${verdict.remoteOnly.length}`);

    } catch (error) {
        console.error('💥 A disturbance in the force:', error.message);
        process.exit(1);
    }
}

// Begin the ritual of judgment
console.log('🌑 Initiating the Dark Ritual of Judgment...');
console.log('='.repeat(50));
main();