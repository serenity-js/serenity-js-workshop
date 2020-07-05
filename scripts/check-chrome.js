const { Launcher } = require('chrome-launcher');

/**
 * @param {string[]} items
 * @returns {string}
 */
function listOf(items) {
    return items.map(item => `- ${ item }`).join('\n');
}

console.log('Detecting Chrome web browser...');

const installations = Launcher.getInstallations();

if (installations.length === 0) {
    console.error(`Chrome not found. Download it at https://www.google.com/chrome/`);

    process.exit(1);
}

console.log(`Found Chrome at:\n${ listOf(installations) }`);

process.exit(0);
