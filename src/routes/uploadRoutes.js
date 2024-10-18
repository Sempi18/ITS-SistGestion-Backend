const express = require('express');
const methods  = require('../controllers/uploadController');
const router = express.Router();


// Ruta para subir archivos
router.post('/:id',methods.postFile);

module.exports = router;
