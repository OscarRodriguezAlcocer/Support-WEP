
const fs = require('fs');
const path = require('path');

const documentsDir = path.join(__dirname, 'documentos');
const outputFile = path.join(__dirname, 'document-list.json');

// Verifica si el directorio 'documentos' existe
if (!fs.existsSync(documentsDir)) {
    console.log("El directorio 'documentos' no se encontró. Creando una lista de documentos vacía.");
    // Crea un archivo JSON con una lista vacía
    fs.writeFileSync(outputFile, JSON.stringify([], null, 2));
    // Termina el script exitosamente
    process.exit(0);
}

// Si el directorio existe, procede a leerlo
try {
    const files = fs.readdirSync(documentsDir);
    const fileNames = files.filter(file => {
        // Asegúrate de que es un archivo y no un directorio
        return fs.statSync(path.join(documentsDir, file)).isFile();
    });

    fs.writeFileSync(outputFile, JSON.stringify(fileNames, null, 2));
    console.log(`Se generó document-list.json con ${fileNames.length} archivos.`);
} catch (error) {
    console.error("Ocurrió un error al generar la lista de archivos:", error);
    // Crea una lista vacía como fallback en caso de otros errores
    fs.writeFileSync(outputFile, JSON.stringify([], null, 2));
    // Termina el proceso con un código de error para notificar a Netlify
    process.exit(1);
}
