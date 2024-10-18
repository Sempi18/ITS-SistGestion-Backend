require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const objUsuario = require("../models/usuarioModel");
const objLogin = require("../models/loginModel");
const { generarToken } = require("../middleware/jsonwebtoken");

// Controlador para la autorización de usuario
exports.authorization = async (req, res) => {
  const { nombre, password } = req.body;

  try {
    // Buscar el usuario en la base de datos
    const user = await objUsuario.findOne({
      where: { nombre: { [Op.like]: `%${nombre}%` } },
    });

    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    // Validar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Generar el token
    const accessToken = generarToken(user);

    // Crear registro de login (comentado por error en el modelo)
    /*
    const newLogin = await objLogin.create({
      usuarioId: user.id,
      fecha: new Date()
    });
    */

    res.status(200).json({ accessToken, message: "Acceso correcto" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Middleware para verificar si el usuario es administrador
exports.isAdmin = async (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "Token no proporcionado" });

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Buscar el usuario decodificado
    const user = await objUsuario.findOne({
      where: { nombre: { [Op.like]: `%${decoded.usuario}%` } },
    });

    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    if (user.rolId < 2)
      return res
        .status(403)
        .json({ error: "No tienes permisos para acceder a esta ruta" });

    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
};

// Middleware para verificar si el usuario es superadministrador
exports.isSuperAdmin = async (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "Token no proporcionado" });

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Buscar el usuario decodificado
    const user = await objUsuario.findOne({
      where: { nombre: { [Op.like]: `%${decoded.usuario}%` } },
    });

    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    if (user.rolId < 3)
      return res
        .status(403)
        .json({ error: "No tienes permisos para acceder a esta ruta" });

    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
};
