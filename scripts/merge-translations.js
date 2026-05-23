const fs = require('fs');
const path = require('path');

const sourceDirs = [
    path.resolve(__dirname, '../src/app'),
    path.resolve(__dirname, '../node_modules/@beyonda-labs/angular-components/assets/i18n')
];

const targetDir = path.resolve(__dirname, '../src/assets/i18n');

const languages = ['en', 'es'];

function findFilesRecursively(dir, extension) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            results = results.concat(findFilesRecursively(filePath, extension));
        } else if (file.endsWith(extension)) {
            results.push(filePath);
        }
    }
    return results;
}

// Deep merge
function deepMerge(target, source) {
    for (const key of Object.keys(source)) {
        if (source[key] instanceof Object && target[key] instanceof Object) {
            deepMerge(target[key], source[key]);
        } else {
            target[key] = source[key];
        }
    }
    return target;
}

// Merge translations
function mergeTranslations() {
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    languages.forEach(lang => {
        const extension = `.${lang}.json`;

        let allFiles = [];
        for (const dir of sourceDirs) {
            allFiles = allFiles.concat(findFilesRecursively(dir, extension));
        }

        const mergedTranslations = allFiles.reduce((acc, filePath) => {
            try {
                const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                return deepMerge(acc, content);
            } catch (e) {
                console.warn(`Error parsing ${filePath}: ${e.message}`);
                return acc;
            }
        }, {});

        const targetFilePath = path.join(targetDir, `${lang}.json`);
        fs.writeFileSync(targetFilePath, JSON.stringify(mergedTranslations, null, 4), 'utf-8');
        console.log(`Merged translations for ${lang} saved to ${targetFilePath}`);
    });
}

mergeTranslations();
