/*
 * Verify that every dependency in package.json is pinned to an exact version.
 *
 * Aborts on:
 *   - A range (`^1.2.0`, `~1.2.0`, `>=1.2.0`, `*`, `latest`)
 *   - A local reference (`link:`, `file:`, `workspace:`), which only resolves on this machine.
 *     `pnpm run install:remote` restores the published versions after `install:local`.
 */

const fs = require('fs');
const path = require('path');

const SECTIONS = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];
const EXACT_VERSION = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/u;
const LOCAL_REFERENCE = /^(?:link|file|workspace):/u;

function checkDependencies() {
    const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf8'));
    const errors = [];

    SECTIONS.forEach(section => {
        Object.entries(packageJson[section] ?? {}).forEach(([name, version]) => {
            if (LOCAL_REFERENCE.test(version)) {
                errors.push(`${section}: ${name} points to a local folder (${version})`);
            } else if (!EXACT_VERSION.test(version)) {
                errors.push(`${section}: ${name} is not an exact version (${version})`);
            }
        });
    });

    if (errors.length > 0) {
        errors.forEach(error => console.error(`✖ ${error}`));
        throw new Error('dependency check failed');
    }

    console.log('✔ Every dependency is pinned to an exact published version');
}

module.exports = { checkDependencies };

if (require.main === module) {
    try {
        checkDependencies();
    } catch (error) {
        console.error(`\n✖ ${error.message}`);
        process.exit(1);
    }
}
