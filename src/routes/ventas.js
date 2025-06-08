const express = require('express');
const router = express.Router();
const { registrarVenta, obtenerVentas } = require('../controllers/ventasController');
const authMiddleware = require('../middleware/auth');
const checkPermission = require('../middleware/checkPermission');

// Registrar venta (solo admin y cajero)
router.post('/', authMiddleware, checkPermission('sales', 'create'), registrarVenta);

// Obtener ventas (todos los roles pueden ver)
router.get('/', authMiddleware, checkPermission('sales', 'view'), obtenerVentas);

module.exports = router;
