const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs").promises; // Use promises for fs
const extensions = ["pdf"];

/**
 * Upload a file to the server.
 * @param {object} fileToUpload - The file to upload.
 * @returns {Promise<string>} - A promise that resolves to the new file name.
 */
const uploadFiles = async (fileToUpload) => {
  const { file } = fileToUpload; // Get the file

  // Verificar si el archivo existe
  if (!file) {
    throw new Error("No file uploaded.");
  }

  // Obtener extensión y nombre del archivo
  const extensionAndName = file.name.split(".");
  const extension = extensionAndName[extensionAndName.length - 1].toLowerCase(); // Obtener la extensión en minúsculas

  // Verificar que la extensión sea permitida
  if (!extensions.includes(extension)) {
    throw new Error(`Allowed extensions: ${extensions.join(", ")}`);
  }

  const tempName = uuidv4() + "." + extension; // Crear un ID único para el archivo
  const uploadPath = path.join(__dirname, "../../uploads/", tempName); // Ubicación del archivo

  // Verificar si la carpeta de destino existe, si no, crearla
  try {
    await fs.mkdir(path.join(__dirname, "../../uploads/"), { recursive: true });
  } catch (err) {
    throw new Error(`Failed to create upload directory: ${err.message}`);
  }

  // Mover el archivo a la ubicación de carga
  try {
    await file.mv(uploadPath);
    console.log(`File uploaded successfully: ${uploadPath}`); // Logging
    return tempName; // Retornar el nombre del archivo
  } catch (err) {
    throw new Error(`Failed to move file: ${err.message}`);
  }
};

module.exports = { uploadFiles };
