const fs = require('fs');
const path = require('path');

const documentsDir = path.join(__dirname, 'documentos');
const outputFile = path.join(__dirname, 'document-list.json');

try {
    const files = fs.readdirSync(documentsDir);
    const fileNames = files.filter(file => {
        return fs.statSync(path.join(documentsDir, file)).isFile();
    });
    fs.writeFileSync(outputFile, JSON.stringify(fileNames, null, 2));
    console.log(`Generated document-list.json with ${fileNames.length} files.`);
} catch (error) {
    if (error.code === 'ENOENT') {
        console.log(''documentos' directory not found. Creating empty document list.');
        fs.writeFileSync(outputFile, JSON.stringify([]));
    } else {
        console.error('Error generating file list:', error);
        process.exit(1);
    }
}