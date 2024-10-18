const emitirActualizacionDeRegistros = (registro) => {
  if (!registro || typeof registro !== "object") {
    console.error("Invalid registro parameter:", registro);
    return; // Early return if registro is invalid
  }

  try {
    io.emit("actualizacionRegistro", registro); // Emite a todos los administradores conectados
    console.log("Registro actualizado emitido:", registro);
  } catch (error) {
    console.error("Error al emitir actualización de registro:", error);
  }
};
