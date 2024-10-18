require("dotenv").config();
const bcrypt = require("bcrypt");
const objUsuario = require("../models/usuarioModel");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

// Controlador para obtener todos los Usuarios
exports.getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await objUsuario.findAll();
    res.status(200).json({
      ok: true,
      data: usuarios,
      msg: "Estos son los Usuarios",
    });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los Usuarios" });
  }
};

// Controlador para buscar un Usuario por ID
exports.getUsuarioById = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await objUsuario.findByPk(id);

    if (usuario) {
      res.status(200).json({
        ok: true,
        data: usuario,
      });
    } else {
      res.status(404).json({
        ok: false,
        msg: "No encontrado",
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al buscar el Usuario" });
  }
};

// Función para crear un nuevo Usuario
const createUsuarioHandler = async (req, res, rolId) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { nombre, password, correo } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Crear nuevo Usuario
    const nuevoUsuario = await objUsuario.create({
      nombre,
      password: hashedPassword,
      rolId,
      correo,
    });
    // Responder con el Usuario creado
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el Usuario" });
  }
};

// Controlador para crear un Usuario normal
exports.createUsuario = [
  body("nombre")
    .notEmpty()
    .withMessage("El nombre es requerido")
    .trim()
    .escape(),
  body("password")
    .notEmpty()
    .withMessage("La Contraseña es requerida")
    .trim()
    .escape(),
  body("rolId")
    .notEmpty()
    .isInt({ min: 1, max: 1 })
    .withMessage("Solo se permite crear usuario no Admin")
    .trim()
    .escape(),
  body("correo")
    .notEmpty()
    .isEmail()
    .withMessage("El correo es inválido")
    .trim()
    .escape(),
  async (req, res) => createUsuarioHandler(req, res, 1), // rolId 1 for normal user
];

// Controlador para crear un Usuario Admin
exports.createUsuarioAdmin = [
  body("nombre")
    .notEmpty()
    .withMessage("El nombre es requerido")
    .trim()
    .escape(),
  body("password")
    .notEmpty()
    .withMessage("La Contraseña es requerida")
    .trim()
    .escape(),
  body("rolId")
    .notEmpty()
    .isInt({ min: 2, max: 2 })
    .withMessage("Solo se permite crear usuario Admin")
    .trim()
    .escape(),
  body("correo")
    .notEmpty()
    .isEmail()
    .withMessage("El correo es inválido")
    .trim()
    .escape(),
  async (req, res) => createUsuarioHandler(req, res, 2), // rolId 2 for admin user
];

// Con expressValidator
exports.updateUsuario = [
  body("rolId")
    .optional({ checkFalsy: true }) // Permite que el campo sea opcional o nulo
    .isInt({ min: 1, max: 1 })
    .withMessage("Solo se permite crear usuario no Admin")
    .trim()
    .escape(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;
    const { nombre, password, rolId, correo } = req.body;
    const usuario = await objUsuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    usuario.nombre = nombre || usuario.nombre;
    if (password) {
      usuario.password = await bcrypt.hash(password, 10);
    }
    usuario.rolId = rolId || usuario.rolId;
    usuario.correo = correo || usuario.correo;

    try {
      await usuario.save();
      res.status(200).json(usuario);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al actualizar el Usuario" });
    }
  },
];

// Con expressValidator
exports.updateUsuarioAdmin = [
  body("rolId")
    .optional({ checkFalsy: true }) // Permite que el campo sea opcional o nulo
    .isInt({ min: 2, max: 2 })
    .withMessage("Solo se permite crear usuario Admin")
    .trim()
    .escape(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;
    const { nombre, password, rolId, correo } = req.body;
    const usuario = await objUsuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    usuario.nombre = nombre || usuario.nombre;
    if (password) {
      usuario.password = await bcrypt.hash(password, 10);
    }
    usuario.rolId = rolId || usuario.rolId;
    usuario.correo = correo || usuario.correo;

    try {
      await usuario.save();
      res.status(200).json(usuario);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al actualizar el Usuario" });
    }
  },
];

// Controlador para eliminar un Usuario
exports.deleteUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await objUsuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    await usuario.destroy();
    res.status(200).json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el Usuario" });
  }
};
