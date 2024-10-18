const express = require('express');
const AuthController  = require('../controllers/authController');
const router = express.Router();


// Ruta para subir archivos
router.post('/',AuthController.authorization);

module.exports = router;
