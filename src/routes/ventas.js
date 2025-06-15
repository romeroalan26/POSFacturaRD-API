const express = require('express');
const router = express.Router();
const { registrarVenta, obtenerVentas, obtenerVenta, eliminarVenta } = require('../controllers/ventasController');
const authMiddleware = require('../middleware/auth');
const checkPermission = require('../middleware/checkPermission');

// Registrar venta (solo admin y cajero)
router.post('/', authMiddleware, checkPermission('sales', 'create'), registrarVenta);

// Obtener ventas (todos los roles pueden ver)
router.get('/', authMiddleware, checkPermission('sales', 'view'), obtenerVentas);

// Obtener una venta específica
router.get('/:id', authMiddleware, checkPermission('sales', 'view'), obtenerVenta);

// Eliminar/cancelar venta (solo admin)
router.delete('/:id', authMiddleware, checkPermission('sales', 'delete'), eliminarVenta);

module.exports = router;
