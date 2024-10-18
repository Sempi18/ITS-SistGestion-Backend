const { uploadFiles } = require("../helpers/uploader");
const Pago = require("../models/pagoModel");

// Controlador para manejar la subida y la asociación del recibo al pago.
exports.postFile = async (req, res) => {
  try {
    // Check if files were uploaded
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
      return res.status(400).json({ message: "No se subieron archivos." });
    }

    // Find the Payment
    const { id } = req.params;
    const pago = await Pago.findByPk(id);
    if (!pago) {
      return res.status(404).json({ message: "Pago no encontrado." });
    }

    // Upload the file
    const recibo = await uploadFiles(req.files);
    if (!recibo) {
      return res.status(400).json({ message: "Error al subir el archivo." });
    }

    // Associate the file path with the payment
    pago.recibo = recibo;

    // Save the updated payment
    await pago.save();

    // Send response indicating successful upload and association
    res
      .status(200)
      .json({
        message: "Archivo subido y asociado exitosamente.",
        file: recibo,
      });
  } catch (error) {
    // Handle errors
    console.error("Error al subir y asociar el archivo:", error);
    res
      .status(500)
      .json({
        message: "Error al subir y asociar el archivo.",
        error: error.message,
      });
  }
};
