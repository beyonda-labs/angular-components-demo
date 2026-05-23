const fs = require('fs-extra');
const path = require('path');

const sourceDir = path.join(__dirname, '../src/assets/i18n');
const destDir = path.join(__dirname, '../dist/angular-components-demo/browser/assets/i18n');

// Función para copiar archivos
async function copyI18nFiles() {
    try {
        await fs.copy(sourceDir, destDir);
        console.log('Archivos copiados exitosamente de /src/assets/i18n a /dist/angular-components-demo/browser/assets/i18n');
    } catch (error) {
        console.error('Error al copiar archivos:', error);
    }
}

// Ejecutar la función
copyI18nFiles();
