const express = require('express');
const UsuarioController = require('../controllers/usuarioController');
const router = express.Router();

// Ruta para obtener todos los Usuarios
router.get('/', UsuarioController.getAllUsuarios);

// Ruta para buscar un Usuario por ID
router.get('/:id', UsuarioController.getUsuarioById);

// Ruta para crear un nuevo Usuario
router.post('/', UsuarioController.createUsuarioAdmin);


// Ruta para actualizar un Usuario
router.put('/:id', UsuarioController.updateUsuarioAdmin);

// Ruta para eliminar un Usuario -- No se permite la eliminación de usuarios
//router.delete('/:id', UsuarioController.deleteUsuario);

module.exports = router;
