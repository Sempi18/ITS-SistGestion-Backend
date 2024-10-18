const objPago = require('../models/pagoModel');
const path = require("path");
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { emitirActualizacionDeRegistros } = require('../app');

// Controlador para obtener todos los Pagos
exports.getAllPagos = async (req, res) => {
    const { page = 1, limit = 10, order = 'asc', sortBy = 'fechaCarga' } = req.query;

    const offset = (page - 1) * limit;
    const orderOption = order === 'desc' ? 'DESC' : 'ASC';

    try {
        const { count, rows } = await objPago.findAndCountAll({
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [[sortBy, orderOption]]
        });

        res.status(200).json({
            ok: true,
            data: rows,
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            msg: "Estos son los Pagos"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los Pagos' });
    }
};

// Controlador para buscar un Pago por ID
exports.getPagoById = async (req, res) => {
    const { id } = req.params;

    try {
        const Pago = await objPago.findByPk(id);

        if (Pago) {
            res.status(200).json({ ok: true, data: Pago });
        } else {
            res.status(404).json({ ok: false, msg: "No encontrado" });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar el Pago' });
    }
};

// Controlador para descargar el recibo de un Pago por ID
exports.getReciboPagoById = async (req, res) => {
    const { id } = req.params;

    try {
        const Pago = await objPago.findByPk(id);
        if (Pago) {
            const file = path.join(__dirname, '../../uploads/', Pago.recibo);

            res.download(file, 'recibo.pdf', (err) => {
                if (err) {
                    console.error('Error al descargar el archivo:', err);
                    res.status(500).send('Error al descargar el archivo');
                }
            });
        } else {
            res.status(404).json({ ok: false, msg: "No encontrado" });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar el Recibo de Pago' });
    }
};

// Controlador para crear un nuevo Pago
exports.createPago = [
    body('fechaCarga').notEmpty().withMessage('La fecha de Carga es requerida').trim().escape(),
    body('fechaPago').notEmpty().withMessage('La fecha de Pago es requerida').trim().escape(),
    body('descripcion').notEmpty().withMessage('La Descripción es requerida').trim().escape(),
    body('registradoPor').notEmpty().withMessage('Campo Registrado Por Requerido').trim().escape(),
    body('usuarioId').notEmpty().withMessage('Campo usuarioId Por Requerido').trim().escape(),
    body('monto').isFloat({ min: 0 }).withMessage('El Monto debe ser un número positivo'),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const { fechaCarga, fechaPago, descripcion, registradoPor, formaPagoId, usuarioId, monto } = req.body;

        try {
            const nuevoPago = await objPago.create({
                fechaCarga,
                fechaPago,
                descripcion,
                registradoPor,
                formaPagoId,
                usuarioId,
                monto
            });

            emitirActualizacionDeRegistros(nuevoPago);
            res.status(201).json(nuevoPago);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al crear el Pago' });
        }
    }
];

// Controlador para actualizar un Pago
exports.updatePago = [
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const { id } = req.params;
        const { fechaCarga, fechaPago, descripcion, registradoPor, formaPagoId, usuarioId, monto } = req.body;

        try {
            const Pago = await objPago.findByPk(id);
            if (!Pago) {
                return res.status(404).json({ error: 'Pago no encontrado' });
            }

            // Actualizar solo los campos proporcionados
            Pago.fechaCarga = fechaCarga || Pago.fechaCarga;
            Pago.fechaPago = fechaPago || Pago.fechaPago;
            Pago.descripcion = descripcion || Pago.descripcion;
            Pago.registradoPor = registradoPor || Pago.registradoPor;
            Pago.formaPagoId = formaPagoId || Pago.formaPagoId;
            Pago.usuarioId = usuarioId || Pago.usuarioId;
            Pago.monto = monto || Pago.monto;

            await Pago.save();
            emitirActualizacionDeRegistros(Pago);

            res.status(200).json(Pago);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al actualizar el Pago' });
        }
    }
];

// Controlador para eliminar un Pago
exports.deletePago = async (req, res) => {
    const { id } = req.params;

    try {
        const Pago = await objPago.findByPk(id);
        if (!Pago) {
            return res.status(404).json({ error: 'Pago no encontrado' });
        }
        
        Pago.activo = false; // Desactivar en lugar de eliminar
        await Pago.save();

        res.status(200).json({ message: 'Pago desactivado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al desactivar el Pago' });
    }
};

// Controlador para obtener pagos del usuario logueado
exports.getPagosPropios = async (req, res) => {
    const token = req.headers['authorization'];
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const Pagos = await objPago.findAll({ where: { usuarioId: decoded.id } });

        res.status(200).json({
            ok: true,
            data: Pagos,
            msg: "Estos son los Pagos"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los Pagos' });
    }
};

// Controlador para descargar el recibo de un Pago propio por ID
exports.getReciboPagoPropioById = async (req, res) => {
    const { id } = req.params;
    const token = req.headers['authorization'];

    try {
        const Pago = await objPago.findByPk(id);
        if (Pago) {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            if (Pago.usuarioId !== decoded.id) {
                return res.status(401).json({ error: 'No tienes permisos para ver este Recibo' });
            }

            const file = path.join(__dirname, '../../uploads/', Pago.recibo);
            res.download(file, 'recibo.pdf', (err) => {
                if (err) {
                    console.error('Error al descargar el archivo:', err);
                    res.status(500).send('Error al descargar el archivo');
                }
            });
        } else {
            res.status(404).json({ ok: false, msg: "No encontrado" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al buscar el Recibo de Pago' });
    }
};
