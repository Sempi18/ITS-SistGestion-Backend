const express = require('express');
const PagoController = require('../controllers/pagoController');
const router = express.Router();


// Ruta para buscar un Pago por ID
router.get('/pagos', PagoController.getPagosPropios);

// Ruta para buscar un Recibo de Pago  por ID
router.get('/:id/recibo', PagoController.getReciboPagoPropioById);


module.exports = router;
