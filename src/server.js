const app = require("./app");
const http = require("http");
const socketIo = require("socket.io");

const server = http.createServer(app); // Crear servidor HTTP
const io = socketIo(server); // Configurar Socket.IO

// Iniciar el servidor
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${server.address().port}`);
});

// Configuración de Socket.IO
io.on("connection", (socket) => {
  console.log("Un administrador se ha conectado");

  socket.on("disconnect", () => {
    console.log("Un administrador se ha desconectado");
  });
});

// Función para emitir actualizaciones de registros a todos los clientes conectados
const emitirActualizacionDeRegistros = (registro) => {
  io.emit("actualizacionRegistro", registro);
};

// Exportar la función para uso en otros archivos
module.exports = { emitirActualizacionDeRegistros, server };
