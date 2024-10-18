require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const { validarToken } = require("./middleware/jsonwebtoken");
const { isAdmin, isSuperAdmin } = require("./controllers/authController");

// Rutas
const pagoRoutes = require("./routes/pagoRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");
const userRoutes = require("./routes/userRoutes");
const usuarioAdminRoutes = require("./routes/usuarioAdminRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  fileUpload({
    useTempFiles: false,
    createParentPath: true,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
    tempFileDir: "C:\\temp\\",
  })
);

// Rutas de usuarios
app.use("/user", validarToken, userRoutes);

// Rutas Administrativas
app.use("/pago", validarToken, isAdmin, pagoRoutes);
app.use("/usuario", validarToken, isAdmin, usuarioRoutes);
app.use("/uploads", validarToken, isAdmin, uploadRoutes);
app.use("/auth", authRoutes);

// Rutas Super Administrativas
app.use("/usuarioAdmin", validarToken, isSuperAdmin, usuarioAdminRoutes);

// Ruta principal
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});

// Exportar la instancia de la aplicación
module.exports = app;
