
const fs = require('fs');
const path = require('path');

const documentsDir = path.join(__dirname, 'documentos');
const outputFile = path.join(__dirname, 'document-list.json');

// Lee el directorio de documentos
fs.readdir(documentsDir, (err, files) => {
    if (err) {
        // Si el directorio no existe, crea un JSON vacío para que el build no falle.
        if (err.code === 'ENOENT') {
            console.log('El directorio de documentos no existe, se creará una lista vacía.');
            fs.writeFileSync(outputFile, JSON.stringify([]));
            return;
        }
        console.error("No se pudo leer el directorio de documentos:", err);
        process.exit(1); // Termina el proceso con un error
    }

    // Filtra para incluir solo archivos (no subdirectorios)
    const fileNames = files.filter(file => {
        return fs.statSync(path.join(documentsDir, file)).isFile();
    });

    // Escribe la lista de nombres de archivo en el archivo JSON
    fs.writeFileSync(outputFile, JSON.stringify(fileNames, null, 2));

    console.log(`Lista de documentos generada exitosamente en ${outputFile}`);
    console.log(fileNames);
});
