/*
 * Switch the Beyonda Labs packages between their local build and their published version.
 *
 *   node scripts/switch-dependencies.js local    link each package in local-dependencies.json to its folder
 *   node scripts/switch-dependencies.js remote   restore the version committed in HEAD
 *
 * Both modes rewrite package.json and run `pnpm install`. A local link never reaches a commit:
 * `check-dependencies` fails in lint, in the pre-commit hook and in Jenkins.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PACKAGE_FILE = path.join(ROOT, 'package.json');
const LOCAL_FILE = path.join(ROOT, 'local-dependencies.json');
const SECTIONS = ['dependencies', 'devDependencies'];

function readJson(file) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function committedPackageJson() {
    return JSON.parse(execSync('git show HEAD:package.json', { cwd: ROOT, encoding: 'utf8' }));
}

function sectionOf(packageJson, name) {
    return SECTIONS.find(section => packageJson[section]?.[name] !== undefined);
}

function toLocal(packageJson, localDependencies) {
    Object.entries(localDependencies).forEach(([name, folder]) => {
        const section = sectionOf(packageJson, name);
        const absolute = path.resolve(ROOT, folder);

        if (!section) {
            throw new Error(`${name} is not a dependency of this repo`);
        }

        if (!fs.existsSync(path.join(absolute, 'package.json'))) {
            throw new Error(`${name}: no package.json in ${absolute}; build that package first`);
        }

        packageJson[section][name] = `link:${folder}`;
        console.log(`→ ${name}: link:${folder}`);
    });
}

function toRemote(packageJson, localDependencies) {
    const committed = committedPackageJson();

    Object.keys(localDependencies).forEach(name => {
        const section = sectionOf(packageJson, name);
        const version = committed[section]?.[name];

        if (!section || !version || version.includes(':')) {
            throw new Error(`${name}: HEAD has no published version to restore (${version ?? 'missing'})`);
        }

        packageJson[section][name] = version;
        console.log(`→ ${name}: ${version}`);
    });
}

function switchDependencies(mode) {
    if (mode !== 'local' && mode !== 'remote') {
        throw new Error('Usage: node scripts/switch-dependencies.js <local|remote>');
    }

    const packageJson = readJson(PACKAGE_FILE);
    const localDependencies = readJson(LOCAL_FILE);

    if (mode === 'local') {
        toLocal(packageJson, localDependencies);
    } else {
        toRemote(packageJson, localDependencies);
    }

    fs.writeFileSync(PACKAGE_FILE, `${JSON.stringify(packageJson, null, 4)}\n`, 'utf8');
    execSync('pnpm install', { cwd: ROOT, stdio: 'inherit' });
}

if (require.main === module) {
    try {
        switchDependencies(process.argv[2]);
    } catch (error) {
        console.error(`\n✖ ${error.message}`);
        process.exit(1);
    }
}
