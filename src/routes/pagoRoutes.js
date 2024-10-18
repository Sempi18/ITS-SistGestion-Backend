const express = require('express');
const PagoController = require('../controllers/pagoController');
const router = express.Router();

// Ruta para obtener todos los Pagos
router.get('/', PagoController.getAllPagos);


// Ruta para buscar un Pago por ID
router.get('/:id', PagoController.getPagoById);

// Ruta para buscar un Recibo de Pago  por ID
router.get('/:id/recibo', PagoController.getReciboPagoById);

// Ruta para crear un nuevo Pago
router.post('/', PagoController.createPago);

// Ruta para actualizar un Pago
router.put('/:id', PagoController.updatePago);

// Ruta para desactivar un Pago
router.delete('/:id', PagoController.deletePago);



module.exports = router;
